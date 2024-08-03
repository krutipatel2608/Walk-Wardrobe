const response = require('../constant/response')
const brandModel = require('../models/brand')

exports.add = async(req, res) => {
    await brandModel.create(req.body)
    .then((brandData) => {
        return response(res,true ,201,'Brand details added successfully!', brandData)
    })
    .catch((error) => {
        return response(res,false, 201, 'error! Brand details not added')
    })
}

exports.view = async(req, res) => {
    await brandModel.findById(req.params.id)
    .then((brandData) => {
        if(!brandData){
            return response(res, false, 422, 'Brand data not exist!')
        }
        return response(res, true, 200, 'Brand data found', brandData)
    })
    .catch((error) => {
        console.log(error);
        return response(res, false, 422, 'Brand data not found')
    })
}

exports.list = async(req, res) => {
    await brandModel.find()
    .then((brandData) => {
        if(!brandData.length){
            return response(res, true, 204, 'No data exists!')
        }
        return response(res, true, 200, 'Brand list found', brandData)
    })
    .catch(() => {
        return response(res, false, 422, 'Brand list not found')
    })
}

exports.edit = async(req, res) => {
     await brandModel.findById(req.params.id)
    .then(async(brandData) => {
        if(!brandData){
            return response(res, false, 422, 'data does not exist')
        }else{
         await brandModel.findByIdAndUpdate(req.params.id,req.body)
         .then((updatedRecord) => {
            return response(res, true, 201, 'brand data updated successfully!',req.body)
         })
         .catch((error) => {
            return response(res, false, 422, 'error, brand data not updated')
         })
        }
    })
    .catch((error) => {
        return response(res, false, 422, 'Something went wrong!')
    })
}

exports.remove = async(req,res) => {
    await brandModel.findById(req.params.id)
    .then(async(brandData) => {
        if(!brandData){
            return response(res, false, 422, 'data does not exist')
        }else{
         await brandModel.findByIdAndDelete(brandData._id)
         .then(() => {
            return response(res, true, 201, 'Brand data deleted successfully!')
         })
         .catch((error) => {
            return response(res, false, 422, 'error, Brand data not deleted')
         })
        }
    })
    .catch((error) => {
        console.log('log 2 error-----> ',error);

        return response(res, false, 422, 'Something went wrong!')
    })
}

