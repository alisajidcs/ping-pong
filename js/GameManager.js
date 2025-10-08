// Game module for core game state and loop management
export class GameManager {
  constructor(canvas, onScoreUpdate, onTimerUpdate = null) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.onScoreUpdate = onScoreUpdate;
    this.onTimerUpdate = onTimerUpdate;

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

    // Timer settings
    this.timerEnabled = true;
    this.gameDuration = 120; // 2 minutes in seconds
    this.timeRemaining = this.gameDuration;
    this.lastUpdateTime = 0;
    this.gameMode = "timed"; // 'timed' or 'score'
  }

  start() {
    this.running = true;
    this.paused = false;
    this.gameOver = false;
    this.winner = null;
    this.lastUpdateTime = Date.now();
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
    this.timeRemaining = this.gameDuration;
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.playerScore, this.aiScore);
    }
    if (this.onTimerUpdate) {
      this.onTimerUpdate(this.timeRemaining);
    }
  }

  update() {
    if (!this.running || this.paused || this.gameOver) {
      return { timeUp: false, gameOver: this.gameOver };
    }

    // Update timer if enabled
    if (this.timerEnabled && this.gameMode === "timed") {
      const currentTime = Date.now();
      const deltaTime = currentTime - this.lastUpdateTime; // Keep in milliseconds
      this.lastUpdateTime = currentTime;

      this.timeRemaining -= deltaTime;

      if (this.onTimerUpdate) {
        this.onTimerUpdate(Math.max(0, this.timeRemaining));
      }

      // Check for time-based game over
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.gameOver = true;

        // Determine winner based on score
        if (this.playerScore > this.aiScore) {
          this.winner = "player";
        } else if (this.aiScore > this.playerScore) {
          this.winner = "ai";
        } else {
          this.winner = "tie";
        }

        this.stop();
        return {
          playerScore: this.playerScore,
          aiScore: this.aiScore,
          gameOver: this.gameOver,
          winner: this.winner,
          timeUp: true,
        };
      }
    }

    // Return normal state when timer is still running or not enabled
    return {
      timeUp: false,
      gameOver: this.gameOver,
      playerScore: this.playerScore,
      aiScore: this.aiScore,
    };
  }

  scorePoint(isPlayerScore) {
    if (this.gameOver) return;

    if (isPlayerScore) {
      this.playerScore++;
    } else {
      this.aiScore++;
    }

    // Check for score-based game over (only if not in timed mode or if max score is reached)
    if (
      this.gameMode === "score" ||
      this.playerScore >= this.maxScore ||
      this.aiScore >= this.maxScore
    ) {
      if (this.playerScore >= this.maxScore) {
        this.gameOver = true;
        this.winner = "player";
        this.stop();
      } else if (this.aiScore >= this.maxScore) {
        this.gameOver = true;
        this.winner = "ai";
        this.stop();
      }
    }

    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.playerScore, this.aiScore);
    }

    return {
      playerScore: this.playerScore,
      aiScore: this.aiScore,
      gameOver: this.gameOver,
      winner: this.winner,
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
      ai: this.aiScore,
    };
  }

  getGameState() {
    return {
      running: this.running,
      paused: this.paused,
      gameOver: this.gameOver,
      winner: this.winner,
      score: this.getScore(),
      maxScore: this.maxScore,
    };
  }

  setMaxScore(score) {
    this.maxScore = score;
  }

  setAnimationId(id) {
    this.animationId = id;
  }

  // Timer management methods
  setGameMode(mode) {
    this.gameMode = mode; // 'timed' or 'score'
  }

  setGameDuration(seconds) {
    this.gameDuration = seconds;
    this.timeRemaining = seconds;
  }

  enableTimer(enabled = true) {
    this.timerEnabled = enabled;
  }

  getTimeRemaining() {
    return this.timeRemaining;
  }

  getFormattedTime() {
    const totalSeconds = Math.max(0, Math.floor(this.timeRemaining / 1000)); // Convert ms to seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  isTimedMode() {
    return this.gameMode === "timed" && this.timerEnabled;
  }

  pause() {
    const wasPaused = this.paused;
    this.paused = !this.paused;

    // Update last update time when resuming to prevent time jump
    if (wasPaused && !this.paused) {
      this.lastUpdateTime = Date.now();
    }

    return this.paused;
  }
}
