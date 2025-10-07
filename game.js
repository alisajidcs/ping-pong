// Import all game modules
import { Paddle } from './js/Paddle.js';
import { Ball } from './js/Ball.js';
import { AIController } from './js/AIController.js';
import { InputManager } from './js/InputManager.js';
import { GameManager } from './js/GameManager.js';
import { Renderer } from './js/Renderer.js';
import { GameModeManager } from './js/GameModeManager.js';

// DOM elements
const canvas = document.getElementById('gameCanvas');
const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');
const leftPlayerScore = document.getElementById('leftPlayerScore');
const rightPlayerScore = document.getElementById('rightPlayerScore');
const leftPlayerLabel = document.getElementById('leftPlayerLabel');
const rightPlayerLabel = document.getElementById('rightPlayerLabel');
const controlInstructions = document.getElementById('controlInstructions');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const menuBtn = document.getElementById('menuBtn');
const singlePlayerBtn = document.getElementById('singlePlayerBtn');
const multiPlayerBtn = document.getElementById('multiPlayerBtn');

// Initialize game modules
const renderer = new Renderer(canvas);
const inputManager = new InputManager();
const gameManager = new GameManager(canvas, updateScore);
const aiController = new AIController('medium');
const gameModeManager = new GameModeManager();

// Create game objects
const leftPaddle = new Paddle(20, canvas.height / 2 - 40, 15, 80, '#ffffff');
const rightPaddle = new Paddle(canvas.width - 35, canvas.height / 2 - 40, 15, 80, '#ffffff');
const ball = new Ball(canvas.width / 2, canvas.height / 2, 8, '#ffffff');

// Game loop
function gameLoop() {
  if (!gameManager.isRunning()) return;

  // Handle input based on game mode
  if (gameModeManager.isSinglePlayer()) {
    // Single player: left paddle controlled by player, right by AI
    inputManager.handlePaddleMovement(leftPaddle);
    aiController.update(rightPaddle, ball);
  } else if (gameModeManager.isMultiplayer()) {
    // Multiplayer: left paddle by Player 1 (W/S), right paddle by Player 2 (Arrow keys)
    inputManager.handlePlayer1Movement(leftPaddle);
    inputManager.handlePlayer2Movement(rightPaddle);
  }

  // Update game objects
  leftPaddle.update(canvas.height);
  rightPaddle.update(canvas.height);

  // Update ball and check for scoring
  const ballState = ball.update(canvas.width, canvas.height);

  // Check paddle collisions
  ball.checkPaddleCollision(leftPaddle);
  ball.checkPaddleCollision(rightPaddle);

  // Handle scoring
  if (ballState.scoredLeft) {
    gameManager.scorePoint(false); // Right player/AI scores
    ball.reset(canvas.width, canvas.height);
  } else if (ballState.scoredRight) {
    gameManager.scorePoint(true); // Left player scores
    ball.reset(canvas.width, canvas.height);
  }

  // Render everything
  const gameState = gameManager.getGameState();
  renderer.render(gameState, leftPaddle, rightPaddle, ball);

  // Continue game loop if not game over
  if (!gameState.gameOver) {
    const animationId = requestAnimationFrame(gameLoop);
    gameManager.setAnimationId(animationId);
  }
}// Score update function
function updateScore(leftScore, rightScore) {
  leftPlayerScore.textContent = leftScore;
  rightPlayerScore.textContent = rightScore;
}

// UI update function
function updateUI() {
  const labels = gameModeManager.getPlayerLabels();
  const instructions = gameModeManager.getControlInstructions();

  leftPlayerLabel.textContent = labels.left + ': ';
  rightPlayerLabel.textContent = labels.right + ': ';
  controlInstructions.textContent = instructions;
}

// Show/hide screens
function showMenu() {
  console.log('Showing menu');
  menuScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
}

function showGame() {
  console.log('Showing game');
  menuScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  updateUI();
}

// Game control functions
function startGame() {
  gameManager.start();
  startBtn.textContent = 'Running...';
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  gameLoop();
}

function pauseGame() {
  const isPaused = gameManager.pause();
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';

  if (!isPaused && gameManager.isRunning()) {
    gameLoop();
  }
}

function resetGame() {
  gameManager.reset();

  // Reset paddle positions
  leftPaddle.y = canvas.height / 2 - 40;
  rightPaddle.y = canvas.height / 2 - 40;
  ball.reset(canvas.width, canvas.height);

  // Reset UI
  startBtn.textContent = 'Start Game';
  startBtn.disabled = false;
  pauseBtn.textContent = 'Pause';
  pauseBtn.disabled = true;

  // Draw initial state
  renderer.drawInitialState(leftPaddle, rightPaddle, ball);
}

function returnToMenu() {
  gameManager.stop();
  gameModeManager.returnToMenu();
  showMenu();
}

// Mode selection handlers
function selectSinglePlayer() {
  gameModeManager.startSinglePlayer();
  showGame();
  resetGame();
}

function selectMultiPlayer() {
  gameModeManager.startMultiplayer();
  showGame();
  resetGame();
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
menuBtn.addEventListener('click', returnToMenu);
singlePlayerBtn.addEventListener('click', selectSinglePlayer);
multiPlayerBtn.addEventListener('click', selectMultiPlayer);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Escape') {
    e.preventDefault();
    if (gameManager.isRunning()) {
      pauseGame();
    }
  }
});

// Initialize game
showMenu();