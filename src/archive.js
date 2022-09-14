// Setup
import { blocks } from './blocks.js';
import { kicks } from './kicks.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var grid = [];
for (var i = 0; i < 20; i++) {
	grid.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

// Visuals
class Mino {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.color = color;
	}

	drawAsMino() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x + 2, this.y + 2, 36, 36);
	}

	drawAsPreview() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x + 1, this.y + 1, 28, 28);
	}

	drawAsActive() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, 40, 40);
	}

	drawAsGhost() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x + 2, this.y + 2, 36, 4);
		ctx.fillRect(this.x + 2, this.y + 34, 36, 4);
		ctx.fillRect(this.x + 2, this.y + 2, 4, 36);
		ctx.fillRect(this.x + 34, this.y + 2, 4, 36);
	}
}

function display() {
	// drawing grid
	ctx.clearRect(0, 0, canvas.width, canvas.height);;
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.font = '36px Montserrat';
	ctx.fillText('HOLD', 408, 700);
	ctx.fillText('SCORE', 400, 600);
	ctx.fillText('NEXT', 415, 50);
	ctx.font = '36px monospace';
	var display_score = good_score(points);
	ctx.fillText(display_score, 400, 640);
	for (var row = 0; row < 20; row++) {
		for (var col = 0; col < 10; col++) {
			var curmino = new Mino(col * 40, row * 40, color(grid[row][col]));
			curmino.drawAsMino();
		}
	}

	// drawing held block
	var temp_hold = (hold == null) ? [[0,0,0],[0,0,0],[0,0,0]] : hold.rot(0);
	
	for (var row = 0; row < temp_hold.length; row++) {
		for (var col = 0; col < temp_hold[row].length; col++) {
			var temp_color = (temp_hold[row][col] == 0) ? 'rgb(40, 40, 40)' : color(temp_hold[row][col])
			var curmino = new Mino((col+13.5) * 30, (row+24) * 30, temp_color);
			curmino.drawAsPreview();
		}
	}
	// displaying the next few pieces
	for(var piece = 0; piece < 5; piece++) {
		var current_displayed_piece = blocks[next_five[piece]].rot(0);
		for(var row = 0; row < current_displayed_piece.length; row++) {
			for(var col = 0; col < current_displayed_piece[row].length; col++) {
				var temp_color = (current_displayed_piece[row][col] == 0) ? 'rgb(40, 40, 40)' : color(current_displayed_piece[row][col])
				var curmino = new Mino((col+13.5) * 30, (2 + row + (3 * (piece))) * 30, temp_color);
				curmino.drawAsPreview();
			}
		}
	}

	// drawing the block that's being placed now
	if (current_rot != undefined) {
		var polysize = current_shape.rot(0).length;
		for (var i = 0; i < polysize; i++) {
			for (var j = 0; j < polysize; j++) {
				if (current_shape.rot(current_rot)[i][j] == 0) { continue; }
				var curmino = new Mino((current_x + j) * 40, (current_y + i) * 40, color(current_shape.rot(current_rot)[i][j]))
				curmino.drawAsActive();
			}
		}
		
		// and also drawing where the block will be if it hard drops now
		var ghost_y = current_y;

		while (validPlace(current_shape.rot(current_rot), current_x, ghost_y + 1)){
			ghost_y++;
		}

		for (var i = 0; i < polysize; i++) {
			for (var j = 0; j < polysize; j++) {
				if (current_shape.rot(current_rot)[i][j] == 0) { continue; }
				var gmino = new Mino((current_x + j) * 40, (ghost_y + i) * 40, color(current_shape.rot(current_rot)[i][j]))
				gmino.drawAsGhost();
			}
		}
	}
}

function color(x) {
	switch (x) {
		case 0: // None
			return 'rgb(128, 128, 128)';
		case 1: // Z
			return 'rgb(255, 0, 0)';
		case 2: // S
			return 'rgb(0, 255, 0)';
		case 3: // L
			return 'rgb(255, 128, 0)';
		case 4: // J
			return 'rgb(0, 64, 255)';
		case 5: // T
			return 'rgb(192, 0, 255)';
		case 6: // I
			return 'rgb(0, 192, 256)';
		case 7: // O
			return 'rgb(256, 224, 0)';
		default:
			return 'rgb(64, 64, 64)';
	}
}

// Helper functions 

function good_score(n) {
	if(n < 1000000) {
		return n;
	} else {
		return Math.floor(n/100000) / 10 + "m"
	}
}

// https://stackoverflow.com/a/16436975
function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;
  
	// If you don't care about the order of the elements inside
	// the array, you should sort both arrays here.
	// Please note that calling sort on an array will modify that array.
	// you might want to clone your array first.
  
	for (var i = 0; i < a.length; ++i) {
	  if (a[i] !== b[i]) return false;
	}
	return true;
}

function validPlace(shape, x, y) {
	var polysize = shape.length;
	for (var i = 0; i < polysize; i++) {
		for (var j = 0; j < polysize; j++) {
			var checky = i + x;
			var checkx = j + y;
			if((shape[j][i] != 0)) {
				if(checky < 0 || checky > 9 || checkx > 19) {
					return false;
				}
				try {
					if (grid[checkx][checky] != 0) {
						return false;
					}
				} catch {
					return false;
				}
			}
		}
	}
	return true;
}

function addMinos(shape, x, y) {
	resets_used = 0;
	var polysize = shape.length;
	if (!validPlace(shape, x, y)) { return; }
	for (var i = 0; i < polysize; i++) {
		for (var j = 0; j < polysize; j++) {
			var checkx = i + x;
			var checky = j + y;
			if (shape[j][i] != 0) {
				grid[checky][checkx] = shape[j][i];
			}
		}
	}
	clearLines();
}

function clearLines() {
	var tspinned = checkTspin();
	console.log(tspinned);
	var cleared = 0;
	for(var i = 0; i < 20; i++) {
		var pieces_in_this_line_in_particular = 0; // also known as PITLIP
		for(var y = 0; y < 10; y++) {
			if(grid[i][y] != 0) {
				pieces_in_this_line_in_particular++;
			}
		}
		if(pieces_in_this_line_in_particular == 10) {
			// check how many lines are cleared at once
			// add point multipliers based on that and current level
			lines_cleared++;
			cleared++;
			if (lines_cleared >= next_level_req){
				level++;
				next_level_req += 10;
			}
			for (var rows = i; rows > 0; rows--) {
				grid[rows] = [...grid[rows-1]];
			}
		}
	}
	points += addPoints(cleared, tspinned);
}

var b2b = false;
function addPoints(num_cleared, have_tspinned) {
	var points_this_turn = 0;
	var b2bmulti = b2b ? 1.5 : 1;
	if(arraysEqual(grid[19], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])) {
		points_this_turn += (4000 * level);
	}
	if(have_tspinned) {
		switch(num_cleared) {
			case 1:
				b2b = true;
				points_this_turn += 400 * level * b2bmulti;
				break;
			case 2:
				b2b = true;
				points_this_turn += 1200 * level * b2bmulti;
				break;
			case 3:
				b2b = true;
				points_this_turn += 1800 * level * b2bmulti;
				break;
			default:
				break;
		}
	} else {
		switch(num_cleared) {
			default:
				break;
			case 1:
				b2b = false;
				points_this_turn += 50 * level * b2bmulti;
				break;
			case 2:
				b2b = false;
				points_this_turn += 200 * level * b2bmulti;
				break;
			case 3:
				b2b = false;
				points_this_turn += 400 * level * b2bmulti;
				break;
			case 4:
				b2b = true;
				points_this_turn += 1200 * level * b2bmulti;
				break;
		}
	}
		
	return points_this_turn;
}

function randInt(min, max) {
	var max_delta = max - min
	var rand = Math.floor(Math.random() * (max_delta + 1));
	return (rand + min);
}
// Gameplay
var listofMinos = ['z', 's', 'l', 'j', 't', 'i', 'o'];
var bag = [...listofMinos];
var hold = null;
var held = false;
var nexts = [];
var current_shape;
var current_y;
// positive y is down
var current_x;
// positive x is right
var current_rot;
// positive rot is clockwise
var alive = true;
var lines_cleared = 0;
var level = 1;
var points = 0;
var next_five = [];
var next_level_req = 10;

chooseStartingBag();
resetMinos();

addEventListener("keydown", press);

function press(e) {
	// document.getElementById('sound').play();
	// resetting here if we ever add it
	
	if(!alive) {
		return;
	}
	
	if (e.key == "ArrowDown") {
		if (!validPlace(current_shape.rot(current_rot), current_x, current_y + 1)) {
			return
		}
		current_y++;
		frames_until_down = frames_per_down;
	}
	if (e.key == "ArrowLeft") {
		if (!validPlace(current_shape.rot(current_rot), current_x - 1, current_y)) {
			return
		}
		if(resets_used < resets_per_lock && frames_until_lock != frames_to_lock) {
			resets_used++;
			frames_until_lock = frames_to_lock;
		}
		current_x--;
	}
	if (e.key == "ArrowRight") {
		if (!validPlace(current_shape.rot(current_rot), current_x + 1, current_y)) {
			return
		}
		if(resets_used < resets_per_lock && frames_until_lock != frames_to_lock) {
			resets_used++;
			frames_until_lock = frames_to_lock;
		}
		current_x++;
	}
	if (e.key == "ArrowUp") {
		var rotate_status = rotate('cw');
		if(rotate_status[0]) {
			current_rot++;
			current_rot = current_rot%4;
			current_x += rotate_status[1];
			current_y += rotate_status[2];
			if(resets_used < resets_per_lock && frames_until_lock != frames_to_lock) {
				resets_used++;
				frames_until_lock = frames_to_lock;
			}
		}
	}
	if (e.key == "z") {
		var rotate_status = rotate('ccw');
		if(rotate_status[0]) {
			current_rot--;
			current_rot = -(-(current_rot)%4) + 4;
			current_x += rotate_status[1];
			current_y += rotate_status[2];
			if(resets_used < resets_per_lock && frames_until_lock != frames_to_lock) {
				resets_used++;
				frames_until_lock = frames_to_lock;
			}
		}
	}
	if (e.key == "a") {
		if (!validPlace(current_shape.rot(current_rot + 2), current_x, current_y)) {
			return
		}
		if(resets_used < resets_per_lock && frames_until_lock != frames_to_lock) {
			resets_used++;
			frames_until_lock = frames_to_lock;
		}
		current_rot += 2;
	}
	if (e.key == " ") {
		while (validPlace(current_shape.rot(current_rot), current_x, current_y + 1)){
			current_y++;
		}
		addMinos(current_shape.rot(current_rot), current_x, current_y);
		held = false;
		resetMinos();
	}
	if (e.key == "c") {
		// hold piece
		// if empty: put current into hold and get a new block
		// if full: swap current and held
		
		if (!held){
			if (hold == null) {
				held = true;
				hold = current_shape;
				resetMinos();
			}
			else {
				held = true;
				var temp = hold;
				hold = current_shape;
				current_shape = temp;
				current_y = 0;
				current_x = 4;
				current_rot = 0;
			}
			frames_until_lock = frames_to_lock;
		}
	}
	display();
}

function rotate(dir) {
	if(current_rot < 0) {
		current_rot = -(-(current_rot)%4) + 4;
	} else {
		current_rot = current_rot%4;
	}
	var wanted_direction = (dir == 'cw') ? 1 : -1;
	if(current_shape == blocks['o']) {
		return [false, 0, 0];
	}
	if(current_shape != blocks['i']) {
		for(var temp_rot = 0; temp_rot < 5; temp_rot++) {
			var active_dx = kicks[current_rot][dir][temp_rot][0];
			var active_dy = -kicks[current_rot][dir][temp_rot][1];
			if(validPlace(current_shape.rot(current_rot + wanted_direction), current_x + active_dx, current_y + active_dy)) {
				return [true, active_dx, active_dy];
			}
		}
		return [false, 0, 0]
	}
	if(current_shape == blocks['i']) {
		for(var temp_rot = 0; temp_rot < 5; temp_rot++) {
			var active_dx = kicks['i'][current_rot][dir][temp_rot][0];
			var active_dy = -kicks['i'][current_rot][dir][temp_rot][1];
			if(validPlace(current_shape.rot(current_rot + wanted_direction), current_x + active_dx, current_y + active_dy)) {
				return [true, active_dx, active_dy];
			}
		}
		return [false, 0, 0]
	}
}

function checkTspin() {
	if(current_y == 18) { return false; }
	var t_counter = 0;
	if(current_shape == blocks['t']) {
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
	if(t_counter >= 3) {
		return true;
	}
	else {
		return false;
	}
}

const max_frames_per_down = 50;
var frames_per_down = max_frames_per_down; // reset to this value
var frames_until_down = frames_per_down; // decrease this value

var frames_to_lock = 50;
var frames_until_lock = frames_to_lock;

var resets_per_lock = 5;
var resets_used = 0;

var loop = setInterval(gameloop, 20);
function gameloop() {
	if(!validPlace(current_shape.rot(current_rot), current_x, current_y + 1)) {
		frames_until_lock--;
	}
	// moves the pieces down automatically
	frames_until_down--;
	if (frames_until_down < 0) {
		frames_until_down = Math.floor((max_frames_per_down * Math.pow(0.8, level-1)))
		if (validPlace(current_shape.rot(current_rot), current_x, current_y + 1)) {
			current_y++;
		}
		else {
			if(frames_until_lock < 0) { 
				addMinos(current_shape.rot(current_rot), current_x, current_y);
				held = false;
				resetMinos();
			}
		}
	}
	display();
}

function chooseStartingBag() {
	var unused = [...listofMinos];
	for(var i = 0; i < listofMinos.length; i++) {
		var num = randInt(0, unused.length - 1);
		nexts.push(unused.splice(num, 1));
	}
}

function chooseMinos() {
	// choose one mino to use
	// refill when empty
	if (bag.length == 0) {
		bag = [...listofMinos];
	}
	var num = randInt(0, bag.length - 1);
	nexts.push(bag.splice(num, 1));
	var used = nexts.splice(0, 1)[0][0];
	for(var i = 0; i < 5; i++) {
		next_five[i] = nexts[i][0];
	}
	return used;
}

function resetMinos() {
	frames_until_lock = frames_to_lock;
	var chosen_minos = chooseMinos();
	current_shape = blocks[chosen_minos];
	current_y = 0;
	current_x = 3;
	if(chosen_minos == "o") {
		current_x++;
	}
	current_rot = 0;
	if (!validPlace(current_shape.rot(current_rot), current_x, current_y)) {
		alive = false;
		clearInterval(loop);
		current_y = -10;
	}
}
display();