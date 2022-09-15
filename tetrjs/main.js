// Setup
import { blocks } from './blocks.js';
import { kicks } from './kicks.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var grid = [];
for (var i = 0; i < 20; i++) {
	grid.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}
/*
const variable = document.getElementById( );
variable.addEventListener("click", func);
variable.classList.add( );
*/

// Visuals

function display() {
	// resetting grid
	ctx.clearRect(0, 0, canvas.width, canvas.height);;
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.font = '36px Montserrat';
	ctx.fillText('HOLD', 80, 50);
	ctx.fillText('LEVEL', 75, 600);
	ctx.fillText('SCORE', 615, 600);
	ctx.fillText('NEXT', 615, 50);
	ctx.font = '36px Ubuntu';
	ctx.fillText(formattedScore(score), 615, 640);
	ctx.fillText(level, 129-numDigits(level)*9, 640);
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

function formattedScore(n) {
	if(n < 1000000) {
		return n;
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
	if (!validPlace(block, x_pos, y_pos, rot)) { return; }
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
	scoreClears(cleared_lines);
	for(var i = 0; i < cleared_rows.length; i++) {
		var clearing_line = cleared_rows[i];
		grid.splice(clearing_line, 1);
		grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	}
}

function scoreClears() {
	checkTspin();
}

function checkTspin() {

}

// Gameplay
// ⮞ General
var level = 1;
var alive = true;
// ⮞ Scoring-related
var score = 0;
var b2b_chain = 0;
// ⮞ Queue-related
var bag_starter_type = ['z', 's', 'l', 'j', 't', 'i', 'o'];
var bag_starter = [];
bag_starter_type.forEach(item => bag_starter.push(blocks[item]));
var nexts = [];
// ⮞ Current piece-related
var current_x;
var current_y;
var current_rot;
var current_block;
var current_shape;
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
	drop: false
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
	drop: " "
}
var das = 10 // DELAYED AUTO SHIFT - frames until ARR activates
var arr = 2 // AUTOMATIC REPEAT RATE - frames per repeat

var das_delay_remaining_side = das;
var arr_delay_remaining_side = arr;
var das_delay_remaining_down = das;
var arr_delay_remaining_down = arr;


addEventListener("keydown", press);
addEventListener("keyup", unpress);

function press(e) {
	if(!alive) { return }
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
		rotate('cw');
		rotate('cw');
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
}

function moveDown() {
	if(!validPlace(current_block, current_x, current_y+1, current_rot)) { return; }
	current_y++;
}

function moveLeft() {
	if(!validPlace(current_block, current_x-1, current_y, current_rot)) { return; }
	current_x--;
}

function moveRight() {
	if(!validPlace(current_block, current_x+1, current_y, current_rot)) { return; }
	current_x++;
}

function rotate(rotation) {
	current_rot %= 4;
	var wanted_direction;
	if(rotation == "cw") {
		wanted_direction = 1;
	} else {
		wanted_direction = -1;
	}

	if(current_block == blocks['o']) {
		return;
	}

	if(current_block != blocks['i']) {
		for(var temp_rot = 0; temp_rot < 5; temp_rot++) {
			var active_dx = kicks[current_rot][rotation][temp_rot][0];
			var active_dy = -kicks[current_rot][rotation][temp_rot][1];
			if(validPlace(current_block, current_x + active_dx, current_y + active_dy, current_rot + wanted_direction)) {
				current_rot += wanted_direction;
				current_x += active_dx;
				current_y += active_dy;
				current_shape = current_block.rot(current_rot);
				return;
			}
		}
		return;
	} else {
		for(var temp_rot = 0; temp_rot < 5; temp_rot++) {
			var active_dx = kicks['i'][current_rot][rotation][temp_rot][0];
			var active_dy = -kicks['i'][current_rot][rotation][temp_rot][1];
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
	current_block = nexts[0];
	nexts.splice(0, 1);
	if(!validPlace(current_block, 3, 0, 0)) { 
		stopInterval(loop);
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
	current_x = null;
	current_y = null;
	current_rot = null;
	current_shape = null;
	current_block = null;
	alive = false;
}

function gameloop() {
	if(das_delay_remaining_side == 0) {
		arr_delay_remaining_side--;
		if(arr_delay_remaining_side == 0) {
			if(holding.left) {
				moveLeft();
			} 
			if(holding.right) {
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


	display();
}

arrayRandomize(bag_starter).forEach(item => nexts.push(item));
nextPiece();
var loop = setInterval(gameloop, 16);;
