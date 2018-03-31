
/*
TODO: if player or game aren't found in temporary storage, check local storage
for the most recent player and game. If local storage doesn't have a recent
game, fail and display the error message.

TODO: when a piece is selected, allow the use of backspace and enter keys to
cancel or submit the move.
*/

// The delay between get-update requests in milliseconds
const UPDATE_LOOP_DELAY = 1000;

// The minimum scale of the game board
const MIN_SCALE = 10;

// Local player and game objects
let player = loadTemp("player");
let game = loadTemp("game");

// Currently selected move
let move = null;
let selected = null;

// The update loop
let loop;

// Error message object
let gameError;

function setGame(gameObject) {
    game = gameObject;
    saveTemp("game", gameObject);
}

/*
Resizes the board to fit the window
*/
function resizeBoard() {
    let content = $("#content");
    let w = content.width();
    let h = content.height();
    
    let pieces = game.board.pieces;
    let rows = pieces.length;
    let cols = pieces.reduce((m, x, i) => Math.max(m, x.length + i % 2 / 2), 1);
    
    // TODO FIXME
    let hr = (h - 50) / rows / (HEX_TILE_H + HEX_MARGIN_H);
    let wr = (w - 100) / cols / (HEX_TILE_W + HEX_MARGIN_W);
    let scale = Math.max(Math.min(hr, wr), MIN_SCALE);
    
    setHexScale(scale);
}

/*
Generates the players list on the sidebar
*/
function showPlayers() {
    if (game.player_names.length != game.player_colors.length) {
        console.error("Error: Player names and colors don't match up");
    }
    
    let res = [];
    let len = Math.min(game.player_names.length, game.player_colors.length);
    for (let i = 0; i < len; i++) {
        res.push("<div class='player-name");
        if (i + 1 == game.turn) {
            res.push(" selected");
        }
        res.push("'>");
        res.push(game.player_names[i]);
        res.push("</div>");
    }
    
    $("#players-list").html(res.join(""));
}

/*
Generates and displays the board
*/
function showBoard() {
    let pieces = boardHtml(game.board, game.player_colors, "clickTile", "hoverTile");
    $("#content").html(pieces);
}

/*
Returns whether the current player cn make a move
*/
function canMakeMove() {
    return game.active && game.turn === player.number;
}

/*

*/
function checkForWinner() {
    let winner = getWinner(game.board);
    if (winner === player.number) {
        alert("You win! :)");
    } else if (winner !== NO_PLAYER) {
        alert("You lose! :(");
    }
}

/*
Called when the user hovers over a hex tile
*/
function hoverTile(elem, r, c) {
    
}

/*
Called when the user clicks on a hex tile
*/
function clickTile(elem, r, c) {
    // If the selection was valid
    if (canMakeMove() && isValidMove(game.board, [r, c])) {
        // Reset the previously seleccted piece
        cancelMove();
        
        // Show the current piece
        let img = getHexImg(SELECT_PIECE + player.number, game.player_colors);
        $(elem).attr("src", img);
        
        move = [r, c];
        selected = elem;
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
    if (!canMakeMove()) {
        gameError.show("You can't make a move yet");
        return false;
    }
    
    if (move === null) {
        gameError.show("You must select a tile to make your move");
        return false;
    }
    
    if (!isValidMove(game.board, move)) {
        gameError.show("Invalid move");
        return false;
    }
    
    applyMove(game.board, move, player.number);
    nextTurn(game);
    
    let obj = {
        "player_id": player.id,
        "move": move
    };
    
    post("/make-move", obj, function(data) {
        setGame(data.game);
        showBoard();
        showPlayers();
        
        move = null;
        selected = null;
        
        checkForWinner();
        
    }, function(xhr) {
        if (xhr.status === 400) {
            gameError.show(xhr.response);
        } else {
            gameError.show("Failed to contact the server");
        }
    });
    
    return false;
}

/*
Starts an infinite loop of requesting updates from the server in intervals
determined by the constant UPDATE_LOOP_DELAY
*/
function startUpdateLoop() {
    loop = setInterval(function(){
        
        let data = {
            player_id: player.id
        };
        
        post("/get-updates", data, function(obj) {
            if (!game.active || game.turn !== player.number) {
                setGame(obj.game);
                showBoard();
                showPlayers();

                checkForWinner();
            }
            
            for (let msg of obj.messages) {
                receiveMessage(msg);
            }
            
        }, function(xhr) {
            if (xhr.status === 400) {
                gameError.show(xhr.response, 2000);
            } else {
                gameError.show("Failed to contact the server", 2000);
            }
        });
        
    }, UPDATE_LOOP_DELAY);
}

/*
Receives a message object from the server and acts according to their content
*/
function receiveMessage(msg) {
    switch (msg.type) {
    case "join":
        // TODO
        break;
        
    case "forfeit":
        // TODO
        break;
        
    default:
        break;
    }
}

$(document).ready(function() {
    resizeBoard();
    showBoard();
    showPlayers();
    $("#game-id").html("Game ID: " + game.id);
    
    // Set board to auto-resize
    $(window).resize(resizeBoard);
    
    // Set tile and button functionality
    $("#cancel-move").click(cancelMove);
    $("#submit-move").click(submitMove);
    
    // Initialize error message divs
    gameError = new ErrorMessage("#game-error");
    
    startUpdateLoop();
});
