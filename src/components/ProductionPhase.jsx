import React from 'react';
import { IconEnergy, IconMaterial, IconScience, IconFactory } from './Icons';

const STEP_INFO = {
  energy: { icon: <IconEnergy size={24}/>, label: 'Énergie', color: 'var(--energy)' },
  material: { icon: <IconMaterial size={24}/>, label: 'Matériaux', color: 'var(--material)' },
  science: { icon: <IconScience size={24}/>, label: 'Savoir', color: 'var(--science)' },
};

export default function ProductionPhase({ productionData, gameState }) {
  if (!productionData) {
    return (
      <div className="production-display fade-in">
        <div className="production-resource-icon"><IconFactory size={32}/></div>
        <h2 className="title-md mt-2">Production en cours...</h2>
        <p className="subtitle">Les ressources sont en train d'être produites</p>
      </div>
    );
  }

  const step = STEP_INFO[productionData.step] || STEP_INFO.energy;

  return (
    <div className="production-display fade-in">
      <div className="production-resource-icon" style={{ color: step.color }}>
        {step.icon}
      </div>
      <h2 className="title-md mt-2" style={{ color: step.color }}>
        Production : {step.label}
      </h2>

      <div className="production-results">
        {productionData.results && productionData.results.length > 0 ? (
          productionData.results.map((r, i) => (
            <div key={i} className="production-result-row slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <span style={{ fontWeight: 600 }}>{r.playerName}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                +{r.produced} {step.icon}
                {r.placements && r.placements.filter(p => !p.lost).map((p, j) => (
                  <span key={j} style={{ fontSize: '0.8rem', marginLeft: 8, color: 'var(--text-secondary)' }}>
                    → {p.cardName} ({p.amount})
                  </span>
                ))}
              </span>
            </div>
          ))
        ) : (
          <p className="subtitle" style={{ fontSize: '0.85rem' }}>Aucune production cette étape</p>
        )}
      </div>

      {/* Show completed buildings */}
      {gameState?.log?.filter(l => l.includes('termine')).slice(-3).map((l, i) => (
        <div key={i} className="slide-up mt-1" style={{
          color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem',
          animationDelay: `${0.5 + i * 0.15}s`
        }}>
          {l.replace('🏗️', '').trim()}
        </div>
      ))}
    </div>
  );
}
