import './style.css';
import { initTicTacToe } from './games/tic-tac-toe/tic-tac-toe.js';
import { initMemoryGame } from './games/memory-game/memory-game.js';
import { initRockPaperScissors } from './games/rock-paper-scissors/rock-paper-scissors.js';

// DOM elements
const gameCards = document.querySelectorAll('.game-card');
const playButtons = document.querySelectorAll('.play-btn');
const gameContainer = document.getElementById('game-container');
const activeGameElement = document.getElementById('active-game');
const backButton = document.getElementById('back-btn');
const gameGrid = document.querySelector('.game-grid');

// Game initialization functions mapped by game ID
const gameInitializers = {
  'tic-tac-toe': initTicTacToe,
  'memory': initMemoryGame,
  'rock-paper-scissors': initRockPaperScissors
};

// Current active game
let currentGame = null;

// Function to show game container and load a specific game
function loadGame(gameId) {
  // Hide game grid and show game container
  gameGrid.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  
  // Clean previous game content
  activeGameElement.innerHTML = '';
  
  // Initialize the selected game
  if (gameInitializers[gameId]) {
    currentGame = gameInitializers[gameId](activeGameElement);
  }
  
  // Scroll to the game container
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Function to return to game selection
function returnToGameSelection() {
  // Cleanup current game if needed
  if (currentGame && typeof currentGame.cleanup === 'function') {
    currentGame.cleanup();
  }
  
  // Hide game container and show game grid
  gameContainer.classList.add('hidden');
  gameGrid.classList.remove('hidden');
  
  // Reset current game
  currentGame = null;
}

// Event Listeners
playButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const gameId = e.target.getAttribute('data-game');
    loadGame(gameId);
  });
});

gameCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // Only trigger if the click was not on the button itself
    if (!e.target.classList.contains('play-btn')) {
      const gameId = card.getAttribute('data-game');
      loadGame(gameId);
    }
  });
});

backButton.addEventListener('click', returnToGameSelection);

// Add some interactivity to the game cards
gameCards.forEach(card => {
  // Parallax effect on hover
  card.addEventListener('mousemove', (e) => {
    const preview = card.querySelector('.game-preview');
    if (!preview) return;
    
    const rect = preview.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPercent = (x / rect.width - 0.5) * 10;
    const yPercent = (y / rect.height - 0.5) * 10;
    
    preview.style.transform = `perspective(1000px) rotateX(${-yPercent}deg) rotateY(${xPercent}deg)`;
  });
  
  // Reset on mouse leave
  card.addEventListener('mouseleave', (e) => {
    const preview = card.querySelector('.game-preview');
    if (!preview) return;
    
    preview.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
});