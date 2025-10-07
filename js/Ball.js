// Ball class module
export class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = 4;
    this.dx = this.speed;
    this.dy = this.speed;
    this.maxSpeed = 8;
    this.initialSpeed = 4;
  }

  update(gameWidth, gameHeight) {
    this.x += this.dx;
    this.y += this.dy;

    // Ball collision with top and bottom walls
    if (this.y - this.radius <= 0 || this.y + this.radius >= gameHeight) {
      this.dy = -this.dy;
    }

    return {
      outOfBounds: this.x < -this.radius || this.x > gameWidth + this.radius,
      scoredLeft: this.x < -this.radius,
      scoredRight: this.x > gameWidth + this.radius
    };
  }

  checkPaddleCollision(paddle) {
    const ballBounds = this.getBounds();
    const paddleBounds = paddle.getBounds();

    if (ballBounds.left <= paddleBounds.right &&
      ballBounds.right >= paddleBounds.left &&
      ballBounds.top <= paddleBounds.bottom &&
      ballBounds.bottom >= paddleBounds.top) {

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
      if (this.dx > 0) {
        // Ball moving right, hit left paddle
        this.x = paddleBounds.right + this.radius;
      } else {
        // Ball moving left, hit right paddle
        this.x = paddleBounds.left - this.radius;
      }

      return true; // Collision occurred
    }

    return false; // No collision
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  reset(gameWidth, gameHeight) {
    this.x = gameWidth / 2;
    this.y = gameHeight / 2;
    this.dx = Math.random() > 0.5 ? this.initialSpeed : -this.initialSpeed;
    this.dy = Math.random() > 0.5 ? this.initialSpeed : -this.initialSpeed;
  }

  getBounds() {
    return {
      left: this.x - this.radius,
      right: this.x + this.radius,
      top: this.y - this.radius,
      bottom: this.y + this.radius
    };
  }
}