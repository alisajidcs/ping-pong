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

  // Player 1 controls (W/S keys)
  isPlayer1UpPressed() {
    return this.isKeyPressed('w') || this.isKeyPressed('W');
  }

  isPlayer1DownPressed() {
    return this.isKeyPressed('s') || this.isKeyPressed('S');
  }

  // Player 2 controls (Arrow keys)
  isPlayer2UpPressed() {
    return this.isKeyPressed('ArrowUp');
  }

  isPlayer2DownPressed() {
    return this.isKeyPressed('ArrowDown');
  }

  // Legacy methods for single player (uses both control schemes)
  isUpPressed() {
    return this.isPlayer1UpPressed() || this.isPlayer2UpPressed();
  }

  isDownPressed() {
    return this.isPlayer1DownPressed() || this.isPlayer2DownPressed();
  }

  isPausePressed() {
    return this.isKeyPressed(' ') || this.isKeyPressed('Escape');
  }

  // Handle player 1 paddle movement (left paddle, W/S keys)
  handlePlayer1Movement(paddle) {
    if (this.isPlayer1UpPressed()) {
      paddle.moveUp();
    } else if (this.isPlayer1DownPressed()) {
      paddle.moveDown();
    } else {
      paddle.stop();
    }
  }

  // Handle player 2 paddle movement (right paddle, Arrow keys)
  handlePlayer2Movement(paddle) {
    if (this.isPlayer2UpPressed()) {
      paddle.moveUp();
    } else if (this.isPlayer2DownPressed()) {
      paddle.moveDown();
    } else {
      paddle.stop();
    }
  }

  // Legacy method for single player (uses any control scheme)
  handlePaddleMovement(paddle) {
    if (this.isUpPressed()) {
      paddle.moveUp();
    } else if (this.isDownPressed()) {
      paddle.moveDown();
    } else {
      paddle.stop();
    }
  }  // Clear all keys (useful for pausing or resetting)
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