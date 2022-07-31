let rows    = 0;
let columns = 0;
let board;

class Board {
    board_js = [];

    constructor(row_amount, col_amount) {
        this.row_amount = row_amount;
        this.col_amount = col_amount;
        this.board_html = document.getElementById("boardTable");
        this.board_js = this.initiateTable();
    }

    idToPosition(id) {
        let row = parseInt(id/this.col_amount);
        let col = id - row*this.col_amount;
        return [row, col];
    }

    positionToId(position) {
        let id = position[0]*this.col_amount + position[1];
        return id;
    }
    
    deletePossibleMoves() {
        let showed_tiles = document.getElementsByClassName("showed");
        while(showed_tiles.length) {
            showed_tiles[0].style.borderColor = "transparent";
            showed_tiles[0].classList.remove("showed", "clicked");
        }
    }

    showPossibleMoves(id) {
        let button_tile = document.getElementById(id);
        let showed_tiles = document.getElementsByClassName("showed");
        let position = this.idToPosition(id);

        let flag = false;
        for(let i in showed_tiles) {
            if(showed_tiles[i] == button_tile) {
                flag = true;
            }
        }

        if(flag) {
            let clicked_button = document.getElementsByClassName("clicked");
            if(button_tile == clicked_button[0]) {
                this.deletePossibleMoves();
            }
            else {
                let nodeMap = document.getElementsByClassName("clicked").item(0).attributes;
                let origin_id = nodeMap[0].value;
                let origin_position = this.idToPosition(origin_id);
                let piece = this.board_js[origin_position[0]][origin_position[1]];
                this.placePiece(piece, position);
            }
        }
        else {
            this.deletePossibleMoves();
            let piece = this.board_js[position[0]][position[1]];

            if(piece != ChessPiece.EMPTY_TILE) {
                button_tile.style.borderColor = "black";
                button_tile.classList.add("clicked", "showed");
                let possible_moves = piece.getPossibleMoves([position[0], position[1]], this.board_js);
                for(let m in possible_moves) {
                    let tile = this.positionToId(possible_moves[m]);
                    button_tile = document.getElementById(tile);
                    button_tile.style.borderColor = "#4e4e4e";
                    button_tile.classList.add("showed");
                }
            }
        }
    }

    createTileButton(id, color) {
        let button_tile = document.createElement("button");
        button_tile.setAttribute("id", id);
        button_tile.setAttribute("class", color);
        button_tile.classList.add("tile");
        button_tile.addEventListener("click", () => {
            this.showPossibleMoves(id);
        });
        button_tile.innerHTML = `<img src = ${ChessPiece.getImage("empty", "tile")} width=100%>`;;
        return button_tile;
    }

    initiateTable() {
        this.board_html.innerHTML = '';
        let board_js = [];
        for(let r = 0; r < this.row_amount; r++) {
            let row = [];
            let board_row = document.createElement("tr");
            for(let c = 0; c < this.col_amount; c++) {
                let row_data = document.createElement("td");
                let sum = r*this.col_amount + c;
                if(r%2 && !(this.col_amount%2)) {
                    if(sum%2) {
                        row_data.appendChild(this.createTileButton(sum, "white"));
                    }
                    else {
                        row_data.appendChild(this.createTileButton(sum, "black"));
                    }
                }
                else if(sum%2){
                    row_data.appendChild(this.createTileButton(sum, "black"));
                }
                else {
                    row_data.appendChild(this.createTileButton(sum, "white"));
                }
                
                board_row.appendChild(row_data);
                row[c] = ChessPiece.EMPTY_TILE;
            }
            board_js[r] = row;
            this.board_html.appendChild(board_row);
        }
        return board_js;
    }

    placePiece(piece, new_position=null) {
        try {
            let id = piece.getId();
            let button_tile = document.getElementById(id);
            let position = this.idToPosition(id);
    
            if(new_position == null) {
                button_tile.innerHTML = `<img src = ${piece.image} width=100%>`;
                this.board_js[position[0]][position[1]] = piece;
            }
            else {
                let new_id = this.positionToId(new_position);
                this.pieceMoved(piece.getId(), new_id);
                this.deletePossibleMoves();
                button_tile.innerHTML = `<img src = ${ChessPiece.getImage("empty", "tile")} width=100%>`;
                this.board_js[position[0]][position[1]] = ChessPiece.EMPTY_TILE;
                let new_button_tile = document.getElementById(new_id);
                piece.setId(new_id);
                new_button_tile.innerHTML = `<img src = ${piece.image} width=100%>`;
                this.board_js[new_position[0]][new_position[1]] = piece;

                this.checkWinCondition();
            }
        }
        catch {
            console.warn(`Cannot place piece of type '${piece.type}' in [${new_position || this.idToPosition(piece.getId())}].`)
        }
    }

    queryPieceInBoard(query) {
        try {
            for(let row in this.board_js) {
                let filtered = this.board_js[row].filter(query)[0];
                if(filtered !== undefined) {
                    return filtered;
                }
            }
            return null;
        }
        catch {
            return null;
        }
    }

    pieceMoved(fromId, toId) {
        try {
            let fromPiece = this.queryPieceInBoard(p => p.getId() == fromId);
            let toPiece   = this.queryPieceInBoard(p => p.getId() ==   toId);

            if(toPiece !== null) { // moved onto another piece
                let kTeam = fromPiece.team == CHESSTEAM.WHITE? 'wKillsDiv': 'bKillsDiv';
        
                let toPieceImage = document.createElement('img');
                toPieceImage.src = toPiece.image;
        
                document.getElementById(kTeam).appendChild(toPieceImage);
                fromPiece.kill_list.push(toPiece.type);
                fromPiece.addXp(ChessPiece.xp_value[toPiece.type]);
            }
        }
        catch { }
    }

    findKing(team) {
        return this.queryPieceInBoard(p => p.type == "king" && p.team == team);
    }
    
    checkWinCondition() {
        if(this.findKing(CHESSTEAM.BLACK) === null) {
            alert(`Team White wins!!!!!!`);
            window.location.reload();
            return;
        }
        if(this.findKing(CHESSTEAM.WHITE) === null) {
            alert(`Team Black wins!!!!!!`);
            window.location.reload();
            return;
        }
    }
}

function classicalChess(board) {
    let white_team = [];

    let wking = new King(60, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wking);
    wking.levelUpEvent = (p) => {createSkillTree(p);};
    let wq = new Queen(59, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wq);
    wq.levelUpEvent = (p) => {createSkillTree(p);};
    let wb_01 = new Bishop(58, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wb_01);
    wb_01.levelUpEvent = (p) => {createSkillTree(p);};
    let wb_02 = new Bishop(61, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wb_02);
    wb_01.levelUpEvent = (p) => {createSkillTree(p);};
    let wk_01 = new Knight(57, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wk_01);
    wk_01.levelUpEvent = (p) => {createSkillTree(p);};
    let wk_02 = new Knight(62, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wk_02);
    wk_01.levelUpEvent = (p) => {createSkillTree(p);};
    let wt_01 = new Tower(56, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wt_01);
    wt_01.levelUpEvent = (p) => {createSkillTree(p);};
    let wt_02 = new Tower(63, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wt_02);
    wt_01.levelUpEvent = (p) => {createSkillTree(p);};
    let wp_01 = new Pawn(48, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wp_01);
    wp_01.levelUpEvent = (p) => {createSkillTree(p);};
    let wp_02 = new Pawn(49, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wp_02);
    wp_02.levelUpEvent = (p) => {createSkillTree(p);};
    let wp_03 = new Pawn(50, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wp_03);
    wp_03.levelUpEvent = (p) => {createSkillTree(p);};
    let wp_04 = new Pawn(51, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wp_04);
    wp_04.levelUpEvent = (p) => {createSkillTree(p);};
    let wp_05 = new Pawn(52, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wp_05);
    wp_05.levelUpEvent = (p) => {createSkillTree(p);};
    let wp_06 = new Pawn(53, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wp_06);
    wp_06.levelUpEvent = (p) => {createSkillTree(p);};
    let wp_07 = new Pawn(54, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wp_07);
    wp_07.levelUpEvent = (p) => {createSkillTree(p);};
    let wp_08 = new Pawn(55, CHESSTEAM.WHITE, DIRECTION.UP);
    board.placePiece(wp_08);
    wp_08.levelUpEvent = (p) => {createSkillTree(p);};
    white_team.push(wking, wq, wb_01, wb_02, wk_01, wk_02, wt_01, wt_02, wp_01, wp_02, wp_03, wp_04, wp_05, wp_06, wp_07, wp_08);

    let black_team = [];

    let bking = new King(4, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bking);
    bking.levelUpEvent = (p) => {createSkillTree(p);};
    let bq = new Queen(3, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bq);
    bq.levelUpEvent = (p) => {createSkillTree(p);};
    let bb_01 = new Bishop(2, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bb_01);
    bb_01.levelUpEvent = (p) => {createSkillTree(p);};
    let bb_02 = new Bishop(5, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bb_02);
    bb_02.levelUpEvent = (p) => {createSkillTree(p);};
    let bk_01 = new Knight(1, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bk_01);
    bk_01.levelUpEvent = (p) => {createSkillTree(p);};
    let bk_02 = new Knight(6, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bk_02);
    bk_02.levelUpEvent = (p) => {createSkillTree(p);};
    let bt_01 = new Tower(0, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bt_01);
    bt_01.levelUpEvent = (p) => {createSkillTree(p);};
    let bt_02 = new Tower(7, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bt_02);
    bt_02.levelUpEvent = (p) => {createSkillTree(p);};
    let bp_01 = new Pawn(8, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bp_01);
    bp_01.levelUpEvent = (p) => {createSkillTree(p);};
    let bp_02 = new Pawn(9, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bp_02);
    bp_02.levelUpEvent = (p) => {createSkillTree(p);};
    let bp_03 = new Pawn(10, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bp_03);
    bp_03.levelUpEvent = (p) => {createSkillTree(p);};
    let bp_04 = new Pawn(11, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bp_04);
    bp_04.levelUpEvent = (p) => {createSkillTree(p);};
    let bp_05 = new Pawn(12, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bp_05);
    bp_05.levelUpEvent = (p) => {createSkillTree(p);};
    let bp_06 = new Pawn(13, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bp_06);
    bp_06.levelUpEvent = (p) => {createSkillTree(p);};
    let bp_07 = new Pawn(14, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bp_07);
    bp_07.levelUpEvent = (p) => {createSkillTree(p);};
    let bp_08 = new Pawn(15, CHESSTEAM.BLACK, DIRECTION.DOWN);
    board.placePiece(bp_08);
    bp_08.levelUpEvent = (p) => {createSkillTree(p);};
    black_team.push(bking, bq, bb_01, bb_02, bk_01, bk_02, bt_01, bt_02, bp_01, bp_02, bp_03, bp_04, bp_05, bp_06, bp_07, bp_08);

    bp_01.levelUpEvent = (p) => {
        let new_move = p.getSkillTree(p.level);
        console.log(new_move);
        document.getElementById("treeDiv").removeAttribute('hidden');
        document.getElementById("pieceType").innerHTML = p.type;
        document.getElementById("pieceLevel").innerHTML = p.level;
        document.getElementById("pieceTree").innerHTML = new_move;
        p._static_moves.push(...p.moveInterpreter(new_move));
    };


    return [white_team, black_team]
}

function startBoard(width, height) {
    rows    = height;
    columns = width;
    board   = new Board(rows, columns);
    let [white_team, black_team] = classicalChess(board);
}

function createSkillTree(p) {
    let new_move = p.getSkillTree(p.level);
    console.log(new_move);
    document.getElementById("treeDiv").removeAttribute('hidden');
    document.getElementById("pieceType").innerHTML = p.type;
    document.getElementById("pieceLevel").innerHTML = p.level;
    document.getElementById("pieceTree").innerHTML = new_move;
    p._static_moves.push(...p.moveInterpreter(new_move));
}