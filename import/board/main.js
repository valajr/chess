function createTileButton(id, color) {
    let button_tile = document.createElement("button");
    button_tile.setAttribute("id", id)
    button_tile.setAttribute("class", color)
    button_tile.innerHTML = '<img src = "static/img/empty.png">';
    return button_tile;
}

function initiateTable(board, row_amount, col_amount) {
    let board_js = [];
    let row = [];
    for(let r = 0; r < row_amount; r++) {
        board_js[r] = [];
        let board_row = document.createElement("tr");
        for(let c = 0; c < col_amount; c++) {
            let row_data = document.createElement("td");
            sum = r*col_amount + c;
            if(r%2 && !(col_amount%2)) {
                if(sum%2) {
                    row_data.appendChild(createTileButton(sum, "white"));
                }
                else {
                    row_data.appendChild(createTileButton(sum, "black"));
                }
            }
            else if(sum%2){
                row_data.appendChild(createTileButton(sum, "black"));
            }
            else {
                row_data.appendChild(createTileButton(sum, "white"));                
            }
            
            board_row.appendChild(row_data);
            row[c] = 0;
        }
        board_js[r].push(row);
        board.appendChild(board_row);
    }
    return board_js;
}

function placePiece(piece, tile) {
    let button_tile = document.getElementById(tile)
    button_tile.innerHTML = `<img src = ${piece.image}>`;
}

documentReady(()=>{
    let board_html = document.getElementById("boardTable");
    let board_js = initiateTable(board_html, 8, 8);
    white_king = new King(2);
    placePiece(white_king, 2);
    aux = white_king.getPossibleMoves([0,2], board_js);
    console.log(aux);
});