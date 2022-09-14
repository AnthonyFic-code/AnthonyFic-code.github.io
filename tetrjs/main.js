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

function display() {
	// resetting grid
	ctx.clearRect(0, 0, canvas.width, canvas.height);;
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.font = '36px Montserrat';
	ctx.fillText('HOLD', 80, 50);
	ctx.fillText('SCORE', 615, 600);
	ctx.fillText('NEXT', 615, 50);
	ctx.font = '36px Ubuntu';
	ctx.fillText(formatted_score(score), 615, 640);
    // draw grid
    for(var row = 0; row < 20; row++) {
        for (var col = 0; col < 10; col++) {
			var color = find_color(row, col);
			if(color != null) {
				ctx.fillStyle = color;
				ctx.fillRect(col*40 + 202, row*40 + 2, 36, 36);
			}
		}
    }

	// drawing held block
    
	// displaying the next few pieces
	for(var piece = 0; piece < 5; piece++) {

	}

	// drawing the block that's being placed now
		

    // and also drawing where the block will be if it hard drops now
}

function find_color(x, y) {
    var tile_number = grid[x][y];
    switch(tile_number) {
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
			return 'rgb(255, 224, 0)';
		default:
			return null;
    }
}

// Helper functions

function formatted_score(n) {
	if(n < 1000000) {
		return n;
	} else if (n < 1000000000) {
		return Math.floor(n/100000) / 10 + "m";
	} else {
		return Math.floor(n/100000000) / 10 + "b";
	} // I don't think it's physically possible to go further
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

function randInt(min, max) {
	var max_delta = max - min
	var rand = Math.floor(Math.random() * (max_delta + 1));
	return (rand + min);
}

function validPlace(shape, x, y) {

}

function addMinos(shape, x, y) {

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
// ⮞ Scoring-related
var score = 0;
var b2b_chain = 0;
// ⮞ Queue-related

// ⮞ Current piece-related


addEventListener("keydown", press);
addEventListener("keyup", unpress);

var holding = {
	down: false,
	left: false,
	right: false,
	up: false,
	z: false,
	a: false,
	c: false,
	space: false
};


function press(e) {
	if(e.key == "ArrowDown") {
		moveDown();
		holding.down = true;
	}

	if(e.key == "ArrowLeft") {
		moveLeft();
		holding.left = true;
	}

	if(e.key == "ArrowRight") {
		moveRight();
		holding.right = true;
	}

	// Up, Z, A, C, and Space shouldn't be repeated when held down

	if(e.key == "ArrowUp") {
		if(holding.up) { return }
		rotate('cw');
		holding.up = true;
	}

	if(e.key == "z") {
		if(holding.z) { return }
		rotate('ccw');
		holding.z = true;
	}

	if(e.key == "a") {
		if(holding.a) { return }
		rotate('180');
		holding.a = true;
	}

	if(e.key == "c") {
		if(holding.c) { return }
		holdPiece();
		holding.c = true;
	}

	if(e.key == " ") {
		if(holding.space) { return }
		fullDrop();
		holding.space = true;
	}
}

function unpress(e) {
	if(e.key == "ArrowDown") {holding.down = false;}
	if(e.key == "ArrowLeft") {holding.left = false;}
	if(e.key == "ArrowRight") {holding.right = false;}
	if(e.key == "ArrowUp") {holding.up = false;}
	if(e.key == "z") {holding.z = false;}
	if(e.key == "a") {holding.a = false;}
	if(e.key == "c") {holding.c = false;}
	if(e.key == " ") {holding.space = false;}
}

function moveDown() {

}

function moveLeft() {

}

function moveRight() {

}

function rotate(rotation) {

}

function holdPiece() {

}

function fullDrop() {

}

var loop = setInterval(gameloop, 20);

function gameloop() {
	display();
}

clearLines();