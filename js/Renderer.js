// Renderer module for drawing operations and visual effects
export class Renderer {
  constructor(canvas, particleSystem, gameJuice = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.particleSystem = particleSystem;
    this.gameJuice = gameJuice;

    // Visual settings
    this.backgroundColor = 'rgba(0, 8, 20, 0.2)';
    this.centerLineColor = '#7877c6';
    this.centerLineWidth = 3;
    this.centerLineDash = [10, 5];

    // Animation properties
    this.time = 0;
    this.glowIntensity = 0.5;
  }

  clear() {
    // Create a trailing effect instead of full clear
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw animated background grid
    this.drawBackgroundGrid();
  }

  drawBackgroundGrid() {
    this.ctx.save();
    this.ctx.strokeStyle = `rgba(120, 119, 198, ${0.1 + Math.sin(this.time * 0.01) * 0.05})`;
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([2, 8]);

    // Vertical lines
    for (let x = 50; x < this.width; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 50; y < this.height; y += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    this.ctx.setLineDash([]);
    this.ctx.restore();
  }

  drawCenterLine() {
    this.ctx.save();

    // Animated glow effect
    const glowOffset = Math.sin(this.time * 0.02) * 2;
    this.ctx.strokeStyle = this.centerLineColor;
    this.ctx.lineWidth = this.centerLineWidth;
    this.ctx.shadowBlur = 15 + glowOffset;
    this.ctx.shadowColor = this.centerLineColor;
    this.ctx.setLineDash(this.centerLineDash);

    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width / 2, this.height);
    this.ctx.stroke();

    this.ctx.setLineDash([]);
    this.ctx.restore();
  }

  drawGameObjects(leftPaddle, rightPaddle, ball) {
    this.ctx.save();

    // Draw paddles with glow
    this.drawPaddleWithGlow(leftPaddle);
    this.drawPaddleWithGlow(rightPaddle);

    // Draw ball with enhanced effects
    this.drawBallWithEffects(ball);

    this.ctx.restore();
  }

  drawPaddleWithGlow(paddle) {
    this.ctx.save();

    // Glow effect
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = '#4ecdc4';
    this.ctx.fillStyle = '#ffffff';

    // Main paddle
    this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Inner glow
    const gradient = this.ctx.createLinearGradient(
      paddle.x, paddle.y,
      paddle.x + paddle.width, paddle.y + paddle.height
    );
    gradient.addColorStop(0, 'rgba(78, 205, 196, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(78, 205, 196, 0.8)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    this.ctx.restore();
  }

  drawBallWithEffects(ball) {
    this.ctx.save();

    // Outer glow
    this.ctx.shadowBlur = 25;
    this.ctx.shadowColor = '#ff77c6';

    // Ball gradient
    const gradient = this.ctx.createRadialGradient(
      ball.x, ball.y, 0,
      ball.x, ball.y, ball.radius
    );
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.7, '#ff77c6');
    gradient.addColorStop(1, 'rgba(255, 119, 198, 0.3)');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Inner core
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(ball.x, ball.y, ball.radius * 0.4, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
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

  drawInitialState(leftPaddle, rightPaddle, ball) {
    this.clear();
    this.drawCenterLine();
    this.drawGameObjects(leftPaddle, rightPaddle, ball);
  }

  render(gameState, leftPaddle, rightPaddle, ball) {
    this.time++;

    this.clear();
    this.drawCenterLine();
    this.drawGameObjects(leftPaddle, rightPaddle, ball);

    // Draw particles
    if (this.particleSystem) {
      this.particleSystem.draw(this.ctx);
    }

    // Draw game juice effects
    if (this.gameJuice) {
      this.gameJuice.draw(this.ctx);
    }

    if (gameState.gameOver) {
      this.drawGameOverMessage(gameState.winner);
    } else if (gameState.paused) {
      this.drawPausedMessage();
    }
  }  // Utility methods for custom drawing
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