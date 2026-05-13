import Card from './Card';
import { IconEnergy, IconMaterial, IconScience, IconPrestige, IconConstruct, IconFactory } from './Icons';

export default function PlayerBoard({ player, isMe }) {
  if (!player) return null;

  const constructionZone = player.constructionZone || [];
  const completedBuildings = player.completedBuildings || [];

  const getProgress = (cz) => {
    const totalCost = cz.card.cost.energy + cz.card.cost.material + cz.card.cost.science;
    if (totalCost === 0) return 100;
    const filled = cz.resources.energy + cz.resources.material + cz.resources.science;
    return Math.round((filled / totalCost) * 100);
  };

  const totalVP = completedBuildings.reduce((sum, b) => sum + b.vp, 0);

  // Calculate total production
  const production = { energy: 0, material: 0, science: 0 };
  completedBuildings.forEach(b => {
    if (b.production) {
      production.energy += b.production.energy || 0;
      production.material += b.production.material || 0;
      production.science += b.production.science || 0;
    }
  });

  return (
    <div className="player-board fade-in">
      {/* Production Summary */}
      <div className="glass-panel text-center mb-3 p-2" style={{ 
        display: 'flex', justifyContent: 'center', gap: '2rem', 
        border: '1px solid var(--accent)', boxShadow: '0 0 10px rgba(78, 205, 196, 0.2)' 
      }}>
        <div style={{ fontWeight: 600 }}><IconFactory size={18}/> Production Actuelle :</div>
        <div style={{ color: 'var(--energy)', fontWeight: 600 }}><IconEnergy size={16}/> {production.energy}</div>
        <div style={{ color: 'var(--material)', fontWeight: 600 }}><IconMaterial size={16}/> {production.material}</div>
        <div style={{ color: 'var(--science)', fontWeight: 600 }}><IconScience size={16}/> {production.science}</div>
      </div>

      <div className="board-section">
        <div className="board-section-title">
          <IconConstruct size={20}/> Chantiers en cours ({constructionZone.length}) {isMe ? '' : `de ${player.name}`}
        </div>
        <div className="construction-cards">
          {constructionZone.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Aucun chantier</p>
          )}
          {constructionZone.map((cz) => (
            <div key={cz.card.id} className="construction-site">
              <Card
                card={cz.card}
                showProgress
                progress={getProgress(cz)}
                currentResources={cz.resources}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="board-section mt-3">
        <div className="board-section-title">
          <IconFactory size={20}/> Bâtiments terminés ({completedBuildings.length}) — <IconPrestige size={16}/> {totalVP} PV
        </div>
        <div className="completed-cards">
          {completedBuildings.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Aucun bâtiment</p>
          )}
          {completedBuildings.map((card, i) => (
            <Card key={`${card.id}-${i}`} card={card} mini />
          ))}
        </div>
      </div>
    </div>
  );
}
