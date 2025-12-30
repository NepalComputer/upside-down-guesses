import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import { useGame } from '@/context/GameContext';
import { Users, Plus } from 'lucide-react';

const LandingScreen: React.FC = () => {
  const { setPlayerName, setPhase } = useGame();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleContinue = (action: 'create' | 'join') => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    setPlayerName(name.trim());
    setPhase(action);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <Logo />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 w-full max-w-sm space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground uppercase tracking-wider">
            Enter Your Name
          </label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="Your name..."
            maxLength={20}
            className="text-center text-lg"
          />
          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => handleContinue('create')}
            className="w-full"
          >
            <Plus className="w-5 h-5" />
            Create Room
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => handleContinue('join')}
            className="w-full"
          >
            <Users className="w-5 h-5" />
            Join Room
          </Button>
        </div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-16 text-xs text-muted-foreground/60 text-center max-w-md"
      >
        This is a fan-made game inspired by Stranger Things. 
        Not affiliated with Netflix or the show's creators.
      </motion.p>
    </div>
  );
};

export default LandingScreen;
