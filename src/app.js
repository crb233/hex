
//=========//
// Modules //
//=========//

/*
The Path module for manipulating file paths
*/
const path = require("path").join;

/*
The Express module for asynchrnonous routing
*/
const express = require("express");

/*
The BodyParser module for parsing POST request bodies into JSON
*/
const body_parser = require("body-parser");

/*
The Lowdb module for a simple serverside database
*/
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");





//==================//
// Server Constants //
//==================//

/*
The port number for this server to use. It is set to the value of the
environment variable PORT, or 8080 if PORT isn't set.
*/
const port = process.env.PORT || 8080;

/*
The directory for files with public access such as static HTML and CSS
files. These will be served statically from the server to the client.
*/
const public_dir = path(__dirname, "public");

/*
The local database file
*/
const db_file = path(__dirname, "../db.json");




//=============================//
// Server and Database Objects //
//=============================//

/*
Initialize an instance of the local database
*/
const db = lowdb(new FileSync(db_file, {
  serialize: (data) => JSON.stringify(data),
  deserialize: (data) => JSON.parse(data)
}));

db.defaults({
    "boards": [],
    "games": [],
    "players": []
}).write();

/*
Initialize an instance of the server with BodyParser and static serving of any
files in the public directory
*/
const app = express();

app.use(express.static(public_dir));
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    "extended": true
}));





//=============//
// HTTP Routes //
//=============//

/*
Creates and returns a callback function for automatically sending a HTTP
response containing an error code and an object
*/
function createErrorCheckCallback(res) {
    return function(err, result) {
        if (isString(err)) {
            res.status(400);
            res.send(err);
            
        } else if (err || typeof result === "undefined" || result === null) {
            res.status(500);
            res.send("Unknown server error");
            
        } else {
            res.status(200);
            res.send(result);
        }
    };
}

/*
Route for the client to get a list of boards
*/
app.post("/list-boards", function(req, res) {
    listBoards(req.body, createErrorCheckCallback(res));
});

/*
Route for the client to get a list of public games
*/
app.post("/list-games", function(req, res) {
    listGames(req.body, createErrorCheckCallback(res));
});

/*
Route for the client to request the creation of a new game
*/
app.post("/new-game", function(req, res) {
    newGame(req.body, createErrorCheckCallback(res));
});

/*
Route for the client to request to join a new public game
*/
app.post("/join-game", function(req, res) {
    joinGame(req.body, createErrorCheckCallback(res));
});

/*
Route for the client to make a move and update the game state
*/
app.post("/make-move", function(req, res) {
    makeMove(req.body, createErrorCheckCallback(res));
});

/*
Route for the client to request updates on the state of the game
*/
app.post("/get-updates", function(req, res) {
    getUpdates(req.body, createErrorCheckCallback(res));
});

/*
Route for the client to send messages to an opponent
*/
app.post("/send-message", function(req, res) {
    sendMessage(req.body, createErrorCheckCallback(res));
});





//=======================================//
// Miscellaneous Constants and Functions //
//=======================================//

/*
Liist of valid colors names
*/
const colors = ["red", "yellow", "green", "cyan", "blue", "purple"]

/*
The set of characters from which IDs should be created
*/
const id_chars = "abcdefghijklmnopqrstuvwxyz0123456789";

/*
The number of characters in each random ID string. Using 12 characters from a
36 character set produces ln(36 ^ 12) / ln(2) = 62 bits of information, which
nearly guarantees very few ID collisions.
*/
const id_length = 12;

/*
Determines if a value is a boolean
*/
function isBoolean(obj) {
    return typeof obj === "boolean";
}

/*
Determines if a value is a string
*/
function isString(obj) {
    return typeof obj === "string" || obj instanceof String;
}

/*
Determines if a value is an integer
*/
function isInteger(obj) {
    return Number.isInteger(obj);
}

/*
Determines if a valure is a valid color
*/
function isColor(obj) {
    return isString(obj) && colors.includes(obj);
}

/*
Determines if a value is a correctly formatted move object
*/
function isMove(obj) {
    return Array.isArray(obj) && obj.length === 2 && isInteger(obj[0]) && isInteger(obj[1]);
}

/*
Determines if a value is a correctly formatted message object
*/
function isMessage(obj) {
    return typeof obj === "object" && isString(obj.type) && isString(obj.text);
}

/*
Creates and returns a randomly generated ID string
*/
function randomID() {
    let arr = [];
    for (let i = 0; i < id_length; i++) {
        let index = Math.floor(Math.random() * id_chars.length);
        arr.push(id_chars.charAt(index));
    }
    return arr.join("");
}





//==================//
// Gama Management //
//=================//

function hasID(coll, id) {
    return db.get(coll).filter({ "id": id }).size().value() != 0;
}

function getByID(coll, id) {
    return db.get(coll).filter({ "id": id }).value()[0];
}

function uniqueID(coll) {
    let id = randomID();
    while (hasID(coll, id)) {
        id = randomID();
    }
    return id;
}

/*
Trim sensitive data from a board object to be returned to a user
*/
function trimBoardObject(obj) {
    return {
        "id": obj.id,
        "name": obj.name,
        "players": obj.players,
        "board": obj.board
    };
}

/*
Trim sensitive data from a game object to be returned to a user
*/
function trimGameObject(obj) {
    return {
        "id": obj.id,
        "active": obj.active,
        "public": obj.public,
        "turn": obj.turn,
        "players": obj.players,
        // "player_ids": obj.player_ids,
        "player_names": obj.player_names,
        "player_colors": obj.player_colors,
        "board_id": obj.board_id,
        "board_name": obj.board_name,
        "board": obj.board
    };
}

/*
Trim sensitive data from a player object to be returned to a user
*/
function trimPlayerObject(obj) {
    return {
        "id": obj.id,
        "name": obj.name,
        "number": obj.number,
        "game_id": obj.game_id,
        "last_request": obj.last_request,
        "new_messages": obj.messages
    };
}

/*
Deletes all data associated with a particular game
*/
function deleteGame(id) {
    if (!hasID("games")) {
        console.error("Attempted to delete nonexistent game with ID '" + id + "'");
        return;
    }
    
    // TODO
}

/*
Returns a list of all boards
*/
function listBoards(data, callback) {
    let boards = db.get("boards")
        .map(trimBoardObject)
        .value();
    
    callback(false, boards);
}

/*
Returns a list of all public inactive games
*/
function listGames(data, callback) {
    let games = db.get("games")
        .filter("public")
        .reject("active")
        .map(trimGameObject)
        .value();
    
    callback(false, games);
}

/*
Creates a new player and a new game, returning both to the caller.

All of the following parameters are required to be in data:
    - public (Boolean)
    - board_id (String)
    - player_name (String)
    - player_color (Color)
*/
function newGame(data, callback) {
    // Validate input data
    if (!data.public || !isBoolean(data.public)) {
        return callback("Parameter 'public' must be a boolean");
    }
    
    if (!data.board_id || !isString(data.board_id)) {
        return callback("Parameter 'board_id' must be a string");
    }
    
    if (!data.player_name || !isString(data.player_name)) {
        return callback("Parameter 'player_name' must be a string");
    }
    
    if (!data.player_color || !isColor(data.player_color)) {
        return callback("Parameter 'player_color' must be a valid color");
    }
    
    // Check that there exists a board with the given board id
    if (!hasID("boards", data.board_id)) {
        return callback("Invalid board ID '" + data.board_id + "'");
    }
    
    // Load the game board object
    let board_obj = getByID("boards", data.board_id);
    
    // Generate unique player and game IDs
    let player_id = uniqueID("players");
    let game_id = uniqueID("games");
    
    let player = {
        "id": player_id,
        "name": data.player_name,
        "number": 0,
        "game_id": game_id,
        "last_request": 0,
        "new_messages": []
    };
    
    let game = {
        "id": game_id,
        "active": false,
        "public": data.public,
        "turn": 0,
        "players": board_obj.players,
        "player_ids": [player_id],
        "player_names": [data.player_name],
        "player_colors": [data.player_color],
        "board_id": board_obj.id,
        "board_name": board_obj.name,
        "board": board_obj.board
    };
    
    // Store the player and game objects
    db.get("players").push(player);
    db.get("games").push(game);
    
    // Save changes and return
    db.write();
    callback(false, {
        "player": trimPlayerObject(player),
        "game": trimGameObject(game),
    });
}

/*
Creates a new player and adds them to a game, returning both to the caller.

All of the following parameters are required to be in data:
    - game_id (String)
    - player_name (String)
    - player_color (Color)
*/
function joinGame(data, callback) {
    // Validate input data
    if (!data.game_id || !isString(data.game_id)) {
        return callback("Parameter 'game_id' must be a string");
    }
    
    if (!data.player_name || !isString(data.player_name)) {
        return callback("Parameter 'player_name' must be a string");
    }
    
    if (!data.player_color || !isColor(data.player_color)) {
        return callback("Parameter 'player_color' must be a valid color");
    }
    
    // Check that there exists a game with the given game id
    if (!hasID("games", data.game_id)) {
        return callback("Invalid game ID '" + data.game_id + "'");
    }
    
    // Load the game object
    let game = getByID("games", data.game_id);
    
    // Check that the game isn't active
    if (game.active) {
        return callback("Unable to join - game has already started");
    }
    
    // Generate a unique player ID
    let player_id = uniqueID("players");
    
    let player = {
        "id": player_id,
        "name": data.player_name,
        "number": game.players,
        "game_id": game.id,
        "last_request": 0,
        "new_messages": []
    };
    
    // Update the game object (automatically updates the database's copy)
    game.player_ids.push(player_id);
    game.player_names.push(data.player_name);
    game.player_colors.push(data.player_color);
    if (game.player_ids.length == game.players) {
        game.active = true;
    }
    
    let msg = {
        "type": "join",
        "text": "Player " + player.name + " has joined the game"
    };
    
    // Add the message to each of the opponents' lists
    for (let id of game.player_ids) {
        if (id != player.id) {
            if (hasID("players", id)) {
                getByID("players", id).new_messages.push(msg);
            } else {
                console.error("Player with ID '" + id + "' no longer exists")
            }
        }
    }
    
    // Store the player object
    db.get("players").push(player);
    
    // Save changes and return
    db.write();
    callback(false, {
        "player": trimPlayerObject(player),
        "game": trimGameObject(game),
    });
}

/*
Checks if a move is valid, then modifies the game state to reflect the move

All of the following parameters are required to be in data:
    - player_id (String)
    - move (Move)
*/
function makeMove(data, callback) {
    // Validate input data
    if (!data.player_id || !isString(data.player_id)) {
        return callback("Parameter 'player_id' must be a string");
    }
    
    if (!data.move || !isMove(data.move)) {
        return callback("Parameter 'move' must be a pair of integers");
    }
    
    // Check that there exists a player with the given ID
    if (!hasID("players", data.player_id)) {
        return callback("Invalid player ID '" + data.player_id + "'");
    }
    
    let player = getByID("players", data.player_id);
    
    // Check that there exists a game with the player's game ID
    if (!hasID("games", player.game_id)) {
        console.error("Game with ID '" + player.game_id + "' no longer exists");
        return callback("Internal error");
    }
    
    let game = getByID("games", player.game_id);
    
    // Check that the move is valid
    if (!isValidMove(game.board, data.move)) {
        return callback("Invalid move at position " + data.move);
    }
    
    // Apply the move and save the database
    applyMove(game.board, data.move);
    
    // Save changes and return
    db.write();
    callback(false, {
        "game": trimGameObject(game)
    });
}

/*
Return game and message updates to the player

All of the following parameters are required to be in data:
    - player_id (String)
*/
function getUpdates(data, callback) {
    // Validate input data
    if (!data.player_id || !isString(data.player_id)) {
        return callback("Parameter 'player_id' must be a string");
    }
    
    // Check that there exists a player with the given ID
    if (!hasID("players", data.player_id)) {
        return callback("Invalid player ID '" + data.player_id + "'");
    }
    
    let player = getByID("players", data.player_id);
    
    // Check that there exists a game with the player's game ID
    if (!hasID("games", player.game_id)) {
        console.error("Game with ID '" + player.game_id + "' no longer exists");
        return callback("Internal error");
    }
    
    let game = getByID("games", player.game_id);
    
    // Clear the player's list of messages and save the database
    player.new_messages = [];
    
    // Save changes and return
    db.write();
    callback(false, {
        "messages": player.new_messages,
        "game": trimGameObject(game)
    });
}

/*
Sends a message from one player to all of that player's opponents by storing the
message in their inboxes

All of the following parameters are required to be in data:
    - player_id (String)
    - message (Message)
*/
function sendMessage(data, callback) {
    // Validate input data
    if (!data.player_id || !isString(data.player_id)) {
        return callback("Parameter 'player_id' must be a string");
    }
    
    if (!data.message || !isString(data.message)) {
        return callback("Parameter 'message' must be a string");
    }
    
    // Check that there exists a player with the given ID
    if (!hasID("players", data.player_id)) {
        return callback("Invalid player ID '" + data.player_id + "'");
    }
    
    let player = getByID("players", data.player_id);
    
    // Check that there exists a game with the player's game ID
    if (!hasID("games", player.game_id)) {
        console.error("Game with ID '" + player.game_id + "' no longer exists");
        return callback("Internal error");
    }
    
    let game = getByID("games", player.game_id);
    
    // Add the message to each of the opponents' lists
    for (let id of game.player_ids) {
        if (id != player.id) {
            if (hasID("players", id)) {
                getByID("players", id).new_messages.push(data.message);
            } else {
                console.error("Player with ID '" + id + "' no longer exists")
            }
        }
    }
    
    // Save changes and return
    db.write();
    callback(false, {});
}





//=========//
// Finally //
//=========//

/*
Start the server
*/
app.listen(port, function() {
    console.log("Started server on port " + port + ".");
});
