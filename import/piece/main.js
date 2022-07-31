const DIRECTION = {'UP': 0, 'RIGHT': 1, 'DOWN': 2, 'LEFT': 3};
const CHESSTEAM = {'BLACK': "black", 'WHITE': "white"};

class ChessPiece {
    static EMPTY_TILE = new ChessPiece(-1, "empty", "tile");
    static xp_value = {
        'empty' : 0,
        'pawn'  : 10,
        'tower' : 25,
        'knight': 25,
        'bishop': 25,
        'queen' : 50,
        'king'  : 100
    };
    static getImage = (src, team) => `static/img/${src}_${team}.png`;
    static xpNeededByLevel = (lv) => 20 + 5 * (2**lv - 1);

    _static_moves = [];
    _line_moves   = [];
    _attack_moves = null;
    _last_level   = 0;
    _skill_tree = [];

    kill_list = [];
    xp        = 0;

    constructor(id, image, team, direction = DIRECTION.UP, type="basic") {
        this._id  = id;
        this.type = type;
        this.team = team;

        this.direction  = direction;
        this._image_src = image;
    }

    get image() {
        return ChessPiece.getImage(this._image_src, this.team);
    }

    set level(level) {
        let recursiveXp = (lv) => lv < 0? 0: ChessPiece.xpNeededByLevel(lv) + recursiveXp(lv-1);
        this.xp = recursiveXp(level-1);
    }

    get level() {
        let aux = this.xp;
        let level = 0;
        while((aux -= ChessPiece.xpNeededByLevel(level)) >= 0) {
            level++;
        }
        return level;
    }

    getSkillTree(lvl) {
        return this._skill_tree[lvl];
    }

    levelUpEvent() { }

    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
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

        let move_is_attack = this._attack_moves === null;
        let possibleMove   = (tl, is_attack=false) => existTile(tl) && ((emptyTile(tl) && !is_attack) || (!emptyTile(tl) && canAttack(tl) && (is_attack || move_is_attack)));
        let possible_moves = [];

        // iterate static_moves and check every move
        for(let m in this._static_moves) {
            let move = this.rotateMoveByDirection(this._static_moves[m]);
            let tile = [position[0] + move[0], position[1] + move[1]]; // get tile based on given position

            if(possibleMove(tile)) {
                possible_moves.push(tile);
            }
        }

        // iterate over attack_moves just if is not null, if it is, for sure line_moves + attack_moves == static_moves
        if(!move_is_attack) {
            for(let m in this._attack_moves) {
                let move = this.rotateMoveByDirection(this._attack_moves[m]);
                let tile = [position[0] + move[0], position[1] + move[1]]; // get tile based on given position
    
                if(possibleMove(tile, true)) {
                    possible_moves.push(tile);
                }
            }
        }

        // iterate on line_moves and raycast direction checking moves until get an invalid one
        for(let d in this._line_moves) {
            let move = this.rotateMoveByDirection(this._line_moves[d]);
            let tile = [position[0] + move[0], position[1] + move[1]]; // get tile based on given position

            while(possibleMove(tile)) {
                possible_moves.push(tile);
                if(!emptyTile(tile) && canAttack(tile)) break;
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
            let us = move.match(/u/g)?.length || 0; // up
            let rs = move.match(/r/g)?.length || 0; // right
            let ds = move.match(/d/g)?.length || 0; // down
            let ls = move.match(/l/g)?.length || 0; // left

            moves.push([-us+ds, -ls+rs]);
        }

        return moves;
    }

    addXp(sum) {
        this.xp += sum;
        if(this._last_level !== this.level) {
            let ll = this._last_level;
            this._last_level = this.level;
            this.levelUpEvent(this, ll);
        }
    }
}

class King extends ChessPiece {
    constructor(id, team=CHESSTEAM.WHITE, direction=DIRECTION.UP) {
        super(id, "king", team, direction, "king");
        this._static_moves = this.moveInterpreter(['ul','u','ur','r','dr','d','dl','l']);
        this._skill_tree = [[], ['uul', 'uu', 'uur'], ['ddl', 'dd', 'ddr'], ['ll', 'dd']];
    }
}

class Pawn extends ChessPiece {
    constructor(id, team=CHESSTEAM.WHITE, direction=DIRECTION.UP) {
        super(id, "pawn", team, direction, "pawn");
        this._static_moves = this.moveInterpreter(['u']);
        this._attack_moves = this.moveInterpreter(['ul','ur']);
        this._skill_tree = [[], ['d'], ['uu'], ['dd']];
    }
}

class Tower extends ChessPiece {
    constructor(id, team=CHESSTEAM.WHITE, direction=DIRECTION.UP) {
        super(id, "tower", team, direction, "tower");
        this._line_moves = this.moveInterpreter(['u','r','d','l']);
        this._skill_tree = [[], ['ul'], ['ud'], ['dl', 'dr']];
    }
}

class Bishop extends ChessPiece {
    constructor(id, team=CHESSTEAM.WHITE, direction=DIRECTION.UP) {
        super(id, "bishop", team, direction, "bishop");
        this._line_moves = this.moveInterpreter(['ul','ur','dl','dr']);
        this._skill_tree = [[], ['u'], ['d'], ['l', 'd']];
    }
}

class Knight extends ChessPiece {
    constructor(id, team=CHESSTEAM.WHITE, direction=DIRECTION.UP) {
        super(id, "knight", team, direction, "knight");
        this._static_moves = this.moveInterpreter(['uul','uur','urr','drr','ddr','ddl','dll','ull']);
        this._skill_tree = [[], ['uu'], ['dd'], ['ll', 'rr']];
    }
}

class Queen extends ChessPiece {
    constructor(id, team=CHESSTEAM.WHITE, direction=DIRECTION.UP) {
        super(id, "queen", team, direction, "queen");
        this._line_moves = this.moveInterpreter(['u','r','d','l','ul','ur','dl','dr']);
        this._skill_tree = [[], ['uul', 'uur'], ['ddl', 'ddr'], ['ull', 'dll', 'urr', 'drr']];
    }
}