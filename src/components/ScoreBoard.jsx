import React from 'react';
import { IconPrestige, IconFactory } from './Icons';

export default function ScoreBoard({ scores, onReplay, onHome }) {
  if (!scores || scores.length === 0) return null;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="page page-center">
      <div className="bg-animated" />
      <div className="scoreboard fade-in" style={{ textAlign: 'center' }}>
        <h1 className="title-xl mb-2" style={{ fontSize: '2.5rem' }}>🏆 Fin de partie !</h1>
        <p className="subtitle mb-3">Voici les scores finaux</p>

        {scores.map((s, i) => (
          <div key={s.id} className="score-row slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="score-rank">
              {medals[i] || `${i + 1}.`}
            </div>
            <div className="score-name">{s.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '1rem' }}>
              {s.buildingCount} bâtiment{s.buildingCount > 1 ? 's' : ''}
            </div>
            <div className="score-vp"><IconPrestige size={16}/> {s.totalVP}</div>
          </div>
        ))}

        {scores[0] && (
          <div className="glass-panel mt-3" style={{ textAlign: 'left' }}>
            <h3 className="title-md mb-2"><IconFactory size={20}/> Bâtiments de {scores[0].name}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {scores[0].buildings.map((b, i) => (
                <div key={i} style={{
                  padding: '0.4rem 0.8rem',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  fontSize: '0.8rem',
                }}>
                  {b.name} <strong style={{ color: 'var(--energy)' }}><IconPrestige size={12}/>{b.vp}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-3 justify-center">
          <button className="btn btn-primary btn-lg" onClick={onReplay} id="btn-replay">
            🔄 Rejouer
          </button>
          <button className="btn btn-secondary btn-lg" onClick={onHome} id="btn-back-home-score">
            🏠 Accueil
          </button>
        </div>
      </div>
    </div>
  );
}
