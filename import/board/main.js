class Board {
    board_js = [];

    constructor(row_amount, col_amount) {
        this.row_amount = row_amount;
        this.col_amount = col_amount;
        this.board_html = document.getElementById("boardTable");
        this.board_js = this.initiateTable();
    }

    createTileButton(id, color) {
        let button_tile = document.createElement("button");
        button_tile.setAttribute("id", id)
        button_tile.setAttribute("class", color)
        button_tile.innerHTML = '<img src = "static/img/empty.png">';
        return button_tile;
    }

    initiateTable() {
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
        let id = piece.getId();
        let row = parseInt(id/this.row_amount, 10);
        let col = id - row*this.col_amount;
        let button_tile = document.getElementById(id);
        button_tile.innerHTML = `<img src = ${piece.image} height=60 width=60>`;
        this.board_js[row][col] = piece;
    }

}

documentReady(()=>{
    let board = new Board(8, 8);
    let white_king = new King(2);
    board.placePiece(white_king);
    let aux = white_king.getPossibleMoves([0,2], board.board_js);
    console.log(aux);
});