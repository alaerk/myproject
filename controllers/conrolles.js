const User = require('../models/user');
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');
const Notes = require('../models/notes')
const sendEmail = require('../resetPass/sendMail');
const maxAGe = 3 * 24 * 60 * 60;
const createToken = (id)=>{
    return jwt.sign({id},process.env.secret,{ expiresIn:maxAGe})
}
const getuser =async (req)=>{
     try{
        const token = req.cookies?.jwt;
        if(!token) return  null;
        const decoded = jwt.verify(token,process.env.secret);
        return await User.findById(decoded.id);
     }
     catch(err){
        return null;
     }
}
let generateCode;

module.exports.post_signup = async (req,res)=>{
    const {name,email,password} = req.body;
    try{
        const userL = await User.findOne({email});
        if(userL){
            res.status(401).json({errors:{email:"this email already exist",password:""}});
            return;
        }
        const user = await User.create({name,email,password});
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:3 * 24 * 60 * 60 * 1000 });
        res.status(201).json({user:user._id});
    }
    catch(err){
        const errors = {
            email :'',
            password:''
        }
        if(err.code === 11000){
            errors.email = 'this email already exist'
        }
        res.status(404).json({errors:errors});
    }
}
module.exports.post_login = async (req,res)=>{
     const {email,password} = req.body ;
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:3 * 24 * 60 * 60 * 1000});
        res.status(200).json({user:user._id});
    }
    catch(err){
        const errors = {
            email:'',
            password:''
        }
        if(err.message === 'This email not regester'){
            errors.email = 'This email not regester'
        }
        if(err.message === 'password incorrect'){
            errors.password = 'password incorrect';
        }
        res.status(400).json({errors});
    }
}
module.exports.post_create = async (req,res)=>{
     const {title,tag,content}= req.body;
    try{
        const u =await getuser(req);
        const id = u._id;
        const notes = await Notes.create({id,title,tag,content});
        res.status(201).json({notes});
    }
    catch(err){
        res.status(404).json({err});
    }
}
module.exports.get_afficher =async (req,res)=>{
    try{
        const id =await getuser(req);
        if(!id) return res.render('login');
        const notes = await Notes.find({id:id._id});
        res.status(200).render('afficherAllnote',{notes});
        
    }
    catch(err){
        res.status(400).json({errors:{title:'',tag:'',content:''}});
    }

}
module.exports.delete_note = async (req,res)=>{
    try{const idnote = req.params.id;
    const u = await getuser(req);const id = u._id;
    const ver = await Notes.findOneAndDelete({
        _id:idnote,id:id
    });
    if(!ver) return res.status(404).json({errors:'not found'})
    res.status(200).json({deleted:ver._id});}
   catch(err){
    res.status(404).json({errors:err.message});
   }
}
module.exports.detaille_note = async (req,res)=>{
    try{
        const id= req.params.id;
        const u = await getuser(req);const idu = u._id;
        const note = await Notes.findById({
            _id:id,id:idu
        });
        if(!note) return res.status(404).json({errors:'not found'});
        res.status(201).render('notedetaills',{note});

    }catch(err){
        res.status(404).json({errors:err.message});
    }
}
module.exports.update_note = async (req,res)=>{
    const id = req.params.id; const {title,tag,content} = req.body;
    try{
         const useId = await getuser(req);
        const note = await Notes.findOneAndUpdate({_id:id},{id:useId._id,title,tag,content},{returnDocument:'after',runValidators:true});
        if(!note) return res.status(404).json({errors:'not found'});
        res.status(201).json({note});
    }
    catch(err){
        res.status(500).json({errors:err.message});
    }
}
module.exports.update_get = async (req,res)=>{
    const {email} = req.body;
    console.log(email);
    try{
        const user = await User.findOne({email});
        if(!user) {
            res.status(404).json({err:{message:"this email is not exist"}});
            return;
        };
        const token = await createToken(user._id);
        generateCode = Math.floor(Math.random()*899999) + 100000;
        console.log(generateCode);
        console.log(token);
        const text = `Hi ${user.name} , for change Your Password enter this code ${generateCode},this code available for 5 minut`;
        try{
            await sendEmail(email,text);
        }
        catch(err){
            console.error('Email err :',err);
            res.status(404).json({err});
            return;
        }
        res.cookie('jwt',token,{httpOnly:true,maxAge:3 * 24 * 60 * 60 * 1000});
        res.json({user,code:generateCode});
    }
    catch(err){
        console.log(err);
        res.status(404).json({err});
    } 
}
module.exports.change_pass = async (req,res)=>{
    const password = req.body.password;
    try{
        const user = await getuser(req);
        if(!user){
            res.json({err:{message:'not exist a token'}});
            return;
        }
        const users = await User.findByIdAndUpdate(user._id,{name:user.name,email:user.email,password:password},{ new: true, runValidators: true });
        res.status(200).json({users});

    }catch(err){
        res.status(400).json({err});
    }
}