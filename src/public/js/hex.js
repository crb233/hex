
const HEX_HIDDEN = -1;
const HEX_BLANK  = 0;
const HEX_PIECE1 = 1;
const HEX_PIECE2 = 2;
const HEX_PIECE3 = 3;
const HEX_HOME1  = 4;
const HEX_HOME2  = 5;
const HEX_HOME3  = 6;

const DIRECTIONS = [
        [-1, -1], [-1,  0],
    [ 0, -1],         [ 0,  1],
        [ 1,  0], [ 1,  1]
]

/*

Rows go horizontally increasing rightward
Columns go diagonally left increasing downward
The first row always extends further left than the second

         c0  c1  c2  c3
    r0 |   |   |   |   |
    r1 ##|   |   |   |##
    r2 |   |   |   |   |
    r3 ##|   |   |   |##
    r4 |   |   |   |   |

*/

function add_pos(p1, p2) {
    return [p1[0] + p2[0], p1[1] + p2[1]];
}

function to_rectangular(pos) {
    let shift = (pos[0] + pos[0] % 2) / 2;
    return [pos[0], pos[1] - shift]
}

function to_hexagonal(pos) {
    let shift = (pos[0] + pos[0] % 2) / 2;
    return [pos[0], pos[1] + shift]
}

function find_pieces(board) {
    // TODO
}

function find_bases(pieces) {
    // TODO
}

function find_bridge(board, player) {
    // TODO
}

function load_board(board) {
    let pieces = find_pieces(board);
    let bases = find_bases(pieces);
    return {
        pieces: pieces,
        bases: bases
    };
}

function list_neighbors(board, pos) {
    let nrows = board.length;
    let ncols = board[0].length;
    let list = [];
    for (let dir of DIRECTIONS) {
        let r = pos[0] + dir[0];
        let c = pos[1] + dir[1];
        if (0 <= r && r < nrows && 0 <= c && c < ncols) {
            list.push([r, c]);
        }
    }
    return list;
}
