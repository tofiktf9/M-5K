M5K Backend v19 — الحسابات والمتصدرون محفوظة دائمًا

التشغيل (Windows):
1) ثبّت Node.js (الإصدار 18 أو أحدث).
2) شغّل start-m5k.bat  (أول مرة يثبّت الحزم وينسخ .env تلقائيًا).
3) افتح http://localhost:3000
لا تفتح index.html بالنقر المزدوج.

أين تُحفظ الحسابات؟
- إذا كان MySQL (XAMPP) شغالًا: يُنشئ السيرفر قاعدة البيانات والجداول تلقائيًا (لا حاجة لاستيراد database.sql).
- إذا لم يكن MySQL شغالًا: تُحفظ الحسابات والنتائج في backend/data/m5k-data.json
  (مع نسخة احتياطية .bak). خذ نسخة من مجلد backend/data بشكل دوري.
- التحكم عبر STORAGE في ملف .env:  auto (الافتراضي) | mysql | file
- مفتاح الجلسات يُولَّد ويُحفظ تلقائيًا في backend/data/.jwt-secret
  ليبقى المستخدمون مسجّلين بعد إعادة تشغيل السيرفر. لا تشاركه ولا ترفعه على GitHub.

الجديد في v19:
- الدخول يبقى محفوظًا، ويُتحقق منه عند فتح الموقع.
- المتصدرون: أفضل 50، تمييز حسابك، ترتيبك العالمي، وفلتر لكل لعبة.
- رسالة بعد كل جولة تؤكد حفظ نتيجتك (أو تدعو الزائر للتسجيل).
- نتائج غرف الأصدقاء أونلاين تُحفظ تلقائيًا لحسابات المسجّلين.
- إصلاح: شاشة النتيجة كانت تفتح نافذة "الخروج" بدل النتيجة.
- إصلاح: ملف .env وكود السيرفر كانا قابلين للتحميل من المتصفح.
- إصلاح: إجابة السؤال الصحيحة لم تعد تُرسل للاعبين في الغرف الأونلاين.
- إصلاح: المضيف الجديد يحصل على زر البدء، وتصحيح حالات الخروج أثناء اللعب.
- حماية من تخمين كلمات المرور (حد محاولات) وفحص أقوى للنتائج المرسلة.

استضافة Render (مهم):
- يوجد ملف render.yaml لتجهيز خدمة Node على Render.
- أنشئ قاعدة MySQL خارجية تدعم الاتصالات من Render، ثم ضع DB_HOST وDB_PORT وDB_NAME وDB_USER وDB_PASSWORD في Environment للخدمة.
- لا تستخدم STORAGE=file أو auto في الإنتاج على Render؛ نظام الملفات قد يكون مؤقتًا وتضيع الحسابات بعد إعادة النشر/إعادة التشغيل. استخدم STORAGE=mysql.
- لا ترفع ملف .env أو backend/data/.jwt-secret إلى GitHub. استخدم JWT_SECRET ثابتًا وسريًا في Environment؛ تغيير المفتاح سيخرج جميع المستخدمين من الجلسات الحالية.
- فعّل HTTPS، واستخدم كلمة مرور قوية لقاعدة البيانات، واحتفظ بنسخ احتياطية دورية.
- الحسابات تعمل بالبريد واسم المستخدم وكلمة مرور مجزأة بـ bcrypt. استعادة كلمة المرور متاحة برمز تحقق عبر البريد، وتتطلب إعداد SMTP أدناه.
- إعدادات اللغة/المظهر تحفظ محليًا، وتُزامن تفضيلات الحساب المسجل إلى قاعدة البيانات. الترجمة الحالية جزئية (التنقل واتجاه الصفحة وبعض واجهات الإعدادات)، وتحتاج مراجعة ترجمة المحتوى الثابت قبل إطلاق متعدد اللغات كامل.


إعداد استعادة كلمة المرور على Render (Resend API عبر HTTPS):
1) أنشئ حسابًا في https://resend.com/ ثم أضف نطاق إرسال وتحقق منه حسب تعليمات Resend.
2) أنشئ API Key من لوحة Resend واحتفظ به سرًا.
3) افتح Render Dashboard > خدمة الويب M5K > Environment وأضف:
   RESEND_API_KEY = مفتاح API من Resend
   RESEND_FROM = M5K <no-reply@نطاقك-المتحقق.com>
   يجب أن يكون عنوان الإرسال ضمن نطاق تم التحقق منه في Resend.
4) احفظ التغييرات وانتظر إعادة تشغيل الخدمة، ثم اختبر استعادة كلمة المرور.
5) لا تضع المفتاح في ملفات الموقع أو GitHub، ولا ترسله في المحادثات.
مهم: لا تحتاج إلى SMTP_HOST أو SMTP_PORT أو SMTP_USER أو SMTP_PASS في هذه النسخة؛ الإرسال يتم عبر HTTPS API لتجاوز حظر منافذ SMTP في استضافة Render المجانية.
ملاحظة: رموز الاستعادة صالحة 10 دقائق، وكلمة المرور الجديدة يجب أن تكون 10 أحرف على الأقل.


=== GitHub OAuth login (v41) ===
1) In GitHub, open Settings > Developer settings > OAuth Apps > New OAuth App.
2) Homepage URL: https://m5k.onrender.com
3) Authorization callback URL: https://m5k.onrender.com/api/auth/github/callback
4) Generate a Client Secret. In Render > your Web Service > Environment, add:
   GITHUB_CLIENT_ID = (the Client ID shown by GitHub)
   GITHUB_CLIENT_SECRET = (the Client Secret; keep it secret)
   GITHUB_CALLBACK_URL = https://m5k.onrender.com/api/auth/github/callback
5) Save changes and redeploy. Do not put Client Secret in frontend files or commit it to GitHub.
6) Test from a private/incognito browser window. The OAuth button appears on the login/register screen.

Note: Existing users with the same verified email are not automatically linked for security; they should sign in using their existing method. GitHub accounts without a verified email may use a GitHub noreply address for the account record.


AdSense note: This source archive did not contain an ads.txt file. Before deploying, copy your existing valid ads.txt into the project root (m5k_v19_src/ads.txt). The server whitelist now allows /ads.txt to be served. Do not use a blank or invented ads.txt; keep the exact publisher line supplied by AdSense.
