var request = require('request-promise');
var EventEmitter = require("events").EventEmitter
var fs = require('fs')
var cmd = require('node-cmd')
var Twit = require ('twit')
var T = new Twit({
	consumer_key:         'pvQ0WbxP2ueDCe1PfnAZcTHkB',
	consumer_secret:      'rhMdlyVvbU9M6Ychhd9h2TFxbGC9wFWPl7AoqV2XRGD4cgXPWL',
	access_token:         '257868540-A5Db3CjPa5cOk7ylArpE7FmqZMTnHx5lCONsJHX1',
	access_token_secret:  'cQoLqmZ7iE8boCpgaaAOdIgZoimpSpzBbUCwdi697415I'
})
var F = require('fb')
var FB = new F.Facebook({
	appId:     '502558243460093',
	appSecret: 'b06f05e1a9839e338242c4a111c53bdf',
	accessToken: '502558243460093|0CPd0hf5xNYRPUprwyitdRMUrC4',
})

var fbScope = ['email', 'user_location', 'user_hometown', 'user_posts', 'user_tagged_places', 'user_friends']
var userFieldSet = 'name, location, hometown, feed, tagged_places'

module.exports = function(app, passport) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : fbScope }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : fbScope }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', isLoggedIn, function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', isLoggedIn, function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', isLoggedIn, function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

// =============================================================================
// ACTUAL APP WORK =============================================================
// =============================================================================
// This is where we retrieve the actual data and then process it

	app.get('/data/facebook', isLoggedIn, (req, res) => {

		var user = req.user

		var url = '/' + user.facebook.id + '/taggable_friends'

		var file = 'static/userData.json'
		var friends = 'static/fbFriends.json'

		var jFriends = {
			data: []
		}

		var options = {
			method: 'GET',
			uri: `https://graph.facebook.com/v2.8/${user.facebook.id}`,
			qs: {
				access_token: user.facebook.token,
				fields: userFieldSet
			}
		};
		request(options)
			.then(fbRes => {
				fs.writeFile(file, JSON.stringify(JSON.parse(fbRes), null, 4), (err) => {if (err) console.log(err)})
				FB.api(url, {access_token: user.facebook.token}, function(response){
					handleResponse(response, file, friends, user, res, url, jFriends);
				});
			})
	})

	app.get('/data/twitter', isLoggedIn, (req, res) => {

		var e1 = new EventEmitter()
		var e2 = new EventEmitter()
		var e3 = new EventEmitter()

		var user = req.user

		var static = 'static/'
		var followers = static + 'followers.json'
		var friends = static + 'friends.json'
		var timeline = static + 'timeline.json'
		var show = static + 'user.json'

		var jFollowers = {
			users: []
		}
		var jFriends = {
			users: []
		}

		var options = {
			screen_name: user.twitter.username,
			count: 20,
			cursor: -1
		}

		T.get('followers/list', options,  function getData(err, data, response) {
			jFollowers.users.push(data.users)
			if(data['next_cursor'] > 0){
				options.cursor = data.next_cursor
				T.get('followers/list', options, getData);
			} else {
				fs.writeFile(followers, JSON.stringify(jFollowers, null, 4), (err) => {if (err) console.log(err)})
				e1.emit('update')

			}
		})

		e1.on('update', function() {
			options.cursor = -1
	
			T.get('friends/list', options,  function getData(err, data, response) {
				jFriends.users.push(data.users)
				if(data['next_cursor'] > 0){
					options.cursor = data.next_cursor
					T.get('friends/list', options, getData);
				} else {
					fs.writeFile(friends, JSON.stringify(jFriends, null, 4), (err) => {if (err) console.log(err)})
					e2.emit('update')
				}
			})
		})

		e2.on('update', function() {
			options = {
				screen_name: user.twitter.username,
				tweet_mode: 'extended',
				include_rts: false,
				exclude_replies: true,
				trim_user: true,
				count: 200
			}

			T.get('statuses/user_timeline', options, function(err, data, response) {
				fs.writeFile(timeline, JSON.stringify(data, null, 4), (err) => {if (err) console.log(err)})
				e3.emit('update')
			})
		})

		e3.on('update', function (){
			T.get('users/show', options, function(err, data, response) {
				fs.writeFile(show, JSON.stringify(data, null, 4), (err) => {if (err) console.log(err)})
				res.send('done')
			})
		})
	})

	app.get('/check', (req,res) =>
		T.get('application/rate_limit_status', {resources: ['followers', 'friends']}, function(err, data, response){
			res.json(data)
		})
	)

	app.get('/compare', isLoggedIn, (req, res) => {
		var pyProcess = cmd.get('python3 compare.py',
			function(err, data, stderr) {
				if (!err) {
					console.log("python script output:\n" + data)
					res.send(data)
				} else {
					console.log("stderr:" + stderr + "done")
					console.log("python script cmd error:\n" + err)
				}
			}
		);
	})
};

function handleResponse(response, file, friends, user, res, url, jFriends){
	jFriends.data.push(response.data)
	console.log("BACK")
	console.log(response)

	if(response.paging.next){
		console.log("HELLO")
		nextPage = response.paging.next;
		console.log(nextPage);
		FB.api(url, {access_token: user.facebook.token, after: response.paging.cursors.after}, function(response){
			handleResponse(response, file, friends, user, res, url, jFriends);
		});
	} else {
		var string = JSON.stringify(jFriends)
		string = string.replace(/\]\,\[/g, ',')
		string = string.replace(/\[/, '')
		string = string.replace(/\]/, '')
		var jString = JSON.parse(string)
		string = JSON.stringify(jString, null, 4)
		fs.writeFile(friends, string, (err) => {if (err) console.log(err)})
		res.send('done')
	}
} 

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	req.flash('loginMessage', 'You need to log in first!')
	res.redirect('/login');
}
