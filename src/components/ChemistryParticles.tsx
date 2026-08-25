import { useEffect, useRef } from 'react';

export default function ChemistryParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Particle class representing atoms or atomic nodes
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      symbol: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Moderate speeds
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 4 + 2;
        
        // Chemistry-themed text symbols (H, O, N, C, Benzene hexagonal hints)
        const symbols = ['H', 'O', 'N', 'C', 'Na', 'Cl', 'Fe', '🧪', '⚛️'];
        this.symbol = Math.random() > 0.7 ? symbols[Math.floor(Math.random() * symbols.length)] : '';
        
        // Colors corresponding to standard Chemistry CPK coloring
        const colors = [
          'rgba(59, 130, 246, 0.25)',  // Hydrogen/Blue
          'rgba(239, 68, 68, 0.2)',    // Oxygen/Red
          'rgba(249, 115, 22, 0.25)',  // Carbon/Orange
          'rgba(168, 85, 247, 0.2)'    // Nitrogen/Purple
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();

        if (this.symbol) {
          c.fillStyle = 'rgba(100, 116, 139, 0.4)';
          c.font = '10px monospace';
          c.fillText(this.symbol, this.x + 8, this.y + 4);
        }
      }
    }

    const particles: Particle[] = Array.from({ length: 45 }, () => new Particle());

    const drawBonds = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect particles within a certain distance (chemical bonds)
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 120) * 0.12;
            ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      drawBonds();

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 dark:opacity-85"
      style={{ mixBlendMode: 'normal' }}
      id="chemistry-canvas-particles"
    />
  );
}
