// Renderer module for drawing operations and visual effects
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    // Visual settings
    this.backgroundColor = '#000000';
    this.centerLineColor = '#ffffff';
    this.centerLineWidth = 2;
    this.centerLineDash = [5, 5];
  }

  clear() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawCenterLine() {
    this.ctx.strokeStyle = this.centerLineColor;
    this.ctx.lineWidth = this.centerLineWidth;
    this.ctx.setLineDash(this.centerLineDash);
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width / 2, this.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]); // Reset dash
  }

  drawGameObjects(playerPaddle, aiPaddle, ball) {
    // Draw paddles
    playerPaddle.draw(this.ctx);
    aiPaddle.draw(this.ctx);

    // Draw ball
    ball.draw(this.ctx);
  }

  drawGameOverMessage(winner) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const message = winner === 'player' ? 'You Win!' : 'AI Wins!';
    this.ctx.fillText(message, this.width / 2, this.height / 2 - 30);

    this.ctx.font = '24px Arial';
    this.ctx.fillText('Press Reset to play again', this.width / 2, this.height / 2 + 30);
  }

  drawPausedMessage() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('PAUSED', this.width / 2, this.height / 2 - 30);

    this.ctx.font = '24px Arial';
    this.ctx.fillText('Press Resume to continue', this.width / 2, this.height / 2 + 30);
  }

  drawInitialState(playerPaddle, aiPaddle, ball) {
    this.clear();
    this.drawCenterLine();
    this.drawGameObjects(playerPaddle, aiPaddle, ball);
  }

  render(gameState, playerPaddle, aiPaddle, ball) {
    this.clear();
    this.drawCenterLine();
    this.drawGameObjects(playerPaddle, aiPaddle, ball);

    if (gameState.gameOver) {
      this.drawGameOverMessage(gameState.winner);
    } else if (gameState.paused) {
      this.drawPausedMessage();
    }
  }

  // Utility methods for custom drawing
  drawText(text, x, y, options = {}) {
    const {
      font = '16px Arial',
      color = '#ffffff',
      align = 'left',
      baseline = 'top'
    } = options;

    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;
    this.ctx.fillText(text, x, y);
  }

  drawRect(x, y, width, height, color = '#ffffff') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  drawCircle(x, y, radius, color = '#ffffff') {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  setBackgroundColor(color) {
    this.backgroundColor = color;
  }

  setCenterLineStyle(color, width, dash) {
    this.centerLineColor = color;
    this.centerLineWidth = width;
    this.centerLineDash = dash;
  }
}