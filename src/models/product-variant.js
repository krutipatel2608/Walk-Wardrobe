const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productVariantModel = new Schema({
    color_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'color'
    },
    size_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'size'  
    },
    main_image: String,
    sub_image: Array,
    base_price: Number,
    selling_price: Number,
    model_no: String,
    stock: Number,
    status: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
)

module.exports = productVariantModel