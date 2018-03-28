
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
let player = loadTemp("player");
let game = loadTemp("game");

// Currently selected move
let move = null;
let selected = null;

// Updates loop
let loop;

/*
Resizes the board to fit the window
*/
function resizeBoard() {
    let content = $("#content");
    let w = content.width();
    let h = content.height();
    
    let rows = game.board.length;
    let cols = game.board.reduce((m, x, i) => Math.max(m, x.length + i % 2 / 2), 1);
    
    // TODO FIXME
    let hr = (h - 50) / rows / (hex_h + hex_margin_h);
    let wr = (w - 100) / cols / (hex_w + hex_margin_w);
    let scale = Math.max(Math.min(hr, wr), min_scale);
    
    setHexScale(scale);
}

/*
Generates the players list on the sidebar
*/
function makePlayersList() {
    if (game.player_names.length != game.player_colors.length) {
        console.error("Error: Player names and colors don't match up");
    }
    
    let text = "";
    let len = Math.min(game.player_names.length, game.player_colors.length);
    for (let i = 0; i < len; i++) {
        // TODO
    }
    
    $("#players-list").html(text);
}

/*
Generates and displays the board
*/
function makeBoard() {
    $("#content").html(createBoard(game.board, game.player_colors));
}

/*
Called when the user clicks on a hex tile
*/
function clickTile() {
    let r = parseInt($(this).attr("data-r"));
    let c = parseInt($(this).attr("data-c"));
    
    // If the selection was valid
    if (game.turn === player.number && isValidMove(game.board, [r, c])) {
        // Reset the previously seleccted piece
        cancelMove();
        
        // Show the current piece
        let img = getHexImg(NORMAL_PIECE + player.number, game.player_colors);
        $(this).attr("src", img);
        
        move = [r, c];
        selected = this;
    }
}

/*
Clear the currently selected move. Called when the user clicks "Cancel"
*/
function cancelMove() {
    if (selected !== null) {
        let img = getHexImg(NORMAL_PIECE + NO_PLAYER, game.player_colors);
        $(selected).attr("src", img);
    }
    
    move = null;
    selected = null;
}

/*
Submit the currently selected move. Called when the user clicks "Submit"
*/
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
        
    }, function(xhr) {
        if (xhr.status === 400) {
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
            game = obj.game;
            
            for (let msg of obj.messages) {
                receiveMessage(msg);
            }
            
        }, function(xhr) {
            if (xhr.status === 400) {
                showError("#make-move-error", xhr.response);
            } else {
                showError("#make-move-error", "Failed to contact the server");
            }
        });
        
    }, update_loop_delay);
}

/*
Receives message objects from the server and acts according to their content
*/
function receiveMessage(msg) {
    switch (msg.type) {
    case "join":
        makeBoard();
        makePlayersList();
        break;
        
    case "forfeit":
        // TODO
        break;
        
    case "request_draw":
        // TODO
        break;
        
    case "accept_draw":
        // TODO
        break;
        
    case "reject_draw":
        // TODO
        break;
        
    case "pause":
        // TODO
        break;
        
    case "resume":
        // TODO
        break;
        
    case "expired":
        // TODO
        break;
        
    default:
        // TODO
        break;
    }
}

$(document).ready(function() {
    resizeBoard();
    makeBoard();
    makePlayersList();
    $("#game-id").html("Game ID: " + game.id);
    
    // Set board to auto-resize
    $(window).resize(resizeBoard);
    
    // Set tile and button functionality
    $(".hex").not(".hidden").click(clickTile);
    $("#cancel-move").click(cancelMove);
    $("#submit-move").click(submitMove);
    
    // Hide error message divs
    $("div.error").hide();
    
    startUpdateLoop();
});
