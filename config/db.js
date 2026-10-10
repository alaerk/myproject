const mongoose = require('mongoose');
async function connection() {
    mongoose.connect(process.env.url)
    .then((result)=>{
        console.log('Connected to DB');
    })
    .catch(err=>{
        console.log(err);
    })
}
module.exports = connection;