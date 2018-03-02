
function scroll(id) {
    return function() {
        $("#center, #content").animate({
            scrollTop: $("#" + id).offset().top
        }, 500, "swing");
    };
}

$(document).ready(function() {
    set_hex_scale(80);
    $(".back-button").click(scroll("main-menu"));
    $("#new-game-button").click(scroll("new-game-menu"));
    $("#join-game-button").click(scroll("join-game-menu"));
    $("#help-button").click(scroll("help-menu"));
});
