
const min_scale = 10;

// Local player and game objects
let player = load_temp("player");
let game = load_temp("game");

function resizeBoard() {
    let content = $("#content");
    let w = content.width();
    let h = content.height();
    
    let rows = game.board.length;
    let cols = game.board.reduce((m, x, i) => Math.max(m, x.length + i % 2 / 2), 0);
    
    // TODO FIXME
    let hr = (h - 50) / rows / (hex_h + hex_margin_h);
    let wr = (w - 100) / cols / (hex_w + hex_margin_w);
    
    setHexScale(Math.max(Math.min(hr, wr), min_scale))
}

function makePlayersList() {
    let elem = $("#players-list");
    
    if (game.player_names.length != game.player_colors.length) {
        console.log();
    }
    
    let len = Math.min(game.player_names.length, game.player_colors.length);
    for (let i = 0; i < len; i++) {
        
    }
}

function makeBoard() {
    $("#content").html(createBoard(game.board, game.player_colors));
}

function clickTile() {
    console.log(this);
}

function submitMove() {
    
    let obj = {
        
    };
    
    post("/make-move", obj, function(data) {
        save_temp("player", data.player);
        save_temp("game", data.game);
        
        document.location.href = "/game.html";
        
    }, function(xhr, error) {
        if (xhr.status == 400) {
            showError("#make-move-error", xhr.response);
        } else {
            showError("#make-move-error", "Failed to contact the server");
        }
    });
    
    return false;
}

$(document).ready(function() {
    makeBoard()
    makePlayersList();
    
    resizeBoard();
    
    $(window).resize(resizeBoard);
    $(".hex").not(".hidden").click(clickTile);
});
