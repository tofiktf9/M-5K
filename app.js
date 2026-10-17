
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
  logotruth:{name:"🏷️ الشعار صحيح", desc:"قارن بين شعارين واكتشف الشعار المكتوب بشكل صحيح.", time:18},
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

function makeLogoTruthQuestions(){
  const brands = [
    ['Google','Gooogle','#4285f4','Google_2015_logo.svg'],['YouTube','YoutTube','#ff0000','YouTube_full-color_icon_(2017).svg'],
    ['Netflix','Netflx','#e50914','Netflix_2015_logo.svg'],['Amazon','Amazoon','#232f3e','Amazon_logo.svg'],
    ['Facebook','Facebok','#1877f2','Facebook_Logo_(2019).png'],['Instagram','Instagarm','#c13584','Instagram_logo_2022.svg'],
    ['Microsoft','Microsft','#00a4ef','Microsoft_logo_(2012).svg'],['Apple','Aplpe','#111111','Apple_logo_black.svg'],
    ['Samsung','Samsng','#1428a0','Samsung_Logo.svg'],['Adidas','Addidas','#111111','Adidas_Logo.svg'],
    ['Nike','Nkie','#111111','Nike.svg'],['Coca-Cola','Coca-Colaa','#d71920','Coca-Cola_logo.svg'],
    ['Pepsi','Pespi','#005cb4','Pepsi_logo.svg'],['McDonald’s','McDonallds','#ffc72c','McDonalds_Logo.svg'],
    ['Spotify','Spotfiy','#1db954','Spotify_logo_without_text.svg'],['PlayStation','PlayStaton','#003791','PlayStation_logo.svg'],
    ['Xbox','Xbxo','#107c10','Xbox_one_logo.svg'],['Nintendo','Nintedo','#e60012','Nintendo_Logo.svg'],
    ['Telegram','Tele gram','#229ed9','Telegram_logo.svg'],['WhatsApp','WhatsAppa','#25d366','WhatsApp.svg'],
    ['TikTok','Tik Tok','#111111','TikTok_logo.svg'],['Adobe','Adove','#ed1c24','Adobe_Corporate_logo.svg'],
    ['Intel','Intell','#0071c5','Intel_logo_(2020,_light_blue).svg'],['Dell','Dlel','#007db8','Dell_Logo.svg'],
    ['Lenovo','Lenvo','#e2231a','Lenovo_logo_2015.svg'],['Puma','Pumma','#111111','Puma_logo.svg'],
    ['Lacoste','Lacost','#004526','Lacoste_logo.svg'],['Toyota','Toyta','#eb0a1e','Toyota_EU_logo.svg'],
    ['Mercedes-Benz','Mercedez-Benz','#222222','Mercedes-Benz_Logo_2010.svg'],['BMW','BWM','#0066b3','BMW_logo_(gray).svg'],
    ['Ferrari','Ferari','#d40000','Ferrari-Logo.svg'],['LEGO','LEOG','#d01012','LEGO_logo.svg'],
    ['PayPal','PayPall','#003087','PayPal.svg'],['eBay','Ebayy','#e53238','EBay_logo.svg'],
    ['Uber','Ubeer','#111111','Uber_logo_2018.svg'],['Airbnb','Airbnd','#ff5a5f','Airbnb_Logo_Bélo.svg'],
    ['LinkedIn','LinkdIn','#0a66c2','LinkedIn_logo_initials.png'],['Zoom','Zom','#2d8cff','Zoom_Communications_Logo.svg'],
    ['Canon','Cannon','#cc0000','Canon_logo.svg'],['NVIDIA','NVIDA','#76b900','Nvidia_logo.svg'],
    ['Huawei','Huwai','#cf0a2c','Huawei_Standard_logo.svg'],['L’Oréal','Loreal','#111111','L’Oréal_logo.svg'],
    ['Dior','Diior','#111111','Christian_Dior_logo.svg'],['Porsche','Porche','#111111','Porsche_Logo.svg'],
    ['Lamborghini','Lamborgini','#d4af37','Lamborghini_Logo.svg'],['ASUS','ASUUS','#111111','ASUS_Logo.svg'],
    ['Xiaomi','Xia omi','#ff6900','Xiaomi_logo.svg'],['H&M','H&Mm','#e50010','H&M-Logo.svg'],
    ['IKEA','IEKA','#0051ba','IKEA_logo.svg'],['Prada','Pradda','#111111','Prada-Logo.svg'],
    ['KFC','KCF','#c41230','KFC_logo.svg'],['Starbucks','Starbuks','#00704a','Starbucks_Corporation_Logo_2011.svg'],
    ['Lego','Leog','#d01012','LEGO_logo.svg'],['Red Bull','RedBulll','#d71920','Red_Bull.svg'],
    ['Rolex','Rollex','#006039','Rolex_logo.svg'],['Visa','VIsa','#1a1f71','Visa_2021.svg'],
    ['Mastercard','Mastercad','#eb001b','Mastercard-logo.svg'],['Playboy','Playbooy','#111111','Playboy_logo.svg']
  ];
  const escapeText = v => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const wrongSvg = (label,color) => 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300" viewBox="0 0 800 300"><rect width="800" height="300" rx="20" fill="#fff"/><rect x="20" y="20" width="760" height="260" rx="14" fill="#fafafa" stroke="#ddd"/><text x="400" y="170" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${label.length>12?54:76}" font-weight="700" fill="${color}">${escapeText(label)}</text><text x="400" y="235" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#888">LOGO CHECK</text></svg>`);
  return brands.map((b,i)=>{
    const official='https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(b[3])+'?width=900';
    const correctFirst=i%2===0;
    return {m:'logotruth',d:i<15?'سهل':i<35?'متوسط':'صعب',q:`أي الصورتين تعرض شعار ${b[0]} الصحيح؟`,a:['الصورة الأولى','الصورة الثانية'],x:correctFirst?0:1,img1:correctFirst?official:wrongSvg(b[1],b[2]),img2:correctFirst?wrongSvg(b[1],b[2]):official};
  });
}

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

/* خمن اللاعب — 30 سؤالاً بصور حقيقية، مع قص الجزء العلوي من الوجه */
{m:"playerguess",d:"سهل",q:"من هذا اللاعب؟",a:["ليونيل ميسي","كريستيانو رونالدو","نيمار","كيليان مبابي"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Lionel_messi.jpg?width=1000",player:"ليونيل ميسي"},
{m:"playerguess",d:"سهل",q:"من هذا اللاعب؟",a:["كريستيانو رونالدو","ليونيل ميسي","كيليان مبابي","إيرلينغ هالاند"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Christiano_Ronaldo_at_world_cup_match_2026.jpg?width=1000",player:"كريستيانو رونالدو"},
{m:"playerguess",d:"سهل",q:"من هذا اللاعب؟",a:["كيليان مبابي","نيمار","ليونيل ميسي","كريم بنزيما"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Kylian_Mbappe_-_France_v_Senegal_-_16_June_2026.jpg?width=1000",player:"كيليان مبابي"},
{m:"playerguess",d:"سهل",q:"من هذا اللاعب؟",a:["إيرلينغ هالاند","هاري كين","كيليان مبابي","جود بيلينغهام"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Erling_Haaland_June_2025.jpg?width=1000",player:"إيرلينغ هالاند"},
{m:"playerguess",d:"سهل",q:"من هذا اللاعب؟",a:["نيمار","رودريغو","فينيسيوس جونيور","رافينيا"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Neymar_%2816245492137%29_%28cropped%29.jpg?width=1000",player:"نيمار"},
{m:"playerguess",d:"سهل",q:"من هذا اللاعب؟",a:["كريم بنزيما","محمد صلاح","رياض محرز","روبرت ليفاندوفسكي"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Karim_Benzema_2021.jpg?width=1000",player:"كريم بنزيما"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["روبرت ليفاندوفسكي","كريم بنزيما","هاري كين","لويس سواريز"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Robert_Lewandowski_%282011%29.jpg?width=1000",player:"روبرت ليفاندوفسكي"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["كيفن دي بروين","لوكا مودريتش","توني كروس","برونو فيرنانديز"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Kevin_de_Bruyne_2016-12-26_%28cropped%29.jpg?width=1000",player:"كيفن دي بروين"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["فينيسيوس جونيور","رودريغو","نيمار","رافينيا"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Vinicius_Junior_%282025%29.jpg?width=1000",player:"فينيسيوس جونيور"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["لامين يامال","بيدري","جافي","أنسو فاتي"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Lamine_Yamal_%282025%29.png?width=1000",player:"لامين يامال"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["جود بيلينغهام","بوكايو ساكا","فيل فودين","كول بالمر"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Jude_Bellingham_England_v_Panama_27_June_26-160_%28cropped%29.jpg?width=1000",player:"جود بيلينغهام"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["محمد صلاح","ساديو ماني","رياض محرز","سون هيونغ مين"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Mohamed_Salah_Argentina_v_Egypt_7_July_2026-163_%28cropped%29.jpg?width=1000",player:"محمد صلاح"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["لوكا مودريتش","إيفان راكيتيتش","ماتيو كوفاسيتش","توني كروس"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Luka_Modric.jpg?width=1000",player:"لوكا مودريتش"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["بيدري","جافي","لامين يامال","داني أولمو"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Pedri.jpg?width=1000",player:"بيدري"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["بوكايو ساكا","ماركوس راشفورد","جود بيلينغهام","رحيم ستيرلينغ"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Bukayo_Saka.jpg?width=1000",player:"بوكايو ساكا"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["ليونيل ميسي","أنخيل دي ماريا","لاوتارو مارتينيز","أليخاندرو غارناتشو"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Lionel_Messi.jpg?width=1000",player:"ليونيل ميسي"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["كريستيانو رونالدو","برناردو سيلفا","جواو فيليكس","رافائيل لياو"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Cristiano_Ronaldo_0889.jpg?width=1000",player:"كريستيانو رونالدو"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["كيليان مبابي","عثمان ديمبيلي","أنطوان غريزمان","أوليفييه جيرو"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Kylian_Mbappe_France_v_Morocco_9_July_2026-148.jpg?width=1000",player:"كيليان مبابي"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["إيرلينغ هالاند","ألكسندر سورلوث","مارتن أوديغارد","جوشوا كينغ"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Erling_Haaland_Morocco_v_Norway_7_June_2026-128.jpg?width=1000",player:"إيرلينغ هالاند"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["نيمار","رودريغو","فينيسيوس جونيور","رافينيا"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Neymar_-_Santos_vs_Juventude_-_04-08-2025.jpg?width=1000",player:"نيمار"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["كريم بنزيما","أوريلين تشواميني","كيليان مبابي","نجولو كانتي"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Karim_Benzema_in_2020.jpg?width=1000",player:"كريم بنزيما"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["روبرت ليفاندوفسكي","بيوتر زيلينسكي","فويتشيخ تشيزني","أركاديوش ميليك"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Robert_Lewandowski_%282024%29.jpg?width=1000",player:"روبرت ليفاندوفسكي"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["كيفن دي بروين","إيدن هازارد","يانيك كاراسكو","لياندرو تروسارد"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg?width=1000",player:"كيفن دي بروين"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["فينيسيوس جونيور","رودريغو","إندريك","رافينيا"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207.jpg?width=1000",player:"فينيسيوس جونيور"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["لامين يامال","بيدري","جافي","فيران توريس"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Lamine_Yamal_Argentina_v_Spain_19_July_2026-214_%28cropped_2%29.jpg?width=1000",player:"لامين يامال"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["جود بيلينغهام","ديكلان رايس","بوكايو ساكا","فيل فودين"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Jude_Bellingham_England_v_Ghana_23_June_2026-061.jpg?width=1000",player:"جود بيلينغهام"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["محمد صلاح","عمر مرموش","تريزيغيه","مصطفى محمد"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Mohamed_Salah_Argentina_v_Egypt_7_July_2026-161_%28cropped%29.jpg?width=1000",player:"محمد صلاح"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["لوكا مودريتش","مارسيلو بروزوفيتش","إيفان بيريشيتش","ماتيو كوفاسيتش"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Luka_Modric_Croatia_v_Portugal_2_July_2026-177.jpg?width=1000",player:"لوكا مودريتش"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["بيدري","جافي","فيرمين لوبيز","داني أولمو"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Pedri_Argentina_v_Spain_19_July_2026-191.jpg?width=1000",player:"بيدري"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["بوكايو ساكا","جود بيلينغهام","كول بالمر","فيل فودين"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Bukayo_Saka_England_v_Ghana_23_June_2026-057_%28cropped%29.jpg?width=1000",player:"بوكايو ساكا"},
/* لاعبين إضافيين */
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["رونالدينيو","كاكا","تشافي","إنييستا"],x:0,wiki:"Ronaldinho"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["كاكا","رونالدينيو","رونالدو نازاريو","أدريانو"],x:0,wiki:"Kaká"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["تشافي","إنييستا","بوسكيتس","فابريغاس"],x:0,wiki:"Xavi"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["أندريس إنييستا","تشافي","دافيد سيلفا","بيدري"],x:0,wiki:"Andrés Iniesta"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["سيرجيو راموس","بيكيه","كارليس بويول","مارسيلو"],x:0,wiki:"Sergio Ramos"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["مارسيلو","داني ألفيس","سيرجيو راموس","كافو"],x:0,wiki:"Marcelo"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["هاري كين","سون هيونغ مين","جيمي فاردي","واين روني"],x:0,wiki:"Harry Kane"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["سون هيونغ مين","هاري كين","كاورو ميتوما","تاكيفوسا كوبو"],x:0,wiki:"Son Heung-min"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["روبرت ليفاندوفسكي","إيرلينغ هالاند","هاري كين","أولي واتكينز"],x:0,wiki:"Robert Lewandowski"},
{m:"playerguess",d:"متوسط",q:"من هذا اللاعب؟",a:["أنطوان غريزمان","كيليان مبابي","أوليفييه جيرو","عثمان ديمبيلي"],x:0,wiki:"Antoine Griezmann"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["رونالدو نازاريو","رونالدينيو","كاكا","ريفالدو"],x:0,wiki:"Ronaldo (Brazilian footballer)"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["زيدان","تييري هنري","باتريك فييرا","إيريك كانتونا"],x:0,wiki:"Zinedine Zidane"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["تييري هنري","ديدييه دروغبا","صامويل إيتو","دافيد تريزيغيه"],x:0,wiki:"Thierry Henry"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["لويس سواريز","إدينسون كافاني","دييغو فورلان","داروين نونيز"],x:0,wiki:"Luis Suárez"},
{m:"playerguess",d:"صعب",q:"من هذا اللاعب؟",a:["رياض محرز","إسماعيل بن ناصر","يوسف بلايلي","سعيد بن رحمة"],x:0,wiki:"Riyad Mahrez"},

/* خمن المشهور — مشاهير ويوتيوبرز عرب وأجانب */
{m:"celebrityguess",d:"سهل",q:"من هذا المشهور؟",a:["MrBeast","PewDiePie","Markiplier","Logan Paul"],x:0,wiki:"MrBeast"},
{m:"celebrityguess",d:"سهل",q:"من هذا المشهور؟",a:["PewDiePie","MrBeast","KSI","Markiplier"],x:0,wiki:"PewDiePie"},
{m:"celebrityguess",d:"سهل",q:"من هذا المشهور؟",a:["Markiplier","Jacksepticeye","MrBeast","PewDiePie"],x:0,wiki:"Markiplier"},
{m:"celebrityguess",d:"سهل",q:"من هذا المشهور؟",a:["KSI","Logan Paul","Jake Paul","MrBeast"],x:0,wiki:"KSI"},
{m:"celebrityguess",d:"سهل",q:"من هذا المشهور؟",a:["Marques Brownlee","MrBeast","Linus Sebastian","Casey Neistat"],x:0,wiki:"Marques Brownlee"},
{m:"celebrityguess",d:"سهل",q:"من هذا المشهور؟",a:["Emma Chamberlain","Addison Rae","Charli D'Amelio","Liza Koshy"],x:0,wiki:"Emma Chamberlain"},
{m:"celebrityguess",d:"سهل",q:"من هذا المشهور؟",a:["Dwayne Johnson","Will Smith","Tom Cruise","Chris Hemsworth"],x:0,wiki:"Dwayne Johnson"},
{m:"celebrityguess",d:"سهل",q:"من هذا المشهور؟",a:["Taylor Swift","Ariana Grande","Selena Gomez","Dua Lipa"],x:0,wiki:"Taylor Swift"},
{m:"celebrityguess",d:"سهل",q:"من هذا المشهور؟",a:["Cristiano Ronaldo","Lionel Messi","Neymar","Kylian Mbappé"],x:0,wiki:"Cristiano Ronaldo"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Noor Stars","Anas Bukhash","Bessan Ismail","Narins Beauty"],x:0,wiki:"Noor Stars"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Anas Bukhash","Omar Farooq","Ahmed Aburob","Mo Vlogs"],x:0,wiki:"Anas Bukhash"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Bessan Ismail","Noor Stars","Narins Beauty","Shereen Abdel Wahab"],x:0,wiki:"Bessan Ismail"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Narins Beauty","Noor Stars","Bessan Ismail","Anas Bukhash"],x:0,wiki:"Narins Beauty"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Mo Vlogs","Anas Bukhash","Omar Farooq","Ahmed Aburob"],x:0,wiki:"Mo Vlogs"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Ahmed Aburob","Mo Vlogs","Omar Farooq","Anas Bukhash"],x:0,wiki:"Ahmad Aburob"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Omar Farooq","Anas Bukhash","Mo Vlogs","Ahmed Aburob"],x:0,wiki:"Omar Farooq"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Huda Kattan","Noor Stars","Haifa Beseisso","Aseel Omran"],x:0,wiki:"Huda Kattan"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Haifa Beseisso","Huda Kattan","Noor Stars","Bessan Ismail"],x:0,wiki:"Haifa Beseisso"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Mohamed Ramadan","Amr Diab","Tamer Hosny","Ahmed Saad"],x:0,wiki:"Mohamed Ramadan"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Amr Diab","Mohamed Ramadan","Tamer Hosny","Hany Shaker"],x:0,wiki:"Amr Diab"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Nancy Ajram","Elissa","Haifa Wehbe","Sherine"],x:0,wiki:"Nancy Ajram"},
{m:"celebrityguess",d:"متوسط",q:"من هذا المشهور؟",a:["Elissa","Nancy Ajram","Haifa Wehbe","Nawal Al Zoghbi"],x:0,wiki:"Elissa"},
{m:"celebrityguess",d:"صعب",q:"من هذا المشهور؟",a:["Adel Imam","Mohamed Henedi","Ahmed Mekky","Ahmed Helmy"],x:0,wiki:"Adel Imam"},
{m:"celebrityguess",d:"صعب",q:"من هذا المشهور؟",a:["Will Smith","Denzel Washington","Eddie Murphy","Jamie Foxx"],x:0,wiki:"Will Smith"},
{m:"celebrityguess",d:"صعب",q:"من هذا المشهور؟",a:["Tom Holland","Tom Hiddleston","Chris Evans","Andrew Garfield"],x:0,wiki:"Tom Holland"},
{m:"celebrityguess",d:"صعب",q:"من هذا المشهور؟",a:["Zendaya","Emma Stone","Margot Robbie","Anya Taylor-Joy"],x:0,wiki:"Zendaya"},
{m:"celebrityguess",d:"صعب",q:"من هذا المشهور؟",a:["Jackie Chan","Jet Li","Donnie Yen","Bruce Lee"],x:0,wiki:"Jackie Chan"},
{m:"celebrityguess",d:"صعب",q:"من هذا المشهور؟",a:["The Weeknd","Drake","Bruno Mars","Post Malone"],x:0,wiki:"The Weeknd"},
{m:"celebrityguess",d:"صعب",q:"من هذا المشهور؟",a:["Ariana Grande","Selena Gomez","Miley Cyrus","Dua Lipa"],x:0,wiki:"Ariana Grande"},
{m:"celebrityguess",d:"صعب",q:"من هذا المشهور؟",a:["Kim Kardashian","Kylie Jenner","Kendall Jenner","Paris Hilton"],x:0,wiki:"Kim Kardashian"},
{m:"celebrityguess",d:"صعب",q:"من هذا المشهور؟",a:["Ryan Reynolds","Ryan Gosling","Chris Pratt","Chris Pine"],x:0,wiki:"Ryan Reynolds"},
{m:"celebrityguess",d:"صعب",q:"من هذا المشهور؟",a:["Lionel Messi","Cristiano Ronaldo","Neymar","Luis Suárez"],x:0,wiki:"Lionel Messi"},


/* خمن اليوتيوبر — عرب وأجانب */
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["أبو فلة","مستر بيست","IShowSpeed","KSI"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/%D8%A3%D8%A8%D9%88_%D9%81%D9%84%D8%A9.jpg?width=1000",creator:"أبو فلة"},
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["بلال فاضلي","أبو فلة","نور ستارز","أنس بوخش"],x:0,img:"https://images.socialblade.com/256x%2Cq75/https%3A//yt3.ggpht.com/LjaJW5MsERZ45ItgwrLyBBGGV4jrBv5kgVyUvISSdXcn5ws81Bkpe-4QKMHmAeM-6ijk_utPulE%3Ds192-c-k-c0x00ffffff-no-rj",creator:"بلال فاضلي"},
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["نور ستارز","نارين بيوتي","بيسان إسماعيل","هبة نور"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Noor_Naem.jpg?width=1000",creator:"نور ستارز"},
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["MrBeast","PewDiePie","Markiplier","KSI"],x:0,wiki:"MrBeast",creator:"MrBeast"},
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["PewDiePie","MrBeast","Jacksepticeye","Markiplier"],x:0,wiki:"PewDiePie",creator:"PewDiePie"},
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["KSI","Logan Paul","Jake Paul","MrBeast"],x:0,wiki:"KSI",creator:"KSI"},
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["Markiplier","Jacksepticeye","PewDiePie","MrBeast"],x:0,wiki:"Markiplier",creator:"Markiplier"},
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["Jacksepticeye","KSI","Markiplier","PewDiePie"],x:0,wiki:"Jacksepticeye",creator:"Jacksepticeye"},
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["Logan Paul","Jake Paul","KSI","MrBeast"],x:0,wiki:"Logan Paul",creator:"Logan Paul"},
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["Jake Paul","Logan Paul","KSI","MrBeast"],x:0,wiki:"Jake Paul",creator:"Jake Paul"},
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["Marques Brownlee","Linus Sebastian","MrBeast","Casey Neistat"],x:0,wiki:"Marques Brownlee",creator:"Marques Brownlee"},
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["IShowSpeed","Kai Cenat","MrBeast","KSI"],x:0,wiki:"IShowSpeed",creator:"IShowSpeed"},
{m:"youtuberguess",d:"سهل",q:"من هذا اليوتيوبر؟",a:["Kai Cenat","IShowSpeed","MrBeast","KSI"],x:0,wiki:"Kai Cenat",creator:"Kai Cenat"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Dude Perfect","MrBeast","Ryan Trahan","Mark Rober"],x:0,wiki:"Dude Perfect",creator:"Dude Perfect"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Mark Rober","Dude Perfect","MrBeast","Marques Brownlee"],x:0,wiki:"Mark Rober",creator:"Mark Rober"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Ryan Trahan","MrBeast","Casey Neistat","Mark Rober"],x:0,wiki:"Ryan Trahan",creator:"Ryan Trahan"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Casey Neistat","Marques Brownlee","MrBeast","Ryan Trahan"],x:0,wiki:"Casey Neistat",creator:"Casey Neistat"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Philip DeFranco","MrBeast","PewDiePie","KSI"],x:0,wiki:"Philip DeFranco",creator:"Philip DeFranco"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Roman Atwood","MrBeast","Logan Paul","Jake Paul"],x:0,wiki:"Roman Atwood",creator:"Roman Atwood"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Lilly Singh","Emma Chamberlain","Liza Koshy","Marques Brownlee"],x:0,wiki:"Lilly Singh",creator:"Lilly Singh"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Emma Chamberlain","Liza Koshy","Lilly Singh","Charli D'Amelio"],x:0,wiki:"Emma Chamberlain",creator:"Emma Chamberlain"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Liza Koshy","Emma Chamberlain","Lilly Singh","MrBeast"],x:0,wiki:"Liza Koshy",creator:"Liza Koshy"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Charli D'Amelio","Addison Rae","Emma Chamberlain","Liza Koshy"],x:0,wiki:"Charli D'Amelio",creator:"Charli D'Amelio"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Addison Rae","Charli D'Amelio","Emma Chamberlain","Liza Koshy"],x:0,wiki:"Addison Rae",creator:"Addison Rae"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Mo Vlogs","Anas Bukhash","Omar Farooq","Ahmed Aburob"],x:0,wiki:"Mo Vlogs",creator:"Mo Vlogs"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Narins Beauty","Noor Stars","Bessan Ismail","AboFlah"],x:0,wiki:"Narins Beauty",creator:"Narins Beauty"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Bessan Ismail","Noor Stars","Narins Beauty","AboFlah"],x:0,wiki:"Bessan Ismail",creator:"بيسان إسماعيل"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Haifa Beseisso","Noor Stars","Narins Beauty","Bessan Ismail"],x:0,wiki:"Haifa Beseisso",creator:"هيفاء بسيسو"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Anas Bukhash","Mo Vlogs","Omar Farooq","Ahmed Aburob"],x:0,wiki:"Anas Bukhash",creator:"أنس بخاش"},
{m:"youtuberguess",d:"متوسط",q:"من هذا اليوتيوبر؟",a:["Omar Farooq","Mo Vlogs","Anas Bukhash","Ahmed Aburob"],x:0,wiki:"Omar Farooq",creator:"عمر فاروق"},
{m:"youtuberguess",d:"صعب",q:"من هذا اليوتيوبر؟",a:["Ahmed Aburob","Mo Vlogs","Omar Farooq","Anas Bukhash"],x:0,wiki:"Ahmad Aburob",creator:"أحمد أبو الرب"},
{m:"youtuberguess",d:"صعب",q:"من هذا اليوتيوبر؟",a:["Ghaith Marwan","Mo Vlogs","AboFlah","Omar Farooq"],x:0,wiki:"Ghaith Marwan",creator:"غيث مروان"},
{m:"youtuberguess",d:"صعب",q:"من هذا اليوتيوبر؟",a:["Anasala Family","Noor Stars","AboFlah","Narins Beauty"],x:0,wiki:"Anasala Family",creator:"أنس وأصالة"},
{m:"youtuberguess",d:"صعب",q:"من هذا اليوتيوبر؟",a:["BanderitaX","AboFlah","Mo Vlogs","Ghaith Marwan"],x:0,wiki:"BanderitaX",creator:"بندريتا"},
{m:"youtuberguess",d:"صعب",q:"من هذا اليوتيوبر؟",a:["FouseyTube","KSI","Logan Paul","MrBeast"],x:0,wiki:"FouseyTube",creator:"FouseyTube"},
{m:"youtuberguess",d:"صعب",q:"من هذا اليوتيوبر؟",a:["SSSniperWolf","Pokimane","Valkyrae","Lilly Singh"],x:0,wiki:"SSSniperWolf",creator:"SSSniperWolf"},
{m:"youtuberguess",d:"صعب",q:"من هذا اليوتيوبر؟",a:["Pokimane","Valkyrae","SSSniperWolf","Lilly Singh"],x:0,wiki:"Pokimane",creator:"Pokimane"},
{m:"youtuberguess",d:"صعب",q:"من هذا اليوتيوبر؟",a:["Valkyrae","Pokimane","SSSniperWolf","Emma Chamberlain"],x:0,wiki:"Valkyrae",creator:"Valkyrae"},
{m:"youtuberguess",d:"صعب",q:"من هذا اليوتيوبر؟",a:["TommyInnit","Dream","GeorgeNotFound","Sapnap"],x:0,wiki:"TommyInnit",creator:"TommyInnit"},
{m:"youtuberguess",d:"صعب",q:"من هذا اليوتيوبر؟",a:["Dream","TommyInnit","GeorgeNotFound","Sapnap"],x:0,wiki:"Dream (YouTuber)",creator:"Dream"},
{m:"youtuberguess",d:"صعب",q:"من هذا اليوتيوبر؟",a:["GeorgeNotFound","Dream","TommyInnit","Sapnap"],x:0,wiki:"GeorgeNotFound",creator:"GeorgeNotFound"},
{m:"youtuberguess",d:"صعب",q:"من هذا اليوتيوبر؟",a:["Sapnap","Dream","GeorgeNotFound","TommyInnit"],x:0,wiki:"Sapnap",creator:"Sapnap"},

/* خمن بالإيموجي — لعبة جديدة */
{m:"emoji",d:"سهل",q:"🎭 خمن الفيلم: 🧊🚢💔",a:["Titanic","Frozen","Avatar","Joker"],x:0},
{m:"emoji",d:"سهل",q:"🎭 خمن الفيلم: 🦁👑🌅",a:["The Lion King","Madagascar","Aladdin","Tarzan"],x:0},
{m:"emoji",d:"سهل",q:"🎭 خمن الفيلم: 🧙‍♂️⚡🏰",a:["Harry Potter","The Hobbit","Narnia","Percy Jackson"],x:0},
{m:"emoji",d:"سهل",q:"🎭 خمن الفيلم: 🦖🏝️🚙",a:["Jurassic Park","Jumanji","King Kong","Godzilla"],x:0},
{m:"emoji",d:"سهل",q:"🎭 خمن الشخصية: 🦇🌃🖤",a:["Batman","Spider-Man","Superman","Iron Man"],x:0},
{m:"emoji",d:"سهل",q:"🎭 خمن الشخصية: 🕷️🕸️🏙️",a:["Spider-Man","Batman","Flash","Hulk"],x:0},
{m:"emoji",d:"سهل",q:"🎭 خمن الشخصية: 🦾🤖❤️",a:["Iron Man","Optimus Prime","Hulk","Thor"],x:0},
{m:"emoji",d:"سهل",q:"🎭 خمن اللعبة: ⛏️🟩🧱",a:["Minecraft","Fortnite","Roblox","Terraria"],x:0},
{m:"emoji",d:"سهل",q:"🎭 خمن اللعبة: 🚌🔫🏝️",a:["Fortnite","PUBG","Free Fire","Apex Legends"],x:0},
{m:"emoji",d:"سهل",q:"🎭 خمن اللعبة: 🧱👤🎮",a:["Roblox","Minecraft","Among Us","Fall Guys"],x:0},
{m:"emoji",d:"متوسط",q:"🎭 خمن الفيلم: 🦸‍♂️🛡️🇺🇸",a:["Captain America","Superman","Thor","Black Panther"],x:0},
{m:"emoji",d:"متوسط",q:"🎭 خمن الفيلم: 🦸‍♂️⚡🔨",a:["Thor","Shazam","Hulk","Aquaman"],x:0},
{m:"emoji",d:"متوسط",q:"🎭 خمن الفيلم: 💍🧙‍♂️🌋",a:["The Lord of the Rings","Harry Potter","The Hobbit","Game of Thrones"],x:0},
{m:"emoji",d:"متوسط",q:"🎭 خمن الفيلم: 🏠🎈👴",a:["Up","Home Alone","Toy Story","Coco"],x:0},
{m:"emoji",d:"متوسط",q:"🎭 خمن الفيلم: 🎸💀🌼",a:["Coco","Soul","Encanto","Moana"],x:0},
{m:"emoji",d:"متوسط",q:"🎭 خمن الفيلم: 🐠🔎🌊",a:["Finding Nemo","The Little Mermaid","Moana","Shark Tale"],x:0},
{m:"emoji",d:"متوسط",q:"🎭 خمن اللعبة: 👻🔦🏚️",a:["Phasmophobia","Resident Evil","Outlast","Amnesia"],x:0},
{m:"emoji",d:"متوسط",q:"🎭 خمن اللعبة: 🧑‍🚀🔴🔪",a:["Among Us","Dead by Daylight","The Forest","Rust"],x:0},
{m:"emoji",d:"متوسط",q:"🎭 خمن اللعبة: 🏎️💨🏁",a:["Need for Speed","Rocket League","Forza Horizon","Mario Kart"],x:0},
{m:"emoji",d:"متوسط",q:"🎭 خمن اللعبة: 🏰⚔️🐉",a:["Dark Souls","Skyrim","Elden Ring","The Witcher"],x:0},
{m:"emoji",d:"صعب",q:"🎭 خمن المسلسل: 🐉👑⚔️",a:["Game of Thrones","Vikings","The Witcher","The Last Kingdom"],x:0},
{m:"emoji",d:"صعب",q:"🎭 خمن المسلسل: 🧪💰🎩",a:["Breaking Bad","Narcos","Ozark","Peaky Blinders"],x:0},
{m:"emoji",d:"صعب",q:"🎭 خمن المسلسل: 🦑🎮🔺",a:["Squid Game","Alice in Borderland","Money Heist","Dark"],x:0},
{m:"emoji",d:"صعب",q:"🎭 خمن المسلسل: 💰🎭🇪🇸",a:["La Casa de Papel","Elite","Dark","Vis a Vis"],x:0},
{m:"emoji",d:"صعب",q:"🎭 خمن اللعبة: 🧟‍♂️🔫🏚️",a:["Resident Evil","Left 4 Dead","Dying Light","The Last of Us"],x:0},
{m:"emoji",d:"صعب",q:"🎭 خمن اللعبة: 🧟‍♂️🏙️🌙",a:["Dying Light","Days Gone","Resident Evil","Dead Island"],x:0},
{m:"emoji",d:"صعب",q:"🎭 خمن اللعبة: 🧙‍♂️🐺⚔️",a:["The Witcher 3","Skyrim","Elden Ring","Dark Souls"],x:0},
{m:"emoji",d:"صعب",q:"🎭 خمن اللعبة: 🚀🌌👽",a:["Mass Effect","Starfield","Halo","No Man's Sky"],x:0},
{m:"emoji",d:"صعب",q:"🎭 خمن الشخصية: 🟡👻🍒",a:["Pac-Man","Sonic","Pikachu","Kirby"],x:0},
{m:"emoji",d:"صعب",q:"🎭 خمن الشخصية: 🔵💨🦔",a:["Sonic","Mega Man","Mario","Crash Bandicoot"],x:0},


/* خمن الصورة — 35 سؤالاً بصور حقيقية من Wikimedia Commons */
{m:"logotruth",d:"سهل",q:"أي الصورتين تعرض كتابة شعار Google الصحيحة؟",a:["الصورة الأولى","الصورة الثانية"],x:0,img1:"https://commons.wikimedia.org/wiki/Special:FilePath/Google_2015_logo.svg?width=1000",img2:"data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="260"><rect width="100%" height="100%" fill="white"/><text x="50%" y="58%" text-anchor="middle" font-family="Arial,sans-serif" font-size="125" font-weight="500" fill="#4285F4">Gooogle</text></svg>')},
{m:"logotruth",d:"سهل",q:"أي شعار Google مكتوب بطريقة صحيحة؟",a:["الصورة الأولى","الصورة الثانية"],x:1,img1:"data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="260"><rect width="100%" height="100%" fill="white"/><text x="50%" y="58%" text-anchor="middle" font-family="Arial,sans-serif" font-size="125" font-weight="500" fill="#4285F4">Gogle</text></svg>'),img2:"https://commons.wikimedia.org/wiki/Special:FilePath/Google_2015_logo.svg?width=1000"},
{m:"logotruth",d:"متوسط",q:"اختر الشعار الصحيح من بين الصورتين.",a:["الصورة الأولى","الصورة الثانية"],x:0,img1:"https://commons.wikimedia.org/wiki/Special:FilePath/Google_2015_logo.svg?width=1000",img2:"data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="260"><rect width="100%" height="100%" fill="white"/><text x="50%" y="58%" text-anchor="middle" font-family="Arial,sans-serif" font-size="125" fill="#4285F4">Googel</text></svg>')},
/* عشرات تحديات الشعارات من شركات متنوعة؛ لكل سؤال صورتان مولدتان للشعار الصحيح والخاطئ */
...makeLogoTruthQuestions(),
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Apple","Samsung","Sony","Huawei"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Apple_iPhone.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Coca-Cola","Pepsi","Fanta","Sprite"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Coca-cola_bottle.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Nike","Adidas","Puma","Reebok"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Nike_Shoe.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Nintendo","Sony","Microsoft","Sega"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Nintendo_switch.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Samsung","Apple","LG","Huawei"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Samsung_galaxy.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["BMW","Mercedes","Audi","Toyota"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/BMW_car.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Ferrari","Porsche","Lamborghini","BMW"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Ferrari.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Nikon","Canon","Sony","Fujifilm"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Nikon_Camera.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Dell","HP","Lenovo","ASUS"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Dell_Laptop.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Lenovo","Dell","HP","Acer"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Lenovo_laptop_2025.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["HP","Dell","Lenovo","ASUS"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/HP_Laptop_Notebook.png?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Rolex","Casio","Seiko","Omega"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Rare_Rolex_Watch.png?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Microsoft","Sony","Nintendo","Sega"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Microsoft-Xbox-One-X-Console.png?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Pepsi","Coca-Cola","Fanta","Sprite"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Pepsi_Can.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Sony","Canon","Nikon","JBL"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Sony_camera.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Sony","Canon","Nikon","JBL"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Sony_Headphones_(7309383730).jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Adidas","Nike","Puma","Reebok"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Adidas_shoe.JPG?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Puma","Nike","Adidas","Reebok"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Puma_schuhe.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Reebok","Nike","Adidas","Puma"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Reebok_Indoor_Sports_Shoes.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Apple","Samsung","Sony","Huawei"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Apple_watch.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Nike","Adidas","Puma","Reebok"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Nike_shoes.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Adidas","Nike","Puma","Reebok"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/An_Adidas_shoe.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Puma","Nike","Adidas","Reebok"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Puma_shoes.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Puma","Nike","Adidas","Reebok"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Puma_Shoes.jpeg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Coca-Cola","Pepsi","Fanta","Sprite"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Coca-Cola_Bottle.jpeg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Coca-Cola","Pepsi","Fanta","Sprite"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/CocaColaBottle.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Pepsi","Coca-Cola","Fanta","Sprite"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Pepsi.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Pepsi","Coca-Cola","Fanta","Sprite"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Pepsi_bottles.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Sony","Canon","Nikon","JBL"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Sony_Headphones_(40476165073).jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["HP","Dell","Lenovo","ASUS"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/HP_Laptop_15-da1xxx_(1).jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Lenovo","Dell","HP","Acer"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Lenovo_laptop_2019.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["BMW","Mercedes","Audi","Toyota"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/BMW_car_20250519B.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["BMW","Mercedes","Audi","Toyota"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/BMW_car_20250515A.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Sony","Canon","Nikon","JBL"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/PlayStation_5.jpg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Sony","Canon","Nikon","JBL"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Black_and_white_Playstation_5_base_edition_with_controller.png?width=1000",product:"منتج حقيقي"},

/* خمن الصورة — دفعة إضافية: 30 سؤالًا */
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["McDonald's","Burger King","KFC","Subway"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/McDonalds_Golden_Arches.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["KFC","McDonald's","Subway","Burger King"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/KFC_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Starbucks","Costa Coffee","Dunkin'","Tim Hortons"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Starbucks_Corporation_Logo_2011.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Lego","Mattel","Hasbro","Playmobil"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/LEGO_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Ferrero","Nestlé","Mars","Mondelez"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Ferrero_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["KitKat","Oreo","Twix","Snickers"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Kit-Kat_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Oreo","KitKat","Milka","Toblerone"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Oreo_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Lays","Doritos","Pringles","Cheetos"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Lay%27s_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Pringles","Lays","Doritos","Cheetos"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Pringles_2021.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Cheetos","Lays","Doritos","Pringles"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Cheetos_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Mercedes-Benz","BMW","Audi","Lexus"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_Logo_2010.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Audi","BMW","Mercedes-Benz","Volkswagen"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Audi_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Toyota","Honda","Nissan","Mazda"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_EU_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Honda","Toyota","Nissan","Ford"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Honda_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Ford","Chevrolet","Toyota","Honda"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Ford_logo_flat.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Lamborghini","Ferrari","Porsche","Maserati"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Lamborghini_Logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Porsche","Ferrari","Lamborghini","Bentley"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Porsche_Logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["ASUS","Acer","MSI","Lenovo"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/ASUS_Logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Acer","ASUS","Dell","HP"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Acer_Logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["MSI","ASUS","Acer","Gigabyte"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/MSI_Logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Canon","Nikon","Sony","Fujifilm"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Canon_wordmark.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Fujifilm","Canon","Nikon","Sony"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Fujifilm_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["JBL","Sony","Bose","Marshall"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/JBL_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Bose","JBL","Sony","Beats"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Bose_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Beats","Sony","JBL","Bose"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Beats_Electronics_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Huawei","Samsung","Apple","Xiaomi"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Huawei_Standard_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Xiaomi","Huawei","Samsung","Oppo"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Xiaomi_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Nokia","Samsung","Huawei","Motorola"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Nokia_wordmark.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["PlayStation","Xbox","Nintendo","Sega"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/PlayStation_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Xbox","PlayStation","Nintendo","Sega"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Xbox_one_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Nintendo","Sega","Sony","Microsoft"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Nintendo_Logo.svg?width=1000",product:"منتج حقيقي"},

{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["IKEA","H&M","Zara","Nike"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/IKEA_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"سهل",q:"ما العلامة التجارية لهذا المنتج؟",a:["Netflix","Disney","Spotify","YouTube"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Netflix_2015_logo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Airbnb","Uber","Amazon","eBay"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Airbnb_Logo_Bélo.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"متوسط",q:"ما العلامة التجارية لهذا المنتج؟",a:["Spotify","Apple Music","YouTube Music","Deezer"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Spotify_logo_without_text.svg?width=1000",product:"منتج حقيقي"},
{m:"imageguess",d:"صعب",q:"ما العلامة التجارية لهذا المنتج؟",a:["Amazon","eBay","Walmart","Alibaba"],x:0,img:"https://commons.wikimedia.org/wiki/Special:FilePath/Amazon_logo.svg?width=1000",product:"منتج حقيقي"},

/* خمن العلم */
{m:"flagguess",d:"سهل",q:"🇩🇿 ما اسم هذه الدولة؟",a:["الجزائر","تونس","المغرب","ليبيا"],x:0},
{m:"flagguess",d:"سهل",q:"🇹🇳 ما اسم هذه الدولة؟",a:["مصر","تونس","الأردن","تركيا"],x:1},
{m:"flagguess",d:"سهل",q:"🇲🇦 ما اسم هذه الدولة؟",a:["المغرب","الجزائر","إسبانيا","مصر"],x:0},
{m:"flagguess",d:"سهل",q:"🇪🇬 ما اسم هذه الدولة؟",a:["العراق","مصر","سوريا","السودان"],x:1},
{m:"flagguess",d:"سهل",q:"🇸🇦 ما اسم هذه الدولة؟",a:["السعودية","الأردن","الإمارات","الكويت"],x:0},
{m:"flagguess",d:"سهل",q:"🇦🇪 ما اسم هذه الدولة؟",a:["قطر","البحرين","الإمارات","عُمان"],x:2},
{m:"flagguess",d:"سهل",q:"🇶🇦 ما اسم هذه الدولة؟",a:["قطر","البحرين","الكويت","الإمارات"],x:0},
{m:"flagguess",d:"سهل",q:"🇰🇼 ما اسم هذه الدولة؟",a:["العراق","الكويت","الأردن","فلسطين"],x:1},
{m:"flagguess",d:"سهل",q:"🇯🇴 ما اسم هذه الدولة؟",a:["الأردن","فلسطين","سوريا","لبنان"],x:0},
{m:"flagguess",d:"سهل",q:"🇴🇲 ما اسم هذه الدولة؟",a:["اليمن","عُمان","الإمارات","البحرين"],x:1},
{m:"flagguess",d:"سهل",q:"🇧🇭 ما اسم هذه الدولة؟",a:["قطر","البحرين","الكويت","عُمان"],x:1},
{m:"flagguess",d:"سهل",q:"🇱🇧 ما اسم هذه الدولة؟",a:["لبنان","سوريا","الأردن","فلسطين"],x:0},
{m:"flagguess",d:"متوسط",q:"🇹🇷 ما اسم هذه الدولة؟",a:["تركيا","تونس","أذربيجان","ألبانيا"],x:0},
{m:"flagguess",d:"متوسط",q:"🇫🇷 ما اسم هذه الدولة؟",a:["فرنسا","هولندا","إيطاليا","بلجيكا"],x:0},
{m:"flagguess",d:"متوسط",q:"🇮🇹 ما اسم هذه الدولة؟",a:["إسبانيا","إيطاليا","المكسيك","المجر"],x:1},
{m:"flagguess",d:"متوسط",q:"🇩🇪 ما اسم هذه الدولة؟",a:["ألمانيا","بلجيكا","النمسا","رومانيا"],x:0},
{m:"flagguess",d:"متوسط",q:"🇪🇸 ما اسم هذه الدولة؟",a:["البرتغال","إسبانيا","رومانيا","كولومبيا"],x:1},
{m:"flagguess",d:"متوسط",q:"🇬🇧 ما اسم هذه الدولة؟",a:["المملكة المتحدة","الولايات المتحدة","أستراليا","كندا"],x:0},
{m:"flagguess",d:"متوسط",q:"🇺🇸 ما اسم هذه الدولة؟",a:["كندا","الولايات المتحدة","ليبيريا","أستراليا"],x:1},
{m:"flagguess",d:"متوسط",q:"🇨🇦 ما اسم هذه الدولة؟",a:["كندا","الولايات المتحدة","سويسرا","النمسا"],x:0},
{m:"flagguess",d:"متوسط",q:"🇧🇷 ما اسم هذه الدولة؟",a:["البرازيل","الأرجنتين","كولومبيا","المكسيك"],x:0},
{m:"flagguess",d:"متوسط",q:"🇦🇷 ما اسم هذه الدولة؟",a:["الأوروغواي","الأرجنتين","تشيلي","باراغواي"],x:1},
{m:"flagguess",d:"متوسط",q:"🇯🇵 ما اسم هذه الدولة؟",a:["اليابان","الصين","كوريا الجنوبية","بنغلاديش"],x:0},
{m:"flagguess",d:"متوسط",q:"🇨🇳 ما اسم هذه الدولة؟",a:["الصين","فيتنام","اليابان","سنغافورة"],x:0},
{m:"flagguess",d:"متوسط",q:"🇰🇷 ما اسم هذه الدولة؟",a:["كوريا الجنوبية","كوريا الشمالية","اليابان","تايوان"],x:0},
{m:"flagguess",d:"صعب",q:"🇦🇺 ما اسم هذه الدولة؟",a:["نيوزيلندا","أستراليا","فيجي","كندا"],x:1},
{m:"flagguess",d:"صعب",q:"🇳🇿 ما اسم هذه الدولة؟",a:["أستراليا","نيوزيلندا","آيسلندا","المملكة المتحدة"],x:1},
{m:"flagguess",d:"صعب",q:"🇳🇴 ما اسم هذه الدولة؟",a:["النرويج","الدنمارك","آيسلندا","فنلندا"],x:0},
{m:"flagguess",d:"صعب",q:"🇸🇪 ما اسم هذه الدولة؟",a:["السويد","فنلندا","النرويج","آيسلندا"],x:0},
{m:"flagguess",d:"صعب",q:"🇨🇭 ما اسم هذه الدولة؟",a:["سويسرا","الدنمارك","النمسا","جورجيا"],x:0},
{m:"flagguess",d:"صعب",q:"🇿🇦 ما اسم هذه الدولة؟",a:["نيجيريا","جنوب أفريقيا","كينيا","غانا"],x:1},
{m:"flagguess",d:"صعب",q:"🇲🇽 ما اسم هذه الدولة؟",a:["المكسيك","إسبانيا","إيطاليا","تشيلي"],x:0},

/* ألعاب جديدة ممتعة */
{m:"oddone",d:"سهل",q:"أي كلمة مختلفة؟",a:['تفاح', 'موز', 'برتقال', 'سيارة'],x:3},
{m:"oddone",d:"سهل",q:"أي حيوان مختلف؟",a:['أسد', 'نمر', 'ذئب', 'صقر'],x:3},
{m:"oddone",d:"سهل",q:"أي لون مختلف؟",a:['أحمر', 'أزرق', 'أخضر', 'دائرة'],x:3},
{m:"oddone",d:"سهل",q:"أي دولة مختلفة؟",a:['الجزائر', 'المغرب', 'تونس', 'مدريد'],x:3},
{m:"oddone",d:"سهل",q:"أي رقم مختلف؟",a:['2', '4', '6', '9'],x:3},
{m:"oddone",d:"سهل",q:"أي شيء مختلف؟",a:['قلم', 'كتاب', 'دفتر', 'تفاحة'],x:3},
{m:"oddone",d:"سهل",q:"أي وسيلة نقل مختلفة؟",a:['سيارة', 'حافلة', 'قطار', 'كرسي'],x:3},
{m:"oddone",d:"سهل",q:"أي فاكهة مختلفة؟",a:['تفاح', 'موز', 'عنب', 'جزر'],x:3},
{m:"oddone",d:"سهل",q:"أي جهاز مختلف؟",a:['هاتف', 'حاسوب', 'جهاز لوحي', 'ملعقة'],x:3},
{m:"oddone",d:"سهل",q:"أي رياضة مختلفة؟",a:['كرة القدم', 'التنس', 'السباحة', 'الطهي'],x:3},
{m:"oddone",d:"سهل",q:"أي كوكب مختلف؟",a:['الأرض', 'المريخ', 'الزهرة', 'القمر'],x:3},
{m:"oddone",d:"سهل",q:"أي شكل مختلف؟",a:['مربع', 'مثلث', 'دائرة', 'أحمر'],x:3},
{m:"oddone",d:"سهل",q:"أي حيوان يعيش في الماء؟",a:['سمكة', 'حصان', 'قطة', 'جمل'],x:0},
{m:"oddone",d:"سهل",q:"أي كلمة ليست طعامًا؟",a:['بيتزا', 'أرز', 'تفاحة', 'سيارة'],x:3},
{m:"oddone",d:"سهل",q:"أي شيء لا يُستخدم للكتابة؟",a:['قلم', 'رصاص', 'قلم حبر', 'كرة'],x:3},
{m:"oddone",d:"سهل",q:"أي شهر مختلف؟",a:['يناير', 'مارس', 'يوليو', 'أحد'],x:3},
{m:"oddone",d:"سهل",q:"أي لغة مختلفة؟",a:['العربية', 'الفرنسية', 'الإنجليزية', 'أفريقيا'],x:3},
{m:"oddone",d:"سهل",q:"أي مدينة مختلفة؟",a:['الجزائر', 'وهران', 'قسنطينة', 'الجزائر'],x:3},
{m:"oddone",d:"سهل",q:"أي معدن مختلف؟",a:['ذهب', 'فضة', 'نحاس', 'خشب'],x:3},
{m:"oddone",d:"سهل",q:"أي شيء ليس من الملابس؟",a:['قميص', 'بنطال', 'حذاء', 'هاتف'],x:3},
{m:"oddone",d:"سهل",q:"أي حيوان ليس من الثدييات؟",a:['حصان', 'دولفين', 'قطة', 'نسر'],x:3},
{m:"oddone",d:"سهل",q:"أي قارة مختلفة؟",a:['آسيا', 'أفريقيا', 'أوروبا', 'البحر المتوسط'],x:3},
{m:"oddone",d:"سهل",q:"أي شيء لا يعمل بالكهرباء؟",a:['هاتف', 'حاسوب', 'مصباح', 'كتاب'],x:3},
{m:"oddone",d:"سهل",q:"أي مادة مختلفة؟",a:['حديد', 'ذهب', 'فضة', 'ماء'],x:3},
{m:"oddone",d:"سهل",q:"أي أداة مختلفة؟",a:['مطرقة', 'مفك', 'منشار', 'تفاحة'],x:3},
{m:"oddone",d:"سهل",q:"أي لعبة مختلفة؟",a:['Minecraft', 'Fortnite', 'Roblox', 'Netflix'],x:3},
{m:"oddone",d:"سهل",q:"أي مشروب مختلف؟",a:['ماء', 'عصير', 'حليب', 'خبز'],x:3},
{m:"oddone",d:"سهل",q:"أي شيء له عجلات؟",a:['سيارة', 'دراجة', 'حافلة', 'طاولة'],x:3},
{m:"oddone",d:"سهل",q:"أي شيء ليس كرويًا عادة؟",a:['كرة قدم', 'كرة سلة', 'كرة تنس', 'كتاب'],x:3},
{m:"oddone",d:"سهل",q:"أي شيء ليس حيوانًا؟",a:['قطة', 'كلب', 'حصان', 'شجرة'],x:3},
{m:"numberguess",d:"متوسط",q:"ما الرقم التالي: 2، 4، 6، ؟",a:['7', '8', '9', '10'],x:1},
{m:"numberguess",d:"متوسط",q:"ما الرقم التالي: 5، 10، 15، ؟",a:['18', '20', '25', '30'],x:1},
{m:"numberguess",d:"متوسط",q:"ما الرقم الناقص: 1، 3، 5، ؟",a:['6', '7', '8', '9'],x:1},
{m:"numberguess",d:"متوسط",q:"ما الرقم التالي: 10، 20، 30، ؟",a:['35', '40', '45', '50'],x:1},
{m:"numberguess",d:"متوسط",q:"عدد زوجي بين 11 و15 هو؟",a:['11', '12', '13', '15'],x:1},
{m:"numberguess",d:"متوسط",q:"ما الرقم الذي يقبل القسمة على 5؟",a:['12', '14', '17', '20'],x:3},
{m:"numberguess",d:"متوسط",q:"ما نصف 50؟",a:['20', '25', '30', '35'],x:1},
{m:"numberguess",d:"متوسط",q:"ما ضعف 12؟",a:['22', '24', '26', '28'],x:1},
{m:"numberguess",d:"متوسط",q:"ما الرقم الذي يسبق 100؟",a:['98', '99', '101', '102'],x:1},
{m:"numberguess",d:"متوسط",q:"ما الرقم الذي يلي 999؟",a:['998', '1000', '1001', '9999'],x:1},
{m:"numberguess",d:"متوسط",q:"3 × 7 = ؟",a:['18', '20', '21', '24'],x:2},
{m:"numberguess",d:"متوسط",q:"8 × 8 = ؟",a:['56', '64', '72', '81'],x:1},
{m:"numberguess",d:"متوسط",q:"81 ÷ 9 = ؟",a:['7', '8', '9', '10'],x:2},
{m:"numberguess",d:"متوسط",q:"100 - 37 = ؟",a:['53', '63', '73', '83'],x:1},
{m:"numberguess",d:"متوسط",q:"45 + 28 = ؟",a:['63', '73', '83', '93'],x:1},
{m:"numberguess",d:"متوسط",q:"إذا كان معك 20 وأضفت 15، يصبح؟",a:['25', '30', '35', '40'],x:2},
{m:"numberguess",d:"متوسط",q:"ربع 100 هو؟",a:['20', '25', '30', '40'],x:1},
{m:"numberguess",d:"متوسط",q:"العدد الأولي بين الخيارات؟",a:['21', '27', '29', '33'],x:2},
{m:"numberguess",d:"متوسط",q:"أصغر من 50 وأكبر من 40؟",a:['39', '41', '51', '60'],x:1},
{m:"numberguess",d:"متوسط",q:"ما الرقم التالي: 3، 6، 12، ؟",a:['18', '21', '24', '30'],x:2},
{m:"numberguess",d:"متوسط",q:"ما الرقم التالي: 1، 4، 9، ؟",a:['12', '14', '16', '18'],x:2},
{m:"numberguess",d:"متوسط",q:"ما الرقم التالي: 2، 3، 5، 8، ؟",a:['10', '11', '13', '15'],x:2},
{m:"numberguess",d:"متوسط",q:"ما الرقم التالي: 20، 18، 16، ؟",a:['12', '13', '14', '15'],x:2},
{m:"numberguess",d:"متوسط",q:"ما الرقم الناقص: 50، 45، 40، ؟",a:['30', '35', '38', '42'],x:1},
{m:"numberguess",d:"متوسط",q:"إذا كان اليوم 10، بعد 5 أيام؟",a:['12', '13', '14', '15'],x:3},
{m:"numberguess",d:"متوسط",q:"كم ثانية في دقيقة؟",a:['30', '45', '60', '90'],x:2},
{m:"numberguess",d:"متوسط",q:"كم ساعة في يوم؟",a:['12', '18', '24', '36'],x:2},
{m:"numberguess",d:"متوسط",q:"كم ضلعًا للمربع؟",a:['3', '4', '5', '6'],x:1},
{m:"numberguess",d:"متوسط",q:"كم ضلعًا للمثلث؟",a:['2', '3', '4', '5'],x:1},
{m:"numberguess",d:"متوسط",q:"ما مجموع 9 + 9؟",a:['16', '17', '18', '19'],x:2},
{m:"logic",d:"صعب",q:"علي أطول من سامي، وسامي أطول من كريم. من الأقصر؟",a:['علي', 'سامي', 'كريم', 'متساوون'],x:2},
{m:"logic",d:"صعب",q:"إذا كان كل القطط حيوانات، وميشو قط، فميشو هو؟",a:['طائر', 'حيوان', 'شجرة', 'سمكة'],x:1},
{m:"logic",d:"صعب",q:"لديك 3 تفاحات وأكلت واحدة. كم بقي؟",a:['1', '2', '3', '4'],x:1},
{m:"logic",d:"صعب",q:"إذا كان الباب مغلقًا والمفتاح معك، ما أول خطوة؟",a:['كسر الباب', 'استخدام المفتاح', 'القفز', 'الانتظار'],x:1},
{m:"logic",d:"صعب",q:"في سباق تجاوزت الشخص الثاني. ما مركزك؟",a:['الأول', 'الثاني', 'الثالث', 'الرابع'],x:1},
{m:"logic",d:"صعب",q:"لديك كوبان، أحدهما ممتلئ والآخر فارغ. أيهما أثقل؟",a:['الممتلئ', 'الفارغ', 'متساويان', 'لا يمكن معرفة'],x:0},
{m:"logic",d:"صعب",q:"إذا كان أمس الاثنين، فما اليوم؟",a:['الأحد', 'الثلاثاء', 'الأربعاء', 'الخميس'],x:1},
{m:"logic",d:"صعب",q:"كل الطيور لها أجنحة. البطريق طائر. هل له أجنحة؟",a:['نعم', 'لا', 'فقط أحيانًا', 'لا نعرف'],x:0},
{m:"logic",d:"صعب",q:"إذا كان 2+2=4، فكم 4+4؟",a:['6', '7', '8', '9'],x:2},
{m:"logic",d:"صعب",q:"ثلاثة أشخاص في غرفة، خرج واحد. كم بقي؟",a:['1', '2', '3', '4'],x:1},
{m:"logic",d:"صعب",q:"إذا كان لديك 10 أقلام وأعطيت 3، كم بقي؟",a:['6', '7', '8', '9'],x:1},
{m:"logic",d:"صعب",q:"أحمد أمام خالد وخالد أمام ياسر. من في الوسط؟",a:['أحمد', 'خالد', 'ياسر', 'لا أحد'],x:1},
{m:"logic",d:"صعب",q:"كل السيارات لها عجلات. هذه سيارة. ماذا تتوقع؟",a:['لها عجلات', 'لها أجنحة', 'لها زعانف', 'لا شيء'],x:0},
{m:"logic",d:"صعب",q:"إذا كانت الساعة 3، بعد ساعتين تصبح؟",a:['4', '5', '6', '7'],x:1},
{m:"logic",d:"صعب",q:"معك 5 كرات وأعطيت اثنتين. كم معك؟",a:['2', '3', '4', '5'],x:1},
{m:"logic",d:"صعب",q:"إذا كان السبت غدًا، فما اليوم؟",a:['الخميس', 'الجمعة', 'الأحد', 'الاثنين'],x:1},
{m:"logic",d:"صعب",q:"أكبر من 20 وأصغر من 30؟",a:['19', '21', '31', '40'],x:1},
{m:"logic",d:"صعب",q:"إذا كان كل الطلاب في الفصل، وأحمد طالب، فأحمد أين؟",a:['في الفصل', 'في الشارع', 'في البحر', 'لا نعرف'],x:0},
{m:"logic",d:"صعب",q:"لديك صندوقان ووضعت الكرة في الأول. أين الكرة؟",a:['الأول', 'الثاني', 'خارج الصندوق', 'لا يمكن معرفة'],x:0},
{m:"logic",d:"صعب",q:"إذا كان 5 أكبر من 3، فهل 3 أكبر من 5؟",a:['نعم', 'لا', 'أحيانًا', 'حسب اليوم'],x:1},
{m:"logic",d:"صعب",q:"قطار انطلق الساعة 1 ووصل 3. كم ساعة استغرق؟",a:['1', '2', '3', '4'],x:1},
{m:"logic",d:"صعب",q:"إذا كان لديك 4 أقدام لكل طاولة و3 طاولات، كم قدمًا؟",a:['8', '10', '12', '16'],x:2},
{m:"logic",d:"صعب",q:"إذا كان نصف العدد 10، فالعدد هو؟",a:['15', '20', '25', '30'],x:1},
{m:"logic",d:"صعب",q:"أمك لديها ابن اسمه أحمد. أحمد هو؟",a:['أخوك', 'أبوك', 'جدك', 'عمك'],x:0},
{m:"logic",d:"صعب",q:"إذا كان كل التفاح فاكهة، فهل التفاحة فاكهة؟",a:['نعم', 'لا', 'أحيانًا', 'مستحيل'],x:0},
{m:"logic",d:"صعب",q:"في يدك 5 أصابع، كم في اليدين؟",a:['8', '9', '10', '12'],x:2},
{m:"logic",d:"صعب",q:"إذا كان اليوم الأربعاء، بعد يومين؟",a:['الخميس', 'الجمعة', 'السبت', 'الأحد'],x:1},
{m:"logic",d:"صعب",q:"من الأكبر: 100 أم 99؟",a:['99', '100', 'متساويان', 'لا نعرف'],x:1},
{m:"logic",d:"صعب",q:"إذا كان لديك 2 قطط وكل قطة لها 4 أرجل، كم رجلًا؟",a:['4', '6', '8', '10'],x:2},
{m:"logic",d:"صعب",q:"إذا كان 10 أقل من 20، فما الأكبر؟",a:['10', '15', '20', '5'],x:2},
{m:"order",d:"متوسط",q:"ما الترتيب الصحيح من الأصغر إلى الأكبر؟",a:['1، 2، 3', '3، 2، 1', '2، 1، 3', '3، 1، 2'],x:0},
{m:"order",d:"متوسط",q:"أي ترتيب صحيح لأيام الأسبوع؟",a:['الاثنين، الثلاثاء، الأربعاء', 'الجمعة، الأربعاء، الخميس', 'الأحد، الثلاثاء، الاثنين', 'الخميس، الاثنين، الأحد'],x:0},
{m:"order",d:"متوسط",q:"رتب الأعداد من الأصغر للأكبر",a:['5، 2، 8', '2، 5، 8', '8، 5، 2', '5، 8، 2'],x:1},
{m:"order",d:"متوسط",q:"ما الترتيب الطبيعي؟",a:['ليل ثم نهار', 'نهار ثم ليل', 'ظهر ثم صباح', 'مساء ثم فجر'],x:1},
{m:"order",d:"متوسط",q:"أي ترتيب صحيح لمراحل اليوم؟",a:['صباح، ظهر، مساء، ليل', 'ليل، صباح، ظهر، مساء', 'ظهر، ليل، صباح، مساء', 'مساء، صباح، ليل، ظهر'],x:0},
{m:"order",d:"متوسط",q:"رتب من الأقصر للأطول",a:['دقيقة، ساعة، يوم', 'يوم، ساعة، دقيقة', 'ساعة، دقيقة، يوم', 'يوم، دقيقة، ساعة'],x:0},
{m:"order",d:"متوسط",q:"رتب من الأصغر للأكبر",a:['10، 1، 5', '1، 5، 10', '5، 10، 1', '10، 5، 1'],x:1},
{m:"order",d:"متوسط",q:"أي ترتيب صحيح لأرقام الهاتف؟",a:['1،2،3،4', '4،3،2،1', '2،1،4،3', '3،1،2،4'],x:0},
{m:"order",d:"متوسط",q:"رتب الفصول من الشتاء إلى الخريف",a:['شتاء، ربيع، صيف، خريف', 'ربيع، صيف، خريف، شتاء', 'صيف، خريف، شتاء، ربيع', 'خريف، شتاء، صيف، ربيع'],x:0},
{m:"order",d:"متوسط",q:"رتب مراحل نمو النبات بشكل مبسط",a:['بذرة، نبتة، نبات، زهرة', 'زهرة، بذرة، نبتة، نبات', 'نبات، بذرة، زهرة، نبتة', 'نبتة، زهرة، بذرة، نبات'],x:0},
{m:"order",d:"متوسط",q:"من الأصغر للأكبر",a:['ملعقة، كوب، زجاجة', 'زجاجة، كوب، ملعقة', 'كوب، ملعقة، زجاجة', 'ملعقة، زجاجة، كوب'],x:0},
{m:"order",d:"متوسط",q:"رتب هذه الأرقام تنازليًا",a:['3، 9، 6', '9، 6، 3', '6، 3، 9', '9، 3، 6'],x:1},
{m:"order",d:"متوسط",q:"أي ترتيب صحيح للشهور؟",a:['يناير، فبراير، مارس', 'مارس، يناير، فبراير', 'فبراير، أبريل، يناير', 'ديسمبر، يناير، نوفمبر'],x:0},
{m:"order",d:"متوسط",q:"من الأصغر للأكبر",a:['حبة رمل، سيارة، جبل', 'جبل، سيارة، حبة رمل', 'سيارة، جبل، حبة رمل', 'حبة رمل، جبل، سيارة'],x:0},
{m:"order",d:"متوسط",q:"رتب مراحل اللعبة عادةً",a:['بدء، لعب، نهاية', 'نهاية، بدء، لعب', 'لعب، نهاية، بدء', 'بدء، نهاية، لعب'],x:0},
{m:"order",d:"متوسط",q:"أي ترتيب صحيح للأرقام؟",a:['7، 8، 9', '9، 7، 8', '8، 9، 7', '7، 9، 8'],x:0},
{m:"order",d:"متوسط",q:"رتب من الأقل للأكثر",a:['10%، 50%، 90%', '90%، 50%، 10%', '50%، 10%، 90%', '10%، 90%، 50%'],x:0},
{m:"order",d:"متوسط",q:"رتب من الأبطأ للأسرع",a:['مشي، ركض، سيارة', 'سيارة، ركض، مشي', 'ركض، مشي، سيارة', 'مشي، سيارة، ركض'],x:0},
{m:"order",d:"متوسط",q:"أي ترتيب منطقي؟",a:['طفل، مراهق، بالغ', 'بالغ، طفل، مراهق', 'مراهق، طفل، بالغ', 'طفل، بالغ، مراهق'],x:0},
{m:"order",d:"متوسط",q:"من الأصغر للأكبر؟",a:['تفاحة، سيارة، مبنى', 'مبنى، سيارة، تفاحة', 'سيارة، تفاحة، مبنى', 'تفاحة، مبنى، سيارة'],x:0},
{m:"order",d:"متوسط",q:"رتب النقاط تصاعديًا",a:['100، 200، 300', '300، 200، 100', '200، 100، 300', '100، 300، 200'],x:0},
{m:"order",d:"متوسط",q:"أي ترتيب زمني صحيح؟",a:['2024، 2025، 2026', '2026، 2024، 2025', '2025، 2024، 2026', '2024، 2026، 2025'],x:0},
{m:"order",d:"متوسط",q:"رتب من الأقصر زمنًا للأطول",a:['ثانية، دقيقة، ساعة', 'ساعة، دقيقة، ثانية', 'دقيقة، ثانية، ساعة', 'ثانية، ساعة، دقيقة'],x:0},
{m:"order",d:"متوسط",q:"أي ترتيب صحيح؟",a:['أ، ب، ج', 'ج، ب، أ', 'ب، ج، أ', 'أ، ج، ب'],x:0},
{m:"order",d:"متوسط",q:"من الأصغر إلى الأكبر؟",a:['2، 4، 6، 8', '8، 6، 4، 2', '4، 2، 8، 6', '6، 8، 2، 4'],x:0},
{m:"order",d:"متوسط",q:"ترتيب أيام الأسبوع يبدأ عادةً بـ",a:['السبت أو الأحد حسب النظام', 'الأربعاء', 'الخميس', 'الجمعة فقط'],x:0},
{m:"order",d:"متوسط",q:"رتب المسافات",a:['1 كم، 5 كم، 10 كم', '10 كم، 1 كم، 5 كم', '5 كم، 10 كم، 1 كم', '1 كم، 10 كم، 5 كم'],x:0},
{m:"order",d:"متوسط",q:"أي ترتيب صحيح للنقاط؟",a:['1، 10، 100', '100، 10، 1', '10، 1، 100', '1، 100، 10'],x:0},
{m:"order",d:"متوسط",q:"رتب هذه الأرقام تنازليًا",a:['20، 15، 10', '10، 15، 20', '15، 20، 10', '20، 10، 15'],x:0},
{m:"order",d:"متوسط",q:"أي تسلسل صحيح؟",a:['أولًا، ثانيًا، ثالثًا', 'ثالثًا، أولًا، ثانيًا', 'ثانيًا، ثالثًا، أولًا', 'أولًا، ثالثًا، ثانيًا'],x:0},
/* كلمة السر */
{m:"password",d:"سهل",q:"🔐 كلمة السر: شيء له عقارب ونستخدمه لمعرفة الوقت.",a:["ساعة","كتاب","مصباح","كرسي"],x:0},
{m:"password",d:"سهل",q:"🔐 كلمة السر: شيء نستخدمه لفتح باب مقفل.",a:["مفتاح","قلم","مرآة","حذاء"],x:0},
{m:"password",d:"سهل",q:"🔐 كلمة السر: أداة نكتب بها على الورق.",a:["قلم","ملعقة","مفتاح","مرآة"],x:0},
{m:"password",d:"متوسط",q:"🔐 كلمة السر: جهاز يحفظ الطعام بارداً.",a:["فرن","ثلاجة","غسالة","مكيف"],x:1},
{m:"password",d:"متوسط",q:"🔐 كلمة السر: جهاز نستخدمه للاتصال وإرسال الرسائل.",a:["هاتف","ثلاجة","تلفاز","مصباح"],x:0},
{m:"password",d:"متوسط",q:"🔐 كلمة السر: مكان نشاهد فيه مباريات كرة القدم.",a:["ملعب","مكتبة","متحف","مطار"],x:0},
{m:"password",d:"صعب",q:"🔐 كلمة السر: مادة شفافة تستخدم كثيراً في النوافذ.",a:["زجاج","حديد","خشب","قطن"],x:0},
{m:"password",d:"صعب",q:"🔐 كلمة السر: شبكة عالمية تربط ملايين الأجهزة.",a:["الإنترنت","البلوتوث","الراديو","GPS"],x:0},

/* صح أو خطأ */
{m:"tf",d:"سهل",q:"الشمس نجم.",a:["صح","خطأ"],x:0},
{m:"tf",d:"سهل",q:"الماء يتجمد عند 0 درجة مئوية في الظروف القياسية.",a:["صح","خطأ"],x:0},
{m:"tf",d:"سهل",q:"القاهرة هي عاصمة الجزائر.",a:["صح","خطأ"],x:1},
{m:"tf",d:"سهل",q:"العنكبوت له ثماني أرجل.",a:["صح","خطأ"],x:0},
{m:"tf",d:"متوسط",q:"الذهب رمزه الكيميائي Au.",a:["صح","خطأ"],x:0},
{m:"tf",d:"متوسط",q:"الخفاش من الثدييات.",a:["صح","خطأ"],x:0},
{m:"tf",d:"متوسط",q:"الأخطبوط لديه ثلاثة قلوب.",a:["صح","خطأ"],x:0},
{m:"tf",d:"صعب",q:"الصوت ينتقل في الفراغ.",a:["صح","خطأ"],x:1},
{m:"tf",d:"صعب",q:"البرق يمكن أن يكون أسخن من سطح الشمس.",a:["صح","خطأ"],x:0},
{m:"tf",d:"صعب",q:"الخفاش من الطيور.",a:["صح","خطأ"],x:1},
{m:"tf",d:"سهل",q:"القطط من الثدييات.",a:["صح","خطأ"],x:0},
{m:"tf",d:"سهل",q:"الشمس تدور حول الأرض.",a:["صح","خطأ"],x:1},
{m:"tf",d:"سهل",q:"الماء يمكن أن يوجد في الحالة الصلبة والسائلة والغازية.",a:["صح","خطأ"],x:0},
{m:"tf",d:"سهل",q:"عدد أشهر السنة 12 شهراً.",a:["صح","خطأ"],x:0},
{m:"tf",d:"سهل",q:"القمر كوكب.",a:["صح","خطأ"],x:1},
{m:"tf",d:"سهل",q:"الجزائر تقع في قارة أفريقيا.",a:["صح","خطأ"],x:0},
{m:"tf",d:"متوسط",q:"كوكب المشتري أكبر من كوكب الأرض.",a:["صح","خطأ"],x:0},
{m:"tf",d:"متوسط",q:"الحديد أخف من الريش.",a:["صح","خطأ"],x:1},
{m:"tf",d:"متوسط",q:"الإنسان البالغ لديه عادة 206 عظمة تقريباً.",a:["صح","خطأ"],x:0},
{m:"tf",d:"متوسط",q:"البحر المتوسط أكبر من المحيط الهادئ.",a:["صح","خطأ"],x:1},
{m:"tf",d:"متوسط",q:"النباتات تحتاج إلى الضوء لصنع غذائها في عملية البناء الضوئي.",a:["صح","خطأ"],x:0},
{m:"tf",d:"متوسط",q:"الذهب رمزه الكيميائي Ag.",a:["صح","خطأ"],x:1},
{m:"tf",d:"صعب",q:"كوكب الزهرة هو أقرب كوكب إلى الشمس.",a:["صح","خطأ"],x:1},
{m:"tf",d:"صعب",q:"سرعة الضوء أكبر من سرعة الصوت.",a:["صح","خطأ"],x:0},
{m:"tf",d:"صعب",q:"الحمض النووي DNA يوجد في خلايا الكائنات الحية.",a:["صح","خطأ"],x:0},
{m:"tf",d:"صعب",q:"قارة أفريقيا هي أصغر قارات العالم مساحةً.",a:["صح","خطأ"],x:1},
{m:"tf",d:"صعب",q:"البرمجة بلغة HTML وحدها تكفي لإنشاء قاعدة بيانات.",a:["صح","خطأ"],x:1},
{m:"tf",d:"صعب",q:"المحيط الأطلسي أصغر من المحيط الهادئ.",a:["صح","خطأ"],x:0}
,
{m:"flagguess",d:"متوسط",q:"🇮🇳 ما اسم هذه الدولة؟",a:["الهند", "بنغلاديش", "باكستان", "نيبال"],x:0},
{m:"flagguess",d:"متوسط",q:"🇵🇰 ما اسم هذه الدولة؟",a:["الهند", "باكستان", "تركيا", "ماليزيا"],x:1},
{m:"flagguess",d:"متوسط",q:"🇧🇩 ما اسم هذه الدولة؟",a:["بنغلاديش", "باكستان", "الهند", "إندونيسيا"],x:0},
{m:"flagguess",d:"متوسط",q:"🇮🇩 ما اسم هذه الدولة؟",a:["إندونيسيا", "بولندا", "سنغافورة", "موناكو"],x:0},
{m:"flagguess",d:"متوسط",q:"🇲🇾 ما اسم هذه الدولة؟",a:["ماليزيا", "إندونيسيا", "تايلاند", "الفلبين"],x:0},
{m:"flagguess",d:"متوسط",q:"🇹🇭 ما اسم هذه الدولة؟",a:["تايلاند", "كوستاريكا", "كرواتيا", "لاوس"],x:0},
{m:"flagguess",d:"متوسط",q:"🇻🇳 ما اسم هذه الدولة؟",a:["فيتنام", "الصين", "كوريا الجنوبية", "تايوان"],x:0},
{m:"flagguess",d:"متوسط",q:"🇵🇭 ما اسم هذه الدولة؟",a:["الفلبين", "إندونيسيا", "ماليزيا", "سنغافورة"],x:0},
{m:"flagguess",d:"متوسط",q:"🇸🇬 ما اسم هذه الدولة؟",a:["سنغافورة", "ماليزيا", "إندونيسيا", "الفلبين"],x:0},
{m:"flagguess",d:"متوسط",q:"🇳🇵 ما اسم هذه الدولة؟",a:["نيبال", "بوتان", "الهند", "بنغلاديش"],x:0},
{m:"flagguess",d:"متوسط",q:"🇮🇷 ما اسم هذه الدولة؟",a:["إيران", "العراق", "تركيا", "أذربيجان"],x:0},
{m:"flagguess",d:"متوسط",q:"🇮🇶 ما اسم هذه الدولة؟",a:["العراق", "إيران", "سوريا", "الكويت"],x:0},
{m:"flagguess",d:"متوسط",q:"🇸🇾 ما اسم هذه الدولة؟",a:["سوريا", "لبنان", "الأردن", "العراق"],x:0},
{m:"flagguess",d:"متوسط",q:"🇵🇸 ما اسم هذه الدولة؟",a:["فلسطين", "الأردن", "لبنان", "سوريا"],x:0},
{m:"flagguess",d:"متوسط",q:"🇾🇪 ما اسم هذه الدولة؟",a:["اليمن", "عُمان", "السعودية", "إريتريا"],x:0},
{m:"flagguess",d:"متوسط",q:"🇱🇾 ما اسم هذه الدولة؟",a:["ليبيا", "تونس", "الجزائر", "مصر"],x:0},
{m:"flagguess",d:"متوسط",q:"🇸🇩 ما اسم هذه الدولة؟",a:["السودان", "مصر", "تشاد", "إثيوبيا"],x:0},
{m:"flagguess",d:"متوسط",q:"🇪🇹 ما اسم هذه الدولة؟",a:["إثيوبيا", "كينيا", "إريتريا", "غانا"],x:0},
{m:"flagguess",d:"متوسط",q:"🇰🇪 ما اسم هذه الدولة؟",a:["كينيا", "تنزانيا", "أوغندا", "غانا"],x:0},
{m:"flagguess",d:"متوسط",q:"🇳🇬 ما اسم هذه الدولة؟",a:["نيجيريا", "غانا", "الكاميرون", "السنغال"],x:0},
{m:"flagguess",d:"صعب",q:"🇬🇭 ما اسم هذه الدولة؟",a:["غانا", "نيجيريا", "ساحل العاج", "السنغال"],x:0},
{m:"flagguess",d:"صعب",q:"🇸🇳 ما اسم هذه الدولة؟",a:["السنغال", "مالي", "غانا", "نيجيريا"],x:0},
{m:"flagguess",d:"صعب",q:"🇲🇱 ما اسم هذه الدولة؟",a:["مالي", "النيجر", "تشاد", "السنغال"],x:0},
{m:"flagguess",d:"صعب",q:"🇨🇲 ما اسم هذه الدولة؟",a:["الكاميرون", "نيجيريا", "غانا", "الغابون"],x:0},
{m:"flagguess",d:"صعب",q:"🇺🇬 ما اسم هذه الدولة؟",a:["أوغندا", "كينيا", "رواندا", "تنزانيا"],x:0},
{m:"flagguess",d:"صعب",q:"🇹🇿 ما اسم هذه الدولة؟",a:["تنزانيا", "كينيا", "زامبيا", "أوغندا"],x:0},
{m:"flagguess",d:"صعب",q:"🇿🇲 ما اسم هذه الدولة؟",a:["زامبيا", "زيمبابوي", "بوتسوانا", "مالاوي"],x:0},
{m:"flagguess",d:"صعب",q:"🇿🇼 ما اسم هذه الدولة؟",a:["زيمبابوي", "زامبيا", "موزمبيق", "بوتسوانا"],x:0},
{m:"flagguess",d:"صعب",q:"🇳🇦 ما اسم هذه الدولة؟",a:["ناميبيا", "بوتسوانا", "جنوب أفريقيا", "أنغولا"],x:0},
{m:"flagguess",d:"صعب",q:"🇧🇼 ما اسم هذه الدولة؟",a:["بوتسوانا", "ناميبيا", "زامبيا", "زيمبابوي"],x:0},
{m:"flagguess",d:"صعب",q:"🇨🇱 ما اسم هذه الدولة؟",a:["تشيلي", "بيرو", "الأرجنتين", "الإكوادور"],x:0},
{m:"flagguess",d:"صعب",q:"🇵🇪 ما اسم هذه الدولة؟",a:["بيرو", "بوليفيا", "تشيلي", "الإكوادور"],x:0},
{m:"flagguess",d:"صعب",q:"🇨🇴 ما اسم هذه الدولة؟",a:["كولومبيا", "الإكوادور", "فنزويلا", "بيرو"],x:0},
{m:"flagguess",d:"صعب",q:"🇺🇾 ما اسم هذه الدولة؟",a:["الأوروغواي", "الأرجنتين", "باراغواي", "تشيلي"],x:0},
{m:"flagguess",d:"صعب",q:"🇵🇾 ما اسم هذه الدولة؟",a:["باراغواي", "الأوروغواي", "بوليفيا", "الأرجنتين"],x:0},
{m:"flagguess",d:"صعب",q:"🇻🇪 ما اسم هذه الدولة؟",a:["فنزويلا", "كولومبيا", "الإكوادور", "غيانا"],x:0},
{m:"flagguess",d:"صعب",q:"🇪🇨 ما اسم هذه الدولة؟",a:["الإكوادور", "كولومبيا", "بيرو", "بوليفيا"],x:0},
{m:"flagguess",d:"صعب",q:"🇧🇴 ما اسم هذه الدولة؟",a:["بوليفيا", "بيرو", "تشيلي", "باراغواي"],x:0},
{m:"flagguess",d:"صعب",q:"🇨🇷 ما اسم هذه الدولة؟",a:["كوستاريكا", "بنما", "نيكاراغوا", "هندوراس"],x:0},
{m:"flagguess",d:"صعب",q:"🇵🇦 ما اسم هذه الدولة؟",a:["بنما", "كوستاريكا", "كولومبيا", "المكسيك"],x:0},
{m:"currencyguess",d:"سهل",q:"💰 ما الدولة التي تستخدم الدولار الأمريكي؟",a:["الولايات المتحدة", "كندا", "أستراليا", "نيوزيلندا"],x:0},{m:"currencyguess",d:"سهل",q:"💰 ما الدولة التي تستخدم اليورو؟",a:["فرنسا", "سويسرا", "المملكة المتحدة", "النرويج"],x:0},{m:"currencyguess",d:"سهل",q:"💰 ما الدولة التي تستخدم الجنيه الإسترليني؟",a:["المملكة المتحدة", "أيرلندا", "كندا", "أستراليا"],x:0},{m:"currencyguess",d:"سهل",q:"💰 ما الدولة التي تستخدم الين؟",a:["اليابان", "الصين", "كوريا الجنوبية", "تايلاند"],x:0},{m:"currencyguess",d:"سهل",q:"💰 ما الدولة التي تستخدم الوون؟",a:["كوريا الجنوبية", "اليابان", "الصين", "فيتنام"],x:0},{m:"currencyguess",d:"سهل",q:"💰 ما الدولة التي تستخدم الروبية؟",a:["الهند", "باكستان", "نيبال", "سريلانكا"],x:0},{m:"currencyguess",d:"سهل",q:"💰 ما الدولة التي تستخدم الروبية الباكستانية؟",a:["باكستان", "الهند", "بنغلاديش", "نيبال"],x:0},{m:"currencyguess",d:"سهل",q:"💰 ما الدولة التي تستخدم الريال القطري؟",a:["قطر", "البحرين", "الكويت", "الإمارات"],x:0},{m:"currencyguess",d:"سهل",q:"💰 ما الدولة التي تستخدم الدينار الجزائري؟",a:["الجزائر", "تونس", "المغرب", "ليبيا"],x:0},{m:"currencyguess",d:"سهل",q:"💰 ما الدولة التي تستخدم الدينار التونسي؟",a:["تونس", "الجزائر", "ليبيا", "المغرب"],x:0},{m:"currencyguess",d:"متوسط",q:"💰 ما الدولة التي تستخدم الدرهم المغربي؟",a:["المغرب", "الجزائر", "تونس", "مصر"],x:0},{m:"currencyguess",d:"متوسط",q:"💰 ما الدولة التي تستخدم الدينار الأردني؟",a:["الأردن", "العراق", "سوريا", "لبنان"],x:0},{m:"currencyguess",d:"متوسط",q:"💰 ما الدولة التي تستخدم الريال السعودي؟",a:["السعودية", "قطر", "عُمان", "الإمارات"],x:0},{m:"currencyguess",d:"متوسط",q:"💰 ما الدولة التي تستخدم الدرهم الإماراتي؟",a:["الإمارات", "السعودية", "البحرين", "قطر"],x:0},{m:"currencyguess",d:"متوسط",q:"💰 ما الدولة التي تستخدم الدينار الكويتي؟",a:["الكويت", "البحرين", "العراق", "الأردن"],x:0},{m:"currencyguess",d:"متوسط",q:"💰 ما الدولة التي تستخدم الريال العماني؟",a:["عُمان", "اليمن", "قطر", "السعودية"],x:0},{m:"currencyguess",d:"متوسط",q:"💰 ما الدولة التي تستخدم الفرنك السويسري؟",a:["سويسرا", "النمسا", "بلجيكا", "فرنسا"],x:0},{m:"currencyguess",d:"متوسط",q:"💰 ما الدولة التي تستخدم الكرونة السويدية؟",a:["السويد", "النرويج", "الدنمارك", "فنلندا"],x:0},{m:"currencyguess",d:"متوسط",q:"💰 ما الدولة التي تستخدم الكرونة النرويجية؟",a:["النرويج", "السويد", "الدنمارك", "آيسلندا"],x:0},{m:"currencyguess",d:"متوسط",q:"💰 ما الدولة التي تستخدم الكرونة الدنماركية؟",a:["الدنمارك", "السويد", "فنلندا", "النرويج"],x:0},{m:"currencyguess",d:"صعب",q:"💰 ما الدولة التي تستخدم الزلوتي؟",a:["بولندا", "التشيك", "المجر", "رومانيا"],x:0},{m:"currencyguess",d:"صعب",q:"💰 ما الدولة التي تستخدم الفورنت؟",a:["المجر", "بولندا", "التشيك", "رومانيا"],x:0},{m:"currencyguess",d:"صعب",q:"💰 ما الدولة التي تستخدم الروبل؟",a:["روسيا", "أوكرانيا", "بيلاروسيا", "جورجيا"],x:0},{m:"currencyguess",d:"صعب",q:"💰 ما الدولة التي تستخدم الريال البرازيلي؟",a:["البرازيل", "الأرجنتين", "تشيلي", "كولومبيا"],x:0},{m:"currencyguess",d:"صعب",q:"💰 ما الدولة التي تستخدم البيزو المكسيكي؟",a:["المكسيك", "كوبا", "تشيلي", "إسبانيا"],x:0},{m:"currencyguess",d:"صعب",q:"💰 ما الدولة التي تستخدم البيزو الأرجنتيني؟",a:["الأرجنتين", "الأوروغواي", "تشيلي", "باراغواي"],x:0},{m:"currencyguess",d:"صعب",q:"💰 ما الدولة التي تستخدم الدولار الكندي؟",a:["كندا", "الولايات المتحدة", "أستراليا", "نيوزيلندا"],x:0},{m:"currencyguess",d:"صعب",q:"💰 ما الدولة التي تستخدم الدولار الأسترالي؟",a:["أستراليا", "نيوزيلندا", "كندا", "الولايات المتحدة"],x:0},{m:"currencyguess",d:"صعب",q:"💰 ما الدولة التي تستخدم الدولار النيوزيلندي؟",a:["نيوزيلندا", "أستراليا", "كندا", "الولايات المتحدة"],x:0},{m:"currencyguess",d:"صعب",q:"💰 ما الدولة التي تستخدم الراند؟",a:["جنوب أفريقيا", "ناميبيا", "بوتسوانا", "زيمبابوي"],x:0},{m:"foodguess",d:"سهل",q:"🍽️ من أي بلد يشتهر هذا الطعام: الكسكس؟",a:["الجزائر", "إيطاليا", "اليابان", "المكسيك"],x:0},{m:"foodguess",d:"سهل",q:"🍽️ من أي بلد يشتهر هذا الطعام: البيتزا النابوليتانية؟",a:["إيطاليا", "اليونان", "فرنسا", "إسبانيا"],x:0},{m:"foodguess",d:"سهل",q:"🍽️ من أي بلد يشتهر هذا الطعام: السوشي؟",a:["اليابان", "الصين", "كوريا الجنوبية", "تايلاند"],x:0},{m:"foodguess",d:"سهل",q:"🍽️ من أي بلد يشتهر هذا الطعام: التاكو؟",a:["المكسيك", "إسبانيا", "البرازيل", "الأرجنتين"],x:0},{m:"foodguess",d:"سهل",q:"🍽️ من أي بلد يشتهر هذا الطعام: الباييلا؟",a:["إسبانيا", "البرتغال", "إيطاليا", "فرنسا"],x:0},{m:"foodguess",d:"سهل",q:"🍽️ من أي بلد يشتهر هذا الطعام: الكيمتشي؟",a:["كوريا الجنوبية", "اليابان", "الصين", "فيتنام"],x:0},{m:"foodguess",d:"سهل",q:"🍽️ من أي بلد يشتهر هذا الطعام: الكاري الأحمر؟",a:["تايلاند", "الهند", "ماليزيا", "إندونيسيا"],x:0},{m:"foodguess",d:"سهل",q:"🍽️ من أي بلد يشتهر هذا الطعام: الفلافل؟",a:["مصر", "اليونان", "المكسيك", "اليابان"],x:0},{m:"foodguess",d:"سهل",q:"🍽️ من أي بلد يشتهر هذا الطعام: المسمن؟",a:["المغرب", "الجزائر", "تونس", "مصر"],x:0},{m:"foodguess",d:"سهل",q:"🍽️ من أي بلد يشتهر هذا الطعام: الشكشوكة؟",a:["تونس", "إيطاليا", "تركيا", "اليونان"],x:0},{m:"foodguess",d:"متوسط",q:"🍽️ من أي بلد يشتهر هذا الطعام: الكنافة النابلسية؟",a:["فلسطين", "لبنان", "الأردن", "سوريا"],x:0},{m:"foodguess",d:"متوسط",q:"🍽️ من أي بلد يشتهر هذا الطعام: المندي؟",a:["اليمن", "السعودية", "عُمان", "الأردن"],x:0},{m:"foodguess",d:"متوسط",q:"🍽️ من أي بلد يشتهر هذا الطعام: الكبسة؟",a:["السعودية", "قطر", "الكويت", "العراق"],x:0},{m:"foodguess",d:"متوسط",q:"🍽️ من أي بلد يشتهر هذا الطعام: البرياني؟",a:["الهند", "باكستان", "إيران", "تركيا"],x:0},{m:"foodguess",d:"متوسط",q:"🍽️ من أي بلد يشتهر هذا الطعام: الدولما؟",a:["أذربيجان", "جورجيا", "أرمينيا", "تركيا"],x:0},{m:"foodguess",d:"متوسط",q:"🍽️ من أي بلد يشتهر هذا الطعام: البوراتا؟",a:["إيطاليا", "فرنسا", "سويسرا", "إسبانيا"],x:0},{m:"foodguess",d:"متوسط",q:"🍽️ من أي بلد يشتهر هذا الطعام: البغرير؟",a:["المغرب", "الجزائر", "تونس", "ليبيا"],x:0},{m:"foodguess",d:"متوسط",q:"🍽️ من أي بلد يشتهر هذا الطعام: الحريرة؟",a:["المغرب", "الجزائر", "مصر", "تركيا"],x:0},{m:"foodguess",d:"متوسط",q:"🍽️ من أي بلد يشتهر هذا الطعام: المقلوبة؟",a:["فلسطين", "الأردن", "لبنان", "سوريا"],x:0},{m:"foodguess",d:"متوسط",q:"🍽️ من أي بلد يشتهر هذا الطعام: المجدرة؟",a:["لبنان", "سوريا", "الأردن", "فلسطين"],x:0},{m:"foodguess",d:"صعب",q:"🍽️ من أي بلد يشتهر هذا الطعام: الرامن؟",a:["اليابان", "الصين", "كوريا الجنوبية", "فيتنام"],x:0},{m:"foodguess",d:"صعب",q:"🍽️ من أي بلد يشتهر هذا الطعام: الديم سوم؟",a:["الصين", "اليابان", "تايلاند", "سنغافورة"],x:0},{m:"foodguess",d:"صعب",q:"🍽️ من أي بلد يشتهر هذا الطعام: الغولاش؟",a:["المجر", "النمسا", "ألمانيا", "بولندا"],x:0},{m:"foodguess",d:"صعب",q:"🍽️ من أي بلد يشتهر هذا الطعام: البيروجي؟",a:["بولندا", "روسيا", "أوكرانيا", "التشيك"],x:0},{m:"foodguess",d:"صعب",q:"🍽️ من أي بلد يشتهر هذا الطعام: السوفلاكي؟",a:["اليونان", "تركيا", "إيطاليا", "قبرص"],x:0},{m:"foodguess",d:"صعب",q:"🍽️ من أي بلد يشتهر هذا الطعام: الباد تاي؟",a:["تايلاند", "فيتنام", "الصين", "ماليزيا"],x:0},{m:"foodguess",d:"صعب",q:"🍽️ من أي بلد يشتهر هذا الطعام: السيفيتشي؟",a:["بيرو", "تشيلي", "الإكوادور", "المكسيك"],x:0},{m:"foodguess",d:"صعب",q:"🍽️ من أي بلد يشتهر هذا الطعام: الإمبانادا؟",a:["الأرجنتين", "البرازيل", "إسبانيا", "تشيلي"],x:0},{m:"foodguess",d:"صعب",q:"🍽️ من أي بلد يشتهر هذا الطعام: البان كيك؟",a:["الولايات المتحدة", "كندا", "فرنسا", "بلجيكا"],x:0},{m:"foodguess",d:"صعب",q:"🍽️ من أي بلد يشتهر هذا الطعام: الوافل البلجيكي؟",a:["بلجيكا", "فرنسا", "هولندا", "ألمانيا"],x:0},{m:"pattern",d:"سهل",q:"🔢 ما الرقم التالي في النمط: 2، 4، 6، 8، ؟",a:["9", "10", "11", "12"],x:1},{m:"pattern",d:"سهل",q:"🔢 ما الرقم التالي في النمط: 3، 6، 9، 12، ؟",a:["14", "15", "16", "18"],x:1},{m:"pattern",d:"سهل",q:"🔢 ما الرقم التالي في النمط: 5، 10، 20، 40، ؟",a:["60", "70", "80", "90"],x:2},{m:"pattern",d:"سهل",q:"🔢 ما الرقم التالي في النمط: 1، 4، 9، 16، ؟",a:["20", "24", "25", "30"],x:2},{m:"pattern",d:"سهل",q:"🔢 ما الرقم التالي في النمط: 10، 20، 30، 40، ؟",a:["45", "50", "55", "60"],x:1},{m:"pattern",d:"سهل",q:"🔢 ما الرقم التالي في النمط: 100، 90، 80، 70، ؟",a:["50", "55", "60", "65"],x:2},{m:"pattern",d:"سهل",q:"🔢 ما الرقم التالي في النمط: 2، 3، 5، 8، 13، ؟",a:["18", "20", "21", "22"],x:2},{m:"pattern",d:"سهل",q:"🔢 ما الرقم التالي في النمط: 1، 1، 2، 3، 5، ؟",a:["6", "7", "8", "9"],x:1},{m:"pattern",d:"سهل",q:"🔢 ما الرقم التالي في النمط: 4، 8، 12، 16، ؟",a:["18", "20", "22", "24"],x:1},{m:"pattern",d:"سهل",q:"🔢 ما الرقم التالي في النمط: 7، 14، 21، 28، ؟",a:["32", "35", "36", "42"],x:1},{m:"pattern",d:"متوسط",q:"🔢 ما الرقم التالي في النمط: 50، 45، 40، 35، ؟",a:["25", "30", "32", "34"],x:1},{m:"pattern",d:"متوسط",q:"🔢 ما الرقم التالي في النمط: 3، 9، 27، 81، ؟",a:["162", "189", "243", "324"],x:2},{m:"pattern",d:"متوسط",q:"🔢 ما الرقم التالي في النمط: 64، 32، 16، 8، ؟",a:["2", "4", "6", "10"],x:1},{m:"pattern",d:"متوسط",q:"🔢 ما الرقم التالي في النمط: 6، 12، 24، 48، ؟",a:["72", "84", "96", "108"],x:2},{m:"pattern",d:"متوسط",q:"🔢 ما الرقم التالي في النمط: 11، 22، 33، 44، ؟",a:["55", "56", "66", "77"],x:0},{m:"pattern",d:"متوسط",q:"🔢 ما الرقم التالي في النمط: 2، 6، 12، 20، ؟",a:["24", "30", "32", "36"],x:1},{m:"pattern",d:"متوسط",q:"🔢 ما الرقم التالي في النمط: 9، 18، 36، 72، ؟",a:["108", "124", "144", "152"],x:2},{m:"pattern",d:"متوسط",q:"🔢 ما الرقم التالي في النمط: 81، 27، 9، 3، ؟",a:["0", "1", "2", "3"],x:1},{m:"pattern",d:"متوسط",q:"🔢 ما الرقم التالي في النمط: 13، 16، 19، 22، ؟",a:["24", "25", "26", "28"],x:1},{m:"pattern",d:"متوسط",q:"🔢 ما الرقم التالي في النمط: 1، 8، 27، 64، ؟",a:["100", "121", "125", "144"],x:2},{m:"pattern",d:"صعب",q:"🔢 ما الرقم التالي في النمط: 20، 18، 15، 11، ؟",a:["6", "7", "8", "9"],x:0},{m:"pattern",d:"صعب",q:"🔢 ما الرقم التالي في النمط: 2، 5، 10، 17، ؟",a:["24", "25", "26", "27"],x:2},{m:"pattern",d:"صعب",q:"🔢 ما الرقم التالي في النمط: 30، 25، 20، 15، ؟",a:["5", "10", "12", "13"],x:1},{m:"pattern",d:"صعب",q:"🔢 ما الرقم التالي في النمط: 3، 12، 48، 192، ؟",a:["384", "576", "768", "960"],x:2},{m:"pattern",d:"صعب",q:"🔢 ما الرقم التالي في النمط: 4، 7، 13، 22، ؟",a:["31", "32", "34", "36"],x:1},{m:"pattern",d:"صعب",q:"🔢 ما الرقم التالي في النمط: 1، 3، 6، 10، ؟",a:["12", "14", "15", "16"],x:2},{m:"pattern",d:"صعب",q:"🔢 ما الرقم التالي في النمط: 5، 7، 11، 17، ؟",a:["21", "23", "25", "27"],x:1},{m:"pattern",d:"صعب",q:"🔢 ما الرقم التالي في النمط: 100، 50، 25، 12.5، ؟",a:["5", "6.25", "7.5", "8.25"],x:1},{m:"pattern",d:"صعب",q:"🔢 ما الرقم التالي في النمط: 8، 16، 32، 64، ؟",a:["96", "112", "128", "144"],x:2},{m:"pattern",d:"صعب",q:"🔢 ما الرقم التالي في النمط: 15، 30، 60، 120، ؟",a:["180", "200", "240", "300"],x:2},{m:"wordmix",d:"سهل",q:"🔤 رتّب الحروف لتكوين الكلمة: تباك",a:["كتاب", "باب", "قلم", "بيت"],x:0},{m:"wordmix",d:"سهل",q:"🔤 رتّب الحروف لتكوين الكلمة: مقلس",a:["قلم", "ملبس", "مقعد", "قلمس"],x:0},{m:"wordmix",d:"سهل",q:"🔤 رتّب الحروف لتكوين الكلمة: ةرجش",a:["شجرة", "سيارة", "مدرسة", "بحر"],x:0},{m:"wordmix",d:"سهل",q:"🔤 رتّب الحروف لتكوين الكلمة: ةرايس",a:["سيارة", "طائرة", "دراجة", "سفينة"],x:0},{m:"wordmix",d:"سهل",q:"🔤 رتّب الحروف لتكوين الكلمة: باتك",a:["كتاب", "كوكب", "مفتاح", "كرسي"],x:0},{m:"wordmix",d:"سهل",q:"🔤 رتّب الحروف لتكوين الكلمة: حاتفم",a:["مفتاح", "مصباح", "هاتف", "مطار"],x:0},{m:"wordmix",d:"سهل",q:"🔤 رتّب الحروف لتكوين الكلمة: حابصم",a:["مصباح", "مفتاح", "صندوق", "حاسوب"],x:0},{m:"wordmix",d:"سهل",q:"🔤 رتّب الحروف لتكوين الكلمة: سردم",a:["مدرسة", "مزرعة", "مكتبة", "ملعب"],x:0},{m:"wordmix",d:"سهل",q:"🔤 رتّب الحروف لتكوين الكلمة: ةبتكم",a:["مكتبة", "مدرسة", "مستشفى", "مطار"],x:0},{m:"wordmix",d:"سهل",q:"🔤 رتّب الحروف لتكوين الكلمة: رتفد",a:["دفتر", "قلم", "كتاب", "كرسي"],x:0},{m:"wordmix",d:"متوسط",q:"🔤 رتّب الحروف لتكوين الكلمة: ةقيدح",a:["حديقة", "مدينة", "جزيرة", "سفينة"],x:0},{m:"wordmix",d:"متوسط",q:"🔤 رتّب الحروف لتكوين الكلمة: رحب",a:["بحر", "نهر", "جبل", "صحراء"],x:0},{m:"wordmix",d:"متوسط",q:"🔤 رتّب الحروف لتكوين الكلمة: لبج",a:["جبل", "سهل", "بحر", "وادي"],x:0},{m:"wordmix",d:"متوسط",q:"🔤 رتّب الحروف لتكوين الكلمة: راطم",a:["مطار", "محطة", "ميناء", "ملعب"],x:0},{m:"wordmix",d:"متوسط",q:"🔤 رتّب الحروف لتكوين الكلمة: ةنيدم",a:["مدينة", "قرية", "حديقة", "جزيرة"],x:0},{m:"wordmix",d:"متوسط",q:"🔤 رتّب الحروف لتكوين الكلمة: ةريزج",a:["جزيرة", "صحراء", "غابة", "بحيرة"],x:0},{m:"wordmix",d:"متوسط",q:"🔤 رتّب الحروف لتكوين الكلمة: ةرجش",a:["شجرة", "وردة", "ثمرة", "غابة"],x:0},{m:"wordmix",d:"متوسط",q:"🔤 رتّب الحروف لتكوين الكلمة: ةرهز",a:["زهرة", "شجرة", "ثمرة", "ورقة"],x:0},{m:"wordmix",d:"متوسط",q:"🔤 رتّب الحروف لتكوين الكلمة: رمق",a:["قمر", "نجم", "شمس", "كوكب"],x:0},{m:"wordmix",d:"متوسط",q:"🔤 رتّب الحروف لتكوين الكلمة: مجن",a:["نجم", "قمر", "شمس", "سحاب"],x:0},{m:"wordmix",d:"صعب",q:"🔤 رتّب الحروف لتكوين الكلمة: سمش",a:["شمس", "قمر", "نجمة", "كوكب"],x:0},{m:"wordmix",d:"صعب",q:"🔤 رتّب الحروف لتكوين الكلمة: بوساح",a:["حاسوب", "هاتف", "تلفاز", "كاميرا"],x:0},{m:"wordmix",d:"صعب",q:"🔤 رتّب الحروف لتكوين الكلمة: فتاه",a:["هاتف", "حاسوب", "سماعة", "طابعة"],x:0},{m:"wordmix",d:"صعب",q:"🔤 رتّب الحروف لتكوين الكلمة: ةعبط",a:["طابعة", "شاشة", "كاميرا", "لوحة"],x:0},{m:"wordmix",d:"صعب",q:"🔤 رتّب الحروف لتكوين الكلمة: ةريماك",a:["كاميرا", "سماعة", "طابعة", "شاشة"],x:0},{m:"wordmix",d:"صعب",q:"🔤 رتّب الحروف لتكوين الكلمة: ةعامس",a:["سماعة", "كاميرا", "هاتف", "طابعة"],x:0},{m:"wordmix",d:"صعب",q:"🔤 رتّب الحروف لتكوين الكلمة: ةروص",a:["صورة", "قصة", "ورقة", "لوحة"],x:0},{m:"wordmix",d:"صعب",q:"🔤 رتّب الحروف لتكوين الكلمة: ةحول",a:["لوحة", "صورة", "خريطة", "شاشة"],x:0},{m:"wordmix",d:"صعب",q:"🔤 رتّب الحروف لتكوين الكلمة: ةطيرخ",a:["خريطة", "صورة", "لوحة", "ورقة"],x:0},{m:"wordmix",d:"صعب",q:"🔤 رتّب الحروف لتكوين الكلمة: حابصم",a:["مصباح", "مفتاح", "صندوق", "حاسوب"],x:0},{m:"bigger",d:"سهل",q:"📏 أيّهما أكبر مساحة؟",a:["روسيا", "كندا", "الصين", "البرازيل"],x:0},{m:"bigger",d:"سهل",q:"📏 أيّهما أكبر عدد سكان؟",a:["الهند", "الصين", "الولايات المتحدة", "البرازيل"],x:0},{m:"bigger",d:"سهل",q:"📏 أيّهما أكبر كوكبًا؟",a:["المشتري", "زحل", "الأرض", "نبتون"],x:0},{m:"bigger",d:"سهل",q:"📏 أيّهما أكبر قارة؟",a:["آسيا", "أفريقيا", "أوروبا", "أستراليا"],x:0},{m:"bigger",d:"سهل",q:"📏 أيّهما أكبر محيطًا؟",a:["الهادئ", "الأطلسي", "الهندي", "المتجمد الشمالي"],x:0},{m:"bigger",d:"سهل",q:"📏 أيّهما أكبر حجمًا؟",a:["الفيل الأفريقي", "الفيل الآسيوي", "الزرافة", "وحيد القرن"],x:0},{m:"bigger",d:"سهل",q:"📏 أيّهما أطول؟",a:["نهر النيل", "نهر الأمازون", "نهر الدانوب", "نهر الفولغا"],x:0},{m:"bigger",d:"سهل",q:"📏 أيّهما أعلى جبلًا؟",a:["إيفرست", "كي 2", "مون بلان", "كليمنجارو"],x:0},{m:"bigger",d:"سهل",q:"📏 أيّهما أكبر جزيرة؟",a:["غرينلاند", "مدغشقر", "بورنيو", "بريطانيا"],x:0},{m:"bigger",d:"سهل",q:"📏 أيّهما أكبر كوكب صخري؟",a:["الأرض", "المريخ", "الزهرة", "عطارد"],x:0},{m:"bigger",d:"متوسط",q:"📏 أيّهما أكبر بحرًا؟",a:["البحر المتوسط", "البحر الأحمر", "بحر العرب", "بحر البلطيق"],x:2},{m:"bigger",d:"متوسط",q:"📏 أيّهما أسرع؟",a:["الفهد", "الحصان", "الذئب", "الغزال"],x:0},{m:"bigger",d:"متوسط",q:"📏 أيّهما أثقل عادة؟",a:["الحوت الأزرق", "الفيل الأفريقي", "وحيد القرن", "الزرافة"],x:0},{m:"bigger",d:"متوسط",q:"📏 أيّهما أطول عمرًا عادة؟",a:["السلاحف العملاقة", "الكلاب", "الأرانب", "القطط"],x:0},{m:"bigger",d:"متوسط",q:"📏 أيّهما أكبر دولة عربية مساحة؟",a:["الجزائر", "السعودية", "السودان", "ليبيا"],x:0},{m:"bigger",d:"متوسط",q:"📏 أيّهما أكبر قمرًا؟",a:["غانيميد", "تيتان", "كاليستو", "القمر"],x:0},{m:"bigger",d:"متوسط",q:"📏 أيّهما أكبر حجمًا؟",a:["الشمس", "المشتري", "الأرض", "القمر"],x:0},{m:"bigger",d:"متوسط",q:"📏 أيّهما أبعد عن الشمس؟",a:["نبتون", "المريخ", "الأرض", "الزهرة"],x:0},{m:"bigger",d:"متوسط",q:"📏 أيّهما أكبر عددًا؟",a:["مليار", "مليون", "ألف", "مئة"],x:0},{m:"bigger",d:"متوسط",q:"📏 أيّهما أطول؟",a:["ساعة", "دقيقة", "ثانية", "ميلي ثانية"],x:0},{m:"bigger",d:"صعب",q:"📏 أيّهما أكبر مساحة؟",a:["المحيط الهادئ", "أفريقيا", "أوروبا", "أستراليا"],x:0},{m:"bigger",d:"صعب",q:"📏 أيّهما أكبر؟",a:["الكيلومتر", "المتر", "السنتيمتر", "المليمتر"],x:0},{m:"bigger",d:"صعب",q:"📏 أيّهما أكثر؟",a:["24 ساعة في اليوم", "60 دقيقة في الساعة", "60 ثانية في الدقيقة", "كلها متساوية حسب السؤال"],x:3},{m:"bigger",d:"صعب",q:"📏 أيّهما أكبر؟",a:["1000", "100", "10", "1"],x:0},{m:"bigger",d:"صعب",q:"📏 أيّهما أطول؟",a:["365 يومًا", "52 أسبوعًا تقريبًا", "12 شهرًا", "كلها تمثل سنة تقريبًا"],x:3},{m:"bigger",d:"صعب",q:"📏 أيّهما أكبر؟",a:["1 تيرابايت", "1 جيجابايت", "1 ميجابايت", "1 كيلوبايت"],x:0},{m:"bigger",d:"صعب",q:"📏 أيّهما أكبر؟",a:["100 سم", "1 متر", "1000 مم", "كلها متساوية"],x:3},{m:"bigger",d:"صعب",q:"📏 أيّهما أسرع؟",a:["الضوء", "الصوت", "الرياح", "الماء"],x:0},{m:"bigger",d:"صعب",q:"📏 أيّهما أكبر؟",a:["الأسد الأفريقي", "القط المنزلي", "الثعلب", "الأرنب"],x:0},{m:"bigger",d:"صعب",q:"📏 أيّهما أطول؟",a:["نهر الأمازون", "نهر التايمز", "نهر السين", "نهر الأردن"],x:0},
{m:"whami",d:"سهل",q:'"🕵️ من أنا؟ أحببت أن أكتب وأتحدث عن حقوق الإنسان. كنت رئيسًا لجنوب أفريقيا."',a:['نيلسون مانديلا', 'مارتن لوثر كينغ', 'مهاتما غاندي', 'باراك أوباما'],x:0},
{m:"whami",d:"سهل",q:'"🕵️ من أنا؟ رسمت لوحة الموناليزا وكنت فنانًا ومخترعًا إيطاليًا."',a:['ليوناردو دا فينشي', 'بيكاسو', 'فان غوخ', 'موزارت'],x:0},
{m:"whami",d:"سهل",q:'"🕵️ من أنا؟ طورت نظرية النسبية واشتهرت بمعادلة E=mc²."',a:['ألبرت أينشتاين', 'نيوتن', 'تسلا', 'داروين'],x:0},
{m:"whami",d:"سهل",q:'"🕵️ من أنا؟ كنت مؤلفًا مسرحيًا إنجليزيًا ومن أشهر أعمالي هاملت."',a:['ويليام شكسبير', 'تشارلز ديكنز', 'جورج أورويل', 'مارك توين'],x:0},
{m:"whami",d:"سهل",q:'"🕵️ من أنا؟ كنت عالمًا اكتشف قانون الجاذبية وحركة الكواكب."',a:['إسحاق نيوتن', 'غاليليو', 'أينشتاين', 'أرخميدس'],x:0},
{m:"whami",d:"سهل",q:'"🕵️ من أنا؟ كنت رسامًا هولنديًا ومن أشهر لوحاتي ليلة النجوم."',a:['فنسنت فان غوخ', 'مونيه', 'دافنشي', 'رامبرانت'],x:0},
{m:"whami",d:"سهل",q:'"🕵️ من أنا؟ كنت قائدًا فرنسيًا أصبح إمبراطورًا في بداية القرن التاسع عشر."',a:['نابليون بونابرت', 'يوليوس قيصر', 'الإسكندر الأكبر', 'تشرشل'],x:0},
{m:"whami",d:"سهل",q:'"🕵️ من أنا؟ كنت زعيمًا بريطانيًا خلال الحرب العالمية الثانية وارتبط اسمي بخطابات قوية."',a:['ونستون تشرشل', 'أبراهام لينكولن', 'نابليون', 'روزفلت'],x:0},
{m:"whami",d:"سهل",q:'"🕵️ من أنا؟ كنت عالم أحياء اقترحت نظرية التطور بالانتخاب الطبيعي."',a:['تشارلز داروين', 'مندل', 'باستور', 'كبلر'],x:0},
{m:"whami",d:"سهل",q:'"🕵️ من أنا؟ كنت عالمًا عربيًا ارتبط اسمي بعلم البصريات وكتاب المناظر."',a:['ابن الهيثم', 'الخوارزمي', 'ابن سينا', 'الرازي'],x:0},
{m:"whami",d:"متوسط",q:'"🕵️ من أنا؟ كنت عالمًا مسلمًا ارتبط اسمي بالجبر والخوارزميات."',a:['الخوارزمي', 'ابن الهيثم', 'ابن بطوطة', 'الفارابي'],x:0},
{m:"whami",d:"متوسط",q:'"🕵️ من أنا؟ كنت طبيبًا وفيلسوفًا من أشهر كتبي القانون في الطب."',a:['ابن سينا', 'الرازي', 'الخوارزمي', 'ابن رشد'],x:0},
{m:"whami",d:"متوسط",q:'"🕵️ من أنا؟ كنت رحالة مغربيًا زرت مناطق واسعة من العالم وكتبت عن رحلاتي."',a:['ابن بطوطة', 'المسعودي', 'الإدريسي', 'الخوارزمي'],x:0},
{m:"whami",d:"متوسط",q:'"🕵️ من أنا؟ كنت مؤسس شركة مايكروسوفت مع بول ألين."',a:['بيل غيتس', 'ستيف جوبز', 'إيلون ماسك', 'جيف بيزوس'],x:0},
{m:"whami",d:"متوسط",q:'"🕵️ من أنا؟ شاركت في تأسيس Apple مع ستيف وزنياك."',a:['ستيف جوبز', 'بيل غيتس', 'مارك زوكربيرغ', 'لاري بيج'],x:0},
{m:"whami",d:"متوسط",q:'"🕵️ من أنا؟ أسست شركة SpaceX وكنت من مؤسسي Tesla."',a:['إيلون ماسك', 'جيف بيزوس', 'ساتيا ناديلا', 'سيرجي برين'],x:0},
{m:"whami",d:"متوسط",q:'"🕵️ من أنا؟ أسست Amazon وكنت مديرها التنفيذي لسنوات طويلة."',a:['جيف بيزوس', 'إيلون ماسك', 'بيل غيتس', 'لاري إليسون'],x:0},
{m:"whami",d:"متوسط",q:'"🕵️ من أنا؟ أسست فيسبوك أثناء دراستي في هارفارد."',a:['مارك زوكربيرغ', 'جاك دورسي', 'بيل غيتس', 'إيفان شبيغل'],x:0},
{m:"whami",d:"متوسط",q:'"🕵️ من أنا؟ كنت لاعب كرة قدم أرجنتيني وفزت بكأس العالم 2022."',a:['ليونيل ميسي', 'دييغو مارادونا', 'كريستيانو رونالدو', 'نيمار'],x:0},
{m:"whami",d:"متوسط",q:'"🕵️ من أنا؟ كنت لاعب كرة قدم برتغالي واشتهرت بالرقم 7."',a:['كريستيانو رونالدو', 'ليونيل ميسي', 'لوكا مودريتش', 'نيمار'],x:0},
{m:"whami",d:"صعب",q:'"🕵️ من أنا؟ كنت لاعب كرة سلة أمريكي ولقبي Air."',a:['مايكل جوردان', 'كوبي براينت', 'ليبرون جيمس', 'ستيف كاري'],x:0},
{m:"whami",d:"صعب",q:'"🕵️ من أنا؟ كنت لاعب كرة سلة أمريكي وارتبط اسمي بفريق لوس أنجلوس ليكرز."',a:['كوبي براينت', 'مايكل جوردان', 'توم برادي', 'سيرينا ويليامز'],x:0},
{m:"whami",d:"صعب",q:'"🕵️ من أنا؟ كنت لاعبة تنس أمريكية فزت بعدد كبير من ألقاب الجراند سلام."',a:['سيرينا ويليامز', 'ماريا شارابوفا', 'نوفاك ديوكوفيتش', 'نعومي أوساكا'],x:0},
{m:"whami",d:"صعب",q:'"🕵️ من أنا؟ كنت مغنيًا ولقبي ملك البوب."',a:['مايكل جاكسون', 'إلفيس بريسلي', 'إد شيران', 'برونو مارس'],x:0},
{m:"whami",d:"صعب",q:'"🕵️ من أنا؟ كنت مغنية أمريكية ارتبط اسمي بألبوم 1989."',a:['تايلور سويفت', 'أديل', 'بيونسيه', 'ريهانا'],x:0},
{m:"whami",d:"صعب",q:'"🕵️ من أنا؟ كنت مغنيًا كنديًا واشتهرت بأغنية Baby في بداياتي."',a:['جاستن بيبر', 'ذا ويكند', 'دريك', 'شون مينديز'],x:0},
{m:"whami",d:"صعب",q:'"🕵️ من أنا؟ كنت مغنية بربادوسية وحققت شهرة عالمية باسم Rihanna."',a:['ريهانا', 'بيونسيه', 'أديل', 'كاتي بيري'],x:0},
{m:"whami",d:"صعب",q:'"🕵️ من أنا؟ كنت مخترعًا ورجل أعمال أمريكيًا وارتبط اسمي بالمصباح وشركة General Electric."',a:['توماس إديسون', 'نيكولا تسلا', 'غراهام بيل', 'جيمس واط'],x:0},
{m:"whami",d:"صعب",q:'"🕵️ من أنا؟ كنت مخترعًا صربيًا أمريكيًا ارتبط اسمي بالتيار المتردد."',a:['نيكولا تسلا', 'توماس إديسون', 'ألكسندر غراهام بيل', 'فاراداي'],x:0},
{m:"whami",d:"صعب",q:'"🕵️ من أنا؟ كنت مخترع الهاتف في الرواية التاريخية الشائعة."',a:['ألكسندر غراهام بيل', 'توماس إديسون', 'نيكولا تسلا', 'جيمس واط'],x:0},
{m:"riddle",d:"سهل",q:'"🧩 شيء له أسنان ولا يعض."',a:['المشط', 'الملعقة', 'الباب', 'الكتاب'],x:0},
{m:"riddle",d:"سهل",q:'"🧩 شيء كلما أخذت منه كبر."',a:['الحفرة', 'البالون', 'الكتاب', 'الكوب'],x:0},
{m:"riddle",d:"سهل",q:'"🧩 شيء يمشي بلا أرجل ويبكي بلا عيون."',a:['السحاب', 'السيارة', 'الريح', 'النهر'],x:0},
{m:"riddle",d:"سهل",q:'"🧩 له عين ولا يرى."',a:['الإبرة', 'القلم', 'الساعة', 'المصباح'],x:0},
{m:"riddle",d:"سهل",q:'"🧩 له رقبة بلا رأس."',a:['الزجاجة', 'الكرسي', 'الحذاء', 'الكتاب'],x:0},
{m:"riddle",d:"سهل",q:'"🧩 ما الشيء الذي يكتب ولا يقرأ؟"',a:['القلم', 'الكتاب', 'الهاتف', 'الطابعة'],x:0},
{m:"riddle",d:"سهل",q:'"🧩 شيء إذا وضعته في الثلاجة لا يبرد."',a:['الفلفل الحار', 'الماء', 'الثلج', 'العصير'],x:0},
{m:"riddle",d:"سهل",q:'"🧩 ما الذي له مفاتيح ولا يفتح أبوابًا؟"',a:['البيانو', 'الخزانة', 'السيارة', 'البيت'],x:0},
{m:"riddle",d:"سهل",q:'"🧩 شيء يسمع بلا أذن ويتكلم بلا لسان."',a:['الصدى', 'الكتاب', 'الهاتف', 'المرآة'],x:0},
{m:"riddle",d:"سهل",q:'"🧩 شيء له أوراق وليس نباتًا."',a:['الكتاب', 'الشجرة', 'الوردة', 'الحديقة'],x:0},
{m:"riddle",d:"متوسط",q:'"🧩 ما الذي يزداد كلما مشى؟"',a:['العمر', 'الحذاء', 'الطريق', 'الظل'],x:0},
{m:"riddle",d:"متوسط",q:'"🧩 شيء تراه مرة في الدقيقة ومرتين في اللحظة ولا تراه في الساعة."',a:['حرف الميم', 'حرف اللام', 'حرف الراء', 'حرف السين'],x:0},
{m:"riddle",d:"متوسط",q:'"🧩 ما الشيء الذي إذا كسرته لا يصدر صوتًا؟"',a:['الوعد', 'الزجاج', 'العصا', 'الباب'],x:0},
{m:"riddle",d:"متوسط",q:'"🧩 ما الذي يملأ الغرفة ولا يأخذ مساحة؟"',a:['الضوء', 'الماء', 'الهواء', 'الأثاث'],x:0},
{m:"riddle",d:"متوسط",q:'"🧩 شيء إذا زاد نقص."',a:['العمر المتبقي', 'المال', 'الطول', 'الوزن'],x:0},
{m:"riddle",d:"متوسط",q:'"🧩 ما الذي لا يبتل حتى لو دخل الماء؟"',a:['الضوء', 'الورق', 'الخشب', 'الحجر'],x:0},
{m:"riddle",d:"متوسط",q:'"🧩 شيء له وجه بلا فم ويدل على الوقت."',a:['الساعة', 'المرآة', 'الكتاب', 'الهاتف'],x:0},
{m:"riddle",d:"متوسط",q:'"🧩 ما الذي يمكنه السفر حول العالم وهو في زاويته؟"',a:['الطابع البريدي', 'السيارة', 'القمر', 'الطائرة'],x:0},
{m:"riddle",d:"متوسط",q:'"🧩 شيء إذا لمسته صاح."',a:['الجرس', 'الكتاب', 'القلم', 'الكرسي'],x:0},
{m:"riddle",d:"متوسط",q:'"🧩 ما الذي له قلب بلا نبض؟"',a:['الخرشوف', 'الإنسان', 'الساعة', 'الحجر'],x:0},
{m:"riddle",d:"صعب",q:'"🧩 شيء يكتب على الجدار ولا يملك قلمًا."',a:['الظل', 'الطباشير', 'الماء', 'الريح'],x:0},
{m:"riddle",d:"صعب",q:'"🧩 ما الذي كلما زاد وزنه خف؟"',a:['البالون المملوء بالهيليوم', 'الحجر', 'الحديد', 'الكتاب'],x:0},
{m:"riddle",d:"صعب",q:'"🧩 شيء يوجد في الشتاء خمسة وفي الصيف ثلاثة."',a:['حروف كلمة الشتاء والصيف؟', 'أيام الأسبوع', 'أشهر السنة', 'الفصول'],x:0},
{m:"riddle",d:"صعب",q:'"🧩 ما الذي إذا أكلته كله نفعك وإذا أكلت نصفه قتلك؟"',a:['السمسم', 'الدواء', 'السكر', 'الملح'],x:0},
{m:"riddle",d:"صعب",q:'"🧩 شيء يولد كبيرًا ويموت صغيرًا."',a:['قلم الرصاص', 'الشمعة', 'الشجرة', 'الكتاب'],x:0},
{m:"riddle",d:"صعب",q:'"🧩 ما الذي له مدن بلا بيوت وأنهار بلا ماء؟"',a:['الخريطة', 'الكتاب', 'الصورة', 'التلفاز'],x:0},
{m:"riddle",d:"صعب",q:'"🧩 شيء إذا شرب مات وإذا أكل عاش."',a:['النار', 'الماء', 'الإنسان', 'النبات'],x:0},
{m:"riddle",d:"صعب",q:'"🧩 ما الذي يمشي ويقف وليس له أرجل؟"',a:['الساعة', 'القطار', 'القلم', 'الطريق'],x:0},
{m:"riddle",d:"صعب",q:'"🧩 شيء كل الناس تحتاجه، وإذا أعطيته لغيرك يبقى معك."',a:['النصيحة', 'المال', 'الطعام', 'الماء'],x:0},
{m:"riddle",d:"صعب",q:'"🧩 ما الذي يكبر بلا حياة؟"',a:['الظل', 'النبات', 'الطفل', 'الكرة'],x:0},
{m:"cityguess",d:"سهل",q:'"🏙️ مدينة تشتهر ببرج إيفل."',a:['باريس', 'لندن', 'روما', 'مدريد'],x:0},
{m:"cityguess",d:"سهل",q:'"🏙️ مدينة فيها الكولوسيوم الشهير."',a:['روما', 'أثينا', 'برلين', 'فيينا'],x:0},
{m:"cityguess",d:"سهل",q:'"🏙️ مدينة تشتهر ببرج خليفة."',a:['دبي', 'الدوحة', 'أبوظبي', 'الرياض'],x:0},
{m:"cityguess",d:"سهل",q:'"🏙️ مدينة فيها المسجد الحرام."',a:['مكة المكرمة', 'المدينة المنورة', 'جدة', 'الرياض'],x:0},
{m:"cityguess",d:"سهل",q:'"🏙️ مدينة فيها المسجد النبوي."',a:['المدينة المنورة', 'مكة المكرمة', 'الطائف', 'جدة'],x:0},
{m:"cityguess",d:"سهل",q:'"🏙️ مدينة تشتهر بتمثال الحرية."',a:['نيويورك', 'واشنطن', 'بوسطن', 'شيكاغو'],x:0},
{m:"cityguess",d:"سهل",q:'"🏙️ مدينة تشتهر بقناة مائية تاريخية وبها ساحة سان ماركو."',a:['البندقية', 'ميلانو', 'فلورنسا', 'نابولي'],x:0},
{m:"cityguess",d:"سهل",q:'"🏙️ مدينة تشتهر ببوابة براندنبورغ."',a:['برلين', 'باريس', 'براغ', 'وارسو'],x:0},
{m:"cityguess",d:"سهل",q:'"🏙️ مدينة تشتهر بساعة بيغ بن."',a:['لندن', 'دبلن', 'إدنبرة', 'مانشستر'],x:0},
{m:"cityguess",d:"سهل",q:'"🏙️ مدينة تشتهر بتمثال المسيح الفادي."',a:['ريو دي جانيرو', 'ساو باولو', 'ليما', 'بوينس آيرس'],x:0},
{m:"cityguess",d:"متوسط",q:'"🏙️ مدينة تشتهر بأهرامات الجيزة القريبة منها."',a:['القاهرة', 'الإسكندرية', 'الأقصر', 'أسوان'],x:0},
{m:"cityguess",d:"متوسط",q:'"🏙️ مدينة تشتهر بمبنى أوبرا على شكل أشرعة."',a:['سيدني', 'ملبورن', 'أوكلاند', 'بيرث'],x:0},
{m:"cityguess",d:"متوسط",q:'"🏙️ مدينة فيها ساحة جامع الفنا الشهيرة."',a:['مراكش', 'الرباط', 'فاس', 'طنجة'],x:0},
{m:"cityguess",d:"متوسط",q:'"🏙️ مدينة جزائرية تشتهر بجسر سيدي مسيد."',a:['قسنطينة', 'وهران', 'عنابة', 'تلمسان'],x:0},
{m:"cityguess",d:"متوسط",q:'"🏙️ مدينة جزائرية ساحلية وتشتهر بواجهة بحرية كبيرة."',a:['وهران', 'سطيف', 'بسكرة', 'الجلفة'],x:0},
{m:"cityguess",d:"متوسط",q:'"🏙️ عاصمة اليابان."',a:['طوكيو', 'أوساكا', 'كيوتو', 'هيروشيما'],x:0},
{m:"cityguess",d:"متوسط",q:'"🏙️ عاصمة كوريا الجنوبية."',a:['سيول', 'بوسان', 'إنتشون', 'دايغو'],x:0},
{m:"cityguess",d:"متوسط",q:'"🏙️ عاصمة تركيا وتضم ضريح أتاتورك."',a:['أنقرة', 'إسطنبول', 'إزمير', 'بورصة'],x:0},
{m:"cityguess",d:"متوسط",q:'"🏙️ مدينة تضم دار الأوبرا في أستراليا."',a:['سيدني', 'كانبيرا', 'بريزبن', 'داروين'],x:0},
{m:"cityguess",d:"متوسط",q:'"🏙️ عاصمة كندا."',a:['أوتاوا', 'تورونتو', 'مونتريال', 'فانكوفر'],x:0},
{m:"cityguess",d:"صعب",q:'"🏙️ مدينة تشتهر بساعة بيغ بن وبرلمان بريطانيا."',a:['لندن', 'مانشستر', 'ليفربول', 'غلاسكو'],x:0},
{m:"cityguess",d:"صعب",q:'"🏙️ مدينة تشتهر بكنيسة ساغرادا فاميليا."',a:['برشلونة', 'مدريد', 'إشبيلية', 'فالنسيا'],x:0},
{m:"cityguess",d:"صعب",q:'"🏙️ مدينة تشتهر بقصر الحمراء القريب منها."',a:['غرناطة', 'مدريد', 'إشبيلية', 'قرطبة'],x:0},
{m:"cityguess",d:"صعب",q:'"🏙️ مدينة تشتهر بجسر تشارلز."',a:['براغ', 'بودابست', 'فيينا', 'زغرب'],x:0},
{m:"cityguess",d:"صعب",q:'"🏙️ مدينة على نهر الدانوب وتشتهر بمبنى البرلمان المجري."',a:['بودابست', 'براغ', 'فيينا', 'وارسو'],x:0},
{m:"cityguess",d:"صعب",q:'"🏙️ مدينة تشتهر ببوابة هادريان وميناء تاريخي في كرواتيا."',a:['سبليت', 'زغرب', 'دوبروفنيك', 'سراييفو'],x:0},
{m:"cityguess",d:"صعب",q:'"🏙️ مدينة تشتهر بالمدينة القديمة وأسوارها المطلة على البحر الأدرياتيكي."',a:['دوبروفنيك', 'سبليت', 'زغرب', 'بودغوريتسا'],x:0},
{m:"cityguess",d:"صعب",q:'"🏙️ مدينة أمريكية تشتهر ببوابة Golden Gate."',a:['سان فرانسيسكو', 'لوس أنجلوس', 'سياتل', 'دنفر'],x:0},
{m:"cityguess",d:"صعب",q:'"🏙️ مدينة أمريكية تشتهر بTimes Square."',a:['نيويورك', 'لاس فيغاس', 'ميامي', 'هيوستن'],x:0},
{m:"cityguess",d:"صعب",q:'"🏙️ مدينة برازيلية تشتهر بكرنفالها الشهير وشاطئ كوباكابانا."',a:['ريو دي جانيرو', 'برازيليا', 'ساو باولو', 'سلفادور'],x:0},
{m:"translate",d:"سهل",q:'"🌐 ما معنى كلمة "apple"؟"',a:['تفاحة', 'برتقالة', 'موزة', 'عنب'],x:0},
{m:"translate",d:"سهل",q:'"🌐 ما معنى كلمة "book"؟"',a:['كتاب', 'قلم', 'باب', 'كرسي'],x:0},
{m:"translate",d:"سهل",q:'"🌐 ما معنى كلمة "water"؟"',a:['ماء', 'نار', 'هواء', 'تراب'],x:0},
{m:"translate",d:"سهل",q:'"🌐 ما معنى كلمة "house"؟"',a:['منزل', 'مدرسة', 'شارع', 'سيارة'],x:0},
{m:"translate",d:"سهل",q:'"🌐 ما معنى كلمة "school"؟"',a:['مدرسة', 'مستشفى', 'مطار', 'مكتبة'],x:0},
{m:"translate",d:"سهل",q:'"🌐 ما معنى كلمة "friend"؟"',a:['صديق', 'جار', 'معلم', 'لاعب'],x:0},
{m:"translate",d:"سهل",q:'"🌐 ما معنى كلمة "family"؟"',a:['عائلة', 'مدينة', 'رحلة', 'لعبة'],x:0},
{m:"translate",d:"سهل",q:'"🌐 ما معنى كلمة "food"؟"',a:['طعام', 'شراب', 'ملابس', 'كتاب'],x:0},
{m:"translate",d:"سهل",q:'"🌐 ما معنى كلمة "sun"؟"',a:['شمس', 'قمر', 'نجم', 'سحاب'],x:0},
{m:"translate",d:"سهل",q:'"🌐 ما معنى كلمة "moon"؟"',a:['قمر', 'شمس', 'بحر', 'جبل'],x:0},
{m:"translate",d:"متوسط",q:'"🌐 ما معنى كلمة "car"؟"',a:['سيارة', 'طائرة', 'قطار', 'دراجة'],x:0},
{m:"translate",d:"متوسط",q:'"🌐 ما معنى كلمة "road"؟"',a:['طريق', 'جسر', 'بيت', 'سوق'],x:0},
{m:"translate",d:"متوسط",q:'"🌐 ما معنى كلمة "fast"؟"',a:['سريع', 'بطيء', 'قوي', 'ضعيف'],x:0},
{m:"translate",d:"متوسط",q:'"🌐 ما معنى كلمة "strong"؟"',a:['قوي', 'ذكي', 'سريع', 'قصير'],x:0},
{m:"translate",d:"متوسط",q:'"🌐 ما معنى كلمة "happy"؟"',a:['سعيد', 'غاضب', 'حزين', 'خائف'],x:0},
{m:"translate",d:"متوسط",q:'"🌐 ما معنى كلمة "beautiful"؟"',a:['جميل', 'قديم', 'صغير', 'صعب'],x:0},
{m:"translate",d:"متوسط",q:'"🌐 ما معنى كلمة "computer"؟"',a:['حاسوب', 'هاتف', 'تلفاز', 'طابعة'],x:0},
{m:"translate",d:"متوسط",q:'"🌐 ما معنى كلمة "keyboard"؟"',a:['لوحة مفاتيح', 'فأرة', 'شاشة', 'سماعة'],x:0},
{m:"translate",d:"متوسط",q:'"🌐 ما معنى كلمة "window"؟"',a:['نافذة', 'باب', 'سقف', 'أرضية'],x:0},
{m:"translate",d:"متوسط",q:'"🌐 ما معنى كلمة "mountain"؟"',a:['جبل', 'بحر', 'نهر', 'جزيرة'],x:0},
{m:"translate",d:"صعب",q:'"🌐 ما معنى كلمة "river"؟"',a:['نهر', 'بحيرة', 'محيط', 'وادي'],x:0},
{m:"translate",d:"صعب",q:'"🌐 ما معنى كلمة "airport"؟"',a:['مطار', 'محطة قطار', 'ميناء', 'ملعب'],x:0},
{m:"translate",d:"صعب",q:'"🌐 ما معنى كلمة "doctor"؟"',a:['طبيب', 'مهندس', 'معلم', 'طيار'],x:0},
{m:"translate",d:"صعب",q:'"🌐 ما معنى كلمة "teacher"؟"',a:['معلم', 'طبيب', 'شرطي', 'سائق'],x:0},
{m:"translate",d:"صعب",q:'"🌐 ما معنى كلمة "player"؟"',a:['لاعب', 'مشاهد', 'حكم', 'مدرب'],x:0},
{m:"translate",d:"صعب",q:'"🌐 ما معنى كلمة "game"؟"',a:['لعبة', 'فيلم', 'كتاب', 'أغنية'],x:0},
{m:"translate",d:"صعب",q:'"🌐 ما معنى كلمة "movie"؟"',a:['فيلم', 'لعبة', 'قصة', 'صورة'],x:0},
{m:"translate",d:"صعب",q:'"🌐 ما معنى كلمة "music"؟"',a:['موسيقى', 'رقص', 'رسم', 'رياضة'],x:0},
{m:"translate",d:"صعب",q:'"🌐 ما معنى كلمة "question"؟"',a:['سؤال', 'إجابة', 'خبر', 'قصة'],x:0},
{m:"translate",d:"صعب",q:'"🌐 ما معنى كلمة "answer"؟"',a:['إجابة', 'سؤال', 'مشكلة', 'اختيار'],x:0},

/* ذاكرة سريعة */
{m:"memory",d:"سهل",q:"🧠 تذكّر التسلسل: 🔵 🟢 🔴 — ما الرمز الثاني؟",a:["🟢","🔴","🔵","🟡"],x:0},
{m:"memory",d:"سهل",q:"🧠 تذكّر التسلسل: 4 - 7 - 2 — ما الرقم الأخير؟",a:["2","4","7","9"],x:0},
{m:"memory",d:"سهل",q:"🧠 تذكّر: قمر، بحر، جبل — ما الكلمة الثانية؟",a:["بحر","جبل","قمر","نهر"],x:0},
{m:"memory",d:"سهل",q:"🧠 تذكّر: 🐶 🍎 🚗 — ما العنصر الأول؟",a:["🐶","🍎","🚗","🐱"],x:0},
{m:"memory",d:"سهل",q:"🧠 تذكّر: 8 - 3 - 9 — ما الرقم الأوسط؟",a:["3","8","9","6"],x:0},
{m:"memory",d:"متوسط",q:"🧠 تذكّر: أحمر، أزرق، أصفر، أخضر — ما اللون الثالث؟",a:["أصفر","أخضر","أزرق","أحمر"],x:0},
{m:"memory",d:"متوسط",q:"🧠 تذكّر: 5 - 1 - 8 - 6 — ما الرقم الثاني؟",a:["1","5","8","6"],x:0},
{m:"memory",d:"متوسط",q:"🧠 تذكّر: مكة، جدة، الرياض — ما المدينة الأخيرة؟",a:["الرياض","جدة","مكة","الدمام"],x:0},
{m:"memory",d:"متوسط",q:"🧠 تذكّر: 🟣 ⭐ 🔥 🌙 — ما الرمز الثالث؟",a:["🔥","⭐","🌙","🟣"],x:0},
{m:"memory",d:"متوسط",q:"🧠 تذكّر: 2 - 9 - 4 - 7 — ما الرقم الأول؟",a:["2","9","4","7"],x:0},
{m:"memory",d:"صعب",q:"🧠 تذكّر: ذهب، فضة، نحاس، حديد — ما العنصر الرابع؟",a:["حديد","نحاس","فضة","ذهب"],x:0},
{m:"memory",d:"صعب",q:"🧠 تذكّر: 6 - 2 - 9 - 1 - 5 — ما الرقم الخامس؟",a:["5","1","9","6"],x:0},
{m:"memory",d:"صعب",q:"🧠 تذكّر: آسيا، أوروبا، أفريقيا، أمريكا — ما القارة الثانية؟",a:["أوروبا","آسيا","أفريقيا","أمريكا"],x:0},
{m:"memory",d:"صعب",q:"🧠 تذكّر: 🎮 📱 💻 🎧 — ما الرمز الرابع؟",a:["🎧","💻","📱","🎮"],x:0},
{m:"memory",d:"صعب",q:"🧠 تذكّر: 3 - 8 - 1 - 9 - 4 — ما الرقم الثالث؟",a:["1","8","9","4"],x:0},
{m:"memory",d:"صعب",q:"🧠 تذكّر: شمس، قمر، نجم، سحاب — ما العنصر الثالث؟",a:["نجم","قمر","سحاب","شمس"],x:0},
{m:"memory",d:"متوسط",q:"🧠 تذكّر: تفاح، موز، عنب — ما الفاكهة الأولى؟",a:["تفاح","موز","عنب","برتقال"],x:0},
{m:"memory",d:"متوسط",q:"🧠 تذكّر: 7 - 4 - 2 - 8 — ما الرقم الأخير؟",a:["8","2","4","7"],x:0},
{m:"memory",d:"سهل",q:"🧠 تذكّر: 🚀 ⭐ 🌍 — ما الرمز الثاني؟",a:["⭐","🌍","🚀","🌙"],x:0},
{m:"memory",d:"سهل",q:"🧠 تذكّر: أسود، أبيض، رمادي — ما اللون الأول؟",a:["أسود","أبيض","رمادي","أزرق"],x:0},

/* حساب خاطف */
{m:"math",d:"سهل",q:"➗ كم يساوي 7 + 5؟",a:["12","11","13","10"],x:0},
{m:"math",d:"سهل",q:"➗ كم يساوي 9 - 4؟",a:["5","6","4","3"],x:0},
{m:"math",d:"سهل",q:"➗ كم يساوي 6 × 3؟",a:["18","16","20","12"],x:0},
{m:"math",d:"سهل",q:"➗ كم يساوي 20 ÷ 4؟",a:["5","4","6","8"],x:0},
{m:"math",d:"سهل",q:"➗ كم يساوي 15 + 8؟",a:["23","22","24","21"],x:0},
{m:"math",d:"سهل",q:"➗ كم يساوي 30 - 12؟",a:["18","16","20","17"],x:0},
{m:"math",d:"متوسط",q:"➗ كم يساوي 7 × 8؟",a:["56","54","64","48"],x:0},
{m:"math",d:"متوسط",q:"➗ كم يساوي 81 ÷ 9؟",a:["9","8","7","10"],x:0},
{m:"math",d:"متوسط",q:"➗ كم يساوي 45 + 27؟",a:["72","70","73","62"],x:0},
{m:"math",d:"متوسط",q:"➗ كم يساوي 100 - 37؟",a:["63","67","73","53"],x:0},
{m:"math",d:"متوسط",q:"➗ كم يساوي 12 × 4؟",a:["48","44","52","36"],x:0},
{m:"math",d:"متوسط",q:"➗ كم يساوي 144 ÷ 12؟",a:["12","14","10","11"],x:0},
{m:"math",d:"صعب",q:"➗ كم يساوي 17 × 6؟",a:["102","96","112","108"],x:0},
{m:"math",d:"صعب",q:"➗ كم يساوي 225 ÷ 15؟",a:["15","12","18","20"],x:0},
{m:"math",d:"صعب",q:"➗ كم يساوي 38 + 47؟",a:["85","84","86","83"],x:0},
{m:"math",d:"صعب",q:"➗ كم يساوي 200 - 86؟",a:["114","116","104","124"],x:0},
{m:"math",d:"صعب",q:"➗ كم يساوي 13 × 9؟",a:["117","107","127","113"],x:0},
{m:"math",d:"صعب",q:"➗ كم يساوي 196 ÷ 14؟",a:["14","12","16","13"],x:0},
{m:"math",d:"متوسط",q:"➗ كم يساوي 25 × 3؟",a:["75","65","80","70"],x:0},
{m:"math",d:"متوسط",q:"➗ كم يساوي 96 ÷ 8؟",a:["12","14","10","16"],x:0},
]

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
  if(id === "profile") { updateStats(); renderAccountProfile(); }
  renderHeaderAccount();
  if(id === "settings") loadPreferencesUI();
  if(id === "leaders") updateLeaders();
}

function toggleProfileMenu(event){
  event?.stopPropagation();
  const menu=el('profileDropdown'),trigger=el('profileMenuTrigger');
  if(!menu)return;
  const open=!menu.classList.contains('open');menu.classList.toggle('open',open);trigger?.setAttribute('aria-expanded',String(open));
  if(open)renderHeaderAccount();
}
function closeProfileMenu(){const menu=el('profileDropdown');menu?.classList.remove('open');el('profileMenuTrigger')?.setAttribute('aria-expanded','false');}
function renderHeaderAccount(){
  const u=getUser(),logged=!!getToken()&&!!u,name=logged?(u.username||'حسابي'):'زائر',initial=String(name||'م').trim().charAt(0).toUpperCase()||'م';
  const set=(id,v)=>{const n=el(id);if(n)n.textContent=v;};
  const avatar=logged&&u.preferences&&u.preferences.avatar?u.preferences.avatar:'';
  ['headerAvatar','dropdownAvatar'].forEach(id=>{const n=el(id);if(!n)return;n.textContent=avatar?'':initial;n.style.backgroundImage=avatar?`url(\"${avatar}\")`:'';n.classList.toggle('has-photo',!!avatar);});set('headerProfileName',logged?name:'حسابي');set('dropdownName',name);set('dropdownEmail',logged?(u.email||'حسابك في مِخّك'):'سجّل الدخول لمزامنة بياناتك');set('accountStatus',logged?'متصل':'زائر');
  const login=el('dropdownLogin');if(login)login.style.display=logged?'none':'flex';
  const logoutButton=el('profileLogoutButton');if(logoutButton)logoutButton.style.display=logged?'flex':'none';
  const wrap=el('profileMenuWrap');if(wrap)wrap.hidden=!logged;
  const auth= document.querySelector('.account-area > .account-btn');if(auth)auth.style.display=logged?'none':'inline-flex';
}
document.addEventListener('click',e=>{if(!e.target.closest('.profile-menu-wrap'))closeProfileMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProfileMenu();});

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
    // لا نفرض 30 سؤالًا على أي لعبة. اللاعب يختار العدد بنفسه.
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
    const uniqueKey = (q.m === "imageguess" || q.m === "logotruth" || q.m === "playerguess" || q.m === "celebrityguess" || q.m === "youtuberguess")
      ? `${q.m}|${q.creator || q.wiki || q.img || q.product || q.q}`
      : q.q;
    if(!seen.has(uniqueKey)){
      seen.add(uniqueKey);
      unique.push(q);
    }
  }

  let wanted = parseInt(el("qCount")?.value, 10) || 15;
  wanted = Math.max(10, Math.min(wanted, unique.length));

  // انسخ السؤال ثم اخلط الاختيارات حتى لا تكون الإجابة الصحيحة دائمًا الخيار الأول.
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

function productSVG(type){
  const safe = String(type || "").replace(/[^a-zA-Z0-9_.-]/g, "");
  return `<div class="product-image"><img src="images/${safe}" alt="صورة المنتج مع إخفاء اسم الشركة" loading="eager"></div>`;
}

function sendContactMessage(){
  const name=(el("contactName")?.value||"").trim();
  const email=(el("contactEmail")?.value||"").trim();
  const message=(el("contactMessage")?.value||"").trim();
  if(!message){ alert("اكتب رسالتك أولًا."); return; }
  const subject=encodeURIComponent(`رسالة من موقع مِخّك${name ? ` — ${name}` : ""}`);
  const body=encodeURIComponent(`الاسم: ${name||"غير مذكور"}\nالبريد: ${email||"غير مذكور"}\n\nالرسالة:\n${message}`);
  window.location.href=`mailto:mmtofik9@gmail.com?subject=${subject}&body=${body}`;
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
  clearInterval(onlineFriendTimer);
  if(onlineFriendSocket && onlineFriendRoom){
    try{ onlineFriendSocket.emit("room:leave"); }catch(e){}
  }
  stopFriendsHeartbeat();
  leaveFriendsHeartbeat();
  friendMode=false;
  onlineFriendMode=false;
  onlineFriendRoom='';
  onlineFriendHost=false;
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
  const game = modes[q.m] || modes.quiz;
  answered = false;

  el("qNumber").textContent = friendMode
    ? `دور: ${friendPlayers[friendTurn]} — السؤال ${current + 1} / ${round.length}`
    : `السؤال ${current + 1} / ${round.length}`;
  el("qCat").textContent = q.m === "guess" ? "🎯 خمنها" :
                           q.m === "logotruth" ? "🏷️ الشعار صحيح" : q.m === "imageguess" ? "خمن الصورة" :
                           q.m === "playerguess" ? "⚽ خمن اللاعب" :
                           q.m === "celebrityguess" ? "🌟 خمن المشهور" :
                           q.m === "youtuberguess" ? "▶️ خمن اليوتيوبر" :
                           q.m === "emoji" ? "🎭 خمن بالإيموجي" :
                           q.m === "flagguess" ? "🏳️ خمن العلم" :
                           q.m === "currencyguess" ? "💰 عملة أي دولة؟" :
                           q.m === "foodguess" ? "🍽️ من أي بلد؟" :
                           q.m === "pattern" ? "🔢 أكمل النمط" :
                           q.m === "wordmix" ? "🔤 فك الكلمة" :
                           q.m === "bigger" ? "📏 أيهما أكبر؟" :
                           q.m === "whami" ? "🕵️ من أنا؟" :
                           q.m === "riddle" ? "🧩 لغز سريع" :
                           q.m === "cityguess" ? "🏙️ خمن المدينة" :
                           q.m === "translate" ? "🌐 ترجمة سريعة" :
                           q.m === "oddone" ? "🧠 المختلف" :
                           q.m === "numberguess" ? "🎯 خمن الرقم" :
                           q.m === "logic" ? "🧠 منطق سريع" :
                           q.m === "order" ? "🏁 من يأتي أولًا؟" :
                           q.m === "memory" ? "🧠 ذاكرة سريعة" :
                           q.m === "math" ? "➗ حساب خاطف" :
                           q.m === "password" ? "🔐 كلمة السر" :
                           q.m === "tf" ? "صح أو خطأ" :
                           q.m === "speed" ? "⚡ سرعة" : "🧠 منوعات";

  let imageBox = document.getElementById("imageGuessBox");
  if(!imageBox){
    imageBox = document.createElement("div");
    imageBox.id = "imageGuessBox";
    const qt = el("questionText");
    qt.parentNode.insertBefore(imageBox, qt);
  }
  if(q.m === "logotruth") {
    imageBox.style.display = "block";
    imageBox.innerHTML = `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:16px 0"><div style="border:1px solid var(--border,#ddd);border-radius:12px;background:#fff;padding:12px;text-align:center"><span style="display:block;color:#555;margin-bottom:8px">الصورة الأولى</span><img class="logo-truth-image" data-logo-option="1" src="${q.img1}" alt="الشعار الأول" loading="eager" style="width:100%;height:130px;object-fit:contain"></div><div style="border:1px solid var(--border,#ddd);border-radius:12px;background:#fff;padding:12px;text-align:center"><span style="display:block;color:#555;margin-bottom:8px">الصورة الثانية</span><img class="logo-truth-image" data-logo-option="2" src="${q.img2}" alt="الشعار الثاني" loading="eager" style="width:100%;height:130px;object-fit:contain"></div></div>`;
    // إذا فشلت أي صورة من الصورتين، احذف السؤال من الجولة وانتقل تلقائيًا للسؤال التالي.
    const logoImages = imageBox.querySelectorAll('.logo-truth-image');
    let logoQuestionSkipped = false;
    const skipUnavailableLogoQuestion = () => {
      if (logoQuestionSkipped || round[current] !== q || answered) return;
      logoQuestionSkipped = true;
      round.splice(current, 1);
      const skipMsg = el('answerMsg');
      if (skipMsg) {
        skipMsg.textContent = '⚠️ تعذّر تحميل إحدى الصورتين، تم تخطي السؤال تلقائيًا.';
        skipMsg.style.color = '#fbbf24';
      }
      clearInterval(timer);
      setTimeout(() => {
        if (current >= round.length) finishGame();
        else renderQuestion();
      }, 650);
    };
    logoImages.forEach(img => {
      img.addEventListener('error', skipUnavailableLogoQuestion, { once: true });
    });
  } else if(q.m === "imageguess") {
    imageBox.style.display = "block";
    imageBox.innerHTML = `<div class="real-product-photo"><img id="visualImage" src="${q.img || ""}" alt="صورة منتج حقيقية" loading="eager"><div class="brand-blur" aria-hidden="true"></div></div>`;
  } else if(q.m === "playerguess") {
    imageBox.style.display = "block";
    imageBox.innerHTML = `<div class="real-player-photo"><img id="visualImage" src="${q.img || ""}" alt="صورة لاعب كاملة" loading="eager"></div>`;
  } else if(q.m === "celebrityguess") {
    imageBox.style.display = "block";
    imageBox.innerHTML = `<div class="real-celebrity-photo"><img id="visualImage" src="${q.img || ""}" alt="صورة المشهور" loading="eager"></div>`;
  } else if(q.m === "youtuberguess") {
    imageBox.style.display = "block";
    imageBox.innerHTML = `<div class="real-youtuber-photo"><img id="visualImage" src="${q.img || ""}" alt="صورة اليوتيوبر" loading="eager"></div>`;
  } else if(q.m === "flagguess") {
    imageBox.style.display = "block";
    const flag = (q.q || "").match(/^([^ ]+)/)?.[1] || "🏳️";
    imageBox.innerHTML = `<div class="real-flag-photo"><div class="flag-emoji" aria-label="العلم">${flag}</div></div>`;
  } else {
    imageBox.style.display = "none";
    imageBox.innerHTML = "";
  }
  const visual = document.getElementById("visualImage");
  const setVisual = (url) => {
    if(url && visual && document.getElementById("visualImage") === visual){
      visual.src = url;
      visual.dataset.loadedFromWiki = "1";
    }
  };
  const loadWikiImage = (title) => {
    if(!title || !visual) return Promise.resolve();
    return fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const url = data?.thumbnail?.source || data?.originalimage?.source;
        if(url){ setVisual(url); return true; }
        throw new Error("no-rest-image");
      })
      .catch(() => fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(title)}&gsrnamespace=0&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=1000&format=json&origin=*`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          const pages = data?.query?.pages || {};
          const page = Object.values(pages)[0];
          const url = page?.thumbnail?.source;
          if(url){ setVisual(url); return true; }
          return false;
        }).catch(()=>false));
  };

  if(visual){
    let triedFallback = false;
    visual.onerror = () => {
      if(triedFallback) return;
      triedFallback = true;
      loadWikiImage(q.wiki || q.creator || (q.m === "imageguess" ? q.a?.[q.x] : "") || "").then(ok=>{
        if(!ok){
          // إذا لم نجد صورة للمشهور/اللاعب/اليوتيوبر، نوضح السبب ثم نتخطى السؤال فورًا.
          // نحذف السؤال الفاشل من الجولة حتى لا يعود مرة أخرى.
          const failedQuestion = round[current];
          if (failedQuestion && (failedQuestion.m === "celebrityguess" || failedQuestion.m === "playerguess" || failedQuestion.m === "youtuberguess")) {
            round.splice(current, 1);
            const skipMsg = el("answerMsg");
            if(skipMsg){
              skipMsg.textContent = "⚠️ تم تخطي هذا السؤال لأن صورة الشخص لم تُحمّل، لذلك انتقلنا للسؤال التالي.";
              skipMsg.style.color = "#fbbf24";
            }
            setTimeout(() => {
              if (current >= round.length) {
                finishGame();
              } else {
                renderQuestion();
              }
            }, 900);
            return;
          }
          visual.style.display = "none";
          const box = visual.parentElement;
          if(box) box.classList.add("image-unavailable");
        }
      });
    };
    if(q.wiki) loadWikiImage(q.wiki).then(ok=>{
      if(!ok && visual && !visual.src) visual.dispatchEvent(new Event("error"));
    });
  }

  el("questionText").textContent = q.q;
  el("scoreNow").textContent = friendMode ? friendScores[friendPlayers[friendTurn]] : score;

  let hintInfo = document.getElementById("hintInfo");
  if(!hintInfo){
    hintInfo = document.createElement("div");
    hintInfo.id = "hintInfo";
    hintInfo.style.cssText = "margin:12px auto 0;max-width:720px;text-align:center;color:#bca8ff;font-size:14px";
    const quizBox = document.querySelector(".quiz-box");
    if(quizBox) quizBox.parentNode.insertBefore(hintInfo, quizBox);
  }
  hintInfo.textContent = friendMode
    ? `💡 كل 5 إجابات صحيحة تمنحك تلميحًا إضافيًا. لديك الآن ${hintCharges} تلميح.`
    : `💡 كل 5 إجابات صحيحة تمنحك تلميحًا إضافيًا. لديك الآن ${hintCharges} تلميح.`;

  const diff = q.d === "سهل" ? "🌱 سهل" : q.d === "متوسط" ? "⚡ متوسط" : "🔥 صعب";
  // qCat is used by this HTML for the visible category; keep the question itself visible regardless.

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

  const limit = q.m === "speed"
    ? 7
    : q.m === "tf"
      ? 8
      : (q.m === "imageguess" || q.m === "logotruth" || q.m === "playerguess" || q.m === "celebrityguess" || q.m === "youtuberguess")
        ? 18
      : q.m === "flagguess" ? 15
      : q.m === "memory" ? 15
      : q.m === "math" ? 12
      : q.d === "صعب" ? 20 : q.d === "متوسط" ? 16 : 13;

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
  // التلميح يكشف الإجابة كاملة، ويضع علامة ✖ بجانب كل الخيارات الخاطئة.
  wrong.forEach(({b})=>{
    b.disabled = true;
    if(!b.textContent.includes("✖")) b.textContent += "  ✖";
  });
  const msg = el("answerMsg");
  if(msg){
    const correct = String(q.a[q.x] ?? "");
    msg.textContent = `💡 التلميح: الإجابة الصحيحة هي «${correct}» — الخيارات الخاطئة عليها ✖`;
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
    const base = q.d === "صعب" ? 300 : q.d === "متوسط" ? 200 : 100;
    const bonus = Math.max(0,timeLeft*5);
    earned = base + bonus;
    if(friendMode){
      const player = friendPlayers[friendTurn];
      friendScores[player] += earned;
      friendCorrectCounts[player] = (friendCorrectCounts[player] || 0) + 1;
      el("scoreNow").textContent = friendScores[player];
      if(friendCorrectCounts[player] % 5 === 0){
        hintCharges++;
        updateHintButton();
        msg.textContent = `صحيح! +${earned} نقطة — حصل ${player} على تلميح جديد بعد 5 إجابات صحيحة.`;
      }else{
        msg.textContent = `صحيح! +${earned} نقطة`;
      }
    }else{
      score += earned;
      correctCount++; window.m5kRoundCorrect=(window.m5kRoundCorrect||0)+1;
      el("scoreNow").textContent = score;
      if(correctCount % 5 === 0){
        hintCharges++;
        updateHintButton();
        msg.textContent = `صحيح! +${earned} نقطة — حصلت على تلميح جديد بعد 5 إجابات صحيحة.`;
      }else{
        msg.textContent = `صحيح! +${earned} نقطة`;
      }
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

function getToken(){ return localStorage.getItem('m5kToken')||''; }
function getUser(){ try{ return JSON.parse(localStorage.getItem('m5kUser')||'null'); }catch{ return null; } }
function setSession(token,user){
  localStorage.setItem('m5kToken',token);
  if(user){ localStorage.setItem('m5kUser',JSON.stringify(user)); localStorage.setItem('m5kPlayerName',user.username); }
  setTimeout(renderHeaderAccount,0);
}
function clearSession(){ localStorage.removeItem('m5kToken'); localStorage.removeItem('m5kUser'); renderHeaderAccount(); }

async function saveResultToBackend(modeName, finalScore, correctAnswers, totalQuestions){
  const token=getToken();
  if(!token) return {saved:false,reason:'guest'};
  try{
    const r=await fetch('/api/results',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({mode:modeName,score:finalScore,correctAnswers,totalQuestions})});
    let data={}; try{ data=await r.json(); }catch{}
    if(r.status===401){ clearSession(); updateAccountUI(); return {saved:false,reason:'expired'}; }
    if(!r.ok) return {saved:false,reason:'error',message:data.error};
    if(data.user){ localStorage.setItem('m5kUser',JSON.stringify(data.user)); updateAccountUI(); }
    if(data.rank) window.m5kRank=data.rank;
    return {saved:true,user:data.user,rank:data.rank};
  }catch(e){ return {saved:false,reason:'network'}; }
}
function setSaveNote(text,color){
  let n=el('saveNote');
  if(!n){ const box=el('resultText'); if(!box) return; n=document.createElement('p'); n.id='saveNote'; n.className='save-note'; box.insertAdjacentElement('afterend',n); }
  n.textContent=text; n.style.color=color||'#c5aaff'; n.style.display=text?'block':'none';
  const b=el('saveNoteBtn'); if(b) b.remove();
  if(text && /سجّل|انتهت/.test(text)){ const btn=document.createElement('button'); btn.id='saveNoteBtn'; btn.className='secondary'; btn.textContent='تسجيل الدخول'; btn.onclick=()=>openAuth('login'); n.insertAdjacentElement('afterend',btn); }
}
async function afterSave(promise){
  if(!getToken()){ setSaveNote('سجّل دخولك أو أنشئ حسابًا لتُحفظ نتائجك وتظهر في المتصدرين 🏆','#c5aaff'); return; }
  setSaveNote('جاري حفظ نتيجتك...','#c5aaff');
  const r=await promise;
  if(r.saved) setSaveNote('تم حفظ نتيجتك في حسابك'+(r.rank?` — ترتيبك العالمي: ${r.rank}`:'')+' 🏆','#4ade80');
  else if(r.reason==='expired') setSaveNote('انتهت جلستك، سجّل الدخول من جديد لحفظ نتائجك القادمة.','#fbbf24');
  else if(r.reason==='guest') setSaveNote('سجّل دخولك لحفظ نتائجك في المتصدرين 🏆','#c5aaff');
  else setSaveNote('تعذر حفظ النتيجة الآن'+(r.message?': '+r.message:'.'),'#fb7185');
}
async function onlineSavedNote(ranking){
  if(!getToken()){ setSaveNote('سجّل دخولك لتُحفظ نتائج تحدي الأصدقاء في حسابك 🏆','#c5aaff'); return; }
  if((ranking||[]).length<2){ setSaveNote('',''); return; }
  setSaveNote('تم حفظ نتيجتك في حسابك 🏆','#4ade80');
  setTimeout(()=>restoreSession(),1200);
}

function finishGame(){
  clearInterval(timer);
  if(friendMode){
    stopFriendsHeartbeat();
    leaveFriendsHeartbeat();
    const ranking = Object.entries(friendScores).sort((a,b)=>b[1]-a[1]);
    const winner = ranking[0];
    const history = JSON.parse(localStorage.getItem("m5kHistory") || "[]");
    ranking.forEach(([player, playerScore]) => history.unshift({name:player, mode:"friends", score:playerScore, date:new Date().toLocaleDateString("ar-DZ"),dayKey:new Date().toISOString().slice(0,10),dayKey:new Date().toISOString().slice(0,10)}));
    localStorage.setItem("m5kHistory", JSON.stringify(history.slice(0,100)));
    if(typeof renderM5KRewards==='function') renderM5KRewards();
    const acct=getUser(); const mine=acct && ranking.find(([n])=>n.toLowerCase()===String(acct.username).toLowerCase());
    const savedP = mine ? saveResultToBackend('friends',mine[1],friendCorrectCounts[mine[0]]||0,round.length) : Promise.resolve({saved:false,reason:getToken()?'error':'guest',message:'سجّل اللعب باسم حسابك لتُحفظ النتيجة.'});
    el("resultTitle").textContent = "🏆 انتهى تحدي الأصدقاء!";
    el("resultText").innerHTML = `الفائز: <b>${escapeHtml(winner[0])}</b><br>` + ranking.map((r,i)=>`${i+1}. ${escapeHtml(r[0])} — ${r[1]} نقطة`).join("<br>");
    el("resultScore").textContent = winner[1]; show("result",true); afterSave(savedP); return;
  }
  const name = localStorage.getItem("m5kPlayerName") || "لاعب";
  const modeName = modes[selectedMode]?.name || "اللعبة";
  const history = JSON.parse(localStorage.getItem("m5kHistory") || "[]");
  history.unshift({name,mode:selectedMode,score,correctAnswers:Number(window.m5kRoundCorrect||0),date:new Date().toLocaleDateString("ar-DZ"),dayKey:new Date().toISOString().slice(0,10),dayKey:new Date().toISOString().slice(0,10)});
  localStorage.setItem("m5kHistory",JSON.stringify(history.slice(0,50)));
  if(typeof renderM5KRewards==='function') renderM5KRewards();
  const best = Number(localStorage.getItem("m5kBest") || 0); if(score > best) localStorage.setItem("m5kBest",String(score));
  const correctAnswers = Number(window.m5kRoundCorrect || 0);
  const savedP = saveResultToBackend(selectedMode,score,correctAnswers,round.length);
  el("resultTitle").textContent="🏆 انتهت اللعبة!";
  el("resultText").textContent=`${name}، نتيجتك في ${modeName} هي ${score} نقطة.`;
  el("resultScore").textContent=score; show("result",true); afterSave(savedP);
}

function playAgain(){
  if(friendMode){
    friendTurn=0; friendScores={}; friendCorrectCounts={}; friendPlayers.forEach(n=>{friendScores[n]=0;friendCorrectCounts[n]=0;}); current=0; hintCharges=1; correctCount=0; answered=false; round=shuffle(round); show("quiz"); renderQuestion();
  }else{ startGame(); }
}

function updateStats(){
  const history = JSON.parse(localStorage.getItem("m5kHistory") || "[]");
  const games = history.length;
  const points = history.reduce((sum, x) => sum + (Number(x.score) || 0), 0);
  const best = Math.max(0, ...history.map(x => Number(x.score) || 0));

  if(el("profileGames")) el("profileGames").textContent = games;
  if(el("profileWins")) el("profileWins").textContent = history.filter(x => Number(x.score) > 0).length;
  if(el("profilePoints")) el("profilePoints").textContent = points;
  if(el("profileTokens")) el("profileTokens").textContent = hintCharges;
  if(el("bestScore")) el("bestScore").textContent = best;
}

let leaderMode='';
function leaderRow(r,i,me){
  const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':String(i+1);
  const mine=me&&String(r.username).toLowerCase()===String(me.username).toLowerCase();
  return `<div class="leader ${i===0?'first':''} ${i===1?'second':''} ${i===2?'third':''} ${mine?'me':''}"><b class="leader-rank">${medal}</b><i>${escapeHtml(String(r.username||'ل').charAt(0))}</i><span>${escapeHtml(r.username)}${mine?' <small>(أنت)</small>':''}</span><strong>${Number(r.best_score)||0}</strong></div>`;
}
async function updateLeaders(){
  const board=document.querySelector('.leaderboard'); if(!board) return;
  const head=document.querySelector('#leaders .center-head');
  if(head && !el('leaderMode')){
    const sel=document.createElement('select'); sel.id='leaderMode'; sel.className='leader-filter';
    sel.innerHTML='<option value="">🏆 كل الألعاب</option>'+Object.entries(modes).filter(([k])=>k!=='mixed').map(([k,m])=>`<option value="${k}">${escapeHtml(m.name)}</option>`).join('')+'<option value="friends-online">👥 تحدي الأصدقاء أونلاين</option>';
    sel.onchange=()=>{leaderMode=sel.value;updateLeaders();};
    head.appendChild(sel);
  }
  const me=getUser();
  try{
    const r=await fetch('/api/leaderboard?limit=50'+(leaderMode?'&mode='+encodeURIComponent(leaderMode):''),{cache:'no-store'});
    if(!r.ok) throw new Error();
    const rows=(await r.json()).players||[];
    let html=rows.length?rows.map((x,i)=>leaderRow(x,i,me)).join(''):'<p>لا توجد نتائج بعد'+(leaderMode?' في هذه اللعبة':'')+'. '+(getToken()?'العب أول جولة!':'سجّل حسابًا والعب أول جولة!')+'</p>';
    if(getToken() && !leaderMode && window.m5kRank && me && !rows.some(x=>String(x.username).toLowerCase()===String(me.username).toLowerCase()))
      html+=`<p class="my-rank">ترتيبك العالمي: <b>${window.m5kRank}</b> — أفضل نتيجة: <b>${Number(me.best_score)||0}</b></p>`;
    if(!getToken()) html+='<p class="my-rank">سجّل دخولك لتظهر نتيجتك هنا وتبقى محفوظة في حسابك.</p>';
    board.innerHTML=html;
  }catch(e){
    const history=JSON.parse(localStorage.getItem('m5kHistory')||'[]'); const best={}; history.forEach(x=>best[x.name]=Math.max(best[x.name]||0,Number(x.score)||0));
    const rows=Object.entries(best).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([username,best_score])=>({username,best_score}));
    board.innerHTML='<p class="my-rank">⚠️ تعذر الاتصال بالسيرفر، هذه نتائجك المحفوظة على جهازك فقط.</p>'+(rows.length?rows.map((x,i)=>leaderRow(x,i,null)).join(''):'<p>العب أول جولة لتظهر نتائجك هنا.</p>');
  }
}

let authMode='login';
function openAuth(mode='login'){authMode=mode; show('auth'); renderAuth();}
function toggleAuthMode(){authMode=authMode==='login'?'register':'login';renderAuth();}
function renderAuth(){
  const reg=authMode==='register';
  if(el('authTitle')) el('authTitle').textContent=reg?'إنشاء حساب جديد':'مرحباً بعودتك';
  if(el('authSubtitle')) el('authSubtitle').textContent=reg?'أنشئ حسابك وابدأ بحفظ نتائجك وإنجازاتك.':'سجّل الدخول لمتابعة ألعابك وحفظ تقدمك.';
  el('authLoginTab')?.classList.toggle('active',!reg);
  el('authRegisterTab')?.classList.toggle('active',reg);
  if(el('authUsernameWrap')) el('authUsernameWrap').style.display=reg?'block':'none';
  if(el('authLoginLabel')) el('authLoginLabel').textContent=reg?'البريد الإلكتروني':'اسم المستخدم أو البريد الإلكتروني';
  if(el('authEmail')) el('authEmail').placeholder=reg?'example@gmail.com':'TOUFIK_GAMER';
  if(el('authEmail')) el('authEmail').type=reg?'email':'text';
  if(el('authPassword')) { el('authPassword').placeholder='10+ characters'; el('authPassword').minLength=10; }
  if(el('authSubmit')) el('authSubmit').textContent=reg?'إنشاء الحساب':'تسجيل الدخول';
  if(el('authSwitch')) el('authSwitch').textContent=reg?'لديك حساب؟ سجّل الدخول':'ليس لديك حساب؟ سجل الآن';
  if(el('authMsg')) el('authMsg').textContent='';
}
async function submitAuth(){
  const msg=el('authMsg'); msg.style.color=''; msg.textContent='جاري المعالجة...';
  const body={login:el('authEmail').value.trim(),email:el('authEmail').value.trim(),password:el('authPassword').value};
  if(authMode==='register') body.username=el('authUsername').value.trim();
  try{
    const r=await fetch('/api/auth/'+(authMode==='register'?'register':'login'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    let data={}; try{data=await r.json();}catch{}
    if(!r.ok) throw new Error(data.error||'تعذر الاتصال بالخادم. تأكد أن Backend يعمل.');
    setSession(data.token,data.user); updateAccountUI(); if(el('authPassword')) el('authPassword').value=''; msg.textContent='تم بنجاح ✅'; setTimeout(()=>show('home'),500);
  }catch(e){msg.textContent=(e instanceof TypeError?'تعذر تنفيذ العملية حاليًا. حاول مرة أخرى.':e.message);msg.style.color='#fb7185';}
}
function updateAccountUI(){
  const token=getToken(); const status=el('accountStatus'), btn=document.querySelector('.account-btn');
  if(token){
    const u=getUser(); const n=(u&&u.username)||localStorage.getItem('m5kPlayerName')||'لاعب';
    if(status) status.textContent='👤 '+n+(u&&u.best_score?' · 🏆 '+u.best_score:'');
    if(btn){btn.textContent='تسجيل الخروج';btn.onclick=logout;}
  }else{
    if(status) status.textContent='زائر';
    if(btn){btn.textContent='تسجيل الدخول';btn.onclick=()=>openAuth('login');}
  }
}
function logout(){
  clearSession(); updateAccountUI();
  if(onlineFriendSocket){ try{ onlineFriendSocket.disconnect(); }catch(e){} onlineFriendSocket=null; }
  if(el('leaders')?.classList.contains('active')) updateLeaders();
}
// Re-validate the saved login every time the site opens, so the account stays connected (or is cleanly reset if expired).
async function restoreSession(){
  const token=getToken(); if(!token){ updateAccountUI(); return; }
  try{
    const r=await fetch('/api/me',{headers:{'Authorization':'Bearer '+token},cache:'no-store'});
    if(r.status===401){ clearSession(); updateAccountUI(); return; }
    if(!r.ok) throw new Error();
    const data=await r.json();
    localStorage.setItem('m5kUser',JSON.stringify(data.user)); localStorage.setItem('m5kPlayerName',data.user.username); if(data.user.preferences){localStorage.setItem('m5kPreferences',JSON.stringify(data.user.preferences));applyPreferences(data.user.preferences);}
    window.m5kRank=data.rank||null;
  }catch(e){ /* offline: keep the saved session */ }
  updateAccountUI();
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[ch]));
}

const DEFAULT_PREFS = { theme: 'dark', language: 'ar' };
function currentPreferences(){
 const u=getUser();let prefs=u?.preferences||{};if(typeof prefs==='string'){try{prefs=JSON.parse(prefs)}catch{prefs={}}}
 return Object.assign({},DEFAULT_PREFS,prefs);
}
function applyPreferences(prefs){
 prefs=Object.assign({},DEFAULT_PREFS,prefs||{});document.documentElement.dataset.theme=prefs.theme;document.documentElement.lang=prefs.language;document.documentElement.dir=prefs.language==='ar'?'rtl':'ltr';
 const colors={dark:'#0b0b12',midnight:'#050914',light:'#f4f6fb'},meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=colors[prefs.theme]||colors.dark;
 const theme=document.getElementById('themeSetting'),lang=document.getElementById('languageSetting');if(theme)theme.value=prefs.theme;if(lang)lang.value=prefs.language;
 const nav=document.querySelectorAll('.topbar nav button');const labels=prefs.language==='en'?['Home','Games','Leaderboard','Contact','Social']:prefs.language==='fr'?['Accueil','Jeux','Classement','Contact','Réseaux']:['الرئيسية','الألعاب','المتصدرون','تواصل معنا','حساباتي'];nav.forEach((b,i)=>{if(labels[i])b.textContent=labels[i];});
 document.body.classList.toggle('theme-light',prefs.theme==='light');document.body.classList.toggle('theme-midnight',prefs.theme==='midnight');
}
function loadPreferencesUI(){applyPreferences(currentPreferences());}
async function savePreferences(){
 const msg=document.getElementById('settingsMessage'),token=getToken();
 const prefs={theme:document.getElementById('themeSetting')?.value||'dark',language:document.getElementById('languageSetting')?.value||'ar'};
 applyPreferences(prefs);
 if(!token){if(msg)msg.textContent='سجّل الدخول أولاً حتى نحفظ إعداداتك في حسابك عبر الإنترنت.';show('settings');return;}
 if(msg)msg.textContent='جارٍ حفظ الإعدادات في حسابك…';
 try{const r=await fetch('/api/me/preferences',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify(prefs)});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'تعذر الحفظ');if(d.user){localStorage.setItem('m5kUser',JSON.stringify(d.user));}else{const u=getUser()||{};u.preferences=prefs;localStorage.setItem('m5kUser',JSON.stringify(u));}if(msg)msg.textContent='تم حفظ إعداداتك على حسابك بنجاح.';
 }catch(e){if(msg)msg.textContent='تعذر حفظ الإعدادات على الخادم. تحقق من الاتصال ثم حاول مجددًا.';}
}
function renderAccountProfile(){const u=getUser(),logged=!!getToken(),set=(id,v)=>{const n=document.getElementById(id);if(n)n.textContent=v;};set('profileUsername',logged&&u?u.username:'زائر');const av=el('profileAvatar'),photo=logged&&u&&u.preferences&&u.preferences.avatar;if(av){av.textContent=photo?'':(logged&&u?String(u.username||'M').charAt(0).toUpperCase():'M');av.style.backgroundImage=photo?`url(\"${photo}\")`:'';av.classList.toggle('has-photo',!!photo);}const upload=el('avatarFileInput');if(upload)upload.disabled=!logged;set('profileEmail',logged&&u?(u.email||''):'سجّل الدخول لمزامنة حسابك ونتائجك.');set('accountGames',logged&&u?Number(u.games_played)||0:0);set('accountBest',logged&&u?Number(u.best_score)||0:0);set('accountPoints',logged&&u?Number(u.total_points)||0:0);const b=document.getElementById('profileLogin');if(b)b.style.display=logged?'none':'inline-flex';}
async function uploadAvatar(event){const file=event.target.files&&event.target.files[0],msg=el('avatarUploadMsg');if(!file)return;if(!getToken()){if(msg)msg.textContent='سجّل الدخول أولًا لرفع صورة حسابك.';return;}if(!/^image\/(png|jpeg|webp|gif)$/.test(file.type)||file.size>300*1024){if(msg)msg.textContent='اختر صورة PNG أو JPG أو WEBP أو GIF بحجم أقل من 300KB.';event.target.value='';return;}try{if(msg)msg.textContent='جارٍ تجهيز الصورة…';const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});const token=getToken(),r=await fetch('/api/me/avatar',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({avatar:data})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'تعذر حفظ الصورة');localStorage.setItem('m5kUser',JSON.stringify(d.user));renderAccountProfile();renderHeaderAccount();if(msg)msg.textContent='تم تحديث صورتك الشخصية بنجاح ✅';}catch(e){if(msg)msg.textContent=e.message||'تعذر رفع الصورة. حاول مرة أخرى.';}finally{event.target.value='';}}

window.addEventListener('beforeunload', event => {
  if(el('quiz')?.classList.contains('active') && !el('exitGameModal')?.classList.contains('active')){event.preventDefault();event.returnValue='هل تريد مغادرة اللعبة؟';return event.returnValue;}
});

document.addEventListener("DOMContentLoaded", () => {
  renderHeaderAccount();
  const saved = localStorage.getItem("m5kPlayerName") || "";
  if(el("playerName")) el("playerName").value = saved;
  updateHintButton();
  applyPreferences(currentPreferences());
  updateAccountUI();
  restoreSession();
  refreshFriendsLive();
  setInterval(refreshFriendsLive, 3000);
  window.addEventListener("beforeunload", leaveFriendsHeartbeat);
});

/* M5K Online Friends — Socket.IO multiplayer */
let onlineFriendMode = false;
let onlineFriendRoom = '';
let onlineFriendHost = false;
let onlineFriendSocket = null;
let onlineFriendAnswered = false;
let onlineFriendTimer = null;
let onlineFriendTimeLeft = 15;

function onlineSocketReady(){
  if(typeof io === 'undefined'){
    const msg=el('friendOnlineMsg'); if(msg && new URLSearchParams(location.search).get('owner')==='1') msg.textContent='⚠️ شغّل الموقع عبر http://localhost:3000 حتى يعمل اللعب أونلاين.';
    return false;
  }
  if(!onlineFriendSocket) onlineFriendSocket=io({auth:cb=>cb({token:getToken()})});
  return true;
}
function onlineMsg(text,color){
  const a=el('friendOnlineMsg'),b=el('lobbyMsg');
  [a,b].forEach(x=>{if(x){x.textContent=text;x.style.color=color||'#c5aaff';}});
}
function friendOnlineName(){
  return String(el('friendOnlineName')?.value||localStorage.getItem('m5kPlayerName')||'لاعب').trim().slice(0,20)||'لاعب';
}
function makeRoomSocket(){
  if(!onlineSocketReady()) return null;
  if(onlineFriendSocket.connected) return onlineFriendSocket;
  return onlineFriendSocket;
}
function setupOnlineSocketHandlers(){
  if(!onlineFriendSocket || onlineFriendSocket.__m5kBound) return;
  onlineFriendSocket.__m5kBound=true;
  onlineFriendSocket.on('room:created',data=>{
    onlineFriendRoom=data.code; onlineFriendHost=true; onlineFriendMode=true;
    localStorage.setItem('m5kPlayerName',data.name||friendOnlineName());
    el('gameCode').textContent=data.code; el('lobbyTitle').textContent='تحدي الأصدقاء أونلاين';
    el('lobbySub').textContent='شارك الكود مع أصدقائك وانتظر دخولهم.';
    el('lobbyHostControls').style.display='block'; show('lobby'); renderOnlineLobby(data);
  });
  onlineFriendSocket.on('room:joined',data=>{
    onlineFriendRoom=data.code; onlineFriendHost=!!data.host; onlineFriendMode=true;
    localStorage.setItem('m5kPlayerName',data.name||friendOnlineName());
    el('gameCode').textContent=data.code; el('lobbyTitle').textContent='تحدي الأصدقاء أونلاين';
    el('lobbySub').textContent=data.host?'شارك الكود مع أصدقائك وانتظر دخولهم.':'انتظرت بدء صاحب الغرفة للعبة.';
    el('lobbyHostControls').style.display=data.host?'block':'none'; show('lobby'); renderOnlineLobby(data);
  });
  onlineFriendSocket.on('room:update',data=>{ if(data.code!==onlineFriendRoom) return; onlineFriendHost=!!data.host; const hc=el('lobbyHostControls'); if(hc) hc.style.display=data.host?'block':'none'; renderOnlineLobby(data); });
  onlineFriendSocket.on('room:error',data=>onlineMsg('❌ '+(data.message||'حدث خطأ.'),'#fb7185'));
  onlineFriendSocket.on('room:started',data=>{
    onlineFriendMode=true; onlineFriendAnswered=false; friendPlayers=(data.players||[]).map(p=>p.name);
    friendScores={}; (data.players||[]).forEach(p=>friendScores[p.name]=p.score||0);
    hintCharges=1; correctCount=0; score=0; show('quiz');
  });
  onlineFriendSocket.on('room:question',data=>{
    onlineFriendMode=true; onlineFriendAnswered=false; answered=false; clearInterval(onlineFriendTimer);
    round=[data.question]; current=0; onlineFriendTimeLeft=Number(data.time)||15; timeLeft=onlineFriendTimeLeft;
    friendPlayers=(data.players||[]).map(p=>p.name); friendScores={}; (data.players||[]).forEach(p=>friendScores[p.name]=p.score||0);
    renderOnlineQuestion(data.question,data.index,data.total,data.players);
    onlineFriendTimer=setInterval(()=>{onlineFriendTimeLeft--;timeLeft=onlineFriendTimeLeft;if(el('timer'))el('timer').textContent=Math.max(0,onlineFriendTimeLeft);if(onlineFriendTimeLeft<=0){clearInterval(onlineFriendTimer);if(!onlineFriendAnswered) submitAnswer(-1,null);}},1000);
  });
  onlineFriendSocket.on('room:questionResult',data=>{
    clearInterval(onlineFriendTimer); onlineFriendTimeLeft=0;
    const buttons=document.querySelectorAll('.answer-btn');
    buttons.forEach((b,i)=>{b.disabled=true;if(i===data.correctIndex)b.classList.add('correct');if(data.answers && data.answers[onlineFriendSocket.id]===i && i!==data.correctIndex)b.classList.add('wrong');});
    const me=(data.players||[]).find(p=>p.id===onlineFriendSocket.id);
    if(me){ friendScores[me.name]=me.score; if(el('scoreNow'))el('scoreNow').textContent=me.score; }
    const msg=el('answerMsg'); if(msg){msg.textContent=data.answers&&data.answers[onlineFriendSocket.id]===data.correctIndex?'✅ إجابة صحيحة!':'❌ الإجابة الصحيحة ظهرت للجميع.';msg.style.color=data.answers&&data.answers[onlineFriendSocket.id]===data.correctIndex?'#4ade80':'#fb7185';}
  });
  onlineFriendSocket.on('room:finished',data=>{
    onlineFriendMode=false; clearInterval(onlineFriendTimer);
    const ranking=data.players||[]; const winner=ranking[0];
    el('resultTitle').textContent='🏆 انتهى تحدي الأصدقاء!';
    el('resultText').innerHTML=(winner?`الفائز: <b>${escapeHtml(winner.name)}</b><br>`:'')+ranking.map((p,i)=>`${i+1}. ${escapeHtml(p.name)} — ${Number(p.score)||0} نقطة`).join('<br>');
    el('resultScore').textContent=winner?winner.score:0; show('result',true); onlineSavedNote(ranking);
  });
  onlineFriendSocket.on('disconnect',()=>{ if(onlineFriendMode) onlineMsg('⚠️ انقطع الاتصال بالسيرفر. حاول الدخول للغرفة من جديد.','#fb7185'); });
}
function createOnlineFriendRoom(){
  if(!onlineSocketReady()) return;
  setupOnlineSocketHandlers();
  const name=friendOnlineName(), qCount=Number(el('friendQCount')?.value)||15;
  localStorage.setItem('m5kPlayerName',name);
  onlineFriendSocket.emit('room:create',{name,qCount});
}
function joinOnlineFriendRoom(){
  if(!onlineSocketReady()) return;
  setupOnlineSocketHandlers();
  const name=friendOnlineName(), code=String(el('friendRoomCode')?.value||'').trim().toUpperCase();
  if(!/^[A-Z0-9]{5,6}$/.test(code)){onlineMsg('⚠️ اكتب كود غرفة صحيحًا.','#fb7185');return;}
  localStorage.setItem('m5kPlayerName',name); onlineFriendSocket.emit('room:join',{code,name});
}
function renderOnlineLobby(data){
  const list=el('onlinePlayerList'); if(!list)return;
  const players=data.players||[];
  list.innerHTML=players.map(p=>`<div class="player"><i>${escapeHtml(String(p.name||'ل').charAt(0))}</i><span>${escapeHtml(p.name)}</span><b>${p.host?'HOST':'متصل'} <span class="room-live-dot"></span></b></div>`).join('')||'<div class="player">لا يوجد لاعبون بعد.</div>';
  const msg=el('lobbyMsg'); if(msg) msg.textContent=`${players.length}/6 لاعبين داخل الغرفة — ${data.host?'أنت المضيف':'انتظر المضيف لبدء اللعبة'}`;
}
function startOnlineFriendGame(){
  if(!onlineFriendSocket || !onlineFriendRoom || !onlineFriendHost){onlineMsg('⚠️ أنشئ غرفة أولًا.','#fb7185');return;}
  const count=Number(el('onlineQCount')?.value)||15;
  const pool=shuffle(questions.filter(q=>q.m==='quiz'||q.m==='mixed'));
  const seen=new Set(); const qs=pool.filter(q=>{const k=q.q;if(seen.has(k))return false;seen.add(k);return true;}).slice(0,count).map(q=>({m:q.m,d:q.d,q:q.q,a:q.a,x:q.x}));
  if(qs.length<1){onlineMsg('⚠️ لا توجد أسئلة كافية.','#fb7185');return;}
  onlineFriendSocket.emit('room:start',{code:onlineFriendRoom,questions:qs});
}
function renderOnlineQuestion(q,index,total,players){
  const cat=el('qCat'); if(cat) cat.textContent='👥 تحدي الأصدقاء أونلاين';
  if(el('qNumber'))el('qNumber').textContent=`السؤال ${index+1} / ${total}`;
  if(el('questionText'))el('questionText').textContent=q.q||'';
  if(el('scoreNow')){const me=(players||[]).find(p=>p.id===onlineFriendSocket?.id);el('scoreNow').textContent=me?me.score:0;}
  if(el('timer'))el('timer').textContent=onlineFriendTimeLeft;
  const answers=el('answers'); if(!answers)return;
  answers.innerHTML='';
  (q.a||[]).forEach((text,i)=>{const b=document.createElement('button');b.className='answer-btn';b.textContent=text;b.onclick=()=>submitAnswer(i,b);answers.appendChild(b);});
  const msg=el('answerMsg');if(msg){msg.textContent=`👥 ${players?.length||0} لاعبين — جاوب بسرعة!`;msg.style.color='#c5aaff';}
}
function submitAnswer(choice,button){
  if(onlineFriendMode){
    if(onlineFriendAnswered)return; onlineFriendAnswered=true; answered=true; clearInterval(onlineFriendTimer);
    document.querySelectorAll('.answer-btn').forEach(b=>b.disabled=true);
    if(onlineFriendSocket && onlineFriendRoom) onlineFriendSocket.emit('room:answer',{code:onlineFriendRoom,choice:choice<0?-1:choice});
    if(el('answerMsg')){el('answerMsg').textContent=choice<0?'⏰ انتهى الوقت — تم إرسال إجابتك.':'⏳ تم إرسال إجابتك، انتظر نتيجة السؤال...';el('answerMsg').style.color='#c5aaff';}
    return;
  }
  if(answered) return;
  answered=true; clearInterval(timer);
  const q=round[current], correct=choice===q.x, buttons=document.querySelectorAll('.answer-btn');
  buttons.forEach((b,i)=>{b.disabled=true;if(i===q.x)b.classList.add('correct');if(i===choice&&!correct)b.classList.add('wrong');});
  const msg=el('answerMsg');let earned=0;
  if(correct){const base=q.d==='صعب'?300:q.d==='متوسط'?200:100;const bonus=Math.max(0,timeLeft*5);earned=base+bonus;
    if(friendMode){const player=friendPlayers[friendTurn];friendScores[player]+=earned;friendCorrectCounts[player]=(friendCorrectCounts[player]||0)+1;el('scoreNow').textContent=friendScores[player];if(friendCorrectCounts[player]%5===0){hintCharges++;updateHintButton();msg.textContent=`صحيح! +${earned} نقطة — حصل ${player} على تلميح جديد بعد 5 إجابات صحيحة.`;}else msg.textContent=`صحيح! +${earned} نقطة`;
    }else{score+=earned;correctCount++;window.m5kRoundCorrect=(window.m5kRoundCorrect||0)+1;el('scoreNow').textContent=score;if(correctCount%5===0){hintCharges++;updateHintButton();msg.textContent=`صحيح! +${earned} نقطة — حصلت على تلميح جديد بعد 5 إجابات صحيحة.`;}else msg.textContent=`صحيح! +${earned} نقطة`;}
    msg.style.color='#4ade80';
  }else{msg.textContent=choice===-1?'⏰ انتهى الوقت!':'❌ إجابة خاطئة';msg.style.color='#fb7185';}
  setTimeout(()=>{if(friendMode)friendTurn=(friendTurn+1)%friendPlayers.length;current++;renderQuestion();},900);
}
function startFriendsSetup(){
  friendMode=false; onlineFriendMode=false; onlineFriendRoom=''; onlineFriendHost=false; if(onlineSocketReady()) setupOnlineSocketHandlers();
  const saved=localStorage.getItem('m5kPlayerName')||''; if(el('friendOnlineName'))el('friendOnlineName').value=saved; if(el('friendRoomCode'))el('friendRoomCode').value=''; onlineMsg('أنشئ غرفة جديدة أو أدخل كود غرفة صديق.','#c5aaff'); show('friendsSetup');
}

// M5K v23: daily challenge and lightweight achievement tracker
const M5K_DAILY_MODES = [
  {mode:'quiz', title:'اختبار المعلومات العامة', desc:'كم معلومة تقدر تجمع اليوم؟ اختبر ثقافتك ونافس على أفضل نتيجة.'},
  {mode:'riddle', title:'لغز اليوم', desc:'فكّر بهدوء وجرّب تحل الألغاز قبل ما ينتهي الوقت.'},
  {mode:'emoji', title:'شفرة الإيموجي', desc:'حل الرموز وخمّن الكلمة أو الشخصية المخفية.'},
  {mode:'flagguess', title:'جولة حول العالم', desc:'اختبر معرفتك بالأعلام والدول.'},
  {mode:'pattern', title:'تحدي الأنماط', desc:'اكتشف الرقم التالي وأثبت سرعة ملاحظتك.'},
  {mode:'wordmix', title:'خبير الكلمات', desc:'رتّب الحروف واكتشف الكلمة الصحيحة.'},
  {mode:'memory', title:'اختبار الذاكرة', desc:'ركّز جيدًا وتذكّر التسلسل الصحيح.'}
];
function getM5KDailyChallenge(){
  const now=new Date();
  const key=`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
  const seed=key.split('-').reduce((n,v)=>n*31+Number(v),7);
  return {...M5K_DAILY_MODES[Math.abs(seed)%M5K_DAILY_MODES.length],key};
}
function playDailyChallenge(){const c=getM5KDailyChallenge();if(typeof chooseMode==='function')chooseMode(c.mode);}
function renderM5KRewards(){
  const title=document.getElementById('dailyChallengeTitle'),desc=document.getElementById('dailyChallengeDesc');
  const daily=getM5KDailyChallenge();if(title)title.textContent=daily.title;if(desc)desc.textContent=daily.desc;
  const grid=document.getElementById('achievementGrid');if(!grid)return;
  let history=[];try{history=JSON.parse(localStorage.getItem('m5kHistory')||'[]');if(!Array.isArray(history))history=[];}catch(_){history=[];}
  const rounds=history.length;const best=history.reduce((m,r)=>Math.max(m,Number(r.score)||0),0);
  const correct=history.reduce((n,r)=>n+(Number(r.correctAnswers)||0),0);
  const daySet=new Set(history.map(r=>r.dayKey).filter(Boolean));
  const today=new Date();const todayKey=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const yesterday=new Date(today);yesterday.setDate(yesterday.getDate()-1);const yKey=`${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;
  let streak=0, cursor=new Date(today);if(!daySet.has(todayKey))cursor=yesterday;
  while(daySet.has(`${cursor.getFullYear()}-${String(cursor.getMonth()+1).padStart(2,'0')}-${String(cursor.getDate()).padStart(2,'0')}`)&&streak<365){streak++;cursor.setDate(cursor.getDate()-1);}
  const streakNode=document.getElementById('streakCount');if(streakNode)streakNode.textContent=streak;
  const achievements=[
    {icon:'🎮',name:'أول خطوة',desc:'أكمل أول جولة لعب.',value:rounds,target:1,format:v=>`${Math.min(v,1)}/1`},
    {icon:'🔥',name:'لا توقف التحدي',desc:'أكمل 5 جولات لعب.',value:rounds,target:5,format:v=>`${Math.min(v,5)}/5`},
    {icon:'🏆',name:'صيّاد النقاط',desc:'حقق 1000 نقطة في جولة.',value:best,target:1000,format:v=>`${Math.min(v,1000)}/1000`},
    {icon:'🧠',name:'عقل سريع',desc:'أجب عن 10 أسئلة صحيحة في جولاتك.',value:correct,target:10,format:v=>`${Math.min(v,10)}/10`}
  ];
  grid.innerHTML=achievements.map(a=>`<article class="achievement-card ${a.value>=a.target?'unlocked':''}"><span>${a.icon}</span><div><b>${a.name}</b><p>${a.desc}</p></div><small>${a.value>=a.target?'تم الفتح ✓':a.format(a.value)}</small></article>`).join('');
  const note=document.getElementById('rewardsNote');if(note)note.textContent=getToken()?'تظهر هذه الإنجازات اعتمادًا على سجل اللعب في هذا المتصفح؛ نتائج الحساب تُحفظ على الخادم عند نجاح المزامنة.':'إنجازات الضيف تُحسب على هذا المتصفح. سجّل الدخول لحفظ نتائج اللعب في حسابك.';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderM5KRewards);else renderM5KRewards();


// Share a concise result card using native sharing when available.
async function shareGameResult(){
  const scoreText=document.getElementById('resultScore')?.textContent||'0';
  const title=document.getElementById('resultTitle')?.textContent||'نتيجتي في مِخّك';
  const text=`${title}\nحققت ${scoreText} نقطة في مِخّك! جرّب تتحداني 🎮`;
  try{if(navigator.share){await navigator.share({title:'نتيجتي في مِخّك',text,url:location.origin});return;}if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(`${text}\n${location.origin}`);alert('تم نسخ نتيجتك ورابط الموقع، شاركهما مع أصدقائك!');return;}prompt('انسخ نتيجتك وشاركها مع أصدقائك:',`${text}\n${location.origin}`);}catch(e){if(e&&e.name!=='AbortError')alert('تعذرت المشاركة الآن. حاول مرة أخرى.');}
}



/* ---------- GitHub OAuth return handler ---------- */
(function handleOAuthReturn(){
  if (!window.location.hash || !window.location.hash.startsWith('#oauth_')) return;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = params.get('oauth_token');
  const encodedUser = params.get('oauth_user');
  const error = params.get('oauth_error');
  // Remove sensitive data from the address bar immediately.
  history.replaceState(null, '', window.location.pathname + window.location.search);
  if (token && encodedUser) {
    try {
      const b64 = encodedUser.replace(/-/g,'+').replace(/_/g,'/');
      const user = JSON.parse(decodeURIComponent(escape(atob(b64 + '='.repeat((4 - b64.length % 4) % 4)))));
      setSession(token, user);
      updateAccountUI();
      renderHeaderAccount();
      return;
    } catch (_) {
      const msg = document.getElementById('authMsg');
      if (msg) { msg.textContent = 'تعذر إكمال تسجيل الدخول باستخدام GitHub. حاول مرة أخرى.'; msg.style.color = '#fb7185'; }
      if (typeof openAuth === 'function') openAuth('login');
      return;
    }
  }
  const messages = {
    github_not_configured: 'تسجيل GitHub غير مهيأ بعد. أكمل إعدادات OAuth في Render.',
    github_denied: 'ألغيت تسجيل الدخول باستخدام GitHub.',
    github_state: 'انتهت صلاحية محاولة تسجيل الدخول. حاول مرة أخرى.',
    github_failed: 'تعذر تسجيل الدخول باستخدام GitHub. حاول مرة أخرى.',
    github_email_conflict: 'هذا البريد مرتبط بحساب موجود. سجّل الدخول بالطريقة المعتادة بدل إنشاء حساب مكرر.'
  };
  if (error) {
    if (typeof openAuth === 'function') openAuth('login');
    const msg = document.getElementById('authMsg');
    if (msg) { msg.textContent = messages[error] || messages.github_failed; msg.style.color = '#fb7185'; }
  }
})();
