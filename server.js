	var express = require('express');
	var app = express();
	var parser = require('body-parser');
	var fileSystem = require('fs');
	/** body-parser is a module that let's you iterate over the html document tree to read response especially in case of input fields **/
	var urlencodedParser = parser.urlencoded({extended : false});
	/** Use mongodb database **/
	var mongoClient = require('mongodb').MongoClient;
	var assert = require('assert');
	
	/** URL for the local database - mongodb://localhost:27017/test**/
	/** URL for heroku - mongodb://<dbuser>:<dbpassword>@ds153730.mlab.com:number/database_name **/
	/** Use Commands - SET MONGOLAB_URI=url (for Local database )
	heroku config:set --app AppName url (heroku)
	**/
	var url = process.env.MONGOLAB_URI;
	
	/** Use url to connect to database **/
	mongoClient.connect(url, function(error, db)
	{
		assert.equal(null, error);
		_serverLog("Correctly connected to database server");
		/** Create a database collection for registered users - if you use {strict:true} as second argument it will throw an 
		error if collection already exists. Otherwise do nothing **/
		db.createCollection('users', function(error, collection) {});
		/** For mydb and collection - not using "var" here makes this variable global **/
		collection = db.collection('users');		
		mydb = db;

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
		response.sendFile(__dirname + "/public/" + "form.html" );
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
		try
		{
			collection.insert(user, function(error, data)
			{
				if(error)
					_serverLog("FATAL - Something went wrong, user not added");
				else
					_serverLog("User added to database successfully");
			});
		}
		catch(error)
		{
			_serverLog("FATAL - Something went wrong, user not added");
			/** TODO - Revert the user to the registration page with flash error **/
		}
		
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
	
	/** For admins only - list of all users **/
	/** TODO- add admin authentication to this page **/
	app.get('/users.html', function(request,response)
	{
		_serverLog("Request received for users list");
		mydb.collection('users').find({}).toArray(function(error, data)
		{
			if (error) 
				;
			else 
				response.status(200).json(data);
		});
		//db.getCollection('users').find().forEach("do something"); 
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