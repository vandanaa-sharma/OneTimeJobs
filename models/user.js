
"use strict";

/** User Schema(representation) */

/** Mongoose is an object data modelling library **/
var mongoose = require('mongoose');

module.exports = mongoose.model('User', {

    name : String,
    username : String,
    email : String,
    gender : String,
    recruiter : Number,
    jobseeker : Number,
    age : Number,
    password : String,
    location : String,
    address: String

});

/** Read about valid types here - http://mongoosejs.com/docs/schematypes.html */