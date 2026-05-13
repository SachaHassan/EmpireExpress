// ============================================================
// Empire Express — Bot Player AI
// 3 niveaux : easy, normal, hard
// ============================================================

const { getTotalCost, getTotalProduction } = require('./cards.cjs');

class BotPlayer {
  constructor(difficulty = 'normal') {
    this.difficulty = difficulty;
  }

  // Choose a card during draft
  pickCard(hand, playerState) {
    switch (this.difficulty) {
      case 'easy': return this.pickRandom(hand);
      case 'normal': return this.pickBalanced(hand, playerState);
      case 'hard': return this.pickOptimal(hand, playerState);
      default: return this.pickRandom(hand);
    }
  }

  // Decide construct/recycle for each drafted card
  planCards(drafted, playerState) {
    switch (this.difficulty) {
      case 'easy': return this.planSimple(drafted, playerState);
      case 'normal': return this.planBalanced(drafted, playerState);
      case 'hard': return this.planOptimal(drafted, playerState);
      default: return this.planSimple(drafted, playerState);
    }
  }

  // ===================== DRAFT STRATEGIES =====================

  pickRandom(hand) {
    return hand[Math.floor(Math.random() * hand.length)].id;
  }

  pickBalanced(hand, playerState) {
    // Prefer cards with good VP/cost ratio, plus some production
    const scored = hand.map(card => {
      const cost = getTotalCost(card);
      const prod = getTotalProduction(card);
      let score = card.vp * 2 + prod * 1.5;
      if (cost <= 3) score += 2; // Prefer affordable cards
      // In early rounds, prefer production
      if (playerState && playerState.round <= 2) {
        score += prod * 2;
      }
      return { card, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0].card.id;
  }

  pickOptimal(hand, playerState) {
    const scored = hand.map(card => {
      const cost = getTotalCost(card);
      const prod = getTotalProduction(card);
      let score = 0;

      // Check what resources we already produce
      const myProduction = { energy: 0, material: 0, science: 0 };
      if (playerState) {
        for (const b of playerState.completedBuildings || []) {
          myProduction.energy += b.production.energy;
          myProduction.material += b.production.material;
          myProduction.science += b.production.science;
        }
      }

      // Value production we don't have yet
      if (card.production.energy > 0 && myProduction.energy < 3) score += card.production.energy * 3;
      if (card.production.material > 0 && myProduction.material < 3) score += card.production.material * 3;
      if (card.production.science > 0 && myProduction.science < 2) score += card.production.science * 3;

      // VP value increases in later rounds
      const round = playerState ? playerState.round : 1;
      score += card.vp * round;

      // Penalize cards we can't afford
      const affordable = this.canAffordSoon(card, myProduction, round);
      if (!affordable) score -= 5;

      // Chain bonus: energy cards early, science late
      if (round === 1 && card.category === 'energy') score += 3;
      if (round >= 2 && card.category === 'science') score += 2;
      if (round === 3) score += card.vp * 2;

      return { card, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].card.id;
  }

  canAffordSoon(card, production, round) {
    const remainingRounds = 3 - round + 1;
    const totalProd = {
      energy: production.energy * remainingRounds + 2,
      material: production.material * remainingRounds + 2,
      science: production.science * remainingRounds + 1,
    };
    return totalProd.energy >= card.cost.energy &&
           totalProd.material >= card.cost.material &&
           totalProd.science >= card.cost.science;
  }

  // ===================== PLANNING STRATEGIES =====================

  planSimple(drafted, playerState) {
    const decisions = [];
    const constructing = [];

    // Construct cheap cards, recycle expensive ones
    const sorted = [...drafted].sort((a, b) => getTotalCost(a) - getTotalCost(b));

    for (const card of sorted) {
      if (getTotalCost(card) <= 3 && constructing.length < 3) {
        decisions.push({ cardId: card.id, action: 'construct' });
        constructing.push(card);
      } else {
        // Find a target for recycling
        const targetId = this.findRecycleTarget(card, constructing, playerState);
        decisions.push({ cardId: card.id, action: 'recycle', targetCardId: targetId });
      }
    }

    return decisions;
  }

  planBalanced(drafted, playerState) {
    const decisions = [];
    const constructing = [];
    const existingZone = playerState ? playerState.constructionZone || [] : [];

    // Score each card for construction value
    const scored = drafted.map(card => ({
      card,
      buildScore: card.vp * 2 + getTotalProduction(card) * 3 - getTotalCost(card),
    })).sort((a, b) => b.buildScore - a.buildScore);

    // Build top 2-3, recycle the rest
    const toBuild = Math.min(3, scored.filter(s => s.buildScore > 0).length);

    for (let i = 0; i < scored.length; i++) {
      const { card } = scored[i];
      if (i < toBuild) {
        decisions.push({ cardId: card.id, action: 'construct' });
        constructing.push(card);
      } else {
        const allTargets = [...constructing, ...existingZone.map(cz => cz.card)];
        const targetId = this.findRecycleTarget(card, allTargets, playerState);
        decisions.push({ cardId: card.id, action: 'recycle', targetCardId: targetId });
      }
    }

    return decisions;
  }

  planOptimal(drafted, playerState) {
    // Similar to balanced but with better targeting
    return this.planBalanced(drafted, playerState);
  }

  findRecycleTarget(recycledCard, constructionCards, playerState) {
    const resourceType = recycledCard.recycle;
    const existingZone = playerState ? playerState.constructionZone || [] : [];

    // Check existing construction sites first
    for (const cz of existingZone) {
      if (cz.card.cost[resourceType] > (cz.resources[resourceType] || 0)) {
        return cz.card.id;
      }
    }

    // Then check newly constructed cards
    for (const card of constructionCards) {
      if (card.cost[resourceType] > 0) {
        return card.id;
      }
    }

    // No valid target
    return constructionCards.length > 0 ? constructionCards[0].id : null;
  }
}

module.exports = BotPlayer;
