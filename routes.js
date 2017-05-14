    
    /** Routes to general (not user or data specific) pages */
    "use strict";

    var fileSystem = require('fs');
    /** body-parser is a module that let's you iterate over the html document tree to read response especially in case of input fields **/
    var parser = require('body-parser');
    var urlencodedParser = parser.urlencoded({extended : false});
    var cookieParser = require('cookie-parser');

    var passport = require('passport');
    var Account = require('./models/user.js');
    var LocalStrategy = require('passport-local').Strategy;

    var routes = function (app, mydb)
    {
        app.get('/', function(request,response)
        {
            _serverLog("Request received for homepage " + Date.now());
            response.sendFile(__dirname + "/public/html/" + "index.html" );
        });	
        
        app.get('/signup', function(request,response)
        {
            if(request.session.passport != undefined)
                if(request.session.passport.user)
                     response.send("You are signed in. Log out to register another user");
            _serverLog("Request received for sign up "+ Date.now());
            response.sendFile(__dirname + "/public/html/" + "signup.html" );
        });
        
        app.get('/wiki', function(request,response)
        {
            _serverLog("Request received for wiki " + Date.now());
            response.sendFile(__dirname + "/public/html/" + "wiki.html" );
        });	
        
        // app.post('/signup',passport.authenticate('signup', { successRedirect : '/registration-successful',				
        //                                                      failureRedirect : '/signup',
        //                                                      failureFlash : 'Invalid username or password'}));

        app.post('/signup', urlencodedParser, function(request,response)
        {	
            _serverLog("New request user received");
            Account.register(new Account({username : request.body.username}), request.body.password,
            function(error) 
            {
                if (error) 
                {
                    console.log('Something went wrong!', error);
                    if(error.name == "UserExistsError")
                    {
                            /** TODO - redirect to user exists - sign in page */
                            response.send("User exists");
                    }
                }
                 var user = 
                    {
                        name : request.body.name,
                        username : request.body.username,
                        email : request.body.email,
                        gender : request.body.gender,
                        recruiter : request.body.recruiter,
                        jobseeker : request.body.job_seeker,
                        age : request.body.age,
                        contactnumber: request.body.contactnumber,
                        location : request.body.location,
                        address: request.body.address
                    }
            
            _serverLog(JSON.stringify(user));

            /** Add user to database **/	
            mydb.collection('users').insert(user, function(error, data)
            {
                if(error)
                    _serverLog("FATAL - Something went wrong, user not added");
                else
                    _serverLog("User added to database successfully");
            });       
            console.log('User registered!');
            /** TODO - change window url */
            user.message = "Registration successful!"
            response.render('index', { user: user});
            });  
        });
        
        /** For admins only - list of all users **/
        /** TODO - add admin authentication to this page **/
        app.get('/users', function(request,response)
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

        app.get('/signin', function(request,response)
        {
            _serverLog("Request received for login " + Date.now());
            response.sendFile(__dirname + "/public/html/" + "signin.html" );
        });	

        app.post("/authenticate", urlencodedParser, passport.authenticate('local'), function (request, response)
        {
            var userURI = encodeURIComponent(request.body.username);         
            response.redirect('/profiles/?user=' + request.body.username)                           
        });

        app.get('/profiles', function (request, response)
        {
            if(!request.session.passport)
                response.send("Please log in to view your profile");
            else if(request.session.passport && !request.session.passport.user)
                response.send("Please log in to view your profile");

            mydb.collection('users').findOne( {"username": request.query.user}, function(err, user)
            {
              if(err || !user) 
              {
                /* TODO - reload log in page with error message */
                 response.redirect('/signin' );
              }
              else if(user)
              {
                 response.render('index', { user: user});
              }
            })
    });
          
 
    app.get('/signout', function(request,response) 
    {
        request.logout();
        response.redirect('/signin');
    });
                             
    }

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

    module.exports = routes;