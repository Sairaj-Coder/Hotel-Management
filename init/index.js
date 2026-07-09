const mongoose = require('mongoose');
const initdata = require("./data.js");
const listings = require("../models/listing.js");

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
  }
main().then(()=>{
    console.log("connection establish");
})
.catch((err)=>{
    console.log(err);
});
const init = async ()=>{
    await listings.deleteMany({});
    console.log("Delete successfull");
    await listings.insertMany(initdata.data);
    console.log("successfull");
}
init().then((res)=>{
    console.log("successfull");
})
.catch((error)=>{
    console.log(error);
})