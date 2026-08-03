//downlaod npm i passport-local-mongoose
const mongoose = require('mongoose');
const Schema =mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;
// import passportLocalMongoose from "passport-local-mongoose";

const userschema = new Schema({
    email :{
        type:String,
        required: true
    },
});

userschema.plugin(passportLocalMongoose);

// const user = mongoose.model('user', userschema);

// module.exports = user;
module.exports = mongoose.model('user', userschema);