import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = () => {
  const [dots, setDots] = useState<any[]>([]);

  useEffect(() => {
    // Generate an array of dots with random properties
    const newDots = Array.from({ length: 450 }).map((_, i) => {
      // Use power curve to distribute more dots near center but without any sharp boundaries
      // This eliminates the "two sections" look
      const distance = Math.pow(Math.random(), 1.6); 
      const radius = distance * 65 + 2; // 2% to 67%
      const angle = Math.random() * 360;
      const size = Math.random() * 2.5 + 1; // 1px to 3.5px width
      const opacity = Math.random() * 0.5 + 0.15;
      
      // Cohesive colors matching the DSwap brand
      const colors = [
        'bg-primary-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]', // Blue
        'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]',    // Cyan
        'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.6)]',     // Sky
        'bg-primary-300 shadow-[0_0_8px_rgba(147,197,253,0.5)]'  // Light blue
      ];
      const colorClass = colors[Math.floor(Math.random() * colors.length)];

      return { id: i, radius, angle, size, opacity, colorClass, distance };
    });
    setDots(newDots);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center mix-blend-screen opacity-90">
      {/* A single unified rotating layer so it doesn't look like two separate sections */}
      <motion.div 
        className="relative w-[150vmax] h-[150vmax] flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
      >
        {dots.map((dot) => (
          <div
            key={dot.id}
            className={`absolute rounded-full ${dot.colorClass}`}
            style={{
              width: `${dot.size}px`,
              // The further away from center, the more elongated it looks (simulates motion blur)
              height: `${dot.size * (2 + dot.distance * 3.5)}px`, 
              opacity: dot.opacity,
              // Offset from center based on radius
              transform: `rotate(${dot.angle}deg) translateY(-${dot.radius}vmax)`,
            }}
          />
        ))}
      </motion.div>
      
      {/* Soft center glowing orb to tie it all together */}
      <div 
        className="absolute w-72 h-72 rounded-full bg-primary-500/10 blur-[100px]"
      />
    </div>
  );
};

export default ParticleBackground;
