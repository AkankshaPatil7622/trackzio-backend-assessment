const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {type : String, required : [true, "User name is required"], trim : true},
    email : {type : String, required : [true, "Email is required"], trim : true, unique : true, lowercase : true},
    role : {type : String, enum : ['Customer', 'admin'], default : 'Customer'},
    isActive : {type : Boolean, default : true},
},{timestamps:  true});

module.exports = mongoose.model('User', userSchema);