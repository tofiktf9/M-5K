'use strict';
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const { initStore } = require('./store');
const nodemailer = require('nodemailer');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const PORT = Number(process.env.PORT || 3000);

/* ---------- JWT secret: never use a guessable default; persist it so logins survive restarts ---------- */
function loadJwtSecret() {
  const env = String(process.env.JWT_SECRET || '').trim();
  if (env && env !== 'change-this-to-a-long-random-secret' && env !== 'm5k-change-me' && env.length >= 16) return env;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const f = path.join(DATA_DIR, '.jwt-secret');
  try { const s = fs.readFileSync(f, 'utf8').trim(); if (s.length >= 32) return s; } catch (_) {}
  const s = crypto.randomBytes(48).toString('hex');
  fs.writeFileSync(f, s, { mode: 0o600 });
  return s;
}
const JWT_SECRET = loadJwtSecret();

const app = express();
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);
app.disable('x-powered-by');
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: false }, maxHttpBufferSize: 1e6 });

let store = null;

app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin'
  });
  next();
});
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

/* ---------- static files: whitelist only (the old version exposed backend/.env!) ---------- */
const PUBLIC_FILES = new Set(['index.html', 'app.js', 'style.css', 'favicon.svg', 'og-image.png', 'apple-touch-icon.png', 'robots.txt', 'sitemap.xml']);
app.get('/', (req, res) => res.sendFile(path.join(ROOT, 'index.html')));
app.get('/:file', (req, res, next) => {
  if (!PUBLIC_FILES.has(req.params.file)) return next();
  res.sendFile(path.join(ROOT, req.params.file));
});
app.use('/images', express.static(path.join(ROOT, 'images'), { dotfiles: 'deny', index: false }));

/* ---------- helpers ---------- */
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const hits = new Map();
const MAX_RATE_KEYS = 20000;
function limiter(max, windowMs) {
  return (req, res, next) => {
    const key = req.ip + '|' + req.path;
    if (hits.size > MAX_RATE_KEYS) { for (const [k,v] of hits) if (Date.now() > v.reset) hits.delete(k); if (hits.size > MAX_RATE_KEYS && !hits.has(key)) return res.status(429).json({ error: 'الخدمة مشغولة، حاول لاحقًا.' }); }
    const now = Date.now();
    let h = hits.get(key);
    if (!h || now > h.reset) { h = { n: 0, reset: now + windowMs }; hits.set(key, h); }
    if (++h.n > max) {
      res.set('Retry-After', String(Math.ceil((h.reset - now) / 1000)));
      return res.status(429).json({ error: 'محاولات كثيرة، حاول مرة أخرى بعد قليل.' });
    }
    next();
  };
}
setInterval(() => { const n = Date.now(); for (const [k, v] of hits) if (n > v.reset) hits.delete(k); }, 60000).unref();

function tokenFor(user) { return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '90d' }); }
function readToken(h) { h = h || ''; return h.startsWith('Bearer ') ? h.slice(7) : null; }
function auth(req, res, next) {
  const token = readToken(req.headers.authorization);
  if (!token) return res.status(401).json({ error: 'تسجيل الدخول مطلوب.', code: 'NO_TOKEN' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: 'جلسة الدخول انتهت، سجل الدخول من جديد.', code: 'BAD_TOKEN' }); }
}
const cleanUsername = v => String(v || '').trim().replace(/\s+/g, ' ');
const cleanEmail = v => String(v || '').trim().toLowerCase();
const DUMMY_HASH = bcrypt.hashSync('m5k-dummy-password', 10);
const MAX_PER_QUESTION = 375; // 300 (hard) + 15s * 5 speed bonus

/* ---------- API ---------- */
app.get('/api/health', wrap(async (req, res) => {
  try { await store.ping(); res.json({ ok: true, database: true, storage: store.kind }); }
  catch { res.status(503).json({ ok: false, database: false, error: 'تعذر الاتصال بقاعدة البيانات.' }); }
}));

const authLimit = limiter(8, 15 * 60 * 1000);

app.post('/api/auth/register', authLimit, wrap(async (req, res) => {
  const username = cleanUsername(req.body.username), email = cleanEmail(req.body.email), password = String(req.body.password || '');
  if (!/^[\p{L}\p{N}_ .-]{3,30}$/u.test(username)) return res.status(400).json({ error: 'اسم المستخدم يجب أن يكون بين 3 و30 حرفًا (حروف أو أرقام أو _ . -).' });
  if (email.length > 190 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'البريد الإلكتروني غير صحيح.' });
  if (password.length < 10 || password.length > 100) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون بين 10 و100 حرف.' });
  if (await store.isTaken(username, email)) return res.status(409).json({ error: 'اسم المستخدم أو البريد مستخدم بالفعل.' });
  const passwordHash = await bcrypt.hash(password, 12);
  let id;
  try { id = await store.createUser({ username, email, passwordHash }); }
  catch (e) { if (e.code === 'DUPLICATE') return res.status(409).json({ error: 'اسم المستخدم أو البريد مستخدم بالفعل.' }); throw e; }
  const user = await store.getUser(id);
  res.status(201).json({ user, token: tokenFor(user) });
}));

app.post('/api/auth/login', authLimit, wrap(async (req, res) => {
  const login = cleanUsername(req.body.login || req.body.email), password = String(req.body.password || '');
  if (!login || !password || password.length > 100) return res.status(400).json({ error: 'اكتب اسم المستخدم أو البريد وكلمة المرور.' });
  const row = await store.findForLogin(login);
  const ok = await bcrypt.compare(password, row ? row.password_hash : DUMMY_HASH);
  if (!row || !ok) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة.' });
  const user = await store.getUser(row.id);
  res.json({ user, token: tokenFor(user) });
}));


const resetCodes = new Map();
const resetLimit = limiter(4, 15 * 60 * 1000);
function mailer(){
  if(!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:String(process.env.SMTP_SECURE||'false')==='true',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000});
}
app.post('/api/auth/forgot-password', resetLimit, wrap(async (req,res)=>{
  const email=cleanEmail(req.body.email);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'اكتب البريد الإلكتروني الصحيح الذي سجلت به.'});
  const transport=mailer();
  if(!transport) return res.status(503).json({error:'خدمة إرسال البريد غير مهيأة بعد. أضف إعدادات SMTP في Render لإرسال رموز التحقق.'});
  const user=await store.getUserByEmail(email);
  if(user){
    const code=String(crypto.randomInt(100000,1000000));
    resetCodes.set(email,{userId:user.id,hash:crypto.createHash('sha256').update(code).digest('hex'),expires:Date.now()+10*60*1000,attempts:0});
    try {
      await transport.sendMail({from:process.env.SMTP_FROM||process.env.SMTP_USER,to:email,subject:'رمز تغيير كلمة مرور M5K',text:`رمز التحقق لتغيير كلمة مرور حسابك في M5K هو: ${code}\nصلاحية الرمز 10 دقائق. إذا لم تطلب ذلك فتجاهل الرسالة.`,html:`<div dir="rtl" style="font-family:Arial,sans-serif"><h2>تغيير كلمة مرور M5K</h2><p>رمز التحقق الخاص بك:</p><p style="font-size:30px;font-weight:bold;letter-spacing:6px">${code}</p><p>صلاحية الرمز 10 دقائق. لا تشاركه مع أحد.</p></div>`});
    } catch (mailError) {
      resetCodes.delete(email);
      console.error('[password-reset] SMTP send failed:', mailError && (mailError.code || mailError.message) || 'unknown error');
      return res.status(502).json({error:'تعذر إرسال البريد. تحقق من إعدادات SMTP في Render ثم راجع Logs.'});
    }
  }
  res.json({ok:true,message:'إذا كان البريد مسجلًا، فسيصلك رمز تحقق خلال لحظات.'});
}));
app.post('/api/auth/reset-password', resetLimit, wrap(async(req,res)=>{
  const email=cleanEmail(req.body.email), code=String(req.body.code||'').trim(), password=String(req.body.password||'');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!/^[0-9]{6}$/.test(code)) return res.status(400).json({error:'البريد أو رمز التحقق غير صحيح.'});
  if(password.length<10||password.length>100) return res.status(400).json({error:'كلمة المرور الجديدة يجب أن تكون بين 10 و100 حرف.'});
  const entry=resetCodes.get(email);
  if(!entry||entry.expires<Date.now()||entry.attempts>=5) {resetCodes.delete(email);return res.status(400).json({error:'انتهت صلاحية الرمز أو أنه غير صحيح. اطلب رمزًا جديدًا.'});}
  entry.attempts++;
  const hash=crypto.createHash('sha256').update(code).digest('hex');
  if(!crypto.timingSafeEqual(Buffer.from(hash),Buffer.from(entry.hash))) return res.status(400).json({error:'رمز التحقق غير صحيح.'});
  const passwordHash=await bcrypt.hash(password,12);
  await store.updatePassword(entry.userId,passwordHash); resetCodes.delete(email);
  res.json({ok:true,message:'تم تغيير كلمة المرور بنجاح.'});
}));
setInterval(()=>{for(const [email,v] of resetCodes) if(v.expires<Date.now()) resetCodes.delete(email);},60000).unref();

app.get('/api/me', auth, wrap(async (req, res) => {
  const user = await store.getUser(req.user.id);
  if (!user) return res.status(401).json({ error: 'الحساب غير موجود، سجل الدخول من جديد.', code: 'NO_USER' });
  res.json({ user, rank: await store.rankOf(user) });
}));

app.patch('/api/me/avatar', auth, wrap(async (req, res) => {
  const avatar = typeof req.body.avatar === 'string' ? req.body.avatar : '';
  if (avatar && (!/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(avatar) || avatar.length > 400000)) {
    return res.status(400).json({ error: 'الصورة غير صالحة أو حجمها كبير. اختر صورة أصغر من 300KB.' });
  }
  const user = await store.updatePreferences(req.user.id, { avatar });
  if (!user) return res.status(404).json({ error: 'الحساب غير موجود.' });
  res.json({ user });
}));

app.patch('/api/me/preferences', auth, wrap(async (req, res) => {
  const theme = ['dark','light','midnight'].includes(req.body.theme) ? req.body.theme : null;
  const language = ['ar','en','fr'].includes(req.body.language) ? req.body.language : null;
  if (!theme && !language) return res.status(400).json({ error: 'الإعدادات غير صالحة.' });
  const user = await store.updatePreferences(req.user.id, { theme, language });
  if (!user) return res.status(404).json({ error: 'الحساب غير موجود.' });
  res.json({ user });
}));

const lastResultAt = new Map();
app.post('/api/results', auth, wrap(async (req, res) => {
  const mode = String(req.body.mode || 'unknown');
  if (!/^[\w-]{1,40}$/.test(mode)) return res.status(400).json({ error: 'نوع اللعبة غير صالح.' });
  const total = Math.floor(Number(req.body.totalQuestions));
  const correct = Math.floor(Number(req.body.correctAnswers));
  let score = Math.floor(Number(req.body.score));
  if (![total, correct, score].every(Number.isFinite) || total < 1 || total > 200 || correct < 0 || score < 0)
    return res.status(400).json({ error: 'بيانات النتيجة غير صالحة.' });
  if (correct > total) return res.status(400).json({ error: 'بيانات النتيجة غير منطقية.' });
  score = Math.min(score, correct * MAX_PER_QUESTION);
  const last = lastResultAt.get(req.user.id) || 0;
  if (Date.now() - last < 3000) return res.status(429).json({ error: 'نتائج كثيرة بسرعة، انتظر قليلًا.' });
  lastResultAt.set(req.user.id, Date.now());
  const user = await store.addResult(req.user.id, mode, score, correct, total);
  if (!user) return res.status(401).json({ error: 'الحساب غير موجود، سجل الدخول من جديد.', code: 'NO_USER' });
  res.status(201).json({ ok: true, user, rank: await store.rankOf(user) });
}));
setInterval(() => { const n = Date.now(); for (const [k, v] of lastResultAt) if (n - v > 60000) lastResultAt.delete(k); }, 60000).unref();

app.get('/api/leaderboard', wrap(async (req, res) => {
  const mode = req.query.mode ? String(req.query.mode) : '';
  if (mode && !/^[\w-]{1,40}$/.test(mode)) return res.status(400).json({ error: 'نوع اللعبة غير صالح.' });
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 50));
  res.json({ players: await store.leaderboard(limit, mode || null) });
}));

app.get('/api/profile/:username', wrap(async (req, res) => {
  const u = await store.getUserByName(String(req.params.username).slice(0, 30));
  if (!u) return res.status(404).json({ error: 'المستخدم غير موجود.' });
  const { id, email, ...publicProfile } = u;
  res.json({ user: publicProfile });
}));

/* ---------- live friends counter (unchanged behaviour) ---------- */
const onlineRooms = new Map();
const liveFriends = new Map();
function pruneLiveFriends() { const now = Date.now(); for (const [id, r] of liveFriends) if (now - r.updatedAt > 12000) liveFriends.delete(id); }
app.get('/api/live/friends', (req, res) => {
  pruneLiveFriends();
  const names = [];
  for (const room of liveFriends.values()) for (const n of (room.players || [])) if (n && !names.includes(n)) names.push(n);
  for (const room of onlineRooms.values()) for (const p of room.players.values()) if (p.name && !names.includes(p.name)) names.push(p.name);
  const socketRooms = [...onlineRooms.values()].filter(r => r.players.size > 0).length;
  res.json({ count: names.length, players: names.slice(0, 24), rooms: liveFriends.size + socketRooms });
});
app.post('/api/live/friends/heartbeat', limiter(30, 60000), (req, res) => {
  const clientId = String(req.body.clientId || '').slice(0, 100);
  if (!clientId) return res.status(400).json({ error: 'clientId مطلوب.' });
  const players = Array.isArray(req.body.players) ? req.body.players.map(x => String(x || '').trim().slice(0, 30)).filter(Boolean).slice(0, 6) : [];
  if (liveFriends.size > 5000 && !liveFriends.has(clientId)) return res.status(429).json({ error: 'busy' });
  liveFriends.set(clientId, { players, updatedAt: Date.now() });
  pruneLiveFriends();
  res.json({ ok: true });
});
app.post('/api/live/friends/leave', limiter(30, 60000), (req, res) => {
  const clientId = String(req.body.clientId || '').slice(0, 100);
  if (clientId) liveFriends.delete(clientId);
  res.json({ ok: true });
});

app.use('/api', (req, res) => res.status(404).json({ error: 'المسار غير موجود.' }));
// SPA fallback only for page-like URLs (no file extension)
app.get('*', (req, res) => {
  if (path.extname(req.path)) return res.status(404).send('Not found');
  res.sendFile(path.join(ROOT, 'index.html'));
});
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') return res.status(400).json({ error: 'بيانات الطلب غير صالحة.' });
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'حدث خطأ في الخادم. حاول مرة أخرى.' });
});

/* ======================= Online rooms (Socket.IO) ======================= */
const MAX_PLAYERS = 6, QUESTION_MS = 15000, REVEAL_MS = 1600, MIN_SAVED_QUESTIONS = 5;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newRoomCode() {
  let code;
  do { code = Array.from({ length: 6 }, () => CODE_CHARS[crypto.randomInt(CODE_CHARS.length)]).join(''); } while (onlineRooms.has(code));
  return code;
}
const cleanRoomName = v => String(v || 'لاعب').trim().replace(/\s+/g, ' ').slice(0, 20) || 'لاعب';
const roomPlayers = room => [...room.players.values()].map(p => ({ id: p.id, name: p.name, host: p.id === room.hostId, score: p.score || 0 }));
function clearRoomTimer(room) { if (room.timer) { clearTimeout(room.timer); room.timer = null; } }
function destroyRoom(room) {
  clearRoomTimer(room);
  if (room.deleteTimer) clearTimeout(room.deleteTimer);
  onlineRooms.delete(room.code);
}
function sendRoomUpdate(room) {
  for (const p of room.players.values()) {
    io.to(p.id).emit('room:update', {
      code: room.code, players: roomPlayers(room), started: room.started,
      qCount: room.questions.length, hostId: room.hostId, host: p.id === room.hostId
    });
  }
}
function publicQuestion(q) { return { m: q.m, d: q.d, q: q.q, a: q.a }; } // never leak the answer index

function sanitizeQuestions(list) {
  if (!Array.isArray(list)) return [];
  const out = [], seen = new Set();
  for (const q of list) {
    if (!q || typeof q !== 'object') continue;
    const text = String(q.q || '').trim().slice(0, 300);
    const a = Array.isArray(q.a) ? q.a.slice(0, 6).map(v => String(v == null ? '' : v).slice(0, 120)) : [];
    const x = Number(q.x);
    if (!text || a.length < 2 || !Number.isInteger(x) || x < 0 || x >= a.length || seen.has(text)) continue;
    seen.add(text);
    out.push({ m: String(q.m || 'quiz').slice(0, 20), d: String(q.d || 'سهل').slice(0, 10), q: text, a, x });
    if (out.length >= 30) break;
  }
  return out;
}

function finishRoomQuestion(room) {
  if (!room.started || room.revealed) return;
  room.revealed = true; clearRoomTimer(room);
  const answers = {};
  for (const [id, p] of room.players) if (p.answer !== undefined) answers[id] = p.answer;
  io.to(room.code).emit('room:questionResult', { correctIndex: room.questions[room.questionIndex].x, answers, players: roomPlayers(room) });
  room.timer = setTimeout(() => nextRoomQuestion(room), REVEAL_MS);
}

function nextRoomQuestion(room) {
  clearRoomTimer(room);
  if (!onlineRooms.has(room.code) || !room.started) return;
  room.questionIndex++; room.revealed = false;
  if (room.questionIndex >= room.questions.length) return endRoomGame(room);
  for (const p of room.players.values()) p.answer = undefined;
  const q = room.questions[room.questionIndex];
  room.questionEndsAt = Date.now() + QUESTION_MS;
  io.to(room.code).emit('room:question', {
    index: room.questionIndex, total: room.questions.length, time: QUESTION_MS / 1000,
    question: publicQuestion(q), players: roomPlayers(room)
  });
  room.timer = setTimeout(() => finishRoomQuestion(room), QUESTION_MS);
}

function endRoomGame(room) {
  clearRoomTimer(room);
  room.started = false; room.finished = true;
  const ranking = roomPlayers(room).sort((a, b) => b.score - a.score);
  io.to(room.code).emit('room:finished', { players: ranking });
  // Save results to the accounts of logged-in players (real multiplayer games only).
  if (room.players.size >= 2 && room.questions.length >= MIN_SAVED_QUESTIONS) {
    for (const p of room.players.values()) {
      if (!p.userId) continue;
      store.addResult(p.userId, 'friends-online', Math.min(p.score, room.questions.length * MAX_PER_QUESTION), p.correct || 0, room.questions.length)
        .catch(e => console.error('[room] save result failed:', e.message));
    }
  }
  room.deleteTimer = setTimeout(() => destroyRoom(room), 15000);
}

function leaveRoom(socket) {
  const code = socket.data.roomCode; if (!code) return;
  socket.data.roomCode = null;
  socket.leave(code);
  const room = onlineRooms.get(code); if (!room) return;
  room.players.delete(socket.id);
  if (room.players.size === 0) return destroyRoom(room);
  if (room.hostId === socket.id) room.hostId = room.players.keys().next().value;
  if (room.started) {
    if (room.players.size < 2) { sendRoomUpdate(room); return endRoomGame(room); }
    if (!room.revealed && [...room.players.values()].every(x => x.answer !== undefined)) finishRoomQuestion(room);
  }
  sendRoomUpdate(room);
}

io.use((socket, next) => {
  try {
    const t = socket.handshake.auth && socket.handshake.auth.token;
    if (t) socket.data.userId = jwt.verify(String(t), JWT_SECRET).id;
  } catch (_) { /* guests are allowed */ }
  next();
});

io.on('connection', socket => {
  socket.data.roomActionAt = 0;
  const allowRoomAction = () => { const now=Date.now(); if(now-(socket.data.roomActionAt||0)<800) return false; socket.data.roomActionAt=now; return true; };
  socket.on('room:create', ({ name, qCount } = {}) => {
    if (!allowRoomAction()) return socket.emit('room:error', { message: 'انتظر لحظة قبل المحاولة مجددًا.' });
    if (socket.data.roomCode) leaveRoom(socket);
    const code = newRoomCode(), playerName = cleanRoomName(name);
    const room = { code, hostId: socket.id, players: new Map(), questions: [], questionIndex: -1, started: false, finished: false, revealed: false, timer: null, deleteTimer: null, questionEndsAt: 0 };
    room.players.set(socket.id, { id: socket.id, name: playerName, score: 0, correct: 0, userId: socket.data.userId || null });
    onlineRooms.set(code, room); socket.join(code); socket.data.roomCode = code;
    socket.emit('room:created', { code, name: playerName, host: true, players: roomPlayers(room), qCount: Number(qCount) || 15 });
    sendRoomUpdate(room);
  });

  socket.on('room:join', ({ code, name } = {}) => {
    if (!allowRoomAction()) return socket.emit('room:error', { message: 'انتظر لحظة قبل المحاولة مجددًا.' });
    const c = String(code || '').trim().toUpperCase(), room = onlineRooms.get(c);
    if (!room) return socket.emit('room:error', { message: 'الغرفة غير موجودة أو انتهت.' });
    if (room.started || room.finished) return socket.emit('room:error', { message: 'اللعبة بدأت بالفعل، لا يمكن الدخول الآن.' });
    if (room.players.has(socket.id)) return;
    if (room.players.size >= MAX_PLAYERS) return socket.emit('room:error', { message: 'الغرفة ممتلئة (6 لاعبين كحد أقصى).' });
    const playerName = cleanRoomName(name);
    if ([...room.players.values()].some(p => p.name.toLowerCase() === playerName.toLowerCase()))
      return socket.emit('room:error', { message: 'اسم اللاعب مستخدم داخل هذه الغرفة.' });
    if (socket.data.roomCode) leaveRoom(socket);
    room.players.set(socket.id, { id: socket.id, name: playerName, score: 0, correct: 0, userId: socket.data.userId || null });
    socket.join(c); socket.data.roomCode = c;
    socket.emit('room:joined', { code: c, name: playerName, host: false, players: roomPlayers(room), qCount: room.questions.length });
    sendRoomUpdate(room);
  });

  socket.on('room:start', ({ code, questions } = {}) => {
    const room = onlineRooms.get(String(code || '').toUpperCase());
    if (!room) return socket.emit('room:error', { message: 'الغرفة غير موجودة.' });
    if (room.hostId !== socket.id) return socket.emit('room:error', { message: 'فقط صاحب الغرفة يستطيع بدء اللعبة.' });
    if (room.started) return;
    if (room.players.size < 2) return socket.emit('room:error', { message: 'تحتاج إلى لاعبين على الأقل لبدء التحدي.' });
    const qs = sanitizeQuestions(questions);
    if (!qs.length) return socket.emit('room:error', { message: 'لا توجد أسئلة كافية.' });
    room.questions = qs; room.questionIndex = -1; room.started = true; room.revealed = false;
    for (const p of room.players.values()) { p.score = 0; p.correct = 0; p.answer = undefined; }
    io.to(room.code).emit('room:started', { players: roomPlayers(room), total: qs.length });
    nextRoomQuestion(room);
  });

  socket.on('room:answer', ({ code, choice } = {}) => {
    const room = onlineRooms.get(String(code || '').toUpperCase());
    if (!room || !room.started || room.revealed) return;
    const p = room.players.get(socket.id);
    if (!p || p.answer !== undefined || Date.now() > room.questionEndsAt + 400) return;
    const q = room.questions[room.questionIndex];
    const c = Number(choice);
    p.answer = Number.isInteger(c) && c >= 0 && c < q.a.length ? c : -1;
    if (p.answer === q.x) {
      const base = q.d === 'صعب' ? 300 : q.d === 'متوسط' ? 200 : 100;
      const left = Math.max(0, Math.min(QUESTION_MS / 1000, Math.ceil((room.questionEndsAt - Date.now()) / 1000)));
      p.score += base + left * 5; p.correct = (p.correct || 0) + 1;
    }
    if ([...room.players.values()].every(x => x.answer !== undefined)) finishRoomQuestion(room);
  });

  socket.on('room:leave', () => leaveRoom(socket));
  socket.on('disconnect', () => leaveRoom(socket));
});

/* ---------- start ---------- */
process.on('unhandledRejection', e => console.error('[unhandledRejection]', e));
httpServer.on('error', e => {
  if (e.code === 'EADDRINUSE') console.error(`المنفذ ${PORT} مستخدم بالفعل. أغلق البرنامج الآخر أو غيّر PORT في ملف .env`);
  else console.error(e);
  process.exit(1);
});

(async () => {
  try { store = await initStore(process.env, DATA_DIR); }
  catch (e) { console.error('فشل تجهيز التخزين:', e.message); process.exit(1); }
  httpServer.listen(PORT, () => {
    console.log(`M5K Backend running: http://localhost:${PORT}`);
    console.log(`التخزين: ${store.kind === 'mysql' ? 'MySQL' : 'ملف JSON (backend/data/m5k-data.json)'}`);
  });
  const shutdown = () => { Promise.resolve(store.close()).finally(() => process.exit(0)); };
  process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
})();
