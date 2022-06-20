const mongoose =require("mongoose")
const PostSchema=mongoose.Schema({
    imageurl:{
        type:String,
    },
    photourl:{
        type:String,
    },
    message:{
        type:String,
        
    },
    username:{
        type:String,
        
    },
    timestamp:{
        type:Date,
        default:Date.now()
    }

},{timestamps:true})

module.exports=mongoose.model('posts',PostSchema);

