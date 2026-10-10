require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: true, credentials: true } });
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || 'm5k-change-me';
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) { console.warn('WARNING: Set a strong JWT_SECRET (32+ characters) in production.'); }

app.use(express.json({limit:'100kb'}));
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'..')));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'm5k',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  ...(String(process.env.DB_SSL || '').toLowerCase() === 'true' ? { ssl: { rejectUnauthorized: false } } : {})
});

function tokenFor(user){
  return jwt.sign({id:user.id, username:user.username, email:user.email}, JWT_SECRET, {expiresIn:'30d'});
}
function auth(req,res,next){
  const h=req.headers.authorization||'';
  const token=h.startsWith('Bearer ')?h.slice(7):null;
  if(!token) return res.status(401).json({error:'تسجيل الدخول مطلوب.'});
  try { req.user=jwt.verify(token,JWT_SECRET); next(); }
  catch { return res.status(401).json({error:'جلسة الدخول انتهت، سجل الدخول من جديد.'}); }
}
function cleanUsername(v){return String(v||'').trim();}
function cleanEmail(v){return String(v||'').trim().toLowerCase();}
function cleanLogin(v){return String(v||'').trim();}

app.get('/api/health', async (req,res)=>{
  try { await pool.query('SELECT 1'); res.json({ok:true, database:true}); }
  catch(e){ res.status(503).json({ok:false,database:false,error:'تعذر الاتصال بقاعدة البيانات.'}); }
});

app.post('/api/auth/register', async (req,res)=>{
  try{
    const username=cleanUsername(req.body.username), email=cleanEmail(req.body.email), password=String(req.body.password||'');
    if(!/^[\p{L}\p{N}_ .-]{3,30}$/u.test(username)) return res.status(400).json({error:'اسم المستخدم يجب أن يكون بين 3 و30 حرفًا.'});
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'البريد الإلكتروني غير صحيح.'});
    if(password.length<6) return res.status(400).json({error:'كلمة المرور يجب أن تكون 6 أحرف على الأقل.'});
    const [exists]=await pool.query('SELECT id FROM users WHERE email=? OR username=? LIMIT 1',[email,username]);
    if(exists.length) return res.status(409).json({error:'اسم المستخدم أو البريد مستخدم بالفعل.'});
    const hash=await bcrypt.hash(password,12);
    const [r]=await pool.query('INSERT INTO users(username,email,password_hash) VALUES(?,?,?)',[username,email,hash]);
    const user={id:r.insertId,username,email};
    res.status(201).json({user,token:tokenFor(user)});
  }catch(e){console.error(e);res.status(500).json({error:'حدث خطأ أثناء إنشاء الحساب.'});}
});

app.post('/api/auth/login', async (req,res)=>{
  try{
    const login=cleanLogin(req.body.login || req.body.email), password=String(req.body.password||'');
    const [rows]=await pool.query('SELECT id,username,email,password_hash,best_score,games_played,total_points,correct_answers FROM users WHERE email=? OR username=? LIMIT 1',[cleanEmail(login),login]);
    if(!rows.length || !(await bcrypt.compare(password,rows[0].password_hash))) return res.status(401).json({error:'البريد أو كلمة المرور غير صحيحة.'});
    const u=rows[0]; const user={id:u.id,username:u.username,email:u.email};
    res.json({user,token:tokenFor(user)});
  }catch(e){console.error(e);res.status(500).json({error:'حدث خطأ أثناء تسجيل الدخول.'});}
});

app.get('/api/me',auth,async(req,res)=>{
  const [rows]=await pool.query('SELECT id,username,email,best_score,games_played,total_points,correct_answers,created_at FROM users WHERE id=?',[req.user.id]);
  if(!rows.length) return res.status(404).json({error:'المستخدم غير موجود.'});
  res.json({user:rows[0]});
});

const liveFriends = new Map();
function pruneLiveFriends(){
  const now=Date.now();
  for(const [id,room] of liveFriends){ if(now-room.updatedAt > 12000) liveFriends.delete(id); }
}
app.get('/api/live/friends',(req,res)=>{
  pruneLiveFriends();
  const names=[];
  for(const room of liveFriends.values()) for(const name of (room.players||[])) if(name && !names.includes(name)) names.push(name);
  for(const room of onlineRooms.values()) for(const p of room.players.values()) if(p.name && !names.includes(p.name)) names.push(p.name);
  const socketRooms=[...onlineRooms.values()].filter(r=>r.players.size>0).length;
  res.json({count:names.length,players:names.slice(0,24),rooms:liveFriends.size+socketRooms});
});
app.post('/api/live/friends/heartbeat',(req,res)=>{
  const clientId=String(req.body.clientId||'').slice(0,100);
  if(!clientId) return res.status(400).json({error:'clientId مطلوب.'});
  const players=Array.isArray(req.body.players) ? req.body.players.map(x=>String(x||'').trim().slice(0,30)).filter(Boolean).slice(0,6) : [];
  liveFriends.set(clientId,{players,updatedAt:Date.now()});
  pruneLiveFriends();
  res.json({ok:true});
});
app.post('/api/live/friends/leave',(req,res)=>{
  const clientId=String(req.body.clientId||'').slice(0,100);
  if(clientId) liveFriends.delete(clientId);
  res.json({ok:true});
});

app.post('/api/results',auth,async(req,res)=>{
  try{
    const mode=String(req.body.mode||'unknown').slice(0,40);
    const score=Math.max(0,Math.min(100000,Number(req.body.score)||0));
    const correct=Math.max(0,Math.min(1000,Number(req.body.correctAnswers)||0));
    const total=Math.max(0,Math.min(1000,Number(req.body.totalQuestions)||0));
    await pool.query('INSERT INTO game_results(user_id,mode,score,correct_answers,total_questions) VALUES(?,?,?,?,?)',[req.user.id,mode,score,correct,total]);
    await pool.query('UPDATE users SET best_score=GREATEST(best_score,?),games_played=games_played+1,total_points=total_points+?,correct_answers=correct_answers+? WHERE id=?',[score,score,correct,req.user.id]);
    res.status(201).json({ok:true});
  }catch(e){console.error(e);res.status(500).json({error:'تعذر حفظ النتيجة.'});}
});

app.get('/api/leaderboard',async(req,res)=>{
  try{
    const [rows]=await pool.query('SELECT username,best_score,games_played FROM users WHERE games_played>0 ORDER BY best_score DESC, total_points DESC, id ASC LIMIT 50');
    res.json({players:rows});
  }catch(e){console.error(e);res.status(500).json({error:'تعذر تحميل المتصدرين.'});}
});

app.get('/api/profile/:username',async(req,res)=>{
  try{
    const [rows]=await pool.query('SELECT username,best_score,games_played,total_points,correct_answers,created_at FROM users WHERE username=? LIMIT 1',[req.params.username]);
    if(!rows.length) return res.status(404).json({error:'المستخدم غير موجود.'});
    res.json({user:rows[0]});
  }catch(e){res.status(500).json({error:'تعذر تحميل الملف الشخصي.'});}
});

app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'..','index.html')));

async function saveOnlineRoomResults(players, totalQuestions){
  for (const p of players) {
    if (!p.userId) continue;
    try {
      const score = Math.max(0, Math.min(100000, Number(p.score) || 0));
      const correct = Math.max(0, Math.min(1000, Number(p.correctAnswers) || 0));
      await pool.query('INSERT INTO game_results(user_id,mode,score,correct_answers,total_questions) VALUES(?,?,?,?,?)', [p.userId, 'friends_online', score, correct, totalQuestions]);
      await pool.query('UPDATE users SET best_score=GREATEST(best_score,?),games_played=games_played+1,total_points=total_points+?,correct_answers=correct_answers+? WHERE id=?', [score, score, correct, p.userId]);
    } catch (e) { console.error('Failed to save online room result:', e.message); }
  }
}
function socketAccount(socket, token){
  try { const decoded = jwt.verify(String(token || ''), JWT_SECRET); return {id:Number(decoded.id), username:String(decoded.username || '').slice(0,30)}; }
  catch { return null; }
}

const onlineRooms = new Map();
const ROOM_CODE = () => {
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code=''; do { code=''; for(let i=0;i<6;i++) code += chars[Math.floor(Math.random()*chars.length)]; } while(onlineRooms.has(code));
  return code;
};
function roomPlayers(room){ return [...room.players.values()].map(p=>({id:p.id,name:p.name,host:p.host,score:p.score||0})); }
function publicRoom(room){ return {code:room.code,host:room.hostId===room.hostSocketId,hostId:room.hostId,players:roomPlayers(room),started:room.started,qCount:room.questions.length}; }
function cleanRoomName(v){ return String(v||'لاعب').trim().slice(0,20) || 'لاعب'; }
function sendRoomUpdate(room){ io.to(room.code).emit('room:update',{code:room.code,players:roomPlayers(room),started:room.started,qCount:room.questions.length,hostId:room.hostId}); }
function clearRoomTimer(room){ if(room.timer){clearTimeout(room.timer);room.timer=null;} }
function finishRoomQuestion(room){
  if(!room.started || room.revealed) return;
  room.revealed=true; clearRoomTimer(room);
  const answers={}; for(const [id,p] of room.players) if(p.answer!==undefined) answers[id]=p.answer;
  const q=room.questions[room.questionIndex];
  io.to(room.code).emit('room:questionResult',{correctIndex:q.x,answers,players:roomPlayers(room)});
  room.timer=setTimeout(()=>nextRoomQuestion(room),1600);
}
function nextRoomQuestion(room){
  clearRoomTimer(room); room.questionIndex++; room.revealed=false;
  if(room.questionIndex>=room.questions.length){
    room.started=false; io.to(room.code).emit('room:finished',{players:roomPlayers(room).sort((a,b)=>b.score-a.score)});
    setTimeout(()=>onlineRooms.delete(room.code),15000); return;
  }
  for(const p of room.players.values()) p.answer=undefined;
  const q=room.questions[room.questionIndex];
  io.to(room.code).emit('room:question',{index:room.questionIndex,total:room.questions.length,time:15,question:q,players:roomPlayers(room)});
  room.timer=setTimeout(()=>finishRoomQuestion(room),15000);
}
function leaveRoom(socket){
  const code=socket.data.roomCode; if(!code)return;
  const room=onlineRooms.get(code); if(!room)return;
  room.players.delete(socket.id);
  if(room.hostId===socket.id){
    const next=room.players.values().next().value;
    if(next){next.host=true;room.hostId=next.id;room.hostSocketId=next.id;}
    else {clearRoomTimer(room);onlineRooms.delete(code);return;}
  }
  if(room.started && room.players.size<1){clearRoomTimer(room);onlineRooms.delete(code);return;}
  sendRoomUpdate(room);
  socket.data.roomCode=null;
}

io.on('connection', socket=>{
  socket.on('room:create',({name,qCount,token}={})=>{
    const account=socketAccount(socket,token); if(!account) return socket.emit('room:error',{message:'سجّل الدخول أولًا حتى تُحفظ نتيجتك في حسابك.'});
    if(socket.data.roomCode) leaveRoom(socket);
    const code=ROOM_CODE(), playerName=account.username;
    const room={code,hostId:socket.id,hostSocketId:socket.id,players:new Map(),questions:[],questionIndex:-1,started:false,revealed:false,timer:null};
    room.players.set(socket.id,{id:socket.id,userId:account.id,name:playerName,host:true,score:0,correctAnswers:0}); onlineRooms.set(code,room); socket.join(code);socket.data.roomCode=code;
    socket.emit('room:created',{code,name:playerName,host:true,players:roomPlayers(room),qCount:Number(qCount)||15}); sendRoomUpdate(room);
  });
  socket.on('room:join',({code,name,token}={})=>{
    const account=socketAccount(socket,token); if(!account) return socket.emit('room:error',{message:'سجّل الدخول أولًا حتى تُحفظ نتيجتك في حسابك.'});
    const c=String(code||'').trim().toUpperCase(), room=onlineRooms.get(c);
    if(!room)return socket.emit('room:error',{message:'الغرفة غير موجودة أو انتهت.'});
    if(room.started)return socket.emit('room:error',{message:'اللعبة بدأت بالفعل، لا يمكن الدخول الآن.'});
    if(room.players.size>=6)return socket.emit('room:error',{message:'الغرفة ممتلئة (6 لاعبين كحد أقصى).'});
    if(socket.data.roomCode) leaveRoom(socket);
    const playerName=account.username;
    if([...room.players.values()].some(p=>p.name.toLowerCase()===playerName.toLowerCase())) return socket.emit('room:error',{message:'اسم اللاعب مستخدم داخل هذه الغرفة.'});
    room.players.set(socket.id,{id:socket.id,userId:account.id,name:playerName,host:false,score:0,correctAnswers:0}); socket.join(c);socket.data.roomCode=c;
    socket.emit('room:joined',{code:c,name:playerName,host:false,players:roomPlayers(room),qCount:room.questions.length}); sendRoomUpdate(room);
  });
  socket.on('room:start',({code,questions}={})=>{
    const room=onlineRooms.get(String(code||'').toUpperCase()); if(!room)return socket.emit('room:error',{message:'الغرفة غير موجودة.'});
    if(room.hostId!==socket.id)return socket.emit('room:error',{message:'فقط صاحب الغرفة يستطيع بدء اللعبة.'});
    if(room.players.size<2)return socket.emit('room:error',{message:'تحتاج إلى لاعبين على الأقل لبدء التحدي.'});
    if(!Array.isArray(questions)||!questions.length)return socket.emit('room:error',{message:'لا توجد أسئلة كافية.'});
    room.questions=questions.slice(0,30).map(q=>({m:q.m,d:q.d,q:String(q.q||''),a:Array.isArray(q.a)?q.a.slice(0,6):[],x:Number(q.x)||0}));
    room.questionIndex=-1;room.started=true;room.revealed=false;for(const p of room.players.values()){p.score=0;p.correctAnswers=0;p.answer=undefined;}
    io.to(room.code).emit('room:started',{players:roomPlayers(room),total:room.questions.length}); nextRoomQuestion(room);
  });
  socket.on('room:answer',({code,choice}={})=>{
    const room=onlineRooms.get(String(code||'').toUpperCase()); if(!room||!room.started||room.revealed)return;
    const p=room.players.get(socket.id); if(!p||p.answer!==undefined)return;
    const q=room.questions[room.questionIndex]; const c=Number(choice); p.answer=Number.isInteger(c)?c:-1;
    if(p.answer===q.x){p.correctAnswers=(p.correctAnswers||0)+1;const base=q.d==='صعب'?300:q.d==='متوسط'?200:100; const bonus=Math.max(0,Math.ceil((room.questionEndsAt-Date.now())/1000)*5);p.score+=base+bonus;}
    if([...room.players.values()].every(x=>x.answer!==undefined)) finishRoomQuestion(room);
  });
  socket.on('room:leave',()=>leaveRoom(socket));
  socket.on('disconnect',()=>leaveRoom(socket));
});

// Keep a real end timestamp for speed bonuses.
const originalNextRoomQuestion=nextRoomQuestion;
nextRoomQuestion=function(room){
  clearRoomTimer(room); room.questionIndex++; room.revealed=false;
  if(room.questionIndex>=room.questions.length){ room.started=false; const finalPlayers=[...room.players.values()].map(p=>({...p})); saveOnlineRoomResults(finalPlayers, room.questions.length); io.to(room.code).emit('room:finished',{players:roomPlayers(room).sort((a,b)=>b.score-a.score)}); setTimeout(()=>onlineRooms.delete(room.code),15000); return; }
  for(const p of room.players.values()) p.answer=undefined;
  const q=room.questions[room.questionIndex]; room.questionEndsAt=Date.now()+15000;
  io.to(room.code).emit('room:question',{index:room.questionIndex,total:room.questions.length,time:15,question:q,players:roomPlayers(room)});
  room.timer=setTimeout(()=>finishRoomQuestion(room),15000);
};

httpServer.listen(PORT,()=>console.log(`M5K Backend running: http://localhost:${PORT}`));
