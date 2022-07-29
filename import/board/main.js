class Board {
    board_js = [];

    constructor(row_amount, col_amount) {
        this.row_amount = row_amount;
        this.col_amount = col_amount;
        this.board_html = document.getElementById("boardTable");
        this.board_js = this.initiateTable();
    }

    idToPosition(id) {
        let row = parseInt(id/this.row_amount);
        let col = id - row*this.col_amount;
        return [row, col];
    }

    positionToId(position) {
        let id = position[0]*this.row_amount + position[1];
        return id;
    }
    
    deletePossibleMoves() {
        let clicked_tiles = document.getElementsByClassName("clicked");
        while(clicked_tiles.length) {
            clicked_tiles[0].style.borderColor = "transparent";
            clicked_tiles[0].classList.remove("clicked");
        }
    }

    showPossibleMoves(id) {
        this.deletePossibleMoves();

        let button_tile = document.getElementById(id);
        let position = this.idToPosition(id);

        if(this.board_js[position[0]][position[1]] != ChessPiece.EMPTY_TILE) {
            button_tile.style.borderColor = "black";
            button_tile.classList.add("clicked");
            let possible_moves = this.board_js[position[0]][position[1]].getPossibleMoves([position[0], position[1]], this.board_js);
            for(let m in possible_moves) {
                let tile = this.positionToId(possible_moves[m]);
                button_tile = document.getElementById(tile);
                button_tile.style.borderColor = "black";
                button_tile.classList.add("clicked");
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
        button_tile.innerHTML = '<img src = "static/img/empty.png" width=100%>';
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

    placePiece(piece) {
        this.deletePossibleMoves();
        let id = piece.getId();
        let button_tile = document.getElementById(id);
        let position = this.idToPosition(id);
        button_tile.innerHTML = `<img src = ${piece.image} width=100%>`;
        this.board_js[position[0]][position[1]] = piece;
    }

}

documentReady(()=>{
    let board = new Board(8, 8);
    let white_king = new King(2);
    let white_tower = new Tower(1);
    board.placePiece(white_king);
    board.placePiece(white_tower);
});