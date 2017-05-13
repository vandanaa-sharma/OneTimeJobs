	
	/** Requirements **/
	"use strict";

	var express = require('express');
	var parser = require('body-parser');
	var fileSystem = require('fs');
	/** body-parser is a module that let's you iterate over the html document tree to read response 
	    especially in case of input fields **/
	var urlencodedParser = parser.urlencoded({extended : false});
	/** Use mongodb database **/
	var mongoClient = require('mongodb').MongoClient;
	/** Object Data Modeller for database */
	var mongoose = require('mongoose');
	var assert = require('assert');
	/** Use passport for authentication */
	var passport = require('passport');
	/** Read deplyment based configuration settings **/
	var config = require('./config')();			// './' is used here because it is a local module
	var session = require('express-session');
	var flash = require('connect-flash');		// used for flash messages during authentication
	var cookieParser = require('cookie-parser');
	/** Render elements using pug/jade*/
	var pug = require('pug');

/** ========================================== MONGODB - Database ================================================= **/

	/** URL for the local database - mongodb://localhost:27017/test**/
	/** URL for heroku - mongodb://<dbuser>:<dbpassword>@dsxxxxx.mlab.com:xxxxx/database_name **/
	/** Use Commands - SET MONGOLAB_URI=url (for Local database )
	heroku config:set --app AppName MONGOLAB_URI=url (heroku)
	**/
	var url = process.env.MONGOLAB_URI || config.database;
	var mydb, collection;

	/** Use url to connect to database **/
	mongoClient.connect(url, function(error, db)
	{
		assert.equal(null, error);
		_serverLog("Correctly connected to database server");
		/** Create a database collection for registered users - if you use {strict:true} as second argument 
		it will throw an error if collection already exists. Otherwise do nothing **/
		db.createCollection('users', function(error, collection) {});
		collection = db.collection('users');		
		mydb = db;
		/** Routes are initialised only when database is initialised */
		require('./routes.js')(app, passport, mydb);
		if(error)
		{
			_serverLog(error.stack);			
			_serverLog("Database could not initialised, please try again later");
			db.close();
		}
	});
	/** Connect mongoose to database */
	mongoose.connect(url);	

/** ============================================================================================================== **/
	
	
/** ========================================== EXPRESS ================================================= **/
	
	/** Intialise app  */
	var app = express();

	/** Using express.static middleware - express,static is built-in middleware **/
	/** This loads images, javascript and css files on the browser **/
	app.use(express.static(__dirname + '/public'));   
	//app.use(express.static(__dirname + '/logs'));			// Not being used now

	require('./config/passport.js')(passport);
	/** Passport for authentication **/
	app.use(session({secret:'sessionSecret'}));
	app.use(passport.initialize());
	app.use(passport.session());				// To support persistent sessions 

	app.use(flash());
	app.use(cookieParser());

	/** Set view engine */
	app.set('views', __dirname +"\\views");
	app.set('view engine', 'pug');

	/** Handle errors */
	app.use(function(err, req, res, next) {
    	console.log(err);
	});

	/** Express security - disable "x-powered-by" header*/
	/** TODO - use helmet */
	app.disable('x-powered-by')

/** ======================================================================================================================= **/


/** ========================================== PORT ================================================= **/
	
	/** process.env.PORT - Port correction made for heroku **/
	const PORT = process.env.PORT || config.port;
	var server = app.listen(PORT, function() {
		var port = server.address().port
		console.log('App is running, server is listening on port ', port);
	});

/** =================================================================================================================== **/


/** ============================================= LOGGER =============================================================== **/
	function _serverLog(message)
	{
		console.log(message);
		var date = new Date();
		var timeStamp = date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes();
		message = message + "  " + timeStamp + "\r\n";
		/** The argument {'flags': 'a+'} opens file for reading and appending so that existing data is not overwritten **/
		fileSystem.appendFile(__dirname + '/logs/server_log.txt', message, 'utf-8', {'flags': 'a+'}, function (error) 
		{
			// Do nothings
		});
	}
	
/** ==================================================================================================================== **/