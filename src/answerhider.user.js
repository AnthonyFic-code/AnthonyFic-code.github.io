// ==UserScript==
// @name         ProjectEulerAnswer
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Hides the answer to Project Euler, to prevent accidental answer giving.
// @author       AnthonyFic-code
// @match        https://projecteuler.net/*
// @icon         https://anthonyfic-code.github.io/src/crow.png
// @grant        none
// @exclude      *&unhide=true
// ==/UserScript==

(function() {
    'use strict';

    var ans = document.getElementById('problem_answer').children[0].children[0].children[0].children[0];
    if(!ans.innerText.includes("Answer:")) {
        ans.innerText = "[Removed]";
    }
})();
