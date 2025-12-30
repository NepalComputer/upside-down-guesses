import React from 'react';
import heroBg from '@/assets/hero-bg.jpg';

interface GameBackgroundProps {
  children: React.ReactNode;
}

const GameBackground: React.FC<GameBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Base background image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-background/70" />
      
      {/* Gradient glow overlay */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      
      {/* Noise texture */}
      <div className="fixed inset-0 noise opacity-30" />
      
      {/* Vignette effect */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-transparent to-background/80" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default GameBackground;
