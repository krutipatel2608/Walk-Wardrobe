const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategoryModel = new Schema({
   subcategory_name: {
    type: String,
    require: true
   },
   category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    require: true
   }
   
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
)

module.exports = mongoose.model('Subcategory', subcategoryModel)