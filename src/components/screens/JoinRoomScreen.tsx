import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import { useGame } from '@/context/GameContext';
import { ArrowLeft, LogIn } from 'lucide-react';
import { toast } from 'sonner';

const JoinRoomScreen: React.FC = () => {
  const { currentPlayer, room, joinRoom, setPhase } = useGame();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (!code.trim()) {
      setError('Please enter a room code');
      return;
    }
    
    // For demo purposes, show the current room code if one exists
    if (!room) {
      toast.error('No room available. Ask a friend to create one first!');
      return;
    }
    
    const success = joinRoom(code);
    if (!success) {
      setError('Invalid room code. Check and try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <Logo size="md" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-12 w-full max-w-sm space-y-8 text-center"
      >
        <div>
          <p className="text-muted-foreground">Welcome,</p>
          <p className="text-2xl font-display tracking-wider text-foreground">
            {currentPlayer?.name}
          </p>
        </div>

        <div className="bg-gradient-card rounded-xl p-8 border border-border/50 shadow-lg">
          <LogIn className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-display tracking-wider mb-2">
            Join a Room
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Enter the 5-letter room code shared by your friend.
          </p>
          
          <div className="space-y-4">
            <Input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="XXXXX"
              maxLength={5}
              className="text-center text-2xl font-display tracking-[0.3em] uppercase"
            />
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            
            <Button 
              variant="hero" 
              size="lg"
              onClick={handleJoin}
              className="w-full"
            >
              Join Room
            </Button>
          </div>
          
          {room && (
            <p className="mt-4 text-xs text-muted-foreground">
              Demo: Current room code is <span className="text-primary font-bold">{room.code}</span>
            </p>
          )}
        </div>

        <Button 
          variant="ghost" 
          onClick={() => setPhase('landing')}
          className="text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </motion.div>
    </div>
  );
};

export default JoinRoomScreen;
