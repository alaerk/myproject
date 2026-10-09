const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('dotenv').config();
async function connectDB() {
    try{
        mongoose.connect(process.env.url);
        app.listen(process.env.PORT,()=>{
            console.log('connect to DB');
        });
        
    }catch(err){
        console.log(err);
    }
}
module.exports = {connectDB,app,express};