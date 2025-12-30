import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Player, Room, Question, RoundResult, GamePhase, GameSettings } from '@/types/game';
import { getRandomQuestion } from '@/data/questions';
import { nanoid } from 'nanoid';

interface GameContextType {
  currentPlayer: Player | null;
  room: Room | null;
  phase: GamePhase;
  roundResults: RoundResult[];
  usedQuestionIds: string[];
  timeRemaining: number;
  winner: Player | null;
  showingAnswer: boolean;
  
  setPlayerName: (name: string) => void;
  createRoom: () => void;
  joinRoom: (code: string) => boolean;
  startGame: () => void;
  submitAnswer: (answer: string) => boolean;
  nextRound: () => void;
  setPhase: (phase: GamePhase) => void;
  setTimeRemaining: (time: number) => void;
  leaveRoom: () => void;
  addBotPlayer: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  setShowingAnswer: (showing: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const DEFAULT_SETTINGS: GameSettings = {
  winningScore: 100,
  roundTime: 10,
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [phase, setPhase] = useState<GamePhase>('landing');
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_SETTINGS.roundTime);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showingAnswer, setShowingAnswer] = useState(false);

  const setPlayerName = useCallback((name: string) => {
    const player: Player = {
      id: nanoid(),
      name,
      score: 0,
      isHost: false,
      hasAnswered: false,
    };
    setCurrentPlayer(player);
  }, []);

  const createRoom = useCallback(() => {
    if (!currentPlayer) return;
    
    const hostPlayer = { ...currentPlayer, isHost: true };
    setCurrentPlayer(hostPlayer);
    
    const newRoom: Room = {
      id: nanoid(),
      code: generateRoomCode(),
      players: [hostPlayer],
      status: 'waiting',
      currentRound: 0,
      settings: { ...DEFAULT_SETTINGS },
    };
    setRoom(newRoom);
    setPhase('lobby');
  }, [currentPlayer]);

  const joinRoom = useCallback((code: string): boolean => {
    if (!currentPlayer || !room) return false;
    
    if (room.code.toUpperCase() === code.toUpperCase()) {
      const updatedPlayers = [...room.players, currentPlayer];
      setRoom({ ...room, players: updatedPlayers });
      setPhase('lobby');
      return true;
    }
    return false;
  }, [currentPlayer, room]);

  const addBotPlayer = useCallback(() => {
    if (!room) return;
    
    const botNames = ['Dustin', 'Lucas', 'Mike', 'Will', 'Max', 'Nancy', 'Steve'];
    const usedNames = room.players.map(p => p.name);
    const availableNames = botNames.filter(n => !usedNames.includes(n));
    
    if (availableNames.length === 0 || room.players.length >= 8) return;
    
    const botPlayer: Player = {
      id: nanoid(),
      name: availableNames[Math.floor(Math.random() * availableNames.length)],
      score: 0,
      isHost: false,
      hasAnswered: false,
    };
    
    setRoom({ ...room, players: [...room.players, botPlayer] });
  }, [room]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    if (!room) return;
    setRoom({
      ...room,
      settings: { ...room.settings, ...newSettings },
    });
  }, [room]);

  const startGame = useCallback(() => {
    if (!room || room.players.length < 2) return;
    
    const question = getRandomQuestion([]);
    if (!question) return;
    
    setUsedQuestionIds([question.id]);
    setRoom({
      ...room,
      status: 'playing',
      currentQuestion: question,
      currentRound: 1,
      roundStartTime: Date.now(),
      players: room.players.map(p => ({ ...p, hasAnswered: false })),
    });
    setTimeRemaining(room.settings.roundTime);
    setShowingAnswer(false);
    setPhase('playing');
  }, [room]);

  const submitAnswer = useCallback((answer: string): boolean => {
    if (!room || !currentPlayer || !room.currentQuestion) return false;
    
    const answerTime = Date.now() - (room.roundStartTime || Date.now());
    const isCorrect = answer.toLowerCase().trim() === room.currentQuestion.answer.toLowerCase();
    
    // If wrong, just return false - no penalty, player can try again
    if (!isCorrect) {
      return false;
    }
    
    // Calculate points based on order of correct answers
    const correctAnswers = roundResults.filter(r => r.isCorrect).length;
    let points = 0;
    if (correctAnswers === 0) points = 10;
    else if (correctAnswers === 1) points = 5;
    else points = 3;
    
    // Update player's answered status and score
    const updatedPlayers = room.players.map(p => 
      p.id === currentPlayer.id 
        ? { ...p, hasAnswered: true, lastAnswerTime: answerTime, score: p.score + points } 
        : p
    );
    
    // Update current player
    const updatedCurrentPlayer = updatedPlayers.find(p => p.id === currentPlayer.id);
    if (updatedCurrentPlayer) setCurrentPlayer(updatedCurrentPlayer);
    
    setRoom({ ...room, players: updatedPlayers });
    
    setRoundResults(prev => [...prev, {
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      answer,
      isCorrect: true,
      points,
      answerTime,
    }]);
    
    return true;
  }, [room, currentPlayer, roundResults]);

  const nextRound = useCallback(() => {
    if (!room) return;
    
    // Check for winner
    const potentialWinner = room.players.find(p => p.score >= room.settings.winningScore);
    if (potentialWinner) {
      setWinner(potentialWinner);
      setRoom({ ...room, status: 'finished' });
      setPhase('winner');
      return;
    }
    
    // Get next question
    const question = getRandomQuestion(usedQuestionIds);
    if (!question) {
      // If no more questions, winner is highest scorer
      const highestScorer = [...room.players].sort((a, b) => b.score - a.score)[0];
      setWinner(highestScorer);
      setRoom({ ...room, status: 'finished' });
      setPhase('winner');
      return;
    }
    
    setUsedQuestionIds(prev => [...prev, question.id]);
    setRoundResults([]);
    setRoom({
      ...room,
      currentQuestion: question,
      currentRound: room.currentRound + 1,
      roundStartTime: Date.now(),
      players: room.players.map(p => ({ ...p, hasAnswered: false })),
    });
    setTimeRemaining(room.settings.roundTime);
    setShowingAnswer(false);
  }, [room, usedQuestionIds]);

  const leaveRoom = useCallback(() => {
    setRoom(null);
    setCurrentPlayer(null);
    setPhase('landing');
    setRoundResults([]);
    setUsedQuestionIds([]);
    setWinner(null);
    setShowingAnswer(false);
  }, []);

  return (
    <GameContext.Provider value={{
      currentPlayer,
      room,
      phase,
      roundResults,
      usedQuestionIds,
      timeRemaining,
      winner,
      showingAnswer,
      setPlayerName,
      createRoom,
      joinRoom,
      startGame,
      submitAnswer,
      nextRound,
      setPhase,
      setTimeRemaining,
      leaveRoom,
      addBotPlayer,
      updateSettings,
      setShowingAnswer,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
