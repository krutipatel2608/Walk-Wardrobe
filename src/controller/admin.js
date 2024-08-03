// const {  getAuth, signInWithEmailAndPassword } = require('firebase/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const moment = require('moment')
require('dotenv').config()

const admin = require('../firebase/firebase-config')
const staffModel = require('../models/staff')
const superAdminModel = require('../models/super-admin')
const customerModel = require('../models/customer')
const response = require('../constant/response')
const { format } = require('path')


/* firebase inbuilt signup method  */
// exports.signUp = async(req, res) => {
//     await admin.auth().createUser({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//         phone: req.body.phone_no
//     })
//     .then((result) => {
//         return response(res,true, 201, 'user account created successfully!')
//     })
//     .catch((error) => {
//         console.log(error);
//         return response(res,false, 422, 'something went wrong')
//     })
// }

/* firebase inbuilt signIn method */
// exports.signIn = async(req, res) => {
//     const auth = getAuth()
//     await signInWithEmailAndPassword(auth,req.body.email, req.body.password)
//     .then(async(result) => {
//         if(result){
//             const currentUser = auth.currentUser
//             const userData = currentUser.providerData   // current user specific details
//             const token= await currentUser.getIdToken()
//             if(token){
//                 const userObj = {
//                     displayName: currentUser.displayName,
//                     email: currentUser.email,
//                     phone_no:currentUser.phone,
//                     token: token
//                 }
//                 return response(res, true, 200, 'login successfully',userObj)
//             }else{
//                 return response(res, false, 422, 'something went wrong!')
//             }
//          }else{
//             return response(res, false, 406, 'Invalid Credentials!')
//          }
//     })
//     .catch((error) => {
//         console.log(error);
//         return response(res, false, 422, 'something went wrong')
//     })
// }

exports.signIn = async(req, res) => {
    const findAdmin = await superAdminModel.findOne({ email: req.body.email })

    if(!findAdmin){
        const findStaff = await staffModel.findOne({ email: req.body.email })
        if(!findStaff){
            return response(res, false, 401, 'Invalid Credentials')
        }else{
            const comparePass = await bcrypt.compareSync(req.body.password, findStaff.password)
        if(comparePass){
            const secretKey = process.env.SECRET_KEY
            const token = await jwt.sign(
                {
                email: req.body.email
                },
                secretKey,
                {
                    expiresIn: '24h'
                })

            if(!token){
                return response(res, false, 422, 'error, token not fond')
            }
            const data = {}
            data.token = token,
            data.name = findStaff.name,
            data.email = findStaff.email

            return response(res, true, 200, 'login successfully', data)
        }else{
            return response(res, false, 401, 'Invalid credentials')
        }
        }
    }else{
       const comparePass = await bcrypt.compareSync(req.body.password, findAdmin.password);
       if(comparePass){
        const secretKey = process.env.SECRET_KEY
        const token = await jwt.sign(
            {
            email: req.body.email
            },
            secretKey,
            {
                expiresIn: '24h'
            })

        if(!token){
            return response(res, false, 422, 'error, token not fond')
        }
        const data = {}
        data.token = token,
        data.name = findAdmin.name,
        data.email = findAdmin.email

        return response(res, true, 200, 'login successfully', data)
    }else{
        return response(res, false, 401, 'Invalid credentials')
    }
    }
        
    
}

exports.customerLogin = async(req, res) => {
    const phone = req.body.phone
    const otp = req.body.otp
  if (!phone && !otp) {
    return response(res, false, 400, 'Body can not be empty!')
  }
  const checkCustomer = await customerModel.findOne({phone})
  if (!checkCustomer) {
    return response(res, true, 202, 'User not registered')
  } else {
    const currentTime = moment().format('DD-MM-YYYY hh:mm');
    if(moment(currentTime).isAfter(checkCustomer.otp_expired_time)){
        return response(res, false, 400, 'OTP has expired')
    }else{
        if (checkCustomer.otp === otp) {
            const loginData = {}
            const secretKey = process.env.SECRET_KEY || 'secretAlwaysSecret'
            const token = jwt.sign({ phone: checkCustomer.phone }, secretKey, { expiresIn: '24h' })
            // const guestToken = jwt.sign({ 'user': 'guest-user' }, secretKey, { expiresIn: '24h' })
            loginData.id = checkCustomer.id
            loginData.phone = checkCustomer.phone
            loginData.name = checkCustomer.name
            loginData.email = checkCustomer.email
            loginData.token = token
            // loginData.guestToken = guestToken
            return response(res, true, 200, 'User logged in successfully', loginData)
          } else {
            return response(res, false, 400, 'Invalid otp')
          }
    }
   
  }
}