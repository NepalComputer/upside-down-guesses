import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'lg', animated = true }) => {
  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-7xl md:text-8xl',
  };

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center select-none"
      >
        <h1 
          className={`font-display ${sizeClasses[size]} text-foreground tracking-widest animate-flicker`}
          style={{ transform: 'scaleY(-1)' }}
        >
          <span className="text-glow-intense">POPSIDE</span>
        </h1>
        <h1 className={`font-display ${sizeClasses[size]} text-primary tracking-widest -mt-2 md:-mt-4 text-glow`}>
          DOWN
        </h1>
        {size === 'lg' && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-muted-foreground text-sm mt-4 tracking-widest uppercase"
          >
            A Fan-Made Trivia Game
          </motion.p>
        )}
      </motion.div>
    );
  }

  return (
    <div className="text-center select-none">
      <h1 
        className={`font-display ${sizeClasses[size]} text-foreground tracking-widest animate-flicker`}
        style={{ transform: 'scaleY(-1)' }}
      >
        <span className="text-glow-intense">POPSIDE</span>
      </h1>
      <h1 className={`font-display ${sizeClasses[size]} text-primary tracking-widest -mt-2 md:-mt-4 text-glow`}>
        DOWN
      </h1>
    </div>
  );
};

export default Logo;
