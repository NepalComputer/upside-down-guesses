import React from 'react';
import GameBackground from '@/components/GameBackground';
import LandingScreen from '@/components/screens/LandingScreen';
import CreateRoomScreen from '@/components/screens/CreateRoomScreen';
import JoinRoomScreen from '@/components/screens/JoinRoomScreen';
import LobbyScreen from '@/components/screens/LobbyScreen';
import GameScreen from '@/components/screens/GameScreen';
import RoundResultScreen from '@/components/screens/RoundResultScreen';
import WinnerScreen from '@/components/screens/WinnerScreen';
import { useGame } from '@/context/GameContext';

const Index: React.FC = () => {
  const { phase } = useGame();

  const renderScreen = () => {
    switch (phase) {
      case 'landing':
        return <LandingScreen />;
      case 'create':
        return <CreateRoomScreen />;
      case 'join':
        return <JoinRoomScreen />;
      case 'lobby':
        return <LobbyScreen />;
      case 'playing':
        return <GameScreen />;
      case 'roundResult':
        return <RoundResultScreen />;
      case 'winner':
        return <WinnerScreen />;
      default:
        return <LandingScreen />;
    }
  };

  return (
    <GameBackground>
      {renderScreen()}
    </GameBackground>
  );
};

export default Index;
