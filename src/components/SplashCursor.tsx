import { useEffect, useRef } from 'react';

function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      hue: number;
      size: number;
    }> = [];
    let animationId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const addParticle = (x: number, y: number, intensity = 1) => {
      const particleCount = Math.floor(2 * intensity);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 30,
          y: y + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          alpha: 0.8,
          hue: (Date.now() * 0.05 + Math.random() * 60) % 360,
          size: Math.random() * 3 + 1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha *= 0.96;
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        particle.size *= 0.99;

        if (particle.alpha > 0.01) {
          ctx.globalAlpha = particle.alpha;
          
          // Create glowing effect
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 70%, ${particle.alpha})`);
          gradient.addColorStop(0.5, `hsla(${particle.hue}, 70%, 50%, ${particle.alpha * 0.5})`);
          gradient.addColorStop(1, `hsla(${particle.hue}, 60%, 30%, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Inner bright core
          ctx.globalAlpha = particle.alpha * 1.5;
          ctx.fillStyle = `hsla(${particle.hue}, 90%, 85%, ${particle.alpha})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          return true;
        }
        return false;
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      addParticle(e.clientX, e.clientY, 0.5);
    };

    const handleClick = (e: MouseEvent) => {
      addParticle(e.clientX, e.clientY, 3);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        addParticle(touch.clientX, touch.clientY, 0.5);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        addParticle(touch.clientX, touch.clientY, 2);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 pointer-events-none w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="w-screen h-screen block"
        style={{ background: 'transparent' }}
      />
    </div>
  );
}

export default SplashCursor; 