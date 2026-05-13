import React, { useState } from 'react';
import Card from './Card';
import { IconConstruct, IconRecycle, IconBook } from './Icons';

export default function PlanningPhase({ gameState, onSubmit }) {
  const drafted = gameState?.myDrafted || [];
  const existingChantiers = gameState?.myConstructionZone || [];

  const [actions, setActions] = useState({}); // cardId -> 'construct' | 'recycle' | 'operation'
  const [placements, setPlacements] = useState({}); // recycledCardId -> targetCardId
  const [targets, setTargets] = useState({}); // operationCardId -> targetPlayerId

  const opponents = gameState?.players?.filter(p => p.id !== gameState.myId) || [];

  const setAction = (cardId, action) => {
    setActions(prev => ({ ...prev, [cardId]: action }));
    if (action === 'recycle') {
      // Create resource without auto-placing it
      setPlacements(prev => ({ ...prev, [cardId]: null }));
    } else if (action === 'operation') {
      // Auto-select first opponent if needed
      setTargets(prev => ({ ...prev, [cardId]: opponents.length > 0 ? opponents[0].id : null }));
      setPlacements(prev => { const n = { ...prev }; delete n[cardId]; return n; });
    } else {
      setPlacements(prev => { const n = { ...prev }; delete n[cardId]; return n; });
      setTargets(prev => { const n = { ...prev }; delete n[cardId]; return n; });
    }
  };

  const chantiers = [
    ...existingChantiers,
    ...drafted.filter(c => actions[c.id] === 'construct').map(card => ({
      card,
      resources: { energy: 0, material: 0, science: 0 }
    }))
  ];

  const recycledCards = drafted.filter(c => actions[c.id] === 'recycle');

  const handleDrop = (e, targetCardId) => {
    e.preventDefault();
    const recycledCardId = e.dataTransfer.getData('text/plain');
    const draggedCard = recycledCards.find(c => c.id === recycledCardId);
    if (draggedCard) {
      const targetChantier = chantiers.find(cz => {
        const cId = cz?.card?.id || cz?.id;
        return cId === targetCardId;
      });
      if (!targetChantier) return;
      
      const resourceType = draggedCard.recycle;
      const targetCardObj = targetChantier.card || targetChantier;
      const currentAmount = targetChantier.resources?.[resourceType] || 0;
      
      const alreadyDroppedHere = recycledCards
        .filter(c => c && placements[c.id] === targetCardId && c.recycle === resourceType)
        .length;
        
      if (currentAmount + alreadyDroppedHere >= (targetCardObj.cost[resourceType] || 0)) {
        return;
      }

      setPlacements(prev => ({ ...prev, [recycledCardId]: targetCardId }));
    }
  };

  const allDecided = drafted.every(c => actions[c.id]);

  const handleSubmit = () => {
    const result = drafted.map(card => ({
      cardId: card.id,
      action: actions[card.id] || (card.category === 'operation' ? 'operation' : 'construct'),
      targetCardId: placements[card.id] || null,
      targetPlayerId: targets[card.id] || null
    }));
    onSubmit(result);
  };

  const undecidedCards = drafted.filter(c => !actions[c.id]);

  return (
    <div className="fade-in w-full pb-5">
      <div className="text-center mb-3">
        <h2 className="title-md"><IconBook size={24}/> Phase de Planification</h2>
        <p className="subtitle" style={{ fontSize: '0.9rem' }}>
          Construisez ou recyclez vos cartes. Glissez-déposez les ressources recyclées !
        </p>
      </div>

      {/* Cartes à décider */}
      {undecidedCards.length > 0 && (
        <div className="glass-panel mb-4" style={{ padding: '1rem' }}>
          <h3 className="board-section-title justify-center">À Planifier ({undecidedCards.length})</h3>
          <div className="hand justify-center">
            {undecidedCards.map((card) => (
              <div key={card.id} className="planning-card-wrapper slide-up">
                <Card card={card} />
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  {card.category === 'operation' ? (
                    <button className="planning-action action-construct" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => setAction(card.id, 'operation')}>
                      <IconBook size={16}/> Déclencher
                    </button>
                  ) : (
                    <button className="planning-action action-construct" onClick={() => setAction(card.id, 'construct')}>
                      <IconConstruct size={16}/> Construire
                    </button>
                  )}
                  <button className="planning-action action-recycle" onClick={() => setAction(card.id, 'recycle')}>
                    <IconRecycle size={16}/> Recycler
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opérations (Target Selection) */}
      {drafted.filter(c => actions[c.id] === 'operation').length > 0 && (
        <div className="glass-panel mb-3" style={{ padding: '1rem', border: '1px solid var(--danger)' }}>
          <h3 className="board-section-title" style={{ color: 'var(--danger)' }}><IconBook size={20}/> Opérations Secrètes</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {drafted.filter(c => actions[c.id] === 'operation').map(card => (
              <div key={card.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
                <Card card={card} />
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                  <label style={{ fontSize: '0.7rem', display: 'block', marginBottom: '4px' }}>Cible :</label>
                  {card.operationType === 'global_energy_boost' ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tous les joueurs</div>
                  ) : (
                    <select 
                      value={targets[card.id] || ''} 
                      onChange={(e) => setTargets(prev => ({ ...prev, [card.id]: e.target.value }))}
                      style={{ background: 'var(--bg-glass)', color: '#fff', border: '1px solid var(--danger)', borderRadius: '4px', padding: '2px 4px', width: '100%', fontSize: '0.8rem' }}
                    >
                      {opponents.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{ position: 'absolute', top: -10, right: -10, padding: '2px 6px', fontSize: '0.6rem', background: 'var(--danger)', color: 'white', border: 'none' }} 
                  onClick={() => setAction(card.id, null)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Ressources Recyclées (Draggable & Droppable to unassign) */}
        <div 
          className="glass-panel" 
          style={{ padding: '1rem', minHeight: '200px', border: '2px dashed transparent', transition: 'border 0.2s' }}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.currentTarget.style.borderColor = 'var(--danger)'}
          onDragLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = 'transparent';
            const recycledCardId = e.dataTransfer.getData('text/plain');
            if (recycledCardId) {
              setPlacements(prev => { const n = { ...prev }; delete n[recycledCardId]; return n; });
            }
          }}
        >
          <h3 className="board-section-title" style={{ color: 'var(--danger)' }}><IconRecycle size={20}/> Recyclage</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Faites glisser les ressources vers vos chantiers.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {recycledCards.length === 0 && <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>Aucune carte recyclée</span>}
            {recycledCards.map(card => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', card.id);
                  e.currentTarget.style.opacity = '0.5';
                }}
                onDragEnd={(e) => e.currentTarget.style.opacity = '1'}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                  cursor: 'grab', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px',
                  border: placements[card.id] ? '1px solid var(--border)' : '1px solid var(--accent)',
                  boxShadow: placements[card.id] ? 'none' : '0 0 10px var(--accent-glow)'
                }}
              >
                <span className={`pip pip-${card.recycle}`} style={{ width: 30, height: 30, fontSize: '1rem' }} />
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>De: {card.name}</span>
                <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '0.6rem', marginTop: '4px' }} onClick={() => setAction(card.id, null)}>Annuler</button>
              </div>
            ))}
          </div>
        </div>

        {/* Chantiers (Droppable) */}
        <div className="glass-panel" style={{ padding: '1rem', minHeight: '200px' }}>
          <h3 className="board-section-title" style={{ color: 'var(--accent)' }}><IconConstruct size={20}/> Vos Chantiers</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {chantiers.length === 0 && <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>Aucun chantier</span>}
            {chantiers.map((cz, idx) => {
              const card = cz?.card || cz; // Safely resolve card
              if (!card || !card.id) return null; // Prevent crash if invalid object
              
              const placedHere = recycledCards.filter(c => c && placements[c.id] === card.id);
              
              const previewResources = cz?.resources ? { ...cz.resources } : { energy: 0, material: 0, science: 0 };
              placedHere.forEach(c => {
                previewResources[c.recycle] = (previewResources[c.recycle] || 0) + 1;
              });
              
              return (
                <div
                  key={card.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, card.id)}
                  style={{
                    position: 'relative',
                    border: '2px dashed transparent',
                    borderRadius: '12px',
                    transition: 'border 0.2s',
                  }}
                  onDragEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onDragLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <Card card={card} currentResources={previewResources} />
                  
                  {drafted.find(c => c && c.id === card.id) && (
                    <button 
                      className="btn btn-secondary" 
                      style={{ position: 'absolute', top: -10, right: -10, padding: '2px 6px', fontSize: '0.6rem', background: 'var(--danger)', color: 'white', border: 'none' }} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setAction(card.id, null);
                        setPlacements(prev => {
                          const newP = { ...prev };
                          Object.keys(newP).forEach(k => {
                            if (newP[k] === card.id) delete newP[k];
                          });
                          return newP;
                        });
                      }}
                    >✕</button>
                  )}

                  {/* Indicateurs des ressources recyclées affectées ce tour */}
                  {placedHere.length > 0 && (
                    <div style={{ position: 'absolute', bottom: -15, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px', background: 'var(--bg-glass)', border: '1px solid var(--accent)', padding: '4px 8px', borderRadius: '12px', zIndex: 10, boxShadow: '0 0 10px var(--accent-glow)' }}>
                      {placedHere.map((c, i) => (
                        <span key={`${c.id}-${i}`} className={`pip pip-${c.recycle} pip-sm filled`} style={{ width: 20, height: 20, fontSize: '0.8rem' }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={!allDecided}
          style={{ boxShadow: allDecided ? '0 0 20px var(--accent-glow)' : 'none' }}
        >
          Valider la planification
        </button>
      </div>
    </div>
  );
}
