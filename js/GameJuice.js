// Game juice effects system
export class GameJuice {
  constructor(canvas) {
    this.canvas = canvas;
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
    this.originalTransform = '';

    // Score animation properties
    this.scoreAnimations = [];
  }

  // Screen shake effect
  addScreenShake(intensity = 5, duration = 300) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  // Update screen shake
  updateScreenShake() {
    if (this.shakeTimer > 0) {
      this.shakeTimer -= 16; // Assuming 60fps

      const progress = this.shakeTimer / this.shakeDuration;
      const currentIntensity = this.shakeIntensity * progress;

      const shakeX = (Math.random() - 0.5) * currentIntensity;
      const shakeY = (Math.random() - 0.5) * currentIntensity;

      this.canvas.style.transform = `translate(${shakeX}px, ${shakeY}px)`;

      if (this.shakeTimer <= 0) {
        this.canvas.style.transform = '';
        this.shakeIntensity = 0;
      }
    }
  }

  // Add floating score text
  addScoreAnimation(x, y, points, color = '#ffffff') {
    this.scoreAnimations.push({
      x,
      y,
      points,
      color,
      life: 60,
      maxLife: 60,
      vx: (Math.random() - 0.5) * 2,
      vy: -2
    });
  }

  // Update score animations
  updateScoreAnimations() {
    for (let i = this.scoreAnimations.length - 1; i >= 0; i--) {
      const anim = this.scoreAnimations[i];

      anim.x += anim.vx;
      anim.y += anim.vy;
      anim.vy *= 0.98; // Slow down vertical movement
      anim.life--;

      if (anim.life <= 0) {
        this.scoreAnimations.splice(i, 1);
      }
    }
  }

  // Draw score animations
  drawScoreAnimations(ctx) {
    ctx.save();

    for (const anim of this.scoreAnimations) {
      const alpha = anim.life / anim.maxLife;
      const scale = 1 + (1 - alpha) * 0.5;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = anim.color;
      ctx.font = `bold ${20 * scale}px Orbitron`;
      ctx.textAlign = 'center';
      ctx.shadowBlur = 10;
      ctx.shadowColor = anim.color;

      ctx.fillText(`+${anim.points}`, anim.x, anim.y);
    }

    ctx.restore();
  }

  // Pulse effect for UI elements
  createPulseEffect(element, duration = 200) {
    element.style.transition = `transform ${duration}ms ease-out`;
    element.style.transform = 'scale(1.1)';

    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, duration);
  }

  // Flash effect
  createFlashEffect(color = 'rgba(255, 255, 255, 0.3)', duration = 100) {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: ${color};
      pointer-events: none;
      z-index: 9999;
      opacity: 1;
      transition: opacity ${duration}ms ease-out;
    `;

    document.body.appendChild(flash);

    // Trigger fade out
    requestAnimationFrame(() => {
      flash.style.opacity = '0';
    });

    // Remove element after animation
    setTimeout(() => {
      if (flash.parentNode) {
        flash.parentNode.removeChild(flash);
      }
    }, duration);
  }

  // Update all effects
  update() {
    this.updateScreenShake();
    this.updateScoreAnimations();
  }

  // Draw all effects
  draw(ctx) {
    this.drawScoreAnimations(ctx);
  }

  // Reset all effects
  reset() {
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
    this.scoreAnimations = [];
    this.canvas.style.transform = '';
  }
}