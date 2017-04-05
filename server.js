	var express = require('express');
	var app = express();
	var parser = require('body-parser');
	var fileSystem = require('fs');
	/** body-parser is a module that let's you iterate over the html document tree to read response especially in case of input fields **/
	var urlencodedParser = parser.urlencoded({extended : false});
	/** Use mongodb database **/
	var mongoClient = require('mongodb').MongoClient;
	var assert = require('assert');
	
	/** URL of the local database - uncomment this and comment heroku's url to test locally **/
	//var url = 'mongodb://localhost:27017/test';
	/** URL for heroku database **/
	/** TODO - Make this - process.env.MONGOLAB_URI work **/	
	var url = 	"mongodb://vandanasharma536:mongodbpassword@ds153730.mlab.com:53730/heroku_rdxczr3d";	//process.env.MONGOLAB_URI;	
	// Run heroku config:set MONGOLAB_URI=mongodb://vandanasharma536:mongodbpassword@ds153730.mlab.com:53730/heroku_rdxczr3d to set this variable
	// Add yourself as a user here - https://www.mlab.com/databases/heroku_rdxczr3d#users to get these credentials

	/** Use url to connect to database **/
	mongoClient.connect(url, function(error, db)
	{
		assert.equal(null, error);
		//_serverLog("Correctly connected to database server");
		/** Create a database collection for registered users - if you use {strict:true} as second argument it will throw an 
		error if collection already exists. Otherwise do nothing **/
		db.createCollection('users', function(error, collection) {});
		/** Users collection - not using "var" here makes this variable global **/
		collection = db.collection('users');
		
		if(error)
		{
			_serverLog("Database could not initialised, please try again later");
			return;
		}
		//db.close();
	});
	
	/** Using express.static middleware - express,static is built-in middleware **/
	app.use(express.static(__dirname + '/public'));   /** Images **/	
	/** This loads the javascript and css files in the html form **/
	app.use(express.static(__dirname + '/css'));
	app.use(express.static(__dirname + '/js'));
	app.use(express.static(__dirname + '/logs'));
	
	app.get('/', function(request,response)
	{
		_serverLog("Request received for homepage " + Date.now());
		response.sendFile(__dirname + "/" + "form.html" );
	});	
	app.get('/form.html', function(request,response)
	{
		_serverLog("Request received for registration");
		response.sendFile(__dirname + "/public/" + "form.html" );
	});
	app.post('/post_form', urlencodedParser, function(request,response)
	{
		_serverLog("New request user received");
		response.sendFile(__dirname + "/public/" + "registration_successful.html");
		user = 
		{
			name : request.body.name,
			gender : request.body.gender,
			recruiter : request.body.recruiter,
			jobseeker : request.body.job_seeker,
			age : request.body.age,
			password : request.body.password,
			location : request.body.location,
			address: request.body.address
		}
		
		_serverLog(JSON.stringify(user));

		/** Add user to database **/
		collection.insert(user, function(error, data)
		{
			if(error)
				_serverLog("FATAL - Something went wrong, user not added");
			else
				_serverLog("User added to database successfully");
		});

		//response.end(JSON.stringify(user)); /** send json to browser **/
		
		/** For newline use - "\r\n" in JavaScript **/
		user = JSON.stringify(user);
		/** Note that you are using "fileSytem.appendFile" instead of "writeFile" here to prevent overwriting **/
		user += "     |     ";
		/** Temporary session wise heroku logs **/
		fileSystem.appendFile(__dirname + '/logs/users.txt', JSON.stringify(user), 'utf-8', {'flags': 'a+'}, function(error)
		{
			if(error)
				_serverLog(error.stack);
		    else
				; //_serverLog("User added to database");
		});
		
	});
	/** Port correction made for heroku **/
	const PORT = process.env.PORT || 8080;
	var server = app.listen(PORT, function() {
		var port = server.address().port
		console.log('App is running, server is listening on port ', port);
	});
	
	function _serverLog(data)
	{
		console.log(data);
		var date = new Date();
		var timeStamp = date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes();
		data = data + "  " + timeStamp + "\r\n";
		/** The argument {'flags': 'a+'} opens file for reading and appending so that existing data is not overwritten **/
		fileSystem.appendFile(__dirname + '/logs/server_log.txt', data, 'utf-8', {'flags': 'a+'}, function (error) 
		{
			// Do nothing
		});
	}