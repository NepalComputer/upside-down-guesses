import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useGame } from '@/context/GameContext';
import { Copy, Crown, Play, UserPlus, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const LobbyScreen: React.FC = () => {
  const { room, currentPlayer, startGame, leaveRoom, addBotPlayer } = useGame();

  if (!room || !currentPlayer) return null;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    toast.success('Room code copied!');
  };

  const isHost = currentPlayer.isHost;
  const canStart = room.players.length >= 2;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <Logo size="sm" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 w-full max-w-md space-y-6"
      >
        {/* Room Code */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border/50 shadow-lg text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
            Room Code
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl font-display tracking-[0.3em] text-primary text-glow">
              {room.code}
            </span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={copyRoomCode}
              className="text-muted-foreground hover:text-primary"
            >
              <Copy className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Share this code with friends to join
          </p>
        </div>

        {/* Players List */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border/50 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg tracking-wider">
              Players ({room.players.length}/8)
            </h3>
            {isHost && room.players.length < 8 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={addBotPlayer}
                className="text-muted-foreground hover:text-primary"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Add Bot
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {room.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  player.id === currentPlayer.id 
                    ? 'bg-primary/10 border border-primary/30' 
                    : 'bg-surface'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg font-display">
                  {player.name[0].toUpperCase()}
                </div>
                <span className="flex-1 font-medium">
                  {player.name}
                  {player.id === currentPlayer.id && (
                    <span className="text-primary text-sm ml-2">(You)</span>
                  )}
                </span>
                {player.isHost && (
                  <Crown className="w-5 h-5 text-yellow-500" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {isHost ? (
            <Button 
              variant="hero" 
              size="lg"
              onClick={startGame}
              disabled={!canStart}
              className="w-full"
            >
              <Play className="w-5 h-5" />
              {canStart ? 'Start Game' : 'Need 2+ Players'}
            </Button>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Waiting for host to start the game...
            </div>
          )}
          
          <Button 
            variant="ghost"
            onClick={leaveRoom}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Leave Room
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default LobbyScreen;
