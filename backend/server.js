require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true
  }
});

const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));

// Serve frontend
app.use(express.static(path.join(__dirname, '..')));


// =========================
// HEALTH
// =========================

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    database: false,
    accounts: false
  });
});


// =========================
// LIVE FRIENDS
// =========================

const liveFriends = new Map();

function pruneLiveFriends() {
  const now = Date.now();

  for (const [id, room] of liveFriends) {
    if (now - room.updatedAt > 12000) {
      liveFriends.delete(id);
    }
  }
}

app.get('/api/live/friends', (req, res) => {
  pruneLiveFriends();

  const names = [];

  for (const room of liveFriends.values()) {
    for (const name of room.players || []) {
      if (name && !names.includes(name)) {
        names.push(name);
      }
    }
  }

  for (const room of onlineRooms.values()) {
    for (const p of room.players.values()) {
      if (p.name && !names.includes(p.name)) {
        names.push(p.name);
      }
    }
  }

  const socketRooms = [
    ...onlineRooms.values()
  ].filter(r => r.players.size > 0).length;

  res.json({
    count: names.length,
    players: names.slice(0, 24),
    rooms: liveFriends.size + socketRooms
  });
});

app.post('/api/live/friends/heartbeat', (req, res) => {
  const clientId = String(req.body.clientId || '').slice(0, 100);

  if (!clientId) {
    return res.status(400).json({
      error: 'clientId مطلوب.'
    });
  }

  const players = Array.isArray(req.body.players)
    ? req.body.players
        .map(x => String(x || '').trim().slice(0, 30))
        .filter(Boolean)
        .slice(0, 6)
    : [];

  liveFriends.set(clientId, {
    players,
    updatedAt: Date.now()
  });

  pruneLiveFriends();

  res.json({
    ok: true
  });
});

app.post('/api/live/friends/leave', (req, res) => {
  const clientId = String(req.body.clientId || '').slice(0, 100);

  if (clientId) {
    liveFriends.delete(clientId);
  }

  res.json({
    ok: true
  });
});


// =========================
// ONLINE ROOMS
// =========================

const onlineRooms = new Map();

const ROOM_CODE = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let code = '';

  do {
    code = '';

    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

  } while (onlineRooms.has(code));

  return code;
};


function roomPlayers(room) {
  return [
    ...room.players.values()
  ].map(p => ({
    id: p.id,
    name: p.name,
    host: p.host,
    score: p.score || 0
  }));
}


function publicRoom(room) {
  return {
    code: room.code,
    host: room.hostId === room.hostSocketId,
    hostId: room.hostId,
    players: roomPlayers(room),
    started: room.started,
    qCount: room.questions.length
  };
}


function cleanRoomName(v) {
  return String(v || 'لاعب').trim().slice(0, 20) || 'لاعب';
}


function sendRoomUpdate(room) {
  io.to(room.code).emit('room:update', {
    code: room.code,
    players: roomPlayers(room),
    started: room.started,
    qCount: room.questions.length,
    hostId: room.hostId
  });
}


function clearRoomTimer(room) {
  if (room.timer) {
    clearTimeout(room.timer);
    room.timer = null;
  }
}


// =========================
// FINISH QUESTION
// =========================

function finishRoomQuestion(room) {
  if (!room.started || room.revealed) {
    return;
  }

  room.revealed = true;

  clearRoomTimer(room);

  const answers = {};

  for (const [id, p] of room.players) {
    if (p.answer !== undefined) {
      answers[id] = p.answer;
    }
  }

  const q = room.questions[room.questionIndex];

  io.to(room.code).emit('room:questionResult', {
    correctIndex: q.x,
    answers,
    players: roomPlayers(room)
  });

  room.timer = setTimeout(
    () => nextRoomQuestion(room),
    1600
  );
}


// =========================
// NEXT QUESTION
// =========================

function nextRoomQuestion(room) {
  clearRoomTimer(room);

  room.questionIndex++;
  room.revealed = false;

  if (room.questionIndex >= room.questions.length) {
    room.started = false;

    io.to(room.code).emit(
      'room:finished',
      {
        players: roomPlayers(room)
          .sort((a, b) => b.score - a.score)
      }
    );

    setTimeout(
      () => onlineRooms.delete(room.code),
      15000
    );

    return;
  }

  for (const p of room.players.values()) {
    p.answer = undefined;
  }

  const q = room.questions[room.questionIndex];

  room.questionEndsAt = Date.now() + 15000;

  io.to(room.code).emit('room:question', {
    index: room.questionIndex,
    total: room.questions.length,
    time: 15,
    question: q,
    players: roomPlayers(room)
  });

  room.timer = setTimeout(
    () => finishRoomQuestion(room),
    15000
  );
}


// =========================
// LEAVE ROOM
// =========================

function leaveRoom(socket) {
  const code = socket.data.roomCode;

  if (!code) {
    return;
  }

  const room = onlineRooms.get(code);

  if (!room) {
    return;
  }

  room.players.delete(socket.id);

  if (room.hostId === socket.id) {
    const next = room.players.values().next().value;

    if (next) {
      next.host = true;
      room.hostId = next.id;
      room.hostSocketId = next.id;
    } else {
      clearRoomTimer(room);
      onlineRooms.delete(code);
      return;
    }
  }

  if (room.started && room.players.size < 1) {
    clearRoomTimer(room);
    onlineRooms.delete(code);
    return;
  }

  sendRoomUpdate(room);

  socket.data.roomCode = null;
}


// =========================
// SOCKET.IO
// =========================

io.on('connection', socket => {

  // =======================
  // CREATE ROOM
  // =======================

  socket.on('room:create', ({ name, qCount } = {}) => {

    if (socket.data.roomCode) {
      leaveRoom(socket);
    }

    const code = ROOM_CODE();

    const playerName = cleanRoomName(name);

    const room = {
      code,
      hostId: socket.id,
      hostSocketId: socket.id,

      players: new Map(),

      questions: [],

      questionIndex: -1,

      started: false,

      revealed: false,

      timer: null,

      questionEndsAt: 0
    };

    room.players.set(socket.id, {
      id: socket.id,
      name: playerName,
      host: true,
      score: 0
    });

    onlineRooms.set(code, room);

    socket.join(code);

    socket.data.roomCode = code;

    socket.emit('room:created', {
      code,
      name: playerName,
      host: true,
      players: roomPlayers(room),
      qCount: Number(qCount) || 15
    });

    sendRoomUpdate(room);
  });


  // =======================
  // JOIN ROOM
  // =======================

  socket.on('room:join', ({ code, name } = {}) => {

    const c = String(code || '')
      .trim()
      .toUpperCase();

    const room = onlineRooms.get(c);

    if (!room) {
      return socket.emit('room:error', {
        message: 'الغرفة غير موجودة أو انتهت.'
      });
    }

    if (room.started) {
      return socket.emit('room:error', {
        message: 'اللعبة بدأت بالفعل، لا يمكن الدخول الآن.'
      });
    }

    if (room.players.size >= 6) {
      return socket.emit('room:error', {
        message: 'الغرفة ممتلئة (6 لاعبين كحد أقصى).'
      });
    }

    if (socket.data.roomCode) {
      leaveRoom(socket);
    }

    const playerName = cleanRoomName(name);

    if (
      [
        ...room.players.values()
      ].some(
        p => p.name.toLowerCase() === playerName.toLowerCase()
      )
    ) {
      return socket.emit('room:error', {
        message: 'اسم اللاعب مستخدم داخل هذه الغرفة.'
      });
    }

    room.players.set(socket.id, {
      id: socket.id,
      name: playerName,
      host: false,
      score: 0
    });

    socket.join(c);

    socket.data.roomCode = c;

    socket.emit('room:joined', {
      code: c,
      name: playerName,
      host: false,
      players: roomPlayers(room),
      qCount: room.questions.length
    });

    sendRoomUpdate(room);
  });


  // =======================
  // START ROOM
  // =======================

  socket.on('room:start', ({ code, questions } = {}) => {

    const room = onlineRooms.get(
      String(code || '').toUpperCase()
    );

    if (!room) {
      return socket.emit('room:error', {
        message: 'الغرفة غير موجودة.'
      });
    }

    if (room.hostId !== socket.id) {
      return socket.emit('room:error', {
        message: 'فقط صاحب الغرفة يستطيع بدء اللعبة.'
      });
    }

    if (room.players.size < 2) {
      return socket.emit('room:error', {
        message: 'تحتاج إلى لاعبين على الأقل لبدء التحدي.'
      });
    }

    if (!Array.isArray(questions) || !questions.length) {
      return socket.emit('room:error', {
        message: 'لا توجد أسئلة كافية.'
      });
    }

    room.questions = questions
      .slice(0, 30)
      .map(q => ({
        m: q.m,
        d: q.d,
        q: String(q.q || ''),
        a: Array.isArray(q.a)
          ? q.a.slice(0, 6)
          : [],
        x: Number(q.x) || 0
      }));

    room.questionIndex = -1;

    room.started = true;

    room.revealed = false;

    for (const p of room.players.values()) {
      p.score = 0;
      p.answer = undefined;
    }

    io.to(room.code).emit(
      'room:started',
      {
        players: roomPlayers(room),
        total: room.questions.length
      }
    );

    nextRoomQuestion(room);
  });


  // =======================
  // ANSWER
  // =======================

  socket.on('room:answer', ({ code, choice } = {}) => {

    const room = onlineRooms.get(
      String(code || '').toUpperCase()
    );

    if (!room || !room.started || room.revealed) {
      return;
    }

    const p = room.players.get(socket.id);

    if (!p || p.answer !== undefined) {
      return;
    }

    const q = room.questions[room.questionIndex];

    const c = Number(choice);

    p.answer = Number.isInteger(c)
      ? c
      : -1;

    if (p.answer === q.x) {

      const base =
        q.d === 'صعب'
          ? 300
          : q.d === 'متوسط'
            ? 200
            : 100;

      const bonus = Math.max(
        0,
        Math.ceil(
          (room.questionEndsAt - Date.now()) / 1000
        ) * 5
      );

      p.score += base + bonus;
    }

    if (
      [
        ...room.players.values()
      ].every(
        x => x.answer !== undefined
      )
    ) {
      finishRoomQuestion(room);
    }
  });


  // =======================
  // LEAVE ROOM
  // =======================

  socket.on('room:leave', () => {
    leaveRoom(socket);
  });


  // =======================
  // DISCONNECT
  // =======================

  socket.on('disconnect', () => {
    leaveRoom(socket);
  });

});


// =========================
// START SERVER
// =========================

httpServer.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `M5K Backend running on port ${PORT}`
    );
  }
);
