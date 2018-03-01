
function scroll(selector) {
    return function() {
        $("#center, #content").animate({
            scrollTop: $(selector).offset().top
        }, 500, "swing");
    };
}

$(document).ready(function() {
    console.log("hello world");
    set_hex_scale(80);
    $("#new-game-button").click(scroll("#new-game-menu"));
    $("#join-game-button").click(scroll("#join-game-menu"));
});
