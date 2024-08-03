const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const superAdminModel = new Schema({
    name:{
        type:String,
        require: true
    } ,
    address: {
        type: String,
        require: true,
    },
    phone_no:{
        type: String,
        require: true
    } ,
    email:{
        type: String,
        // unique: true,
        // validate: {
        //     validator: function(v) {
        //         return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        //     },
        //     message: "Please enter a valid email"
        // },
        require: true
    },
    password: {
       type: String,
       require: true,
}
},
{ 
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
 },

)

const superAdmin = mongoose.model('super_admin', superAdminModel)
module.exports = superAdmin