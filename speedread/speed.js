const start_button = document.getElementById("start")
start_button.addEventListener("click", start_read)
let start_time = 0
let started = false;
function start_read() {
    started = true
    start_time = Date.now()
}

const wpm_slider = document.getElementById("wpmslider")
const wpm_num_display = document.getElementById("wpmnum")
const frame_num_display = document.getElementById("framenum")
let wpm = wpm_slider.value;
wpm_slider.addEventListener('input', update_wpm)
function update_wpm() {
    // At 30fps, the maximum possible WPM is 30x60=1800
    // frames/min values that do not divide 1800 will each last 
    // a fractional frame count which does not look good
    const frames_per_word = Math.round(3600 / wpm_slider.value)
    wpm = 3600 / frames_per_word
    wpm_num_display.innerText = `${Math.round(wpm)} WPM`
    frame_num_display.innerText = `(${frames_per_word}f/word)`
}

// todo: replace
// from https://en.wikipedia.org/wiki/Opal
let text = `Opal is a hydrated amorphous form of silica (SiO2·nH2O); its water content may range from 3% to 21% by weight, but is usually between 6% and 10%. Due to the amorphous (chemical) physical structure, it is classified as a mineraloid, unlike crystalline forms of silica, which are considered minerals. It is deposited at a relatively low temperature and may occur in the fissures of almost any kind of rock, being most commonly found with limonite, sandstone, rhyolite, marl, and basalt.
The name opal is believed to be derived from the Sanskrit word upala (उपल), which means 'jewel', and later the Greek derivative opállios (ὀπάλλιος).[5]
There are two broad classes of opal: precious and common. Precious opal displays play-of-color (iridescence); common opal does not.[6] Play-of-color is defined as "a pseudo chromatic optical effect resulting in flashes of colored light from certain minerals, as they are turned in white light."[7] The internal structure of precious opal causes it to diffract light, resulting in play-of-color. Depending on the conditions in which it formed, opal may be transparent, translucent, or opaque, and the background color may be white, black, or nearly any color of the visual spectrum. Black opal is considered the rarest, while white, gray, and green opals are the most common.`

text = text.replaceAll('\n', ' ').split(' ')
console.log(text)

const word = document.getElementById("word")

function readerloop() {
    window.requestAnimationFrame(readerloop);
    if(!started) { return; }
    const elapsed = Date.now() - start_time
    const ms_per_word = 1 / wpm * 60000
    const words_elapsed = Math.floor(elapsed / ms_per_word)
    if(words_elapsed >= text.length) {
        started = false
        word.innerHTML = "&MediumSpace;"
        return
    }
    const next_word = text[words_elapsed]
    word.innerText = text[words_elapsed]
}


window.requestAnimationFrame(readerloop);