//accquiring expresss
const express = require("express");//downlaod
//using express
const app = express();
//using ejs 
const ejs = require("ejs");
//requiring mongoose
const mongoose = require('mongoose');//download
const path = require("path");
//cookie parser
const cookieParser = require('cookie-parser')
app.use(cookieParser())


//passport download all passport,passport local,passport local mongose

const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");

//session should be declare before
//express-session
const session= require("express-session")
app.use(session({
    secret:"secretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,//this is no longer use
        maxAge:7*24*60*60*1000,
    },
}))

//parsing data ==>middle where  
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//requiring flash to display messages
const flash = require('connect-flash');
app.use(flash());//write before dividation
//refactoring old code 

//we have to use passport after session and cookies 

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(user.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//requiring router to restruture code
const router = express.Router()
const lists = require("./routes/listing.js");

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
const expresserror = require("./public/err/expresserror.js")

//requiring joi
const joii = require("./schema.js")

//port is set

const port = 5000;

//importing schema from other folder
const listing = require("./models/listing.js");
const review = require("./models/review.js");
const { error } = require("console");

//setting view engine on absolute path
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
//setting engine
app.engine('ejs', ejsmate);




//starting mongo db server
main().then(() => {
    console.log(`Connection to database is establish`);
}).catch(() => {
    console.log(`Failed to establish connectin `)
})
//setting mongo db server
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}

//server is listening
app.listen(port, () => {
    console.log("Listing at port 5000");
})








//refactor code inheritance

app.use("/listing",lists);



//home or default request==>this show me off
// app.get("/",(req,res)=>{
//     res.send("Hello Basic setup is done");
// })






// //Read all the data
// app.get("/listing", async (req, res) => {

//     const data = await listing.find();
//     if (data) {
//         console.log("Hello website is started");
//         res.render("listing/home.ejs", { data });
        
//     }
//     else {
//         res.send("No data found");
//     }
// })
// //deleting specific reviews



// //Create
// app.get("/listing/add", (req, res) => {
//     // res.send("Request recive");
//     res.render("listing/add.ejs")
// })

// app.post("/listing", async (req, res) => {
//     //we can convert html data into object also by giving brackets
//     let data = req.body;
//     // if(!req.body){//required where ever we send request throw hopscoh directly then it does throws error
//     //     throw new Error(400,"Please enter valid data");//but we didn't receve proper information
//     // }
//     // console.log(data);
// //    let resu = joii.listingSchema.validate(req.body);
// //     console.log(resu);
// //     if(resu.error){
// //         throw new expresserror(400,"Data Missing");
// //     }
//     try{
//     await listing.insertOne(data)
//     res.redirect("/listing");
//     }
//     catch(err){
//         throw new expresserror(400,"Data missing")
//     }

// })

// //update
// app.get("/listing/:id/edit", async (req, res) => {

//     let { id } = req.params;
//     let data = await listing.findById(id);
//     res.render("listing/update", { data });
//     console.log(data);

// })
// app.patch("/listing/:id", async (req, res) => {
//     // let resu = joii.listingSchema.validate(req.body);
//     // console.log(resu);
//     // if(resu.error){
//     //     throw new expresserror(400,"Data Missing");
//     // }
//     try{
//     let { id } = req.params;
//     let data = req.body;
//     console.log(data);
//     await listing.findByIdAndUpdate(id, data, { runValidators: true });
//     res.redirect(`/listing/${id}`);
//     }
//     catch(err){
//         throw new expresserror(400,"Data missing")
//     }
// })





// //Read Specific data =>this is written at the end because this route will
// //detect anything incoming as id any route
// ////this middle ware was specially created for id length -->commenting it
// app.use("/listing/:id", (req, res, next) => {
//     // throw new Error ("Accessed denied");
//     // console.log("Hi i am middleware I am working for you");
//     let { id } = req.params;
//     // console.log(id.length);


//     if ((id.length) != 24) {
//         throw new Error(100,"id Length change");
//         // res.redirect("/listing");
//         // next(err);
//         // res.send("Gand masti mat kar");
    
//     }
//     next();
// })
// app.get("/listing/:id", async (req, res) => {
//     let { id } = req.params;
//     let data = await listing.findById(id).populate("reviews");
//     let data2 = await review.findById(data.reviews);
//     res.render("listing/read.ejs", { data });
// })


// //adding post

// app.post("/listing/:id/feedback",async(req,res,next)=>{
     
//     try{
//         let newreview = await review.insertOne(req.body);  
//         let list = await listing.findById(req.params.id);
//         list.reviews.push(newreview);

//         await list.save();
//         // console.log(ins);
//         res.redirect(`/listing/${ req.params.id}`);
//     }
//     catch(err){
//         next(err);
//         console.log(`----------error--------`);
//     }
   

// })



// //create / adding new data
// //delete
// app.delete("/listing/:id/Delete", async (req, res) => {
//     let { id } = req.params;
    
//     let data=await listing.findByIdAndDelete(id);
//     console.log(data.reviews);
//     let deleteid=data.reviews
//     let reviews = await review.deleteMany({_id:{$in:deleteid}})
//     console.log(reviews);
//     res.redirect(`/listing`);
// })
// //deleting specific reviews
// app.delete("/listing/:id/feedback/:reviewid",async(req,res)=>{
//     let {id}=req.params;
//     let {reviewid}=req.params;
//     let ans=await review.deleteMany({_id:reviewid});
//     // console.log(ans, `i am ans 1`);
//     let ans2= await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
//     // console.log(ans2,`i am ans 2`);
//     res.redirect(`/listing/${id}`);
// })

// const cookieParser = require('cookie-parser')
// app.use(cookieParser())
// app.get("/cookies",(req,res)=>{
//     res.cookie("greet","welcome");
//     let name =req.cookies;//cookies send from browser
//     console.log("cookies send");
//     res.send("Cookies are send");
// })





app.all("/{*splat}", (req, res, next) => {
    console.log("I am default receiver");
    console.log(req.cookies);//cookies will not be available until we use middleware
    throw new expresserror(404, "Page not found");
})



//manually default error handler 4 parameters
app.use((err, req, res, next) => {
    let { status, message } = err;
    // res.send(`hello i am error handler error code ${status},${message},${err.name} suddhare jaa`);
    // res.send(status,message,err.name);//every error has name err.name we can print it
    res.render("./error/error.ejs", { status, message });//going 
})
