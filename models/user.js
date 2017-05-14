
"use strict";

/** User Schema(representation) */

/** Mongoose is an object data modelling library **/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User =  new Schema({
    username : String,
    password : String,
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);

/** Read about valid types here - http://mongoosejs.com/docs/schematypes.html */