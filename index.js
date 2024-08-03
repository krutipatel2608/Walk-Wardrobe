const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const fileUpload = require('express-fileupload')
const Router = express.Router()
require('aws-sdk/lib/maintenance_mode_message').suppress = 1;

const port = process.env.PORT || 2020
require('dotenv').config()
require('./src/db-config/index')
// require('./src/models')
require('./src/firebase/firebase-config')
require('./src/aws/aws-config')

app.use(bodyParser.json())
app.use(express.json({ extended: false}))
app.use(fileUpload())


fs.readdirSync(path.join(__dirname,'/src/routes/')).forEach(function(fileName) {
    if(fileName === 'index.js' || fileName.substr(fileName.lastIndexOf('.')) !== 'js'){
        const name = fileName.substr(0,fileName.indexOf('.'))
        require('./src/routes/' + name)(app,Router)
    }
})

                   
app.listen(port, 'localhost', () => {
    console.log(`listening on server http://localhost:${port}`);
})