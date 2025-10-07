// Input module for keyboard controls and event handling
export class InputManager {
  constructor() {
    this.keys = {};
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      // Prevent default behavior for game keys to avoid scrolling
      if (['ArrowUp', 'ArrowDown', 'w', 'W', 's', 'S', ' '].includes(e.key)) {
        e.preventDefault();
      }
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // Handle window blur to stop movement when window loses focus
    window.addEventListener('blur', () => {
      this.keys = {};
    });
  }

  isKeyPressed(key) {
    return !!this.keys[key];
  }

  isUpPressed() {
    return this.isKeyPressed('ArrowUp') ||
      this.isKeyPressed('w') ||
      this.isKeyPressed('W');
  }

  isDownPressed() {
    return this.isKeyPressed('ArrowDown') ||
      this.isKeyPressed('s') ||
      this.isKeyPressed('S');
  }

  isPausePressed() {
    return this.isKeyPressed(' ') || this.isKeyPressed('Escape');
  }

  handlePaddleMovement(paddle) {
    if (this.isUpPressed()) {
      paddle.moveUp();
    } else if (this.isDownPressed()) {
      paddle.moveDown();
    } else {
      paddle.stop();
    }
  }

  // Clear all keys (useful for pausing or resetting)
  clearKeys() {
    this.keys = {};
  }

  // Get current input state for debugging
  getInputState() {
    return {
      up: this.isUpPressed(),
      down: this.isDownPressed(),
      pause: this.isPausePressed(),
      activeKeys: Object.keys(this.keys).filter(key => this.keys[key])
    };
  }
}