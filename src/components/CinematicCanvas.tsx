import { useEffect, useRef } from 'react';

export function CinematicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Warm organic rose petals drifting lazily
    const petals = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      rx: Math.random() * 4 + 3,
      ry: Math.random() * 6 + 4,
      vy: Math.random() * 0.5 + 0.25,
      vx: (Math.random() - 0.5) * 0.35,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.35 + 0.15,
      // Rose petal natural blush tone
      hue: Math.random() > 0.5 ? 350 : 355,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.rotation += p.vRot;

        if (p.y > height + 15) {
          p.y = -15;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.opacity})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
