
function scroll(id) {
    $("#content").animate({
        scrollTop: $("#" + id).offset().top
    }, 500, "swing");
}

function setSubMenu(id) {
    $("#sub-menu").children().appendTo("html");
    $("#" + id).appendTo("#sub-menu");
}

$(document).ready(function() {
    set_hex_scale(100);
    
    $(".back-button").click(function() {
        scroll("main-menu");
    });
    
    $(".new-game-button").click(function() {
        setSubMenu("new-game-menu");
        scroll("sub-menu");
    });
    
    $(".join-game-button").click(function() {
        setSubMenu("join-game-menu");
        scroll("sub-menu");
    });
    
    $(".help-button").click(function() {
        setSubMenu("help-menu");
        scroll("sub-menu");
    });
});
