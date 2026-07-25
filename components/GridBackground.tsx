'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface GridBackgroundProps {
  className?: string;
}

// Get hue rotation needed to shift lime (75) to target hue
function getHueRotation(primaryHue: number): number {
  return primaryHue - 75;
}

export default function GridBackground({ className = '' }: GridBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [primaryHue, setPrimaryHue] = useState(210); // Default blue
  const { scrollY } = useScroll();

  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 3000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 3000], [0, -50]);
  const scale = useTransform(scrollY, [0, 2000], [1, 1.05]);
  const rotate = useTransform(scrollY, [0, 5000], [0, 2]);

  // Get primary color from CSS variable
  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const primaryVar = computedStyle.getPropertyValue('--p-500').trim();

    // Parse HSL values if available (format: "R G B")
    // Our CSS vars are in RGB format, so we'll use a default blue hue
    // You can adjust this based on your accent color
    setPrimaryHue(210); // Blue hue
  }, []);

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

  const hueRotation = getHueRotation(primaryHue);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}>
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/30 to-white" />

      {/* Main SVG Grid Pattern with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: y1,
          scale,
          rotate,
          x: mousePosition.x * 0.3,
        }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('/grid-pattern.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.5,
            filter: `hue-rotate(${hueRotation}deg) saturate(1.1)`,
          }}
        />
      </motion.div>

      {/* Secondary subtle grid overlay */}
      <motion.div
        className="absolute inset-0"
        style={{ y: y2, scale }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(var(--p-300) / 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(var(--p-300) / 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </motion.div>

      {/* Gradient fade for content readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/80" />

      {/* Floating orbs with mouse parallax */}
      <motion.div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          x: mousePosition.x * 0.5,
          y: mousePosition.y * 0.5,
          backgroundColor: 'rgb(var(--p-200) / 0.15)',
        }}
      />
      <motion.div
        className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          x: mousePosition.x * -0.3,
          y: mousePosition.y * -0.3,
          backgroundColor: 'rgb(var(--p-100) / 0.2)',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl"
        style={{
          x: mousePosition.x * 0.2,
          y: mousePosition.y * 0.2,
          backgroundColor: 'rgba(168, 85, 247, 0.06)',
        }}
      />
    </div>
  );
}
