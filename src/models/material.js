const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const materialModel = new Schema({
    name: String,
    description: String,
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

module.exports = mongoose.model('material', materialModel)