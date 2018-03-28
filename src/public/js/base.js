
//========================//
// Data Storage Functions //
//========================//

// Local (browser) data

function saveLocal(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function loadLocal(key) {
    return JSON.parse(localStorage.getItem(key));
}

function deleteLocal(key) {
    localStorage.removeItem(key);
}

// Temporary (session) data

function saveTemp(key, obj) {
    sessionStorage.setItem(key, JSON.stringify(obj));
}

function loadTemp(key) {
    return JSON.parse(sessionStorage.getItem(key));
}

function deleteTemp(key) {
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

function getHexImg(piece, cmap) {
    let type = getPieceType(piece);
    let player = getPiecePlayer(piece);
    
    if (type === HIDDEN_PIECE) {
        return "img/hex-hidden.svg";
        
    } else if (player === 0) {
        return "img/hex-none.svg";
        
    } else if (player - 1 >= cmap.length) {
        return "img/hex-unassigned.svg";
        
    } else if (type === NORMAL_PIECE) {
        return "img/hex-" + cmap[player - 1] + ".svg";
        
    } else {
        return "img/hex-" + cmap[player - 1] + "-base.svg";
    }
}

function setCss(name, val, selector) {
    if (selector) {
        $(selector).each(function() {
            this.style.setProperty(name, val);
        });
        
    } else {
        document.documentElement.style.setProperty(name, val);
    }
}

function setHexScale(scale, selector) {
    setCss("--hex-w", (hex_w * scale) + "px", selector);
    setCss("--hex-h", (hex_h * scale) + "px", selector);
    setCss("--hex-margin-w", (hex_margin_w * scale) + "px", selector);
    setCss("--hex-margin-h", (hex_margin_h * scale) + "px", selector);
}

/*
Creates and returns an HTML element representing the given hex board
*/
function createBoard(board, cmap) {
    let res = [];
    
    res.push("<div class='board'>");
    for (let r = 0; r < board.length; r++) {
        
        let row = board[r];
        if (r % 2 === 0) {
            res.push("<div class='hex-row'>");
        } else {
            res.push("<div class='hex-row odd'>");
        }
        
        for (let c = 0; c < row.length; c++) {
            res.push("<img class='hex' data-r='" + r + "' data-c='" + c
                + "' src='" + getHexImg(row[c], cmap) + "'/>");
        }
        
        res.push("</div>");
    }
    
    res.push("</div>");
    return res.join("");
}





//===========================//
// Game Management Functions //
//===========================//

/*
Displays an error message in the element with the given ID
*/
function showError(id, error) {
    $(id).html("Error: " + error);
    $(id).show();
}

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





if (typeof module === "undefined") module = {};
module.exports = {
    saveLocal: saveLocal,
    loadLocal: loadLocal,
    deleteLocal: deleteLocal,
    saveTemp: saveTemp,
    loadTemp: loadTemp,
    deleteTemp: deleteTemp,
    margin: margin,
    hex_w: hex_w,
    hex_h: hex_h,
    hex_margin_w: hex_margin_w,
    hex_margin_h: hex_margin_h,
    getHexImg: getHexImg,
    setCss: setCss,
    setHexScale: setHexScale,
    createBoard: createBoard,
    showError: showError,
    post: post
};
