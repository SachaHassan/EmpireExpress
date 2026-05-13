import React from 'react';
import { IconBook, IconPrestige, IconConstruct, IconRecycle, IconEnergy, IconMaterial, IconScience } from './Icons';

export default function RulesModal({ onClose }) {
  return (
    <div className="modal-overlay fade-in" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div className="glass-panel slide-up" onClick={e => e.stopPropagation()} style={{
        maxWidth: 600, width: '100%', maxHeight: '85vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="title-lg"><IconBook size={28}/> Règles du Jeu</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="rules-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.95rem' }}>
          
          <section>
            <h3 className="title-md" style={{ color: 'var(--accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>Objectif</h3>
            <p><strong>Empire Express</strong> se joue en 5 manches. Développez votre cité futuriste en construisant des bâtiments pour marquer le plus de <strong>Points de Victoire (PV) <IconPrestige size={14}/></strong>. Chaque joueur commence avec une <strong>Carte Empire</strong> unique offrant des bonus.</p>
          </section>

          <section>
            <h3 className="title-md" style={{ color: 'var(--accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}><IconBook size={20}/> Phase 1 : Draft</h3>
            <p>Au début de la manche, vous recevez 5 cartes. Tout le monde joue en même temps :</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Choisissez <strong>une carte</strong> à garder.</li>
              <li>Passez le reste de votre main à votre voisin.</li>
              <li>Répétez 5 fois jusqu'à avoir 5 cartes draftées.</li>
            </ul>
          </section>

          <section>
            <h3 className="title-md" style={{ color: 'var(--accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>Phase 2 : Planification</h3>
            <p>Pour chacune des 5 cartes draftées, vous devez faire un choix décisif :</p>
            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', clipPath: 'var(--clip-angle)', marginTop: '0.5rem' }}>
              <p><strong><IconConstruct size={16}/> Construire :</strong> La carte rejoint vos chantiers en cours. Il faudra payer son coût avec des ressources.</p>
              <p style={{ marginTop: '0.5rem' }}><strong><IconRecycle size={16}/> Recycler :</strong> La carte est défaussée et vous offre <em>immédiatement</em> 1 ressource (indiquée en haut à droite). Placez cette ressource sur un chantier en cours !</p>
            </div>
          </section>

          <section>
            <h3 className="title-md" style={{ color: 'var(--accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>Phase 3 : Production</h3>
            <p>C'est la magie du jeu ! La production est <strong>séquentielle</strong>. Vous produisez dans cet ordre exact :</p>
            <ol style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', fontWeight: 600 }}>
              <li style={{ color: 'var(--energy)' }}><IconEnergy size={14}/> Énergie (Jaune)</li>
              <li style={{ color: 'var(--material)' }}><IconMaterial size={14}/> Matériaux (Gris)</li>
              <li style={{ color: 'var(--science)' }}><IconScience size={14}/> Savoir (Bleu)</li>
            </ol>
            <p style={{ marginTop: '0.5rem' }}><em>Astuce :</em> Si vous terminez un bâtiment pendant la phase d'Énergie, ce bâtiment produira dès la phase de Matériaux du même tour !</p>
          </section>

        </div>

        <button className="btn btn-primary w-full mt-3" onClick={onClose}>J'ai compris !</button>
      </div>
    </div>
  );
}
