const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productVariantModel = require('./product-variant')

const productModel = new Schema({
    name: String,
    description: String,
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subcategory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand'
    },
    material_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'material'
    },
    status: {
        type: Boolean,
        default: true
    },
    variants: [productVariantModel] 
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        versionKey: false
    }
);

module.exports = mongoose.model('product', productModel)