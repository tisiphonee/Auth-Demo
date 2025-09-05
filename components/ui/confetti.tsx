'use client';

import { useEffect, useState } from 'react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'square' | 'triangle';
  opacity: number;
}

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
    const newParticles: ConfettiParticle[] = [];

    // Create more particles for a richer effect
    for (let i = 0; i < 25; i++) {
      newParticles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 30, // Wider spread
        y: 15 + Math.random() * 15, // Start higher
        vx: (Math.random() - 0.5) * 6, // More horizontal movement
        vy: Math.random() * 3 + 2, // More vertical speed
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4, // Larger particles
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15, // Faster rotation
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 1,
      });
    }

    setParticles(newParticles);

    // Animate particles
    const animate = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.08, // Slightly less gravity
          rotation: particle.rotation + particle.rotationSpeed,
          opacity: Math.max(0, particle.opacity - 0.008), // Fade out gradually
        })).filter(particle => particle.y < 120 && particle.opacity > 0) // Remove particles that fall off screen or fade out
      );
    };

    const interval = setInterval(animate, 16); // ~60fps

    // Clean up after animation
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
      onComplete?.();
    }, 1200); // Longer duration

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [trigger, onComplete]);

  if (particles.length === 0) return null;

  const getShapeStyle = (particle: ConfettiParticle) => {
    const baseStyle = {
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      backgroundColor: particle.color,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      transform: `rotate(${particle.rotation}deg)`,
      opacity: particle.opacity,
      transition: 'none',
    };

    switch (particle.shape) {
      case 'circle':
        return { ...baseStyle, borderRadius: '50%' };
      case 'square':
        return { ...baseStyle, borderRadius: '2px' };
      case 'triangle':
        return {
          ...baseStyle,
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderLeft: `${particle.size / 2}px solid transparent`,
          borderRight: `${particle.size / 2}px solid transparent`,
          borderBottom: `${particle.size}px solid ${particle.color}`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={getShapeStyle(particle)}
        />
      ))}
    </div>
  );
}
