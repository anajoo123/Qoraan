'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  phase: number;
  depth: 'far' | 'mid' | 'bokeh';
}

interface AtmosphericParticlesProps {
  energyRef: React.MutableRefObject<number>;
  tint: string;
  rayColor: string;
  active: boolean;
}

export default function AtmosphericParticles({
  energyRef,
  tint,
  rayColor,
  active,
}: AtmosphericParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tintRef = useRef(tint);

  useEffect(() => {
    tintRef.current = tint;
  }, [tint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const initParticles = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = width < 768;
      const farCount = isMobile ? 22 : 34;
      const midCount = isMobile ? 32 : 52;
      const bokehCount = isMobile ? 8 : 13;

      const farParticles: Particle[] = Array.from({ length: farCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.35) * 0.18,
        vy: -(0.08 + Math.random() * 0.22),
        radius: 0.8 + Math.random() * 1.1,
        baseAlpha: 0.25 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        depth: 'far',
      }));

      const midParticles: Particle[] = Array.from({ length: midCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0.12 + (Math.random() - 0.3) * 0.35,
        vy: -(0.22 + Math.random() * 0.45),
        radius: 1.6 + Math.random() * 2.4,
        baseAlpha: 0.32 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        depth: 'mid',
      }));

      const bokehParticles: Particle[] = Array.from(
        { length: bokehCount },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0.25 + (Math.random() - 0.2) * 0.45,
          vy: -(0.35 + Math.random() * 0.55),
          radius: 9 + Math.random() * 16,
          baseAlpha: 0.10 + Math.random() * 0.16,
          phase: Math.random() * Math.PI * 2,
          depth: 'bokeh',
        })
      );

      particles = [...farParticles, ...midParticles, ...bokehParticles];
    };

    initParticles();
    window.addEventListener('resize', initParticles, { passive: true });

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 2.5);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const vocalEnergy = energyRef.current;
      const speedBoost = 1 + vocalEnergy * 1.65;
      const glowScale = 1 + vocalEnergy * 0.45;
      const baseColor = tintRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += (p.depth === 'bokeh' ? 0.01 : 0.022) * dt;

        const sway =
          Math.sin(p.phase) * (p.depth === 'bokeh' ? 0.38 : 0.24);
        p.x += (p.vx + sway) * dt * speedBoost;
        p.y += p.vy * dt * speedBoost;

        if (p.y < -30) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        const twinkle = 0.65 + 0.35 * Math.sin(p.phase * 1.6);
        const alpha = Math.min(
          0.95,
          p.baseAlpha * twinkle * (0.8 + vocalEnergy * 0.9)
        );
        const r = p.radius * glowScale;

        if (p.depth === 'bokeh') {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          grad.addColorStop(
            0,
            baseColor.replace(/[\d.]+\)$/, `${(alpha * 0.9).toFixed(3)})`)
          );
          grad.addColorStop(
            0.45,
            baseColor.replace(/[\d.]+\)$/, `${(alpha * 0.42).toFixed(3)})`)
          );
          grad.addColorStop(1, baseColor.replace(/[\d.]+\)$/, '0)'));
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        } else if (p.depth === 'mid') {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.1);
          grad.addColorStop(
            0,
            baseColor.replace(/[\d.]+\)$/, `${alpha.toFixed(3)})`)
          );
          grad.addColorStop(1, baseColor.replace(/[\d.]+\)$/, '0)'));
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 2.1, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = baseColor.replace(
            /[\d.]+\)$/,
            `${alpha.toFixed(3)})`
          );
          ctx.fill();
        }
      }

      if (active) {
        animationId = requestAnimationFrame(render);
      }
    };

    if (active) {
      animationId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', initParticles);
    };
  }, [active, energyRef]);

  return (
    <>
      {/* Volumetric Sunbeam / Light Shaft Overlay for cinema depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden mix-blend-screen"
      >
        <div
          className="volumetric-rays absolute -top-[25%] -right-[15%] h-[150%] w-[75%] opacity-70"
          style={{
            background: `linear-gradient(125deg, transparent 15%, ${rayColor} 42%, transparent 68%)`,
            filter: 'blur(26px)',
          }}
        />
        <div
          className="foreground-haze absolute inset-x-[-10%] bottom-0 h-[55%] opacity-40"
          style={{
            background: `radial-gradient(ellipse 65% 55% at 50% 85%, ${rayColor}, transparent 75%)`,
            filter: 'blur(32px)',
          }}
        />
      </div>

      {/* Multi-depth floating dust, light motes & out-of-focus foreground bokeh */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[12]"
      />
    </>
  );
}
