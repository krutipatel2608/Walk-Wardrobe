const response = require('../constant/response')
const sizeModel = require('../models/size')

exports.add = async(req, res) => {
    await sizeModel.create(req.body)
    .then((sizeData) => {
        return response(res,true ,201,'Size data added successfully!', sizeData)
    })
    .catch((error) => {
        return response(res,false, 422, 'error! Material data not added')
    })
}

exports.view = async(req, res) => {
    await sizeModel.findById(req.params.id)
    .then((sizeData) => {
        if(!sizeData){
            return response(res, false, 204, 'Size data not exist!')
        }
        return response(res, true, 200, 'Size data found', sizeData)
    })
    .catch((error) => {
        console.log(error);
        return response(res, false, 422, 'Size data not found')
    })
}

exports.list = async(req, res) => {
    await sizeModel.find()
    .then((sizeData) => {
        if(!sizeData.length){
            return response(res, true, 204, 'No data exists!')
        }
        return response(res, true, 200, 'Size list found', sizeData)
    })
    .catch(() => {
        return response(res, false, 422, 'Size list not found')
    })
}

exports.edit = async(req, res) => {
     await sizeModel.findById(req.params.id)
    .then(async(sizeData) => {
        if(!sizeData){
            return response(res, false, 204, 'data does not exist')
        }else{
         await sizeModel.findByIdAndUpdate(req.params.id,req.body)
         .then((updatedRecord) => {
            return response(res, true, 201, 'Size data updated successfully!',req.body)
         })
         .catch((error) => {
            return response(res, false, 422, 'error, Size data not updated')
         })
        }
    })
    .catch((error) => {
        return response(res, false, 422, 'Something went wrong!')
    })
}

exports.remove = async(req,res) => {
    await sizeModel.findById(req.params.id)
    .then(async(sizeData) => {
        if(!sizeData){
            return response(res, false, 422, 'data does not exist')
        }else{
         await sizeModel.findByIdAndDelete(sizeData._id)
         .then(() => {
            return response(res, true, 201, 'Size data deleted successfully!')
         })
         .catch((error) => {
            return response(res, false, 422, 'error, Size data not deleted')
         })
        }
    })
    .catch((error) => {
        return response(res, false, 422, 'Something went wrong!')
    })
}

