var FB = require('fb'); // this is how we import the twit package
var config = require('./fbConfig') //this is we import the config file which is a js file which contains the keys ans tokens

FB.api('/search', {q: 'Hugo Gervasoni', type: 'user', access_token: config.accessToken}, function (result) {
    console.log(result);
});

FB.api('/oauth', {client_id: 'config.appId', redirect_uri: 'https://www.facebook.com/connect/login_success.html', access_token: config.accessToken}, function (result) {
    console.log(result);
});
