// Import all game modules
import { Paddle } from "./js/Paddle.js";
import { Ball } from "./js/Ball.js";
import { AIController } from "./js/AIController.js";
import { InputManager } from "./js/InputManager.js";
import { GameManager } from "./js/GameManager.js";
import { Renderer } from "./js/Renderer.js";
import { GameModeManager } from "./js/GameModeManager.js";
import { ParticleSystem } from "./js/ParticleSystem.js";
import { AudioSystem } from "./js/AudioSystem.js";
import { GameJuice } from "./js/GameJuice.js";

// DOM elements
const canvas = document.getElementById("gameCanvas");
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const leftPlayerScore = document.getElementById("leftPlayerScore");
const rightPlayerScore = document.getElementById("rightPlayerScore");
const leftPlayerLabel = document.getElementById("leftPlayerLabel");
const rightPlayerLabel = document.getElementById("rightPlayerLabel");
const controlInstructions = document.getElementById("controlInstructions");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const menuBtn = document.getElementById("menuBtn");
const singlePlayerBtn = document.getElementById("singlePlayerBtn");
const multiPlayerBtn = document.getElementById("multiPlayerBtn");
const timerDisplay = document.getElementById("gameTimer");

// Initialize game modules
const particleSystem = new ParticleSystem();
const audioSystem = new AudioSystem();
const gameJuice = new GameJuice(canvas);
const renderer = new Renderer(canvas, particleSystem, gameJuice);
const inputManager = new InputManager();
const gameManager = new GameManager(canvas, updateScore);
const aiController = new AIController("medium");
const gameModeManager = new GameModeManager();

// Create game objects
const leftPaddle = new Paddle(20, canvas.height / 2 - 40, 15, 80, "#ffffff");
const rightPaddle = new Paddle(
  canvas.width - 35,
  canvas.height / 2 - 40,
  15,
  80,
  "#ffffff"
);
const ball = new Ball(
  canvas.width / 2,
  canvas.height / 2,
  8,
  "#ffffff",
  particleSystem,
  audioSystem
);

// Game loop
function gameLoop() {
  if (!gameManager.isRunning()) return;

  // Update game timer (if enabled)
  const timerState = gameManager.update();
  updateTimer();

  // Check for time-based game over
  if (timerState.timeUp) {
    endGame();
    return;
  }

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

  // Update effects
  particleSystem.update();
  gameJuice.update();

  // Update timer display
  updateTimer();

  // Update ball and check for scoring
  const ballState = ball.update(canvas.width, canvas.height);

  // Check paddle collisions
  if (
    ball.checkPaddleCollision(leftPaddle) ||
    ball.checkPaddleCollision(rightPaddle)
  ) {
    audioSystem.playPaddleHit();
    gameJuice.addScreenShake(3, 150);
  } // Handle scoring
  if (ballState.scoredLeft) {
    // Add score celebration particles
    particleSystem.addExplosion(canvas.width - 50, canvas.height / 2, 20, {
      colors: ["#ff6b6b", "#ffeaa7", "#fd79a8"],
    });
    gameJuice.addScoreAnimation(
      canvas.width - 100,
      canvas.height / 2,
      1,
      "#ff6b6b"
    );
    gameJuice.addScreenShake(8, 300);
    gameJuice.createFlashEffect("rgba(255, 107, 107, 0.2)", 150);
    audioSystem.playScore(false); // AI/Right player scores
    gameManager.scorePoint(false); // Right player/AI scores
    ball.reset(canvas.width, canvas.height);
  } else if (ballState.scoredRight) {
    // Add score celebration particles
    particleSystem.addExplosion(50, canvas.height / 2, 20, {
      colors: ["#4ecdc4", "#00ff88", "#45b7d1"],
    });
    gameJuice.addScoreAnimation(100, canvas.height / 2, 1, "#4ecdc4");
    gameJuice.addScreenShake(8, 300);
    gameJuice.createFlashEffect("rgba(78, 205, 196, 0.2)", 150);
    audioSystem.playScore(true); // Left player scores
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
} // Score update function
function updateScore(leftScore, rightScore) {
  leftPlayerScore.textContent = leftScore;
  rightPlayerScore.textContent = rightScore;
}

// Timer update function
function updateTimer() {
  if (!gameManager.isTimedMode()) return;

  const timeRemaining = gameManager.getTimeRemaining();
  const formattedTime = gameManager.getFormattedTime();

  if (timerDisplay) {
    timerDisplay.textContent = formattedTime;

    // Update timer styling based on remaining time
    timerDisplay.classList.remove("warning", "critical");

    if (timeRemaining <= 10000) {
      // Last 10 seconds
      timerDisplay.classList.add("critical");
    } else if (timeRemaining <= 30000) {
      // Last 30 seconds
      timerDisplay.classList.add("warning");
    }
  }
}

// UI update function
function updateUI() {
  const labels = gameModeManager.getPlayerLabels();
  const instructions = gameModeManager.getControlInstructions();

  leftPlayerLabel.textContent = labels.left + ": ";
  rightPlayerLabel.textContent = labels.right + ": ";
  controlInstructions.textContent = instructions;
}

// Show/hide screens
function showMenu() {
  console.log("Showing menu");
  menuScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
}

function showGame() {
  console.log("Showing game");
  menuScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  updateUI();
}

// Game control functions
function startGame() {
  audioSystem.resume(); // Resume audio context
  audioSystem.playGameStart();
  gameManager.start();
  startBtn.textContent = "Running...";
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  gameLoop();
}

function endGame() {
  gameManager.stop();

  // Get final scores to determine winner
  const gameState = gameManager.getGameState();
  const leftScore = gameState.leftScore;
  const rightScore = gameState.rightScore;

  let message;
  let winnerColor;

  if (leftScore > rightScore) {
    const playerName = gameModeManager.isSinglePlayer() ? "Player" : "Player 1";
    message = `${playerName} Wins! Time's Up!`;
    winnerColor = "#4ecdc4";
  } else if (rightScore > leftScore) {
    const playerName = gameModeManager.isSinglePlayer() ? "AI" : "Player 2";
    message = `${playerName} Wins! Time's Up!`;
    winnerColor = "#ff6b6b";
  } else {
    message = "It's a Tie! Time's Up!";
    winnerColor = "#ffeaa7";
  }

  // Create dramatic end game effects
  gameJuice.addScreenShake(15, 800);
  gameJuice.createFlashEffect(`rgba(255, 255, 255, 0.3)`, 500);

  // Add explosion particles at center
  particleSystem.addExplosion(canvas.width / 2, canvas.height / 2, 50, {
    colors: [winnerColor, "#ffffff", "#ffeaa7"],
  });

  // Play end game sound
  audioSystem.playGameOver();

  // Show winner message (you could add a modal or alert here)
  setTimeout(() => {
    alert(message);
    returnToMenu();
  }, 1000);
}

function pauseGame() {
  const isPaused = gameManager.pause();
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";

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
  startBtn.textContent = "Start Game";
  startBtn.disabled = false;
  pauseBtn.textContent = "Pause";
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
  audioSystem.playMenuSelect();
  gameJuice.createPulseEffect(singlePlayerBtn);
  gameModeManager.startSinglePlayer();

  // Enable timer for single player (2 minutes)
  gameManager.enableTimer();
  gameManager.setGameDuration(120000); // 2 minutes
  gameManager.setGameMode("timed");

  showGame();
  resetGame();
}

function selectMultiPlayer() {
  audioSystem.playMenuSelect();
  gameJuice.createPulseEffect(multiPlayerBtn);
  gameModeManager.startMultiplayer();

  // Enable timer for multiplayer (3 minutes)
  gameManager.enableTimer();
  gameManager.setGameDuration(180000); // 3 minutes
  gameManager.setGameMode("timed");

  showGame();
  resetGame();
}

// Event listeners
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
resetBtn.addEventListener("click", resetGame);
menuBtn.addEventListener("click", returnToMenu);
singlePlayerBtn.addEventListener("click", selectSinglePlayer);
multiPlayerBtn.addEventListener("click", selectMultiPlayer);

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Escape") {
    e.preventDefault();
    if (gameManager.isRunning()) {
      pauseGame();
    }
  }
});

// Initialize game
showMenu();
