import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useSocket } from '../hooks/useSocket';
import { IconPlayer, IconBot } from '../components/Icons';

export default function LobbyPage() {
  const { roomCode, roomInfo, setRoomInfo, isHost, goToGame, goHome } = useGame();
  const { emit, on } = useSocket();
  const [botDifficulty, setBotDifficulty] = useState('normal');

  useEffect(() => {
    // Fetch fresh room info
    const unsub1 = on('room-updated', (info) => setRoomInfo(info));
    const unsub2 = on('game-started', (state) => goToGame(state));
    const unsub3 = on('room-closed', () => goHome());

    // Refresh room info on mount if we don't have it
    if (!roomInfo && roomCode) {
      emit('join-room', { roomCode, playerName: '' }).then(res => {
        if (res.room) setRoomInfo(res.room);
      });
    }

    return () => { unsub1(); unsub2(); unsub3(); };
  }, [on, roomCode]);

  const allPlayers = roomInfo
    ? [...(roomInfo.players || []), ...(roomInfo.bots || [])]
    : [];

  const handleAddBot = async () => {
    const res = await emit('add-bot', { difficulty: botDifficulty });
    if (res.error) console.error(res.error);
  };

  const handleRemoveBot = async (botId) => {
    await emit('remove-bot', { botId });
  };

  const handleStart = async () => {
    const res = await emit('start-game', {});
    if (res.error) alert(res.error);
  };

  return (
    <div className="page page-center">
      <div className="bg-animated" />
      <div className="lobby-container fade-in">
        <button className="btn btn-secondary btn-sm mb-3" onClick={goHome} id="btn-back-home">
          ← Retour
        </button>

        <h1 className="title-lg text-center mb-2">Salon de jeu</h1>

        <div className="room-code mb-3" id="room-code-display">
          {roomCode || '...'}
        </div>
        <p className="text-center subtitle mb-3" style={{ fontSize: '0.85rem' }}>
          Partage ce code à tes amis pour qu'ils rejoignent !
        </p>

        <div className="glass-panel mb-3">
          <div className="board-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IconPlayer size={20}/> Joueurs ({allPlayers.length}/5)
          </div>

          <div className="player-list">
            {allPlayers.map((p) => (
              <div className="player-item" key={p.id}>
                <div className="player-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {p.isBot ? <IconBot size={18}/> : <IconPlayer size={18}/>} {p.name}
                  {roomInfo?.hostId === p.id && (
                    <span className="player-badge badge-host">Hôte</span>
                  )}
                  {p.isBot && (
                    <span className="player-badge badge-bot">{p.difficulty || 'normal'}</span>
                  )}
                </div>
                {isHost && p.isBot && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveBot(p.id)}
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {isHost && allPlayers.length < 5 && (
            <div className="flex gap-1 mt-2" style={{ alignItems: 'center' }}>
              <select
                className="input"
                value={botDifficulty}
                onChange={(e) => setBotDifficulty(e.target.value)}
                style={{ flex: 1 }}
                id="select-bot-difficulty"
              >
                <option value="easy">Facile</option>
                <option value="normal">Normal</option>
                <option value="hard">Difficile</option>
              </select>
              <button className="btn btn-secondary" onClick={handleAddBot} id="btn-add-bot">
                + Bot
              </button>
            </div>
          )}
        </div>

        {isHost && (
          <button
            className="btn btn-primary btn-lg w-full"
            onClick={handleStart}
            disabled={allPlayers.length < 2}
            id="btn-start-game"
          >
            Lancer la partie
          </button>
        )}

        {!isHost && (
          <div className="text-center subtitle" style={{ fontSize: '0.9rem' }}>
            En attente du lancement par l'hôte...
          </div>
        )}
      </div>
    </div>
  );
}
