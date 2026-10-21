const mongoose = require('mongoose');
const app = require('./app');
const url ='mongodb+srv://alaerk:1234567890987654321@alaerk.3tvvbql.mongodb.net/notes?appName=alaerk'
mongoose.connect(url).then(()=>{
    console.log("connect to DB");
    app.listen(3000,()=>{
    console.log('Listening for request');
})
})
.catch((err)=>{
    console.log(err);
})
mongoose.connection.close();
