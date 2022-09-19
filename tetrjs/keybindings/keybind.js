const document_values = {
	down: document.getElementById("down"),
	left: document.getElementById("left"),
	right: document.getElementById("right"),
	cw: document.getElementById("cw"),
	ccw: document.getElementById("ccw"),
	flip: document.getElementById("flip"),
	hold: document.getElementById("hold"),
	drop: document.getElementById("drop"),
	reset: document.getElementById("reset"),
	confirm: document.getElementById("confirm"),
	paused: document.getElementById("paused"),
}


const namefinder = document.getElementById("namefinder");
const namedisplay = document.getElementById("display");
namefinder.addEventListener("click", findName);
var waiting = false;

function findName() {
    namedisplay.innerText = "Waiting for input";
    waiting = true;
}

addEventListener("keydown", press);
function press(e) {
    if(waiting) {
        namedisplay.innerText = "\"" + e.key + "\"";
        waiting = false;
    }
}

const generator = document.getElementById("generator");
const generatordisplay = document.getElementById("generator_display");
generator.addEventListener("click", generateKeybinds);

function generateKeybinds() {
    const document_data = {
        down: document_values.down.value,
        left: document_values.left.value,
        right: document_values.right.value,
        cw: document_values.cw.value,
        ccw: document_values.ccw.value,
        flip: document_values.flip.value,
        hold: document_values.hold.value,
        drop: document_values.drop.value,
        reset: document_values.reset.value,
        confirm: document_values.confirm.value,
        paused: document_values.paused.value,
    }

    navigator.clipboard.writeText(JSON.stringify(document_data));
    generatordisplay.innerText = "Copied to clipboard";
    
}
