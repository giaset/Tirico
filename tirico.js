var request = require('request')

var game_id = process.argv[2]

var last_play_id = 0

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
						console.log(plays[play_id].desc)
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
