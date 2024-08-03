const mongoose = require('mongoose');
const schema = mongoose.Schema;

const cartSchema = new schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },
    product: [{
      product_id : mongoose.Schema.Types.ObjectId,
      variant_id: mongoose.Schema.Types.ObjectId,
      qty: Number,
      amount: Number,
      size: {
        type: String,
        ref: 'size'
      },
      discount: {
        type: Number,
        default: 0
    },
  }],
    quantity: Number,
    total: Number
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false
})

module.exports = mongoose.model('cart',cartSchema)