"use strict";

const toggleButtons = document.querySelectorAll('[data-role="class-toggler"]');

for (const toggleButton of toggleButtons) {
    toggleButton.addEventListener('click', function (ev) {
        ev.preventDefault();

        const targetSelector = this.getAttribute('data-target');
        const toggleClass = this.getAttribute('data-toggle-class');

        const targetElement = document.querySelector(targetSelector);

        targetElement.classList.toggle(toggleClass);
        this.setAttribute('aria-expanded', targetElement.classList.contains(toggleClass) ? 'true' : 'false');
    });
}
