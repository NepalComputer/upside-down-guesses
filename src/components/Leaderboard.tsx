import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown } from 'lucide-react';
import { Player } from '@/types/game';

interface LeaderboardProps {
  players: Player[];
  currentPlayerId: string;
  winningScore: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, currentPlayerId, winningScore }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-gradient-card rounded-xl p-4 border border-border/50 shadow-lg h-fit">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="font-display text-lg tracking-wider">Leaderboard</h3>
      </div>
      
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          const progressPercent = Math.min((player.score / winningScore) * 100, 100);
          
          return (
            <motion.div
              key={player.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-3 rounded-lg overflow-hidden ${
                isCurrentPlayer ? 'bg-primary/10 border border-primary/30' : 'bg-surface'
              }`}
            >
              {/* Progress bar background */}
              <motion.div
                className="absolute inset-0 bg-primary/10"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              
              <div className="relative flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-display text-sm ${
                  index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                  index === 1 ? 'bg-gray-400/20 text-gray-400' :
                  index === 2 ? 'bg-orange-500/20 text-orange-500' :
                  'bg-secondary text-muted-foreground'
                }`}>
                  {index === 0 ? <Crown className="w-4 h-4" /> : index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {player.name}
                    {isCurrentPlayer && <span className="text-primary text-xs ml-1">(You)</span>}
                  </p>
                </div>
                
                <motion.span 
                  key={player.score}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="font-display text-lg text-primary"
                >
                  {player.score}
                </motion.span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-3 pt-3 border-t border-border/30 text-center">
        <p className="text-xs text-muted-foreground">
          First to <span className="text-primary font-bold">{winningScore}</span> wins!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
