const mongoose = require('mongoose');
const schema = mongoose.Schema;

const customerSchema = new schema({
    name: String,
    phone: Number,
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email required"]
    },
    password: String,
    address: String,
    otp:{
        type: Number,
        default: null
    },
    otp_expired_time: {
        type: String,
        default: null
    },
    status: { 
        type: Boolean,
        default: true
    }

},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
})

module.exports = mongoose.model('customer',customerSchema)