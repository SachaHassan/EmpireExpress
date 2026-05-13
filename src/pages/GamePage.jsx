import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useSocket } from '../hooks/useSocket';
import DraftPhase from '../components/DraftPhase';
import PlanningPhase from '../components/PlanningPhase';
import ProductionPhase from '../components/ProductionPhase';
import PlayerBoard from '../components/PlayerBoard';
import RulesModal from '../components/RulesModal';
import { IconBook, IconPlayer, IconBot, IconEye } from '../components/Icons';

export default function GamePage() {
  const { gameState, setGameState, productionData, setProductionData, goToScores } = useGame();
  const { emit, on } = useSocket();
  const [showRules, setShowRules] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  useEffect(() => {
    const unsub1 = on('game-state', (state) => setGameState(state));
    const unsub2 = on('production-step', (data) => setProductionData(data));
    const unsub3 = on('game-over', ({ scores }) => goToScores(scores));
    return () => { unsub1(); unsub2(); unsub3(); };
  }, [on]);

  if (!gameState) {
    return (
      <div className="page page-center">
        <p className="subtitle">Chargement de la partie...</p>
      </div>
    );
  }

  const phase = gameState.phase;
  const round = gameState.round;

  const handleDraftPick = async (cardId) => {
    const res = await emit('draft-pick', { cardId });
    if (res.error) console.error(res.error);
  };

  const handlePlanningSubmit = async (decisions) => {
    const res = await emit('planning-done', { decisions });
    if (res.error) console.error(res.error);
  };

  // Phase steps for indicator
  const phases = [
    { key: 'draft', label: 'Draft' },
    { key: 'planning', label: 'Planification' },
    { key: 'production', label: 'Production' },
  ];

  return (
    <div className="app-container">
      {/* Phase Bar */}
      <div className="phase-bar">
        <div style={{ fontWeight: 700, marginRight: '1rem', color: 'var(--energy)' }}>
          Manche {round}/{gameState.totalRounds}
        </div>
        {phases.map((p) => {
          let status = '';
          const phaseOrder = ['draft', 'planning', 'production'];
          const currentIdx = phaseOrder.indexOf(phase);
          const thisIdx = phaseOrder.indexOf(p.key);
          if (thisIdx < currentIdx) status = 'done';
          else if (p.key === phase) status = 'active';

          return (
            <div key={p.key} className={`phase-step ${status}`}>
              <div className="phase-dot" />
              {p.label}
            </div>
          );
        })}

        {/* Mini player tabs */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', fontSize: '0.8rem', alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowRules(true)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IconBook size={14}/> Règles
          </button>
          {gameState.players?.map(p => {
            const isMe = p.id === gameState.myId;
            const isSelected = (selectedPlayerId || gameState.myId) === p.id;
            
            return (
              <button 
                key={p.id} 
                className="btn btn-sm"
                onClick={() => setSelectedPlayerId(p.id)}
                style={{
                  background: isSelected ? (isMe ? 'var(--accent)' : 'var(--danger)') : 'rgba(255,255,255,0.1)',
                  color: isSelected ? '#000' : 'var(--text-primary)',
                  fontWeight: isSelected ? 700 : 500,
                  padding: '0.2rem 0.6rem',
                  border: 'none',
                  borderRadius: '12px'
                }}
              >
                <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                  {p.isBot ? <IconBot size={14}/> : <IconPlayer size={14}/>} {isMe ? 'Moi' : p.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="page" style={{ paddingTop: '1rem' }}>
        {/* Active Phase */}
        {phase === 'draft' && (
          <DraftPhase gameState={gameState} onPick={handleDraftPick} />
        )}

        {phase === 'planning' && (
          <PlanningPhase gameState={gameState} onSubmit={handlePlanningSubmit} />
        )}

        {(phase === 'production' || phase === 'production_end') && (
          <ProductionPhase productionData={productionData} gameState={gameState} />
        )}

        {phase === 'waiting' && (
          <div className="text-center">
            <p className="subtitle">⏳ En attente...</p>
          </div>
        )}

        {/* Player Board (switchable via tabs) */}
        <div className="mt-4 w-full" style={{ maxWidth: 900, margin: '1.5rem auto 0' }}>
          {(() => {
            const displayedPlayerId = selectedPlayerId || gameState.myId;
            const isMe = displayedPlayerId === gameState.myId;
            const displayedPlayer = isMe 
              ? {
                  ...gameState.players.find(p => p.id === gameState.myId),
                  constructionZone: gameState.myConstructionZone,
                  completedBuildings: gameState.myCompletedBuildings
                }
              : gameState.players.find(p => p.id === displayedPlayerId);
            
            return (
              <>
                {!isMe && (
                  <div className="text-center mb-2" style={{ color: 'var(--danger)', fontWeight: 600, animation: 'pulse 2s infinite', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <IconEye size={18}/> Mode Espion : Vous regardez le plateau de {displayedPlayer.name}
                  </div>
                )}
                <PlayerBoard player={displayedPlayer} isMe={isMe} />
              </>
            );
          })()}
        </div>

        {/* Game Log */}
        {gameState.log && gameState.log.length > 0 && (
          <div className="game-log mt-3" style={{ margin: '1.5rem auto' }}>
            {gameState.log.map((entry, i) => (
              <div key={i} className="log-entry">{entry}</div>
            ))}
          </div>
        )}

        {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      </div>
    </div>
  );
}
