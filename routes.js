    
    /** Routes to general (not user or data specific) pages */
    "use strict";

    var fileSystem = require('fs');
    /** body-parser is a module that let's you iterate over the html document tree to read response especially in case of input fields **/
    var parser = require('body-parser');
    var urlencodedParser = parser.urlencoded({extended : false});
    var cookieParser = require('cookie-parser');

    /** Temporary session validator */
    var signedin = 0;
    var sessionuser="";

    var routes = function (app, passport, mydb)
    {
        app.get('/', function(request,response)
        {
            _serverLog("Request received for homepage " + Date.now());
            response.sendFile(__dirname + "/public/html/" + "index.html" );
        });	
        
        app.get('/signup', function(request,response)
        {
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
            /** Check if email already exists in database */
            var exists = mydb.collection('users').find({ email: request.body.email }).user;
            if(exists)
            {
                _serverLog("User exists in database");
                response.sendFile(__dirname + "/public/html/" + "signup.html");
                return;
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
                password : request.body.password,
                location : request.body.location,
                address: request.body.address
            }
            
            _serverLog(JSON.stringify(user));

            /** Add user to database **/	
            try
            {
                mydb.collection('users').insert(user, function(error, data)
                {
                    if(error)
                        _serverLog("FATAL - Something went wrong, user not added");
                    else
                        _serverLog("User added to database successfully");
                });
                response.sendFile(__dirname + "/public/html/" + "registration-successful.html");
            }
            catch(error)
            {
                _serverLog(error.stack);
                _serverLog("FATAL - Something went wrong, user not added");
                /** TODO - Revert the user to the registration page with flash error **/
            }
            
            //response.end(JSON.stringify(user)); /** send json to browser **/
            
            // /** For newline use - "\r\n" in JavaScript **/
            // user = JSON.stringify(user);
            // /** Note that you are using "fileSytem.appendFile" instead of "writeFile" here to prevent overwriting **/
            // user += "     |     ";
            
            // /** Temporary session wise heroku logs **/
            // fileSystem.appendFile(__dirname + '/logs/users.txt', JSON.stringify(user), 'utf-8', {'flags': 'a+'}, function(error)
            // {
            //     if(error)
            //         _serverLog(error.stack);
            //     else
            //         ; //_serverLog("User added to database");
            // });
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

        /** Temporary sign in  */
        app.post("/signin", urlencodedParser, function (request, response)
        {
             response.redirect('/profiles/' + request.body.username)      
        });

        app.get('/profiles/:username', urlencodedParser, function (request, response)
        {
          // ,{"password": request.query['password']}
          mydb.collection('users').findOne( {$and:[{"username": request.params.username}]}, function(err, user)
          {
              if(err || !user) 
              {
                /* TODO - reload log in page with error message */
                response.sendFile(__dirname + "/public/html/" + "signin.html" );
              }
              else if(user)
              {
                 response.render('index', { user: user});
              }
          });
        });
          
 
        app.get('/signout', function(request,response) 
        {
            /** TODO  */
            response.sendFile(__dirname + "/public/html/" + "signin.html" );
        });

        /** Authentication using middleware - passport **/
        /** TODO - handle success redirect **/
        // app.post("/login",  passport.authenticate('signin', { successRedirect : '/',				
        //                                                       failureRedirect : '/signin',
        //                                                       failureFlash : 'Invalid username or password'}));
                             
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