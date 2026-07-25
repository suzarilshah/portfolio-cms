'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

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

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}
    >
      {/* Grid pattern layer with mouse interaction */}
      {showGrid && (
        <motion.div
          className="absolute inset-0"
          style={{
            x: mousePosition.x * 0.3,
            y: mousePosition.y * 0.3,
          }}
        >
          {/* SVG Grid Pattern */}
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.3 }}
          >
            <defs>
              <pattern
                id="grid-pattern-section"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="rgb(var(--p-300))"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern-section)" />
          </svg>
        </motion.div>
      )}

      {/* Floating orbs with blur for depth - more subtle */}
      {showOrbs && (
        <>
          <motion.div
            className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full blur-3xl"
            style={{
              x: mousePosition.x * 0.5,
              y: mousePosition.y * 0.5,
              backgroundColor: 'rgb(var(--p-200) / 0.2)',
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-[250px] h-[250px] rounded-full blur-3xl"
            style={{
              x: mousePosition.x * -0.3,
              y: mousePosition.y * -0.3,
              backgroundColor: 'rgb(var(--p-100) / 0.25)',
            }}
          />
        </>
      )}
    </div>
  );
}
