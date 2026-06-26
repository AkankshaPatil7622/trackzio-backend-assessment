const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId : {type : mongoose.Schema.Types.ObjectId, ref : 'Product', required : true},
    quantity : {type : Number, required : true, min : [1, "Quantity must be atleast 1"],default : 1},
    priceAtaddition : {type : Number, required : true}
},{_id : false});


const cartSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId,ref : 'User', required : true,unique : true },
    items : [cartItemSchema],
    subTotal : {type : Number, required : true, default : 0},
    discountAmount : {type : Number, required : true, default : 0},
    grandTotal : {type : Number, required : true,default : 0},
    appliedCompaign : {type : String, default : null}
});

module.exports = mongoose.model('Cart',cartSchema);
