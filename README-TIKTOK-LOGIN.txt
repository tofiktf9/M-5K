إعداد TikTok Login لموقع M5K على Render
=========================================

تمت إضافة مسار OAuth في Backend:
https://m5k.onrender.com/auth/tiktok
Callback URL الثابت:
https://m5k.onrender.com/auth/tiktok/callback

خطوات التفعيل:
1) ارفع هذا الإصدار إلى نفس مستودع/خدمة Render المستخدمة للموقع، ثم Deploy.
2) في TikTok for Developers > Manage apps > تطبيق M5K > Login Kit > Configure for Web:
   سجّل Redirect URI حرفيًا:
   https://m5k.onrender.com/auth/tiktok/callback
3) في Render > خدمة M5K > Environment أضف:
   TIKTOK_CLIENT_KEY = Client key من TikTok Developer Portal
   TIKTOK_CLIENT_SECRET = Client secret من TikTok Developer Portal
   TIKTOK_CALLBACK_URL = https://m5k.onrender.com/auth/tiktok/callback
4) احفظ المتغيرات وأعد النشر.
5) اختبر زر «المتابعة عبر TikTok» بحساب مسموح له باستخدام التطبيق.

ملاحظات:
- لا تضع Client Secret في ملفات الواجهة ولا ترسله لأي شخص.
- يلزم أن يكون Login Kit للويب مفعّلًا وأن يوافق TikTok على التطبيق/الصلاحيات المطلوبة.
- TikTok Basic Profile لا يوفّر البريد الإلكتروني عبر النطاق user.info.basic؛ لذلك ينشئ M5K حسابًا مرتبطًا بمعرّف TikTok الداخلي، مع بريد اصطناعي داخلي لا يستقبل رسائل. لا تستخدم هذا البريد لاستعادة كلمة المرور.
- تسجيل الخروج يزيل جلسة M5K من هذا المتصفح، ولا يلغي صلاحية التطبيق من إعدادات TikTok.
- لا نقدر نؤكد نجاح الدخول الحقيقي قبل وضع مفاتيح التطبيق الصحيحة في Render واختباره على TikTok.
