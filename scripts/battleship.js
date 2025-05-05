let startGameButton = document.querySelector("#start-game");
let boardsize = document.querySelector("#board-size-options");
let shipSizes = document.querySelector("#ship-sizes");



startGameButton.addEventListener("click", startGame);

function startGame() {
  let board_size_selected = parseInt(document.querySelector("#board-size").value);

    let shipSize1 = parseInt(document.querySelector("#ship-1").value);
    let shipSize2 = parseInt(document.querySelector("#ship-2").value);
    let shipSize3 = parseInt(document.querySelector("#ship-3").value);
    let shipSize4 = parseInt(document.querySelector("#ship-4").value);
    let shipSize5 = parseInt(document.querySelector("#ship-5").value);


    console.log("Ship sizes selected: " + shipSize1 + ", " + shipSize2 + ", " + shipSize3 + ", " + shipSize4 + ", " + shipSize5);


  console.log("Board size selected: " + board_size_selected);

  boardsize.innerHTML = "";
  shipSizes.innerHTML = "";
  startGameButton.style.display = "none";

  let gameboard = document.querySelector("#game-board");

  // Clear old cells
  gameboard.innerHTML = "";

  // Set grid size dynamically
  gameboard.style.gridTemplateColumns = `repeat(${board_size_selected}, 40px)`;
  gameboard.style.gridTemplateRows = `repeat(${board_size_selected}, 40px)`;

  for (let i = 0; i < board_size_selected * board_size_selected; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.col = i % board_size_selected; // Calculate row index
      cell.dataset.row = Math.floor(i / board_size_selected); // Calculate column index
      gameboard.appendChild(cell);
  }
  
  // Create a 2D array to represent the game board
  let boardArray = [];
  for (let row = 0; row < board_size_selected; row++) {
      let rowArray = [];
      for (let col = 0; col < board_size_selected; col++) {
          rowArray.push(0); // Initialize each cell with 0
      }
      boardArray.push(rowArray);
  }

  console.log("Game board array:", boardArray);

  console.log(boardArray[2][3]); // Accessing the first cell (row 0, column 0)
  
  let placedShips = [];
  
    function placeShips ()
    {
        let shipSizes = [shipSize1, shipSize2, shipSize3, shipSize4, shipSize5];

        for (let size of shipSizes) {
            let placed = false;
            while (!placed) {
                let row = Math.floor(Math.random() * board_size_selected);
                let col = Math.floor(Math.random() * board_size_selected);
                let orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                


                if (canPlaceShip(boardArray, row, col, size, orientation)) {
                    placeShip(boardArray, row, col, size, orientation);
                    placedShips.push({ row: row, col: col, size: size, orientation: orientation });
                    placed = true;
                }
            }
        }

        console.log("Placed ships:", placedShips);

    }

    // Function to check if a ship can be placed at the given position
    // with the given size and orientation

    

    function canPlaceShip(board, row, col, size, orientation) {
        if (orientation === 'horizontal') {
            if (col + size > board.length) return false; // Out of bounds
            for (let i = 0; i < size; i++) {
                if (board[row][col + i] !== 0) return false; // Cell already occupied
            }
            // Check surrounding cells for proximity
            for (let i = -1; i <= size; i++) {
                for (let j = -1; j <= 1; j++) {
                    let checkRow = row + j;
                    let checkCol = col + i;
                    if (checkRow >= 0 && checkRow < board.length && checkCol >= 0 && checkCol < board.length) {
                        if (board[checkRow][checkCol] !== 0) return false; // Nearby cell occupied
                    }
                }
            }
        } else { // vertical
            if (row + size > board.length) return false; // Out of bounds
            for (let i = 0; i < size; i++) {
                if (board[row + i][col] !== 0) return false; // Cell already occupied
            }
            // Check surrounding cells for proximity
            for (let i = -1; i <= size; i++) {
                for (let j = -1; j <= 1; j++) {
                    let checkRow = row + i;
                    let checkCol = col + j;
                    if (checkRow >= 0 && checkRow < board.length && checkCol >= 0 && checkCol < board.length) {
                        if (board[checkRow][checkCol] !== 0) return false; // Nearby cell occupied
                    }
                }
            }
        }
        return true;
    }
    function placeShip(board, row, col, size, orientation) {
        if (orientation === 'horizontal') {
            for (let i = 0; i < size; i++) {
                board[row][col + i] = 1; // Mark the ship on the board
            }
        } else { // vertical
            for (let i = 0; i < size; i++) {
                board[row + i][col] = 1; // Mark the ship on the board
            }
        }
    }

    placeShips();
    // Add event listeners to cells for clicking
    let cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            let row = parseInt(cell.dataset.row);
            let col = parseInt(cell.dataset.col);
            console.log(`Cell clicked: Row ${row}, Column ${col}`);

            // Check if the cell contains a ship (1) or is empty (0)
            if (boardArray[row][col] === 1) {
                cell.classList.add('hit'); // Add hit class for styling
                console.log("Hit!");
            } else {
                cell.classList.add('miss'); // Add miss class for styling
                console.log("Miss!");
            }
        });
    });

    
    // Create a table to display remaining ships
    let shipTable = document.createElement('table');
    shipTable.id = 'ship-table';
    let tableHeader = `<tr>
        <th>Ship Size</th>
        <th>Remaining</th>
    </tr>`;
    shipTable.innerHTML = tableHeader;
    document.body.appendChild(shipTable);

    // Initialize remaining ships count
    let remainingShips = {};
    [shipSize1, shipSize2, shipSize3, shipSize4, shipSize5].forEach(size => {
        remainingShips[size] = (remainingShips[size] || 0) + 1;
    });

    // Populate the table with initial values
    function updateShipTable() {
        shipTable.innerHTML = tableHeader;
        for (let size in remainingShips) {
            let row = document.createElement('tr');
            row.innerHTML = `<td>${size}</td><td>${remainingShips[size]}</td>`;
            shipTable.appendChild(row);
        }
    }
    updateShipTable();

    // Function to check if a ship is fully revealed
    function isShipSunk(board, row, col, size, orientation) {
        if (orientation === 'horizontal') {
            for (let i = 0; i < size; i++) {
                if (!document.querySelector(`.cell[data-row="${row}"][data-col="${col + i}"]`).classList.contains('hit')) {
                    return false;
                }
            }
        } else { // vertical
            for (let i = 0; i < size; i++) {
                if (!document.querySelector(`.cell[data-row="${row + i}"][data-col="${col}"]`).classList.contains('hit')) {
                    return false;
                }
            }
        }
        return true;
    }

    // Update the table when a ship is sunk
    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            let row = parseInt(cell.dataset.row);
            let col = parseInt(cell.dataset.col);

            // Check if the clicked cell is part of a ship
            placedShips.forEach(ship => {
                if (
                    (ship.orientation === 'horizontal' &&
                        row === ship.row &&
                        col >= ship.col &&
                        col < ship.col + ship.size) ||
                    (ship.orientation === 'vertical' &&
                        col === ship.col &&
                        row >= ship.row &&
                        row < ship.row + ship.size)
                ) {
                    // Check if the ship is fully revealed
                    if (isShipSunk(boardArray, ship.row, ship.col, ship.size, ship.orientation)) {
                        if (remainingShips[ship.size] > 0) {
                            remainingShips[ship.size]--;
                            updateShipTable();
                        }
                    }
                }
            });
        });
    });
    console.log("Game board array after placing ships:", boardArray);




}

