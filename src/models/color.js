const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const colorModel = new Schema({
    name: String,
    color_code: String,
    status: {
        type: Boolean,
        default: true
    }  
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        versionKey: false
    }
);

module.exports = mongoose.model('color', colorModel)