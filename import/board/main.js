let rows = 0;
let columns = 0;

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
        let showed_tiles = document.getElementsByClassName("showed");
        while(showed_tiles.length) {
            showed_tiles[0].style.borderColor = "transparent";
            showed_tiles[0].classList.remove("showed", "clicked");
        }
    }

    showPossibleMoves(id) {
        let button_tile = document.getElementById(id);
        let showed_tiles =  document.getElementsByClassName("showed");
        let position = this.idToPosition(id);
        let flag = false
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
        let id = piece.getId();
        let button_tile = document.getElementById(id);
        let position = this.idToPosition(id);

        if(new_position == null) {
            button_tile.innerHTML = `<img src = ${piece.image} width=100%>`;
            this.board_js[position[0]][position[1]] = piece;
        }
        else {
            this.deletePossibleMoves();
            button_tile.innerHTML = `<img src = ${ChessPiece.getImage("empty", "tile")} width=100%>`;;
            this.board_js[position[0]][position[1]] = ChessPiece.EMPTY_TILE;
            let new_id = this.positionToId(new_position);
            let new_button_tile = document.getElementById(new_id);
            piece.setId(new_id);
            new_button_tile.innerHTML = `<img src = ${piece.image} width=100%>`;
            this.board_js[new_position[0]][new_position[1]] = piece;
        }
    }

}

function deleteMenu(menu) {
    rows = document.getElementById("row").value;
    columns = document.getElementById("col").value;
    menu.remove();
}

function showMenu() {
    let menu = document.getElementById("menu");
    menu.innerHTML = "Type the quantity of rows and columns: <br>Row: <input type='number' id='row'> <br>Col: <input type='number' id='col'>";
    let button = document.createElement("button");
    button.setAttribute("id", "collector");
    button.addEventListener("click", () => {
        deleteMenu(menu);
    });
    menu.appendChild(button);
}

documentReady(()=>{
    // let board = new Board(8, 8);
    // let white_king = new King(2);
    // let white_tower = new Tower(1);
    // board.placePiece(white_king);
    // board.placePiece(white_tower);
    showMenu();
});