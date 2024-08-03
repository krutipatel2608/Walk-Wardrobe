const { initializeApp } = require('firebase/app')
const admin = require('firebase-admin')
const serviceAccount = require('../json/firebase-config.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

  const app = initializeApp(process.env.firebaseConfig);

  module.exports = admin
