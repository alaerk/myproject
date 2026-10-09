const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const user = new mongoose.Schema({
    faalName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
})
user.pre('save',async function (){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
})

const User = mongoose.model('User',user);
module.exports = User;