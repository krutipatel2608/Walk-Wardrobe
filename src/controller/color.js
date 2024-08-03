const response = require('../constant/response')
const colorModel = require('../models/color')

exports.add = async(req, res) => {
    await colorModel.create(req.body)
    .then((colorData) => {
        return response(res,true ,201,'Size data added successfully!', colorData)
    })
    .catch((error) => {
        return response(res,false, 422, 'error! Color data not added')
    })
}

exports.view = async(req, res) => {
    await colorModel.findById(req.params.id)
    .then((colorData) => {
        if(!colorData){
            return response(res, false, 204, 'Color data not exist!')
        }
        return response(res, true, 200, 'Color data found', colorData)
    })
    .catch((error) => {
        console.log(error);
        return response(res, false, 422, 'Color data not found')
    })
}

exports.list = async(req, res) => {
    await colorModel.find()
    .then((colorData) => {
        if(!colorData.length){
            return response(res, true, 204, 'No data exists!')
        }
        return response(res, true, 200, 'Color list found', colorData)
    })
    .catch(() => {
        return response(res, false, 422, 'Color list not found')
    })
}

exports.edit = async(req, res) => {
     await colorModel.findById(req.params.id)
    .then(async(colorData) => {
        if(!colorData){
            return response(res, false, 204, 'data does not exist')
        }else{
         await colorModel.findByIdAndUpdate(req.params.id,req.body)
         .then((updatedRecord) => {
            return response(res, true, 201, 'Color data updated successfully!',req.body)
         })
         .catch((error) => {
            return response(res, false, 422, 'error, Color data not updated')
         })
        }
    })
    .catch((error) => {
        return response(res, false, 422, 'Something went wrong!')
    })
}

exports.remove = async(req,res) => {
    await colorModel.findById(req.params.id)
    .then(async(colorData) => {
        if(!colorData){
            return response(res, false, 204, 'data does not exist')
        }else{
         await colorModel.findByIdAndDelete(colorData._id)
         .then(() => {
            return response(res, true, 201, 'Color data deleted successfully!')
         })
         .catch((error) => {
            return response(res, false, 422, 'error, Color data not deleted')
         })
        }
    })
    .catch((error) => {
        return response(res, false, 422, 'Something went wrong!')
    })
}

