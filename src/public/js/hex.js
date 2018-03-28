
const NO_PLAYER = 0;
const MAX_PLAYERS = 9;
const HIDDEN_PIECE = 0;
const NORMAL_PIECE = 10;
const BASE_PIECE   = 20;

/*
Rows go horizontally increasing rightward
Columns count up from the leftmost tile (starting at 0)
The first row always extends further left than the second

For example:
    |0,0|0,1|0,2|0,3|
      |1,0|1,1|1,2|
    |2,0|2,1|2,2|2,3|
      |3,0|3,1|3,2|
    |4,0|4,1|4,2|4,3|
*/

/*
Returns a list of all valid neighboring positions on the given board
*/
function listNeighbors(board, pos) {
    let r = pos[0];
    let c = pos[1];
    
    let list;
    if (r % 2 === 0) {
        list = [
            [r - 1, c - 1], [r - 1, c],
            [r, c - 1],     [r, c + 1],
            [r + 1, c - 1], [r + 1, c]
        ];
    } else {
        list = [
            [r - 1, c], [r - 1, c + 1],
            [r, c - 1], [r, c + 1],
            [r + 1, c], [r + 1, c + 1]
        ];
    }
    
    return list.filter((p) => isValidPos(board, p));
}

/*
Gets the player number of a piece
*/
function getPiecePlayer(piece) {
    return piece % 10;
}

/*
Gets the type of a piece
*/
function getPieceType(piece) {
    return piece - piece % 10;
}

/*
Determines whether a position exists on a game board
*/
function isValidPos(board, pos) {
    return pos[0] >= 0
            && pos[0] < board.length
            && pos[1] >= 0
            && pos[1] < board[pos[0]].length;
}

/*
Determines whether a move is valid given the current state of the board
*/
function isValidMove(board, move) {
    let p = board[move[0]][move[1]];
    return isValidPos(board, move)
            && getPieceType(p) === NORMAL_PIECE
            && getPiecePlayer(p) === NO_PLAYER;
}

/*
Modifies a board to reflect a move being made by the given player. This method
assumes that the move has already been checked for validity.
*/
function applyMove(board, move, player) {
    board[move[0]][move[1]] = NORMAL_PIECE + player;
}

/*
Returns the player number of board's winner or 0 if there's no winner yet
*/
function getWinner(board) {
    let pieces = {};
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            let p = board[r][c];
            if (p in pieces) {
                pieces[p].push([r, c]);
            } else {
                pieces[p] = [[r, c]];
            }
        }
    }
    
    // TODO
    
    return NO_PLAYER;
}





if (typeof module === "undefined") module = {};
module.exports = {
    NO_PLAYER: NO_PLAYER,
    MAX_PLAYERS: MAX_PLAYERS,
    HIDDEN_PIECE: HIDDEN_PIECE,
    NORMAL_PIECE: NORMAL_PIECE,
    BASE_PIECE: BASE_PIECE,
    listNeighbors: listNeighbors,
    getPiecePlayer: getPiecePlayer,
    getPieceType: getPieceType,
    isValidPos: isValidPos,
    isValidMove: isValidMove,
    applyMove: applyMove,
    getWinner: getWinner
};
