/* ==========================================================================
   Varnika Speciality Hospital — English / Tamil
   --------------------------------------------------------------------------
   The pages are written in English. Every element with data-i18n="key" gets
   its Tamil text from TA below when Tamil is chosen (the English stays in the
   HTML, for search engines and as the fallback). Text built by main.js comes
   from UI, as [English, Tamil]. Choose a language with the switch in the
   header, or link to a page with ?lang=ta.
   ========================================================================== */
(function () {
  "use strict";

  const TA = {
    "c.skip": "உள்ளடக்கத்துக்குச் செல்ல",
    "c.book": "முன்பதிவு செய்ய",
    "c.bookShort": "முன்பதிவு",
    "c.callNow": "இப்போதே அழைக்க",
    "c.call": "அழைக்க",
    "c.yourDoctor": "உங்கள் மருத்துவர்",
    "c.regNo": "பதிவு எண்",
    "c.everyDay": "தினமும்",
    "c.monSat": "திங்கள் – சனி",
    "c.timings": "நேரம்",
    "c.emergency": "இது 24 மணி நேர அவசர சேவை அல்ல. இந்த நேரத்துக்கு வெளியே கடுமையான காயம் என்றால், அருகிலுள்ள மருத்துவமனை அவசரப் பிரிவுக்குச் செல்லவும் அல்லது <strong>108</strong> அழைக்கவும்.",
    "c.visitUs": "எங்களைச் சந்திக்க",
    "c.directions": "வழி காட்ட",
    "c.google": "Google-ல் எங்களைப் பார்க்க",

    "nav.home": "முகப்பு",
    "nav.about": "மருத்துவர்",
    "nav.services": "சிகிச்சைகள்",
    "nav.book": "முன்பதிவு",
    "nav.contact": "தொடர்பு",
    "nav.health": "ஆரோக்கியம்",

    "health.title": "உடற்பயிற்சி & சுகாதார ஆலோசனை",
    "health.lead": "எலும்பு, மூட்டு, முதுகுத்தண்டு நலமாக இருக்க வீட்டிலேயே செய்யக்கூடிய உடற்பயிற்சி வீடியோக்கள், படங்கள், மருத்துவரின் எளிய ஆலோசனைகள்.",
    "health.safety": "<strong>மருத்துவர் உங்களுக்குச் சொன்ன உடற்பயிற்சிகளை மட்டும் செய்யவும்.</strong> மெதுவாகத் தொடங்கவும். வலி, வீக்கம் அல்லது மரத்துப்போதல் அதிகமானால் நிறுத்திவிட்டு எங்களை அழைக்கவும்.",
    "health.kGuide": "உடற்பயிற்சி வழிகாட்டி",
    "health.guideTitle": "பொதுவான வலிகளுக்கு எளிய உடற்பயிற்சிகள்",
    "health.guideLead": "படத்தைத் தொட்டால் பெரிதாகப் பார்க்கலாம். ஒவ்வொன்றையும் மெதுவாக, வெட்டி இழுக்காமல் செய்யவும்.",
    "health.kPosts": "மருத்துவரிடமிருந்து",
    "health.postsTitle": "வீடியோக்கள் & சுகாதார ஆலோசனை",
    "home.exTitle": "பொதுவான வலிகளுக்கு உடற்பயிற்சிகள்",
    "home.exLead": "மருத்துவர் அடிக்கடி பரிந்துரைக்கும் எளிய உடற்பயிற்சிகள். வீட்டிலேயே எப்படிச் செய்வது என்று பாருங்கள்.",
    "home.allExercises": "எல்லா உடற்பயிற்சிகளும் ஆலோசனைகளும்",
    "health.ctaTitle": "வலி குறையவில்லையா?",
    "health.ctaText": "முன்பதிவு செய்யுங்கள் — மருத்துவர் பரிசோதித்து சரியான உடற்பயிற்சிகளைக் காட்டுவார்.",
    "home.kNews": "புதியவை",
    "home.newsTitle": "மருத்துவமனை செய்திகள் & நிகழ்வுகள்",
    "about.kAwards": "சாதனைகள்",
    "about.awardsTitle": "சாதனைகள் & அங்கீகாரங்கள்",

    "home.eyebrow": "கீரமங்கலத்தில் எலும்பு, மூட்டு சிகிச்சை",
    "home.h1a": "வலுவான எலும்புகள்.",
    "home.h1b": "வலியில்லா வாழ்க்கை.",
    "home.lead": "குழந்தைகள் முதல் பெரியவர்கள் வரை எலும்பு, மூட்டு, முதுகுத்தண்டு, காயங்களுக்கு சிகிச்சை. ஆலோசனை, எக்ஸ்-ரே, ECG, லேப் பரிசோதனைகள் — அனைத்தும் ஒரே இடத்தில். அறுவை தேவைப்பட்டால், மருத்துவரே அருகிலுள்ள மருத்துவமனையில் செய்வார்.",
    "home.p1": "லேப் 7 நாளும் · மருத்துவர் திங்கள் – சனி",
    "home.p4": "லேப் காலை 8 மணி முதல்",
    "home.p2": "எக்ஸ்-ரே, ECG, லேப் இங்கேயே",
    "home.p3": "குழந்தைகள் & பெரியவர்கள்",
    "home.aboutDoctor": "மருத்துவர் பற்றி",
    "home.q1": "ஆன்லைன் முன்பதிவு",
    "home.q1s": "1 நிமிடத்தில் நேரம் தேர்வு",
    "home.q2": "அழைக்க",
    "home.q3s": "எங்களுக்கு செய்தி அனுப்ப",
    "home.q4": "வழி",
    "home.q4s": "கீரமங்கலம் பேருந்து நிலையம் எதிரில்",
    "home.k1": "ஒரே கூரையின் கீழ்",
    "home.facTitle": "ஒரே வருகையில் எல்லா பரிசோதனைகளும்",
    "home.facLead": "பரிசோதனையும் சிகிச்சையும் ஒரே இடத்தில் — பெரும்பாலான பிரச்சனைகள் ஒரே வருகையில் தீர்க்கப்படும்.",
    "home.k2": "நாங்கள் சிகிச்சை அளிப்பவை",
    "home.svcTitle": "எலும்பு, மூட்டு சிகிச்சை — அனைத்தும்",
    "home.svcLead": "காயங்கள், எலும்பு முறிவுகள், மூட்டு, முதுகுத்தண்டு பிரச்சனைகள், விளையாட்டுக் காயங்கள், குழந்தைகளின் எலும்புப் பிரச்சனைகள்.",
    "home.allServices": "எல்லா சிகிச்சைகளையும் பார்க்க",
    "home.k3": "உங்கள் வருகை",
    "home.stepsTitle": "எளிமையாக, படிப்படியாக",
    "home.s1": "முன்பதிவு அல்லது நேரடி வருகை",
    "home.s1t": "ஆன்லைனில் நேரம் பதிவு செய்யுங்கள், அல்லது நேரடியாக வாருங்கள். மருத்துவர் திங்கள் முதல் சனி வரை <span data-hours></span> (ஞாயிறு இல்லை).",
    "home.s3t2": "லேப், எக்ஸ்-ரே, ECG <span data-lab-hours></span> — முன்பே வந்து பரிசோதனை செய்து, ரிப்போர்ட்டுடன் மருத்துவரைப் பாருங்கள்.",
    "c.doctorHours": "மருத்துவர்",
    "c.labHours": "லேப், எக்ஸ்-ரே, ECG",
    "home.s2": "ஆலோசனை",
    "home.s2t": "மருத்துவர் உங்களைப் பரிசோதித்து, பிரச்சனையை விளக்குவார்.",
    "home.s3": "தேவைப்பட்டால் பரிசோதனை",
    "home.s3t": "எக்ஸ்-ரே, ECG, லேப் பரிசோதனைகள் அதே வருகையில் இங்கேயே.",
    "home.s4": "சிகிச்சை",
    "home.s4t": "மருந்து, மாவுக்கட்டு, ஸ்பிளின்ட், ஊசி இங்கேயே. அறுவை தேவைப்பட்டால் மட்டும், அருகிலுள்ள மருத்துவமனையில்.",
    "home.k4": "கேள்விகள்",
    "home.faqTitle": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    "home.ctaTitle": "ஒரு நிமிடத்தில் முன்பதிவு செய்யுங்கள்",
    "home.ctaText": "ஆன்லைனில் நேரம் தேர்வு செய்யுங்கள். மருத்துவமனை WhatsApp-ல் உறுதி செய்யும்.",

    "about.title": "மருத்துவர் & மருத்துவமனை",
    "about.lead": "தகுதி பெற்ற எலும்பு அறுவை சிகிச்சை நிபுணர் நடத்தும், கீரமங்கலத்தில் உள்ள எலும்பியல் சிறப்பு மருத்துவமனை.",
    "about.quals": "கல்வித் தகுதி",
    "about.designation": "பதவி",
    "about.consult": "ஆலோசனை நேரம்",
    "about.hospTitle": "மருத்துவமனை பற்றி",
    "about.hospText": "வர்ணிகா ஸ்பெஷாலிட்டி மருத்துவமனை குழந்தைகள் முதல் முதியவர்கள் வரை அனைவருக்கும் காயங்கள், எலும்பு முறிவுகள், எலும்பு, மூட்டு, முதுகுத்தண்டு பிரச்சனைகளுக்கு சிகிச்சை அளிக்கிறது.",
    "about.f1": "மருத்துவர் ஆலோசனை",
    "about.f2": "எக்ஸ்-ரே",
    "about.f3": "ECG",
    "about.f4": "அடிப்படைப் பரிசோதனைகளுக்கான ஆய்வகம்",
    "about.f5": "மாவுக்கட்டு, ஸ்பிளின்ட், ஊசி, காயக் கட்டு",
    "about.surgery": "<strong>அறுவை சிகிச்சை பற்றி:</strong> இங்கே அறுவை அரங்கு அல்லது உள்நோயாளி வார்டு இல்லை. அறுவை தேவைப்பட்டால், மருத்துவரே அருகிலுள்ள மருத்துவமனையில் செய்வார்; ஏற்பாடுகளை முன்பே விளக்குவார்.",
    "about.bringTitle": "எடுத்து வர வேண்டியவை",
    "about.b1": "பழைய எக்ஸ்-ரே, ஸ்கேன், ரிப்போர்ட்டுகள்",
    "about.b2": "பழைய மருந்துச் சீட்டுகள், டிஸ்சார்ஜ் சம்மரி",
    "about.b3": "இப்போது சாப்பிடும் மருந்துகள்",
    "about.b4": "வலி உள்ள இடத்தைப் பரிசோதிக்க ஏற்ற தளர்வான உடை",
    "about.emTitle": "திறந்திருக்கும் நேரத்துக்கு வெளியே",
    "about.emText": "லேப், எக்ஸ்-ரே, ECG <span data-lab-hours></span>; மருத்துவர் <span data-hours></span>.",
    "about.lab": "லேப், எக்ஸ்-ரே, ECG",
    "about.emNote": "திறந்த எலும்பு முறிவு, அதிக இரத்தப்போக்கு, தலைக்காயம், சாலை விபத்து போன்ற கடுமையான காயங்களுக்கு, நேரடியாக அருகிலுள்ள மருத்துவமனை அவசரப் பிரிவுக்குச் செல்லவும் அல்லது <strong>108</strong> ஆம்புலன்ஸை அழைக்கவும்.",

    "svc.title": "எலும்பியல் சிகிச்சைகள்",
    "svc.lead": "குழந்தைகள் முதல் முதியவர்கள் வரை எலும்பு, மூட்டு, தசை, முதுகுத்தண்டு சிகிச்சை. ஒவ்வொரு சிகிச்சையும் இங்கேயா அல்லது அருகிலுள்ள மருத்துவமனையில் அறுவையா என்று காட்டப்பட்டுள்ளது.",
    "svc.here": "இங்கே கிடைப்பவை",
    "svc.conditions": "நோய்கள் & சிகிச்சைகள்",
    "svc.searchLabel": "சிகிச்சையைத் தேட",
    "svc.searchPh": "தேடுங்கள்: முழங்கால், முறிவு, knee…",
    "svc.note": "உங்கள் பிரச்சனை இங்கே இல்லையா? இது பொதுவான பிரச்சனைகளின் பட்டியல் மட்டுமே. எல்லா எலும்பு, மூட்டு, காயப் பிரச்சனைகளுக்கும் சிகிச்சை அளிக்கிறோம் — <a href=\"contact.html\">தொடர்பு கொள்ளுங்கள்</a> அல்லது நேரடியாக வாருங்கள்.",

    "bk.title": "முன்பதிவு செய்ய",
    "bk.lead": "மருத்துவரைப் பார்க்க திங்கள் முதல் சனி வரை <span data-hours></span> இடையே ஒரு நேரத்தைத் தேர்வு செய்யுங்கள். லேப், எக்ஸ்-ரே, ECG-க்கு <span data-lab-hours></span> எப்போது வேண்டுமானாலும் முன்பே வரலாம்.",
    "bk.st1": "காரணம்",
    "bk.st2": "தேதி & நேரம்",
    "bk.st3": "நோயாளி",
    "bk.st4": "உறுதி",
    "bk.closed": "ஆன்லைன் முன்பதிவு இப்போது மூடப்பட்டுள்ளது. WhatsApp-ல் கோரிக்கை அனுப்பலாம், மருத்துவமனையை அழைக்கலாம், அல்லது திறந்திருக்கும் நேரத்தில் நேரடியாக வரலாம்.",
    "bk.q1": "எதற்காக வருகிறீர்கள்?",
    "bk.q2": "தேதி மற்றும் நேரத்தைத் தேர்வு செய்யுங்கள்",
    "bk.open": "மருத்துவர் திங்கள் – சனி",
    "bk.q3": "நோயாளியின் விவரங்கள்",
    "bk.name": "நோயாளியின் பெயர்",
    "bk.nameErr": "நோயாளியின் பெயரை உள்ளிடவும்.",
    "bk.phone": "மொபைல் எண்",
    "bk.phonePh": "10 இலக்க மொபைல் எண்",
    "bk.phoneErr": "சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.",
    "bk.age": "வயது",
    "bk.ageErr": "0 முதல் 120 வரையிலான வயதை உள்ளிடவும்.",
    "bk.gender": "பாலினம்",
    "bk.notes": "பிரச்சனையை விவரிக்கவும்",
    "bk.optional": "(விருப்பம்)",
    "bk.notesPh": "உ.தா. நேற்று பைக்கில் இருந்து விழுந்தேன், வலது மணிக்கட்டில் வலி, வீக்கம்",
    "bk.q4": "சரிபார்த்து உறுதி செய்யுங்கள்",
    "bk.reqNote": "இது நீங்கள் விரும்பும் நேரத்துக்கான கோரிக்கை. மருத்துவமனை WhatsApp அல்லது போனில் உறுதி செய்யும். <strong>15 நிமிடம் முன்பே</strong> வரவும்; தாமதமானால் வழக்கமான நேரடி வருகை (walk-in) வரிசையில் பார்க்கப்படுவீர்கள்.",
    "bk.refNo": "பதிவு எண்",
    "bk.sentNote": "<strong>உங்கள் கோரிக்கை மருத்துவமனைக்குக் கிடைத்துவிட்டது.</strong> வரவேற்பாளர் WhatsApp அல்லது போனில் நேரத்தை உறுதி செய்வார். போனை அருகில் வைத்திருங்கள்.",
    "bk.unsentNote": "<strong>இந்தக் கோரிக்கையை WhatsApp-ல் மருத்துவமனைக்கு அனுப்புங்கள்</strong>, அப்போதுதான் எங்களுக்குக் கிடைக்கும். நேரத்தை உறுதி செய்வோம்.",
    "bk.sendWa": "WhatsApp-ல் அனுப்ப",
    "pay.title": "முன்பதிவை உறுதி செய்ய OPD கட்டணத்தைச் செலுத்துங்கள்",
    "pay.s1": "ஏதாவது ஒரு UPI ஆப் மூலம் செலுத்துங்கள்",
    "pay.open": "GPay / PhonePe / Paytm மூலம் செலுத்த",
    "pay.or": "அல்லது வேறு போனில் இந்த QR-ஐ ஸ்கேன் செய்யுங்கள், அல்லது இந்த UPI ID-க்கு அனுப்புங்கள்:",
    "pay.copy": "நகலெடு",
    "pay.to": "பெறுபவர்",
    "pay.s2": "பிறகு 12 இலக்க UTR எண்ணை உள்ளிடுங்கள்",
    "pay.s2t": "உங்கள் UPI ஆப்பில் பணம் செலுத்திய விவரத்தில் இருக்கும் (UTR, UPI Ref No. அல்லது UPI Transaction ID).",
    "pay.utrLabel": "UTR எண்",
    "pay.send": "அனுப்ப",
    "pay.help": "செலுத்துவதில் சிக்கலா? மருத்துவமனையை அழைக்கவும் அல்லது WhatsApp செய்யவும்; வரவேற்பிலும் செலுத்தலாம்.",
    "pay.done": "<strong>கட்டண விவரம் சரிபார்ப்புக்கு அனுப்பப்பட்டது.</strong> வரவேற்பாளர் சரிபார்த்து உங்கள் சந்திப்பை WhatsApp-ல் உறுதி செய்வார்.",
    "bk.cal": "காலெண்டரில் சேர்க்க",
    "bk.print": "அச்சிட",
    "bk.another": "புதிய முன்பதிவு",
    "bk.back": "பின்",
    "bk.summary": "உங்கள் முன்பதிவு",
    "bk.doctor": "மருத்துவர்",
    "bk.reason": "காரணம்",
    "bk.date": "தேதி",
    "bk.time": "நேரம்",
    "bk.mine": "உங்கள் முன்பதிவுகள் (இந்த போனில்)",
    "g.Female": "பெண்",
    "g.Male": "ஆண்",
    "g.Other": "மற்றவர்",

    "ct.title": "தொடர்பு & வழி",
    "ct.lead": "கீரமங்கலம் பேருந்து நிலையம் எதிரில் இருக்கிறோம்.",
    "ct.address": "முகவரி",
    "ct.msgTitle": "எங்களுக்கு செய்தி அனுப்புங்கள்",
    "ct.msgLead": "உங்கள் செய்தி WhatsApp-ல் திறக்கும்; அனுப்பினால் போதும்.",
    "ct.name": "உங்கள் பெயர்",
    "ct.nameErr": "உங்கள் பெயரை உள்ளிடவும்.",
    "ct.topic": "தலைப்பு",
    "ct.t1": "பொதுவான கேள்வி",
    "ct.t2": "முன்பதிவு",
    "ct.t3": "எக்ஸ்-ரே / ECG / லேப் பரிசோதனை",
    "ct.t4": "அறுவை சிகிச்சை பற்றி",
    "ct.t5": "மறுபரிசோதனை",
    "ct.message": "செய்தி",
    "ct.msgErr": "ஒரு சிறிய செய்தியை எழுதவும்.",
    "ct.map": "வரைபடம் — கீரமங்கலம் பேருந்து நிலையம்",
  };

  // Text built by main.js: [English, Tamil]. {x} placeholders are filled in by t().
  const UI = {
    switchTo: ["தமிழ்", "English"],
    switchLabel: ["தமிழில் படிக்க", "Read in English"],
    menu: ["Menu", "மெனு"],
    closedNow: ["Closed now · opens {t}", "இப்போது மூடியுள்ளது · {t} மணிக்கு திறக்கும்"],
    openShort: ["Open now", "திறந்துள்ளது"],
    closedShort: ["Closed · opens {t}", "மூடியுள்ளது · {t}"],
    openLab: ["Open now · Lab & X-ray · Doctor from {t}", "இப்போது திறந்துள்ளது · லேப், எக்ஸ்-ரே · மருத்துவர் {t} முதல்"],
    openDoctor: ["Open now · Doctor here until {t}", "இப்போது திறந்துள்ளது · மருத்துவர் {t} வரை"],
    colDay: ["Day", "நாள்"],
    colLab: ["Lab · X-ray · ECG", "லேப் · எக்ஸ்-ரே · ECG"],
    colDoctor: ["Doctor", "மருத்துவர்"],
    googleProfile: ["See us on Google", "Google-ல் எங்களைப் பார்க்க"],
    openDaily: ["Open daily {h}", "தினமும் {h}"],
    sundaysToo: ["Sundays & holidays too", "ஞாயிறு, விடுமுறை நாட்களிலும்"],
    today: ["Today", "இன்று"],
    todayMark: [" (today)", " (இன்று)"],
    holidays: ["Public holidays", "பொது விடுமுறை நாட்கள்"],
    // The doctor's posts
    playVideo: ["Play video: {t}", "வீடியோ பார்க்க: {t}"],
    openPhoto: ["Open photo", "படத்தைப் பெரிதாகப் பார்க்க"],
    prevPhoto: ["Previous photo", "முந்தைய படம்"],
    nextPhoto: ["Next photo", "அடுத்த படம்"],
    readMore: ["Read more", "மேலும் படிக்க"],
    readLess: ["Show less", "சுருக்கமாக"],
    close: ["Close", "மூடு"],
    newsKicker: ["Hospital news", "மருத்துவமனை செய்திகள்"],
    seeNews: ["See all news", "எல்லா செய்திகளும்"],
    nextNews: ["Next ({n} of {of})", "அடுத்தது ({n}/{of})"],
    allPosts: ["All", "அனைத்தும்"],
    noPosts: ["Exercise videos and health tips from the doctor will appear here soon.", "மருத்துவரின் உடற்பயிற்சி வீடியோக்களும் சுகாதார ஆலோசனைகளும் விரைவில் இங்கே வரும்."],
    loadingPosts: ["Loading…", "ஏற்றுகிறது…"],
    pages: ["Pages", "பக்கங்கள்"],
    visitUs: ["Visit us", "எங்களைச் சந்திக்க"],
    openMaps: ["Open in Google Maps →", "Google Maps-ல் திறக்க →"],
    everyDayHours: ["Lab & X-ray {lab}, every day · Doctor {h}, Monday to Saturday (no doctor on Sundays)", "லேப், எக்ஸ்-ரே {lab}, தினமும் · மருத்துவர் {h}, திங்கள் – சனி (ஞாயிறு மருத்துவர் இல்லை)"],
    noDoctor: ["No doctor", "மருத்துவர் இல்லை"],
    contactBar: ["Opening status and phone", "திறந்திருக்கும் நிலை, தொலைபேசி"],
    quickContact: ["Quick contact", "விரைவுத் தொடர்பு"],
    showMap: ["Tap to open the map", "வரைபடத்தைத் திறக்க தொடவும்"],
    doctorComing: ["Doctor coming", "மருத்துவர் வருவார்"],
    openNoDoctor: ["Open now · Lab & X-ray · No doctor today", "இப்போது திறந்துள்ளது · லேப், எக்ஸ்-ரே · இன்று மருத்துவர் இல்லை"],
    notEmergency: ["Not a 24-hour emergency service. In an emergency, call 108.", "இது 24 மணி நேர அவசர சேவை அல்ல. அவசரத்துக்கு 108 அழைக்கவும்."],
    waHello: ["Hello Varnika Speciality Hospital, I have a query.", "வணக்கம் வர்ணிகா ஸ்பெஷாலிட்டி மருத்துவமனை, எனக்கு ஒரு கேள்வி உள்ளது."],
    chatWa: ["Chat on WhatsApp", "WhatsApp-ல் பேச"],
    callUs: ["Call the hospital", "மருத்துவமனையை அழைக்க"],
    backTop: ["Back to top", "மேலே செல்ல"],
    atHere: ["At Varnika Speciality Hospital", "வர்ணிகா ஸ்பெஷாலிட்டி மருத்துவமனையில்"],
    atHospital: ["Surgery at a nearby hospital", "அருகிலுள்ள மருத்துவமனையில் அறுவை"],
    noService: ["No matching service found for “{q}”. Please <a href=\"contact.html\">contact us</a> — we treat all bone and joint problems.",
                "“{q}” என்பதற்குப் பொருந்தும் சிகிச்சை இல்லை. <a href=\"contact.html\">தொடர்பு கொள்ளுங்கள்</a> — எல்லா எலும்பு, மூட்டு பிரச்சனைகளுக்கும் சிகிச்சை அளிக்கிறோம்."],
    waOpening: ["Opening WhatsApp to send your message…", "உங்கள் செய்தியை அனுப்ப WhatsApp திறக்கிறது…"],
    pickDate: ["Pick a date to see times.", "நேரங்களைப் பார்க்க ஒரு தேதியைத் தேர்வு செய்யுங்கள்."],
    hoursOver: ["Today's opening hours are over. Please choose another day.", "இன்றைய நேரம் முடிந்துவிட்டது. வேறு நாளைத் தேர்வு செய்யுங்கள்."],
    dayFull: ["Online booking for this day is full. Please choose another day, or just walk in during opening hours.", "இந்த நாளுக்கான ஆன்லைன் முன்பதிவு நிரம்பிவிட்டது. வேறு நாளைத் தேர்வு செய்யுங்கள், அல்லது நேரடியாக வாருங்கள்."],
    full: ["Full", "நிரம்பியது"],
    fullTitle: ["Fully booked", "முழுவதும் பதிவாகிவிட்டது"],
    available: ["Available", "கிடைக்கும்"],
    yourChoice: ["Your choice", "உங்கள் தேர்வு"],
    notSelected: ["Not selected", "தேர்வு செய்யவில்லை"],
    next: ["Next", "அடுத்து"],
    confirm: ["Confirm booking", "முன்பதிவை உறுதி செய்ய"],
    sending: ["Sending…", "அனுப்புகிறது…"],
    rReason: ["Reason", "காரணம்"],
    rDoctor: ["Doctor", "மருத்துவர்"],
    rDate: ["Date", "தேதி"],
    rTime: ["Time", "நேரம்"],
    rPatient: ["Patient", "நோயாளி"],
    rMobile: ["Mobile", "மொபைல்"],
    rDetails: ["Details", "விவரம்"],
    yrs: ["{n} yrs", "{n} வயது"],
    titleSent: ["Booking request received", "முன்பதிவு கோரிக்கை கிடைத்தது"],
    titleReady: ["Request ready", "கோரிக்கை தயார்"],
    sentTag: [" · sent to hospital", " · மருத்துவமனைக்கு அனுப்பப்பட்டது"],
    removeAsk: ["Remove this booking from this phone? Please also call the hospital to cancel.", "இந்த முன்பதிவை இந்த போனில் இருந்து நீக்கவா? ரத்து செய்ய மருத்துவமனையையும் அழைக்கவும்."],
    removed: ["Removed from this phone.", "இந்த போனில் இருந்து நீக்கப்பட்டது."],
    remove: ["Remove", "நீக்க"],
    payNow: ["Pay ₹{fee}", "₹{fee} செலுத்த"],
    payDue: [" · fee due", " · கட்டணம் நிலுவை"],
    paySent: [" · payment sent", " · கட்டணம் அனுப்பப்பட்டது"],
    utrBad: ["Please enter the 12-digit UTR number from your UPI app.", "உங்கள் UPI ஆப்பில் உள்ள 12 இலக்க UTR எண்ணை உள்ளிடவும்."],
    payFailed: ["Could not send just now. Please try again, or WhatsApp us the UTR number.", "இப்போது அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும், அல்லது UTR எண்ணை WhatsApp-ல் அனுப்பவும்."],
    copied: ["UPI ID copied", "UPI ID நகலெடுக்கப்பட்டது"],
    bookFailed: ["Sorry, the booking could not be made. Please call the hospital.", "மன்னிக்கவும், முன்பதிவு செய்ய முடியவில்லை. மருத்துவமனையை அழைக்கவும்."],
  };

  // Tamil versions of the booking service's messages (it answers in English).
  const ERRORS_TA = {
    doctor_off: "அந்த நாளில் மருத்துவர் இல்லை (ஞாயிறு). வேறு நாளைத் தேர்வு செய்யவும்.",
    bad_reason: "வருகைக்கான காரணத்தைத் தேர்வு செய்யவும்.",
    bad_name: "நோயாளியின் பெயரை உள்ளிடவும் (100 எழுத்துகள் வரை).",
    bad_phone: "சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.",
    bad_age: "0 முதல் 120 வரையிலான வயதை உள்ளிடவும்.",
    bad_gender: "பெண், ஆண் அல்லது மற்றவர் என்பதைத் தேர்வு செய்யவும்.",
    bad_notes: "பிரச்சனையின் விவரம் 1000 எழுத்துகளுக்குள் இருக்கட்டும்.",
    bad_date: "இன்று முதல் 13 நாட்களுக்குள் ஒரு தேதியைத் தேர்வு செய்யவும்.",
    bad_time: "ஒரு நேரத்தைத் தேர்வு செய்யவும்.",
    slot_past: "அந்த நேரம் இன்று கடந்துவிட்டது. பிந்தைய நேரத்தைத் தேர்வு செய்யவும்.",
    slot_full: "அந்த நேரம் ஏற்கனவே நிரம்பிவிட்டது. வேறு நேரத்தைத் தேர்வு செய்யவும்.",
    day_full: "அந்த நாளுக்கான ஆன்லைன் முன்பதிவு நிரம்பிவிட்டது. வேறு நாளைத் தேர்வு செய்யவும் அல்லது மருத்துவமனையை அழைக்கவும்.",
    already_booked: "இந்த நோயாளிக்கு அந்த நாளில் ஏற்கனவே முன்பதிவு உள்ளது.",
    too_many_for_phone: "இந்த மொபைல் எண்ணில் ஏற்கனவே 3 முன்பதிவுகள் உள்ளன. மருத்துவமனையை அழைக்கவும்.",
    too_many: "அதிக முறை முயற்சிக்கப்பட்டது. மருத்துவமனையை அழைக்கவும்.",
    bad_utr: "உங்கள் UPI ஆப்பில் உள்ள 12 இலக்க UTR எண்ணை உள்ளிடவும்.",
    not_found: "முன்பதிவு கிடைக்கவில்லை. முன்பதிவு எண் மற்றும் மொபைல் எண்ணைச் சரிபார்க்கவும்.",
    no_fee: "இந்த முன்பதிவுக்கு ஆன்லைன் கட்டணம் தேவையில்லை.",
    cancelled: "இந்த முன்பதிவு ரத்து செய்யப்பட்டது. மருத்துவமனையை அழைக்கவும்.",
    utr_used: "இந்த UTR எண் ஏற்கனவே வேறு முன்பதிவுக்குப் பயன்படுத்தப்பட்டது. சரிபார்க்கவும்.",
  };

  const DAYS = [["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"]];
  const DAYS_LONG = [["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], DAYS[1]];
  const MONTHS = [["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  ["ஜன", "பிப்", "மார்", "ஏப்", "மே", "ஜூன்", "ஜூலை", "ஆக", "செப்", "அக்", "நவ", "டிச"]];

  let lang = "en";
  try {
    const q = new URLSearchParams(location.search).get("lang");
    lang = q === "ta" || q === "en" ? q : (localStorage.getItem("vhc-lang") || "en");
  } catch { /* storage unavailable: English */ }
  if (lang !== "ta") lang = "en";

  const idx = () => (lang === "ta" ? 1 : 0);
  const original = new Map(); // element -> its English HTML / placeholder

  window.I18N = {
    get lang() { return lang; },
    set(next) {
      lang = next === "ta" ? "ta" : "en";
      try { localStorage.setItem("vhc-lang", lang); } catch { /* not remembered */ }
    },
    // UI string, with {x} placeholders filled from vars.
    t(key, vars) {
      const pair = UI[key];
      let s = pair ? pair[idx()] : key;
      if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : ""));
      return s;
    },
    // Pick the right language from a { en, ta } value (plain strings pass through).
    L(v) { return v && typeof v === "object" && !Array.isArray(v) ? (v[lang] || v.en) : v; },
    errorText(code, fallback) { return lang === "ta" && ERRORS_TA[code] ? ERRORS_TA[code] : fallback; },
    day: (d) => DAYS[idx()][d],
    dayLong: (d) => DAYS_LONG[idx()][d],
    month: (m) => MONTHS[idx()][m],
    // Swap every data-i18n element (and data-i18n-placeholder) to the current language.
    applyStatic(root) {
      document.documentElement.lang = lang;
      (root || document).querySelectorAll("[data-i18n]").forEach((el) => {
        if (!original.has(el)) original.set(el, el.innerHTML);
        const ta = TA[el.dataset.i18n];
        el.innerHTML = lang === "ta" && ta ? ta : original.get(el);
      });
      (root || document).querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        if (!original.has(el)) original.set(el, el.getAttribute("placeholder") || "");
        const ta = TA[el.dataset.i18nPlaceholder];
        el.setAttribute("placeholder", lang === "ta" && ta ? ta : original.get(el));
      });
    },
  };
})();
