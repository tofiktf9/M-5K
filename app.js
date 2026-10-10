const API_BASE = 'https://m5k.onrender.com';

const originalFetch = window.fetch.bind(window);

window.fetch = (input, init) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    input = API_BASE + input;
  }
  return originalFetch(input, init);
};

const ID_ALIASES = {
  questionNumber: ["questionNumber", "qNumber", "counter"],
  quizTitle: ["quizTitle", "modeTitle"],
  questionText: ["questionText", "question"],
  difficulty: ["difficulty", "qCat", "diff"],
  scoreNow: ["scoreNow", "score"],
  answers: ["answers"],
  feedback: ["feedback", "answerMsg"],
  timeLeft: ["timeLeft", "timer"],
  timeBar: ["timeBar", "progress"],
  resultTitle: ["resultTitle"],
  resultText: ["resultText"],
  resultScore: ["resultScore"]
};

const $ = id => {
  const ids = ID_ALIASES[id] || [id];
  for (const name of ids) {
    const el = document.getElementById(name);
    if (el) return el;
  }
  return null;
};

const modes = {
  quiz: {name:"🧠 من يعرف أكثر؟", desc:"أسئلة معلومات عامة بثلاث درجات صعوبة.", time:15},
  speed:{name:"⚡ تحدي السرعة", desc:"أسئلة سريعة، والوقت القصير يزيد التحدي.", time:7},
  guess:{name:"🎯 خمنها", desc:"خمن الشيء أو الشخص أو المكان من التلميح.", time:15},
  imageguess:{name:"🖼️ خمن الصورة", desc:"شاهد منتجًا حقيقيًا واختر العلامة الصحيحة.", time:18},
  playerguess:{name:"⚽ خمن اللاعب", desc:"شاهد وجه اللاعب كاملًا واختر اسمه.", time:18},
  celebrityguess:{name:"🌟 خمن المشهور", desc:"شاهد صورة المشهور أو اليوتيوبر وخمّن من هو.", time:18},
  youtuberguess:{name:"▶️ خمن اليوتيوبر", desc:"شاهد صورة اليوتيوبر وخمّن من هو.", time:18},
  emoji:{name:"🎭 خمن بالإيموجي", desc:"فك رموز الإيموجي وخمّن الفيلم أو اللعبة أو الشخصية.", time:15},
  flagguess:{name:"🏳️ خمن العلم", desc:"شاهد العلم وخمّن الدولة الصحيحة.", time:15},
  currencyguess:{name:"💰 عملة أي دولة؟", desc:"شاهد اسم العملة أو رمزها وخمّن الدولة الصحيحة.", time:15},
  foodguess:{name:"🍽️ من أي بلد؟", desc:"خمّن البلد الذي يشتهر بهذا الطعام.", time:15},
  pattern:{name:"🔢 أكمل النمط", desc:"اكتشف الرقم التالي في النمط.", time:15},
  wordmix:{name:"🔤 فك الكلمة", desc:"رتّب الحروف لتكوين الكلمة الصحيحة.", time:15},
  bigger:{name:"📏 أيهما أكبر؟", desc:"قارن بين شيئين واختر الأكبر.", time:12},
  whami:{name:"🕵️ من أنا؟", desc:"اقرأ التلميحات واكتشف الشخصية قبل أن ينتهي الوقت.", time:18},
  riddle:{name:"🧩 لغز سريع", desc:"حل ألغاز قصيرة واختر الإجابة الصحيحة بسرعة.", time:15},
  cityguess:{name:"🏙️ خمن المدينة", desc:"اقرأ التلميحات وخمّن المدينة الصحيحة.", time:15},
  translate:{name:"🌐 ترجمة سريعة", desc:"اختبر سرعتك في معرفة معنى الكلمات الإنجليزية والعربية.", time:12},
  oddone:{name:"🧠 المختلف", desc:"اختر الشيء المختلف قبل انتهاء الوقت.", time:12},
  numberguess:{name:"🎯 خمن الرقم", desc:"استنتج الرقم الصحيح من التلميحات والخيارات.", time:15},
  logic:{name:"🧠 منطق سريع", desc:"حل موقفًا منطقيًا واختر النتيجة الصحيحة.", time:18},
  order:{name:"🏁 من يأتي أولًا؟", desc:"رتّب الأحداث والأشياء بالترتيب الصحيح.", time:15},
  memory:{name:"🧠 ذاكرة سريعة", desc:"احفظ التسلسل لثوانٍ ثم اختر الإجابة الصحيحة.", time:15},
  math:{name:"➗ حساب خاطف", desc:"حل العملية بسرعة قبل انتهاء الوقت.", time:12},
  password:{name:"🔐 كلمة السر", desc:"اكتشف الكلمة المطلوبة من عدة تلميحات.", time:18},
  tf:{name:"صح أو خطأ", desc:"احكم على المعلومة: صحيحة أم خاطئة.", time:8},
  mixed:{name:"🧩 أسئلة متنوعة وعشوائية", desc:"مزيج عشوائي من جميع الألعاب.", time:15}
};

const questions = [
/* من يعرف أكثر */
{m:"quiz",d:"سهل",q:"ما عاصمة الجزائر؟",a:["الجزائر","وهران","قسنطينة","عنابة"],x:0},
{m:"quiz",d:"سهل",q:"ما الكوكب المعروف بالكوكب الأحمر؟",a:["المشتري","المريخ","الزهرة","عطارد"],x:1},
{m:"quiz",d:"سهل",q:"كم عدد أيام الأسبوع؟",a:["5","6","7","8"],x:2},
{m:"quiz",d:"سهل",q:"ما أكبر محيط في العالم؟",a:["الأطلسي","الهندي","الهادئ","المتجمد"],x:2},
{m:"quiz",d:"سهل",q:"كم عدد أرجل العنكبوت؟",a:["6","8","10","12"],x:1},
{m:"quiz",d:"سهل",q:"ما عاصمة مصر؟",a:["القاهرة","دمشق","الرباط","طرابلس"],x:0},
{m:"quiz",d:"سهل",q:"ما العضو الذي يضخ الدم؟",a:["الرئة","القلب","الكبد","المعدة"],x:1},
{m:"quiz",d:"سهل",q:"كم دقيقة في الساعة؟",a:["30","45","60","90"],x:2},
{m:"quiz",d:"سهل",q:"ما لون الزمرد؟",a:["أحمر","أزرق","أخضر","أصفر"],x:2},
{m:"quiz",d:"سهل",q:"ما الحيوان المعروف بسفينة الصحراء؟",a:["الجمل","الحصان","الفيل","الغزال"],x:0},
{m:"quiz",d:"متوسط",q:"ما عاصمة أستراليا؟",a:["سيدني","ملبورن","كانبيرا","بيرث"],x:2},
{m:"quiz",d:"متوسط",q:"ما الغاز الأكثر وفرة في الغلاف الجوي؟",a:["الأكسجين","النيتروجين","الهيدروجين","ثاني أكسيد الكربون"],x:1},
{m:"quiz",d:"متوسط",q:"من رسم الموناليزا؟",a:["بيكاسو","ليوناردو دا فينشي","فان غوخ","رامبرانت"],x:1},
{m:"quiz",d:"متوسط",q:"ما أصغر عدد أولي؟",a:["0","1","2","3"],x:2},
{m:"quiz",d:"متوسط",q:"ما وحدة شدة التيار الكهربائي؟",a:["فولت","واط","أمبير","أوم"],x:2},
{m:"quiz",d:"متوسط",q:"ما العملية التي تصنع بها النباتات غذاءها؟",a:["التنفس","البناء الضوئي","الهضم","التخمر"],x:1},
{m:"quiz",d:"متوسط",q:"ما أكبر دولة في العالم من حيث المساحة؟",a:["الصين","كندا","روسيا","البرازيل"],x:2},
{m:"quiz",d:"صعب",q:"ما العنصر الذي عدده الذري 79؟",a:["الفضة","الذهب","البلاتين","الزئبق"],x:1},
{m:"quiz",d:"صعب",q:"ما اسم مجرتنا؟",a:["أندروميدا","درب التبانة","المثلث","سومبريرو"],x:1},
{m:"quiz",d:"صعب",q:"من وضع قوانين الحركة الثلاثة؟",a:["نيوتن","أينشتاين","غاليليو","كبلر"],x:0},
{m:"quiz",d:"صعب",q:"ما أكبر قمر لكوكب زحل؟",a:["أوروبا","تيتان","غانيميد","تريتون"],x:1},
{m:"quiz",d:"صعب",q:"ما وحدة المقاومة الكهربائية؟",a:["أوم","أمبير","فولت","جول"],x:0},
{m:"quiz",d:"صعب",q:"ما أصغر عظمة في جسم الإنسان؟",a:["الركاب","الفخذ","الزند","القص"],x:0},

/* تحدي السرعة */
{m:"speed",d:"سهل",q:"⚡ بسرعة: 7 + 5 = ؟",a:["10","11","12","13"],x:2},
{m:"speed",d:"سهل",q:"⚡ بسرعة: ما عاصمة فرنسا؟",a:["مدريد","باريس","روما","برلين"],x:1},
{m:"speed",d:"سهل",q:"⚡ بسرعة: كم شهرًا في السنة؟",a:["10","11","12","13"],x:2},
{m:"speed",d:"متوسط",q:"⚡ بسرعة: 12 × 4 = ؟",a:["36","48","52","44"],x:1},
{m:"speed",d:"متوسط",q:"⚡ بسرعة: 100 ÷ 4 = ؟",a:["20","25","30","40"],x:1},
{m:"speed",d:"متوسط",q:"⚡ بسرعة: كم ضلعاً للمربع؟",a:["3","4","5","6"],x:1},
{m:"speed",d:"صعب",q:"⚡ بسرعة: 15² = ؟",a:["125","200","225","250"],x:2},
{m:"speed",d:"صعب",q:"⚡ بسرعة: ما عاصمة اليابان؟",a:["كيوتو","طوكيو","أوساكا","ناغويا"],x:1},
{m:"speed",d:"صعب",q:"⚡ بسرعة: 144 ÷ 12 = ؟",a:["10","11","12","13"],x:2},

/* خمنها */
{m:"guess",d:"سهل",q:"🎯 خمنها: أنا بلد عربي عاصمتي الجزائر ولدي ساحل على البحر المتوسط.",a:["الجزائر","تونس","ليبيا","المغرب"],x:0},
{m:"guess",d:"سهل",q:"🎯 خمنها: أنا الكوكب الأزرق الذي نعيش عليه.",a:["الأرض","المريخ","زحل","عطارد"],x:0},
{m:"guess",d:"سهل",q:"🎯 خمنها: أنا حيوان كبير أملك خرطوماً وأذنين كبيرتين.",a:["الزرافة","الفيل","وحيد القرن","الجمل"],x:1},
{m:"guess",d:"متوسط",q:"🎯 خمنها: عالم ارتبط بقوانين الحركة والجاذبية.",a:["نيوتن","داروين","باستور","أرسطو"],x:0},
{m:"guess",d:"متوسط",q:"🎯 خمنها: مدينة إيطالية مشهورة بالقنوات المائية.",a:["روما","ميلانو","البندقية","تورينو"],x:2},
{m:"guess",d:"متوسط",q:"🎯 خمنها: شركة صنعت PlayStation.",a:["Microsoft","Sony","Nintendo","Sega"],x:1},
{m:"guess",d:"صعب",q:"🎯 خمنها: حضارة قديمة اشتهرت بالكتابة المسمارية في بلاد الرافدين.",a:["السومريون","الإنكا","الفايكنغ","الإغريق"],x:0},
{m:"guess",d:"صعب",q:"🎯 خمنها: عالم وضع نظرية النسبية.",a:["نيوتن","أينشتاين","ماكسويل","داروين"],x:1},

/* خمن اللاعب */
{m:"playerguess",d:"سهل",q:"من هذا اللاعب؟",a:["ليونيل ميسي","كريستيانو رونالدو","نيمار","كيليان مبابي"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Lionel_messi.jpg?width=1000",player:"ليونيل ميسي"},
{m:"playerguess",d:"سهل",q:"من هذا اللاعب؟",a:["كريستيانو رونالدو","ليونيل ميسي","كيليان مبابي","إيرلينغ هالاند"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Christiano_Ronaldo_at_world_cup_match_2026.jpg?width=1000",player:"كريستيانو رونالدو"},
{m:"playerguess",d:"سهل",q:"من هذا اللاعب؟",a:["كيليان مبابي","نيمار","ليونيل ميسي","كريم بنزيما"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Kylian_Mbappe_-_France_v_Senegal_-_16_June_2026.jpg?width=1000",player:"كيليان مبابي"},
{m:"playerguess",d:"سهل",q:"من هذا اللاعب؟",a:["إيرلينغ هالاند","هاري كين","كيليان مبابي","جود بيلينغهام"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Erling_Haaland_June_2025.jpg?width=1000",player:"إيرلينغ هالاند"},
{m:"playerguess",d:"سهل",q:"من هذا اللاعب؟",a:["نيمار","رودريغو","فينيسيوس جونيور","رافينيا"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Neymar_%2816245492137%29_%28cropped%29.jpg?width=1000",player:"نيمار"},
{m:"playerguess",d:"سهل",q:"من هذا اللاعب؟",a:["كريم بنزيما","محمد صلاح","رياض محرز","روبرت ليفاندوفسكي"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Karim_Benzema_2021.jpg?width=1000",player:"كريم بنزيما"},

/* ذاكرة سريعة */
{m:"memory",d:"سهل",q:"🧠 تذكّر التسلسل: 🔵 🟢 🔴 — ما الرمز الثاني؟",a:["🟢","🔴","🔵","🟡"],x:0},
{m:"memory",d:"سهل",q:"🧠 تذكّر التسلسل: 4 - 7 - 2 — ما الرقم الأخير؟",a:["2","4","7","9"],x:0},
{m:"memory",d:"سهل",q:"🧠 تذكّر: قمر، بحر، جبل — ما الكلمة الثانية؟",a:["بحر","جبل","قمر","نهر"],x:0},
{m:"memory",d:"سهل",q:"🧠 تذكّر: 🐶 🍎 🚗 — ما العنصر الأول؟",a:["🐶","🍎","🚗","🐱"],x:0},
{m:"memory",d:"سهل",q:"🧠 تذكّر: 8 - 3 - 9 — ما الرقم الأوسط؟",a:["3","8","9","6"],x:0},

/* حساب خاطف */
{m:"math",d:"سهل",q:"➗ كم يساوي 7 + 5؟",a:["12","11","13","10"],x:0},
{m:"math",d:"سهل",q:"➗ كم يساوي 9 - 4؟",a:["5","6","4","3"],x:0},
{m:"math",d:"سهل",q:"➗ كم يساوي 6 × 3؟",a:["18","16","20","12"],x:0},
{m:"math",d:"سهل",q:"➗ كم يساوي 20 ÷ 4؟",a:["5","4","6","8"],x:0}
];

let selectedMode = "quiz";
let round = [];
let current = 0;
let score = 0;
let timer = null;
let timeLeft = 0;
let answered = false;
let hintCharges = 1;
let correctCount = 0;
let friendMode = false;
let friendPlayers = [];
let friendScores = {};
let friendTurn = 0;
let friendQuestionIndex = 0;
let friendCorrectCounts = {};
let liveClientId = localStorage.getItem("m5kLiveClientId") || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
localStorage.setItem("m5kLiveClientId", liveClientId);
let liveHeartbeatTimer = null;
let liveCountValue = 0;

const el = id => document.getElementById(id);
let pendingExitTarget = null;

function show(id, bypassExit=false){
  const quizPage = el("quiz");
  if(!bypassExit && id !== "quiz" && quizPage && quizPage.classList.contains("active") && !el("exitGameModal")?.classList.contains("active")){
    pendingExitTarget = id;
    requestExitGame(id);
    return;
  }
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = el(id);
  if(page) page.classList.add("active");
  if(id === "profile") updateStats();
  if(id === "leaders") updateLeaders();
}

function animateLiveCount(target){
  target = Math.max(0, Number(target)||0);
  const elCount = el("friendsLiveCount");
  if(!elCount) return;
  const from = liveCountValue;
  const diff = target - from;
  if(!diff){ elCount.textContent = target.toLocaleString("en-US"); return; }
  const start = performance.now();
  const duration = 450;
  function step(now){
    const p = Math.min(1, (now-start)/duration);
    const eased = p < .5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2;
    const value = Math.round(from + diff*eased);
    elCount.textContent = value.toLocaleString("en-US");
    if(p < 1) requestAnimationFrame(step); else liveCountValue = target;
  }
  requestAnimationFrame(step);
}

function renderFriendsLive(data){
  const count = Number(data?.count)||0;
  const status = el("friendsLiveStatus");
  const box = el("friendsLivePlayers");
  animateLiveCount(count);
  if(status){
    status.classList.toggle("offline", count===0);
    status.textContent = count > 0 ? "● LIVE الآن" : "○ لا توجد غرفة LIVE";
  }
  if(box){
    const players = Array.isArray(data?.players) ? data.players : [];
    if(!players.length){ box.innerHTML = '<span class="live-empty">لا توجد غرفة نشطة الآن</span>'; return; }
    const visible = players.slice(0,4);
    box.innerHTML = visible.map(name=>`<i class="live-avatar" title="${escapeHtml(name)}">${escapeHtml(String(name||"ل").trim().charAt(0)||"ل")}</i>`).join("")
      + (players.length>4 ? `<span class="live-more">+${players.length-4}</span>` : "");
  }
}

async function refreshFriendsLive(){
  try{
    const r=await fetch('/api/live/friends',{cache:'no-store'});
    if(!r.ok) throw new Error();
    renderFriendsLive(await r.json());
  }catch(e){
    renderFriendsLive({count:0,players:[]});
  }
}

function startFriendsHeartbeat(){
  stopFriendsHeartbeat();
  const send=()=>fetch('/api/live/friends/heartbeat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId:liveClientId,players:friendPlayers}),keepalive:true}).catch(()=>{});
  send();
  liveHeartbeatTimer=setInterval(send,4000);
}

function stopFriendsHeartbeat(){
  if(liveHeartbeatTimer){clearInterval(liveHeartbeatTimer);liveHeartbeatTimer=null;}
}

function leaveFriendsHeartbeat(){
  fetch('/api/live/friends/leave',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId:liveClientId}),keepalive:true}).catch(()=>{});
}

function startFriendsSetup(){
  show("friendsSetup");
}

function startFriendsGame(){
  const raw = (el("friendNames")?.value || "").split(/[،,\n]+/).map(x=>x.trim()).filter(Boolean);
  const names = [...new Set(raw)].slice(0,6);
  if(names.length < 2){
    alert("أدخل اسم لاعبين على الأقل.");
    return;
  }
  friendPlayers = names;
  friendScores = {};
  names.forEach(n => friendScores[n] = 0);
  friendTurn = 0;
  friendQuestionIndex = 0;
  friendCorrectCounts = {};
  names.forEach(n => friendCorrectCounts[n] = 0);
  friendMode = true;
  startFriendsHeartbeat();
  selectedMode = "quiz";
  const wanted = parseInt(el("friendQCount")?.value,10) || 10;
  const pool = shuffle(questions.filter(q => q.m === "quiz" || q.m === "mixed"));
  const seen = new Set();
  round = pool.filter(q => !seen.has(q.q) && (seen.add(q.q), true)).slice(0, Math.min(wanted, pool.length));
  if(!round.length){ alert("لا توجد أسئلة لتحدي الأصدقاء."); return; }
  current = 0; score = 0; hintCharges = 1; correctCount = 0; answered = false;
  updateHintButton();
  show("quiz");
  renderQuestion();
}

function chooseMode(mode){
  if(!modes[mode]) mode = "quiz";
  selectedMode = mode;
  friendMode = false;
  const saved = localStorage.getItem("m5kPlayerName") || "";
  const name = el("gameName");
  const player = el("playerName");
  if(player) player.value = saved;
  if(name) name.value = modes[mode].name;
  if(el("qCount")) {
    const allowed = ["10","15","20","25","30"];
    if(!allowed.includes(String(el("qCount").value))) el("qCount").value = "15";
  }
  show("create");
}

function shuffle(array){
  const a = [...array];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function buildRound(){
  const pool = selectedMode === "mixed"
    ? questions
    : questions.filter(q => q.m === selectedMode);

  const unique = [];
  const seen = new Set();
  for(const q of shuffle(pool)){
    const uniqueKey = q.q;
    if(!seen.has(uniqueKey)){
      seen.add(uniqueKey);
      unique.push(q);
    }
  }

  let wanted = parseInt(el("qCount")?.value, 10) || 15;
  wanted = Math.max(10, Math.min(wanted, unique.length));

  round = unique.slice(0, Math.min(wanted, unique.length)).map(q => {
    const copy = {...q, a:[...(q.a || [])]};
    const correctAnswer = copy.a[copy.x];
    const shuffledAnswers = shuffle(copy.a);
    copy.a = shuffledAnswers;
    copy.x = shuffledAnswers.indexOf(correctAnswer);
    return copy;
  });
}

function startGame(){
  stopFriendsHeartbeat();
  leaveFriendsHeartbeat();
  window.m5kRoundCorrect=0;
  clearInterval(timer);
  const name = (el("playerName")?.value || "").trim().slice(0,20);
  if(!name){
    alert("اكتب اسمك أولاً حتى تظهر نتيجتك في المتصدرين 🏆");
    el("playerName")?.focus();
    return;
  }
  localStorage.setItem("m5kPlayerName", name);

  buildRound();
  if(!round.length){
    alert("لا توجد أسئلة لهذه اللعبة.");
    return;
  }

  current = 0;
  score = 0;
  hintCharges = 1;
  correctCount = 0;
  friendMode = false;
  answered = false;
  updateHintButton();
  show("quiz");
  renderQuestion();
}

function requestExitGame(target="games"){
  pendingExitTarget = target || pendingExitTarget || "games";
  const modal=el("exitGameModal");
  if(modal) modal.classList.add("active");
}

function closeExitGame(){
  const modal=el("exitGameModal");
  if(modal) modal.classList.remove("active");
}

function confirmExitGame(){
  const target = pendingExitTarget || "games";
  pendingExitTarget = null;
  closeExitGame();
  clearInterval(timer);
  stopFriendsHeartbeat();
  leaveFriendsHeartbeat();
  friendMode=false;
  answered=false;
  show(target, true);
}

function renderQuestion(){
  clearInterval(timer);

  if(current >= round.length){
    finishGame();
    return;
  }

  const q = round[current];
  answered = false;

  el("qNumber").textContent = friendMode
    ? `دور: ${friendPlayers[friendTurn]} — السؤال ${current + 1} / ${round.length}`
    : `السؤال ${current + 1} / ${round.length}`;
  el("qCat").textContent = modes[q.m]?.name || "تحدي";

  el("questionText").textContent = q.q;
  el("scoreNow").textContent = friendMode ? friendScores[friendPlayers[friendTurn]] : score;

  const answers = el("answers");
  answers.innerHTML = "";
  q.a.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    button.textContent = answer;
    button.addEventListener("click", () => submitAnswer(index, button));
    answers.appendChild(button);
  });

  el("answerMsg").textContent = "";
  el("answerMsg").style.color = "";

  const limit = 15;
  timeLeft = limit;
  el("timer").textContent = timeLeft;
  el("progress").style.width = "100%";

  timer = setInterval(() => {
    timeLeft--;
    el("timer").textContent = timeLeft;
    el("progress").style.width = `${Math.max(0, (timeLeft / limit) * 100)}%`;
    if(timeLeft <= 0) submitAnswer(-1, null);
  }, 1000);
}

function updateHintButton(){
  const button = document.querySelector(".hint-btn");
  if(!button) return;
  button.disabled = hintCharges <= 0;
  button.textContent = hintCharges > 0 ? `🔮 تلميح (${hintCharges})` : "🔒 لا يوجد تلميح";
}

function useNextHint(){
  if(hintCharges <= 0 || answered || !round[current]) return;
  hintCharges--;
  updateHintButton();

  const q = round[current];
  const buttons = [...document.querySelectorAll(".answer-btn")];
  const wrong = buttons.map((b,i)=>({b,i})).filter(x=>x.i !== q.x && !x.b.disabled);
  wrong.forEach(({b})=>{
    b.disabled = true;
    if(!b.textContent.includes("✖")) b.textContent += "  ✖";
  });
  const msg = el("answerMsg");
  if(msg){
    const correct = String(q.a[q.x] ?? "");
    msg.textContent = `💡 التلميح: الإجابة الصحيحة هي «${correct}»`;
    msg.style.color = "#c5aaff";
  }
}

function submitAnswer(choice, button){
  if(answered) return;
  answered = true;
  clearInterval(timer);

  const q = round[current];
  const correct = choice === q.x;
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((b,i)=>{ b.disabled=true; if(i===q.x) b.classList.add("correct"); if(i===choice && !correct) b.classList.add("wrong"); });

  const msg = el("answerMsg");
  let earned = 0;
  if(correct){
    const base = 100;
    const bonus = Math.max(0,timeLeft*5);
    earned = base + bonus;
    if(friendMode){
      const player = friendPlayers[friendTurn];
      friendScores[player] += earned;
      friendCorrectCounts[player] = (friendCorrectCounts[player] || 0) + 1;
      el("scoreNow").textContent = friendScores[player];
      msg.textContent = `صحيح! +${earned} نقطة`;
    }else{
      score += earned;
      correctCount++; window.m5kRoundCorrect=(window.m5kRoundCorrect||0)+1;
      el("scoreNow").textContent = score;
      msg.textContent = `صحيح! +${earned} نقطة`;
    }
    msg.style.color="#4ade80";
  }else{
    msg.textContent = choice === -1 ? "⏰ انتهى الوقت!" : "❌ إجابة خاطئة";
    msg.style.color="#fb7185";
  }

  setTimeout(()=>{
    if(friendMode){
      friendTurn = (friendTurn + 1) % friendPlayers.length;
    }
    current++;
    renderQuestion();
  },900);
}

// دالة الإرسال للسيرفر وقاعدة البيانات المحدثة
function saveResultToBackend(modeName, finalScore, correctAnswers, totalQuestions){
  const playerName = localStorage.getItem('m5kPlayerName') || 'لاعب';
  fetch('/api/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: playerName,
      mode: modeName,
      score: finalScore,
      correctAnswers,
      totalQuestions
    })
  }).catch(()=>{});
}

function finishGame(){
  clearInterval(timer);
  if(friendMode){
    stopFriendsHeartbeat();
    leaveFriendsHeartbeat();
    const ranking = Object.entries(friendScores).sort((a,b)=>b[1]-a[1]);
    const winner = ranking[0];
    saveResultToBackend('friends', winner[1], Math.max(0, ...Object.values(friendCorrectCounts)), round.length);
    el("resultTitle").textContent = "🏆 انتهى تحدي الأصدقاء!";
    el("resultText").innerHTML = `الفائز: <b>${escapeHtml(winner[0])}</b><br>` + ranking.map((r,i)=>`${i+1}. ${escapeHtml(r[0])} — ${r[1]} نقطة`).join("<br>");
    el("resultScore").textContent = winner[1]; show("result"); return;
  }
  const name = localStorage.getItem("m5kPlayerName") || "لاعب";
  const modeName = modes[selectedMode]?.name || "اللعبة";
  const best = Number(localStorage.getItem("m5kBest") || 0); if(score > best) localStorage.setItem("m5kBest",String(score));
  const correctAnswers = Number(window.m5kRoundCorrect || 0);
  
  saveResultToBackend(selectedMode, score, correctAnswers, round.length);
  
  el("resultTitle").textContent="🏆 انتهت اللعبة!";
  el("resultText").textContent=`${name}، نتيجتك في ${modeName} هي ${score} نقطة.`;
  el("resultScore").textContent=score; show("result");
}

function playAgain(){
  if(friendMode){
    friendTurn=0; friendScores={}; friendCorrectCounts={}; friendPlayers.forEach(n=>{friendScores[n]=0;friendCorrectCounts[n]=0;}); current=0; hintCharges=1; correctCount=0; answered=false; round=shuffle(round); show("quiz"); renderQuestion();
  }else{ startGame(); }
}

function updateStats(){
  const history = JSON.parse(localStorage.getItem("m5kHistory") || "[]");
  if(el("profileGames")) el("profileGames").textContent = history.length;
  if(el("profilePoints")) el("profilePoints").textContent = history.reduce((sum, x) => sum + (Number(x.score) || 0), 0);
}

async function updateLeaders(){
  const board=document.querySelector('.leaderboard'); if(!board) return;
  try{
    const r=await fetch('/api/leaderboard');
    if(!r.ok) throw new Error();
    const data=await r.json();
    const rows=data.players||[];
    if(rows.length){ 
      board.innerHTML=rows.slice(0,10).map((r,i)=>`<div class="leader ${i===0?'first':''} ${i===1?'second':''} ${i===2?'third':''}"><b class="leader-rank">${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</b><i>${escapeHtml((r.username||'ل').charAt(0))}</i><span>${escapeHtml(r.username)}</span><strong>${Number(r.best_score)||0}</strong></div>`).join(''); 
    } else {
      board.innerHTML='<p>لا توجد نتائج عالمية بعد. العب أول جولة!</p>';
    }
  }catch(e){
    board.innerHTML='<p>تعذر جلب المتصدرين.</p>';
  }
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[ch]));
}

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("m5kPlayerName") || "";
  if(el("playerName")) el("playerName").value = saved;
  updateHintButton();
  refreshFriendsLive();
  setInterval(refreshFriendsLive, 3000);
});
