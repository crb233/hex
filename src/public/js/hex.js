
const NO_PLAYER    = 0;
const MAX_PLAYERS  = 9;

const HIDDEN_PIECE = 0;
const NORMAL_PIECE = 10;
const BASE_PIECE   = 20;
const SELECT_PIECE = 30;

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

*/
function getPiece(board, pos) {
    return board.pieces[pos[0]][pos[1]];
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
        && pos[0] < board.pieces.length
        && pos[1] >= 0
        && pos[1] < board.pieces[pos[0]].length;
}

/*
Determines whether a move is valid given the current state of the board
*/
function isValidMove(board, move) {
    let piece = getPiece(board, move);
    return isValidPos(board, move)
        && getPiecePlayer(piece) === NO_PLAYER
        && getPieceType(piece) === NORMAL_PIECE;
}

/*
Modifies a board to reflect a move being made by the given player. This method
assumes that the move has already been checked for validity.
*/
function applyMove(board, move, player) {
    board.pieces[move[0]][move[1]] = NORMAL_PIECE + player;
}

/*

*/
function nextTurn(game) {
    game.turn = game.turn % game.board.players + 1;
}

/*
Returns the player number of board's winner or 0 if there's no winner yet
*/
function getWinner(board) {
    for (let i in board.bases) {
        let player = parseInt(i) + 1;
        let base = board.bases[i];
        let count = board.base_counts[i];
        
        let unexplored = [base];
        let explored = {};
        
        while (true) {
            if (unexplored.length === 0) {
                break;
            }
            
            let pos = unexplored.pop();
            let piece = getPiece(board, pos);
            
            if (!(pos in explored) && getPiecePlayer(piece) === player) {
                if (getPieceType(piece) === BASE_PIECE) {
                    count -= 1;
                    if (count === 0) {
                        return player;
                    }
                }
                
                explored[pos] = true;
                for (let p of listNeighbors(board, pos)) {
                    unexplored.push(p);
                }
            }
            
            
        }
    }
    
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
    getPiece: getPiece,
    getPiecePlayer: getPiecePlayer,
    getPieceType: getPieceType,
    isValidPos: isValidPos,
    isValidMove: isValidMove,
    applyMove: applyMove,
    nextTurn: nextTurn,
    getWinner: getWinner
};
