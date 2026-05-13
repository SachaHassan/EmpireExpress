// ============================================================
// Empire Express — Serveur Express + Socket.IO
// ============================================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const RoomManager = require('./RoomManager.cjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ['http://localhost:5173', 'http://localhost:3001'], methods: ['GET', 'POST'] }
});

const roomManager = new RoomManager();

// Serve static files in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ===================== SOCKET.IO =====================

io.on('connection', (socket) => {
  console.log(`✅ Connecté: ${socket.id}`);

  // --- LOBBY ---
  socket.on('create-room', ({ playerName }, cb) => {
    const code = roomManager.createRoom(socket.id, playerName);
    socket.join(code);
    const info = roomManager.getRoomInfo(code);
    cb({ code, room: info });
    console.log(`🏠 Room ${code} créée par ${playerName}`);
  });

  socket.on('join-room', ({ roomCode, playerName }, cb) => {
    const result = roomManager.joinRoom(roomCode, socket.id, playerName);
    if (result.error) return cb({ error: result.error });
    socket.join(roomCode);
    io.to(roomCode).emit('room-updated', roomManager.getRoomInfo(roomCode));
    cb({ success: true, room: result.room });
    console.log(`👤 ${playerName} rejoint ${roomCode}`);
  });

  socket.on('add-bot', ({ difficulty }, cb) => {
    const code = roomManager.findRoomByPlayer(socket.id);
    if (!code) return cb({ error: 'Pas dans un salon' });
    const result = roomManager.addBot(code, socket.id, difficulty);
    if (result.error) return cb({ error: result.error });
    io.to(code).emit('room-updated', roomManager.getRoomInfo(code));
    cb({ success: true });
  });

  socket.on('remove-bot', ({ botId }, cb) => {
    const code = roomManager.findRoomByPlayer(socket.id);
    if (!code) return cb({ error: 'Pas dans un salon' });
    const result = roomManager.removeBot(code, socket.id, botId);
    if (result.error) return cb({ error: result.error });
    io.to(code).emit('room-updated', roomManager.getRoomInfo(code));
    cb({ success: true });
  });

  // --- START GAME ---
  socket.on('start-game', (_, cb) => {
    const code = roomManager.findRoomByPlayer(socket.id);
    if (!code) return cb({ error: 'Pas dans un salon' });
    const result = roomManager.startGame(code, socket.id);
    if (result.error) return cb({ error: result.error });

    const room = roomManager.getRoom(code);
    // Send personalized state to each human player
    for (const p of room.players) {
      io.to(p.id).emit('game-started', room.game.getPlayerState(p.id));
    }

    // Process bot actions immediately
    processBots(code);
    cb({ success: true });
  });

  // --- DRAFT ---
  socket.on('draft-pick', ({ cardId }, cb) => {
    const code = roomManager.findRoomByPlayer(socket.id);
    if (!code) return cb({ error: 'Pas dans un salon' });
    const room = roomManager.getRoom(code);
    if (!room || !room.game) return cb({ error: 'Pas de partie' });

    const result = room.game.handleDraftPick(socket.id, cardId);
    if (result.error) return cb({ error: result.error });

    cb({ success: true });

    if (result.phaseComplete || result.nextStep !== undefined) {
      emitGameState(code, room);
      if (room.game.phase === 'planning' || room.game.phase === 'draft') {
        processBots(code);
      }
    } else {
      // Still waiting, but trigger bot picks
      processBots(code);
    }
  });

  // --- PLANNING ---
  socket.on('planning-done', ({ decisions }, cb) => {
    const code = roomManager.findRoomByPlayer(socket.id);
    if (!code) return cb({ error: 'Pas dans un salon' });
    const room = roomManager.getRoom(code);
    if (!room || !room.game) return cb({ error: 'Pas de partie' });

    const result = room.game.handlePlanningDecision(socket.id, decisions);
    if (result.error) return cb({ error: result.error });

    cb({ success: true });

    if (result.phaseComplete) {
      // Production phase auto-resolves
      resolveProduction(code, room);
    }
  });

  // --- NEXT PRODUCTION STEP ---
  socket.on('next-production', (_, cb) => {
    const code = roomManager.findRoomByPlayer(socket.id);
    if (!code) return cb({ error: 'Pas dans un salon' });
    const room = roomManager.getRoom(code);
    if (!room || !room.game) return cb({ error: 'Pas de partie' });

    if (room.game.phase === 'production' && room.game.productionStep) {
      const result = room.game.resolveProductionStep();
      emitGameState(code, room);

      if (result.roundEnd) {
        if (room.game.phase === 'ended') {
          const scores = room.game.calculateScores();
          io.to(code).emit('game-over', { scores });
        } else {
          processBots(code);
        }
      }
      cb({ success: true, result });
    } else {
      cb({ error: 'Pas en phase de production' });
    }
  });

  // --- DISCONNECT ---
  socket.on('disconnect', () => {
    const result = roomManager.handleDisconnect(socket.id);
    if (result && result.roomClosed) {
      io.to(result.code).emit('room-closed');
    } else if (result) {
      io.to(result.code).emit('player-disconnected', { playerId: result.playerDisconnected });
    }
    console.log(`❌ Déconnecté: ${socket.id}`);
  });
});

// ===================== HELPERS =====================

function emitGameState(code, room) {
  for (const p of room.players) {
    if (p.connected) {
      io.to(p.id).emit('game-state', room.game.getPlayerState(p.id));
    }
  }
}

function processBots(code) {
  setTimeout(() => {
    const results = roomManager.processBotActions(code);
    const room = roomManager.getRoom(code);
    if (!room || !room.game) return;

    // After bots acted, check if we need to continue
    if (results.length > 0) {
      emitGameState(code, room);

      if (room.game.phase === 'draft') {
        // If draft advanced, bots may need to pick again
        processBots(code);
      } else if (room.game.phase === 'production') {
        resolveProduction(code, room);
      } else if (room.game.phase === 'planning') {
        // Bots already planned, wait for human
        processBots(code); // in case more bots need to plan
      }
    }
  }, 500); // Small delay for UX
}

function resolveProduction(code, room) {
  if (!room.game || room.game.phase !== 'production') return;

  // Auto-resolve all 3 production steps with delays for animation
  const steps = ['energy', 'material', 'science'];
  let delay = 0;

  const doStep = () => {
    if (!room.game || room.game.phase !== 'production' || !room.game.productionStep) return;

    const result = room.game.resolveProductionStep();
    io.to(code).emit('production-step', result);
    emitGameState(code, room);

    if (!result.roundEnd && room.game.productionStep) {
      setTimeout(doStep, 1500);
    } else if (result.roundEnd) {
      if (room.game.phase === 'ended') {
        const scores = room.game.calculateScores();
        io.to(code).emit('game-over', { scores });
      } else {
        // New round started
        setTimeout(() => {
          emitGameState(code, room);
          processBots(code);
        }, 1000);
      }
    }
  };

  setTimeout(doStep, 1000);
}

// ===================== START =====================

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Empire Express — Serveur sur http://localhost:${PORT}`);
});
