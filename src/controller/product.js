const path = require('path')
const fs = require('fs')
const _ = require('lodash');

const response = require('../constant/response')
const productModel = require('../models/product');

exports.add = async(req, res) =>{
    const productMainImgDir = path.join(__dirname, '../../public/upload/product/main-images/');
    const productSubImgDir = path.join(__dirname, '../../public/upload/product/sub-images/');
    const productVariant = req.body.variants? JSON.parse(req.body.variants) : [];
    for(let i = 0; i< productVariant.length; i++){
        console.log(productVariant[i], ' ---- productVariant[i].main_iamge 14');
       
    
        // if(req.files){
            // product main-image upload
            // if(req.files.main_image){
            //     const uploadProductImage = await imageUpload(req.files.main_image,productMainImgDir,'product',res)
            //     if(uploadProductImage.response){
            //         return response(res, false, 422, 'Image not uploaded.')
            //     }
            //     req.body.main_image = uploadProductImage.image
            // }
    
        //     // product sub-image upload
        //     // if(req.files.sub_image.length){
        //     //     const subImagesArr = []
        //     //     for(let i = 0; i< req.files.sub_image.length; i++){
        //     //         const uploadProductSubImage = await imageUpload(req.files.sub_image[i],productSubImgDir,'product-sub-img',res)
        //     //     if(uploadProductSubImage.response){
        //     //         return response(res, false, 422, 'Sub-Images not uploaded.')
        //     //     }
        //     //     subImagesArr.push(uploadProductSubImage.image)
        //     //     }
        //     //     req.body.sub_image = subImagesArr
        //     // }
        // }
    }
     
    req.body.variants = productVariant;
    await productModel.create(req.body)
    .then((productData) => {
        return response(res,true ,201,'Product added successfully!', productData)
    })
    .catch((error) => {
        console.log(error);
        return response(res,false, 422, 'error! Product not added')
    })
}

exports.view = async(req, res) => {
    await productModel.findById(req.params.id).populate({
        path:     'variants',			
        populate: [
            { path:  'color_id', model: 'color', select: 'name' },
            { path:  'size_id', model: 'size', select: 'name' }]
      })
    .then((productData) => {
        if(!productData){
            return response(res, false, 422, 'Product data not exist!')
        }
        return response(res,true ,200,'Product Details available', productData)
    })
    .catch((error) => {
        console.log(error);
        return response(res,false, 422, 'Product not found')
    })
}

exports.list = async(req, res) => {
    await productModel.find().populate({
        path:     'variants',			
        populate: [
            { path:  'color_id', model: 'color', select: 'name' },
            { path:  'size_id', model: 'size', select: 'name' }]  
    })
    .then((productData) => {
        if(!productData.length){
            return response(res, true, 202, 'No data exists!')
        }
        return response(res,true ,200,'Product list found', productData)
    })
    .catch((error) => {
        console.log(error);
        return response(res,false, 422, 'Product list not found')
    })
}

exports.edit = async(req, res) => {
    const findData = await productModel.findById(req.params.id)
    // const productMainImgDir = path.join(__dirname, '../../public/upload/product/main-images/');
    // const productSubImgDir = path.join(__dirname, '../../public/upload/product/sub-images/');
    if(!findData){
        return response(res, false, 204, 'Product does not exist!')
    }else{
       
        // if(req.files){
            // if new image file is requested
            // if(req.files.main_image){
                // remove existing main_image from server
                // const dbImageName = findData.main_image
                // if(dbImageName){
                //     const mainImgFilePath = `${productMainImgDir}${dbImageName}`
                //     if(fs.existsSync(mainImgFilePath)){
                //         fs.unlink(mainImgFilePath)
                //     }
                // }
                
                // upload new image
                // const uploadMainImg = await imageUpload(req.files.main_image, productMainImgDir,'product',res)
                // if(uploadMainImg.response){
                //     return response(res, false, 422, 'Image not uploaded.')
                // }

                // req.body.main_image = uploadMainImg.image
            // }

            //if new sub-images is requested
            // if(req.files.sub_image.length){
                // const newSubImgArr = ;
                // const existingSubImages = req.body.existing_sub_images? JSON.parse(req.body.existing_sub_images) : [];
                // const dbSubImages = findData.sub_image;
                // console.log(dbSubImages, '--- dbSubImages');
                // const findDiff = dbSubImages.filter(img => !existingSubImages.includes(img))
                // console.log(findDiff, ' ---- findDiff');
                // if(findDiff?.length){
                //     for(let k = 0; k <= findDiff.length ; k++){
                        // const subImgFilePath = `${productSubImgDir}${findDiff[k]}`
                        // if(subImgFilePath){
                        //     if(fs.existsSync(subImgFilePath)){
                        //         fs.unlinkSync(subImgFilePath)
                        //     }
                        // }
                //     }
                // }

                // upload new sub-image
            //    for(let i = 0 ; i < req.files.sub_image.length ; i++){
            //     const uploadSubImg = await imageUpload(req.files.sub_image[i], productSubImgDir,'product-sub-img',res)
            //     if(uploadSubImg.response){
            //         return response(res, false, 422, 'Image not uploaded.')
            //     }
            //     newSubImgArr.push(uploadSubImg.image)
            // }
          
            // req.body.sub_image = newSubImgArr.concat(existingSubImages)
        }
        // }
          // only delete images
            // if(req.body.existing_sub_images?.length){
            //     const existingSubImages = req.body.existing_sub_images? JSON.parse(req.body.existing_sub_images) : [];
            //     let dbSubImages = findData.sub_image;
            //     const findDiff = dbSubImages.filter(img => !existingSubImages.includes(img))
            // if(findDiff?.length){
            //     for(let k = 0; k <findDiff.length ; k++){
            //         const subImgFilePath = `${productSubImgDir}${findDiff[k]}`
            //         if(subImgFilePath){
            //             if(fs.existsSync(subImgFilePath)){
            //                 fs.unlinkSync(subImgFilePath)
            //             }
            //         }
            //          dbSubImages.splice((dbSubImages.indexOf(findDiff[k])),1);         
            //     }
            //     req.body.sub_image = dbSubImages
            // }
            // }    
        
            // variants update
            const bodyVariantsData = req.body.variants? JSON.parse(req.body.variants) : [];
            if(bodyVariantsData?.length){
                const dbVariants = findData.variants;
                for(let i = 0; i< bodyVariantsData.length; i++){
                    const bodyVariantId = bodyVariantsData[i].id?.toString();
                    console.log(bodyVariantId, '--bodyVariantId');
                    
                    // add new variants
                    if(!bodyVariantsData[i].id){
                        const addNewVariant = await productModel.findByIdAndUpdate(
                            findData.id,
                            {
                                '$push' : {variants: bodyVariantsData[i]},
                            },
                            { new: true }
                        )
                        if(!addNewVariant){
                            return response(res, false, 422, 'Error, Product Variant not added!')
                        }
                    }else{
                        for(let k = 0; k < dbVariants.length; k++){
                        const dbVariantId = (dbVariants[k].id).toString();
                        if(bodyVariantId === dbVariantId){
                            
                            const updateVariant = await productModel.findOneAndUpdate(
                                {'variants._id': bodyVariantsData[i].id},
                                {
                                    '$set' :  {  
                                        'variants.$.color_id' : bodyVariantsData[i].color_id,
                                        'variants.$.size_id' : bodyVariantsData[i].size_id,
                                        'variants.$.main_image' : bodyVariantsData[i].main_image,
                                        'variants.$.sub_image' : bodyVariantsData[i].sub_image,
                                        'variants.$.base_price' : bodyVariantsData[i].base_price,
                                        'variants.$.selling_price' : bodyVariantsData[i].selling_price,
                                        'variants.$.model_no' : bodyVariantsData[i].model_no,
                                        'variants.$.stock' : bodyVariantsData[i].stock,   
                                        'variants.$.status' : bodyVariantsData[i].status? bodyVariantsData[i].status : false,   
                                    },
                                    '$unset': { 'variants.$._id' : bodyVariantsData[i]._id}
                                },
                                { new : true }
                            )
                            if(!updateVariant){
                                return response(res, false, 422, 'Error, Product Variant not updated!')
                            }
                        }
                        }
                    }
                }    
            }

            // const variantDiff = _.differenceBy(bodyVariantsData, dbVariants, 'id')
            delete req.body.variants;
            // delete req.body.existing_sub_images;
                       
            await productModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then((updatedRecord) => {
                return response(res, true, 201, 'Product updated successfully!',updatedRecord)
            })
            .catch((error) => {
                console.log(error, '---- error');
                return response(res, false, 422, 'Error, product not updated!')
            })        
    }


exports.remove = async(req, res) => {
    await productModel.findById(req.params.id)
    .then(async(productData) => {
        if(!productData){
            return response(res, false, 422, 'data does not exist')
        }else{
            if(productData.sub_image.length){
                const productSubImgDir = path.join(__dirname, '../../public/upload/product/sub-images/');
                const deleteImg = productData.sub_image.forEach((imgName) => {
                    const subImgFilePath = `${productSubImgDir}${imgName}`
                        if(fs.existsSync(subImgFilePath)){
                            fs.unlink(subImgFilePath)
                        }
                        if(!deleteImg){
                         return response(res, false, 422, 'Error,Product sub-image not deleted!')
                        }
               })
            }
         await productModel.findByIdAndDelete(productData._id)
         .then(() => {
            return response(res, true, 201, 'Product data deleted successfully!')
         })
         .catch((error) => {
            return response(res, false, 422, 'error, Product data not deleted')
         })
        }
    })
    .catch((error) => {
        console.log('log 2 error-----> ',error);

        return response(res, false, 422, 'Something went wrong!')
    })
}

exports.variantStatusUpdate = async(req, res) => {
   if(req.body.variants?.length){
    const bodyVariants = JSON.parse(req.body.variants);
    for(let i = 0; i< bodyVariants.length; i++){
        const variantUpdate = await productModel.findOneAndUpdate(
            {'_id': req.params.id , 'variants._id': bodyVariants[i].id },
            {
                '$set': { 'variants.$.status': bodyVariants[i].status }
            }
        );
        if(!variantUpdate){
            return response(res, false, 422, 'Error, Product variant not updated!')
        }
         return response(res, true, 201, 'Product variant status updated successfully.')
    }
}
}

exports.variantFilters = async(req, res) => {
let condition = {};
// const productMainImgDir =  'public/upload/product/main-images/'
// const productSubImgDir = 'public/upload/product/sub-images/'

const brandFilter = req.body.brand_id ? req.body.brand_id : null;
const materialFilter = req.body.material_id ? req.body.material_id : null;
const categoryFilter = req.body.category_id ? req.body.category_id : null;
const subcategoryFilter = req.body.subcategory_id ? req.body.subcategory_id : null;
const colorFilter = req.body.color_id? req.body.color_id: null;
const occasionFilter = req.body.occasionName? req.body.occasionName : null;

if(brandFilter){
    condition.brand_id = brandFilter
}else if(materialFilter){
    condition.material_id = materialFilter
}else if(categoryFilter){
    condition.category_id = categoryFilter
}else if(subcategoryFilter){
    condition.subcategory_id = subcategoryFilter
}else if(colorFilter){
    condition = (
        {"variants.color_id" : req.body.color_id})
}else if(occasionFilter){
    condition = {
        "name": { $regex: '.*'+ occasionFilter + '.*'}
    }
}

let productDetails = await productModel.find(condition)
.populate('category_id', {id:1, category_name:1})
.populate('subcategory_id', {id:1, subcategory_name:1})
.populate('brand_id',{id:1, name:1})
.populate('material_id',{id:1, name:1})
.populate({
        path:     'variants',	
        populate: [
            { path:  'color_id', model: 'color', select: 'name' },
            { path:  'size_id', model: 'size', select: 'name' },
        ]
})

if(req.body.range){
    let productsData = []
    let rangeFilterProduct;
    const startRange = req.body.range.start ? Number(req.body.range.start) : null;
    const EndRange = req.body.range.end ? Number(req.body.range.end) : null;
    
    for(let i = 0 ; i < productDetails.length ; i++){
        const productV = productDetails[i].variants
        if(req.body.range === 'Low to High'){
            rangeFilterProduct = productV.sort((a,b) => { return a.selling_price - b.selling_price }) 
        }else if(req.body.range === 'High to Low'){
            rangeFilterProduct = productV.sort((a,b) => { return b.selling_price - a.selling_price })
        }else if(startRange && EndRange){
            rangeFilterProduct = productV.filter((product) => {
                return (product.selling_price >= startRange && product.selling_price <= EndRange)
             })
        }
       

         if(rangeFilterProduct.length){
             productsData.push({
                id: productDetails[i].id,
                name: productDetails[i].name,
                description: productDetails[i].description,
                category: {
                    id: productDetails[i].category_id.id,
                    categoy_name: productDetails[i].category_id.category_name,
                },
                subcategory: {
                    id: productDetails[i].subcategory_id.id,
                    subcategoy_name: productDetails[i].subcategory_id.subcategory_name,
                },
                brand: {
                    id: productDetails[i].brand_id.id,
                    name: productDetails[i].brand_id.name,
                },
                material: {
                    id: productDetails[i].material_id.id,
                    name: productDetails[i].material_id.name,
                },
                status: productDetails[i].status,
                variants:  rangeFilterProduct                 
            })
         }
    }
    return response(res, true, 200, 'Products List',productsData)
}

return response(res, true, 200, 'Products List',productDetails)


}

