
function scroll(id, then) {
    $("#content").animate({
        scrollTop: $(id).offset().top
    }, 500, "swing", then);
}

function showPage1(id) {
    // Hide all menu 1 menus except for the one with id
    $("#page1").children().hide();
    $(id).show();
    
    // Scroll to menu 1
    scroll("#page1", function() {
        $("#page2").children().hide();
    });
}

function showPage2(id) {
    // Hide all menu 2 menus except for the one with id
    $("#page2").children().hide();
    $(id).show();
    
    // Scroll to menu 2
    scroll("#page2", function() {
        $("#page1").children().hide();
    });
}

function showError(id, error) {
    $(id).html("Error: " + error);
    $(id).show();
}

function submitNewGame() {
    let username = $("#new-game-username").val();
    let mode = $("input[name=mode]:checked").val();
    
    // TODO get color and board from user input
    let obj = {
        "player_name": username,
        "player_color": "red",
        "board_id": "0",
        "public": mode == "public"
    };
    
    post("/new-game", obj, function(data) {
        save_temp("player", data.player);
        save_temp("game", data.game);
        
        document.location.href = "/game.html";
        
    }, function(xhr, error) {
        if (xhr.status == 400) {
            showError("#new-game-error", xhr.response);
        } else {
            showError("#new-game-error", "Failed to contact the server");
        }
    });
    
    return false;
}

$(document).ready(function() {
    setHexScale(100);
    showPage1("#main-menu");
    
    // Navigation buttons
    
    $(".back-button").click(function() {
        showPage1("#main-menu");
    });
    
    $(".new-game-button").click(function() {
        showPage2("#new-game-menu");
    });
    
    $(".join-game-button").click(function() {
        showPage2("#join-game-menu");
    });
    
    $(".help-button").click(function() {
        showPage2("#help-menu");
    });
    
    // Submit buttons
    
    $("#new-game-submit").click(submitNewGame);
    
    // Error Message Divs
    
    $("div.error").hide();
    
});
