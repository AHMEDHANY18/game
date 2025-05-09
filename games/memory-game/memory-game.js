import './memory-game.css';

/**
 * Initialize the Memory Game
 * @param {HTMLElement} container - The container element to render the game in
 * @returns {Object} Game controller with methods to interact with the game
 */
export function initMemoryGame(container) {
  // Game settings
  const CARD_PAIRS = 8; // 16 cards total
  
  // Game state
  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let gameActive = false;
  let timer = 0;
  let timerInterval = null;
  
  // Card symbols (emoji)
  const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐮', '🐷'];
  
  // Cache DOM elements
  let boardElement;
  let movesElement;
  let timerElement;
  let restartButton;
  let gameStatusElement;
  
  // Create game UI
  function createGameUI() {
    const gameElement = document.createElement('div');
    gameElement.className = 'memory-game';
    
    gameElement.innerHTML = `
      <h2>Memory Game</h2>
      <div class="game-info">
        <div class="info-item">
          <span class="info-label">Moves:</span>
          <span class="moves-count">0</span>
        </div>
        <div class="info-item">
          <span class="info-label">Time:</span>
          <span class="timer">0</span>
        </div>
      </div>
      <div class="game-status">Match all pairs to win!</div>
      <div class="memory-board"></div>
      <div class="game-controls">
        <button class="restart-button">Restart Game</button>
      </div>
    `;
    
    container.appendChild(gameElement);
    
    // Cache new DOM elements
    boardElement = gameElement.querySelector('.memory-board');
    movesElement = gameElement.querySelector('.moves-count');
    timerElement = gameElement.querySelector('.timer');
    restartButton = gameElement.querySelector('.restart-button');
    gameStatusElement = gameElement.querySelector('.game-status');
    
    // Add event listeners
    restartButton.addEventListener('click', resetGame);
  }
  
  // Initialize the game board
  function initializeBoard() {
    // Clear the board
    boardElement.innerHTML = '';
    
    // Create pairs of cards
    cards = generateCards();
    
    // Render cards
    cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'memory-card';
      cardElement.setAttribute('data-index', index);
      
      cardElement.innerHTML = `
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back">${card.symbol}</div>
        </div>
      `;
      
      cardElement.addEventListener('click', () => flipCard(index));
      boardElement.appendChild(cardElement);
    });
    
    // Start timer
    startTimer();
    
    // Update game status
    gameActive = true;
  }
  
  // Generate random cards
  function generateCards() {
    // Select symbols for the game
    const gameSymbols = [...symbols].sort(() => 0.5 - Math.random()).slice(0, CARD_PAIRS);
    
    // Create pairs
    const cardPairs = [...gameSymbols, ...gameSymbols];
    
    // Shuffle cards
    return cardPairs.map(symbol => ({ symbol, matched: false }))
      .sort(() => 0.5 - Math.random());
  }
  
  // Flip a card
  function flipCard(index) {
    // Ignore if game is not active or card is already flipped or matched
    if (!gameActive || flippedCards.includes(index) || cards[index].matched) {
      return;
    }
    
    // Get card element
    const cardElement = boardElement.querySelector(`[data-index="${index}"]`);
    
    // Add flipped class
    cardElement.classList.add('flipped');
    
    // Add to flipped cards
    flippedCards.push(index);
    
    // Check if we have a pair
    if (flippedCards.length === 2) {
      moves++;
      updateMoves();
      
      // Check if the pair matches
      const [firstIndex, secondIndex] = flippedCards;
      if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
        // Mark as matched
        cards[firstIndex].matched = true;
        cards[secondIndex].matched = true;
        
        // Increment matched pairs
        matchedPairs++;
        
        // Add matched class
        setTimeout(() => {
          boardElement.querySelector(`[data-index="${firstIndex}"]`).classList.add('matched');
          boardElement.querySelector(`[data-index="${secondIndex}"]`).classList.add('matched');
        }, 500);
        
        // Reset flipped cards
        flippedCards = [];
        
        // Check if game is complete
        if (matchedPairs === CARD_PAIRS) {
          endGame();
        }
      } else {
        // No match, flip back after a delay
        setTimeout(() => {
          boardElement.querySelector(`[data-index="${firstIndex}"]`).classList.remove('flipped');
          boardElement.querySelector(`[data-index="${secondIndex}"]`).classList.remove('flipped');
          flippedCards = [];
        }, 1000);
      }
    }
  }
  
  // Update moves counter
  function updateMoves() {
    movesElement.textContent = moves;
  }
  
  // Start the timer
  function startTimer() {
    // Reset timer
    timer = 0;
    timerElement.textContent = '0';
    
    // Clear existing interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // Start new interval
    timerInterval = setInterval(() => {
      timer++;
      timerElement.textContent = timer;
    }, 1000);
  }
  
  // End the game
  function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    
    gameStatusElement.textContent = `Congratulations! You won in ${moves} moves and ${timer} seconds!`;
    gameStatusElement.classList.add('game-won');
  }
  
  // Reset the game
  function resetGame() {
    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    
    // Reset UI
    updateMoves();
    gameStatusElement.textContent = 'Match all pairs to win!';
    gameStatusElement.classList.remove('game-won');
    
    // Initialize new board
    initializeBoard();
  }
  
  // Clean up resources when game is unloaded
  function cleanup() {
    // Clear timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // Remove event listeners
    if (restartButton) {
      restartButton.removeEventListener('click', resetGame);
    }
    
    // Remove card event listeners
    const cardElements = boardElement?.querySelectorAll('.memory-card');
    cardElements?.forEach(card => {
      const index = card.getAttribute('data-index');
      card.removeEventListener('click', () => flipCard(index));
    });
  }
  
  // Initialize the game
  function init() {
    createGameUI();
    initializeBoard();
  }
  
  // Initialize the game
  init();
  
  // Return game controller
  return {
    restart: resetGame,
    cleanup
  };
}