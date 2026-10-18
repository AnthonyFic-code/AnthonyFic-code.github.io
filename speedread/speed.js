const start_button = document.getElementById("start")
start_button.addEventListener("click", start_read)
let start_time = 0
let started = false;

// from https://en.wikipedia.org/wiki/Opal
// https://en.wikipedia.org/wiki/Pronunciation_of_GIF
// https://en.wikipedia.org/wiki/Euclidean_algorithm
const excerpts = {
'1': `Opal is a hydrated amorphous form of silica; its water content may range from 3% to 21% by weight,
but is usually between 6% and 10%. Due to the amorphous (chemical) physical structure,
it is classified as a mineraloid, unlike crystalline forms of silica, which are considered minerals.
It is deposited at a relatively low temperature and may occur in the fissures of almost any kind of rock,
being most commonly found with limonite, sandstone, rhyolite, marl, and basalt.
The name opal is believed to be derived from the Sanskrit word upala, which means 'jewel',
and later the Greek derivative opállios.
There are two broad classes of opal: precious and common. Precious opal displays play-of-color (iridescence);
common opal does not. Play-of-color is defined as "a pseudo chromatic optical effect resulting in flashes of
colored light from certain minerals, as they are turned in white light." The internal structure of precious
opal causes it to diffract light, resulting in play-of-color. Depending on the conditions in which it formed,
opal may be transparent, translucent, or opaque, and the background color may be white, black, or nearly
any color of the visual spectrum. Black opal is considered the rarest, while white, gray, and green opals
are the most common.`
    .replaceAll('\n', ' ').split(' '),
'2': `The pronunciation of GIF, an acronym for the Graphics Interchange Format, has been disputed since the 1990s.
Popularly rendered in English as a one-syllable word, the acronym is most commonly pronounced GHIF (with a hard g as in gig)
or JIF (with a soft g as in gin), differing in the phoneme represented by the letter G.
Many public figures and institutions have taken sides in the debate;
Steve Wilhite, the computer scientist who created the Graphics Interchange Format,
gave a speech at the 2013 Webby Awards arguing for the soft-g pronunciation.
Others have pointed to the term's origin from abbreviation of the hard-g word graphics to argue for the other pronunciation.
Some speakers pronounce GIF as an initialism rather than an acronym, producing G I F.
The controversy stems partly from the fact that the pronunciation of an initial g is not standardized;
the hard g prevails in words such as gift, while the soft g is used in others such as ginger.
Linguistic analyses show no clear advantage for either phoneme based on the pronunciation frequencies of similar English words,
and English dictionaries generally accept both main alternatives as valid.
The pronunciation of the acronym can also vary in other languages.`
    .replaceAll('\n', ' ').split(' '),
'3': `In mathematics, the Euclidean algorithm, or Euclid's algorithm, is an efficient method for computing the greatest common divisor
(GCD) of two integers, the largest number that divides them both without a remainder.
It is named after the ancient Greek mathematician Euclid, who first described it in his Elements (circa 300 BC).
It is an example of an algorithm, and is one of the oldest algorithms in common use.
It can be used to reduce fractions to their simplest form, and is a part of many other number-theoretic
and cryptographic calculations.
The Euclidean algorithm is based on the principle that the greatest common divisor of two numbers does not change
if the larger number is replaced by its difference with the smaller number.
For example, 21 is the GCD of 252 and 105 (as 252= 21*12 and 105= 21*5),
and the same number 21 is also the GCD of 105 and 252-105 =147.
Since this replacement reduces the larger of the two numbers,
repeating this process gives successively smaller pairs of numbers until the two numbers become equal.
When that occurs, that number is the GCD of the original two numbers.
By reversing the steps or using the extended Euclidean algorithm, ts
he GCD can be expressed as a linear combination of the two original numbers,
that is the sum of the two numbers, each multiplied by an integer (for example, 21= 5*105 + (-2)*252).
The fact that the GCD can always be expressed in this way is known as Bézout's identity.`
    .replaceAll('\n', ' ').split(' ')
}
let text = excerpts['1']

const reading_select = document.getElementById("reading")
function start_read() {
    started = true
    start_time = Date.now()
    text = excerpts[reading_select.value]
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
    started = false
}


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