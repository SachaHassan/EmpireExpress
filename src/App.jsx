import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import ScoreBoard from './components/ScoreBoard';

function AppContent() {
  const { screen, scores, goHome, goToLobby, roomCode, isHost } = useGame();

  const handleReplay = () => {
    // Go back to lobby to start a new game
    goToLobby(roomCode, null, isHost);
  };

  switch (screen) {
    case 'home':
      return <HomePage />;
    case 'lobby':
      return <LobbyPage />;
    case 'game':
      return <GamePage />;
    case 'scores':
      return <ScoreBoard scores={scores} onReplay={handleReplay} onHome={goHome} />;
    default:
      return <HomePage />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <div className="app-container">
        <AppContent />
      </div>
    </GameProvider>
  );
}
