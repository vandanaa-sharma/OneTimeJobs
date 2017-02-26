	var express = require('express');
	var app = express();
	var parser = require('body-parser');
	var fileSystem = require('fs');
	/** body-parser is a module that let's you iterate over the html document tree to read response especially in case of input fields **/
	var urlencodedParser = parser.urlencoded({extended : false});
	app.get('/', function(request,response)
	{
		_serverLog("Request received for homepage " + Date.now());
		response.sendFile(__dirname + "/" + "form.html" );
	});	
	app.get('/form.html', function(request,response)
	{
		_serverLog("Request received for registration");
		response.sendFile(__dirname + "/" + "form.html" );
	});
	app.post('/post_form', urlencodedParser, function(request,response)
	{
		_serverLog("New request user received");
	    console.log("New request user received");
		response.sendFile(__dirname + "/" + "registration_successful.html");
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
		console.log(user);
		//response.end(JSON.stringify(user)); /** send json to browser **/
		/** For newline use - "\r\n" in JavaScript **/
		user = JSON.stringify(user) + "\r\n";
		/** Note that you are using "fileSytem.appendFile" instead of "writeFile here to prevent overwriting **/
		fileSystem.appendFile('./users,json', JSON.stringify(user), 'utf-8', {'flags': 'a+'}, function(error)
		{
			if(error)
			{
				_serverLog(error.stack);
				console.log(error.stack);
			}
		    else
			{
				_serverLog("User added to database");
				console.log("User added to database");
			}
		})
		
	});
	var server = app.listen(8081, function(request, response)
	{
		var data = "Server runnning on - " +  server.address().port;
		_serverLog(data);
		console.log(data);
	});
	
function _serverLog(data)
{
	var date = new Date();
    var timeStamp = date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes();
	data = data + "  " + timeStamp + "\r\n";
	/** The argument {'flags': 'a+'} opens file for reading and appending so that existing data is not overwritten **/
	fileSystem.appendFile('server_log.txt', data, 'utf-8', {'flags': 'a+'}, function (error) 
	{
		// Do nothing
	});
}