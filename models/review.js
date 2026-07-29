
const mongoose = require('mongoose');
const schema =mongoose.Schema;
const reviewSchema = new schema({
    title:{
        type:String,
        require:true,
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        require:true,
    },
    created:{
        type:Date,
        default:Date.now(),
        require:true,
    }

})
const review  = mongoose.model("review", reviewSchema);

module.exports = review;