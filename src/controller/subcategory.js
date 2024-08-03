// const mongoose = require('mongoose')
// const  ObjectId  = mongoose.Types.ObjectId;

const subcategoryModel = require('../models/subcategory')
const categoryModel = require('../models/category')
const response = require('../constant/response')

exports.add = async(req, res) => {
    req.body.category_id = (req.body.category_id)
    await subcategoryModel.create(req.body)
    .then((subcategoryData) => {
        return response(res,true ,201,'subcategory added successfully!', subcategoryData)
    })
    .catch((error) => {
        console.log(error, '-- error');
        return response(res,false, 422, 'error! subcategory not added')
    })
}

exports.view = async(req, res) => {
    await subcategoryModel.findById(req.params.id).populate('category_id')
    .then((subcategoryData) => {
        if(!subcategoryData){
            return response(res, false, 422, 'subcategory data not exist!')
        }
        return response(res, true, 200, 'subcategory data found', subcategoryData)
    })
    .catch((error) => {
        console.log(error);
        return response(res, false, 422, 'subcategory data not found')
    })
}

exports.list = async(req, res) => {
    await subcategoryModel.find()
    .then((subcategoryData) => {
        if(!subcategoryData.length){
            return response(res, true, 204, 'No data exists!')
        }
        return response(res, true, 200, 'subcategory list found', subcategoryData)
    })
    .catch(() => {
        return response(res, false, 422, 'subcategory list not found')
    })
}

// subcategory data by category wise
exports.subcategoryBycat = async(req, res) => {
    await categoryModel.aggregate().lookup({
        from: 'subcategories',
        localField: '_id',
        foreignField: 'category_id',
        as: 'subcategory'
    })
    .then((categoryResult) => {
        if(!categoryResult){
            return response(res, false, 202, 'category does not exist')
        }else{
            return response(res, true, 200, 'category data found',categoryResult)
        }
    })
    .catch((error) => {
        console.log(error);
        return response(res, false, 422, 'error, category not found')
    })
   }

   exports.edit = async(req, res) => {
    await subcategoryModel.findById(req.params.id)
   .then(async(subcategoryData) => {
       if(!subcategoryData){
           return response(res, false, 422, 'data does not exist')
       }else{
        await subcategoryModel.findByIdAndUpdate(req.params.id,req.body)
        .then((updatedRecord) => {
           return response(res, true, 201, 'subcategory data updated successfully!',req.body)
        })
        .catch((error) => {
           console.log(error, '----- error 1');
           return response(res, false, 422, 'subcategory data not updated')
        })
       }
   })
   .catch((error) => {
       console.log(error, '----- error 2');

       return response(res, false, 422, 'subcategory data not updated')
   })
}

exports.remove = async(req,res) => {
    await subcategoryModel.findById(req.params.id)
    .then(async(subcategoryData) => {
        if(!subcategoryData){
            return response(res, false, 422, 'data does not exist')
        }else{
         await subcategoryModel.findByIdAndDelete(req.params.id)
         .then(() => {
            return response(res, true, 201, 'subcategory data deleted successfully!')
         })
         .catch((error) => {
            console.log('log 1 error-----> ',error);
            return response(res, false, 422, 'subcategory data not deleted')
         })
        }
    })
    .catch((error) => {
        return response(res, false, 422, 'subcategory data not deleted')
    })
}

