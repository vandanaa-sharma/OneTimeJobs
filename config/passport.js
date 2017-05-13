
"use strict";

/** User Authentication using passport */

/** Local Startegy - local database (Others are - Google, Facebook, etc) */
var LocalStrategy = require('passport-local').Strategy;
/** Import your user model */
var user = require('../models/user.js');
//var bCrypt = require('bcrypt');

module.exports = function (passport)
{
    /** Serialize - Deserialize so that subsequent requests do not contain credentials */
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('signin', new LocalStrategy(
	{
	/** Allows to pass back the entire request to the callback  */
	passReqToCallback: true					
	/** We are using standard names - username and password. 
	 * If different name are used for these fields add then here **/ 
	},
	/** User is the name of your data-model set in - models/user.js */
	function (request, username, password, done) 
	{
		user.findOne( 
			{ 'username': username },
			function(error, user) {
				if(error)
					return done(error);
				/** Check if user is present in database */
				if(!user) {
					console.log('No user found with username '+ username);
					return done(null, false,  req.flash('message', 'User Not found!')); 
				}
				/** Check if password is valid */
				if (!isValidPassword(user, password)){
					console.log('Invalid username and password combination');
					return done(null, false, req.flash('message', 'Invalid username and password combination'));
				}
				/** Valid username and password combination found - return user */
				return done(null, user);	
			}
		)
	}));

	var isValidPassword = function(user, password)
	{
		return bCrypt.compareSync(password, user.password);
	};

	passport.use('signup', new LocalStrategy(
	{
		passReqToCallback : true
	},
	function(request, name, username, email, gender, recruiter, jobseeker, age, password, location, address, done) 
	{
		findOrCreateUser = function()
		{
			// Find a user in mongo database with provided username
			user.findOne({'email': email}, function(error, user) 
			{
				// In case of any error return
				if (error)
				{
					console.log('Error in Sign Up: '+ error);
					return done(error);
				}
				// Email already present
				if (user) 
				{
					console.log('User email exists');
					return done(null, false, request.flash('message','An account with this email is already registered'));
				} 
				else
				{
					// Create new user
					var newUser = new User();
					// Set credentials
					newUser.name = name;
					newUser.username = username;
					newUser.email = email;
					newUser.password = createHash(password);
					newUser.gender = gender,
					newUser.recruiter = recruiter,
					newUser.jobseeker = jobseeker,
					newUser.age = age,
					newUser.location = location,
					newUser.address=  address
			
					// Save new user
					newUser.save( function(error) 
					{
						if (error)
						{
							console.log('Error in Saving user: '+ error);  
							throw error;  
						}
						console.log('User registration successful');    
						return done(null, newUser);
					});
				}
			});
		}	
		/** Delay the execution of findOrCreateUser and execute 
		 *  the method in the next tick of the event loop **/
		process.nextTick(findOrCreateUser);
	}));

	var createHash = function(password)
	{
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}
