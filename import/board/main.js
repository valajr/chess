function createTileButton(id, color) {
    let button_tile = document.createElement("button");
    button_tile.setAttribute("id", id)
    button_tile.setAttribute("class", color)
    button_tile.innerHTML = '<img src = "static/img/empty.png">';
    return button_tile;
}

function initiateTable(board, row_amount, col_amount) {
    for(let r = 0; r < row_amount; r++) {
        let board_row = document.createElement("tr");
        for(let c = 0; c < col_amount; c++) {
            let row_data = document.createElement("td");
            sum = r*3 + c;
            if(sum%2) {
                row_data.appendChild(createTileButton(sum, "black"));
            }
            else {
                row_data.appendChild(createTileButton(sum, "white"));
            }
            board_row.appendChild(row_data);
        }
        board.appendChild(board_row);
    }
}

function placePiece(piece, team, tile) {
    let button_tile = document.getElementById(tile)
    button_tile.innerHTML = `<img src = "static/img/${piece}_${team}.png">`;
}

documentReady(()=>{
    let board = document.getElementById("boardTable");
    initiateTable(board, 8, 8);
    placePiece("bishop", "black", 2);
    placePiece("queen", "black", 3);
});