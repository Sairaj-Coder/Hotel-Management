//accquiring expresss
const express=require("express");//downlaod
//using express
const app=express();
//using ejs 
const ejs = require("ejs");
//requiring mongoose
const mongoose = require('mongoose');//download
const path= require("path");

//overriding method of form action
const methodoverride = require('method-override');//download this package
app.use(methodoverride('_method'));

//npm list --depth=0 ==>it tells us number of packages install


//port is set

const port=5000;

//importing schema from other folder
const listing = require("./models/listing.js")
//setting view engine on absolute path
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");

//starting mongo db server
main().then(()=>{
    console.log(`Connection to database is establish`);
}).catch(()=>{
    console.log(`Failed to establish connectin `)
})
//setting mongo db server
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
  }

//server is listening
app.listen(port,()=>{
    console.log("Listing at port 5000");
})


//parsing data ==>middle where  
app.use(express.urlencoded({extended:true}));
app.use(express.json());





//home or default request==>this show me off
// app.get("/",(req,res)=>{
//     res.send("Hello Basic setup is done");
// })






//Read all the data
app.get("/listing",async (req,res)=>{
    
    const data = await listing.find();
    if(data){
        console.log("Hello done")
    res.render("listing/home.ejs",{data});
    }
    else{
        res.send("No data found");
    }
})

//Create
app.get("/listing/add",(req,res)=>{
    // res.send("Request recive");
    res.render("listing/add.ejs")
})

app.post("/listing",async (req,res)=>{
    //we can convert html data into object also by giving brackets
    let data = req.body;
    console.log(data);
    await listing.insertOne(data)


    res.redirect("/listing");
})

//update
app.get("/listing/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let data = await listing.findById(id);
    res.render("listing/update",{data});
    console.log(data);

})
app.patch("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    let data=req.body;
    console.log(data);
    await listing.findByIdAndUpdate(id,data);
    res.redirect(`/listing/${id}`);

})










//Read Specific data =>this is written at the end because this route will
//detect anything incoming as id any route
//
app.get("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    let data =await listing.findById(id);
    res.render("listing/read.ejs",{data});
})

//create / adding new data
//delete
app.delete("/listing/:id/Delete",async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect(`/listing`);
})

