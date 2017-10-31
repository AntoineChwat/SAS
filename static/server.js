var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy( {
		clientID : FACEBOOK_APP_ID,
		clientSecret : FACEBOOK_APP_SECRET,
		callbackURL : FACEBOOK_CALL_BACK_URL,
		profile : true
	}, function(accessToken, refreshToken, profile, done) {
		FB_ACCESS_TOKEN = accessToken;
		process.nextTick(function() {
		console.log("FB_ACCESS_TOKEN : " + FB_ACCESS_TOKEN);
		return done(null, profile);
	});
}));