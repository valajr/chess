function createTileButton() {
    let button_tile = document.createElement("button");
    button_tile.innerHTML = "Testex";
    return button_tile;
}

function initiateTable(board, row_amount, col_amount) {
    for(let r = 0; r < row_amount; r++) {
        let board_row = document.createElement("tr");
        for(let c = 0; c < col_amount; c++) {
            let row_data = document.createElement("td");
            row_data.appendChild(createTileButton());
            board_row.appendChild(row_data);
        }
        board.appendChild(board_row);
    }
}

documentReady(()=>{
    let board = document.getElementById("boardTable");
    initiateTable(board, 3, 3);
});