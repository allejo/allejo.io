"use strict";

/**
 * Toggle a class for an element.
 *
 * @param {Element} element
 * @param {string} toggleClass
 *
 * @link https://stackoverflow.com/a/25544148
 */
function toggleClass(element, toggleClass){
    var currentClass = element.className;
    var newClass;

    if (currentClass.split(' ').indexOf(toggleClass) > -1) {
        newClass = currentClass.replace(new RegExp('\\b' + toggleClass + '\\b', 'g'), '')
    } else {
        newClass = currentClass + ' ' + toggleClass;
    }

    element.className = newClass.trim();
}

var hamburger = document.getElementsByClassName('c-hamburger');

hamburger[0].addEventListener('click', function (ev) {
    ev.preventDefault();

    var body = document.getElementsByClassName('c-body');

    toggleClass(body[0], 'u-nav-open');
});
