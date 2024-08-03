const mongoose = require('mongoose');
const { Json } = require('sequelize/lib/utils');
const Schema = mongoose.Schema;

const orderDetailsSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    order_date: { type : Date, default: Date.now },
    order_no: String,
    delivery_date: { type : Date, default: null },
    product: Object,
    total_price: Number,
    discount_price: {
        type: Number,
        default: null
    },
    final_price: Number,
    address: String,
    quantity: Number,
    status: {
        type: Boolean,
        default: true
    },
    order_status: {
        type: String,
        enum: ['pending', 'out for delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    delivered_date: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        versionKey: false
    })

module.exports =  mongoose.model('order_details',orderDetailsSchema)
