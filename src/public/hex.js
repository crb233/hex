
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

class Board {
    
    constructor(positions) {
        this.positions = positions;
        this.tiles = {};
        
        // store positions of different types of tiles
        for (let pos in positions) {
            this.tiles[positions[pos]] = pos;
        }
    }
    
    get(pos) {
        return this.positions[pos];
    }
    
    set(pos, val) {
        this.positions[pos] = val;
    }
    
    get_neighbors(pos) {
        let list = [];
        for (let dir of DIRECTIONS) {
            let p = add_pos(pos, dir);
            if (p in this.positions) {
                list.push(p);
            }
        }
        return list;
    }
    
    has_connection(home, piece) {
        
    }
}

