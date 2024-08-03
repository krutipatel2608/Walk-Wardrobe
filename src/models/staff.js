const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffModel = new Schema({
    name: {
       type: String,
       require: true
    },
    address: {
        type: String,
        require: true
    },
    phone:{
        type: String,
        require: true
    } ,
    email:{ type: String,
        require: true
        // unique: true,
        // validate: {
        //     validator: function(v) {
        //         return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        //     },
        //     message: "Please enter a valid email"
        // },
    },
    password: {
        type: String,
        require: true
    },
    joining_date: Date,
    salary: String,
    image: String,
    annual_leave: String
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
)

module.exports = mongoose.model('staff', staffModel)