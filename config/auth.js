// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '502558243460093', // your App ID
        'clientSecret'    : 'b06f05e1a9839e338242c4a111c53bdf', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'twitterAuth' : {
        'consumerKey'        : 'pvQ0WbxP2ueDCe1PfnAZcTHkB',
        'consumerSecret'     : 'rhMdlyVvbU9M6Ychhd9h2TFxbGC9wFWPl7AoqV2XRGD4cgXPWL',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    }

};
