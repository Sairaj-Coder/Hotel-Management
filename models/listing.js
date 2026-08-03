
const mongoose = require('mongoose');
const Schema =mongoose.Schema;
const { required } = require('joi');
const link="https://images.unsplash.com/photo-1783282189315-c40b1f387333?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const listingSchema = new Schema({
    title:{ 
        type:String,
        required:true,
    },
    description:{ 
        type:String,
        required:true,
    },
    image:{  
        type: String,
        default:link,
        set:(v)=>v===""? link : v ,
    },
    price:{
        type:Number,
        required:true,

    },
    location:{
        type:String,
        required:true,
    },

    country:{
        type:String,
        required:true,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"review",
        required:true,
    }]
});

const listing  = mongoose.model("listing", listingSchema );
module.exports = listing; 
