// Select game board and play again button
const gameBoard = document.getElementById("game-board");
const boardSize = 4; // 4x4 grid
let board = [];

// Create the Play Again button dynamically
const playAgainButton = document.createElement("button");
playAgainButton.textContent = "Play Again";
playAgainButton.id = "play-again";
playAgainButton.style.display = "none"; // Initially hidden
playAgainButton.style.marginTop = "20px";
document.body.appendChild(playAgainButton);

// Initialize board with zeros
function initializeBoard() {
  board = Array(boardSize)
    .fill()
    .map(() => Array(boardSize).fill(0));
  spawnTile();
  spawnTile();
  drawBoard();
  playAgainButton.style.display = "none"; // Hide Play Again button
}

// Draw the board
function drawBoard() {
  gameBoard.innerHTML = "";
  board.forEach((row) => {
    row.forEach((value) => {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      if (value) {
        tile.textContent = value;
        tile.setAttribute("data-value", value);
      }
      gameBoard.appendChild(tile);
    });
  });
}

// Spawn a new tile (2 or 4) in an empty spot
function spawnTile() {
  const emptyTiles = [];
  board.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value === 0) emptyTiles.push({ r, c });
    });
  });
  if (emptyTiles.length) {
    const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[r][c] = Math.random() > 0.9 ? 4 : 2;
  }
}

// Handle swipe logic
function slide(row) {
  const filteredRow = row.filter((value) => value); // Remove zeros
  const newRow = [];
  while (filteredRow.length) {
    if (filteredRow.length > 1 && filteredRow[0] === filteredRow[1]) {
      newRow.push(filteredRow.shift() * 2); // Merge tiles
      filteredRow.shift(); // Remove merged tile
    } else {
      newRow.push(filteredRow.shift());
    }
  }
  while (newRow.length < boardSize) newRow.push(0); // Add zeros back
  return newRow;
}

// Slide all rows
function slideLeft() {
  let changed = false;
  board = board.map((row) => {
    const newRow = slide(row);
    if (JSON.stringify(row) !== JSON.stringify(newRow)) changed = true;
    return newRow;
  });
  return changed;
}

// Rotate board clockwise or counterclockwise
function rotateBoard(clockwise = true) {
  const newBoard = Array(boardSize)
    .fill()
    .map(() => Array(boardSize).fill(0));
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (clockwise) {
        newBoard[c][boardSize - r - 1] = board[r][c];
      } else {
        newBoard[boardSize - c - 1][r] = board[r][c];
      }
    }
  }
  board = newBoard;
}

// Handle moves
function handleMove(direction) {
  let changed = false;
  if (direction === "ArrowLeft") changed = slideLeft();
  else if (direction === "ArrowRight") {
    rotateBoard();
    rotateBoard();
    changed = slideLeft();
    rotateBoard();
    rotateBoard();
  } else if (direction === "ArrowUp") {
    rotateBoard(false);
    changed = slideLeft();
    rotateBoard(true);
  } else if (direction === "ArrowDown") {
    rotateBoard(true);
    changed = slideLeft();
    rotateBoard(false);
  }

  if (changed) {
    spawnTile();
    drawBoard();
    if (checkGameOver()) {
      alert("Game Over!");
      playAgainButton.style.display = "block"; // Show Play Again button
    }
  }
}

// Check for game over
function checkGameOver() {
  if (board.flat().includes(0)) return false;
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const tile = board[r][c];
      if (board[r][c + 1] === tile || board[r + 1]?.[c] === tile) return false;
    }
  }
  return true;
}

// Listen for keyboard input
document.addEventListener("keydown", (e) => handleMove(e.key));

// Restart the game when Play Again button is clicked
playAgainButton.addEventListener("click", initializeBoard);

// Initialize the game
initializeBoard();
