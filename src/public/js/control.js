
// The delay between get-update requests in milliseconds
const update_loop_delay = 1000;





//=========================//
// Local Storage Functions //
//=========================//

function save_data(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function load_data(key) {
    return JSON.parse(localStorage.getItem(key));
}

function delete_data(key) {
    localStorage.removeItem(key);
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

function hex_img(color, base) {
    if (base) {
        return "img/hex-" + color + "-base.svg";
    } else {
        return "img/hex-" + color + ".svg";
    }
}

function set_css_var(name, val) {
    document.documentElement.style.setProperty(name, val);
}

function set_hex_scale(scale) {
    set_css_var("--hex-w", (hex_w * scale) + "px");
    set_css_var("--hex-h", (hex_h * scale) + "px");
    set_css_var("--hex-margin-w", (hex_margin_w * scale) + "px");
    set_css_var("--hex-margin-h", (hex_margin_h * scale) + "px");
}

/*
Creates and returns an HTML element representing the given hex board
*/
function create_board(board, map) {
    let res = []
    res.push('<div class="board">');
    for (let r = 0; r < board.length; r++) {
        res.push('<div class="hex-row">');
        let row = board[r];
        for (let c = 0; c < row.length; c++) {
            let x = map(row[c]);
            res.push('<img class="hex" data-r="' + r + '" data-c="' + c
                + '" onclick="click_hex(this)" src="' + hex_img(x.color, x.base) + '"/>');
        }
        res.push('/<div>');
    }
    res.push('/<div>');
    return res.join('')
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
            // success
            
            //check if there are any winners
            let winner = isGameOver(msg.game);
            
            //1st player wins
            if (winner === player.player_number) {
              alert (game.player_names[winner] + ", you collected 12 pieces. WINNER!");
            } else if (winner !== -1) {
              alert ("You lose! " + game.player_names[winner] + " collected 12 pieces.");
            }
            
            // if it was your opponent's turn
            if (game.turn !== player.player_number) {
                game = msg.game;
                resetBoard();
                
                // if it's now your turn
                if (game.turn === player.player_number) {
                    playSound(NOTIFICATION);
                    startTimer(game.timer);
                }
            }
            
            game = msg.game;
            updateTable();
            
            for (let i = 0; i < msg.messages.length; i++) {
                receiveMessage(msg.messages[i]);
            }
            
        }, function(xhr, ajaxOptions, thrownError) {
            // failure
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
            playSound(NOTIFICATION);
            alert(msg.text);
            //enable the close button
            closebtn.classList.remove('disabled');
            closeNav();
            startTimer(game.timer);
            updateTable();
            break;

        case "forfeit":
            alert(msg.text);
            document.location.href = "/index.html";
            break;

        case "request_draw":
            if (confirm(msg.text + ".\nClick Ok to accept or Cancel to keep playing.")) {
                accept_draw();
            } else {
                rejectDraw();
            }
            break;

        case "accept_draw":
            alert(msg.text);
            document.location.href = "/index.html";
            break;

        case "reject_draw":
            alert(msg.text);
            break;

        case "pause":
            alert(msg.text);
            pauseTimer();
            break;

        case "resume":
            resumeTimer();
            break;

        case "expired":
            alert(msg.text);
            break;

        default:
            console.error("Unknown message type");
            alert("Unknown message type");
            break;
    }
}
