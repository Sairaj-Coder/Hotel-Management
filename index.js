//accquiring expresss
const express=require("express");//downlaod
//using express
const app=express();
//using ejs 
const ejs = require("ejs");
//requiring mongoose
const mongoose = require('mongoose');//download
const path= require("path");

//requiring ejs-mate
const ejsmate = require('ejs-mate');

//overriding method of form action
const methodoverride = require('method-override');//download this package
app.use(methodoverride('_method'));

//npm list --depth=0 ==>it tells us number of packages install


//serving static file 
// app.use(express.static(path.join(__dirname,"/public/css")));
// app.use(express.static(path.join(__dirname,"/public/js")));
//serving entire folder
app.use(express.static(path.join(__dirname, "public")));

//requiring err
const expresserror= require("./public/err/expresserror.js")




//port is set

const port=5000;

//importing schema from other folder
const listing = require("./models/listing.js");
const { error } = require("console");
//setting view engine on absolute path
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");
//setting engine
app.engine('ejs',ejsmate);




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
        console.log("Hello website is started");
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
    // if(!req.body){//required where ever we send request throw hopscoh directly then it does throws error
    //     throw new Error(400,"Please enter valid data");//but we didn't receve proper information
    // }
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
    await listing.findByIdAndUpdate(id,data,{runValidators:true});
    res.redirect(`/listing/${id}`);

})










//Read Specific data =>this is written at the end because this route will
//detect anything incoming as id any route
////this middle ware was specially created for id length -->commenting it
app.use("/listing/:id",(req,res,next)=>{
    // throw new Error ("Accessed denied");
    console.log("Hi i am middleware I am working for you");
    let {id}=req.params;
    console.log(id.length);
    

    if ((id.length)!=24){
        // throw new Error("id Length change");
        res.redirect("/listing");
    }
    next();
})
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
app.all("/{*splat}",(req,res,next)=>{
    console.log("I am default receiver");
    throw new expresserror(404,"Sending to default error because you are on wrong path");
})



//manually default error handler 4 parameters
app.use((err,req,res,next)=>{
    let {status,message}=err;
    res.send(`hello i am error handler error code ${status},${message},${err.name} suddhare jaa`);
    // res.send(status,message,err.name);//every error has name err.name we can print it
    
})
