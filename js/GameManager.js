// Game module for core game state and loop management
export class GameManager {
  constructor(canvas, onScoreUpdate) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.onScoreUpdate = onScoreUpdate;

    // Game state
    this.running = false;
    this.paused = false;
    this.animationId = null;

    // Scores
    this.playerScore = 0;
    this.aiScore = 0;

    // Game settings
    this.maxScore = 11;
    this.gameOver = false;
    this.winner = null;
  }

  start() {
    this.running = true;
    this.paused = false;
    this.gameOver = false;
    this.winner = null;
  }

  pause() {
    this.paused = !this.paused;
    return this.paused;
  }

  stop() {
    this.running = false;
    this.paused = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  reset() {
    this.stop();
    this.playerScore = 0;
    this.aiScore = 0;
    this.gameOver = false;
    this.winner = null;
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.playerScore, this.aiScore);
    }
  }

  scorePoint(isPlayerScore) {
    if (this.gameOver) return;

    if (isPlayerScore) {
      this.playerScore++;
    } else {
      this.aiScore++;
    }

    // Check for game over
    if (this.playerScore >= this.maxScore) {
      this.gameOver = true;
      this.winner = 'player';
      this.stop();
    } else if (this.aiScore >= this.maxScore) {
      this.gameOver = true;
      this.winner = 'ai';
      this.stop();
    }

    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.playerScore, this.aiScore);
    }

    return {
      playerScore: this.playerScore,
      aiScore: this.aiScore,
      gameOver: this.gameOver,
      winner: this.winner
    };
  }

  isRunning() {
    return this.running && !this.paused;
  }

  isPaused() {
    return this.paused;
  }

  isGameOver() {
    return this.gameOver;
  }

  getWinner() {
    return this.winner;
  }

  getScore() {
    return {
      player: this.playerScore,
      ai: this.aiScore
    };
  }

  getGameState() {
    return {
      running: this.running,
      paused: this.paused,
      gameOver: this.gameOver,
      winner: this.winner,
      score: this.getScore(),
      maxScore: this.maxScore
    };
  }

  setMaxScore(score) {
    this.maxScore = score;
  }

  setAnimationId(id) {
    this.animationId = id;
  }
}