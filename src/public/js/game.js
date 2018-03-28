
/*
TODO: if player or game aren't found in temporary storage, check local storage
for the most recent player and game. If local storage doesn't have a recent
game, fail and display the error message.
*/

// The delay between get-update requests in milliseconds
const update_loop_delay = 1000;

// The minimum scale of the game board
const min_scale = 10;

// Local player and game objects
let player = load_temp("player");
let game = load_temp("game");

// Currently selected move
let move = null;
let selected = null;

// Check for updates loop
let loop;

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
        // TODO
    }
}

function makeBoard() {
    $("#content").html(createBoard(game.board, game.player_colors));
}

function clickTile() {
    let r = parseInt($(this).attr("data-r"));
    let c = parseInt($(this).attr("data-c"));
    
    // If the selection was valid
    if (game.turn === player.number && isValidMove(game.board, [r, c])) {
        // Reset the previously seleccted piece
        if (selected !== null) {
            let img = getHexImg(NORMAL_PIECE + NO_PLAYER, game.player_colors);
            $(selected).attr("src", img)
        }
        
        // Show the current piece
        let img = getHexImg(NORMAL_PIECE + player.number, game.player_colors);
        $(this).attr("src", img);
        
        move = [r, c];
        selected = this;
    }
}

function cancelMove() {
    if (selected !== null) {
        let img = getHexImg(NORMAL_PIECE + NO_PLAYER, game.player_colors);
        $(selected).attr("src", img)
    }
    
    move = null;
    selected = null;
}

function submitMove() {
    $("#make-move-error").hide();
    
    let obj = {
        "player_id": player.id,
        "move": move
    };
    
    post("/make-move", obj, function(data) {
        game = data.game;
        makeBoard();
        console.log("success!");
        
    }, function(xhr, error) {
        if (xhr.status == 400) {
            showError("#make-move-error", xhr.response);
        } else {
            showError("#make-move-error", "Failed to contact the server");
        }
    });
    
    return false;
}

/*
Starts an infinite loop of requesting updates from the server in intervals
determined by the constant UPDATE_LOOP_TIME
*/
function startUpdateLoop() {
    loop = setInterval(function(){
        
        let data = {
            player_id: player.id
        };
        
        post("/get-updates", data, function(obj) {
            // Check if there are any winners
            let winner = getWinner(obj.game.board);
            
            // // First player wins
            // if (winner === player.number) {
            //     alert("Congratulations, " + game.player_names[winner] + ", you win!");
            // } else if (winner !== NO_PLAYER) {
            //     alert("Sorry, " + game.player_names[player.number] + ", " + game.player_names[winner] + " won.");
            // }
            
            // if it was your opponent's turn
            if (game.turn !== player.number) {
                game = obj.game;
                resetBoard();
            }
            
            game = obj.game;
            updateTable();
            
            for (let msg of obj.messages) {
                receiveMessage(msg);
            }
            
        }, function(xhr, error) {
            if (xhr.status == 400) {
                showError("#make-move-error", xhr.response);
            } else {
                showError("#make-move-error", "Failed to contact the server");
            }
        });
        
    }, update_loop_delay);
}

$(document).ready(function() {
    makeBoard()
    makePlayersList();
    resizeBoard();
    
    // Set board to auto-resize
    $(window).resize(resizeBoard);
    
    // Set hex tile click function
    $(".hex").not(".hidden").click(clickTile);
    
    $("#cancel-move").click(cancelMove);
    $("#submit-move").click(submitMove);
    
    // Hide error message divs
    $("div.error").hide();
    
    startUpdateLoop();
});
