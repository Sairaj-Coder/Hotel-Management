const express = require("express");
const router = express.Router()
const listing = require("../models/listing");
const review = require("../models/review");
const expresserror = require("../public/err/expresserror");
const joii = require("../schema");
//Read all the data
router.get("/", async (req, res) => {

    const data = await listing.find();
    if (data) {
        console.log("Hello website is started");
        res.render("listing/home.ejs", { data });
        
    }
    else {
        res.send("No data found");
    }
})
//deleting specific reviews



//Create
router.get("/add", (req, res) => {
    // res.send("Request recive");
    res.render("listing/add.ejs")
})

router.post("/", async (req, res) => {
    //we can convert html data into object also by giving brackets
    let data = req.body;
    // if(!req.body){//required where ever we send request throw hopscoh directly then it does throws error
    //     throw new Error(400,"Please enter valid data");//but we didn't receve proper information
    // }
    // console.log(data);
//    let resu = joii.listingSchema.validate(req.body);
//     console.log(resu);
//     if(resu.error){
//         throw new expresserror(400,"Data Missing");
//     }
    try{
    await listing.insertOne(data)
    res.redirect("/listing");
    }
    catch(err){
        throw new expresserror(400,"Data missing")
    }

})

//update
router.get("/:id/edit", async (req, res) => {

    let { id } = req.params;
    let data = await listing.findById(id);
    res.render("listing/update", { data });
    console.log(data);

})
router.patch("/:id", async (req, res) => {
    // let resu = joii.listingSchema.validate(req.body);
    // console.log(resu);
    // if(resu.error){
    //     throw new expresserror(400,"Data Missing");
    // }
    try{
    let { id } = req.params;
    let data = req.body;
    console.log(data);
    await listing.findByIdAndUpdate(id, data, { runValidators: true });
    res.redirect(`/listing/${id}`);
    }
    catch(err){
        throw new expresserror(400,"Data missing")
    }
})





//Read Specific data =>this is written at the end because this route will
//detect anything incoming as id any route
////this middle ware was specially created for id length -->commenting it
router.use("/:id", (req, res, next) => {
    // throw new Error ("Accessed denied");
    // console.log("Hi i am middleware I am working for you");
    let { id } = req.params;
    // console.log(id.length);


    if ((id.length) != 24) {
        throw new Error(100,"id Length change");
        // res.redirect("/listing");
        // next(err);
        // res.send("Gand masti mat kar");
    
    }
    next();
})
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id).populate("reviews");
    let data2 = await review.findById(data.reviews);
    res.render("listing/read.ejs", { data });
})


//adding post

router.post("/:id/feedback",async(req,res,next)=>{
     
    try{
        let newreview = await review.insertOne(req.body);  
        let list = await listing.findById(req.params.id);
        list.reviews.push(newreview);

        await list.save();
        // console.log(ins);
        res.redirect(`/listing/${ req.params.id}`);
    }
    catch(err){
        next(err);
        console.log(`----------error--------`);
    }
   

})



//create / adding new data
//delete
router.delete("/:id/Delete", async (req, res) => {
    let { id } = req.params;
    
    let data=await listing.findByIdAndDelete(id);
    console.log(data.reviews);
    let deleteid=data.reviews
    let reviews = await review.deleteMany({_id:{$in:deleteid}})
    console.log(reviews);
    res.redirect(`/listing`);
})
//deleting specific reviews
router.delete("/:id/feedback/:reviewid",async(req,res)=>{
    let {id}=req.params;
    let {reviewid}=req.params;
    let ans=await review.deleteMany({_id:reviewid});
    // console.log(ans, `i am ans 1`);
    let ans2= await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    // console.log(ans2,`i am ans 2`);
    res.redirect(`/listing/${id}`);
})

module.exports= router;
