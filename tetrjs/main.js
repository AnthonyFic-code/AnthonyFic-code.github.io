// Page 

var more_opened = false;
const more_span = document.getElementById("more");
const more_button = document.getElementById("buttons");
more_button.addEventListener("click", toggle_more);
function toggle_more() {
	if(more_opened) {
		more_span.classList.add("unrendered");
		more_opened = false;
	} else {
		more_span.classList.remove("unrendered");
		more_opened = true;
	}
}
const controls_button = document.getElementById("controls");
controls_button.addEventListener("click", control_change);
function control_change() {
	var current_controls = JSON.stringify(keybinds);
	var inputted_controls = prompt("Please input control schema", current_controls);
	if(inputted_controls == null || inputted_controls == "") {
		return;
	} else {
		keybinds = JSON.parse(inputted_controls);
		generateCookie();
	}
}
const das_button = document.getElementById("das");
das_button.addEventListener("click", das_change);
function das_change() {
	var input = prompt("Input new DAS value\nDAS is the amount of frames until auto-repeat activates.", das);
	if(input == null || input == "") {
		return;
	} else {
		das = parseInt(input);
		generateCookie();
	}
}
const arr_button = document.getElementById("arr");
arr_button.addEventListener("click", arr_change);
function arr_change() {
	var input = prompt("Input new ARR value\nARR is Auto-Repeat Rate.", arr);
	if(input == null || input == "") {
		return;
	} else {
		arr = parseInt(input);
		generateCookie();
	}
}

const background = document.getElementById("main")
const bg_button = document.getElementById("bg_change");
bg_button.addEventListener("click", bg_change);
function bg_change() {
	var input = prompt("Input image link\nRemember, HTML will loop it if the file isn't very large.");
	if(input == null || input == "") {
		background.style["background-image"] = "url(saiph_unsplash.png)";
	} else {
		background.style["background-image"] = "url(" + input + ")";
	}
	generateCookie();
	
}

function generateCookie() {
	var cookie_data = {
		keybinds: keybinds,
		das: das,
		arr: arr,
		bg: background.style["background-image"]
	}
	const d = new Date();
	d.setTime(d.getTime() + (365*86400*1000));
	var date = "expires="+ d.toUTCString();

	var cookie_string = "data=" + JSON.stringify(cookie_data) + "; =" + date;
	document.cookie = cookie_string;
	console.log(cookie_data);
}

//// TETR.JS

// Setup
import { blocks } from './blocks.js';
import { kicks } from './kicks.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Visuals
function display() {
	// resetting grid
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.font = '36px Montserrat';
	ctx.fillText('HOLD', 80, 50);
	ctx.fillText('LEVEL', 75, 600);
	ctx.fillText('LINES', 75, 740);
	if(combo > 1) {
		ctx.fillStyle = 'rgb(0, 125, 255)';
		ctx.fillText('COMBO', 50, 480);
		ctx.fillText('x' + combo, 50, 450);
	}
	if(b2b_chain > 0) {
		ctx.fillStyle = 'rgb(255, 125, 4)';
		ctx.fillText('🔥 B2B x' + b2b_chain, 0, 520);
	}
	if(reloading) {
		ctx.font = '24px Montserrat';
		ctx.fillStyle = 'rgb(255, 0, 0)';
		ctx.fillText('RESETTING!', 600, 696);
		ctx.fillText("Hit " + keybinds.confirm, 600, 720);
		ctx.fillText("to confirm.", 600, 744);
		ctx.fillText("Anything else", 600, 768);
		ctx.fillText("will cancel.", 600, 792);
		ctx.font = '36px Montserrat';
	}
	ctx.fillStyle = 'rgb(128, 255, 128, ' + frames_until_hidden/480 + ')';
	ctx.fillText('+' + recent_score, 615, 550);
	ctx.fillStyle = 'rgb(128, 255, 128)';
	ctx.fillRect(615, 560, 150*(frames_until_hidden/480), 5);

	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.fillText('SCORE', 615, 600);
	ctx.fillText('NEXT', 615, 50);
	
	if(!alive) {
		ctx.fillStyle = 'rgb(255, 96, 96)';
	}
	ctx.font = '36px Ubuntu';
	ctx.fillText(formattedScore(score), 615, 640);
	ctx.fillText(level, 129-numDigits(level)*10.5, 640);
	ctx.fillText(lines, 129-numDigits(lines)*10.5, 780);
    // draw grid
    for(var row = 0; row < 20; row++) {
        for (var col = 0; col < 10; col++) {
			var color = findColor(row, col);
			if(color == null) { continue; }
			ctx.fillStyle = color;
			if(grid[row][col] == 0) {
				ctx.fillRect(col*40 + 202, row*40 + 2, 36, 36);
			} else {
				ctx.fillRect(col*40 + 201, row*40 + 1, 38, 38);
			}
		}
    }

	// drawing held block
	if(held != undefined) {
		var current_displayed_piece = held.rot(0);
		for(var row = 0; row < current_displayed_piece.length; row++) {
			for(var col = 0; col < current_displayed_piece[row].length; col++) {
				if (current_displayed_piece[row][col] == 0) { continue; }
				var temp_color = (current_displayed_piece[row][col] == 0) ? 'rgb(40, 40, 40)' : findColor(current_displayed_piece[row][col]);
				var hold_x_pos = (col + 3) * 30
				var hold_y_pos = (row + 2) * 30
				ctx.fillStyle = temp_color;
				ctx.fillRect(hold_x_pos + 1, hold_y_pos + 1, 28, 28);
			}
		}
	}
	// displaying the next few pieces
	for(var piece = 0; piece < 5; piece++) {
		var current_displayed_piece = nexts[piece].rot(0);
		for(var row = 0; row < current_displayed_piece.length; row++) {
			for(var col = 0; col < current_displayed_piece[row].length; col++) {
				if (current_displayed_piece[row][col] == 0) { continue; }
				var temp_color = (current_displayed_piece[row][col] == 0) ? 'rgb(40, 40, 40)' : findColor(current_displayed_piece[row][col]);
				var hold_x_pos = (col+20.5) * 30
				var hold_y_pos = (2 + row + (3 * (piece))) * 30
				ctx.fillStyle = temp_color;
				ctx.fillRect(hold_x_pos + 1, hold_y_pos + 1, 28, 28);
			}
		}
	}

	// drawing the block that's being placed now
	var polysize = current_shape.length;
	for (var i = 0; i < polysize; i++) {
		for (var j = 0; j < polysize; j++) {
			if (current_shape[j][i] == 0) { continue; }
			ctx.fillStyle = findColor(current_shape[j][i])
			ctx.fillRect(
				(current_x + i) * 40 + 200.5, 
				(current_y + j) * 40 + 0.5, 
				39, 39 );
		}
	}

    // and also drawing where the block will be if it hard drops now
	var ghost_y = current_y;
	while (validPlace(current_block, current_x, ghost_y + 1, current_rot)){
		ghost_y++;
	}
	for (var i = 0; i < polysize; i++) {
		for (var j = 0; j < polysize; j++) {
			if (current_shape[i][j] == 0) { continue; }
			var ghost_x_pos = (current_x + j) * 40;
			var ghost_y_pos = (ghost_y + i) * 40;
			ctx.fillStyle = findColor(current_shape[i][j]);
			ctx.fillRect(ghost_x_pos + 202, ghost_y_pos + 2, 36, 4);
			ctx.fillRect(ghost_x_pos + 202, ghost_y_pos + 34, 36, 4);
			ctx.fillRect(ghost_x_pos + 202, ghost_y_pos + 2, 4, 36);
			ctx.fillRect(ghost_x_pos + 234, ghost_y_pos + 2, 4, 36);
		}
	}

	if(paused) {
		ctx.font = '72px Montserrat'
		ctx.fillStyle = 'rgb(0, 0, 0, 0.5)'
		ctx.fillRect(220, 300, 360, 145);
		ctx.fillStyle = 'rgb(255, 0, 0)';
		ctx.fillText('PAUSED', 245, 385);
		ctx.font = '24px Montserrat'
		ctx.fillText('(click ' + keybinds.paused + ' to unpause)', 245, 425);
	}
}



// Helper functions

var active_colors = {
	0: 'rgb(128, 128, 128)',
	1: 'rgb(255, 0, 0)',
	2: 'rgb(0, 255, 0)',
	3: 'rgb(255, 128, 0)',
	4: 'rgb(0, 64, 255)',
	5: 'rgb(192, 0, 255)',
	6: 'rgb(0, 192, 256)',
	7: 'rgb(255, 224, 0)'
}

function findColor(x, y=undefined) {
    var tile_number = grid[x][y];
	if(y == undefined) {tile_number = x}
	var found_color = active_colors[tile_number]
	if(found_color == undefined) {
		return null;
	} else {
		return found_color;
	}
}

function numDigits(n) {
	var digits = 1;
	while(n >= 10) {
		n /= 10;
		digits++;
	}
	return digits;
}

// https://stackoverflow.com/a/16436975
function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	for (var i = 0; i < a.length; ++i) {
	  if (a[i] !== b[i]) return false;
	}
	return true;
}

function formattedScore(n) {
	if(n < 1000000) {
		return Math.floor(n);
	} else if (n < 1000000000) {
		return Math.floor(n/100000) / 10 + "m";
	} else {
		return Math.floor(n/100000000) / 10 + "b";
	} // I don't think it's physically possible to go further
}

// https://flaviocopes.com/how-to-shuffle-array-javascript/
function arrayRandomize(array) {
	return array.sort(() => Math.random() - 0.5);
}

function randInt(min, max) {
	var max_delta = max - min
	var rand = Math.floor(Math.random() * (max_delta + 1));
	return (rand + min);
}

/* X and Y parameters represent the top left. 
(T, 0, 0, 1) -> true       (I, 0, -1, 2) -> false
[o x o / / ...]           o[o o o / / ...]
[o x x / / ...]           o[o o o / / ...]
[o x o / / ...]           x[x x x / / ...]
[/ / ...      ]           o[o o o / / ...]
*/
function validPlace(block, x_pos, y_pos, rot) {
	var shape = block.rot(rot);
	var polysize = shape.length;
	for(var delta_y = 0; delta_y < polysize; delta_y++) {
		for(var delta_x = 0; delta_x < polysize; delta_x++) {
			var checked_x = delta_y + x_pos;
			var checked_y = delta_x + y_pos;
			
			if(shape[delta_x][delta_y] != 0) {
				if(checked_y > 19 || checked_x < 0 || checked_x > 9) {
					return false; // Out of bounds
				}
				try {
					if(grid[checked_y][checked_x] != 0) {
						return false; // Blocked
					}
				} catch {
					return false;
				}
			}
		}
	}
	return true;
}

function addMinos(block, x_pos, y_pos, rot) {
	var shape = block.rot(rot);
	var polysize = shape.length;
	for(var delta_y = 0; delta_y < polysize; delta_y++) {
		for(var delta_x = 0; delta_x < polysize; delta_x++) {
			var checked_x = delta_x + x_pos;
			var checked_y = delta_y + y_pos;
			if (shape[delta_y][delta_x] != 0) {
				grid[checked_y][checked_x] = shape[delta_y][delta_x];
			}
		}
	}
	clearLines();
}

function clearLines() {
	var cleared_lines = 0;
	var cleared_rows = [];
	for(var row = 0; row < 20; row++) {
		var pieces_in_this_line = 0;
		for(var col = 0; col < 10; col++) {
			if(grid[row][col] != 0) {
				pieces_in_this_line++;
			}
		}
		if(pieces_in_this_line == 10) {
			cleared_lines++;
			cleared_rows.push(row);
		}
	}
	var tspinned = checkTspin();
	for(var i = 0; i < cleared_rows.length; i++) {
		var clearing_line = cleared_rows[i];
		grid.splice(clearing_line, 1);
		grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	}
	if(cleared_lines > 0) {
		scoreClears(cleared_lines, tspinned);
		combo++;
	} else {
		combo = 0;
	}
}

function scoreClears(num_lines, tspinned) {
	var points_this_turn = 0;
	frames_until_hidden = 480;
	var b2b_multi = b2b_chain > 0 ? 1.5 : 1;
	var combo_multi = 1 + ((combo) / 10);
	if(arraysEqual(grid[19], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])) {
		points_this_turn += (4000 * level);
	}
	lines += num_lines;
	level = Math.floor(lines/10) + 1;
	if(tspinned) {
		switch(num_lines) {
			case 1:
				points_this_turn += 400 * level * b2b_multi * combo_multi;
				break;
			case 2:
				points_this_turn += 1200 * level * b2b_multi * combo_multi;
				break;
			case 3:
				points_this_turn += 1800 * level * b2b_multi * combo_multi;
				break;
			default:
				break;
		}
	} else {
		switch(num_lines) {
			default:
				break;
			case 1:
				points_this_turn += 50 * level * b2b_multi * combo_multi;
				break;
			case 2:
				points_this_turn += 200 * level * b2b_multi * combo_multi;
				break;
			case 3:
				points_this_turn += 400 * level * b2b_multi * combo_multi;
				break;
			case 4:
				points_this_turn += 1200 * level * b2b_multi * combo_multi;
				break;
		}
	}
	if(tspinned || num_lines >= 4) {
		b2b_chain++;
	} else {
		b2b_chain = 0;
	}
	points_this_turn = Math.floor(points_this_turn);
	score += points_this_turn;
	recent_score += points_this_turn;
}

function checkTspin() {
	if(current_y == 18) { return false; }
	var t_counter = 0;
	if(current_block == blocks['t']) {
		//current_x + 1, current_y + 1 == center
		if(grid[current_y][current_x] != 0) {
			t_counter += 1;
		}
		if(grid[current_y + 2][current_x] != 0) {
			t_counter += 1;
		}
		if(grid[current_y][current_x + 2] != 0) {
			t_counter += 1;
		}
		if(grid[current_y + 2][current_x + 2] != 0) {
			t_counter += 1;
		}
	}
	return (t_counter >= 3);
}

const default_bag = ['z', 's', 'l', 'j', 't', 'i', 'o'];

// Gameplay
// ⮞ General
var grid = [];
for (var i = 0; i < 20; i++) {
	grid.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}
var level = 0;
var alive = true;
var lines = 0;
var reloading = false;
var paused = false;
var recent_score = 0;
// ⮞ Scoring-related
var score = 0;
var b2b_chain = 0;
var combo = 0;
var frames_until_hidden = 0;
// ⮞ Queue-related
var bag_starter = [];
default_bag.forEach(item => bag_starter.push(blocks[item]));
var nexts = [];
// ⮞ Current piece-related
var current_x;
var current_y;
var current_rot;
var current_block;
var current_shape;

var frames_per_down;
var frames_until_down;
var frames_to_lock = 50;
var frames_until_lock = frames_to_lock;
var resets_left;
// ⮞ Held piece-related
var can_hold = true;
var held;
// ⮞ Control-related
var holding = {
	down: false,
	left: false,
	right: false,
	cw: false,
	ccw: false,
	flip: false,
	hold: false,
	drop: false,
	reset: false,
	confirm: false,
	paused: false
};
// https://www.w3schools.com/js/js_cookies.asp
var keybinds = {
	down: "ArrowDown",
	left: "ArrowLeft",
	right: "ArrowRight",
	cw: "ArrowUp",
	ccw: "z",
	flip: "a",
	hold: "c",
	drop: " ",
	reset: "r",
	confirm: "Enter",
	paused: "p"
}
var das = 10 // DELAYED AUTO SHIFT - frames until ARR activates
var arr = 2 // AUTOMATIC REPEAT RATE - frames per repeat

var das_delay_remaining_side = das;
var arr_delay_remaining_side = arr;
var das_delay_remaining_down = das;
var arr_delay_remaining_down = arr;

function resetGame() {
	clearInterval(loop);
	grid = [];
	for (var i = 0; i < 20; i++) {
		grid.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	}
	level = 0;
	alive = true;
	lines = 0;
	score = 0;
	b2b_chain = 0;
	combo = 0;
	nexts = [];
	current_x = null;
	current_y = null;
	current_rot = null;
	current_block = null;
	current_shape = null;
	frames_per_down = null;
	frames_until_down = null;
	frames_to_lock = 50;
	frames_until_lock = frames_to_lock;
	can_hold = true;
	held = null;
	frames_until_hidden = 0;
	recent_score = 0;
	paused = false;

	arrayRandomize(bag_starter).forEach(item => nexts.push(item));
	nextPiece();
	loop = setInterval(gameloop, 16);
}


addEventListener("keydown", press);
addEventListener("keyup", unpress);

function press(e) {

	if(e.key == keybinds.confirm && reloading) {
		if(holding.confirm) { return }
		holding.confirm = true;
		resetGame();
	}
	reloading = false;

	if(e.key == keybinds.reset) {
		if(holding.reset) { return }
		holding.reset = true;
		reloading = true;
		if(paused){
			display();
		}
	}

	if(e.key == keybinds.paused) {
		if(holding.paused) { return }
		holding.paused = true;
		paused = !paused;
		display();
	}

	if(!alive) { return }
	if(paused) { return }

	if(e.key == keybinds.down) {
		if(holding.down) { return }
		moveDown();
		das_delay_remaining_down = das;
		arr_delay_remaining_down = arr;
		holding.down = true;
	}

	if(e.key == keybinds.left) {
		if(holding.left) { return }
		moveLeft();
		das_delay_remaining_side = das;
		arr_delay_remaining_side = arr;
		holding.right = false;
		holding.left = true;

	}

	if(e.key == keybinds.right) {
		if(holding.right) { return }
		moveRight();
		das_delay_remaining_side = das;
		arr_delay_remaining_side = arr;
		holding.left = false;
		holding.right = true;
		
	}

	if(e.key == keybinds.cw) {
		if(holding.cw) { return }
		rotate('cw');
		holding.cw = true;
	}

	if(e.key == keybinds.ccw) {
		if(holding.ccw) { return }
		rotate('ccw');
		holding.ccw = true;
	}

	if(e.key == keybinds.flip) {
		if(holding.flip) { return }
		rotate('180');
		holding.flip = true;
	}

	if(e.key == keybinds.hold) {
		if(holding.hold) { return }
		holdPiece();
		holding.hold = true;
	}

	if(e.key == keybinds.drop) {
		if(holding.drop) { return }
		fullDrop();
		holding.drop = true;
	}
}

function unpress(e) {
	if(e.key == keybinds.down) {holding.down = false;}
	if(e.key == keybinds.left) {holding.left = false;}
	if(e.key == keybinds.right) {holding.right = false;}
	if(e.key == keybinds.cw) {holding.cw = false;}
	if(e.key == keybinds.ccw) {holding.ccw = false;}
	if(e.key == keybinds.flip) {holding.flip = false;}
	if(e.key == keybinds.hold) {holding.hold = false;}
	if(e.key == keybinds.drop) {holding.drop = false;}
	if(e.key == keybinds.reset) {holding.reset = false;}
	if(e.key == keybinds.confirm) {holding.confirm = false;}
	if(e.key == keybinds.paused) {holding.paused = false;}
}

function moveDown() {
	if(!validPlace(current_block, current_x, current_y+1, current_rot)) { return; }
	current_y++;
}

function moveLeft() {
	if(frames_until_lock != frames_to_lock && resets_left > 0) {
		frames_until_lock = frames_to_lock;
		resets_left--;
	}
	if(!validPlace(current_block, current_x-1, current_y, current_rot)) { return; }
	current_x--;
}

function moveRight() {
	if(frames_until_lock != frames_to_lock && resets_left > 0) {
		frames_until_lock = frames_to_lock;
		resets_left--;
	}
	if(!validPlace(current_block, current_x+1, current_y, current_rot)) { return; }
	current_x++;
}

function rotate(rotation) {
	if(frames_until_lock != frames_to_lock && resets_left > 0) {
		frames_until_lock = frames_to_lock;
		resets_left--;
	}
	var wanted_direction;

	if(rotation == "180") {
		if(validPlace(current_block, current_x, current_y, current_rot - 2)) {
			current_rot--;
			current_rot--;
			current_shape = current_block.rot(current_rot);
			return;
		}
	}

	if(rotation == "cw") {
		wanted_direction = 1;
	} else {
		wanted_direction = -1;
	}

	if(current_block == blocks['o']) {
		return;
	}

	var tested_rotation;
	if(current_rot >= 0) {
		tested_rotation = current_rot%4;
	} else {
		tested_rotation = (-(-(current_rot)%4) + 4 ) % 4;
	}
	if(current_block != blocks['i']) {
		for(var temp_rot = 0; temp_rot < 5; temp_rot++) {
			var active_dx = kicks[tested_rotation][rotation][temp_rot][0];
			var active_dy = -kicks[tested_rotation][rotation][temp_rot][1];
			if(validPlace(current_block, current_x + active_dx, current_y + active_dy, current_rot + wanted_direction)) {				current_rot += wanted_direction;
				current_x += active_dx;
				current_y += active_dy;
				current_shape = current_block.rot(current_rot);
				return;
			}
		}
		return;
	} else {
		for(var temp_rot = 0; temp_rot < 5; temp_rot++) {
			var active_dx = kicks['i'][tested_rotation][rotation][temp_rot][0];
			var active_dy = -kicks['i'][tested_rotation][rotation][temp_rot][1];
			if(validPlace(current_block, current_x + active_dx, current_y + active_dy, current_rot + wanted_direction)) {
				current_rot += wanted_direction;
				current_x += active_dx;
				current_y += active_dy;
				current_shape = current_block.rot(current_rot);
				return;
			}
		}
		return;
	}
}

function holdPiece() {
	if(!can_hold) { return;	}
	if(held == null) {
		held = current_block;
	} else {
		var temp = held;
		held = current_block;
		nexts.unshift(temp);
	}
	can_hold = false;
	nextPiece();
}

function fullDrop() {
	while (validPlace(current_block, current_x, current_y + 1, current_rot)){
		current_y++;
	}
	addMinos(current_block, current_x, current_y, current_rot);
	can_hold = true;
	nextPiece();
}

function nextPiece() {
	frames_per_down = Math.floor(99 / Math.pow(1.1, level));
	frames_until_down = frames_per_down;
	frames_to_lock = 50;
	frames_until_lock = frames_to_lock;
	resets_left = 5;
	current_block = nexts[0];
	nexts.splice(0, 1);
	if(!validPlace(current_block, 3, 0, 0)) { 
		died();
		return;
	}
	if(nexts.length < 5) {
		arrayRandomize(bag_starter).forEach(item => nexts.push(item));
	}
	current_x = 3;
	if(current_block == blocks['o']) {
		current_x++;
	}
	current_y = 0;
	current_rot = 0;
	current_shape = current_block.rot(current_rot);
}

function died() {
	clearInterval(loop);
	current_x = null;
	current_y = null;
	current_rot = null;
	current_shape = null;
	current_block = null;
	alive = false;
	display();
}

function gameloop() {
	if(paused) { return; }
	frames_until_hidden--;
	if(frames_until_hidden < 0) {
		recent_score = 0;
		frames_until_hidden = 0;
	}
	if(das_delay_remaining_side == 0) {
		arr_delay_remaining_side--;
		if(arr_delay_remaining_side < 0) {
			if(holding.left) {
				if(arr == 0) { 
					while (validPlace(current_block, current_x - 1, current_y, current_rot)){
						moveLeft();
					}
				}
				moveLeft();
			} 
			if(holding.right) {
				if(arr == 0) { 
					while (validPlace(current_block, current_x + 1, current_y, current_rot)){
						moveRight();
					}
				}
				moveRight();
			}
			arr_delay_remaining_side = arr;
		}
	} else {
		das_delay_remaining_side--;
	}

	if(das_delay_remaining_down == 0) {
		arr_delay_remaining_down--;
		if(arr_delay_remaining_down == 0) {
			if(holding.down) {
				moveDown();
			} 
			arr_delay_remaining_down = arr;
		}
	} else {
		das_delay_remaining_down--;
	}

	frames_until_down--;
	if(frames_until_down < 0) {
		if(!validPlace(current_block, current_x, current_y+1, current_rot)) {
			frames_until_lock--;
			if(frames_until_lock < 0) {
				fullDrop();
			}
		} else {
			moveDown();
			frames_until_down = frames_per_down;
		}
	}
	display();
}

function loadSettings() {
	var settings = JSON.parse(document.cookie.substring(5));
	console.log(settings);
	keybinds = settings.keybinds;
	das = settings.das;
	arr = settings.arr;
	background.style["background-image"] = settings.bg;
}

if(document.cookie != "") {
	loadSettings();
}

arrayRandomize(bag_starter).forEach(item => nexts.push(item));
nextPiece();
var loop = setInterval(gameloop, 16);;
