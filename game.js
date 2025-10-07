// Import all game modules
import { Paddle } from './js/Paddle.js';
import { Ball } from './js/Ball.js';
import { AIController } from './js/AIController.js';
import { InputManager } from './js/InputManager.js';
import { GameManager } from './js/GameManager.js';
import { Renderer } from './js/Renderer.js';

// Game variables and DOM elements
const canvas = document.getElementById('gameCanvas');
const playerScoreElement = document.getElementById('playerScore');
const aiScoreElement = document.getElementById('aiScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// Initialize game modules
const renderer = new Renderer(canvas);
const inputManager = new InputManager();
const gameManager = new GameManager(canvas, updateScore);
const aiController = new AIController('medium');

// Create game objects
const playerPaddle = new Paddle(20, canvas.height / 2 - 40, 15, 80, '#ffffff');
const aiPaddle = new Paddle(canvas.width - 35, canvas.height / 2 - 40, 15, 80, '#ffffff');
const ball = new Ball(canvas.width / 2, canvas.height / 2, 8, '#ffffff');

// Game loop
function gameLoop() {
  if (!gameManager.isRunning()) return;

  // Handle input
  inputManager.handlePaddleMovement(playerPaddle);

  // Update AI
  aiController.update(aiPaddle, ball);

  // Update game objects
  playerPaddle.update(canvas.height);
  aiPaddle.update(canvas.height);

  // Update ball and check for scoring
  const ballState = ball.update(canvas.width, canvas.height);

  // Check paddle collisions
  ball.checkPaddleCollision(playerPaddle);
  ball.checkPaddleCollision(aiPaddle);

  // Handle scoring
  if (ballState.scoredLeft) {
    gameManager.scorePoint(false); // AI scores
    ball.reset(canvas.width, canvas.height);
  } else if (ballState.scoredRight) {
    gameManager.scorePoint(true); // Player scores
    ball.reset(canvas.width, canvas.height);
  }

  // Render everything
  const gameState = gameManager.getGameState();
  renderer.render(gameState, playerPaddle, aiPaddle, ball);

  // Continue game loop if not game over
  if (!gameState.gameOver) {
    const animationId = requestAnimationFrame(gameLoop);
    gameManager.setAnimationId(animationId);
  }
}

// Score update function
function updateScore(playerScore, aiScore) {
  playerScoreElement.textContent = playerScore;
  aiScoreElement.textContent = aiScore;
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
  playerPaddle.y = canvas.height / 2 - 40;
  aiPaddle.y = canvas.height / 2 - 40;
  ball.reset(canvas.width, canvas.height);

  // Reset UI
  startBtn.textContent = 'Start Game';
  startBtn.disabled = false;
  pauseBtn.textContent = 'Pause';
  pauseBtn.disabled = true;

  // Draw initial state
  renderer.drawInitialState(playerPaddle, aiPaddle, ball);
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);

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
resetGame();