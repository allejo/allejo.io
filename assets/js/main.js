$(function () {
    "use strict";

    $('.c-hamburger').click(function (e) {
        e.preventDefault();

        var $body = $('.c-body');

        $body.toggleClass('u-nav-open');
    });
});
