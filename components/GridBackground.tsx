'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface GridBackgroundProps {
  className?: string;
  svgColor?: string;
  overlayOpacity?: number;
}

// Color name to hue mapping
const colorHues: Record<string, number> = {
  blue: 210,
  lime: 75,
  cyan: 180,
  purple: 270,
  rose: 350,
  emerald: 150,
  orange: 30,
  amber: 45,
  indigo: 240,
  teal: 170,
  pink: 330,
  slate: 215,
};

// Get hue rotation needed to shift lime (75) to target hue
function getHueRotation(targetHue: number): number {
  return targetHue - 75;
}

export default function GridBackground({
  className = '',
  svgColor = 'blue',
  overlayOpacity = 30
}: GridBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 3000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 3000], [0, -50]);
  const scale = useTransform(scrollY, [0, 2000], [1, 1.05]);
  const rotate = useTransform(scrollY, [0, 5000], [0, 2]);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse parallax effect - disabled on mobile for performance
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  const targetHue = colorHues[svgColor] || 210;
  const hueRotation = getHueRotation(targetHue);
  const overlayOpacityDecimal = overlayOpacity / 100;

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}>
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/20 to-white" />

      {/* Main SVG Grid Pattern with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: isMobile ? 0 : y1,
          scale: isMobile ? 1 : scale,
          rotate: isMobile ? 0 : rotate,
          x: isMobile ? 0 : mousePosition.x * 0.3,
        }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('/grid-pattern.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.7,
            filter: `hue-rotate(${hueRotation}deg) saturate(1.3)`,
          }}
        />
      </motion.div>

      {/* Secondary subtle grid overlay */}
      <motion.div
        className="absolute inset-0"
        style={{ y: isMobile ? 0 : y2, scale: isMobile ? 1 : scale }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(var(--p-300) / 0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(var(--p-300) / 0.06) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </motion.div>

      {/* Gradient fade for content readability - controlled by settings */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(255,255,255,${overlayOpacityDecimal * 0.8}) 0%, rgba(255,255,255,${overlayOpacityDecimal * 0.3}) 50%, rgba(255,255,255,${overlayOpacityDecimal}) 100%)`
        }}
      />

      {/* Floating orbs with mouse parallax - hidden on mobile for performance */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{
              x: mousePosition.x * 0.5,
              y: mousePosition.y * 0.5,
              backgroundColor: 'rgb(var(--p-200) / 0.2)',
            }}
          />
          <motion.div
            className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{
              x: mousePosition.x * -0.3,
              y: mousePosition.y * -0.3,
              backgroundColor: 'rgb(var(--p-100) / 0.25)',
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl"
            style={{
              x: mousePosition.x * 0.2,
              y: mousePosition.y * 0.2,
              backgroundColor: 'rgba(168, 85, 247, 0.08)',
            }}
          />
        </>
      )}
    </div>
  );
}
