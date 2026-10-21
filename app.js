require('dotenv').config();
const express = require('express');
const connect = require('./config/db');
const User = require('./models/user');
const router = require('./routers/routers')
const {body,validationResult} = require('express-validator')
const authetificateJwts = require('./auths/auth');
const cookiesParser = require('cookie-parser');
const path = require('path');
const {rateLimit} = require('express-rate-limit');
const multer = require('multer');
const session = require('express-session');
const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'upload/');
    },
    filename:function (req,file,cb){
        cb(null,Date.now() + '-' + file.originalname)
    }
})
const upload = multer({storage})
const authLimiter = rateLimit({
    windowMs:5 * 60 * 1000,
    limit:5,
    // standardHeaders:true,
    // legacyHeaders:false,
    // message:{error:'too many time to arrive to this webs'}
    handler:(req,res)=>{
        res.redirect('/error');
    }
})

const app = express();

connect();
app.use(session({
    secret:process.env.secret,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        maxAge:1000 * 60 * 60
    }
}))

app.use(express.json());
app.set('view engine','ejs');
app.use(cookiesParser())
app.set('trust proxy',1);
// app.use('*',authetificateJwts.getUser);
//  ,(req,res)=>{
//     const error = {
//         message:'too many time to arrive to this webs'
//     }
//     res.status(429).json({error})
// }
app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/home',(req,res)=>{
    res.render('home');
})
app.get('/signup',authLimiter,(req,res)=>{
    // console.log(validationResult);
    res.render('signup');
})
app.get('/login',authLimiter,(req,res)=>{
    res.render('login');
})
app.get('/create',authetificateJwts.authetificateJwt,(req,res)=>{
    res.render('create');
})
app.get('/error',(req,res)=>{
    res.status(429).render('404');
})
app.post('/api/upload',upload.single('file'),(req,res)=>{
    res.json(req.file);
})
app.get('/login/forgetPass',(req,res)=>{
    res.render('forgetpass');
})

app.use(router);


app.listen(process.env.port,()=>{
    console.log('listening from the port 3000');
})
;
module.exports = app