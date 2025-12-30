export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  hasAnswered: boolean;
  lastAnswerTime?: number;
}

export interface Question {
  id: string;
  type: 'text' | 'image';
  question: string;
  answer: string;
  imageUrl?: string;
}

export interface GameSettings {
  winningScore: number;
  roundTime: number;
}

export interface Room {
  id: string;
  code: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  currentQuestion?: Question;
  currentRound: number;
  roundStartTime?: number;
  settings: GameSettings;
}

export interface RoundResult {
  playerId: string;
  playerName: string;
  answer: string;
  isCorrect: boolean;
  points: number;
  answerTime: number;
}

export type GamePhase = 'landing' | 'create' | 'join' | 'lobby' | 'playing' | 'winner';
