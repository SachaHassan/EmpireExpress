import { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [screen, setScreen] = useState('home'); // home, lobby, game, scores
  const [roomCode, setRoomCode] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [scores, setScores] = useState(null);
  const [productionData, setProductionData] = useState(null);

  const goToLobby = useCallback((code, info, host = false) => {
    setRoomCode(code);
    setRoomInfo(info);
    setIsHost(host);
    setScreen('lobby');
  }, []);

  const goToGame = useCallback((state) => {
    setGameState(state);
    setScreen('game');
  }, []);

  const goToScores = useCallback((s) => {
    setScores(s);
    setScreen('scores');
  }, []);

  const goHome = useCallback(() => {
    setScreen('home');
    setRoomCode(null);
    setRoomInfo(null);
    setGameState(null);
    setScores(null);
    setProductionData(null);
  }, []);

  return (
    <GameContext.Provider value={{
      screen, setScreen,
      roomCode, setRoomCode,
      roomInfo, setRoomInfo,
      gameState, setGameState,
      playerName, setPlayerName,
      isHost, setIsHost,
      scores, setScores,
      productionData, setProductionData,
      goToLobby, goToGame, goToScores, goHome,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
