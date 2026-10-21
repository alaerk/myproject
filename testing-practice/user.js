const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})
const User = mongoose.model('User',user);
module.exports = User;