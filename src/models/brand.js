const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const brandModel = new Schema({
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

module.exports = mongoose.model('brand', brandModel)