const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentModel = new Schema({
    razorpay_order_id: String,
    razorpay_payment_id: String,
    method: {
        type: String,
        default: null
    },
    reason: {
        type: String,
        default: null
    },
    total_amount: Number,
    payment_status: {
        type: String,
        default: 'cancel'
    },
    discount_percentage: {
        type: Number,
        default: null
    },
    discount_amount: {
        type: Number,
        default: null
    },
    grand_total: Number,
    currency: String,
    wallet: {
        type: String,
        default: null
    },
    // payment_type: String,
    is_amount_refunded: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
    versionKey: false
}
)

module.exports = mongoose.model('payment', paymentModel)