// Paddle class module
export class Paddle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 5;
    this.dy = 0;
  }

  update(gameHeight) {
    this.y += this.dy;

    // Keep paddle within canvas bounds
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y + this.height > gameHeight) {
      this.y = gameHeight - this.height;
    }
  }

  draw(ctx) {
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

  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }
}