const mongoose = require('mongoose');
const notes = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:Stirng,
        required:true
    },
    category:{
        type:String
    },
    isPinned:{
        type:Boolean,
        default:false
    }
},{timestamps:true});
const Notes = mongoose.model('Notes',notes);
module.exports = Notes;