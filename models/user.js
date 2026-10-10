const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const user = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});
user.pre('save',async function(){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
})
user.statics.login = async function(email,password){
    const users = await this.findOne({email});
    if(users){
        const verifie = await bcrypt.compare(password,users.password);
        if(verifie){
            return users;
        }
        throw Error('password incorrect');
    }
    throw Error('This email not regester');
}
const User = mongoose.model('User',user);
module.exports = User;