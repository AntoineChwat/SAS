var fs = require('fs');
var fbFriends, twFriends, followers
var parsedFbFriends = []
var parsedTwFriends = []
var parsedFollowers = []
var commonFriends = []

function read(result){
	fs.readFile('static/fbFriends.json', 'utf8', function (err, data) {
		if (err) throw err;
		fbFriends = JSON.parse(data);
		results = fbFriends["data"]
		var index = 0
		if (results.length > 0) { 
			for(var j = 0; j < results.length; j++){
				for(var i = 0; i < results[j].length; i++) {
					var columnsIn = results[j][i];
					if (key = "name"){
						// console.log(key + ' : ' + results[j][i][key]); // here is your column name you are looking for + its value
						parsedFbFriends[index] = results[j][i][key]
						index++
					}
				}
			}
			// console.log(parsedFbFriends)
		}
		else {
			console.log("No columns");
		}
	});

	fs.readFile('static/friends.json', 'utf8', function (err, data) {
		if (err) throw err;
		twFriends = JSON.parse(data);
		results = twFriends["users"]
		var index = 0
		if (results.length > 0) { 
			for(var j = 0; j < results.length; j++){
				for(var i = 0; i < results[j].length; i++) {
					var columnsIn = results[j][i];
					if (key = "screen_name"){
						// console.log(key + ' : ' + results[j][i][key]); // here is your column name you are looking for + its value
						parsedTwFriends[index] = results[j][i][key]
						index++
					}
				}
			}
			// console.log(parsedTwFriends)
		}
		else {
			console.log("No columns");
		}
	});

	fs.readFile('static/followers.json', 'utf8', function (err, data) {
		if (err) throw err;
		followers = JSON.parse(data);
		results = followers["users"]
		var index = 0
		if (results.length > 0) { 
			for(var j = 0; j < results.length; j++){
				for(var i = 0; i < results[j].length; i++) {
					var columnsIn = results[j][i];
					if (key = "screen_name"){
						// console.log(key + ' : ' + results[j][i][key]); // here is your column name you are looking for + its value
						parsedFollowers[index] = results[j][i][key]
						index++
					}
				}
			}
			// console.log(parsedFollowers)
		}
		else {
			console.log("No columns");
		}
	});
	console.log("Done reading")
	compare(function(commonFriends){
		result(commonFriends)
	})
}

function compare(result){
	var index = 0
	for(var i = 0; i < parsedFbFriends.length; i++){
		parsedFbFriends[i] = parsedFbFriends[i].replace(/\s+/g, '');
		parsedFbFriends[i] = parsedFbFriends[i].replace(/[^a-zA-Z ]/g, "");
		parsedFbFriends[i] = parsedFbFriends[i].toLowerCase()
	}
	for(var i = 0; i < parsedTwFriends.length; i++){
		parsedTwFriends[i] = parsedTwFriends[i].replace(/[^a-zA-Z ]/g, "");
		parsedTwFriends[i] = parsedTwFriends[i].toLowerCase()
	}
	for(var i = 0; i < parsedTwFriends.length; i++){
		for(var j = 0; j < parsedFbFriends.length; j++){
			if(parsedTwFriends[i] == parsedFbFriends [j]) {
				console.log("Found one: " + parsedFbFriends[j])
				commonFriends[index] = parsedFbFriends[j]
				index++
			}
		}
	}
	for(var i = 0; i < parsedFollowers.length; i++){
		parsedFollowers[i] = parsedFollowers[i].replace(/[^a-zA-Z ]/g, "");
		parsedFollowers[i] = parsedFollowers[i].toLowerCase()
	}
	for(var i = 0; i < parsedFollowers.length; i++){
		for(var j = 0; j < parsedFbFriends.length; j++){
			if(parsedFollowers[i] == parsedFbFriends [j]) {
				if(commonFriends.includes(parsedFbFriends[j])) {
					console.log("Found a duplicate: " + parsedFbFriends[j])
				} else {
					console.log("Found one: " + parsedFbFriends[j])
					commonFriends[index] = parsedFbFriends[j]
					index++
				}
			}
		}
	}
	result(commonFriends)
}

module.exports.read = read