var request = require('request')

var game_id = '2014092810'

var last_play = 0

function get_plays() {
	request('http://www.nfl.com/liveupdate/game-center/'+game_id+'/'+game_id+'_gtd.json', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var game = JSON.parse(body)
			var drives = game[game_id].drives
			for (drive in drives) {
				var plays = drives[drive].plays
				for (play in plays) {
					var play_num = parseInt(play)
					if (play_num > last_play) {
						last_play = play_num
						console.log(plays[play_num].desc)
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
