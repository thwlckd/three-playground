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

interface Props {
  src: string;
}

const Pixelation = ({ src }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  const pixelSize = 10;
  const gap = 1;
  const scale = 1; // 이미지 확대 배율

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas.parentElement.getBoundingClientRect();
    console.log(width, height);
    const cw = width;
    const ch = height;
    canvas.width = cw;
    canvas.height = ch;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = src;

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
            const angle = Math.random() * Math.PI * 2;
            const force = ((radius - dist) / radius) * 5;
            const randomPush = force * (1 + Math.random() * 2);

            p.dx += Math.cos(angle) * randomPush;
            p.dy += Math.sin(angle) * randomPush;
          }

          p.dx += (p.x - p.tx) * 0.05;
          p.dy += (p.y - p.ty) * 0.05;

          p.dx *= 0.9;
          p.dy *= 0.9;

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
  }, [src]);

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

  return <canvas ref={canvasRef} />;
};

export default Pixelation;

// 'use client';

// import { useEffect, useRef } from 'react';

// type Particle = {
//   x: number;
//   y: number;
//   tx: number;
//   ty: number;
//   dx: number;
//   dy: number;
//   color: string;
// };

// interface Props {
//   src: string;
// }

// const Pixelation = ({ src }: Props) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const mouse = useRef({ x: -9999, y: -9999 });
//   const particlesRef = useRef<Particle[]>([]);
//   const animationRef = useRef<number | null>(null);

//   const pixelSize = 10;
//   const gap = 1;
//   const scale = 1; // 이미지 확대 배율

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || !canvas.parentElement) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const { width, height } = canvas.parentElement.getBoundingClientRect();
//     console.log(width, height);
//     const cw = width;
//     const ch = height;
//     canvas.width = cw;
//     canvas.height = ch;

//     const image = new Image();
//     image.crossOrigin = 'anonymous';
//     image.src = src;

//     image.onload = () => {
//       const iw = image.width * scale;
//       const ih = image.height * scale;
//       const dx = (cw - iw) / 2;
//       const dy = (ch - ih) / 2;

//       // draw image offscreen
//       const offCanvas = document.createElement('canvas');
//       offCanvas.width = iw;
//       offCanvas.height = ih;
//       const offCtx = offCanvas.getContext('2d');
//       if (!offCtx) return;
//       offCtx.drawImage(image, 0, 0, iw, ih);

//       const particles: Particle[] = [];

//       for (let y = 0; y < ih; y += pixelSize) {
//         for (let x = 0; x < iw; x += pixelSize) {
//           const imageData = offCtx.getImageData(x, y, pixelSize, pixelSize);
//           const data = imageData.data;

//           let r = 0,
//             g = 0,
//             b = 0,
//             count = 0;

//           for (let i = 0; i < data.length; i += 4) {
//             const alpha = data[i + 3];
//             if (alpha < 10) continue;

//             r += data[i];
//             g += data[i + 1];
//             b += data[i + 2];
//             count++;
//           }

//           if (count === 0) continue;

//           r = r / count;
//           g = g / count;
//           b = b / count;

//           const px = x + dx;
//           const py = y + dy;

//           particles.push({
//             x: px,
//             y: py,
//             tx: px,
//             ty: py,
//             dx: 0,
//             dy: 0,
//             color: `rgb(${r}, ${g}, ${b})`,
//           });
//         }
//       }

//       particlesRef.current = particles;

//       const animate = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         const radius = 30;

//         for (const p of particlesRef.current) {
//           const dx = p.tx - mouse.current.x;
//           const dy = p.ty - mouse.current.y;
//           const dist = Math.sqrt(dx * dx + dy * dy);

//           if (dist < radius) {
//             const angle = Math.random() * Math.PI * 2;
//             const force = ((radius - dist) / radius) * 5;
//             const randomPush = force * (1 + Math.random() * 2);

//             p.dx += Math.cos(angle) * randomPush;
//             p.dy += Math.sin(angle) * randomPush;
//           }

//           p.dx += (p.x - p.tx) * 0.05;
//           p.dy += (p.y - p.ty) * 0.05;

//           p.dx *= 0.9;
//           p.dy *= 0.9;

//           p.tx += p.dx;
//           p.ty += p.dy;

//           ctx.fillStyle = p.color;
//           const offset = (pixelSize - gap) / 2;
//           ctx.beginPath();
//           ctx.arc(p.tx + offset, p.ty + offset, (pixelSize - gap) / 2, 0, Math.PI * 2);
//           ctx.fill();
//         }

//         animationRef.current = requestAnimationFrame(animate);
//       };

//       animate();
//     };

//     return () => {
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [src]);

//   useEffect(() => {
//     const handleMove = (e: MouseEvent) => {
//       const rect = canvasRef.current?.getBoundingClientRect();
//       if (!rect) return;
//       mouse.current.x = e.clientX - rect.left;
//       mouse.current.y = e.clientY - rect.top;
//     };
//     window.addEventListener('mousemove', handleMove);
//     return () => window.removeEventListener('mousemove', handleMove);
//   }, []);

//   return <canvas ref={canvasRef} />;
// };

// export default Pixelation;

// 'use client';

// import { useEffect, useRef } from 'react';

// type Particle = {
//   x: number;
//   y: number;
//   tx: number;
//   ty: number;
//   dx: number;
//   dy: number;
//   color: string;
// };

// interface Props {
//   src: string;
// }

// const Pixelation = ({ src }: Props) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const mouse = useRef({ x: -9999, y: -9999 });
//   const particlesRef = useRef<Particle[]>([]);
//   const animationRef = useRef<number | null>(null);

//   const pixelSize = 10;
//   const gap = 1;
//   const scale = 1; // 이미지 확대 배율

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || !canvas.parentElement) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const { width, height } = canvas.parentElement.getBoundingClientRect();
//     console.log(width, height);
//     const cw = width;
//     const ch = height;
//     canvas.width = cw;
//     canvas.height = ch;

//     const image = new Image();
//     image.crossOrigin = 'anonymous';
//     image.src = src;

//     image.onload = () => {
//       const iw = image.width * scale;
//       const ih = image.height * scale;
//       const dx = (cw - iw) / 2;
//       const dy = (ch - ih) / 2;

//       // draw image offscreen
//       const offCanvas = document.createElement('canvas');
//       offCanvas.width = iw;
//       offCanvas.height = ih;
//       const offCtx = offCanvas.getContext('2d');
//       if (!offCtx) return;
//       offCtx.drawImage(image, 0, 0, iw, ih);

//       const particles: Particle[] = [];

//       for (let y = 0; y < ih; y += pixelSize) {
//         for (let x = 0; x < iw; x += pixelSize) {
//           const imageData = offCtx.getImageData(x, y, pixelSize, pixelSize);
//           const data = imageData.data;

//           let r = 0,
//             g = 0,
//             b = 0,
//             count = 0;

//           for (let i = 0; i < data.length; i += 4) {
//             const alpha = data[i + 3];
//             if (alpha < 10) continue;

//             r += data[i];
//             g += data[i + 1];
//             b += data[i + 2];
//             count++;
//           }

//           if (count === 0) continue;

//           r = r / count;
//           g = g / count;
//           b = b / count;

//           const px = x + dx;
//           const py = y + dy;

//           particles.push({
//             x: px,
//             y: py,
//             tx: px,
//             ty: py,
//             dx: 0,
//             dy: 0,
//             color: `rgb(${r}, ${g}, ${b})`,
//           });
//         }
//       }

//       particlesRef.current = particles;

//       const animate = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         const radius = 30;

//         for (const p of particlesRef.current) {
//           const dx = p.tx - mouse.current.x;
//           const dy = p.ty - mouse.current.y;
//           const dist = Math.sqrt(dx * dx + dy * dy);

//           if (dist < radius) {
//             const angle = Math.random() * Math.PI * 2;
//             const force = ((radius - dist) / radius) * 5;
//             const randomPush = force * (1 + Math.random() * 2);

//             p.dx += Math.cos(angle) * randomPush;
//             p.dy += Math.sin(angle) * randomPush;
//           }

//           p.dx += (p.x - p.tx) * 0.05;
//           p.dy += (p.y - p.ty) * 0.05;

//           p.dx *= 0.9;
//           p.dy *= 0.9;

//           p.tx += p.dx;
//           p.ty += p.dy;

//           ctx.fillStyle = p.color;
//           const offset = (pixelSize - gap) / 2;
//           ctx.beginPath();
//           ctx.arc(p.tx + offset, p.ty + offset, (pixelSize - gap) / 2, 0, Math.PI * 2);
//           ctx.fill();
//         }

//         animationRef.current = requestAnimationFrame(animate);
//       };

//       animate();
//     };

//     return () => {
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [src]);

//   useEffect(() => {
//     const handleMove = (e: MouseEvent) => {
//       const rect = canvasRef.current?.getBoundingClientRect();
//       if (!rect) return;
//       mouse.current.x = e.clientX - rect.left;
//       mouse.current.y = e.clientY - rect.top;
//     };
//     window.addEventListener('mousemove', handleMove);
//     return () => window.removeEventListener('mousemove', handleMove);
//   }, []);

//   return <canvas ref={canvasRef} />;
// };

// export default Pixelation;

// 'use client';

// import { useEffect, useRef } from 'react';

// type Particle = {
//   x: number;
//   y: number;
//   tx: number;
//   ty: number;
//   dx: number;
//   dy: number;
//   color: string;
// };

// interface Props {
//   src: string;
// }

// const Pixelation = ({ src }: Props) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const mouse = useRef({ x: -9999, y: -9999 });
//   const particlesRef = useRef<Particle[]>([]);
//   const animationRef = useRef<number | null>(null);

//   const pixelSize = 10;
//   const gap = 1;
//   const scale = 1; // 이미지 확대 배율

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || !canvas.parentElement) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const { width, height } = canvas.parentElement.getBoundingClientRect();
//     console.log(width, height);
//     const cw = width;
//     const ch = height;
//     canvas.width = cw;
//     canvas.height = ch;

//     const image = new Image();
//     image.crossOrigin = 'anonymous';
//     image.src = src;

//     image.onload = () => {
//       const iw = image.width * scale;
//       const ih = image.height * scale;
//       const dx = (cw - iw) / 2;
//       const dy = (ch - ih) / 2;

//       // draw image offscreen
//       const offCanvas = document.createElement('canvas');
//       offCanvas.width = iw;
//       offCanvas.height = ih;
//       const offCtx = offCanvas.getContext('2d');
//       if (!offCtx) return;
//       offCtx.drawImage(image, 0, 0, iw, ih);

//       const particles: Particle[] = [];

//       for (let y = 0; y < ih; y += pixelSize) {
//         for (let x = 0; x < iw; x += pixelSize) {
//           const imageData = offCtx.getImageData(x, y, pixelSize, pixelSize);
//           const data = imageData.data;

//           let r = 0,
//             g = 0,
//             b = 0,
//             count = 0;

//           for (let i = 0; i < data.length; i += 4) {
//             const alpha = data[i + 3];
//             if (alpha < 10) continue;

//             r += data[i];
//             g += data[i + 1];
//             b += data[i + 2];
//             count++;
//           }

//           if (count === 0) continue;

//           r = r / count;
//           g = g / count;
//           b = b / count;

//           const px = x + dx;
//           const py = y + dy;

//           particles.push({
//             x: px,
//             y: py,
//             tx: px,
//             ty: py,
//             dx: 0,
//             dy: 0,
//             color: `rgb(${r}, ${g}, ${b})`,
//           });
//         }
//       }

//       particlesRef.current = particles;

//       const animate = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         const radius = 30;

//         for (const p of particlesRef.current) {
//           const dx = p.tx - mouse.current.x;
//           const dy = p.ty - mouse.current.y;
//           const dist = Math.sqrt(dx * dx + dy * dy);

//           if (dist < radius) {
//             const angle = Math.random() * Math.PI * 2;
//             const force = ((radius - dist) / radius) * 5;
//             const randomPush = force * (1 + Math.random() * 2);

//             p.dx += Math.cos(angle) * randomPush;
//             p.dy += Math.sin(angle) * randomPush;
//           }

//           p.dx += (p.x - p.tx) * 0.05;
//           p.dy += (p.y - p.ty) * 0.05;

//           p.dx *= 0.9;
//           p.dy *= 0.9;

//           p.tx += p.dx;
//           p.ty += p.dy;

//           ctx.fillStyle = p.color;
//           const offset = (pixelSize - gap) / 2;
//           ctx.beginPath();
//           ctx.arc(p.tx + offset, p.ty + offset, (pixelSize - gap) / 2, 0, Math.PI * 2);
//           ctx.fill();
//         }

//         animationRef.current = requestAnimationFrame(animate);
//       };

//       animate();
//     };

//     return () => {
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [src]);

//   useEffect(() => {
//     const handleMove = (e: MouseEvent) => {
//       const rect = canvasRef.current?.getBoundingClientRect();
//       if (!rect) return;
//       mouse.current.x = e.clientX - rect.left;
//       mouse.current.y = e.clientY - rect.top;
//     };
//     window.addEventListener('mousemove', handleMove);
//     return () => window.removeEventListener('mousemove', handleMove);
//   }, []);

//   return <canvas ref={canvasRef} />;
// };

// export default Pixelation;

// 'use client';

// import { useEffect, useRef } from 'react';

// type Particle = {
//   x: number;
//   y: number;
//   tx: number;
//   ty: number;
//   dx: number;
//   dy: number;
//   color: string;
// };

// interface Props {
//   src: string;
// }

// const Pixelation = ({ src }: Props) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const mouse = useRef({ x: -9999, y: -9999 });
//   const particlesRef = useRef<Particle[]>([]);
//   const animationRef = useRef<number | null>(null);

//   const pixelSize = 10;
//   const gap = 1;
//   const scale = 1; // 이미지 확대 배율

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || !canvas.parentElement) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const { width, height } = canvas.parentElement.getBoundingClientRect();
//     console.log(width, height);
//     const cw = width;
//     const ch = height;
//     canvas.width = cw;
//     canvas.height = ch;

//     const image = new Image();
//     image.crossOrigin = 'anonymous';
//     image.src = src;

//     image.onload = () => {
//       const iw = image.width * scale;
//       const ih = image.height * scale;
//       const dx = (cw - iw) / 2;
//       const dy = (ch - ih) / 2;

//       // draw image offscreen
//       const offCanvas = document.createElement('canvas');
//       offCanvas.width = iw;
//       offCanvas.height = ih;
//       const offCtx = offCanvas.getContext('2d');
//       if (!offCtx) return;
//       offCtx.drawImage(image, 0, 0, iw, ih);

//       const particles: Particle[] = [];

//       for (let y = 0; y < ih; y += pixelSize) {
//         for (let x = 0; x < iw; x += pixelSize) {
//           const imageData = offCtx.getImageData(x, y, pixelSize, pixelSize);
//           const data = imageData.data;

//           let r = 0,
//             g = 0,
//             b = 0,
//             count = 0;

//           for (let i = 0; i < data.length; i += 4) {
//             const alpha = data[i + 3];
//             if (alpha < 10) continue;

//             r += data[i];
//             g += data[i + 1];
//             b += data[i + 2];
//             count++;
//           }

//           if (count === 0) continue;

//           r = r / count;
//           g = g / count;
//           b = b / count;

//           const px = x + dx;
//           const py = y + dy;

//           particles.push({
//             x: px,
//             y: py,
//             tx: px,
//             ty: py,
//             dx: 0,
//             dy: 0,
//             color: `rgb(${r}, ${g}, ${b})`,
//           });
//         }
//       }

//       particlesRef.current = particles;

//       const animate = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         const radius = 30;

//         for (const p of particlesRef.current) {
//           const dx = p.tx - mouse.current.x;
//           const dy = p.ty - mouse.current.y;
//           const dist = Math.sqrt(dx * dx + dy * dy);

//           if (dist < radius) {
//             const angle = Math.random() * Math.PI * 2;
//             const force = ((radius - dist) / radius) * 5;
//             const randomPush = force * (1 + Math.random() * 2);

//             p.dx += Math.cos(angle) * randomPush;
//             p.dy += Math.sin(angle) * randomPush;
//           }

//           p.dx += (p.x - p.tx) * 0.05;
//           p.dy += (p.y - p.ty) * 0.05;

//           p.dx *= 0.9;
//           p.dy *= 0.9;

//           p.tx += p.dx;
//           p.ty += p.dy;

//           ctx.fillStyle = p.color;
//           const offset = (pixelSize - gap) / 2;
//           ctx.beginPath();
//           ctx.arc(p.tx + offset, p.ty + offset, (pixelSize - gap) / 2, 0, Math.PI * 2);
//           ctx.fill();
//         }

//         animationRef.current = requestAnimationFrame(animate);
//       };

//       animate();
//     };

//     return () => {
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [src]);

//   useEffect(() => {
//     const handleMove = (e: MouseEvent) => {
//       const rect = canvasRef.current?.getBoundingClientRect();
//       if (!rect) return;
//       mouse.current.x = e.clientX - rect.left;
//       mouse.current.y = e.clientY - rect.top;
//     };
//     window.addEventListener('mousemove', handleMove);
//     return () => window.removeEventListener('mousemove', handleMove);
//   }, []);

//   return <canvas ref={canvasRef} />;
// };

// export default Pixelation;

// const vertexShaderSrc = `
// attribute vec2 a_position;
// attribute vec2 a_offset;
// attribute vec3 a_color;

// uniform vec2 u_resolution;
// uniform vec2 u_mouse;
// uniform float u_time;

// varying vec3 v_color;

// void main() {
//   vec2 pos = a_position + a_offset;

//   // 마우스 거리 계산
//   float dist = distance(u_mouse, pos);
//   float strength = clamp(1.0 - dist / 100.0, 0.0, 1.0);

//   // 퍼뜨리는 효과
//   float angle = atan(pos.y - u_mouse.y, pos.x - u_mouse.x);
//   float force = strength * 30.0;
//   pos += vec2(cos(angle), sin(angle)) * force * sin(u_time + dist * 0.01);

//   // 화면 비율 맞추기
//   vec2 zeroToOne = pos / u_resolution;
//   vec2 clipSpace = zeroToOne * 2.0 - 1.0;

//   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
//   gl_PointSize = 3.0;

//   v_color = a_color;
// }
// `;

// const fragmentShaderSrc = `
// precision mediump float;
// varying vec3 v_color;

// void main() {
//   float dist = distance(gl_PointCoord, vec2(0.5));
//   if (dist > 0.5) discard;

//   gl_FragColor = vec4(v_color, 1.0);
// }
// `;

// function createShader(gl: WebGLRenderingContext, type: number, source: string) {
//   const shader = gl.createShader(type)!;
//   gl.shaderSource(shader, source);
//   gl.compileShader(shader);
//   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//     console.error(gl.getShaderInfoLog(shader));
//     gl.deleteShader(shader);
//     return null;
//   }
//   return shader;
// }

// function createProgram(gl: WebGLRenderingContext, vShader: WebGLShader, fShader: WebGLShader) {
//   const program = gl.createProgram()!;
//   gl.attachShader(program, vShader);
//   gl.attachShader(program, fShader);
//   gl.linkProgram(program);
//   if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//     console.error(gl.getProgramInfoLog(program));
//     gl.deleteProgram(program);
//     return null;
//   }
//   return program;
// }

// interface Props {
//   src: string;
// }

// const PixelParticlesWebGL = ({ src }: Props) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const mouse = useRef<[number, number]>([-9999, -9999]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas || !canvas.parentElement) return;

//     const gl = canvas.getContext('webgl');
//     if (!gl) return;

//     const { width, height } = canvas.parentElement.getBoundingClientRect();
//     canvas.width = width;
//     canvas.height = height;

//     const vShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc)!;
//     const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc)!;
//     const program = createProgram(gl, vShader, fShader)!;
//     gl.useProgram(program);

//     const positionLoc = gl.getAttribLocation(program, 'a_position');
//     const offsetLoc = gl.getAttribLocation(program, 'a_offset');
//     const colorLoc = gl.getAttribLocation(program, 'a_color');
//     const uResLoc = gl.getUniformLocation(program, 'u_resolution');
//     const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
//     const uTimeLoc = gl.getUniformLocation(program, 'u_time');

//     const image = new Image();
//     image.crossOrigin = 'anonymous';
//     image.src = src;

//     image.onload = () => {
//       const scale = 2;
//       const iw = image.width * scale;
//       const ih = image.height * scale;
//       const dx = (width - iw) / 2;
//       const dy = (height - ih) / 2;

//       const off = document.createElement('canvas');
//       off.width = iw;
//       off.height = ih;
//       const ctx = off.getContext('2d')!;
//       ctx.drawImage(image, 0, 0, iw, ih);
//       const imgData = ctx.getImageData(0, 0, iw, ih).data;

//       const positions: number[] = [];
//       const offsets: number[] = [];
//       const colors: number[] = [];

//       const pixelSize = 5;
//       for (let y = 0; y < ih; y += pixelSize) {
//         for (let x = 0; x < iw; x += pixelSize) {
//           const i = (y * iw + x) * 4;
//           const a = imgData[i + 3];
//           if (a < 10) continue;

//           const r = imgData[i] / 255;
//           const g = imgData[i + 1] / 255;
//           const b = imgData[i + 2] / 255;

//           positions.push(0, 0);
//           offsets.push(x + dx, y + dy);
//           colors.push(r, g, b);
//         }
//       }

//       const posBuffer = gl.createBuffer();
//       gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
//       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
//       gl.enableVertexAttribArray(positionLoc);
//       gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

//       const offsetBuffer = gl.createBuffer();
//       gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
//       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(offsets), gl.STATIC_DRAW);
//       gl.enableVertexAttribArray(offsetLoc);
//       gl.vertexAttribPointer(offsetLoc, 2, gl.FLOAT, false, 0, 0);

//       const colorBuffer = gl.createBuffer();
//       gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
//       gl.enableVertexAttribArray(colorLoc);
//       gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

//       const start = performance.now();
//       const render = (time: number) => {
//         const elapsed = (time - start) * 0.001;
//         gl.viewport(0, 0, canvas.width, canvas.height);
//         gl.clear(gl.COLOR_BUFFER_BIT);

//         gl.uniform2f(uResLoc, canvas.width, canvas.height);
//         gl.uniform2f(uMouseLoc, mouse.current[0], mouse.current[1]);
//         gl.uniform1f(uTimeLoc, elapsed);

//         gl.drawArrays(gl.POINTS, 0, positions.length / 2);
//         requestAnimationFrame(render);
//       };
//       requestAnimationFrame(render);
//     };

//     const move = (e: MouseEvent) => {
//       const rect = canvas.getBoundingClientRect();
//       mouse.current = [e.clientX - rect.left, e.clientY - rect.top];
//     };

//     window.addEventListener('mousemove', move);
//     return () => window.removeEventListener('mousemove', move);
//   }, [src]);

//   return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
// };

// export default PixelParticlesWebGL;
