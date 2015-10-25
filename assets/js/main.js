$(document).ready(function () {
    $("#mobile-menu").click(function (e) {
        e.preventDefault();
        $(".c-navigation").slideToggle();
    });
});
