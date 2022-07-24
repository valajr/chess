const DIRECTION = {'UP': 0, 'RIGHT': 1, 'DOWN': 2, 'LEFT': 3};

class ChessPiece {
    static EMPTY_TILE = 0;

    _static_moves = [];
    _line_moves   = [];
    _attack_moves = null;

    constructor(image, team, direction) {
        this.image = image;
        this.team = team;
        this.direction = direction;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    getPossibleMoves(position, boardMapping) {
        // check if has position on boardMapping
        let existTile = (tl) => boardMapping[tl[0]]? boardMapping[tl[0]][tl[1]] !== undefined: false;
        // check if has no piece in given tile
        let emptyTile = (tl) => boardMapping[tl[0]][tl[1]] === ChessPiece.EMPTY_TILE;
        // check if piece in tile is from another team
        let canAttack = (tl) => boardMapping[tl[0]][tl[1]]?.team !== this.team;

        let possibleMove = (tl) => existTile(tl) && (emptyTile(tl) || canAttack(tl));
        let possible_moves = [];
        
        // iterate static_moves and check every move
        for(let m in this._static_moves) {
            let move = this.rotateMoveByDirection(this._static_moves[m]);
            let tile = [position[0] + move[0], position[1] + move[1]]; // get tile based on given position

            if(possibleMove(tile)) {
                possible_moves = tile;
            }
        }

        // iterate over attack_moves just if is not null, if it is, for sure line_moves + attack_moves == static_moves
        if(this._attack_moves !== null) {
            for(let m in this._attack_moves) {
                let move = this.rotateMoveByDirection(this._attack_moves[m]);
                let tile = [position[0] + move[0], position[1] + move[1]]; // get tile based on given position
    
                if(possibleMove(tile)) {
                    possible_moves = tile;
                }
            }
        }

        // iterate on line_moves and raycast direction checking moves until get an invalid one
        for(let d in this._line_moves) {
            let move = this.rotateMoveByDirection(this._line_moves[d]);
            let tile = [position[0] + move[0], position[1] + move[1]]; // get tile based on given position

            while(possibleMove(tile)) {
                possible_moves.push(tile);
                tile = [tile[0] + move[0], tile[1] + move[1]]; // get next tile move based on previous tile
            }
        }

        return possible_moves;
    }

    rotateMoveByDirection(move) { 
        switch(this.direction) {
            case DIRECTION.RIGHT:
                return [ move[0], -move[1]];
            case DIRECTION.DOWN:
                return [-move[0], -move[1]];
            case DIRECTION.LEFT:
                return [-move[0],  move[1]];
        }
        return move;
    }

    moveInterpreter(moveset) {
        let moves = [];
        for(let m in moveset) {
            let move = moveset[m];
            let us = move.match(/u/g).length; // up
            let rs = move.match(/r/g).length; // right
            let ds = move.match(/d/g).length; // down
            let ls = move.match(/l/g).length; // left

            moves.push([-ls+rs, -us+ds]);
        }

        return moves;
    }
}

class King extends ChessPiece {
    constructor(team, direction=DIRECTION.UP) {
        super("king", team, direction);
        this._static_moves = this.moveInterpreter(['ul','u','ur','r','dr','d','dl','l']);
    }
}

class Pawn extends ChessPiece {
    constructor(team, direction=DIRECTION.UP) {
        super("pawn", team, direction);
        this._static_moves = this.moveInterpreter(['u']);
        this._attack_moves = this.moveInterpreter(['ul','ur']);
    }
}

class Tower extends ChessPiece {
    constructor(team, direction=DIRECTION.UP) {
        super("tower", team, direction);
        this._line_moves = this.moveInterpreter(['u','r','d','l']);
    }
}

class Bishop extends ChessPiece {
    constructor(team, direction=DIRECTION.UP) {
        super("bishop", team, direction);
        this._line_moves = this.moveInterpreter(['ul','ur','dl','dr']);
    }
}

class Knight extends ChessPiece {
    constructor(team, direction=DIRECTION.UP) {
        super("knight", team, direction);
        this._line_moves = this.moveInterpreter(['uul','uur','urr','drr','ddr','ddl','dll','ull']);
    }
}

class Queen extends ChessPiece {
    constructor(team, direction=DIRECTION.UP) {
        super("queen", team, direction);
        this._line_moves = this.moveInterpreter(['u','r','d','l','ul','ur','dl','dr']);
    }
}