import { Question } from '@/types/game';

// Demo questions - In production, these would come from Firebase Firestore
export const demoQuestions: Question[] = [
  {
    id: '1',
    type: 'text',
    question: 'Who closed the gate to the Upside Down in Season 2?',
    answer: 'eleven',
  },
  {
    id: '2',
    type: 'text',
    question: 'What is the name of the monster from Season 1?',
    answer: 'demogorgon',
  },
  {
    id: '3',
    type: 'text',
    question: 'What game do the kids play in Mike\'s basement?',
    answer: 'dungeons and dragons',
  },
  {
    id: '4',
    type: 'text',
    question: 'What is Eleven\'s favorite food?',
    answer: 'eggos',
  },
  {
    id: '5',
    type: 'text',
    question: 'What is the name of the town where the show takes place?',
    answer: 'hawkins',
  },
  {
    id: '6',
    type: 'text',
    question: 'Who is the chief of police in Hawkins?',
    answer: 'hopper',
  },
  {
    id: '7',
    type: 'text',
    question: 'What is the name of the secret government laboratory?',
    answer: 'hawkins lab',
  },
  {
    id: '8',
    type: 'text',
    question: 'What does Joyce use to communicate with Will in Season 1?',
    answer: 'christmas lights',
  },
  {
    id: '9',
    type: 'text',
    question: 'What is the name of the arcade in Hawkins?',
    answer: 'palace arcade',
  },
  {
    id: '10',
    type: 'text',
    question: 'Who is the main villain in Season 4?',
    answer: 'vecna',
  },
  {
    id: '11',
    type: 'text',
    question: 'What song saves Max from Vecna?',
    answer: 'running up that hill',
  },
  {
    id: '12',
    type: 'text',
    question: 'What is Steve\'s signature weapon?',
    answer: 'nail bat',
  },
];

export const getRandomQuestion = (usedIds: string[]): Question | null => {
  const available = demoQuestions.filter(q => !usedIds.includes(q.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
};
