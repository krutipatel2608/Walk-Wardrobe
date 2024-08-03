const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const sizeModel = new Schema({
    name: String,
    size_code: String,
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

module.exports = mongoose.model('size', sizeModel)