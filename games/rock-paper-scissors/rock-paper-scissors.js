import './rock-paper-scissors.css';

/**
 * Initialize the Rock Paper Scissors game
 * @param {HTMLElement} container - The container element to render the game in
 * @returns {Object} Game controller with methods to interact with the game
 */
export function initRockPaperScissors(container) {
  // Game settings
  const CHOICES = ['rock', 'paper', 'scissors'];
  const ICONS = {
    'rock': '✊',
    'paper': '✋',
    'scissors': '✌️'
  };
  
  // Game state
  let playerScore = 0;
  let computerScore = 0;
  let roundsPlayed = 0;
  let gameHistory = [];
  
  // Cache DOM elements
  let optionsElement;
  let resultElement;
  let playerScoreElement;
  let computerScoreElement;
  let roundsElement;
  let historyElement;
  let resetButton;
  
  // Create game UI
  function createGameUI() {
    const gameElement = document.createElement('div');
    gameElement.className = 'rps-game';
    
    gameElement.innerHTML = `
      <h2>Rock Paper Scissors</h2>
      <div class="game-score">
        <div class="player-score">
          <div class="score-label">You</div>
          <div class="score-value">${playerScore}</div>
        </div>
        <div class="rounds">
          <div class="rounds-label">Rounds</div>
          <div class="rounds-value">${roundsPlayed}</div>
        </div>
        <div class="computer-score">
          <div class="score-label">Computer</div>
          <div class="score-value">${computerScore}</div>
        </div>
      </div>
      
      <div class="game-result">
        <div class="result-message">Choose your move!</div>
        <div class="vs-container">
          <div class="player-choice choice">?</div>
          <div class="vs">VS</div>
          <div class="computer-choice choice">?</div>
        </div>
      </div>
      
      <div class="game-options">
        <button class="option-btn" data-choice="rock">${ICONS.rock}</button>
        <button class="option-btn" data-choice="paper">${ICONS.paper}</button>
        <button class="option-btn" data-choice="scissors">${ICONS.scissors}</button>
      </div>
      
      <div class="game-history">
        <h3>Game History</h3>
        <div class="history-list"></div>
      </div>
      
      <div class="game-controls">
        <button class="reset-button">Reset Game</button>
      </div>
    `;
    
    container.appendChild(gameElement);
    
    // Cache new DOM elements
    optionsElement = gameElement.querySelector('.game-options');
    resultElement = gameElement.querySelector('.result-message');
    playerScoreElement = gameElement.querySelector('.player-score .score-value');
    computerScoreElement = gameElement.querySelector('.computer-score .score-value');
    roundsElement = gameElement.querySelector('.rounds-value');
    historyElement = gameElement.querySelector('.history-list');
    resetButton = gameElement.querySelector('.reset-button');
    
    // Add event listeners
    optionsElement.addEventListener('click', handleOptionClick);
    resetButton.addEventListener('click', resetGame);
  }
  
  // Handle option click
  function handleOptionClick(event) {
    const button = event.target.closest('.option-btn');
    if (!button) return;
    
    const playerChoice = button.getAttribute('data-choice');
    playRound(playerChoice);
  }
  
  // Play a round
  function playRound(playerChoice) {
    // Get computer choice
    const computerChoice = getComputerChoice();
    
    // Determine winner
    const result = determineWinner(playerChoice, computerChoice);
    
    // Update score
    updateScore(result);
    
    // Update UI
    updateRoundResult(playerChoice, computerChoice, result);
    
    // Add to history
    addToHistory(playerChoice, computerChoice, result);
    
    // Update rounds played
    roundsPlayed++;
    roundsElement.textContent = roundsPlayed;
    
    // Highlight buttons
    highlightChoices(playerChoice, computerChoice);
  }
  
  // Get random computer choice
  function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * CHOICES.length);
    return CHOICES[randomIndex];
  }
  
  // Determine the winner
  function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
      return 'tie';
    }
    
    if (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'paper' && computerChoice === 'rock') ||
      (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
      return 'player';
    }
    
    return 'computer';
  }
  
  // Update the score
  function updateScore(result) {
    if (result === 'player') {
      playerScore++;
      playerScoreElement.textContent = playerScore;
    } else if (result === 'computer') {
      computerScore++;
      computerScoreElement.textContent = computerScore;
    }
  }
  
  // Update round result UI
  function updateRoundResult(playerChoice, computerChoice, result) {
    // Update choice displays
    const playerChoiceElement = document.querySelector('.player-choice');
    const computerChoiceElement = document.querySelector('.computer-choice');
    
    playerChoiceElement.textContent = ICONS[playerChoice];
    playerChoiceElement.setAttribute('data-choice', playerChoice);
    
    computerChoiceElement.textContent = ICONS[computerChoice];
    computerChoiceElement.setAttribute('data-choice', computerChoice);
    
    // Update result message
    let resultMessage = '';
    if (result === 'player') {
      resultMessage = 'You win!';
      resultElement.className = 'result-message win';
    } else if (result === 'computer') {
      resultMessage = 'Computer wins!';
      resultElement.className = 'result-message lose';
    } else {
      resultMessage = 'It\'s a tie!';
      resultElement.className = 'result-message tie';
    }
    
    resultElement.textContent = resultMessage;
    
    // Animate VS container
    const vsContainer = document.querySelector('.vs-container');
    vsContainer.classList.add('animate');
    setTimeout(() => {
      vsContainer.classList.remove('animate');
    }, 700);
  }
  
  // Add round to history
  function addToHistory(playerChoice, computerChoice, result) {
    // Create history item
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${result}`;
    
    historyItem.innerHTML = `
      <div class="history-round">Round ${roundsPlayed + 1}</div>
      <div class="history-choices">
        <span class="history-player-choice">${ICONS[playerChoice]}</span>
        <span class="history-vs">vs</span>
        <span class="history-computer-choice">${ICONS[computerChoice]}</span>
      </div>
      <div class="history-result">
        ${result === 'player' ? 'You win' : result === 'computer' ? 'Computer wins' : 'Tie'}
      </div>
    `;
    
    // Add to history list (at the beginning)
    historyElement.prepend(historyItem);
    
    // Limit history items
    if (historyElement.children.length > 5) {
      historyElement.removeChild(historyElement.lastChild);
    }
    
    // Add to game history array
    gameHistory.push({
      round: roundsPlayed + 1,
      playerChoice,
      computerChoice,
      result
    });
  }
  
  // Highlight the choices
  function highlightChoices(playerChoice, computerChoice) {
    // Remove previous highlights
    const buttons = optionsElement.querySelectorAll('.option-btn');
    buttons.forEach(button => {
      button.classList.remove('selected', 'winner', 'loser', 'tie');
    });
    
    // Highlight player's choice
    const playerButton = optionsElement.querySelector(`[data-choice="${playerChoice}"]`);
    const result = determineWinner(playerChoice, computerChoice);
    
    if (playerButton) {
      playerButton.classList.add('selected');
      if (result === 'player') {
        playerButton.classList.add('winner');
      } else if (result === 'computer') {
        playerButton.classList.add('loser');
      } else {
        playerButton.classList.add('tie');
      }
    }
  }
  
  // Reset the game
  function resetGame() {
    // Reset game state
    playerScore = 0;
    computerScore = 0;
    roundsPlayed = 0;
    gameHistory = [];
    
    // Reset UI
    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
    roundsElement.textContent = roundsPlayed;
    resultElement.textContent = 'Choose your move!';
    resultElement.className = 'result-message';
    
    // Reset choices
    const playerChoiceElement = document.querySelector('.player-choice');
    const computerChoiceElement = document.querySelector('.computer-choice');
    
    playerChoiceElement.textContent = '?';
    playerChoiceElement.removeAttribute('data-choice');
    
    computerChoiceElement.textContent = '?';
    computerChoiceElement.removeAttribute('data-choice');
    
    // Clear history
    historyElement.innerHTML = '';
    
    // Remove button highlights
    const buttons = optionsElement.querySelectorAll('.option-btn');
    buttons.forEach(button => {
      button.classList.remove('selected', 'winner', 'loser', 'tie');
    });
  }
  
  // Clean up resources when game is unloaded
  function cleanup() {
    // Remove event listeners
    if (optionsElement) {
      optionsElement.removeEventListener('click', handleOptionClick);
    }
    if (resetButton) {
      resetButton.removeEventListener('click', resetGame);
    }
  }
  
  // Initialize the game
  function init() {
    createGameUI();
  }
  
  // Initialize the game
  init();
  
  // Return game controller
  return {
    restart: resetGame,
    cleanup
  };
}