// Particle system for visual effects
export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.maxParticles = 100;
  }

  addParticle(x, y, options = {}) {
    const {
      vx = (Math.random() - 0.5) * 4,
      vy = (Math.random() - 0.5) * 4,
      size = Math.random() * 3 + 1,
      life = 60,
      color = '#ffffff',
      type = 'dot',
      gravity = 0,
      decay = 0.98
    } = options;

    if (this.particles.length >= this.maxParticles) {
      this.particles.shift();
    }

    this.particles.push({
      x,
      y,
      vx,
      vy,
      size,
      life,
      maxLife: life,
      color,
      type,
      gravity,
      decay,
      alpha: 1
    });
  }

  addExplosion(x, y, count = 10, options = {}) {
    const colors = options.colors || ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 3 + 2;

      this.addParticle(x, y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        life: 40 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'spark',
        decay: 0.95
      });
    }
  }

  addTrail(x, y, vx, vy, options = {}) {
    const {
      color = '#4ecdc4',
      count = 3
    } = options;

    for (let i = 0; i < count; i++) {
      this.addParticle(x, y, {
        vx: vx * 0.3 + (Math.random() - 0.5) * 0.5,
        vy: vy * 0.3 + (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        life: 20 + Math.random() * 10,
        color,
        type: 'trail',
        decay: 0.9
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Apply gravity
      particle.vy += particle.gravity;

      // Apply decay
      particle.vx *= particle.decay;
      particle.vy *= particle.decay;

      // Update life
      particle.life--;
      particle.alpha = particle.life / particle.maxLife;

      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();

    for (const particle of this.particles) {
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;

      if (particle.type === 'spark') {
        // Draw spark as a small glowing circle
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (particle.type === 'trail') {
        // Draw trail as a fading dot
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Default dot particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  clear() {
    this.particles = [];
  }

  getParticleCount() {
    return this.particles.length;
  }
}