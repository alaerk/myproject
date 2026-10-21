const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const User= require('./user');
const app = express();
app.use(express.json());
app.use(session({
    secret:'test-secret',
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        maxAge:30 * 60 * 1000
    }
}))
app.post('/register',async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        const errors = {};
        if(!email) errors.email = 'email required';
        if(!password) errors.password = 'password required';
        return res.status(400).json({errors});
    }
    try{
        const exist = await User.finOne({email});
        if(exist) return res.status(409).json({errors:'this email was exist'});
        const hash = await bcrypt.hash(password,10);
        await User.create({email,password:hash});
        res.status(200).json({message:'user created with succeful'});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Server error'});
    }
})
app.post('/login',(req,res)=>{

})
module.exports = app;