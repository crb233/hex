
const pages = [1, 2];

// Error message objects
let newGameError;
let joinGameError;

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

function submitNewGame() {
    let username = $("#new-game-username").val();
    let color = $("input[name=color-new]:checked").val();
    let mode = $("input[name=mode]:checked").val();
    
    // TODO get board from user input
    let obj = {
        "player_name": username,
        "player_color": color,
        "board_id": "0",
        "public": mode === "public"
    };
    
    post("/new-game", obj, function(data) {
        saveTemp("player", data.player);
        saveTemp("game", data.game);
        
        document.location.href = "/game.html";
        
    }, function(xhr) {
        if (xhr.status === 400) {
            newGameError.show(xhr.response);
        } else {
            newGameError.show("Failed to contact the server");
        }
    });
    
    return false;
}

function submitJoinGame() {
    let username = $("#join-game-username").val();
    let color = $("input[name=color-join]:checked").val();
    let game_id = $("#join-game-id").val();
    
    let obj = {
        "player_name": username,
        "player_color": color,
        "game_id": game_id
    };
    
    post("/join-game", obj, function(data) {
        saveTemp("player", data.player);
        saveTemp("game", data.game);
        
        document.location.href = "/game.html";
        
    }, function(xhr) {
        if (xhr.status === 400) {
            joinGameError.show(xhr.response);
        } else {
            joinGameError.show("Failed to contact the server");
        }
    });
    
    return false;
}

$(document).ready(function() {
    setHexScale(100);
    showPage(1, "#main-menu");
    
    // Set navigation button functions
    
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
    
    // Set submit button functions
    $("#new-game-submit").click(submitNewGame);
    $("#join-game-submit").click(submitJoinGame);
    
    // Create error message objects
    newGameError = new ErrorMessage("#new-game-error");
    joinGameError = new ErrorMessage("#join-game-error");
});
