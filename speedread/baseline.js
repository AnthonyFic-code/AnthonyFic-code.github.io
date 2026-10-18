const start_button = document.getElementById("start")
start_button.addEventListener("click", start_read)

const text_elem = document.getElementById("text")

let start_time = 0
let started = false;
function start_read() {
    text_elem.classList.remove("hidden")
    started = true
    start_time = Date.now()
}

const word_count = document.getElementById("text").innerText.split(" ").length


const timer = document.getElementById("timer")
const wpm_indicator = document.getElementById("wpm")
function wpmloop() {
    window.requestAnimationFrame(wpmloop);
    if(!started) { return; }
    const elapsed = (Date.now() - start_time) / 1000
    const seconds = Math.floor(elapsed)
    const wpm = Math.round(word_count / (elapsed / 60))
    timer.innerText = `${seconds}s – `
    wpm_indicator.innerText = `${wpm} WPM`
}


window.requestAnimationFrame(wpmloop);