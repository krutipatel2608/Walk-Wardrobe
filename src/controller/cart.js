const { Types } = require("mongoose");
const _ = require('lodash')

const response = require("../constant/response");
const cartModel = require("../models/cart");
const productModel = require("../models/product");
const { ObjectId } = require("mongodb");

exports.add = async (req, res) => {
  try {
    const checkCart = await cartModel.findOne({ user_id: req.body.user_id });
    const productArr = req.body.product ? JSON.parse(req.body.product) : [];

    if (checkCart) {
        const dbProduct = checkCart.product
          for (let k = 0; k < dbProduct.length; k++) {            
            if(String(dbProduct[k].product_id == productArr[0].product_id) &&  String(dbProduct[k].variant_id == productArr[0].variant_id) && dbProduct[k].size == productArr[0].size)
              {
              const findProductStatus = await productModel.aggregate([
                { $unwind: "$variants" },
                {
                  $match: {
                    "variants._id": new Types.ObjectId(productArr[0].variant_id),
                  },
                },
              ]);

              console.log(' ------ log 4 36 ------');
              if (
                !findProductStatus[0] ||
                findProductStatus[0].status === false ||  
                findProductStatus[0].variants.status === false ||
                findProductStatus[0].variants.stock <= 0
              ) {
                  return response(res, false, 204, "Product Not Available");
              } else {
              
                console.log("--------log 6------");
                const findCartProduct = await cartModel.findOne(
                   {"user_id" : req.body.user_id },
                   {
                   product: {
                    "$elemMatch" : {
                      "product_id": new ObjectId(productArr[0].product_id),
                      "variant_id": new ObjectId(productArr[0].variant_id),
                      "size": productArr[0].size
                    }
                   }
                  }
                );
               
                if(findCartProduct?.product[0]){
                  const productQtyToUpdate = findCartProduct.product[0].qty;
                  const productAmtToUpdate = Number(productQtyToUpdate + 1) * Number(productArr[0].amount)
                  
                  const updateCartProduct = await cartModel.findOneAndUpdate(
                    { "_id": findCartProduct._id, "product._id": findCartProduct.product[0]._id },
                    { 
                      $inc: { "product.$.qty": 1 },
                      $set: { "product.$.amount": productAmtToUpdate }
                    },
                    { new: true }
                  );
                  console.log(updateCartProduct, ' ----- log 91 ----');
                  if (updateCartProduct) {
                    const pdTotal = _.sumBy(updateCartProduct.product, 'amount')
                    const updateTotalAmount = await cartModel.findOneAndUpdate(
                      { "_id": updateCartProduct._id },
                      {
                        $set: { 'total':  pdTotal}
                      }
                    )
                    if(!updateTotalAmount){
                      return response(res, false, 422, "Error, Cart not updated");
                    }
                    return response(res, true, 200, "Product Added to cart!");
                  }else{
                    return response(res, false, 422, "Error, Cart not updated");
                  }
                }else{
                  console.log(' ----- log 8 -----');
                  const addProductToCart = await cartModel.findOneAndUpdate(
                    {'user_id': req.body.user_id},
                    { 
                      $addToSet : {product: {$each: productArr}},
                      $inc: { "quantity": 1 },
                    },
                    { new: true, safe: true }
                    );
                 
                  if (addProductToCart) {
                    const pdTotal = _.sumBy(addProductToCart.product, 'amount')
                    console.log(pdTotal , ' ----- log 94 ---- ');
                   
                    const updateTotalAmount = await cartModel.findOneAndUpdate(
                      { "_id": addProductToCart._id },
                      {
                        $set: { 'total':  pdTotal}
                      }
                    )
                    if(!updateTotalAmount){
                      return response(res, false, 422, "Error, Cart not updated");
                    }
                  
                    return response(
                      res,
                      true,
                      201,
                      "Product added to Cart Successfully!",
                      addProductToCart
                    );
                }else {
                  return response(
                    res,
                    false,
                    422,
                    "Error, Product not added to Cart"
                  );
                }
                }
              }
            } else {
              console.log('---- log 9 -----');
                const addProductToCart = await cartModel.findOneAndUpdate(
                  {'user_id': req.body.user_id},
                  {   
                    $addToSet : {product: {$each: productArr}},
                    $inc: { "quantity": 1 },
                  },
                  { new: true, safe: true }
                  );
               
                if (!addProductToCart) {
                  return response(
                    res,
                    false,
                    422,
                    "Error, Product not added to Cart"
                  );
              }else {
                return response(
                  res,
                  true,
                  201,
                  "Product added to Cart Successfully!",
                  addProductToCart
                );
              }
        }
        }
    } else {
      for(let i = 0 ; i < productArr.length ; i++){
        const findProductStatus = await productModel.aggregate([
          { $unwind: "$variants" },
          {
            $match: {
              "variants._id": new Types.ObjectId(
                productArr[i].variant_id
              ),
            },
          },
        ]);
        if (
          !findProductStatus[0] ||
          findProductStatus[0].status === false ||  
          findProductStatus[0].variants.status === false ||
          findProductStatus[0].variants.stock <= 0
        ) {
          return response(res, false, 204, "Product Not Available");
        } 
      } 
              req.body.product = productArr;
              req.body.quantity = productArr.length;
              req.body.total = _.sumBy(productArr, 'amount')
              const addProductToCart = await cartModel.create(req.body);
              if (!addProductToCart) {
                return response(res, false, 422, "Error, Product not added to Cart");
              } else {
                return response(
                  res,
                  true,
                  201,
                  "Product added to Cart Successfully!",
                  addProductToCart
                );
              }
            }
      
  } catch (error) {
    console.log(error, "---- erro 62");
    return response(res, false, 500, "Something went Wrong!");
  }

};

exports.view = async(req, res) => {
  try {
    await cartModel.find({ user_id: req.params.user_id })
    .then(async(userCartList) => {
      if(!userCartList.length){
        return response(res, true, 204, 'Your Cart is Empty')
      }
      let cartListData = []
      for(let j = 0 ; j < userCartList.length ; j++){
        const cartPoduct = userCartList[j].product
          for(let i = 0 ; i < cartPoduct.length ; i++){
            const findProductInfo =  await productModel.aggregate([
              { $unwind: "$variants" },
              {
                $match: {
                  "variants._id": new Types.ObjectId(
                    cartPoduct[i].variant_id
                  ),
                },
              },
              { $lookup: { from: 'categories', localField: 'category_id', foreignField: '_id', as: 'categoryInfo' } },
              { $lookup: { from: 'subcategories', localField: 'subcategory_id', foreignField: '_id', as: 'subCategoryInfo' } },
              { $lookup: { from: 'brands', localField: 'brand_id', foreignField: '_id', as: 'brandInfo' } },
              { $lookup: { from: 'materials', localField: 'material_id', foreignField: '_id', as: 'materialInfo' } }, 
            ]);
            cartListData.push(findProductInfo[0])
          }
      }
    return response(res, true, 200, 'User Cart List.', cartListData)
  })
  .catch((err) => {
    console.log(err);
    return response(res, false, 422, 'User Cart List not found')
  })
  } catch (error) {
    return response(res, false, 500, "Something went Wrong!");
  }
}

exports.removeCartItems = async(req, res) => {
  try {
    const cartProductData = await cartModel.aggregate([
      { $unwind: "$product" },
      {
        $match: {
          "product._id": new ObjectId(req.body.cartProductId),
        },
      },
    ]);
    
    const removeItemFromCart = await cartModel.findOneAndUpdate(
      {'_id' : req.body.cart_id },
      { 
        $pull: { product: { _id: req.body.cartProductId } },
        $inc: { "quantity": -1 },
        $set: {
          total:  Number(cartProductData[0].total - cartProductData[0].product.amount)
        } 
      },
      { new: true }
    )
    if(!removeItemFromCart){
      return response(res, false, 422, 'Error, Product not removed from the cart!')
    }
    return response(res, true, 201, 'Product removed from cart successfully')
  } catch (error) {
    console.log(error, ' ---- log error ----');
    return response(res, false, 500, "Something went Wrong!");
  }
}