import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { Trophy, ArrowRight, Check, X } from 'lucide-react';

const RoundResultScreen: React.FC = () => {
  const { room, currentPlayer, roundResults, nextRound } = useGame();

  if (!room || !currentPlayer) return null;

  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const leader = sortedPlayers[0];
  const currentPlayerRank = sortedPlayers.findIndex(p => p.id === currentPlayer.id) + 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Round complete header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
          >
            <Trophy className="w-10 h-10 text-primary" />
          </motion.div>
          <h2 className="text-3xl font-display tracking-wider">Round {room.currentRound} Complete</h2>
        </div>

        {/* Leaderboard */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border/50 shadow-lg">
          <h3 className="font-display text-lg tracking-wider mb-4 text-center">
            Leaderboard
          </h3>
          
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => {
              const result = roundResults.find(r => r.playerId === player.id);
              const isCurrentPlayer = player.id === currentPlayer.id;
              
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isCurrentPlayer ? 'bg-primary/10 border border-primary/30' : 'bg-surface'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-lg ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                    index === 1 ? 'bg-gray-400/20 text-gray-400' :
                    index === 2 ? 'bg-orange-500/20 text-orange-500' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium">
                      {player.name}
                      {isCurrentPlayer && <span className="text-primary text-sm ml-1">(You)</span>}
                    </p>
                    {result && (
                      <p className={`text-xs flex items-center gap-1 ${
                        result.isCorrect ? 'text-green-400' : 'text-muted-foreground'
                      }`}>
                        {result.isCorrect ? (
                          <>
                            <Check className="w-3 h-3" />
                            +{result.points} pts
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            No points
                          </>
                        )}
                      </p>
                    )}
                  </div>
                  
                  <span className="font-display text-xl text-primary">{player.score}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Current player status */}
        <div className="text-center">
          <p className="text-muted-foreground">
            You're in <span className="text-primary font-bold">{currentPlayerRank}{getOrdinalSuffix(currentPlayerRank)}</span> place
          </p>
          <p className="text-sm text-muted-foreground">
            {leader.id === currentPlayer.id 
              ? "You're in the lead!" 
              : `${leader.score - currentPlayer.score} points behind ${leader.name}`}
          </p>
        </div>

        {/* Next round button */}
        <Button 
          variant="hero" 
          size="lg"
          onClick={nextRound}
          className="w-full"
        >
          Next Round
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default RoundResultScreen;
