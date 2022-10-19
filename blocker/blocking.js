const namefinder = document.getElementById("blocked");
const site = document.getElementById("site");
namefinder.addEventListener("click", openSite);

function openSite() {
    if(site.value.indexOf("http") == -1) { // I don't think magnet would work
        site.value = "https://" + site.value;
    }
    location.href = site.value + "/unblocked/";
}