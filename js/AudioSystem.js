// Audio system for indie game sound effects
export class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3;
    this.enabled = true;

    // Initialize Web Audio API
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.enabled = false;
    }
  }

  // Create a simple tone generator
  createOscillator(frequency, type = 'sine', duration = 0.1) {
    if (!this.enabled || !this.audioContext) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    return { oscillator, gainNode, duration };
  }

  // Paddle hit sound
  playPaddleHit() {
    if (!this.enabled) return;

    const sound = this.createOscillator(440, 'square', 0.1);
    if (sound) {
      sound.oscillator.start();
      sound.oscillator.stop(this.audioContext.currentTime + sound.duration);

      // Add a second harmonic for richness
      const harmonic = this.createOscillator(660, 'sine', 0.08);
      if (harmonic) {
        harmonic.gainNode.gain.setValueAtTime(this.masterVolume * 0.15, this.audioContext.currentTime);
        harmonic.oscillator.start();
        harmonic.oscillator.stop(this.audioContext.currentTime + harmonic.duration);
      }
    }
  }

  // Wall bounce sound
  playWallBounce() {
    if (!this.enabled) return;

    const sound = this.createOscillator(330, 'triangle', 0.15);
    if (sound) {
      // Pitch bend for more interesting sound
      sound.oscillator.frequency.setValueAtTime(330, this.audioContext.currentTime);
      sound.oscillator.frequency.linearRampToValueAtTime(220, this.audioContext.currentTime + 0.1);

      sound.oscillator.start();
      sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
    }
  }

  // Score sound
  playScore(isPlayer = true) {
    if (!this.enabled) return;

    const baseFreq = isPlayer ? 523 : 392; // C5 for player, G4 for AI
    const frequencies = [baseFreq, baseFreq * 1.25, baseFreq * 1.5]; // Major chord

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const sound = this.createOscillator(freq, 'sine', 0.3);
        if (sound) {
          sound.oscillator.start();
          sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
        }
      }, index * 100);
    });
  }

  // Game start sound
  playGameStart() {
    if (!this.enabled) return;

    const frequencies = [262, 330, 392, 523]; // C major arpeggio
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const sound = this.createOscillator(freq, 'sine', 0.2);
        if (sound) {
          sound.oscillator.start();
          sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
        }
      }, index * 150);
    });
  }

  // Game over sound
  playGameOver() {
    if (!this.enabled) return;

    const frequencies = [523, 494, 466, 440, 415, 392]; // Descending sequence
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const sound = this.createOscillator(freq, 'sawtooth', 0.4);
        if (sound) {
          sound.oscillator.start();
          sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
        }
      }, index * 200);
    });
  }

  // Menu navigation sound
  playMenuSelect() {
    if (!this.enabled) return;

    const sound = this.createOscillator(800, 'sine', 0.1);
    if (sound) {
      sound.oscillator.start();
      sound.oscillator.stop(this.audioContext.currentTime + sound.duration);
    }
  }

  // Create ambient background drone
  createAmbientDrone() {
    if (!this.enabled || !this.audioContext) return null;

    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator1.frequency.setValueAtTime(55, this.audioContext.currentTime); // Low A
    oscillator2.frequency.setValueAtTime(82.5, this.audioContext.currentTime); // Low E

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.05, this.audioContext.currentTime + 2);

    return { oscillator1, oscillator2, gainNode };
  }

  // Resume audio context (required for some browsers)
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Volume control
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  // Toggle audio
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Check if audio is enabled
  isEnabled() {
    return this.enabled && this.audioContext;
  }
}