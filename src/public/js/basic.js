
// The delay between get-update requests in milliseconds
const update_loop_delay = 1000;





//========================//
// Data Storage Functions //
//========================//

// Local (browser) data

function save_local(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function load_local(key) {
    return JSON.parse(localStorage.getItem(key));
}

function delete_local(key) {
    localStorage.removeItem(key);
}

// Temporary (session) data

function save_temp(key, obj) {
    sessionStorage.setItem(key, JSON.stringify(obj));
}

function load_temp(key) {
    return JSON.parse(sessionStorage.getItem(key));
}

function delete_temp(key) {
    sessionStorage.removeItem(key);
}





//====================//
// Hex Tile Functions //
//====================//

// Size of hex tile margin relative to width of tile
const margin = 1 / 5;

// Hex tile scaling factors
const root3 = Math.sqrt(3);
const hex_w = root3;
const hex_h = 2;
const hex_margin_w = margin;
const hex_margin_h = (root3 * margin - 1) / 2;

function hex_click(func) {
    $(".hex").not(".hidden").click(func);
}

function getHexImg(piece, cmap) {
    let type = getPieceType(piece);
    let player = getPiecePlayer(piece);
    
    if (type == HIDDEN_PIECE) {
        return "img/hex-hidden.svg";
        
    } else if (player == 0) {
        return "img/hex-none.svg";
        
    } else if (player - 1 >= cmap.length) {
        return "img/hex-unassigned.svg";
        
    } else if (type == NORMAL_PIECE) {
        return "img/hex-" + cmap[player - 1] + ".svg";
        
    } else {
        return "img/hex-" + cmap[player - 1] + "-base.svg";
    }
}

function setCssVar(name, val) {
    document.documentElement.style.setProperty(name, val);
}

function setHexScale(scale) {
    setCssVar("--hex-w", (hex_w * scale) + "px");
    setCssVar("--hex-h", (hex_h * scale) + "px");
    setCssVar("--hex-margin-w", (hex_margin_w * scale) + "px");
    setCssVar("--hex-margin-h", (hex_margin_h * scale) + "px");
}

/*
Creates and returns an HTML element representing the given hex board
*/
function createBoard(board, cmap) {
    let res = []
    
    res.push('<div class="board">');
    for (let r = 0; r < board.length; r++) {
        
        let row = board[r];
        if (r % 2 == 0) {
            res.push('<div class="hex-row">');
        } else {
            res.push('<div class="hex-row odd">');
        }
        
        for (let c = 0; c < row.length; c++) {
            res.push('<img class="hex" data-r="' + r + '" data-c="' + c
                + '" onclick="click_hex(this)" src="' + getHexImg(row[c], cmap) + '"/>');
        }
        
        res.push('</div>');
    }
    
    res.push('</div>');
    return res.join('');
}

/*
Called when a hex tile is clicked
*/
function click_hex(elem) {
    // TODO
}





//===========================//
// Game Management Functions //
//===========================//

/*
Sends a post request containing JSON data to the given endpoint. Calls one of
two callback functions depending on the success/error status of the request.
*/
function post(endpoint, data, success, error) {
    $.ajax({
        "type": "POST",
        "url": endpoint,
        "data": JSON.stringify(data),
        "dataType": "json",
        "contentType": "application/json; charset=utf-8",
        "success": success,
        "error": error
    });
}

/*
Starts an infinite loop of requesting updates from the server in intervals
determined by the constant UPDATE_LOOP_TIME
*/
let loop;
function startUpdateLoop() {
    loop = setInterval(function(){

        let data = {
            player_id: player.player_id
        };

        post("/get-updates", data, function(msg) {
            //check if there are any winners
            let winner = getWinner(msg.game.board);
            
            //1st player wins
            if (winner === player.number) {
                alert("Congratulations, " + game.player_names[winner] + ", you win!");
            } else if (winner !== NO_PLAYER) {
                alert("Sorry, " + game.player_names[player.number] + ", " + game.player_names[winner] + " won.");
            }
            
            // if it was your opponent's turn
            if (game.turn !== player.number) {
                game = msg.game;
                resetBoard();
            }
            
            game = msg.game;
            updateTable();
            
            for (let i = 0; i < msg.messages.length; i++) {
                receiveMessage(msg.messages[i]);
            }
            
        }, function(xhr, error) {
            // document.getElementById("content").innerHTML = "Error Fetching " + URL;
        });
    }, update_loop_delay);
}

/*
Receives message objects from the server and acts according to their content
*/
function receiveMessage(msg) {
    switch (msg.type) {
        case "join":
            // TODO
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
