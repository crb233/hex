
const pages = [1, 2];

function scroll(id, then) {
    $("#content").animate({
        scrollTop: $(id).offset().top
    }, 500, "swing", then);
}

function showPage(n, id) {
    // Hide all menu 1 menus except for the one with id
    $("#page" + n).children().hide();
    $(id).show();
    
    // Scroll to menu 1
    scroll("#page" + n, function() {
        for (let i of pages) {
            if (i !== n) {
                $("#page" + i).children().hide();
            }
        }
    });
}

function showError(id, error) {
    $(id).html("Error: " + error);
    $(id).show();
}

function submitNewGame() {
    let username = $("#new-game-username").val();
    let color = $("input[name=color]:checked").val();
    let mode = $("input[name=mode]:checked").val();
    
    // TODO get board from user input
    let obj = {
        "player_name": username,
        "player_color": color,
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

function submitJoinGame() {
    let username = $("#new-game-username").val();
    let color = $("input[name=color]:checked").val();
    let game_id = $("#new-game-id").val();
    
    let obj = {
        "player_name": username,
        "player_color": color,
        "game_id": "0"
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
    showPage(1, "#main-menu");
    
    // Navigation buttons
    
    $(".back-button").click(function() {
        showPage(1, "#main-menu");
    });
    
    $(".new-game-button").click(function() {
        showPage(2, "#new-game-menu");
    });
    
    $(".join-game-button").click(function() {
        showPage(2, "#join-game-menu");
    });
    
    $(".help-button").click(function() {
        showPage(2, "#help-menu");
    });
    
    // Submit buttons
    
    $("#new-game-submit").click(submitNewGame);
    $("#join-game-submit").click(submitJoinGame);
    
    // Error Message Divs
    
    $("div.error").hide();
});
