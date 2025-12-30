import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/context/GameContext';
import { Send, Clock, Trophy } from 'lucide-react';

const GameScreen: React.FC = () => {
  const { 
    room, 
    currentPlayer, 
    timeRemaining, 
    setTimeRemaining,
    submitAnswer, 
    setPhase,
    roundResults 
  } = useGame();
  
  const [answer, setAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Timer logic
  useEffect(() => {
    if (timeRemaining <= 0) {
      setShowResults(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, setTimeRemaining]);

  // Simulate bot answers
  useEffect(() => {
    if (!room || hasSubmitted) return;
    
    const bots = room.players.filter(p => p.id !== currentPlayer?.id);
    bots.forEach((bot, index) => {
      const delay = 2000 + Math.random() * 5000;
      setTimeout(() => {
        // Bots have 60% chance of correct answer
        const isCorrect = Math.random() < 0.6;
        // This is simplified - in real app, we'd update game state
      }, delay);
    });
  }, [room, currentPlayer, hasSubmitted]);

  const handleSubmit = useCallback(() => {
    if (!answer.trim() || hasSubmitted) return;
    submitAnswer(answer.trim());
    setHasSubmitted(true);
  }, [answer, hasSubmitted, submitAnswer]);

  const handleContinue = () => {
    setShowResults(false);
    setHasSubmitted(false);
    setAnswer('');
    setPhase('roundResult');
  };

  if (!room || !currentPlayer || !room.currentQuestion) return null;

  const timerPercentage = (timeRemaining / 10) * 100;
  const timerColor = timeRemaining <= 3 ? 'text-destructive' : 'text-primary';

  // Sort players by score for leaderboard
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen flex flex-col px-4 py-6">
      {/* Header with timer and round */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          <span className="font-display text-lg text-foreground">Round {room.currentRound}</span>
        </div>
        
        <div className={`flex items-center gap-2 ${timerColor}`}>
          <Clock className="w-5 h-5" />
          <span className="font-display text-3xl">{timeRemaining}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1 bg-secondary rounded-full mb-8 overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: '100%' }}
          animate={{ width: `${timerPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full"
      >
        <div className="bg-gradient-card rounded-2xl p-8 border border-border/50 shadow-lg w-full text-center mb-8">
          <p className="text-2xl md:text-3xl font-display tracking-wide leading-relaxed">
            {room.currentQuestion.question}
          </p>
        </div>

        {/* Answer input */}
        <AnimatePresence mode="wait">
          {!hasSubmitted && !showResults ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <div className="flex gap-3">
                <Input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="flex-1 text-lg"
                  autoFocus
                />
                <Button 
                  variant="hero"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          ) : hasSubmitted && !showResults ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-primary" />
              </div>
              <p className="text-xl font-display">Answer Submitted!</p>
              <p className="text-muted-foreground">Waiting for other players...</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center w-full max-w-md"
            >
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                Correct Answer
              </p>
              <p className="text-3xl font-display text-primary text-glow mb-6">
                {room.currentQuestion.answer}
              </p>
              
              {/* Player's result */}
              {roundResults.find(r => r.playerId === currentPlayer.id) && (
                <div className={`rounded-lg p-4 mb-6 ${
                  roundResults.find(r => r.playerId === currentPlayer.id)?.isCorrect 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-destructive/20 border border-destructive/30'
                }`}>
                  <p className="text-lg font-display">
                    {roundResults.find(r => r.playerId === currentPlayer.id)?.isCorrect 
                      ? `Correct! +${roundResults.find(r => r.playerId === currentPlayer.id)?.points} points` 
                      : 'Incorrect!'}
                  </p>
                </div>
              )}
              
              <Button 
                variant="hero" 
                size="lg"
                onClick={handleContinue}
                className="w-full"
              >
                Continue
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mini leaderboard */}
      <div className="mt-8">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {sortedPlayers.slice(0, 4).map((player, index) => (
            <div 
              key={player.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                player.id === currentPlayer.id ? 'bg-primary/20' : 'bg-surface'
              }`}
            >
              {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
              <span className="font-medium">{player.name}</span>
              <span className="text-primary font-display">{player.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
