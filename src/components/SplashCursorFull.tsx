'use client';
import { useEffect, useRef } from 'react';

interface SplashCursorProps {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: { r: number; g: number; b: number };
  TRANSPARENT?: boolean;
}

function SplashCursorFull({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0.5, g: 0, b: 0 },
  TRANSPARENT = true,
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Simplified fluid animation for now
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{x: number, y: number, vx: number, vy: number, alpha: number}> = [];
    let animationId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const addParticle = (x: number, y: number) => {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          alpha: 1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha *= 0.98;
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        if (particle.alpha > 0.01) {
          const hue = (Date.now() * 0.01) % 360;
          ctx.globalAlpha = particle.alpha;
          ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fill();
          return true;
        }
        return false;
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      addParticle(e.clientX, e.clientY);
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 10; i++) {
        addParticle(e.clientX, e.clientY);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 pointer-events-none w-full h-full">
      <canvas 
        ref={canvasRef} 
        id="fluid" 
        className="w-screen h-screen block"
        style={{ background: 'transparent' }}
      />
    </div>
  );
}

export default SplashCursorFull; 