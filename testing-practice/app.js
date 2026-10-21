const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User= require('./user');

const app = express();

const createToken = (id)=>{
    return jwt.sign({id},process.env.secret,{expiresIn:3 * 24 * 60 * 60});
}
app.use(express.json());
app.use(session({
    secret:process.env.secret,
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
        const exist = await User.findOne({email});
        if(exist) return res.status(409).json({errors:'this email was exist'});
        const hash = await bcrypt.hash(password,10);
        await User.create({email,password:hash});
        res.status(200).json({message:'user created with succeful'});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Server error'});
    }
})
app.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    try{
        if(!email || !password){
            const errors = {};
            if(!email) errors.email = 'email required';
            if(!password) errors.password = 'Password required';
            res.status(400).json({errors});
            return;
        }
        const user = await User.findOne({email});
        if(!user){
            res.status(401).json({massage:'user or password incorrect'});
            return;
        }else{
            const verify = await bcrypt.compare(password,user.password);
            if(!verify) {
                res.status(401).json({massage:'user or password incorrect'});
                return;
            }
        }
        const token =  createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:3 * 24 * 60 * 60 * 1000});
        res.status(200).json({user});
    }catch(err){
        res.status(500).json({message:err.message});
    }
})
module.exports = app;