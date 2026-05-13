// ============================================================
// Empire Express — Game Engine
// Gère toute la logique de jeu : draft, planification, production, scoring
// ============================================================

const { getShuffledDeck, getShuffledEmpires } = require('./cards.cjs');

class GameEngine {
  constructor(players) {
    this.players = players.map((p, i) => ({
      id: p.id,
      name: p.name,
      isBot: p.isBot || false,
      botDifficulty: p.botDifficulty || null,
      index: i,
      hand: [],
      drafted: [],
      constructionZone: [],
      completedBuildings: [],
    }));
    this.round = 0;
    this.totalRounds = 5;
    this.phase = 'waiting'; // waiting, draft, planning, production, ended
    this.draftStep = 0;
    this.cardsPerHand = 5;
    this.deck = [];
    this.draftHands = [];
    this.draftPicks = {};
    this.planningDecisions = {};
    this.plannedOperations = [];
    this.productionModifiers = {};
    this.productionStep = null;
    this.log = [];
  }

  // ===================== GAME FLOW =====================

  startGame() {
    this.deck = getShuffledDeck();
    const empires = getShuffledEmpires();
    this.players.forEach((p, i) => {
      // Assign an Empire card to start with
      p.completedBuildings.push(empires[i % empires.length]);
    });
    this.round = 0;
    this.startNextRound();
    return this.getState();
  }

  startNextRound() {
    this.round++;
    if (this.round > this.totalRounds) {
      this.phase = 'ended';
      this.log.push(`🏆 Fin de la partie !`);
      return;
    }
    this.log.push(`📢 Manche ${this.round} commence !`);
    this.startDraftPhase();
  }

  // ===================== DRAFT PHASE =====================

  startDraftPhase() {
    this.phase = 'draft';
    this.draftStep = 0;
    this.draftPicks = {};

    // Deal cards - each player gets cardsPerHand cards
    const totalNeeded = this.players.length * this.cardsPerHand;
    if (this.deck.length < totalNeeded) {
      this.deck = getShuffledDeck();
    }

    this.draftHands = [];
    for (let i = 0; i < this.players.length; i++) {
      this.draftHands.push(this.deck.splice(0, this.cardsPerHand));
    }

    // Assign initial hands
    this.players.forEach((p, i) => {
      p.hand = [...this.draftHands[i]];
      p.drafted = [];
    });

    this.log.push(`🃏 Draft : ${this.cardsPerHand} cartes distribuées à chaque joueur`);
  }

  handleDraftPick(playerId, cardId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || this.phase !== 'draft') return { error: 'Action invalide' };

    const cardIndex = player.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return { error: 'Carte non trouvée dans la main' };

    if (this.draftPicks[playerId]) return { error: 'Déjà choisi pour ce tour' };

    this.draftPicks[playerId] = cardId;

    // Check if all players have picked
    const allPicked = this.players.every(p => this.draftPicks[p.id]);
    if (allPicked) {
      return this.resolveDraftStep();
    }
    return { waiting: true, pickedCount: Object.keys(this.draftPicks).length };
  }

  resolveDraftStep() {
    // Move picked cards to drafted pile
    this.players.forEach(p => {
      const cardId = this.draftPicks[p.id];
      const cardIndex = p.hand.findIndex(c => c.id === cardId);
      if (cardIndex !== -1) {
        p.drafted.push(p.hand.splice(cardIndex, 1)[0]);
      }
    });

    this.draftStep++;
    this.draftPicks = {};

    // Check if draft is complete (all 5 cards picked)
    if (this.draftStep >= this.cardsPerHand) {
      this.log.push(`✅ Draft terminé !`);
      this.startPlanningPhase();
      return { phaseComplete: true };
    }

    // Rotate hands to the left
    const hands = this.players.map(p => [...p.hand]);
    this.players.forEach((p, i) => {
      const nextIndex = (i + 1) % this.players.length;
      p.hand = hands[nextIndex];
    });

    this.log.push(`🔄 Draft tour ${this.draftStep + 1} — mains passées à gauche`);
    return { nextStep: this.draftStep };
  }

  // ===================== PLANNING PHASE =====================

  startPlanningPhase() {
    this.phase = 'planning';
    this.planningDecisions = {};
    this.plannedOperations = []; // Array of { sourcePlayerId, targetPlayerId, operation }
    this.productionModifiers = {}; // playerId -> { energy, material, science }
    this.players.forEach(p => {
      this.productionModifiers[p.id] = { energy: 0, material: 0, science: 0 };
    });
    this.log.push(`📋 Phase de planification : construire, recycler ou lancer une opération ?`);
  }

  /**
   * decisions: [{ cardId, action: 'construct' | 'recycle', targetCardId? }]
   * targetCardId: for recycle, which construction site gets the resource
   */
  handlePlanningDecision(playerId, decisions) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || this.phase !== 'planning') return { error: 'Action invalide' };

    // Validate decisions cover all drafted cards
    if (decisions.length !== player.drafted.length) {
      return { error: 'Décisions incomplètes' };
    }

    // Process decisions in order (recycles first to get resources for construction context)
    const constructions = [];
    const recycleResults = [];

    // First pass: identify constructions (add to zone)
    for (const d of decisions) {
      if (d.action === 'construct') {
        const card = player.drafted.find(c => c.id === d.cardId);
        if (card) {
          constructions.push(card);
        }
      }
    }

    // Add constructions to zone
    for (const card of constructions) {
      player.constructionZone.push({
        card,
        resources: { energy: 0, material: 0, science: 0 }
      });
    }

    // Second pass: process recycles
    for (const d of decisions) {
      if (d.action === 'recycle') {
        const card = player.drafted.find(c => c.id === d.cardId);
        if (card) {
          const resourceType = card.recycle;
          // Find target construction site
          const target = player.constructionZone.find(cz => cz.card.id === d.targetCardId);
          if (target && target.card.cost[resourceType] > target.resources[resourceType]) {
            target.resources[resourceType]++;
            recycleResults.push({
              recycledCard: card.name,
              resource: resourceType,
              targetCard: target.card.name
            });
          }
          // If no valid target, resource is lost (still recycled)
        }
      }
    }

    // Third pass: process operations
    for (const d of decisions) {
      if (d.action === 'operation') {
        const card = player.drafted.find(c => c.id === d.cardId);
        if (card && card.category === 'operation') {
          this.plannedOperations.push({
            sourcePlayerId: player.id,
            targetPlayerId: d.targetPlayerId,
            operation: card
          });
        }
      }
    }

    // Check for any completions from recycling
    this.checkCompletions(player);

    player.drafted = [];
    this.planningDecisions[playerId] = true;

    this.log.push(`${player.name} a planifié : ${constructions.length} constructions, ${recycleResults.length} recyclages`);

    // Check if all players have planned
    const allPlanned = this.players.every(p => this.planningDecisions[p.id]);
    if (allPlanned) {
      this.resolveOperations();
      this.startProductionPhase();
      return { phaseComplete: true };
    }
    return { waiting: true };
  }

  resolveOperations() {
    if (this.plannedOperations.length === 0) return;

    this.log.push(`🕵️ Résolution des Opérations Secrètes...`);
    for (const op of this.plannedOperations) {
      const source = this.players.find(p => p.id === op.sourcePlayerId);
      const target = this.players.find(p => p.id === op.targetPlayerId);
      
      const type = op.operation.operationType;

      if (type === 'global_energy_boost') {
        this.players.forEach(p => {
          this.productionModifiers[p.id].energy += 2;
        });
        this.log.push(`⚡ Surcharge du Réseau ! Tous les joueurs produiront +2 Énergies.`);
        continue;
      }

      if (!target) continue;

      if (type === 'copy_science') {
        // Find how much science target produces natively
        let targetScience = 0;
        for (const b of target.completedBuildings) {
          targetScience += b.production.science || 0;
        }
        if (targetScience > 0) {
          this.productionModifiers[source.id].science += targetScience;
          this.log.push(`🧬 ${source.name} a espionné ${target.name} et copié sa production de Savoir (+${targetScience}) !`);
        }
      } else if (type === 'steal_energy') {
        // Find target energy
        let targetEnergy = 0;
        for (const b of target.completedBuildings) {
          targetEnergy += b.production.energy || 0;
        }
        const stolen = Math.min(2, targetEnergy);
        if (stolen > 0) {
          this.productionModifiers[target.id].energy -= stolen;
          this.productionModifiers[source.id].energy += stolen;
          this.log.push(`🔋 ${source.name} a volé ${stolen} Énergie(s) à ${target.name} !`);
        } else {
          this.log.push(`🔋 L'opération de parasitage de ${source.name} contre ${target.name} a échoué (0 Énergie produite).`);
        }
      } else if (type === 'malus_material') {
        this.productionModifiers[target.id].material -= 2;
        this.log.push(`⛔ Embargo : La production de Matériaux de ${target.name} est réduite de 2 !`);
      } else if (type === 'steal_science') {
        // Sacrifice 1 material to steal 2 science
        let sourceMaterial = 0;
        for (const b of source.completedBuildings) {
          sourceMaterial += b.production.material || 0;
        }
        let targetScience = 0;
        for (const b of target.completedBuildings) {
          targetScience += b.production.science || 0;
        }
        if (sourceMaterial >= 1 && targetScience >= 1) {
          const stolen = Math.min(2, targetScience);
          this.productionModifiers[source.id].material -= 1;
          this.productionModifiers[target.id].science -= stolen;
          this.productionModifiers[source.id].science += stolen;
          this.log.push(`💰 ${source.name} a payé une Rançon pour voler ${stolen} Savoir(s) à ${target.name} !`);
        } else {
          this.log.push(`💰 L'opération Rançon de ${source.name} contre ${target.name} n'a pas pu aboutir.`);
        }
      }
    }
  }

  // ===================== PRODUCTION PHASE =====================

  startProductionPhase() {
    this.phase = 'production';
    this.productionStep = 'energy';
    this.log.push(`⚙️ Phase de production !`);
    return this.resolveProductionStep();
  }

  resolveProductionStep() {
    const resourceType = this.productionStep;
    const stepResults = [];

    for (const player of this.players) {
      // Count base production from completed buildings
      let baseProduced = 0;
      for (const building of player.completedBuildings) {
        baseProduced += building.production[resourceType] || 0;
      }

      // Apply modifiers from operations
      const modifier = this.productionModifiers[player.id]?.[resourceType] || 0;
      const produced = Math.max(0, baseProduced + modifier);

      if (produced > 0) {
        // Auto-place resources on construction sites
        const placements = this.autoPlaceResources(player, resourceType, produced);
        stepResults.push({
          playerId: player.id,
          playerName: player.name,
          produced,
          placements
        });
      }

      // Check for completions
      this.checkCompletions(player);
    }

    const result = {
      step: resourceType,
      results: stepResults,
    };

    // Move to next step
    if (this.productionStep === 'energy') {
      this.productionStep = 'material';
      this.log.push(`⚡ Production d'énergie terminée`);
    } else if (this.productionStep === 'material') {
      this.productionStep = 'science';
      this.log.push(`⚙️ Production de matériaux terminée`);
    } else {
      this.log.push(`🧪 Production de savoir terminée`);
      this.productionStep = null;
      this.phase = 'production_end';
      this.startNextRound();
      result.roundEnd = true;
    }

    return result;
  }

  autoPlaceResources(player, resourceType, amount) {
    const placements = [];
    let remaining = amount;

    // Sort construction sites: prioritize those closest to completion
    const sites = player.constructionZone
      .filter(cz => cz.card.cost[resourceType] > cz.resources[resourceType])
      .sort((a, b) => {
        const aRemaining = this.getRemainingCost(a);
        const bRemaining = this.getRemainingCost(b);
        return aRemaining - bRemaining; // closest to completion first
      });

    for (const site of sites) {
      if (remaining <= 0) break;
      const needed = site.card.cost[resourceType] - site.resources[resourceType];
      const toPlace = Math.min(needed, remaining);
      site.resources[resourceType] += toPlace;
      remaining -= toPlace;
      if (toPlace > 0) {
        placements.push({
          cardId: site.card.id,
          cardName: site.card.name,
          resourceType,
          amount: toPlace
        });
      }
    }

    if (remaining > 0) {
      placements.push({ lost: remaining, resourceType });
    }

    return placements;
  }

  getRemainingCost(constructionSite) {
    const { card, resources } = constructionSite;
    return (card.cost.energy - resources.energy) +
           (card.cost.material - resources.material) +
           (card.cost.science - resources.science);
  }

  checkCompletions(player) {
    const completed = [];
    player.constructionZone = player.constructionZone.filter(cz => {
      const isComplete = cz.resources.energy >= cz.card.cost.energy &&
                         cz.resources.material >= cz.card.cost.material &&
                         cz.resources.science >= cz.card.cost.science;
      if (isComplete) {
        player.completedBuildings.push(cz.card);
        completed.push(cz.card);
        this.log.push(`🏗️ ${player.name} termine : ${cz.card.name} !`);
      }
      return !isComplete;
    });
    return completed;
  }

  // ===================== SCORING =====================

  calculateScores() {
    return this.players.map(p => {
      let buildingVP = 0;
      let empireBonusVP = 0;
      const empireCard = p.completedBuildings.find(b => b.category === 'empire');

      for (const b of p.completedBuildings) {
        buildingVP += b.vp;
        // Calculate Empire bonuses
        if (empireCard && empireCard.vpBonus && b.category !== 'empire') {
          if (empireCard.vpBonus.type === 'building' || empireCard.vpBonus.type === b.category) {
            empireBonusVP += empireCard.vpBonus.value;
          }
        }
      }

      // Handle floating point bonuses (like 0.5 per building)
      empireBonusVP = Math.floor(empireBonusVP);
      const totalVP = buildingVP + empireBonusVP;

      return {
        id: p.id,
        name: p.name,
        totalVP,
        buildings: p.completedBuildings.map(b => ({ name: b.name, vp: b.vp })),
        buildingCount: p.completedBuildings.length - 1, // Exclude empire card from UI count if needed
      };
    }).sort((a, b) => b.totalVP - a.totalVP);
  }

  // ===================== STATE =====================

  getState() {
    return {
      round: this.round,
      totalRounds: this.totalRounds,
      phase: this.phase,
      draftStep: this.draftStep,
      productionStep: this.productionStep,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        isBot: p.isBot,
        completedBuildings: p.completedBuildings,
        constructionZone: p.constructionZone,
        buildingCount: p.completedBuildings.length,
        handSize: p.hand.length,
        productionModifiers: this.productionModifiers[p.id] || { energy: 0, material: 0, science: 0 },
      })),
      log: this.log.slice(-10),
    };
  }

  getPlayerState(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return null;
    return {
      ...this.getState(),
      myId: player.id,
      myHand: player.hand,
      myDrafted: player.drafted,
      myConstructionZone: player.constructionZone,
      myCompletedBuildings: player.completedBuildings,
    };
  }
}

module.exports = GameEngine;
