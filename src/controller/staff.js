const path = require('path')
const fs = require('fs')
const aws = require('aws-sdk')
const bcrypt = require('bcrypt')

const staffModel = require('../models/staff')
const superAdminModel = require('../models/super-admin')
const { imageUpload } = require('../utils/utils')
const response = require('../constant/response') 
// const sequelize = require('../model/index').sequelize
const { generateNumber } = require('../utils/utils')

const staffImageDir = path.join(__dirname, '../../public/staff/')

exports.add = async(req, res) => {
    // const s3 = new aws.S3({   signatureVersion: 'v4',  })

    if(req.files){
        if(req.files.image){
            const uploadStaffImage = await imageUpload(req.files.image,staffImageDir,'staff',res)
            if(uploadStaffImage.response){
                return response(res, false, 422, 'error, Image not uploaded.')
            }
            req.body.image = uploadStaffImage.image

           
            /* used s3 bucket for image 
            // const uploadParams = {
            //     Bucket: 'staffimagebucket',
            //     Key: req.files.image.name,
            //     Body: req.files.image.data,
            // }
           
           await s3.upload(uploadParams, async(err,data) => {
                if(err){
                    // console.log(err);
                    return response(res, false, 422, 'error while uploading image', err)
                }
            })   */
        //    req.body.image = req.files.image.name
        }
        
    }
    
    const hashPass = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashPass

    await staffModel.create(req.body)
    .then((staffData) => {
        return response(res, true, 201, 'staff added successfully!',staffData)
    })
    .catch((error) => {
        return response(res, false, 422, 'error, staff not added')
    })
}

exports.list = async(req, res) => {
    await staffModel.find()
    .then((staffData) => {
        if(!staffData.length){
            return response(res, true, 202, 'staff data not exist')
        }
        return response(res, true, 200, 'staff list found',staffData)
    })
    .catch((error) => {
        console.log(error);
        return response(res, false, 422, 'staff list not found')
    })
}

exports.view = async(req, res) => {
    await staffModel.findById(req.params.id)
    .then((staffData) => {
        if(!staffData){
            return response(res, false, 204, 'staff data not exist!')
        }
        return response(res, true, 200, 'staff data found', staffData)
    })
    .catch((error) => {
        return response(res, false, 422, 'staff data not found')
    })
}

exports.edit = async(req, res) => {
     await staffModel.findById(req.params.id)
     .then(async(staffData) => {
        if(!staffData){
            return response(res, false, 204, 'staff data not exist')
        }else{
         if(req.files){
                if(req.files.image){
                    const existImage = staffImageDir + staffData.image
                    if(fs.existsSync(existImage)){
                        fs.unlinkSync(existImage)
                    }
        
                    const uploadStaffImage = await imageUpload(req.files.image,staffImageDir,'staff',res)
                    if(uploadStaffImage.response){
                        return response(res, false, 422, 'error, image not uploaded')
                    }
                    req.body.image = uploadStaffImage.image
                }
            }
        
          const updateStaffdata =  await staffModel.findByIdAndUpdate(req.params.id, req.body,{
            new: true
          })  
         if(!updateStaffdata){
            return response(res, false, 422, 'staff data not updated')
         }
         return response(res, true, 201, 'staff data updated successfully!', req.body)
        }
     })
     .catch((error) => {
        return response(res, false, 422, 'error, staff data not updated')
     })
    
}

exports.remove = async(req, res) => { 
  const staffData =  await staffModel.findById(req.params.id)
        if(!staffData){
            return response(res, false, 204, 'staff data not exist')
        }else{
            const existStaffimg = staffImageDir + staffData.image
            if(fs.existsSync(existStaffimg)){
                fs.unlinkSync(existStaffimg)
            }

            await staffModel.findByIdAndDelete(req.params.id)
            .then(() => {
                return response(res, true, 200, 'staff data deleted successfully')
            })
            .catch(() => {
                return response(res, true, 422, 'error, staff data not deleted')
            })
        }   
}

exports.changePassword = async(req, res) => {
    try {
        const hashPass = bcrypt.hashSync(req.body.newPassWord,10)
    const checkSuperAdmin = await superAdminModel.findById(req.currentUser.id)
    if(!checkSuperAdmin){
        const checkStaff = await staffModel.findById(req.currentUser.id)
        if(!checkStaff){
            return response(res, false, 204, 'User does not exist')
        }else{
           await staffModel.findByIdAndUpdate(checkStaff.id, {password: hashPass})
           .then(() => {
            return response(res, true, 201, 'Password updated successfully.')
           })
           .catch(() => {
            return response(res, false, 422, 'Error, password  ot updated!')
           })
        }
    }else{
        await checkSuperAdmin.findByIdAndUpdate(checkStaff.id, {password: hashPass})
           .then(() => {
            return response(res, true, 201, 'Password updated successfully.')
           })
           .catch(() => {
            return response(res, false, 422, 'Error, password  ot updated!')
           })
    }
    } catch (error) {
        return response(res, false, 500, 'Something went wrong!')
    }
    
}

// exports.uploadToS3 = async(req, res) => {
//     const bucketParams = {
//         Bucket: 'staffimagebucket'
//     };

//     // s3.createBucket(bucketParams, (err, data) =>{
//     //     if(err){
//     //         return response(res, false, 422, 'error while creaing bucket', err)
//     //     }else{
//     //         return response(res, true, 201, 'bucket created successfully!', data.Location)
//     //     }
//     // })

//     // const params = {
//     //     Bucket
//     // }
    
//     // console.log('req.files ==> ',req.files.image.data);
//     // return
    
//     const s3 = new aws.S3({   signatureVersion: 'v4',  })

//     const generateName = generateNumber(10)
//     const imageName = `staff-${generateName}` + '.png'
//     const imageFile = req.files.image

//     // function to encode file data to base64 encoded string
//     // const base64Encode = file => {
//     //     return fs.readFileSync(file, { encoding: 'base64' })
//     //   }
//     //   const base64str = 'data:image/png;base64,' + base64Encode(imageFile)
//     //   console.log('base64str 188 --> ',base64str);

//     // const base64str= fs.readFileSync(imageFile, {encoding: 'base64'});
//     // console.log('base64str ==> ',base64str);
   

//     const uploadParams = {
//         Bucket: 'staffimagebucket',
//         Key: req.files.image.name,
//         Body: req.files.image.data,
//         // ACL:"public-read-write", 
//         // ContentType: 'application/octet-stream',
//         // MimeType: 'image/png'
//     }

//     s3.upload(uploadParams, (err, data) => {
//         if(err){
//             // console.log(err);
//             return response(res, false, 422, 'error while uploading image', err)
//         }else{
//             return response(res, true, 200, 'image uploaded successfully!',data.Location)
//         }
//     })
// }