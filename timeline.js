var Twit = require('twit'); // this is how we import the twit package
var config = require('./config') //this is we import the config file which is a js file which contains the keys ans tokens
var T = new Twit(config) //this is the object of twit which will help us to call functions inside it
fs=require('fs')

printTimeline(1, 'HamillHimself');
printTimeline(2, 'rianjohnson');

function printTimeline(index, name){
  var file = 'static/timeline' + index + '.txt'
  fs.unlink(file, (err) => {if (err) console.log(err)})
  var params = {
    screen_name: name,
    tweet_mode: 'extended',
    count: 200
  }

  T.get('statuses/user_timeline', params , function(err, data) {
    console.log(data)
    var rtString = "RT @"
    for (var i = 0; i < data.length ; i++) {
      // fs.writeFile('static/timeline.txt', data[i].full_text)
      if(data[i].full_text.indexOf(rtString) == -1 && data[i].in_reply_to_status_id==null){
        string = data[i].full_text + '\n'
        fs.appendFile(file, string, (err) => {if (err) console.log(err)})
      }
    }
  })
}