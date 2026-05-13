import React, { useState } from 'react';
import Card from './Card';

export default function DraftPhase({ gameState, onPick }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const hand = gameState?.myHand || [];
  const draftStep = gameState?.draftStep || 0;

  const handleConfirm = () => {
    if (selectedCard) {
      onPick(selectedCard);
      setSelectedCard(null);
    }
  };

  return (
    <div className="fade-in" style={{ width: '100%' }}>
      <div className="text-center mb-3">
        <h2 className="title-md">Phase de Draft</h2>
        <p className="subtitle" style={{ fontSize: '0.9rem' }}>
          Choisis 1 carte parmi {hand.length} • Tour {draftStep + 1}/5
        </p>
      </div>

      <div className="hand">
        {hand.map((card) => (
          <Card
            key={card.id}
            card={card}
            selected={selectedCard === card.id}
            onClick={() => setSelectedCard(card.id)}
          />
        ))}
      </div>

      <div className="text-center mt-3">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleConfirm}
          disabled={!selectedCard}
          id="btn-draft-confirm"
        >
          Choisir cette carte
        </button>
      </div>
    </div>
  );
}
