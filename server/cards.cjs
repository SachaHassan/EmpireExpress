// ============================================================
// Empire Express — Définitions des 70 cartes
// Thème : Cité Futuriste
// ============================================================

const CARDS = [
  // ===================== EMPIRE (5 cartes) =====================
  { id: 'emp_republique', name: 'République Solaire', tier: 0, category: 'empire',
    cost: { energy: 0, material: 0, science: 0 }, recycle: 'energy',
    production: { energy: 2, material: 0, science: 0 }, vp: 0,
    vpBonus: { type: 'energy', value: 1 } },
  { id: 'emp_federation', name: 'Fédération Marchande', tier: 0, category: 'empire',
    cost: { energy: 0, material: 0, science: 0 }, recycle: 'material',
    production: { energy: 1, material: 1, science: 0 }, vp: 0,
    vpBonus: { type: 'material', value: 1 } },
  { id: 'emp_alliance', name: 'Alliance Quantique', tier: 0, category: 'empire',
    cost: { energy: 0, material: 0, science: 0 }, recycle: 'science',
    production: { energy: 0, material: 1, science: 1 }, vp: 0,
    vpBonus: { type: 'science', value: 2 } },
  { id: 'emp_militaire', name: 'Empire Militaire', tier: 0, category: 'empire',
    cost: { energy: 0, material: 0, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 2, science: 0 }, vp: 0,
    vpBonus: { type: 'prestige', value: 1 } },
  { id: 'emp_technocratie', name: 'Technocratie', tier: 0, category: 'empire',
    cost: { energy: 0, material: 0, science: 0 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 2 }, vp: 0,
    vpBonus: { type: 'building', value: 0.5 } }, // e.g. 0.5 points per building (1 for 2)

  // ===================== ÉNERGIE (22 cartes) =====================
  // Tier 1 — Fondations
  { id: 'solar_panel', name: 'Panneau Solaire', tier: 1, category: 'energy',
    cost: { energy: 1, material: 0, science: 0 }, recycle: 'energy',
    production: { energy: 1, material: 0, science: 0 }, vp: 1 },
  { id: 'wind_generator', name: 'Générateur Éolien', tier: 1, category: 'energy',
    cost: { energy: 2, material: 0, science: 0 }, recycle: 'energy',
    production: { energy: 2, material: 0, science: 0 }, vp: 0 },
  { id: 'quantum_battery', name: 'Batterie Quantique', tier: 1, category: 'energy',
    cost: { energy: 1, material: 0, science: 0 }, recycle: 'energy',
    production: { energy: 1, material: 0, science: 0 }, vp: 0 },
  { id: 'plasma_collector', name: 'Collecteur Plasma', tier: 1, category: 'energy',
    cost: { energy: 1, material: 0, science: 0 }, recycle: 'material',
    production: { energy: 1, material: 0, science: 0 }, vp: 1 },
  { id: 'micro_reactor', name: 'Micro-Réacteur', tier: 1, category: 'energy',
    cost: { energy: 2, material: 0, science: 0 }, recycle: 'energy',
    production: { energy: 1, material: 0, science: 0 }, vp: 2 },
  { id: 'superconductor', name: 'Câble Supraconducteur', tier: 1, category: 'energy',
    cost: { energy: 1, material: 1, science: 0 }, recycle: 'energy',
    production: { energy: 1, material: 0, science: 0 }, vp: 1 },
  { id: 'charging_station', name: 'Station de Charge', tier: 1, category: 'energy',
    cost: { energy: 1, material: 0, science: 0 }, recycle: 'energy',
    production: { energy: 1, material: 0, science: 0 }, vp: 0 },
  { id: 'photovoltaic_cell', name: 'Cellule Photovoltaïque', tier: 1, category: 'energy',
    cost: { energy: 2, material: 0, science: 0 }, recycle: 'energy',
    production: { energy: 1, material: 1, science: 0 }, vp: 0 },

  // Tier 2 — Développement
  { id: 'fusion_plant', name: 'Centrale Fusion', tier: 2, category: 'energy',
    cost: { energy: 3, material: 0, science: 0 }, recycle: 'energy',
    production: { energy: 2, material: 0, science: 0 }, vp: 2 },
  { id: 'arc_reactor', name: 'Réacteur à Arc', tier: 2, category: 'energy',
    cost: { energy: 2, material: 1, science: 0 }, recycle: 'energy',
    production: { energy: 2, material: 0, science: 0 }, vp: 2 },
  { id: 'magnetic_turbine', name: 'Turbine Magnétique', tier: 2, category: 'energy',
    cost: { energy: 3, material: 0, science: 0 }, recycle: 'material',
    production: { energy: 2, material: 1, science: 0 }, vp: 1 },
  { id: 'solar_converter', name: 'Convertisseur Solaire', tier: 2, category: 'energy',
    cost: { energy: 2, material: 1, science: 0 }, recycle: 'energy',
    production: { energy: 1, material: 1, science: 0 }, vp: 2 },
  { id: 'ionic_accumulator', name: 'Accumulateur Ionique', tier: 2, category: 'energy',
    cost: { energy: 3, material: 0, science: 0 }, recycle: 'energy',
    production: { energy: 3, material: 0, science: 0 }, vp: 0 },
  { id: 'orbital_dynamo', name: 'Dynamo Orbitale', tier: 2, category: 'energy',
    cost: { energy: 2, material: 2, science: 0 }, recycle: 'energy',
    production: { energy: 2, material: 0, science: 0 }, vp: 3 },
  { id: 'geothermal_well', name: 'Puits Géothermique', tier: 2, category: 'energy',
    cost: { energy: 3, material: 1, science: 0 }, recycle: 'material',
    production: { energy: 2, material: 1, science: 0 }, vp: 2 },
  { id: 'energy_grid', name: 'Réseau Énergétique', tier: 2, category: 'energy',
    cost: { energy: 4, material: 0, science: 0 }, recycle: 'energy',
    production: { energy: 3, material: 0, science: 0 }, vp: 2 },

  // Tier 3 — Avancé
  { id: 'dyson_sphere', name: 'Sphère de Dyson', tier: 3, category: 'energy',
    cost: { energy: 4, material: 2, science: 0 }, recycle: 'energy',
    production: { energy: 3, material: 0, science: 0 }, vp: 5 },
  { id: 'artificial_star', name: 'Étoile Artificielle', tier: 3, category: 'energy',
    cost: { energy: 5, material: 2, science: 0 }, recycle: 'energy',
    production: { energy: 2, material: 1, science: 0 }, vp: 5 },
  { id: 'antimatter_reactor', name: 'Réacteur Antimatière', tier: 3, category: 'energy',
    cost: { energy: 4, material: 3, science: 0 }, recycle: 'material',
    production: { energy: 3, material: 1, science: 0 }, vp: 4 },
  { id: 'dimensional_plant', name: 'Centrale Dimensionnelle', tier: 3, category: 'energy',
    cost: { energy: 5, material: 1, science: 1 }, recycle: 'energy',
    production: { energy: 2, material: 0, science: 0 }, vp: 6 },
  { id: 'energy_matrix', name: 'Matrice Énergétique', tier: 3, category: 'energy',
    cost: { energy: 3, material: 2, science: 1 }, recycle: 'science',
    production: { energy: 2, material: 0, science: 1 }, vp: 4 },
  { id: 'hyperplant', name: 'Hypercentrale', tier: 3, category: 'energy',
    cost: { energy: 5, material: 3, science: 0 }, recycle: 'energy',
    production: { energy: 4, material: 0, science: 0 }, vp: 4 },

  // ===================== MATÉRIAUX (22 cartes) =====================
  // Tier 1
  { id: 'urban_mine', name: 'Mine Urbaine', tier: 1, category: 'material',
    cost: { energy: 1, material: 1, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 1, science: 0 }, vp: 1 },
  { id: 'foundry', name: 'Fonderie', tier: 1, category: 'material',
    cost: { energy: 1, material: 1, science: 0 }, recycle: 'energy',
    production: { energy: 0, material: 1, science: 0 }, vp: 2 },
  { id: 'mech_workshop', name: 'Atelier Mécanique', tier: 1, category: 'material',
    cost: { energy: 0, material: 2, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 1, science: 0 }, vp: 1 },
  { id: 'molecular_recycler', name: 'Recycleur Moléculaire', tier: 1, category: 'material',
    cost: { energy: 1, material: 0, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 1, science: 0 }, vp: 0 },
  { id: 'ore_extractor', name: 'Extracteur de Minerai', tier: 1, category: 'material',
    cost: { energy: 0, material: 2, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 2, science: 0 }, vp: 0 },
  { id: 'printer_3d', name: 'Imprimante 3D', tier: 1, category: 'material',
    cost: { energy: 1, material: 1, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 1, science: 0 }, vp: 1 },
  { id: 'plasma_forge', name: 'Forge Plasma', tier: 1, category: 'material',
    cost: { energy: 2, material: 0, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 1, science: 0 }, vp: 1 },
  { id: 'auto_warehouse', name: 'Entrepôt Automatisé', tier: 1, category: 'material',
    cost: { energy: 0, material: 1, science: 0 }, recycle: 'energy',
    production: { energy: 0, material: 1, science: 0 }, vp: 0 },

  // Tier 2
  { id: 'auto_factory', name: 'Usine Automatisée', tier: 2, category: 'material',
    cost: { energy: 2, material: 1, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 2, science: 0 }, vp: 2 },
  { id: 'industrial_complex', name: 'Complexe Industriel', tier: 2, category: 'material',
    cost: { energy: 2, material: 2, science: 0 }, recycle: 'material',
    production: { energy: 1, material: 2, science: 0 }, vp: 3 },
  { id: 'quantum_refinery', name: 'Raffinerie Quantique', tier: 2, category: 'material',
    cost: { energy: 1, material: 3, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 2, science: 1 }, vp: 2 },
  { id: 'assembly_line', name: 'Chaîne de Montage', tier: 2, category: 'material',
    cost: { energy: 2, material: 2, science: 0 }, recycle: 'energy',
    production: { energy: 0, material: 2, science: 0 }, vp: 3 },
  { id: 'nanoforge', name: 'Nanoforge', tier: 2, category: 'material',
    cost: { energy: 1, material: 2, science: 1 }, recycle: 'material',
    production: { energy: 0, material: 2, science: 0 }, vp: 3 },
  { id: 'logistics_hub', name: 'Hub Logistique', tier: 2, category: 'material',
    cost: { energy: 2, material: 3, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 3, science: 0 }, vp: 2 },
  { id: 'orbital_foundry', name: 'Fonderie Orbitale', tier: 2, category: 'material',
    cost: { energy: 3, material: 2, science: 0 }, recycle: 'energy',
    production: { energy: 1, material: 2, science: 0 }, vp: 3 },
  { id: 'matter_synth', name: 'Synthétiseur de Matière', tier: 2, category: 'material',
    cost: { energy: 1, material: 3, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 3, science: 0 }, vp: 1 },

  // Tier 3
  { id: 'megastructure', name: 'Mégastructure', tier: 3, category: 'material',
    cost: { energy: 3, material: 4, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 3, science: 0 }, vp: 5 },
  { id: 'orbital_mining', name: 'Station Minière Orbitale', tier: 3, category: 'material',
    cost: { energy: 4, material: 3, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 2, science: 1 }, vp: 5 },
  { id: 'artificial_continent', name: 'Continent Artificiel', tier: 3, category: 'material',
    cost: { energy: 3, material: 4, science: 1 }, recycle: 'material',
    production: { energy: 1, material: 3, science: 0 }, vp: 5 },
  { id: 'planetary_assembler', name: 'Assembleur Planétaire', tier: 3, category: 'material',
    cost: { energy: 2, material: 5, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 4, science: 0 }, vp: 4 },
  { id: 'stellar_forge', name: 'Forge Stellaire', tier: 3, category: 'material',
    cost: { energy: 4, material: 4, science: 0 }, recycle: 'energy',
    production: { energy: 1, material: 2, science: 0 }, vp: 6 },
  { id: 'quantum_megafactory', name: 'Méga-Usine Quantique', tier: 3, category: 'material',
    cost: { energy: 3, material: 3, science: 2 }, recycle: 'science',
    production: { energy: 0, material: 2, science: 1 }, vp: 5 },

  // ===================== SAVOIR (18 cartes) =====================
  // Tier 1
  { id: 'digital_library', name: 'Bibliothèque Digitale', tier: 1, category: 'science',
    cost: { energy: 0, material: 2, science: 0 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 1 }, vp: 1 },
  { id: 'data_terminal', name: 'Terminal de Données', tier: 1, category: 'science',
    cost: { energy: 0, material: 1, science: 0 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 1 }, vp: 0 },
  { id: 'portable_lab', name: 'Labo Portable', tier: 1, category: 'science',
    cost: { energy: 1, material: 1, science: 0 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 1 }, vp: 1 },
  { id: 'relay_antenna', name: 'Antenne Relais', tier: 1, category: 'science',
    cost: { energy: 0, material: 2, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 0, science: 1 }, vp: 1 },
  { id: 'quantum_server', name: 'Serveur Quantique', tier: 1, category: 'science',
    cost: { energy: 1, material: 2, science: 0 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 1 }, vp: 2 },
  { id: 'archive_center', name: "Centre d'Archives", tier: 1, category: 'science',
    cost: { energy: 0, material: 1, science: 1 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 1 }, vp: 1 },

  // Tier 2
  { id: 'research_lab', name: 'Labo de Recherche', tier: 2, category: 'science',
    cost: { energy: 0, material: 2, science: 1 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 1 }, vp: 3 },
  { id: 'university_campus', name: 'Campus Universitaire', tier: 2, category: 'science',
    cost: { energy: 0, material: 2, science: 1 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 2 }, vp: 2 },
  { id: 'space_observatory', name: 'Observatoire Spatial', tier: 2, category: 'science',
    cost: { energy: 1, material: 2, science: 1 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 2 }, vp: 3 },
  { id: 'cybernetic_institute', name: 'Institut Cybernétique', tier: 2, category: 'science',
    cost: { energy: 2, material: 1, science: 1 }, recycle: 'material',
    production: { energy: 0, material: 1, science: 1 }, vp: 3 },
  { id: 'neural_network', name: 'Réseau Neuronal', tier: 2, category: 'science',
    cost: { energy: 0, material: 3, science: 1 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 2 }, vp: 3 },
  { id: 'quantum_simulator', name: 'Simulateur Quantique', tier: 2, category: 'science',
    cost: { energy: 1, material: 2, science: 2 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 3 }, vp: 2 },
  { id: 'compute_center', name: 'Centre de Calcul', tier: 2, category: 'science',
    cost: { energy: 2, material: 2, science: 1 }, recycle: 'science',
    production: { energy: 0, material: 1, science: 2 }, vp: 3 },

  // Tier 3
  { id: 'supreme_ai', name: 'IA Suprême', tier: 3, category: 'science',
    cost: { energy: 0, material: 2, science: 4 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 2 }, vp: 7 },
  { id: 'science_nexus', name: 'Nexus Scientifique', tier: 3, category: 'science',
    cost: { energy: 2, material: 3, science: 3 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 3 }, vp: 6 },
  { id: 'digital_conscience', name: 'Conscience Digitale', tier: 3, category: 'science',
    cost: { energy: 1, material: 3, science: 4 }, recycle: 'material',
    production: { energy: 0, material: 1, science: 2 }, vp: 6 },
  { id: 'tech_singularity', name: 'Singularité Technologique', tier: 3, category: 'science',
    cost: { energy: 3, material: 2, science: 4 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 2 }, vp: 8 },
  { id: 'omniscient_matrix', name: 'Matrice Omnisciente', tier: 3, category: 'science',
    cost: { energy: 2, material: 4, science: 3 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 3 }, vp: 6 },

  // ===================== PRESTIGE (8 cartes) =====================
  { id: 'orbital_tower', name: 'Tour Orbitale', tier: 4, category: 'prestige',
    cost: { energy: 3, material: 3, science: 2 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 1 }, vp: 8 },
  { id: 'megalopolis', name: 'Mégalopole', tier: 4, category: 'prestige',
    cost: { energy: 2, material: 3, science: 3 }, recycle: 'material',
    production: { energy: 0, material: 0, science: 0 }, vp: 10 },
  { id: 'space_ring', name: 'Anneau Spatial', tier: 4, category: 'prestige',
    cost: { energy: 4, material: 4, science: 0 }, recycle: 'energy',
    production: { energy: 1, material: 1, science: 0 }, vp: 9 },
  { id: 'eden_garden', name: "Jardin d'Éden", tier: 4, category: 'prestige',
    cost: { energy: 3, material: 3, science: 3 }, recycle: 'science',
    production: { energy: 1, material: 0, science: 0 }, vp: 10 },
  { id: 'stellar_ark', name: 'Arche Stellaire', tier: 4, category: 'prestige',
    cost: { energy: 4, material: 3, science: 2 }, recycle: 'energy',
    production: { energy: 0, material: 0, science: 0 }, vp: 11 },
  { id: 'dimensional_gate', name: 'Portail Dimensionnel', tier: 4, category: 'prestige',
    cost: { energy: 3, material: 3, science: 4 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 1 }, vp: 11 },
  { id: 'virtual_paradise', name: 'Paradis Virtuel', tier: 4, category: 'prestige',
    cost: { energy: 3, material: 4, science: 4 }, recycle: 'material',
    production: { energy: 0, material: 0, science: 0 }, vp: 13 },
  { id: 'utopia', name: 'Utopia', tier: 4, category: 'prestige',
    cost: { energy: 4, material: 4, science: 4 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 0 }, vp: 15 },

  // ===================== OPERATIONS SECRÈTES (Interactions) =====================
  { id: 'op_espionage', name: 'Espionnage Industriel', tier: 0, category: 'operation',
    cost: { energy: 0, material: 0, science: 0 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 0 }, vp: 0,
    operationType: 'copy_science', description: 'Copiez la production de Savoir de la cible pour ce tour.' },
  { id: 'op_parasite', name: 'Parasitage Énergétique', tier: 0, category: 'operation',
    cost: { energy: 0, material: 0, science: 0 }, recycle: 'energy',
    production: { energy: 0, material: 0, science: 0 }, vp: 0,
    operationType: 'steal_energy', description: 'Volez jusqu\'à 2 Énergies sur la production de la cible.' },
  { id: 'op_embargo', name: 'Embargo Matériel', tier: 0, category: 'operation',
    cost: { energy: 0, material: 0, science: 0 }, recycle: 'material',
    production: { energy: 0, material: 0, science: 0 }, vp: 0,
    operationType: 'malus_material', description: 'La cible subit un malus de -2 Matériaux sur sa production.' },
  { id: 'op_ransom', name: 'Rançon Technologique', tier: 0, category: 'operation',
    cost: { energy: 0, material: 0, science: 0 }, recycle: 'science',
    production: { energy: 0, material: 0, science: 0 }, vp: 0,
    operationType: 'steal_science', description: 'Sacrifiez 1 Matériau pour voler 2 Savoirs à la production de la cible.' },
  { id: 'op_overload', name: 'Surcharge du Réseau', tier: 0, category: 'operation',
    cost: { energy: 0, material: 0, science: 0 }, recycle: 'energy',
    production: { energy: 0, material: 0, science: 0 }, vp: 0,
    operationType: 'global_energy_boost', description: 'Tous les joueurs produisent +2 Énergies ce tour. (Aucune cible requise)' },
];

function getShuffledDeck() {
  const deck = [...CARDS.filter(c => c.category !== 'empire')];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function getTotalCost(card) {
  return card.cost.energy + card.cost.material + card.cost.science;
}

function getTotalProduction(card) {
  return card.production.energy + card.production.material + card.production.science;
}

function getShuffledEmpires() {
  const empires = CARDS.filter(c => c.category === 'empire');
  for (let i = empires.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [empires[i], empires[j]] = [empires[j], empires[i]];
  }
  return empires;
}

module.exports = { CARDS, getShuffledDeck, getShuffledEmpires, getTotalCost, getTotalProduction };
