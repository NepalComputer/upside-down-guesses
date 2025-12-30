import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useGame } from '@/context/GameContext';
import { ArrowLeft, Sparkles } from 'lucide-react';

const CreateRoomScreen: React.FC = () => {
  const { currentPlayer, createRoom, setPhase } = useGame();

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
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-display tracking-wider mb-2">
            Create a New Room
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Start a game and invite your friends to join using the room code.
          </p>
          
          <Button 
            variant="hero" 
            size="lg"
            onClick={createRoom}
            className="w-full"
          >
            Create Room
          </Button>
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

export default CreateRoomScreen;
