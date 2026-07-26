
const mongoose = require('mongoose');
const schema =mongoose.Schema;
const reviewSchema = new schema({
    title:string,
    rating:{
        type:Number,
        min:0,
        max:5,
    },
    created:{
        type:date,
        default:Date.now(),
    }

})
const review  = mongoose.model("review", reviewSchema);

module.exports = review;