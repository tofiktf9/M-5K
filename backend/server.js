require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true
  }
});

const PORT = Number(process.env.PORT || 3000);

// Database Pool Connection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'm5k',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));

// Serve frontend
app.use(express.static(path.join(__dirname, '..')));

// =========================
// HEALTH & AUTH API
// =========================

app.get('/api/health', async (req, res) => {
  let dbOk = false;
  try {
    await db.query('SELECT 1');
    dbOk = true;
  } catch (e) {}
  res.json({
    ok: true,
    database: dbOk,
    accounts: true
  });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const username = String(req.body.username || '').trim().slice(0, 30);
    const email = String(req.body.email || '').trim().slice(0, 190);
    const password = String(req.body.password || '');

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashed]
    );

    res.json({ ok: true, userId: result.insertId, username });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'اسم المستخدم أو البريد الإلكتروني مستخدم من قبل.' });
    }
    res.status(500).json({ error: 'خطأ في السيرفر أثناء التسجيل.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');

    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows.length) {
      return res.status(400).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    }

    res.json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        bestScore: user.best_score,
        totalPoints: user.total_points,
        gamesPlayed: user.games_played
      }
    });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في السيرفر أثناء تسجيل الدخول.' });
  }
});

// Save Result & Update Leaderboard
app.post('/api/results', async (req, res) => {
  try {
    const { username, mode, score, correctAnswers, totalQuestions } = req.body;
    const name = String(username || '').trim().slice(0, 30);
    const finalScore = Number(score) || 0;
    const corrects = Number(correctAnswers) || 0;
    const totals = Number(totalQuestions) || 0;

    if (!name) return res.status(400).json({ error: 'اسم اللاعب مطلوب.' });

    // Find or create user stub if playing with guest name
    let [users] = await db.query('SELECT id FROM users WHERE username = ?', [name]);
    let userId;
    if (!users.length) {
      const [ins] = await db.query(
        'INSERT INTO users (username, email, password_hash, best_score, games_played, total_points, correct_answers) VALUES (?, ?, ?, ?, 1, ?, ?)',
        [name, `${name}_auto@m5k.local`, 'GUEST_PASS', finalScore, finalScore, corrects]
      );
      userId = ins.insertId;
    } else {
      userId = users[0].id;
      await db.query(
        `UPDATE users SET 
         games_played = games_played + 1,
         total_points = total_points + ?,
         correct_answers = correct_answers + ?,
         best_score = GREATEST(best_score, ?)
         WHERE id = ?`,
        [finalScore, corrects, finalScore, userId]
      );
    }

    await db.query(
      'INSERT INTO game_results (user_id, mode, score, correct_answers, total_questions) VALUES (?, ?, ?, ?, ?)',
      [userId, mode || 'quiz', finalScore, corrects, totals]
    );

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في حفظ النتيجة.' });
  }
});

// Leaderboard from Database
app.get('/api/leaderboard', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT username, best_score, total_points, games_played FROM users ORDER BY best_score DESC, total_points DESC LIMIT 20'
    );
    res.json({ players: rows });
  } catch (e) {
    res.json({ players: [] });
  }
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
      if (name && !names.includes(name)) names.push(name);
    }
  }
  for (const room of onlineRooms.values()) {
    for (const p of room.players.values()) {
      if (p.name && !names.includes(p.name)) names.push(p.name);
    }
  }
  const socketRooms = [...onlineRooms.values()].filter(r => r.players.size > 0).length;
  res.json({
    count: names.length,
    players: names.slice(0, 24),
    rooms: liveFriends.size + socketRooms
  });
});

app.post('/api/live/friends/heartbeat', (req, res) => {
  const clientId = String(req.body.clientId || '').slice(0, 100);
  if (!clientId) return res.status(400).json({ error: 'clientId مطلوب.' });
  const players = Array.isArray(req.body.players)
    ? req.body.players.map(x => String(x || '').trim().slice(0, 30)).filter(Boolean).slice(0, 6)
    : [];
  liveFriends.set(clientId, { players, updatedAt: Date.now() });
  pruneLiveFriends();
  res.json({ ok: true });
});

app.post('/api/live/friends/leave', (req, res) => {
  const clientId = String(req.body.clientId || '').slice(0, 100);
  if (clientId) liveFriends.delete(clientId);
  res.json({ ok: true });
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
  return [...room.players.values()].map(p => ({
    id: p.id,
    name: p.name,
    host: p.host,
    score: p.score || 0
  }));
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

function finishRoomQuestion(room) {
  if (!room.started || room.revealed) return;
  room.revealed = true;
  clearRoomTimer(room);

  const answers = {};
  for (const [id, p] of room.players) {
    if (p.answer !== undefined) answers[id] = p.answer;
  }

  const q = room.questions[room.questionIndex];
  io.to(room.code).emit('room:questionResult', {
    correctIndex: q.x,
    answers,
    players: roomPlayers(room)
  });

  room.timer = setTimeout(() => nextRoomQuestion(room), 1600);
}

function nextRoomQuestion(room) {
  clearRoomTimer(room);
  room.questionIndex++;
  room.revealed = false;

  if (room.questionIndex >= room.questions.length) {
    room.started = false;
    const sortedPlayers = roomPlayers(room).sort((a, b) => b.score - a.score);
    
    // Save multiplayer results to database automatically
    sortedPlayers.forEach(async (p) => {
      try {
        let [users] = await db.query('SELECT id FROM users WHERE username = ?', [p.name]);
        let userId;
        if (!users.length) {
          const [ins] = await db.query(
            'INSERT INTO users (username, email, password_hash, best_score, games_played, total_points) VALUES (?, ?, ?, ?, 1, ?)',
            [p.name, `${p.name}_room@m5k.local`, 'ROOM_PASS', p.score, p.score]
          );
          userId = ins.insertId;
        } else {
          userId = users[0].id;
          await db.query(
            'UPDATE users SET games_played = games_played + 1, total_points = total_points + ?, best_score = GREATEST(best_score, ?) WHERE id = ?',
            [p.score, p.score, userId]
          );
        }
      } catch (err) {}
    });

    io.to(room.code).emit('room:finished', { players: sortedPlayers });
    setTimeout(() => onlineRooms.delete(room.code), 15000);
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

  room.timer = setTimeout(() => finishRoomQuestion(room), 15000);
}

function leaveRoom(socket) {
  const code = socket.data.roomCode;
  if (!code) return;
  const room = onlineRooms.get(code);
  if (!room) return;

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
  socket.on('room:create', ({ name, qCount } = {}) => {
    if (socket.data.roomCode) leaveRoom(socket);
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

  socket.on('room:join', ({ code, name } = {}) => {
    const c = String(code || '').trim().toUpperCase();
    const room = onlineRooms.get(c);

    if (!room) return socket.emit('room:error', { message: 'الغرفة غير موجودة أو انتهت.' });
    if (room.started) return socket.emit('room:error', { message: 'اللعبة بدأت بالفعل، لا يمكن الدخول الآن.' });
    if (room.players.size >= 6) return socket.emit('room:error', { message: 'الغرفة ممتلئة (6 لاعبين كحد أقصى).' });

    if (socket.data.roomCode) leaveRoom(socket);
    const playerName = cleanRoomName(name);

    if ([...room.players.values()].some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
      return socket.emit('room:error', { message: 'اسم اللاعب مستخدم داخل هذه الغرفة.' });
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

  socket.on('room:start', ({ code, questions } = {}) => {
    const room = onlineRooms.get(String(code || '').toUpperCase());
    if (!room) return socket.emit('room:error', { message: 'الغرفة غير موجودة.' });
    if (room.hostId !== socket.id) return socket.emit('room:error', { message: 'فقط صاحب الغرفة يستطيع بدء اللعبة.' });
    if (room.players.size < 2) return socket.emit('room:error', { message: 'تحتاج إلى لاعبين على الأقل لبدء التحدي.' });
    if (!Array.isArray(questions) || !questions.length) return socket.emit('room:error', { message: 'لا توجد أسئلة كافية.' });

    room.questions = questions.slice(0, 30).map(q => ({
      m: q.m,
      d: q.d,
      q: String(q.q || ''),
      a: Array.isArray(q.a) ? q.a.slice(0, 6) : [],
      x: Number(q.x) || 0
    }));

    room.questionIndex = -1;
    room.started = true;
    room.revealed = false;

    for (const p of room.players.values()) {
      p.score = 0;
      p.answer = undefined;
    }

    io.to(room.code).emit('room:started', {
      players: roomPlayers(room),
      total: room.questions.length
    });

    nextRoomQuestion(room);
  });

  socket.on('room:answer', ({ code, choice } = {}) => {
    const room = onlineRooms.get(String(code || '').toUpperCase());
    if (!room || !room.started || room.revealed) return;
    const p = room.players.get(socket.id);
    if (!p || p.answer !== undefined) return;

    const q = room.questions[room.questionIndex];
    const c = Number(choice);
    p.answer = Number.isInteger(c) ? c : -1;

    if (p.answer === q.x) {
      const base = q.d === 'صعب' ? 300 : q.d === 'متوسط' ? 200 : 100;
      const bonus = Math.max(0, Math.ceil((room.questionEndsAt - Date.now()) / 1000) * 5);
      p.score += base + bonus;
    }

    if ([...room.players.values()].every(x => x.answer !== undefined)) {
      finishRoomQuestion(room);
    }
  });

  socket.on('room:leave', () => { leaveRoom(socket); });
  socket.on('disconnect', () => { leaveRoom(socket); });
});

// =========================
// START SERVER
// =========================

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`M5K Backend running on port ${PORT}`);
});
