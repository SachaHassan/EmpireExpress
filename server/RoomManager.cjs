// ============================================================
// Empire Express — Room Manager
// Gère la création, connexion et gestion des salons de jeu
// ============================================================

const GameEngine = require('./GameEngine.cjs');
const BotPlayer = require('./BotPlayer.cjs');

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code;
    do {
      code = '';
      for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    } while (this.rooms.has(code));
    return code;
  }

  createRoom(hostId, hostName) {
    const code = this.generateCode();
    this.rooms.set(code, {
      code,
      hostId,
      players: [{ id: hostId, name: hostName, isBot: false, connected: true }],
      bots: [],
      game: null,
      botInstances: new Map(),
      status: 'lobby', // lobby, playing, finished
    });
    return code;
  }

  joinRoom(code, playerId, playerName) {
    const room = this.rooms.get(code);
    if (!room) return { error: 'Salon introuvable' };
    if (room.status !== 'lobby') return { error: 'Partie déjà en cours' };
    if (room.players.length + room.bots.length >= 5) return { error: 'Salon plein (5 max)' };
    if (room.players.find(p => p.id === playerId)) return { error: 'Déjà dans le salon' };

    room.players.push({ id: playerId, name: playerName, isBot: false, connected: true });
    return { success: true, room: this.getRoomInfo(code) };
  }

  addBot(code, hostId, difficulty = 'normal') {
    const room = this.rooms.get(code);
    if (!room) return { error: 'Salon introuvable' };
    if (room.hostId !== hostId) return { error: "Seul l'hôte peut ajouter des bots" };
    if (room.players.length + room.bots.length >= 5) return { error: 'Salon plein' };

    const botNames = ['Atlas', 'Nova', 'Echo', 'Zen', 'Pixel'];
    const usedNames = room.bots.map(b => b.name);
    const name = botNames.find(n => !usedNames.includes(n)) || `Bot ${room.bots.length + 1}`;
    const botId = `bot_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    room.bots.push({ id: botId, name, isBot: true, botDifficulty: difficulty });
    room.botInstances.set(botId, new BotPlayer(difficulty));

    return { success: true, room: this.getRoomInfo(code) };
  }

  removeBot(code, hostId, botId) {
    const room = this.rooms.get(code);
    if (!room || room.hostId !== hostId) return { error: 'Non autorisé' };
    room.bots = room.bots.filter(b => b.id !== botId);
    room.botInstances.delete(botId);
    return { success: true, room: this.getRoomInfo(code) };
  }

  startGame(code, hostId) {
    const room = this.rooms.get(code);
    if (!room) return { error: 'Salon introuvable' };
    if (room.hostId !== hostId) return { error: "Seul l'hôte peut lancer" };

    const allPlayers = [...room.players, ...room.bots];
    if (allPlayers.length < 2) return { error: 'Minimum 2 joueurs' };

    room.game = new GameEngine(allPlayers);
    room.status = 'playing';
    const state = room.game.startGame();
    return { success: true, state };
  }

  getRoom(code) {
    return this.rooms.get(code);
  }

  getRoomInfo(code) {
    const room = this.rooms.get(code);
    if (!room) return null;
    return {
      code: room.code,
      hostId: room.hostId,
      players: room.players.map(p => ({ id: p.id, name: p.name, isBot: false })),
      bots: room.bots.map(b => ({ id: b.id, name: b.name, isBot: true, difficulty: b.botDifficulty })),
      status: room.status,
    };
  }

  findRoomByPlayer(playerId) {
    for (const [code, room] of this.rooms) {
      if (room.players.find(p => p.id === playerId) || room.bots.find(b => b.id === playerId)) {
        return code;
      }
    }
    return null;
  }

  handleDisconnect(playerId) {
    const code = this.findRoomByPlayer(playerId);
    if (!code) return;
    const room = this.rooms.get(code);
    if (!room) return;

    const player = room.players.find(p => p.id === playerId);
    if (player) player.connected = false;

    // If host disconnects in lobby, close room
    if (room.status === 'lobby' && room.hostId === playerId) {
      this.rooms.delete(code);
      return { roomClosed: true, code };
    }

    return { code, playerDisconnected: playerId };
  }

  processBotActions(code) {
    const room = this.rooms.get(code);
    if (!room || !room.game) return [];

    const results = [];
    const game = room.game;

    for (const bot of room.bots) {
      const botAI = room.botInstances.get(bot.id);
      if (!botAI) continue;

      const playerState = game.getPlayerState(bot.id);
      if (!playerState) continue;

      if (game.phase === 'draft' && !game.draftPicks[bot.id]) {
        const pick = botAI.pickCard(playerState.myHand, playerState);
        const result = game.handleDraftPick(bot.id, pick);
        results.push({ botId: bot.id, action: 'draft', result });
      }

      if (game.phase === 'planning' && !game.planningDecisions[bot.id]) {
        const decisions = botAI.planCards(playerState.myDrafted, playerState);
        const result = game.handlePlanningDecision(bot.id, decisions);
        results.push({ botId: bot.id, action: 'planning', result });
      }
    }

    return results;
  }

  deleteRoom(code) {
    this.rooms.delete(code);
  }
}

module.exports = RoomManager;
