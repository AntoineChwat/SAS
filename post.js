var Twit = require('twit');
var config = require('./config')
var T = new Twit(config);
var tweet = {
  status: 'hello world!!'  // this is the tweet message
}
T.post('statuses/update', tweet, tweeted) // this is how we actually post a tweet ,again takes three params 'statuses/update' , tweet message and a call back function
function tweeted(err, data, response) {
  if(err){
    console.log("Something went wrong!");
  }
  else{
    console.log("Voila It worked!");
  }
} // this is the call back function which does something if the post was successful or unsuccessful.
