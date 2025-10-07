// GameModeManager module for handling different game modes
export class GameModeManager {
  constructor() {
    this.currentMode = 'menu'; // 'menu', 'single', 'multiplayer'
    this.gameType = null; // 'ai' or 'human'
    this.callbacks = {
      onModeChange: null,
      onGameStart: null
    };
  }

  setMode(mode) {
    const validModes = ['menu', 'single', 'multiplayer'];
    if (validModes.includes(mode)) {
      this.currentMode = mode;
      this.gameType = mode === 'single' ? 'ai' : (mode === 'multiplayer' ? 'human' : null);

      if (this.callbacks.onModeChange) {
        this.callbacks.onModeChange(mode, this.gameType);
      }
    }
  }

  getCurrentMode() {
    return this.currentMode;
  }

  getGameType() {
    return this.gameType;
  }

  isSinglePlayer() {
    return this.currentMode === 'single';
  }

  isMultiplayer() {
    return this.currentMode === 'multiplayer';
  }

  isMenu() {
    return this.currentMode === 'menu';
  }

  startSinglePlayer() {
    this.setMode('single');
    if (this.callbacks.onGameStart) {
      this.callbacks.onGameStart('single');
    }
  }

  startMultiplayer() {
    this.setMode('multiplayer');
    if (this.callbacks.onGameStart) {
      this.callbacks.onGameStart('multiplayer');
    }
  }

  returnToMenu() {
    this.setMode('menu');
  }

  onModeChange(callback) {
    this.callbacks.onModeChange = callback;
  }

  onGameStart(callback) {
    this.callbacks.onGameStart = callback;
  }

  getPlayerLabels() {
    if (this.isSinglePlayer()) {
      return {
        left: 'Player',
        right: 'Computer'
      };
    } else if (this.isMultiplayer()) {
      return {
        left: 'Player 1',
        right: 'Player 2'
      };
    }
    return {
      left: 'Player',
      right: 'Player'
    };
  }

  getControlInstructions() {
    if (this.isSinglePlayer()) {
      return 'Use Arrow Keys or W/S to move your paddle';
    } else if (this.isMultiplayer()) {
      return 'Player 1: W/S Keys | Player 2: Arrow Keys';
    }
    return 'Select a game mode to play';
  }
}