const moment = require('moment')
const _ = require('lodash')
const { Types } = require('mongoose')
const Razorpay = require('razorpay')
const crypto = require('crypto')
require('dotenv').config()

const orderDatailsModel = require('../models/order');
const { generateNumber } = require('../utils/utils')
const response = require('../constant/response');
const cartModel = require('../models/cart')
const productModel = require('../models/product')
const paymentModel = require('../models/payment')


exports.add = async(req, res) => {
    try{
        const findCart = await cartModel.findById(req.body.cart_id)
        const cartProduct = findCart.product
        const productArr = [];
        const productToOrderObj = [];
            for(let i = 0; i < cartProduct.length; i++){
                const productDetails = await productModel.aggregate([
                    { $unwind: "$variants" },
                    {
                      $match: {
                        "variants._id": new Types.ObjectId(cartProduct[i].variant_id),
                    },
                },
                { $lookup: { from: 'colors', localField: 'variants.color_id', foreignField: '_id', as: 'colorInfo' } },
                { $lookup: { from: 'sizes', localField: 'variants.size_id', foreignField: '_id', as: 'sizeInfo' } },
                  ]);
                  
                
                  if (
                    !productDetails[0] ||
                    productDetails[0].status === false ||  
                    productDetails[0].variants.status === false ||
                    productDetails[0].variants.stock <= 0
                  ) {
                    productArr.push({
                              product_id: productDetails[0]._id,
                              variant_id: productDetails[0].variants._id,
                              productName: productDetails[0].name,
                              size: productDetails[0].sizeInfo[0].size_code,
                              qty: 'Out of Stock',
                              price:  productDetails[0].variants.selling_price,
                          
                          })
                    }else{
                    productArr.push({
                            product_id: productDetails[0]._id,
                            variant_id: productDetails[0].variants._id,
                            productName: productDetails[0].name,
                            size: productDetails[0].sizeInfo[0].size_code,
                            qty: cartProduct[i].qty,
                            price:  cartProduct[i].amount,
                        
                        })
                    }   
            }

        const orderNo = generateNumber(11)
        const separateONumbers = orderNo.match(/.{1,4}/g).join('-');
        const deliveryDate = moment().add(6, 'd');
        const productToOrder = _.filter( productArr, (product) => product.qty !== 'Out of Stock')
        
        req.body.order_no = separateONumbers;
        req.body.delivery_date = deliveryDate;
        req.body.product = productToOrder;
        req.body.total_price = _.sumBy(productToOrder, 'price')
        req.body.quantity = productToOrder.length 
        req.body.discount = Number(req.body.discount)
    
        let discountAmt = ''
       if(req.body.discount){
        const discount = Number(req.body.total_price) * (Number(req.body.discount)/100);
        discountAmt = Number(req.body.total_price) - discount;
        req.body.final_price = discountAmt
       }else{
          req.body.final_price = req.body.total_price;
       }
      
        await orderDatailsModel.create(req.body)
        .then(async(orderData) => {
            if(orderData){
                // decerement stock quantity in product table
                let responseObj = {};
                const product = orderData.product
                for(let k = 0 ; k< product.length ; k++){
                    const decProductQty = await productModel.findOneAndUpdate(
                    { '_id': product[k].product_id, 'variants._id': product[k].variant_id },
                    { $inc: {"variants.$.stock" : -1} },
                    {new: true}
                    )
                    if(!decProductQty){
                        return response(res, false, 422, 'Error, Product Qantity not updated!')
                    }
                }

                // initializing razorpay
                const razorpay = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET
                })


                const createRazorPayOrder = await razorpay.orders.create({
                    amount: orderData.final_price * 100,
                    currency: 'INR',
                    receipt: orderData._id,
                    payment_capture: 1
                })

                if(!createRazorPayOrder){
                    return response(res, false, 400, 'Order not Created!')
                }

                const addPayment = await paymentModel.create({
                    razorpay_order_id: createRazorPayOrder.id,
                    razorpay_payment_id: createRazorPayOrder.receipt,
                    // reason: String,
                    total_amount: orderData.total_price,
                    payment_status: createRazorPayOrder.status,
                    discount_percentage: orderData.discount,
                    discount_amount: discountAmt,
                    grand_total: createRazorPayOrder.amount,
                    currency: createRazorPayOrder.currency,
                    // wallet: String,
                    // payment_type: String,
                    // is_amount_refunded: '',
                })

                if(!addPayment){
                    return response(res, false, 400, 'Error, Payment not added')
                }

                responseObj = {
                    razorpay_order_id: createRazorPayOrder.id,
                    razorpay_payment_id: createRazorPayOrder.receipt,
                    customer_id: orderData.user_id,
                    amount: createRazorPayOrder.amount,
                    currency: createRazorPayOrder.currency,
                    payment_status: createRazorPayOrder.status
                }
                return response(res, true, 201, 'Order added successfully.', responseObj)
            }
        })
        .catch((err) => {
            console.log(err, ' ---- error log 96 -----');
            return response(res, false, 422, 'error, Order not added!')
        })
    }catch(error){
        console.log(error , ' --- error 76 ----');
        return response(res, false, 500, 'Something went Wrong!')
    }
   
}

exports.addOrder = async(req, res) => {
    try {
        const findCart = await cartModel.findById(req.body.cart_id);
        const cartProduct = findCart.product
        console.log(cartProduct, ' ----- cartProduct log 164 ----');
        let pdtObj = {};
        let productArr = [];
        const productObj = {};
            for(let i = 0; i < cartProduct.length; i++){
                const productDetails = await productModel.aggregate([
                    { $unwind: "$variants" },
                    {
                      $match: {
                        "variants._id": new Types.ObjectId(cartProduct[i].variant_id),
                    },
                },
                { $lookup: { from: 'colors', localField: 'variants.color_id', foreignField: '_id', as: 'colorInfo' } },
                { $lookup: { from: 'sizes', localField: 'variants.size_id', foreignField: '_id', as: 'sizeInfo' } },
                  ]);
                  if (
                    !productDetails[0] ||
                    productDetails[0].status === false ||  
                    productDetails[0].variants.status === false ||
                    productDetails[0].variants.stock <= 0
                  ) {
                        pdtObj = {
                              product_id: productDetails[0]._id,
                              variant_id: productDetails[0].variants._id,
                              productName: productDetails[0].name,
                              size: productDetails[0].sizeInfo[0].size_code,
                              qty: 'Out of Stock',
                              price:  productDetails[0].variants.selling_price,
                              discount: cartProduct[i].discount,
                          }
                    }else{
                        pdtObj = {
                            product_id: cartProduct[i].product_id,
                            variant_id: cartProduct[i].variant_id,
                            productName: productDetails[0].name,
                            size: productDetails[0].sizeInfo[0].size_code,
                            qty: cartProduct[i].qty,
                            price:  cartProduct[i].amount,
                            discount: cartProduct[i].discount,
                        }
                    }   
                       
        const orderNo = generateNumber(11)
        // const separateONumbers = orderNo.match(/.{1,4}/g).join('-');
        const deliveryDate = moment().add(6, 'd');
        // const productToOrder = _.filter( productArr, (product) => product.qty !== 'Out of Stock')
       
       
        if(pdtObj.qty !== 'Out of Stock'){
            // productObj.order_no = orderNo.match(/.{1,4}/g).join('-');
            // productObj.delivery_date = deliveryDate;
            // productObj.product = pdtObj;
            // productObj.quantity = 1; 
            // productObj.discount_price = Number((productDetails[0].variants.base_price * pdtObj.discount)/100);
            // productObj.address = req.body.address;
            // productObj.total_price = Number(pdtObj.price -  productObj.discount_price);

            // const addOrder = await orderDatailsModel.create(productObj);
            // if(!addOrder){
            //     return response(res, false, 422, 'Order not added!')
            // }
            const dsicountAmount = Number((productDetails[0].variants.base_price * pdtObj.discount)/100);
            productArr.push({
                order_no : orderNo.match(/.{1,4}/g).join('-'),
                delivery_date: deliveryDate,
                product: pdtObj,
                quantity: 1,
                discount_price: dsicountAmount,
                address: req.body.address,
                total_price: Number(pdtObj.price -  dsicountAmount)
            })
        }else{
            productObj.product = pdtObj;
            productObj.quantity = 'Out of Stock'; 
        }
       
    }
    console.log(productArr, ' ---- product arr log 246 ----');
     const addOrder = await orderDatailsModel.insertMany(productArr);
     if(!addOrder){
        return response(res, false, 422, 'Error, Order not added.')
     }else{
        
        return response(res, true, 201, 'Order added successfully.')
     }     
    } catch (error) {
        console.log(error , ' ----- error log 230 -----');
        return response(res, false, 500, 'Something Went Wrong!')
    }
}

exports.viewPaymentStatus = async(req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        
        await razorpay.orders.fetchPayments(req.params.razorpayOrderId)
        .then((paymentDetails) => {
            return response(res, true, 200, 'Payments Details', paymentDetails)
        })
        .catch(() => {
            return response(res, false, 404, 'Payment Details not found')
        })
    } catch (error) {
        console.log(error, ' ---- error 175 -----');
        return response(res, false, 500, 'Something went Wrong!')
    }
}

exports.paymentCapture = async(req, res) => {
    try {
        const data = crypto.createHmac('sha256',process.env.WEBHOOK_SECRET)
    data.update(JSON.stringify(req.body))
    const digest = data.digest('hex');
    if(digest === req.headers['x-razorpay-signature']){
        const paymentEntity = JSON.stringify(req.body.payload?.payment?.entity);
        if(req.body.event === 'payment.captured'){
            const updatePaymentStatus = await paymentModel.findOneAndUpdate(
                {razorpay_order_id: req.body.razorpay_order_id},
                {
                    payment_status: paymentEntity.status,
                    method: paymentEntity.method,
                    wallet: paymentEntity.wallet,
                },
                {new: true}
            )
            if(!updatePaymentStatus){
                return response(res, false, 499, 'Payment Details not updated!')
            }else{
                return response(res, true, 200, 'Weebhook received');
            }
        }else if(req.body.event === 'payment.failed'){
            const updatePaymentStatus = await paymentModel.findOneAndUpdate(
                {razorpay_order_id: req.body.razorpay_order_id},
                {
                    method: paymentEntity.method,
                    payment_status: paymentEntity.status,
                    wallet: paymentEntity.wallet,
                    reason: paymentEntity.reason
                },
                {new: true}
            )
            if(!updatePaymentStatus){
                return response(res, false, 499, 'Payment Details not updated!')
            }else{
                return response(res, true, 200, 'Weebhook received');
            }
        }else{

        }
        
    }else{
        return response(res, false, 400, 'Invalid Signature')
    } 
    } catch (error) {
        return response(res, false, 500, 'Something went Wrong!')
    }
}


exports.view = async(req, res) => {
    try {
        await orderDatailsModel.findById(req.params.orderId)
        .then(async(orderDetails) => {
            const product = orderDetails.product
            let prodArr = [];
            for(let i = 0 ; i< product.length; i++){
                const findProductDetails = await productModel.aggregate([
                    { $unwind: "$variants" },
                    {
                      $match: {
                        "variants._id": new Types.ObjectId(product[i].variant_id),
                    },
                },
                { $lookup: { from: 'colors', localField: 'variants.color_id', foreignField: '_id', as: 'colorInfo',
                    pipeline: [
                        { '$project': {"name": 1, "color_code": 1 }}
                    ]
                 }}, 
                { $lookup: { from: 'sizes', localField: 'variants.size_id', foreignField: '_id', as: 'sizeInfo',
                pipeline: [
                    { '$project': {"name": 1, "size_code": 1 }}
                ]
                 } },
                ]);
                 prodArr.push(findProductDetails)
            }
            return response(res, true, 200, 'Order Details found',prodArr)
        })
        .catch((err) => {
            console.log(err, ' --- err 254 ---');
            return response(res, false, 404, 'Order Data not found')
        })
    } catch (error) {
        return response(res, false, 500, 'Something went Wrong!') 
    }
}

exports.list = async(req, res) => {
    try {
        await orderDatailsModel.find()
        .then(async(orderDetails) => {
            let varArr = [];
            let pdtArr = [];
            for(let k = 0 ; k < orderDetails.length; k++){
                const product = orderDetails[k].product
                for(let i = 0 ; i< product.length; i++){
                    const findProductDetails = await productModel.aggregate([
                        { $unwind: "$variants" },
                        {
                          $match: {
                            "variants._id": new Types.ObjectId(product[i].variant_id),
                        },
                    },
                    { $lookup: { from: 'colors', localField: 'variants.color_id', foreignField: '_id', as: 'colorInfo',
                        pipeline: [
                            { '$project': {"name": 1, "color_code": 1 }}
                        ]
                     }}, 
                    { $lookup: { from: 'sizes', localField: 'variants.size_id', foreignField: '_id', as: 'sizeInfo',
                    pipeline: [
                        { '$project': {"name": 1, "size_code": 1 }}
                    ]
                     } },
                    ]);
                    varArr.push(findProductDetails[0])
                }
                orderDetails[k].product = varArr
            }
            return response(res, true, 200, 'Order Details found',orderDetails)
        })
        .catch((err) => {
            console.log(err, ' --- err 254 ---');
            return response(res, false, 404, 'Order Data not found')
        })
    } catch (error) {
        return response(res, false, 500, 'Something went Wrong!') 
    }
}

exports.edit = async(req, res) => {
    try {
      const findOrder = await orderDatailsModel.findById(req.params.orderId);
      if(findOrder){
        await orderDatailsModel.findByIdAndUpdate(req.param.orderId, req.body,{new: true})
        .then((uodatedODetails) => {
            return response(res, true, 201, 'Order updated successfully.')
        })
        .catch((err) => {
            return response(res, false, 422, 'Error, Order not updated.')
        })
      }else{
        return response(res, false, 404, 'Order Not Found')
      }
       
    } catch (error) {
        return response(res, false, 500, 'Something Went Wrong!')
    }
}

exports.editOrderStatus = async(req, res) => {
    try {
        const findOrder = await orderDatailsModel.findById(req.params.orderId);
        if(findOrder){
            let condition = {};
            if(req.body.order_status === 'delivered'){
                condition = {
                    order_status: req.body.order_status,
                    delivered_date: moment().format('DD-MM-YYYY HH:mm:ss')
                }
            }
            await orderDatailsModel.findByIdAndUpdate(req.params.orderId, 
            condition? condition : req.body
            )
            .then((orderStatus) => {
                return response(res, true, 201, 'Order status updated successfully.')
            })
            .catch((err) => {
                return response(res, false, 422, 'Error, Order status not updated.',err)
            })
        }else{
            return response(res, false, 404, 'Order not found.')
        }
    } catch (error) {
        return response(res, false, 500, 'Something Went Wrong!')
    }
}