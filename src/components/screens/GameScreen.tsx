import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/context/GameContext';
import { Send, Clock, Check, X } from 'lucide-react';
import Leaderboard from '@/components/Leaderboard';

const GameScreen: React.FC = () => {
  const { 
    room, 
    currentPlayer, 
    timeRemaining, 
    setTimeRemaining,
    submitAnswer, 
    nextRound,
    showingAnswer,
    setShowingAnswer,
  } = useGame();
  
  const [answer, setAnswer] = useState('');
  const [hasCorrectAnswer, setHasCorrectAnswer] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState<string[]>([]);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);

  // Reset state when round changes
  useEffect(() => {
    setAnswer('');
    setHasCorrectAnswer(false);
    setWrongAttempts([]);
    setShowWrongFeedback(false);
  }, [room?.currentRound]);

  // Timer logic
  useEffect(() => {
    if (showingAnswer) return;
    
    if (timeRemaining <= 0) {
      setShowingAnswer(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, setTimeRemaining, showingAnswer, setShowingAnswer]);

  const handleSubmit = useCallback(() => {
    if (!answer.trim() || hasCorrectAnswer || showingAnswer) return;
    
    const isCorrect = submitAnswer(answer.trim());
    
    if (isCorrect) {
      setHasCorrectAnswer(true);
      setAnswer('');
    } else {
      // Wrong answer - show feedback briefly and allow retry
      setWrongAttempts(prev => [...prev, answer.trim()]);
      setShowWrongFeedback(true);
      setAnswer('');
      setTimeout(() => setShowWrongFeedback(false), 500);
    }
  }, [answer, hasCorrectAnswer, showingAnswer, submitAnswer]);

  const handleContinue = () => {
    nextRound();
  };

  if (!room || !currentPlayer || !room.currentQuestion) return null;

  const timerPercentage = (timeRemaining / room.settings.roundTime) * 100;
  const timerColor = timeRemaining <= 3 ? 'text-destructive' : 'text-primary';

  return (
    <div className="min-h-screen flex px-4 py-6 gap-6">
      {/* Main game area */}
      <div className="flex-1 flex flex-col">
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

          {/* Answer input or results */}
          <AnimatePresence mode="wait">
            {!showingAnswer ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-md"
              >
                {hasCorrectAnswer ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-xl font-display text-green-400">Correct!</p>
                    <p className="text-muted-foreground">Waiting for timer...</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Input
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Type your answer..."
                          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                          className={`text-lg transition-all ${showWrongFeedback ? 'border-destructive shake' : ''}`}
                          autoFocus
                        />
                      </div>
                      <Button 
                        variant="hero"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={!answer.trim()}
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                    
                    {wrongAttempts.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-wrap gap-2"
                      >
                        {wrongAttempts.slice(-3).map((attempt, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 text-xs bg-destructive/20 text-destructive rounded flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            {attempt}
                          </span>
                        ))}
                      </motion.div>
                    )}
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Guess as many times as you want!
                    </p>
                  </div>
                )}
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
                <div className={`rounded-lg p-4 mb-6 ${
                  hasCorrectAnswer 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-destructive/20 border border-destructive/30'
                }`}>
                  <p className="text-lg font-display">
                    {hasCorrectAnswer 
                      ? 'You got it right!' 
                      : 'Better luck next round!'}
                  </p>
                </div>
                
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={handleContinue}
                  className="w-full"
                >
                  Next Round
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Persistent Leaderboard sidebar */}
      <div className="hidden md:block w-72 shrink-0">
        <Leaderboard 
          players={room.players}
          currentPlayerId={currentPlayer.id}
          winningScore={room.settings.winningScore}
        />
      </div>
    </div>
  );
};

export default GameScreen;
