const response = require('../constant/response')
const materialModel = require('../models/material')

exports.add = async(req, res) => {
    await materialModel.create(req.body)
    .then((materialData) => {
        return response(res,true ,201,'Material data added successfully!', materialData)
    })
    .catch((error) => {
        return response(res,false, 201, 'error! Material data not added')
    })
}

exports.view = async(req, res) => {
    await materialModel.findById(req.params.id)
    .then((materialData) => {
        if(!materialData){
            return response(res, false, 422, 'Material data not exist!')
        }
        return response(res, true, 200, 'Material data found', materialData)
    })
    .catch((error) => {
        console.log(error);
        return response(res, false, 422, 'Material data not found')
    })
}

exports.list = async(req, res) => {
    await materialModel.find()
    .then((materialData) => {
        if(!materialData.length){
            return response(res, true, 204, 'No data exists!')
        }
        return response(res, true, 200, 'Material list found', materialData)
    })
    .catch(() => {
        return response(res, false, 422, 'Material list not found')
    })
}

exports.edit = async(req, res) => {
     await materialModel.findById(req.params.id)
    .then(async(materialData) => {
        if(!materialData){
            return response(res, false, 422, 'data does not exist')
        }else{
         await materialModel.findByIdAndUpdate(req.params.id,req.body)
         .then((updatedRecord) => {
            return response(res, true, 201, 'Material data updated successfully!',req.body)
         })
         .catch((error) => {
            return response(res, false, 422, 'error, Material data not updated')
         })
        }
    })
    .catch((error) => {
        return response(res, false, 422, 'Something went wrong!')
    })
}

exports.remove = async(req,res) => {
    await materialModel.findById(req.params.id)
    .then(async(materialData) => {
        if(!materialData){
            return response(res, false, 422, 'data does not exist')
        }else{
         await brandModel.findByIdAndDelete(materialData._id)
         .then(() => {
            return response(res, true, 201, 'Material data deleted successfully!')
         })
         .catch((error) => {
            return response(res, false, 422, 'error, Material data not deleted')
         })
        }
    })
    .catch((error) => {
        console.log('log 2 error-----> ',error);

        return response(res, false, 422, 'Something went wrong!')
    })
}

