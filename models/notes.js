const mongoose = require('mongoose');
const Shema = mongoose.Schema;
const notesShema = new Shema({
    id:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    tag:{
       type:String,
       required:true 
    },
    content:{
        type:String,
        required:true
    }
},{timestamps:true});

const Notes = mongoose.model('Notes',notesShema);
module.exports = Notes;