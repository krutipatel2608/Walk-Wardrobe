const aws = require('aws-sdk')
require('dotenv').config()

// set the region 
aws.config.update({
    region: 'eu-west-1'
})

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
})

module.exports = { s3 }