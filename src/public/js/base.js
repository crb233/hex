
//========================//
// Data Storage Functions //
//========================//

// Local (browser) data

function hasLocal(key) {
    return key in localStorage;
}

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

function hasTemp(key) {
    return key in sessionStorage;
}

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

// Size of hex tile margin relative to edge length of tile
const MARGIN = 1 / 5;

// Hex tile scaling factors
const HEX_TILE_W = Math.sqrt(3);
const HEX_TILE_H = 2;
const HEX_MARGIN_W = MARGIN;
const HEX_MARGIN_H = (Math.sqrt(3) * MARGIN - 1) / 2;

function getHexImg(piece, cmap) {
    let type = getPieceType(piece);
    let player = getPiecePlayer(piece);
    
    if (player - 1 >= cmap.length) {
        return "img/hex-none-base.svg";
    }
    
    let color;
    if (player === 0) {
        color = "none";
    } else {
        color = cmap[player - 1];
    }
    
    if (type === HIDDEN_PIECE) {
        return "img/hex-hidden.svg";
        
    } else if (type === NORMAL_PIECE) {
        return "img/hex-" + color + ".svg";
        
    } else if (type === BASE_PIECE) {
        return "img/hex-" + color + "-base.svg";
        
    } else if (type === SELECT_PIECE) {
        return "img/hex-" + color + "-select.svg";
        
    } else {
        return "img/hex-hidden.svg";
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
    setCss("--hex-w", (HEX_TILE_W * scale) + "px", selector);
    setCss("--hex-h", (HEX_TILE_H * scale) + "px", selector);
    setCss("--hex-margin-w", (HEX_MARGIN_W * scale) + "px", selector);
    setCss("--hex-margin-h", (HEX_MARGIN_H * scale) + "px", selector);
}

/*
Creates and returns an HTML element representing the given hex board
*/
function boardHtml(board, cmap, click, hover) {
    let doclick = typeof click !== "undefined";
    let dohover = typeof hover !== "undefined";
    
    let res = [];
    res.push("<div class='board'>");
    for (let r = 0; r < board.pieces.length; r++) {
        
        let row = board.pieces[r];
        if (r % 2 === 0) {
            res.push("<div class='hex-row'>");
        } else {
            res.push("<div class='hex-row odd'>");
        }
        
        for (let c = 0; c < row.length; c++) {
            res.push("<img class='hex'");
            if (doclick) {
                res.push(" onclick='");
                res.push(click);
                res.push("(this,");
                res.push([r, c]);
                res.push(")'");
            }
            if (dohover) {
                res.push(" onmouseover='");
                res.push(hover);
                res.push("(this,");
                res.push([r, c]);
                res.push(")'");
            }
            res.push(" src='");
            res.push(getHexImg(row[c], cmap));
            res.push("'/>");
        }
        
        res.push("</div>");
    }
    
    res.push("</div>");
    return res.join("");
}





//===============//
// Miscellaneous //
//===============//

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

const HIDE_OPTS = {
    "opacity": "0"
};

const SHOW_OPTS = {
    "opacity": "1"
};

class ErrorMessage {
    
    constructor(sel) {
        this.obj = $(sel);
        this.visible = false;
        this.timeout = null;
        
        this.obj.css(HIDE_OPTS);
    }
    
    /*
    Set the timer for hiding the error message
    */
    setTime(time) {
        if (typeof time === "undefined") time = 2000;
        
        let self = this;
        self.timeout = setTimeout(function() {
            self.visible = false;
            self.timeout = null;
            self.obj.animate(HIDE_OPTS, 500, "swing");
        }, time);
    }
    
    /*
    Displays an error message in the elements that match the selector
    */
    show(error, time) {
        let self = this;
        self.obj.html("Error: " + error);
        
        if (!self.visible) {
            self.visible = true;
            self.obj.animate(SHOW_OPTS, 200, "swing", function() {
                self.setTime(time);
            });
            
        } else {
            clearTimeout(self.timeout);
            self.setTime(time);
        }
    }
    
    /*
    Hides the error message being displayed in the elements that match the selector
    */
    hide() {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
            this.obj.animate(HIDE_OPTS, 500, "swing");
        }
    }
}





if (typeof module === "undefined") module = {};
module.exports = {
    saveLocal: saveLocal,
    loadLocal: loadLocal,
    deleteLocal: deleteLocal,
    saveTemp: saveTemp,
    loadTemp: loadTemp,
    deleteTemp: deleteTemp,
    MARGIN: MARGIN,
    HEX_TILE_W: HEX_TILE_W,
    HEX_TILE_H: HEX_TILE_H,
    HEX_MARGIN_W: HEX_MARGIN_W,
    HEX_MARGIN_H: HEX_MARGIN_H,
    getHexImg: getHexImg,
    setCss: setCss,
    setHexScale: setHexScale,
    boardHtml: boardHtml,
    post: post,
    ErrorMessage: ErrorMessage
};
