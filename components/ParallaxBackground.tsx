'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBackgroundProps {
  className?: string;
  showGrid?: boolean;
  showOrbs?: boolean;
}

export default function ParallaxBackground({
  className = '',
  showGrid = true,
  showOrbs = true
}: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Parallax transforms at different speeds for depth
  const y1 = useTransform(scrollY, [0, 3000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 3000], [0, -80]);
  const y3 = useTransform(scrollY, [0, 3000], [0, -200]);
  const scale = useTransform(scrollY, [0, 2000], [1, 1.08]);
  const rotate = useTransform(scrollY, [0, 3000], [0, 1]);
  const orbY1 = useTransform(scrollY, [0, 2000], [0, 180]);
  const orbY2 = useTransform(scrollY, [0, 2000], [0, -120]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
    >
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />

      {/* Grid pattern layer with parallax and mouse interaction */}
      {showGrid && (
        <motion.div
          className="absolute inset-0"
          style={{
            y: y1,
            scale,
            rotate,
            x: mousePosition.x * 0.3,
          }}
        >
          {/* SVG Grid Pattern */}
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.4 }}
          >
            <defs>
              <pattern
                id="grid-pattern"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke="rgb(var(--p-300))"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
                {/* Random filled squares for visual interest */}
                <rect x="0" y="0" width="20" height="20" fill="rgb(var(--p-200))" opacity="0.1" />
                <rect x="40" y="40" width="20" height="20" fill="rgb(var(--p-200))" opacity="0.08" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </motion.div>
      )}

      {/* Secondary grid lines layer - different speed */}
      {showGrid && (
        <motion.div
          className="absolute inset-0"
          style={{ y: y2, scale }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(var(--p-200) / 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(var(--p-200) / 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '120px 120px',
            }}
          />
        </motion.div>
      )}

      {/* Gradient fade overlay */}
      <motion.div
        className="absolute inset-0"
        style={{ y: y2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
      </motion.div>

      {/* Floating orbs with blur for depth */}
      {showOrbs && (
        <>
          {/* Top right orb */}
          <motion.div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{
              y: y3,
              x: mousePosition.x * 0.5,
              backgroundColor: 'rgb(var(--p-200) / 0.3)',
            }}
          />

          {/* Middle left orb */}
          <motion.div
            className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{
              y: orbY1,
              x: mousePosition.x * -0.3,
              backgroundColor: 'rgb(var(--p-100) / 0.4)',
            }}
          />

          {/* Bottom center orb */}
          <motion.div
            className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl"
            style={{
              y: orbY2,
              backgroundColor: 'rgb(var(--p-300) / 0.2)',
            }}
          />

          {/* Accent orb - purple tint */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-3xl"
            style={{
              y: useTransform(scrollY, [0, 2000], [0, -100]),
              x: mousePosition.x * 0.2,
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
            }}
          />
        </>
      )}
    </div>
  );
}
