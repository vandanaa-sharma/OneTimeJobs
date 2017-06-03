    
    /** Routes to general (not user or data specific) pages */
    "use strict";

    var fileSystem = require('fs');
    /** body-parser is a module that let's you iterate over the html document tree to read response especially in case of input fields **/
    var parser = require('body-parser');
    var urlencodedParser = parser.urlencoded({extended : false});
    var cookieParser = require('cookie-parser');
    /** Send email on git push */
    var nodemailer = require('nodemailer');

    var passport = require('passport');
    var Account = require('./models/user.js');
    var LocalStrategy = require('passport-local').Strategy;

    var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USERNAME, 
                pass: process.env.GMAIL_PASSWORD
            }
    });

    var routes = function (app, mydb)
    {
        app.get('/', function(request,response)
        {
            _serverLog("Request received for homepage " + Date.now());
            response.sendFile(__dirname + "/public/html/" + "index.html" );
        });	
        
        app.get('/signup', function(request,response)
        {
            if(request.isAuthenticated())
            {
                response.send("You are signed in. Log out to register another user");
                return;
            }              
            _serverLog("Request received for sign up "+ Date.now());
            response.sendFile(__dirname + "/public/html/" + "signup.html" );
        });
        
        app.get('/wiki', function(request,response)
        {
            _serverLog("Request received for wiki " + Date.now());
            response.sendFile(__dirname + "/public/html/" + "wiki.html" );
        });	

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
                        response.send("Username already exists. Try another username");
                        return;
                    }
                }
                /** Check if email is registered */
                mydb.collection('users').findOne( {"email": request.body.email}, function (error, user)
                {
                    if(user)
                    {
                        response.send("An account with this email already exists. Try another email or sign in ");
                        return;
                    }
                });
                /** Update other data in database **/	
                mydb.collection('users').update( {"username": request.body.username },
                {$set :
                { name : request.body.name, username : request.body.username, email: request.body.email, gender : request.body.gender,  recruiter : request.body.recruiter,
                  jobseeker : request.body.job_seeker, age : request.body.age, contactnumber: request.body.contactnumber,location : request.body.location,
                  address: request.body.address }},
                {
                upsert:false,
                multi:false
                });  
                
                console.log('User registered!');
                response.sendFile(__dirname + "/public/html/" + "registration-successful.html");
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
            if(request.isAuthenticated())
            {
                // Check if same user is requested
                if(request.query.user != request.session.passport.user)
                    response.send("You are signed in. Log out first to sign in as a different user");
                else
                    response.send("You are already signed in");
                return;
            }        
            response.sendFile(__dirname + "/public/html/" + "signin.html" );
        });	

        app.post("/authenticate", urlencodedParser, passport.authenticate('local'), function (request, response)
        {
            var userURI = encodeURIComponent(request.body.username);         
            response.redirect('/profiles/?user=' + request.body.username)                           
        });

        app.get('/profiles', function (request, response)
        {
            if(!request.isAuthenticated())
            {
                response.send("Please log in to view your profile");
                return;
            }
                
            else if(request.query.user != request.session.passport.user)
            {
                 response.send("You are signed in. Log out first to sign in as a different user");
                 return;
            }

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

    /** Git webhook - email notif **/
    app.post('/gitpush', function(request,response)
    {           
        var mailOptions = {
            from: process.env.GMAIL_USERNAME, 
            to: 'sarfarazchaudhary.k@gmail.com', 
            subject: 'New code pushed to git repository', 
            html: "<p>Some new changes in code were pushed to your <a title=\"OneTimeJobs Git Repo\" href=\"https:\/\/github.com\/onethena\/OneTimeJobs\/\" target=\"_blank\">https:\/\/github.com\/onethena\/OneTimeJobs\/<\/a><br \/>Check latest commits here - <a title=\"Commit history - onethena\" href=\"https:\/\/github.com\/onethena\/OneTimeJobs\/commits\/onethena\" target=\"_blank\">https:\/\/github.com\/onethena\/OneTimeJobs\/commits\/onethena<\/a><\/p>" +
                  "<p>Cheers!&nbsp;<img src=\"https:\/\/html-cleaner.com\/tinymce2016\/plugins\/emoticons\/img\/smiley-cool.gif\" alt=\"cool\" \/><br \/>- OneTimeJobs<\/p>"
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error)
            {
                console.log(error);
                response.send('Error is sending email')
            }
            else
            {
                console.log('Message sent: ' + info.response);
                response.send("Email sent to recipients");
            };
        }); 
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