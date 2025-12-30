import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { Trophy, Sparkles, RotateCcw, Home } from 'lucide-react';

const WinnerScreen: React.FC = () => {
  const { room, currentPlayer, winner, leaveRoom } = useGame();

  React.useEffect(() => {
    // Dynamic import for confetti
    import('canvas-confetti').then((confettiModule) => {
      const confetti = confettiModule.default;
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const colors = ['#dc2626', '#f97316', '#facc15'];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    });
  }, []);

  if (!room || !currentPlayer || !winner) return null;

  const isWinner = winner.id === currentPlayer.id;
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 10 }}
        className="w-full max-w-md space-y-8 text-center"
      >
        {/* Winner announcement */}
        <div>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 8, delay: 0.2 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto shadow-lg shadow-yellow-500/30 animate-float">
              <Trophy className="w-16 h-16 text-yellow-900" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400" />
              <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-400" />
            </motion.div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-5xl font-display tracking-wider text-glow"
          >
            {isWinner ? 'YOU WIN!' : `${winner.name} WINS!`}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-2xl font-display text-primary mt-2"
          >
            {winner.score} Points
          </motion.p>
        </div>

        {/* Final standings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-card rounded-xl p-6 border border-border/50 shadow-lg"
        >
          <h3 className="font-display text-lg tracking-wider mb-4">Final Standings</h3>
          
          <div className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  player.id === currentPlayer.id ? 'bg-primary/10' : 'bg-surface'
                }`}
              >
                <span className={`font-display text-xl ${
                  index === 0 ? 'text-yellow-500' :
                  index === 1 ? 'text-gray-400' :
                  index === 2 ? 'text-orange-500' :
                  'text-muted-foreground'
                }`}>
                  #{index + 1}
                </span>
                <span className="flex-1 font-medium">{player.name}</span>
                <span className="font-display text-primary">{player.score}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col gap-3"
        >
          <Button 
            variant="hero" 
            size="lg"
            onClick={leaveRoom}
            className="w-full"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </Button>
          
          <Button 
            variant="ghost"
            onClick={leaveRoom}
            className="text-muted-foreground"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WinnerScreen;
