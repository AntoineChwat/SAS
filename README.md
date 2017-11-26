# No Reidentification

Application to "diff" your personal data between your Twitter and your Facebook account in order to see if a private Twitter account is easily identifiable or not.

## Instructions

If you would like to download the code and try it for yourself:

1. Clone the repo: `git clone git@github.com:AntoineChwat/SAS`
2. Install packages: `npm install`
3. Create `config/auth.js`
```
module.exports = {

    'facebookAuth' : {
        'clientID'        : 'XXXXXXXXXX', // your App ID
        'clientSecret'    : 'XXXXXXXXXX', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback',
        'profileURL'      : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'twitterAuth' : {
        'consumerKey'        : 'XXXXXXXXXX',
        'consumerSecret'     : 'XXXXXXXXXX',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

};
```
3. Create `config/config.js`
```
module.exports = {

    'twitter' : {
        consumer_key:         'XXXXXXXXXX',
        consumer_secret:      'XXXXXXXXXX',
        access_token:         'XXXXXXXXXX',
        access_token_secret:  'XXXXXXXXXX'
    },

    'facebook' : {
        appId:                'XXXXXXXXXX',
        appSecret:            'XXXXXXXXXX',
        accessToken:          'XXXXXXXXXX',
    }

};
```
5. Launch: `node server.js`
6. Visit in your browser at: `http://localhost:8080`
