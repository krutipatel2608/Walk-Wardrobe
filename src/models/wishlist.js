const mongoose = require('mongoose');
const schema = mongoose.Schema;

const wishListSchema = new schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    variant_id: {
        type: schema.Types.ObjectId,
        required: true
    }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
})

module.exports = mongoose.model('wishlist',wishListSchema)