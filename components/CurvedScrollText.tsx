'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CurvedScrollTextProps {
  text?: string;
  repeatCount?: number;
  className?: string;
  inverted?: boolean; // Smile curve (curve down like a smile, flatten on scroll)
}

export default function CurvedScrollText({
  text = 'SHAH',
  repeatCount = 3,
  className = '',
  inverted = false
}: CurvedScrollTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1400);

  // Responsive width measurement
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // SVG viewBox scales with container
  const viewBoxWidth = Math.max(containerWidth * 1.5, 2000);
  const viewBoxHeight = 400;

  // Normal (arch up): control point starts high (small Y), flattens to baseline (larger Y)
  // Inverted (smile): control point starts low (large Y), flattens to baseline (smaller Y)
  // For arch: M 0,200 Q midX,50 endX,200 -> starts arched up, flattens to Y=200
  // For smile: M 0,200 Q midX,350 endX,200 -> starts smiling down, flattens to Y=200
  const baselineY = 200;
  const curveStartY = inverted ? 350 : 50;
  const curveEndY = baselineY;

  // Curve control points
  const startX = 0;
  const endX = viewBoxWidth;
  const midX = viewBoxWidth / 2;

  // Interpolate control point Y (curve flattens as you scroll into view)
  const curveControlY = useTransform(scrollYProgress, [0, 0.6], [curveStartY, curveEndY]);

  // Dynamic SVG Path - Quadratic Bezier curve
  const pathD = useTransform(
    curveControlY,
    (y) => `M ${startX},${baselineY} Q ${midX},${y} ${endX},${baselineY}`
  );

  // Calculate responsive font size
  const fontSize = Math.max(viewBoxWidth * 0.15, 220);

  // Create repeated text
  const displayText = Array(repeatCount).fill(text).join('');

  return (
    <div
      ref={containerRef}
      className={`w-full min-h-[120px] md:min-h-[180px] py-2 md:py-4 flex items-center justify-center overflow-hidden ${className}`}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid slice"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <defs>
          {/* Gradient for text fill - more visible */}
          <linearGradient id="text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(var(--p-400))" stopOpacity="0.5" />
            <stop offset="50%" stopColor="rgb(var(--p-500))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="rgb(var(--p-400))" stopOpacity="0.5" />
          </linearGradient>

          {/* The animated curve path */}
          <motion.path
            id="curve-path"
            d={pathD}
            fill="none"
          />
        </defs>

        {/* Shadow/glow layer */}
        <text
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: 'var(--font-display), Inter, system-ui, sans-serif',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            filter: 'blur(8px)',
          }}
          fill="rgb(var(--p-500))"
          fillOpacity="0.5"
        >
          <textPath
            href="#curve-path"
            startOffset="50%"
            textAnchor="middle"
          >
            {displayText}
          </textPath>
        </text>

        {/* Main text */}
        <text
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: 'var(--font-display), Inter, system-ui, sans-serif',
            fontWeight: 900,
            letterSpacing: '-0.04em',
          }}
          fill="url(#text-gradient)"
        >
          <textPath
            href="#curve-path"
            startOffset="50%"
            textAnchor="middle"
          >
            {displayText}
          </textPath>
        </text>

        {/* Stroke outline for extra depth */}
        <text
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: 'var(--font-display), Inter, system-ui, sans-serif',
            fontWeight: 900,
            letterSpacing: '-0.04em',
          }}
          fill="none"
          stroke="rgb(var(--p-500))"
          strokeWidth="2"
          strokeOpacity="0.6"
        >
          <textPath
            href="#curve-path"
            startOffset="50%"
            textAnchor="middle"
          >
            {displayText}
          </textPath>
        </text>
      </motion.svg>
    </div>
  );
}
