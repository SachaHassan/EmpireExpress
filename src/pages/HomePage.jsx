import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useSocket } from '../hooks/useSocket';
import RulesModal from '../components/RulesModal';
import { IconBook, IconBot, IconFactory } from '../components/Icons';

export default function HomePage() {
  const { setPlayerName, playerName, goToLobby } = useGame();
  const { emit, connected } = useSocket();
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [showRules, setShowRules] = useState(false);

  const handleCreate = async () => {
    if (!playerName.trim()) return setError('Entre ton pseudo !');
    const res = await emit('create-room', { playerName: playerName.trim() });
    if (res.error) return setError(res.error);
    goToLobby(res.code, res.room, true);
  };

  const handleJoin = async () => {
    if (!playerName.trim()) return setError('Entre ton pseudo !');
    if (!joinCode.trim()) return setError('Entre le code du salon !');
    const res = await emit('join-room', { roomCode: joinCode.trim().toUpperCase(), playerName: playerName.trim() });
    if (res.error) return setError(res.error);
    goToLobby(joinCode.trim().toUpperCase(), res.room, false);
  };

  const handleSolo = async () => {
    if (!playerName.trim()) return setError('Entre ton pseudo !');
    const res = await emit('create-room', { playerName: playerName.trim() });
    if (res.error) return setError(res.error);
    // Add 1 bot by default
    await emit('add-bot', { difficulty: 'normal' });
    goToLobby(res.code, res.room, true);
  };

  return (
    <div className="page page-center">
      <div className="bg-animated" />
      <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }} className="fade-in">
        <div className="title-xl mb-3" style={{ fontSize: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <IconFactory size={48} style={{ color: 'var(--accent)' }}/> Empire Express
        </div>
        <p className="subtitle mb-3">
          Construis ta cité futuriste • Drafte, Planifie, Produis !
        </p>

        <button className="btn btn-secondary btn-sm mb-3" onClick={() => setShowRules(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <IconBook size={16}/> Règles du jeu
        </button>

        {!connected && (
          <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            ⚠️ Connexion au serveur en cours...
          </div>
        )}

        <div className="glass-panel mb-3">
          <input
            className="input mb-2"
            type="text"
            placeholder="Ton pseudo..."
            value={playerName}
            onChange={(e) => { setPlayerName(e.target.value); setError(''); }}
            maxLength={20}
            id="input-player-name"
          />

          {error && (
            <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button className="btn btn-primary btn-lg w-full" onClick={handleCreate} disabled={!connected} id="btn-create-room">
              Créer une partie
            </button>

            <button className="btn btn-secondary w-full" onClick={handleSolo} disabled={!connected} id="btn-solo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <IconBot size={20}/> Solo vs Bot
            </button>

            <div style={{ borderTop: '1px solid var(--border)', margin: '0.5rem 0', paddingTop: '0.75rem' }}>
              <div className="flex gap-1">
                <input
                  className="input"
                  type="text"
                  placeholder="Code du salon..."
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={4}
                  style={{ textAlign: 'center', letterSpacing: '0.2em', fontWeight: 700 }}
                  id="input-room-code"
                />
                <button className="btn btn-secondary" onClick={handleJoin} disabled={!connected} id="btn-join-room">
                  Rejoindre
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
          <div className="flex items-center gap-1" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span className="pip pip-energy pip-sm">⚡</span> Énergie
          </div>
          <div className="flex items-center gap-1" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span className="pip pip-material pip-sm">⚙️</span> Matériaux
          </div>
          <div className="flex items-center gap-1" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span className="pip pip-science pip-sm">🧪</span> Savoir
          </div>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          2–5 joueurs • 15 min • Projet MIAGE
        </p>

        {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      </div>
    </div>
  );
}
