const express =require("express")
const app=express()
const port=process.env.PORT || 5001;
const mongoose =require('mongoose')
const multer=require('multer')
const cors=require('cors')
require('dotenv').config()
const posts =require("./dbModel.js") 
const path=require("path")


//db
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1242197",
  key: "61c322cd7d8c129d35de",
  secret: "2bd930d425208a4ae4c2",
  cluster: "ap2",
  useTLS: true
});
const dbUrl=process.env.MONGODB_URL;
mongoose.connect(dbUrl,{
    useCreateIndex:true,
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:false,
}).then(()=>{
    console.log(" db Connected ")
}).catch((e)=>console.log(e))


mongoose.connection.once('open',()=>{
    console.log("DB connected")
   const changestrem= mongoose.connection.collection('posts').watch();
   changestrem.on('change',(change)=>{
    pusher.trigger("mypost", "myNewpost", {
        'change': change
      });
   })


})
//md
const staticPath=path.join(__dirname,'images')
console.log(staticPath)
// app.use(express.static(path.join(__dirname,'images')))
app.use('/images',express.static(staticPath))
app.use(express.json())

app.use(express.urlencoded({extended: true}));
app.use(cors())



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './images')
    },
    filename: function (req, file, cb) {
      cb(null,   Date.now()+'--'+ file.originalname)
     
      
    }
})
const upload = multer({ storage: storage })




//routes
app.get('/',(req,res)=>{
    res.send("hello")
})
app.post('/add/post',upload.single("profile-image"),(req,res)=>{
    const dbData=req.body;
    console.log("dbData.message-->",dbData.message)
    
    console.log(dbData.username)
   
    console.log("req.file-->>",req.file)
    console.log("dbdata",dbData)
    
    
    let myfilename;
    //to handle filename undefined
    if(req.file.filename==='undefined'){
        let myfilename="";

    }else{
        myfilename=req.file.filename;
    }
    const NewPost= new posts({
        username:dbData.username,
        message:dbData.message,
        photourl:dbData.uPhoto,
        imageurl:myfilename,
    })
    NewPost.save().then((result)=>{
        return res.status(201).send(result)
    }).catch((e)=>{
        return res.status(400).send(e)
    })
  
})

app.get('/get/post',(req,res)=>{
    posts.find({},(err,data)=>{
        if(err){
            return res.status(400).json({msg:"post not fetch"})
        }else{
            // data.sort((b,a)=>{
            //     return a.timestamp-b.timestamp;
            // })
            console.log(data)
            return res.status(200).send(data)
        }
    })
})
//app listen port
app.listen(port,()=>{
    console.log(`server run on port ${port}`)
})
// HhTlBQXYvm65syk9
//mongodb+srv://admin:<password>@cluster0.ri9sb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
