var request = require('request')
var Firebase = require('firebase')
var firebaseRef = new Firebase('https://tirico.firebaseio.com/')

var game_id = process.argv[2]

var last_play_id = 0

var playsRef = firebaseRef.child('plays')
var gamePlaysRef = firebaseRef.child('games/'+game_id+'/plays')

function get_plays() {
	request('http://www.nfl.com/liveupdate/game-center/'+game_id+'/'+game_id+'_gtd.json', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var game = JSON.parse(body)
			var drives = game[game_id].drives
			for (drive_id in drives) {
				var plays = drives[drive_id].plays
				for (play in plays) {
					var play_id = parseInt(play)
					if (play_id > last_play_id) {
						last_play_id = play_id
						var the_play = plays[play_id]
						delete the_play.players
						var newPlay = playsRef.push(the_play)
						var newPlayID = newPlay.name()
						gamePlaysRef.child(newPlayID).set(true)
						console.log(the_play.desc)
						if (the_play.desc == 'END GAME') {
							process.exit()
						}
					}
				}
			}
		}
	})
}

// GET DATA EVERY 15 SECONDS
var number_of_seconds = 15
setInterval(function() {
	get_plays()
}, number_of_seconds * 1000);
