// const { getAuth, signInWithCustomToken } = require('firebase/auth')
// const admin = require('firebase-admin')

const jwt = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')

const response = require('../constant/response')
const superAdminModel = require('../models/super-admin')
const staffModel =require('../models/staff')
require('dotenv').config()

/* ------ firebase token ----------*/
// const auth = () => {
//     return async function(req, res, next){
//         try {
//             const auth = getAuth()
//             const authHeader = req.headers.authorization
//             if(!authHeader || !authHeader.startsWith('Bearer')){
//                 return response(res, false, 401, 'Access Denied!')
//             }

//             const token = authHeader.replace('Bearer ','')
//             const currentUser = auth.currentUser
//             if(currentUser){
//                 const verifyToken = await admin.auth().verifyIdToken(token)
                
//                 if(verifyToken.uid === currentUser.uid){
//                     req.user = verifyToken.user
//                     return next()
//                 }else{
//                     return response(res, false, 401, 'Invalid Token!')
//                 }
//             }
            
//         } catch (error) {
//             console.log(error);
//             return response(res, false, 401, 'Invalid Token!')
//         }
//     }
// }


const auth = async(req,res,next) => {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return response(res, false, 401, 'Access Denied!')
        }
        
        const token = authHeader.replace('Bearer ','')
        const guestUserSecretKey = process.env.GUEST_TOKEN_SECRET_KEY
        const decodeFToken = jwt.decode(token, guestUserSecretKey)
        const decodeBToken = jwt.decode(process.env.GUEST_USER_TOKEN,guestUserSecretKey)

        if(decodeFToken?.user === decodeBToken.user){
            req.currentUser = {
                user: decodeBToken.user
            };
            return next()
        }else{
            const secretKey = process.env.SECRET_KEY
            const verifyToken = jwt.verify(token, secretKey)
            
            if(verifyToken.email){
                const checkSuperAdmin = await superAdminModel.findOne({email: verifyToken.email})
                
                if(!checkSuperAdmin){
                    const checkStaff = await staffModel.findOne({email: verifyToken.email})
                    if(!checkStaff){
                        return response(res, false, 401, 'Invalid token')
                    }
                        req.currentUser = checkStaff;
                       return next()
                    
                }
                    req.currentUser = checkSuperAdmin;
                    return next()
                
            }else{
                return response(res, false, 401, 'Invalid token!')
            }
        }
       
       
    } catch (error) {
        console.log('error ---> ',error);
       return response(res, false, 401, 'Invalid Token!')
    }
}

module.exports = auth