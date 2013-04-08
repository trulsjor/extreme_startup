$(document).ready(function() {
	var colourTable = {}

	var Graph = function(canvas) {
		var timeSeries = {};
		var smoothie = new SmoothieChart({millisPerPixel:200,grid:{fillStyle:'rgba(255,255,255,0.21)',strokeStyle:'#e5e5e5',sharpLines:false},labels:{disabled:true}});
		smoothie.streamTo(canvas); 
		var randomRgbValue = function () {
			return Math.floor(Math.random() * 156 + 99);
		}
		var randomColour = function () {
			return 'rgb(' + [randomRgbValue(), randomRgbValue(), randomRgbValue()].join(',') + ')';
		}
		this.updateWith = function (leaderboard) {
			for (var i=0; i < leaderboard.length; i += 1) {
				var entry = leaderboard[i];
				var series = timeSeries[entry.playerid];
				if (!series) {
					series = timeSeries[entry.playerid] = new TimeSeries();
					colourTable[entry.playerid] = randomColour();
					smoothie.addTimeSeries(series, { strokeStyle:colourTable[entry.playerid], lineWidth:3 });
				}
				series.append(new Date().getTime(), entry.score);
				smoothie.start();
			}
		};
		this.pause = function() {
			smoothie.stop();
		}
	};  

	var ScoreBoard = function(div) {
		this.updateWith = function (leaderboard) {
			var list = $('<table id="scoreboard" class="table table-bordered"></table>');            
			for (var i=0; i < leaderboard.length; i += 1) {
				var entry = leaderboard[i];
				list.append(
					$('<tr/>')
						.append($('<td><a class="btn btn-primary" href=/players/'+ entry.playerid +'><i class="icon-home icon-white"></i></a></td>')
							.css("background-color", colourTable[entry.playerid])
							.css("text-align", "center"))
						.append($('<td>' + entry.playername + '</td>'))
						.append($('<td>' + entry.score + ' poeng </td>')
							.css("text-align", "right"))
				);
							
				}
				$("#scoreboard").replaceWith(list); 
			}
		};

		var graph = new Graph($('#mycanvas')[0]);  // get DOM object from jQuery object
		var scoreboard = new ScoreBoard($('#scoreboard'));

		setInterval(function() {
			$.ajax({
				url: '/scores',
				success: function( data ) {
					var leaderboard = JSON.parse(data);
					if (leaderboard.inplay) {
						graph.updateWith(leaderboard.entries);
						scoreboard.updateWith(leaderboard.entries);
					} else {
						graph.pause();
					}
				}
			});
		}, 1000);
	}
);