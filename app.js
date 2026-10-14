const express = require('express');
const connect = require('./config/db');
const User = require('./models/user');
const router = require('./routers/routers')
const {body,validationResult} = require('express-validator')
const authetificateJwts = require('./auths/auth');
const cookiesParser = require('cookie-parser');
const path = require('path');

require('dotenv').config();
const app = express();

connect();


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
app.get('/signup',(req,res)=>{
    // console.log(validationResult);
    res.render('signup');
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/create',authetificateJwts.authetificateJwt,(req,res)=>{
    res.render('create');
})
app.get('/303',(req,res)=>{
    res.status(429).sendFile(path.join(__dirname,'views','404.ejs'));
})
app.use(router);


app.listen(process.env.port,()=>{
    console.log('listening from the port 3000');
})
;
module.exports = app