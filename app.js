const express = require('express');
const connect = require('./config/db');
const User = require('./models/user');
const router = require('./routers/routers')
const {body,validationResult} = require('express-validator')
const authetificateJwts = require('./auths/auth');
const cookiesParser = require('cookie-parser');
require('dotenv').config();
const app = express();
connect();



app.listen(process.env.port,()=>{
    console.log('listening from the port 3000');
})
app.use(express.json());
app.set('view engine','ejs');
app.use(cookiesParser())
// app.use('*',authetificateJwts.getUser);
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
// app.get('/afficherAllnote',authetificateJwts.authetificateJwt,(req,res)=>{
//     res.render('afficherAllnote');
// })
// app.get('/afficherAllnote/:id',authetificateJwt,(req,res)=>{
//     const id = req.params.id;

// })
app.use(router);