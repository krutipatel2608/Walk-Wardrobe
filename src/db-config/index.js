const mongoose = require('mongoose')

require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('connected to database successfully!');
})
.catch((error) => {
    console.log(error);
    console.log('error while connecting to database');
})













/* postgres db connection
const Sequelize = require('sequelize')
require('dotenv').config()

const dbConnection = new Sequelize(process.env.PG_DB_URI,{
    logging : false
}
)

dbConnection.authenticate()
.then(() => {
    console.log('connected to database successfully!');
})
.catch((error) => {
    console.log('error while connecting to database');
})

dbConnection.sync({ alter: true})
.then((result) => {
    console.log('db sync successfully');
})
.catch((error) => {
    console.log('error in db sync');
})

module.exports = { dbConnection, Sequelize } 
*/