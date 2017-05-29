var Player = {
	name: false,
	sign: false,
	score: 0,
};

var Menu = {
	render: function() {
		$('#container').remove();
		$('body').append($('<div/>').attr('id', 'menu')
			.append($('<button/>').attr('id', 'quick_start').text('QUICK GAME'))
			.append($('<button/>').attr('id', 'personalize').text('CUSTOM GAME'))
		);
		$('button').click(Game.start.bind(Game));
	},
};

var Game = {
	turn: 1,
	player1: Object.create(Player),
	player2: Object.create(Player),
	player1_moves: [],
	player2_moves: [],

	render: function() {
		var $square = $('<div/>').addClass('square');

		$('#menu').remove();
		$('#container').remove();
		$('body').append($('<div/>').attr('id', 'container'));

		$('#container').empty().append($('<div/>').attr('id', 'board'));
		for (var i = 1; i < 4; i++) {
			$('#board').append($('<div/>').addClass('row_' + i));
			for (var j = 1; j < 4; j++)
				$('.row_' + i).append($('<div/>').addClass('square').attr('id', i + '_' + j));
		}

		var footer_text = false;
		if (this.turn % 2 == 1) footer_text = this.player1.name + '\'s move';
		else                    footer_text = this.player2.name + '\'s move';

		$('#footer').remove();
		$('#container')
			.append($('<div/>').attr('id', 'footer')
				.append($('<p/>').text(footer_text))
				.append($('<button/>').attr('id', 'restart').text('RESTART'))
		);
		$('#restart').click(function() {
			Game.end_game();
			Game.start();
		});
	},

	get_info: function() {
		this.player1.name = 'A';
		this.player2.name = 'B';
		this.player1.sign = 'X';
		this.player2.sign = 'O';
	},

	start: function() {
		var that = this;
		that.get_info();
		that.render();
		$('.square').click(function() {
			if (this.classList.contains('played') == false) {
				that.game_turn(this);
			}
		});
		$('.square').hover(function() {
			if (this.classList.contains('played') == false) {
				var turn_sign = false
				if (that.turn % 2 == 1) turn_sign = that.player1.sign;
				else                    turn_sign = that.player2.sign;
				$(this).text(turn_sign);
			}
		}, function() {
			if (this.classList.contains('played') == false) {
				$(this).empty();
			}
		});
	},

	game_turn: function(sq) {
		var that = this;
		var class_name  = false;
		var turn_sign   = false;
		var player_turn = that.turn % 2 == 1 ? 1 : 2;
		if (player_turn == 1) {
			class_name = 'player1';
			turn_sign = that.player1.sign;
			$('#footer > p').text(that.player2.name + '\'s move');
		}
		else {
			class_name = 'player2';
			turn_sign = that.player2.sign;
			$('#footer > p').text(that.player1.name + '\'s move');
		}
		sq.innerHTML = turn_sign;
		sq.classList.add('played');
		sq.classList.add(class_name);
		that.turn++;
		if (player_turn == 1) {
			that.player1_moves.push(sq.id);
			that.check_victory(that.player1_moves, that.player1);
			return;
		}
		else {
			that.player2_moves.push(sq.id);
			that.check_victory(that.player2_moves, that.player2);
			return;
		}
	},

	check_victory: function(a, p) {
		var that = this;
		var end  = false;

		// Check horizontal
		for (var i = 0; i < 4; i++) {
			for (var j = 1; j < 4; j++) {
				if (a.indexOf(i + '_' + j) != -1) end = true;
				else {
					end = false;
					break;
				}
			}
			if (end == true) { that.end_game(p); return; }
		}

		// Check vertical
		for (var i = 0; i < 4; i++) {
			for (var j = 1; j < 4; j++) {
				if (a.indexOf(j + '_' + i) != -1) end = true;
				else {
					end = false;
					break;
				}
			}
			if (end == true) { that.end_game(p); return; }
		}

		// Check cross
		if (a.indexOf('2_2') != -1 && a.indexOf('1_1') != -1 && a.indexOf('3_3') != -1)
			end = true;
		if (a.indexOf('2_2') != -1 && a.indexOf('1_3') != -1 && a.indexOf('3_1') != -1)
			end = true;
		if (end == true) { that.end_game(p); return; }

		// Check draw
		end = true;
		$('.square').each(function() {
			if ($(this).hasClass('played') == false)
				end = false;
		});
		if (end == true) { that.end_game(); return; }
	},

	end_game: function(p) {
		this.turn = this.turn % 2;
		this.player1_moves = [];
		this.player2_moves = [];

		$('.square').each(function() {
			if ($(this).hasClass('played') == false) {
				$(this).addClass('played');
			}
		});

		var footer_text = false;
		if (p == null) footer_text = 'Draw';
		else {
			p.score++;
			footer_text = p.name + ' wins. Score: ' + p.score;
		}

		$('#footer').empty()
			.append($('<p/>').text(footer_text))
			.append($('<button/>').attr('id', 'restart').text('RESTART'))
			.append($('<button/>').attr('id', 'menu'   ).text('MENU'));
		$('#restart').click(Game.start.bind(Game));
		$('#menu'   ).click(Menu.render.bind(Menu));
	}
};

$(document).ready(function() {
	Menu.render();
});