import React from 'react';
import { IconEnergy, IconMaterial, IconScience, IconPrestige, IconRecycle } from './Icons';

const RESOURCE_ICONS = { 
  energy: <IconEnergy />, 
  material: <IconMaterial />, 
  science: <IconScience /> 
};
const RESOURCE_CLASSES = { energy: 'pip-energy', material: 'pip-material', science: 'pip-science' };
const CATEGORY_CLASSES = { energy: 'card-energy', material: 'card-material', science: 'card-science', prestige: 'card-prestige', empire: 'card-empire' };

function ResourcePips({ resources, small = false }) {
  const pips = [];
  for (const [type, count] of Object.entries(resources)) {
    for (let i = 0; i < count; i++) {
      pips.push(
        <span key={`${type}-${i}`} className={`pip ${RESOURCE_CLASSES[type]} ${small ? 'pip-sm' : ''}`}>
          {RESOURCE_ICONS[type]}
        </span>
      );
    }
  }
  return <>{pips}</>;
}

function ConstructionSlots({ cost, current }) {
  const slots = [];
  for (const [type, totalRequired] of Object.entries(cost)) {
    if (totalRequired === 0) continue;
    const filled = current[type] || 0;
    
    for (let i = 0; i < totalRequired; i++) {
      const isFilled = i < filled;
      slots.push(
        <span 
          key={`${type}-${i}`} 
          className={`pip ${RESOURCE_CLASSES[type]} pip-sm ${isFilled ? 'filled' : 'empty'}`}
          style={{ 
            opacity: 1, 
            border: isFilled ? 'none' : `1px solid var(--${type})`, 
            background: isFilled ? `var(--${type}-glow)` : `var(--${type}-bg)`,
            color: isFilled ? '#fff' : `var(--${type})`
          }}
        >
          {isFilled ? RESOURCE_ICONS[type] : <div style={{ opacity: 0.4 }}>{RESOURCE_ICONS[type]}</div>}
        </span>
      );
    }
  }
  return <div className="construction-slots">{slots}</div>;
}

export default function Card({ card, selected, onClick, mini = false, showProgress, progress, currentResources }) {
  if (!card) return null;

  const categoryClass = CATEGORY_CLASSES[card.category] || 'card-energy';

  if (mini) {
    return (
      <div className={`card-mini ${categoryClass}`} onClick={onClick}>
        <div className="card-name">{card.name}</div>
        {currentResources ? (
          <div style={{ marginTop: 4 }}>
            <ConstructionSlots cost={card.cost} current={currentResources} />
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
            <ResourcePips resources={card.production} small />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`card-game ${categoryClass} ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="card-header">
        <div className="card-cost">
          {card.category !== 'operation' && <ResourcePips resources={card.cost} small />}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {card.category !== 'operation' && (
            <div className="card-vp-small" style={{ display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'bold', fontSize: '0.9rem' }}>
              <IconPrestige size={14}/> {card.vp}
            </div>
          )}
          {!currentResources && !showProgress && (
            <div className="card-recycle" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <IconRecycle size={14}/> {RESOURCE_ICONS[card.recycle]}
            </div>
          )}
        </div>
      </div>

      <div className="card-name">{card.name}</div>

      {/* Construction Slots or Production */}
      {card.category === 'operation' ? (
        <div className="card-operation-desc" style={{ marginTop: 'auto', marginBottom: '1rem', fontSize: '0.75rem', textAlign: 'center', padding: '0 8px', color: '#ffcccc', fontStyle: 'italic' }}>
          {card.description}
        </div>
      ) : (currentResources || showProgress) ? (
        <div className="construction-progress-area mt-auto" style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px' }}>
          <ConstructionSlots cost={card.cost} current={currentResources || {}} />
        </div>
      ) : (
        <div className="card-production">
          {Object.values(card.production).some(v => v > 0) ? (
            <ResourcePips resources={card.production} />
          ) : (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>—</span>
          )}
        </div>
      )}
    </div>
  );
}

export { ResourcePips, RESOURCE_ICONS };
