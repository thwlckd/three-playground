'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  dx: number;
  dy: number;
  color: string;
};

const TestPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  const pixelSize = 5;
  const gap = 1;
  const scale = 2; // 이미지 확대 배율

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = window.parent.innerWidth;
    const ch = window.parent.innerHeight;
    canvas.width = cw;
    canvas.height = ch;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = 'https://static.toss.im/app-in-toss/01.png';

    image.onload = () => {
      const iw = image.width * scale;
      const ih = image.height * scale;
      const dx = (cw - iw) / 2;
      const dy = (ch - ih) / 2;

      // draw image offscreen
      const offCanvas = document.createElement('canvas');
      offCanvas.width = iw;
      offCanvas.height = ih;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;
      offCtx.drawImage(image, 0, 0, iw, ih);

      const particles: Particle[] = [];

      for (let y = 0; y < ih; y += pixelSize) {
        for (let x = 0; x < iw; x += pixelSize) {
          const imageData = offCtx.getImageData(x, y, pixelSize, pixelSize);
          const data = imageData.data;

          let r = 0,
            g = 0,
            b = 0,
            count = 0;

          for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha < 10) continue;

            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }

          if (count === 0) continue;

          r = r / count;
          g = g / count;
          b = b / count;

          const px = x + dx;
          const py = y + dy;

          particles.push({
            x: px,
            y: py,
            tx: px,
            ty: py,
            dx: 0,
            dy: 0,
            color: `rgb(${r}, ${g}, ${b})`,
          });
        }
      }

      particlesRef.current = particles;

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const radius = 30;

        for (const p of particlesRef.current) {
          const dx = p.tx - mouse.current.x;
          const dy = p.ty - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius) {
            const angle = Math.atan2(dy, dx);
            const force = (radius - dist) / radius;
            const push = force * 1;

            p.dx += Math.cos(angle) * push;
            p.dy += Math.sin(angle) * push;
          }

          // 복원력
          p.dx += (p.x - p.tx) * 0.1;
          p.dy += (p.y - p.ty) * 0.1;

          // 감속
          p.dx *= 0.85;
          p.dy *= 0.85;

          p.tx += p.dx;
          p.ty += p.dy;

          ctx.fillStyle = p.color;
          const offset = (pixelSize - gap) / 2;
          ctx.beginPath();
          ctx.arc(p.tx + offset, p.ty + offset, (pixelSize - gap) / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animate();
    };

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};

export default TestPage;
