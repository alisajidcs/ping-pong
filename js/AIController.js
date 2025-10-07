// AI module for computer opponent logic
export class AIController {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.speeds = {
      easy: 2,
      medium: 3,
      hard: 4,
      expert: 5
    };
    this.reactionZones = {
      easy: 50,
      medium: 35,
      hard: 25,
      expert: 15
    };
  }

  update(aiPaddle, ball) {
    const aiCenter = aiPaddle.getCenter();
    const ballY = ball.y;
    const aiSpeed = this.speeds[this.difficulty];
    const reactionZone = this.reactionZones[this.difficulty];

    // AI only moves when ball is coming towards it (basic prediction)
    const ballComingToAI = ball.dx > 0;

    if (ballComingToAI) {
      if (aiCenter < ballY - reactionZone) {
        aiPaddle.dy = aiSpeed;
      } else if (aiCenter > ballY + reactionZone) {
        aiPaddle.dy = -aiSpeed;
      } else {
        aiPaddle.dy = 0;
      }
    } else {
      // Return to center when ball is moving away
      const centerY = aiPaddle.y + aiPaddle.height / 2;
      const gameCenter = 200; // Assuming 400px height

      if (centerY < gameCenter - 10) {
        aiPaddle.dy = aiSpeed * 0.3;
      } else if (centerY > gameCenter + 10) {
        aiPaddle.dy = -aiSpeed * 0.3;
      } else {
        aiPaddle.dy = 0;
      }
    }
  }

  setDifficulty(newDifficulty) {
    if (this.speeds[newDifficulty]) {
      this.difficulty = newDifficulty;
    }
  }

  getDifficulty() {
    return this.difficulty;
  }

  getAvailableDifficulties() {
    return Object.keys(this.speeds);
  }
}