$(function () {
    "use strict";

    $(".c-hamburger").click(function (e) {
        e.preventDefault();

        var $this = $(this);
        var $sidebar = $(".c-sidebar");

        ($this.hasClass("is-active")) ? $this.removeClass("is-active") : $this.addClass("is-active");
        ($sidebar.hasClass("is-active")) ? $sidebar.removeClass("is-active") : $sidebar.addClass("is-active");
    });
});
