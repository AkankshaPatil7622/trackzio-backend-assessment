const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title : {type : String, required : [true, "Product name is required"], trim  : true},
    sku : {type : String,required : [true, "SKU identifier is required"], unique : true},
    price : {type : Number, required : [true, "Price is required"], min : [0, "Price cannot be negative"]},
    category : {type : String, required : [true, "Category is required"], trim : true},
    inventory : {type : Number, required : [true, 'Stock count is required'], min : [0, 'Stock cannot be negative'],default : 0},

},{timestamps : true});

module.exports = mongoose.model('Product',productSchema);