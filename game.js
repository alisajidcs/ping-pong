// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerScoreElement = document.getElementById('playerScore');
const aiScoreElement = document.getElementById('aiScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// Game state
let gameRunning = false;
let gamePaused = false;
let animationId;

// Game objects
const game = {
  width: canvas.width,
  height: canvas.height,
  playerScore: 0,
  aiScore: 0
};

// Paddle class
class Paddle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 5;
    this.dy = 0;
  }

  update() {
    this.y += this.dy;

    // Keep paddle within canvas bounds
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y + this.height > game.height) {
      this.y = game.height - this.height;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveUp() {
    this.dy = -this.speed;
  }

  moveDown() {
    this.dy = this.speed;
  }

  stop() {
    this.dy = 0;
  }

  getCenter() {
    return this.y + this.height / 2;
  }
}

// Ball class
class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = 4;
    this.dx = this.speed;
    this.dy = this.speed;
    this.maxSpeed = 8;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // Ball collision with top and bottom walls
    if (this.y - this.radius <= 0 || this.y + this.radius >= game.height) {
      this.dy = -this.dy;
    }

    // Ball collision with paddles
    this.checkPaddleCollision(playerPaddle);
    this.checkPaddleCollision(aiPaddle);

    // Ball goes out of bounds (scoring)
    if (this.x < 0) {
      // AI scores
      game.aiScore++;
      this.reset();
      updateScore();
    } else if (this.x > game.width) {
      // Player scores
      game.playerScore++;
      this.reset();
      updateScore();
    }
  }

  checkPaddleCollision(paddle) {
    if (this.x - this.radius <= paddle.x + paddle.width &&
      this.x + this.radius >= paddle.x &&
      this.y - this.radius <= paddle.y + paddle.height &&
      this.y + this.radius >= paddle.y) {

      // Reverse ball direction
      this.dx = -this.dx;

      // Add some variation based on where ball hits paddle
      const hitPos = (this.y - paddle.getCenter()) / (paddle.height / 2);
      this.dy = hitPos * this.speed * 0.5;

      // Increase speed slightly on each hit (up to max speed)
      if (Math.abs(this.dx) < this.maxSpeed) {
        this.dx = this.dx > 0 ? this.dx + 0.2 : this.dx - 0.2;
      }

      // Move ball away from paddle to prevent sticking
      if (paddle === playerPaddle) {
        this.x = paddle.x + paddle.width + this.radius;
      } else {
        this.x = paddle.x - this.radius;
      }
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  reset() {
    this.x = game.width / 2;
    this.y = game.height / 2;
    this.dx = Math.random() > 0.5 ? this.speed : -this.speed;
    this.dy = Math.random() > 0.5 ? this.speed : -this.speed;
  }
}

// Create game objects
const playerPaddle = new Paddle(20, game.height / 2 - 40, 15, 80, '#ffffff');
const aiPaddle = new Paddle(game.width - 35, game.height / 2 - 40, 15, 80, '#ffffff');
const ball = new Ball(game.width / 2, game.height / 2, 8, '#ffffff');

// AI logic
function updateAI() {
  const aiCenter = aiPaddle.getCenter();
  const ballY = ball.y;
  const aiSpeed = 3; // Slightly slower than player for balance

  if (aiCenter < ballY - 35) {
    aiPaddle.dy = aiSpeed;
  } else if (aiCenter > ballY + 35) {
    aiPaddle.dy = -aiSpeed;
  } else {
    aiPaddle.dy = 0;
  }
}

// Input handling
const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function handleInput() {
  if (keys['ArrowUp'] || keys['w'] || keys['W']) {
    playerPaddle.moveUp();
  } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
    playerPaddle.moveDown();
  } else {
    playerPaddle.stop();
  }
}

// Game loop
function gameLoop() {
  if (!gameRunning || gamePaused) return;

  // Clear canvas
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, game.width, game.height);

  // Draw center line
  drawCenterLine();

  // Handle input
  handleInput();

  // Update AI
  updateAI();

  // Update game objects
  playerPaddle.update();
  aiPaddle.update();
  ball.update();

  // Draw game objects
  playerPaddle.draw();
  aiPaddle.draw();
  ball.draw();

  // Continue game loop
  animationId = requestAnimationFrame(gameLoop);
}

function drawCenterLine() {
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(game.width / 2, 0);
  ctx.lineTo(game.width / 2, game.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function updateScore() {
  playerScoreElement.textContent = game.playerScore;
  aiScoreElement.textContent = game.aiScore;
}

function startGame() {
  gameRunning = true;
  gamePaused = false;
  startBtn.textContent = 'Running...';
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  gameLoop();
}

function pauseGame() {
  gamePaused = !gamePaused;
  pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';

  if (!gamePaused && gameRunning) {
    gameLoop();
  }
}

function resetGame() {
  gameRunning = false;
  gamePaused = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  // Reset scores
  game.playerScore = 0;
  game.aiScore = 0;
  updateScore();

  // Reset positions
  playerPaddle.y = game.height / 2 - 40;
  aiPaddle.y = game.height / 2 - 40;
  ball.reset();

  // Reset UI
  startBtn.textContent = 'Start Game';
  startBtn.disabled = false;
  pauseBtn.textContent = 'Pause';
  pauseBtn.disabled = true;

  // Clear canvas and draw initial state
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, game.width, game.height);
  drawCenterLine();
  playerPaddle.draw();
  aiPaddle.draw();
  ball.draw();
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);

// Initialize game
resetGame();