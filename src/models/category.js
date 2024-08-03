const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryModel = new Schema({
   category_name: {
    type: String,
    require: true
   }
   
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
)

module.exports = mongoose.model('Category', categoryModel)