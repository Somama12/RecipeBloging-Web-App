const mongoose=require("mongoose");

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:'This is required'
    },
    image:{
        type:String,
        required:'This is required'
    },
});

module.exports=mongoose.model('Category',categorySchema)
