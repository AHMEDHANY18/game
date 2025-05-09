import './tic-tac-toe.css';

/**
 * Initialize the Tic Tac Toe game
 * @param {HTMLElement} container - The container element to render the game in
 * @returns {Object} Game controller with methods to interact with the game
 */
export function initTicTacToe(container) {
  // Game state
  let currentPlayer = 'X';
  let gameBoard = Array(9).fill('');
  let gameActive = false;
  let gameStatusMessage = '';
  let xScore = 0;
  let oScore = 0;
  
  // Cache DOM elements
  let boardElement;
  let statusElement;
  let restartButton;
  let scoreElement;
  
  // Winning combinations
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  
  // Create game UI
  function createGameUI() {
    const gameElement = document.createElement('div');
    gameElement.className = 'tic-tac-toe-game';
    
    gameElement.innerHTML = `
      <h2>Tic Tac Toe</h2>
      <div class="game-score">
        <div class="score-x">X: ${xScore}</div>
        <div class="score-o">O: ${oScore}</div>
      </div>
      <div class="game-status">Player X's turn</div>
      <div class="game-board">
        ${Array(9).fill('').map((_, index) => 
          `<div class="cell" data-index="${index}"></div>`).join('')}
      </div>
      <div class="game-controls">
        <button class="restart-button">Restart Game</button>
      </div>
    `;
    
    container.appendChild(gameElement);
    
    // Cache new DOM elements
    boardElement = gameElement.querySelector('.game-board');
    statusElement = gameElement.querySelector('.game-status');
    restartButton = gameElement.querySelector('.restart-button');
    scoreElement = gameElement.querySelector('.game-score');
    
    // Add event listeners
    boardElement.addEventListener('click', handleCellClick);
    restartButton.addEventListener('click', restartGame);
  }
  
  // Handle cell click
  function handleCellClick(event) {
    const cell = event.target;
    
    // Make sure we clicked on a cell and not between cells
    if (!cell.classList.contains('cell') || !gameActive) return;
    
    const index = parseInt(cell.getAttribute('data-index'));
    
    // Check if the cell is already filled
    if (gameBoard[index] !== '') return;
    
    // Update the game board
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(`cell-${currentPlayer.toLowerCase()}`);
    
    // Add animation class
    cell.classList.add('cell-filled');
    
    // Check for win or draw
    if (checkWin()) {
      gameStatusMessage = `Player ${currentPlayer} wins!`;
      gameActive = false;
      highlightWinningCells();
      updateScore();
    } else if (checkDraw()) {
      gameStatusMessage = "Game ended in a draw!";
      gameActive = false;
    } else {
      // Switch player
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      gameStatusMessage = `Player ${currentPlayer}'s turn`;
    }
    
    // Update game status
    updateGameStatus();
  }
  
  // Check if a player has won
  function checkWin() {
    return winningCombinations.some(combination => {
      return combination.every(index => {
        return gameBoard[index] === currentPlayer;
      });
    });
  }
  
  // Find and return the winning combination
  function getWinningCombination() {
    return winningCombinations.find(combination => {
      return combination.every(index => {
        return gameBoard[index] === currentPlayer;
      });
    });
  }
  
  // Highlight winning cells
  function highlightWinningCells() {
    const winningCombination = getWinningCombination();
    if (!winningCombination) return;
    
    winningCombination.forEach(index => {
      const cell = boardElement.querySelector(`[data-index="${index}"]`);
      cell.classList.add('winning-cell');
    });
  }
  
  // Check if the game is a draw
  function checkDraw() {
    return gameBoard.every(cell => cell !== '');
  }
  
  // Update the game status message
  function updateGameStatus() {
    statusElement.textContent = gameStatusMessage;
  }
  
  // Update the score
  function updateScore() {
    if (currentPlayer === 'X') {
      xScore++;
    } else {
      oScore++;
    }
    scoreElement.innerHTML = `
      <div class="score-x">X: ${xScore}</div>
      <div class="score-o">O: ${oScore}</div>
    `;
  }
  
  // Restart the game
  function restartGame() {
    // Reset game state
    gameBoard = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    gameStatusMessage = `Player ${currentPlayer}'s turn`;
    
    // Reset UI
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.textContent = '';
      cell.className = 'cell';
      cell.setAttribute('data-player', '');
    });
    
    // Update game status
    updateGameStatus();
  }
  
  // Initialize game
  function init() {
    createGameUI();
    gameActive = true;
    gameStatusMessage = `Player ${currentPlayer}'s turn`;
    updateGameStatus();
  }
  
  // Clean up resources when game is unloaded
  function cleanup() {
    // Remove event listeners to prevent memory leaks
    if (boardElement) {
      boardElement.removeEventListener('click', handleCellClick);
    }
    if (restartButton) {
      restartButton.removeEventListener('click', restartGame);
    }
  }
  
  // Initialize the game
  init();
  
  // Return game controller
  return {
    restart: restartGame,
    cleanup
  };
}