import { useMemo } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = () => {
  const dots = useMemo(
    () =>
      Array.from({ length: 32 }).map((_, i) => {
        const radius = Math.random() * 48 + 18;
        const angle = Math.random() * 360;
        const size = Math.random() * 2 + 1.2;
        const opacity = Math.random() * 0.24 + 0.12;
        const colors = ['rgba(14,165,233,0.18)', 'rgba(56,189,248,0.14)', 'rgba(59,130,246,0.12)'];
        const color = colors[i % colors.length];
        return { id: i, radius, angle, size, opacity, color };
      }),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.16),transparent_32%),radial-gradient(circle_at_80%_22%,rgba(59,130,246,0.12),transparent_32%)]" />
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
      >
        {dots.map((dot) => (
          <div
            key={dot.id}
            className="absolute rounded-full"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size * 2.2}px`,
              opacity: dot.opacity,
              backgroundColor: dot.color,
              boxShadow: `0 0 ${dot.size * 3}px ${dot.color}`,
              transform: `rotate(${dot.angle}deg) translateY(-${dot.radius}vmin)`,
            }}
          />
        ))}
      </motion.div>
      <div className="absolute inset-x-0 top-1/4 mx-auto h-72 w-72 rounded-full bg-primary-500/10 blur-[72px]" />
    </div>
  );
};

export default ParticleBackground;
