
function scroll(id, then) {
    $("#content").animate({
        scrollTop: $(id).offset().top
    }, 500, "swing", then);
}

function showMenu1(id) {
    // Hide all menu 1 menus except for the one with id
    $("#menu1").children().hide();
    $(id).show();
    
    // Scroll to menu 1
    scroll("#menu1", function() {
        $("#menu2").children().hide();
    });
}

function showMenu2(id) {
    // Hide all menu 2 menus except for the one with id
    $("#menu2").children().hide();
    $(id).show();
    
    // Scroll to menu 2
    scroll("#menu2", function() {
        $("#menu1").children().hide();
    });
}

$(document).ready(function() {
    set_hex_scale(100);
    showMenu1("#main-menu");
    
    $(".back-button").click(function() {
        showMenu1("#main-menu");
    });
    
    $(".new-game-button").click(function() {
        showMenu2("#new-game-menu");
    });
    
    $(".join-game-button").click(function() {
        showMenu2("#join-game-menu");
    });
    
    $(".help-button").click(function() {
        showMenu2("#help-menu");
    });
});
