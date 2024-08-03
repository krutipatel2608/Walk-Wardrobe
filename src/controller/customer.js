const  bcryptjs =  require('bcryptjs')

const response = require('../constant/response')
const customerModel = require('../models/customer')
const { generateNumber } = require('../utils/utils')
const moment = require('moment')

exports.add = async(req, res) => {
    try {
        const checkEmail = await customerModel.findOne({email : req.body.email})
        if(checkEmail){
            return response(res, false, 400, 'Email already exists!')
        }
    
        req.body.password =  bcryptjs.hashSync(req.body.password, 10)
        await customerModel.create(req.body)
        .then((customerData) => {
            return response(res, true, 201, 'customer added successfully',customerData)
        })
        .catch(() => {
            return response(res, false, 422, 'error, customer not added!')
        }) 
    } catch (error) {
        return response(res, false, 522, 'Something went wrong!')
    }
    
}

exports.view = async(req, res) => {
    try {
        await customerModel.findById(req.params.id)
        .then((customerData) => {
            if(!customerData){
                return response(res, false, 204, 'Customer does not exist!')
            }
            return response(res, true, 200, customerData)
        })
        .catch(() => {
            return response(res, false, 422, 'Customer  not found!')
        })
    } catch (error) {
        return response(res, false, 500, 'Something went wrong!')
    }
   

}

exports.list = async(req, res) => {
    try {
        await customerModel.find()
        .then((customerList) => {
           return response(res, true, 200, 'customer list',customerList)
        })
        .catch(() => {
            return response(res, false, 422, 'customer list not found!')
        })
    } catch (error) {
        return response(res, false, 522, 'Something went wrong!')
    }
   
}

exports.edit = async(req, res) => {
    try {
        const findCustomer = await customerModel.findById(req.params.id)
    if(!findCustomer){
        return response(res, false, 204, 'Customer does not exist!')
    }else{
        await customerModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then(async(customerData) => {
            return response(res, true, 201, 'customer data updated successfully',customerData)
        })
        .catch(() => {
            return response(res, false, 422, 'error, customer data not updated')
        })
    }
    } catch (error) {
        return response(res, false, 500, 'Something went wrong!')
    }
    
}

exports.remove = async(req, res) => {
    try {
        const findCustomer = await customerModel.findById(req.params.id)
        if(!findCustomer){
            return response(res, false, 204, 'Customer does not exist')
        }else{
            await customerModel.findOneAndDelete(req.params.id)
            .then(() => {
                return response(res, true, 200, 'Customer deleted successfully')
            })
            .catch(() => {
                return response(res, false, 422, 'error, customer not deleted!')
            })
        }
    } catch (error) {
        return response(res, false, 500, 'Something went wrong!')
    }
}

exports.changePassword = async(req, res) => {
    try {
        const findCustomer = await customerModel.findOne({email: req.body.email})
    if(!findCustomer){
        return response(res, false, 204, 'Customer not found!')
    } 
   const hashPass  = bcryptjs.hashSync(req.body.newPassword, 10)
    await customerModel.findByIdAndUpdate(findCustomer.id, {email: hashPass})
    .then(() => {
        return response(res, true, 201, 'Password updated successfully')
    })
    .catch(() => {
        return response(res, false, 422, 'error, Password not updated!')
    })
    } catch (error) {
        console.log(error, '--- error');
        return response(res, false, 500, 'Something went wrong!')
    }
    
}

exports.customerOtp = async(req, res) => {
    try {
        const findCustomer = await customerModel.findOne({phone: req.body.phone})
        if(!findCustomer){
            return response(res, false, 401, 'User not registered')
        }else{
            const generateOtp = await generateNumber(4)
            const otpExpirationTime = moment().add(1,'minutes').format('DD-MM-YYYY hh:mm')
            await customerModel.findByIdAndUpdate(findCustomer.id, {otp: generateOtp, otp_expired_time: otpExpirationTime}, {new: true})
            .then((customerData) => {
                return response(res, true, 201, 'OTP sent successfully', customerData)
            })
            .catch((err) => {
                console.log(err, '-- err');
                return response(res, false, 422, 'error, OTP not generated')
            })
        }
    } catch (error) {
        return response(res, false, 500, 'Something went wrong!')
    }
    
}