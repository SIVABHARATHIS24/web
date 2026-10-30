/* ==========================================================================
   Varnika Speciality Hospital: site content
   --------------------------------------------------------------------------
   Edit this file to update hospital details, services and FAQs. Every page
   reads from here, so a change made once shows up everywhere.
   Text that patients read is given in English and Tamil: { en: "…", ta: "…" }.
   ========================================================================== */

window.SITE = {
  name: "Varnika Speciality Hospital",
  nameTa: "வர்ணிகா ஸ்பெஷாலிட்டி மருத்துவமனை",
  tagline: { en: "Excellence in Orthopaedic Care", ta: "எலும்பு, மூட்டு சிகிச்சையில் சிறப்பு" },
  domain: "varnikahospital.in",
  phone: "+91 91599 98099",
  whatsapp: "919159998099", // country code + number, digits only
  email: "drsivabharathi@gmail.com",
  address: {
    en: "No. 2, Annai Vaniha Valagam, Keeramangalam, Opposite to Bus Terminus, Alangudi Taluk, Pudukkottai – 614 624",
    ta: "எண் 2, அன்னை வனிதா வளாகம், கீரமங்கலம், பேருந்து நிலையம் எதிரில், ஆலங்குடி வட்டம், புதுக்கோட்டை – 614 624",
  },
  addressShort: { en: "Opp. Bus Stand, Keeramangalam", ta: "பேருந்து நிலையம் எதிரில், கீரமங்கலம்" },
  // Google Business Profile (Google Maps listing), used by every "Get directions" button.
  mapLink: "https://maps.app.goo.gl/VpykLbZAs5YMKypq6",
  googleProfile: "https://www.google.com/maps?cid=2108018987665484129",
  // Used for the embedded map on the Contact page. For an exact pin, replace
  // with the hospital's coordinates, e.g. "10.4050,79.0500".
  mapQuery: "VARNIKA HEALTH CARE, Keeramangalam North, Tamil Nadu 614624",
  // Lab hours every day, including Sundays and holidays. The doctor is not in on
  // doctorOffDays (0 = Sunday); the OPD service's own list (off_days) wins when online.
  // hours = doctor consultation (online booking times); labHours = laboratory, X-ray and ECG.
  // Patients may come for tests any time from labHours[0], before the doctor arrives.
  hours: ["17:00", "21:00"],
  labHours: ["08:00", "21:00"],
  doctorOffDays: [0],
  // Online booking goes straight into the hospital's OPD software. This key is
  // meant to be public: it can only send a booking request and see which times
  // are full. It cannot read any patient data. Never put a secret key here.
  booking: {
    url: "https://mbafxbqexcwnrcxvkjux.supabase.co",
    key: "sb_publishable_CFTNjU3Z4XcxqY7FyepqYg_sQdVCwSe",
  },
  doctor: {
    name: { en: "Dr. S. SIVABHARATHI", ta: "டாக்டர் S. சிவபாரதி" },
    initials: "SS",
    quals: { en: "MBBS, MS (Orthopaedics)", ta: "MBBS, MS (எலும்பியல்)" },
    title: { en: "Consultant Orthopaedic Surgeon", ta: "எலும்பு மூட்டு அறுவை சிகிச்சை நிபுணர்" },
    reg: "114118",
    photo: "img/doctor.jpg", // add the photo at this path; initials show until then
  },
};

// Facilities available at the hospital itself.
window.FACILITIES = [
  { icon: "stethoscope", color: "blue",
    title: { en: "Doctor consultation", ta: "மருத்துவர் ஆலோசனை" },
    text: { en: "Examination and treatment advice by the orthopaedic surgeon.", ta: "எலும்பு அறுவை சிகிச்சை நிபுணரின் பரிசோதனை மற்றும் சிகிச்சை ஆலோசனை." } },
  { icon: "scan", color: "purple",
    title: { en: "X-ray", ta: "எக்ஸ்-ரே" },
    text: { en: "X-rays taken right here, so you don't need to go elsewhere first.", ta: "எக்ஸ்-ரே இங்கேயே எடுக்கப்படும்; வேறு இடத்துக்கு அலைய வேண்டாம்." } },
  { icon: "activity", color: "red",
    title: { en: "ECG", ta: "ஈசிஜி (ECG)" },
    text: { en: "Heart tracing, for example as a check before surgery.", ta: "இதயத் துடிப்புப் பதிவு — உதாரணமாக அறுவைக்கு முன் பரிசோதனை." } },
  { icon: "flask", color: "teal",
    title: { en: "Clinical laboratory", ta: "ஆய்வகம் (லேப்)" },
    text: { en: "Basic blood and urine investigations.", ta: "அடிப்படை இரத்தம், சிறுநீர் பரிசோதனைகள்." } },
];

/* Orthopaedic services.
   where: "here" = done at Varnika, "hospital" = surgery done by the doctor at
   a nearby hospital. Some services include both. Each group has its own colour. */
window.SERVICE_GROUPS = [
  { id: "all", color: "navy", name: { en: "All", ta: "அனைத்தும்" } },
  { id: "trauma", color: "orange", name: { en: "Fractures & injuries", ta: "எலும்பு முறிவு & காயம்" } },
  { id: "joints", color: "blue", name: { en: "Joints & sports", ta: "மூட்டு & விளையாட்டு" } },
  { id: "spine", color: "purple", name: { en: "Spine", ta: "முதுகுத்தண்டு" } },
  { id: "children", color: "pink", name: { en: "Children", ta: "குழந்தைகள்" } },
  { id: "procedures", color: "teal", name: { en: "Procedures here", ta: "இங்கு செய்யப்படுபவை" } },
  { id: "surgery", color: "navy", name: { en: "Surgeries", ta: "அறுவை சிகிச்சைகள்" } },
];

window.SERVICES = [
  { group: "trauma", icon: "bandage", where: ["here", "hospital"],
    title: { en: "Fracture & trauma care", ta: "எலும்பு முறிவு & காய சிகிச்சை" },
    text: { en: "Care for broken bones and injuries from accidents, falls and work, from first assessment to recovery.",
            ta: "விபத்து, விழுதல், வேலையில் ஏற்படும் எலும்பு முறிவுகள் மற்றும் காயங்களுக்கு முதல் பரிசோதனை முதல் குணமாகும் வரை சிகிச்சை." },
    items: { en: ["Fractures of the arm, leg, wrist, ankle, hip and more", "Plaster casts, slabs and splints", "Closed reduction (setting a bone without an operation)", "Dislocations of the shoulder, elbow, finger and more", "Operation for fractures when needed, at a nearby hospital"],
             ta: ["கை, கால், மணிக்கட்டு, கணுக்கால், இடுப்பு எலும்பு முறிவுகள்", "மாவுக்கட்டு, ஸ்லாப், ஸ்பிளின்ட்", "அறுவை இல்லாமல் எலும்பைச் சரிசெய்தல் (Closed reduction)", "தோள், முழங்கை, விரல் மூட்டு விலகல்", "தேவைப்பட்டால் அருகிலுள்ள மருத்துவமனையில் அறுவை சிகிச்சை"] } },
  { group: "trauma", icon: "shield", where: ["here"],
    title: { en: "Soft tissue injuries", ta: "தசை, தசைநார் காயங்கள்" },
    text: { en: "Injuries to muscles, ligaments and tendons.", ta: "தசைகள், தசைநார்கள் (ligaments), தசைநாண்கள் (tendons) காயங்கள்." },
    items: { en: ["Sprains and strains", "Muscle and ligament tears", "Wounds, dressings and suture removal", "Crush injuries of the hand and foot"],
             ta: ["சுளுக்கு, தசைப்பிடிப்பு", "தசை, தசைநார் கிழிவு", "காயக் கட்டு, தையல் பிரித்தல்", "கை, கால் நசுங்கிய காயங்கள்"] } },
  { group: "joints", icon: "bone", where: ["here", "hospital"],
    title: { en: "Knee, hip & joint pain", ta: "முழங்கால், இடுப்பு & மூட்டு வலி" },
    text: { en: "Diagnosis and treatment of painful, stiff or swollen joints.", ta: "வலி, இறுக்கம், வீக்கம் உள்ள மூட்டுகளுக்கு கண்டறிதல் மற்றும் சிகிச்சை." },
    items: { en: ["Knee and hip osteoarthritis", "Rheumatoid and other inflammatory arthritis", "Gout", "Joint injections", "Knee and hip replacement, at a nearby hospital"],
             ta: ["முழங்கால், இடுப்பு மூட்டுத் தேய்மானம்", "முடக்கு வாதம் (Rheumatoid) மற்றும் பிற மூட்டு அழற்சி", "கவுட் (Gout)", "மூட்டு ஊசி", "அருகிலுள்ள மருத்துவமனையில் முழங்கால், இடுப்பு மூட்டு மாற்று அறுவை"] } },
  { group: "joints", icon: "dumbbell", where: ["here", "hospital"],
    title: { en: "Sports injuries", ta: "விளையாட்டுக் காயங்கள்" },
    text: { en: "Injuries from sport, exercise and active work.", ta: "விளையாட்டு, உடற்பயிற்சி, கடின உழைப்பால் ஏற்படும் காயங்கள்." },
    items: { en: ["Ligament injuries of the knee (ACL, PCL, MCL)", "Meniscus tears", "Ankle sprains and instability", "Tendon problems", "Arthroscopic (keyhole) surgery, at a nearby hospital"],
             ta: ["முழங்கால் தசைநார் காயம் (ACL, PCL, MCL)", "மெனிஸ்கஸ் கிழிவு", "கணுக்கால் சுளுக்கு, தளர்வு", "தசைநாண் பிரச்சனைகள்", "அருகிலுள்ள மருத்துவமனையில் ஆர்த்ரோஸ்கோபி (சாவித்துளை அறுவை)"] } },
  { group: "joints", icon: "person", where: ["here", "hospital"],
    title: { en: "Shoulder & elbow", ta: "தோள் & முழங்கை" },
    text: { en: "Pain, stiffness and weakness in the shoulder and elbow.", ta: "தோள், முழங்கையில் வலி, இறுக்கம், பலவீனம்." },
    items: { en: ["Frozen shoulder", "Rotator cuff problems", "Recurrent shoulder dislocation", "Tennis elbow and golfer's elbow"],
             ta: ["தோள் இறுக்கம் (Frozen shoulder)", "ரொட்டேட்டர் கஃப் பிரச்சனைகள்", "அடிக்கடி தோள் விலகுதல்", "டென்னிஸ் எல்போ, கோல்ஃபர்ஸ் எல்போ"] } },
  { group: "joints", icon: "hand", where: ["here", "hospital"],
    title: { en: "Hand & wrist", ta: "கை & மணிக்கட்டு" },
    text: { en: "Problems that affect the grip and fine movements.", ta: "பிடிப்பு மற்றும் நுண்ணிய அசைவுகளைப் பாதிக்கும் பிரச்சனைகள்." },
    items: { en: ["Carpal tunnel syndrome", "Trigger finger", "De Quervain's tenosynovitis", "Ganglion cysts", "Hand and wrist fractures"],
             ta: ["கார்பல் டன்னல் (கை மரத்துப்போதல்)", "விரல் பிடிப்பு (Trigger finger)", "டி குவெர்வேன் (கட்டைவிரல் அடி வலி)", "கேங்க்லியன் கட்டி", "கை, மணிக்கட்டு எலும்பு முறிவு"] } },
  { group: "joints", icon: "footprints", where: ["here", "hospital"],
    title: { en: "Foot & ankle", ta: "பாதம் & கணுக்கால்" },
    text: { en: "Pain and deformities of the foot and ankle.", ta: "பாதம், கணுக்கால் வலி மற்றும் வடிவ மாற்றங்கள்." },
    items: { en: ["Heel pain and plantar fasciitis", "Achilles tendon problems", "Flat feet", "Bunions and toe deformities", "Diabetic foot problems"],
             ta: ["குதிகால் வலி (Plantar fasciitis)", "அக்கிலிஸ் தசைநாண் பிரச்சனைகள்", "தட்டைப் பாதம்", "கால் பெருவிரல் வளைவு (Bunion)", "சர்க்கரை நோய் பாதப் பிரச்சனைகள்"] } },
  { group: "spine", icon: "spine", where: ["here", "hospital"],
    title: { en: "Back & neck pain", ta: "முதுகு & கழுத்து வலி" },
    text: { en: "Assessment and treatment of spine problems.", ta: "முதுகுத்தண்டு பிரச்சனைகளுக்கு பரிசோதனை மற்றும் சிகிச்சை." },
    items: { en: ["Low back pain and neck pain", "Disc prolapse and sciatica", "Cervical and lumbar spondylosis", "Spine fractures", "Spine surgery when needed, at a nearby hospital"],
             ta: ["கீழ் முதுகு வலி, கழுத்து வலி", "டிஸ்க் பிரச்சனை, சியாட்டிகா (காலுக்குப் பரவும் வலி)", "கழுத்து, இடுப்பு எலும்புத் தேய்மானம் (Spondylosis)", "முதுகுத்தண்டு முறிவு", "தேவைப்பட்டால் அருகிலுள்ள மருத்துவமனையில் முதுகுத்தண்டு அறுவை"] } },
  { group: "children", icon: "baby", where: ["here", "hospital"],
    title: { en: "Children's bones & joints", ta: "குழந்தைகள் எலும்பு சிகிச்சை" },
    text: { en: "Bone and joint problems in babies, children and teenagers.", ta: "குழந்தைகள், சிறுவர்கள், பதின்ம வயதினரின் எலும்பு, மூட்டு பிரச்சனைகள்." },
    items: { en: ["Clubfoot (CTEV) — Ponseti casting", "Children's fractures", "Bow legs and knock knees", "Limping child", "Hip problems in babies (DDH)", "Flat feet and walking problems"],
             ta: ["பிறவி கோணல் பாதம் (Clubfoot) — பொன்செட்டி மாவுக்கட்டு", "குழந்தைகளின் எலும்பு முறிவு", "வளைந்த கால்கள், உரசும் முழங்கால்கள்", "நொண்டி நடக்கும் குழந்தை", "குழந்தைகளின் இடுப்பு மூட்டுப் பிரச்சனை (DDH)", "தட்டைப் பாதம், நடைப் பிரச்சனைகள்"] } },
  { group: "joints", icon: "shield", where: ["here"],
    title: { en: "Bone health", ta: "எலும்பு ஆரோக்கியம்" },
    text: { en: "Keeping bones strong, especially as you get older.", ta: "எலும்புகளை வலுவாக வைத்திருத்தல், குறிப்பாக வயதாகும்போது." },
    items: { en: ["Osteoporosis assessment and treatment", "Vitamin D and calcium deficiency", "Fall and fracture prevention advice", "Bone infections and bone swellings (assessment)"],
             ta: ["எலும்புப் புரை (Osteoporosis) பரிசோதனை, சிகிச்சை", "வைட்டமின் D, கால்சியம் குறைபாடு", "விழுதல், எலும்பு முறிவு தடுப்பு ஆலோசனை", "எலும்புத் தொற்று, எலும்பு வீக்கம் (பரிசோதனை)"] } },
  { group: "procedures", icon: "syringe", where: ["here"],
    title: { en: "Procedures done here", ta: "இங்கேயே செய்யப்படும் சிகிச்சைகள்" },
    text: { en: "Minor procedures done at Varnika itself.", ta: "சிறிய சிகிச்சைகள் வர்ணிகாவிலேயே செய்யப்படும்." },
    items: { en: ["Plaster cast application and removal", "Splinting and strapping", "Joint aspiration (removing fluid)", "Joint and soft-tissue injections", "Wound dressing and suture removal"],
             ta: ["மாவுக்கட்டு போடுதல், பிரித்தல்", "ஸ்பிளின்ட், ஸ்ட்ராப்பிங்", "மூட்டில் நீர் எடுத்தல்", "மூட்டு, தசை ஊசிகள்", "காயக் கட்டு, தையல் பிரித்தல்"] } },
  { group: "surgery", icon: "hospital", where: ["hospital"],
    title: { en: "Surgeries at a nearby hospital", ta: "அருகிலுள்ள மருத்துவமனையில் அறுவை சிகிச்சைகள்" },
    text: { en: "When an operation is needed, the doctor performs it at a nearby hospital and continues your follow-up here.",
            ta: "அறுவை தேவைப்பட்டால், மருத்துவரே அருகிலுள்ள மருத்துவமனையில் செய்து, தொடர் சிகிச்சையை இங்கே தொடர்வார்." },
    items: { en: ["Fracture fixation (plates, nails, screws, wires)", "Arthroscopy (keyhole joint surgery)", "Knee and hip replacement", "Spine surgery", "Implant removal", "Deformity correction in children and adults"],
             ta: ["எலும்பு முறிவு சரிசெய்தல் (பிளேட், நெயில், ஸ்க்ரூ, கம்பி)", "ஆர்த்ரோஸ்கோபி (சாவித்துளை மூட்டு அறுவை)", "முழங்கால், இடுப்பு மூட்டு மாற்று", "முதுகுத்தண்டு அறுவை", "உலோகத் தகடு அகற்றுதல்", "குழந்தைகள், பெரியவர்களின் எலும்பு வளைவு சரிசெய்தல்"] } },
];

// {hours} is replaced with the opening hours, e.g. "5 PM – 9 PM".
window.FAQS = [
  { q: { en: "What are the timings?", ta: "நேரம் என்ன?" },
    a: { en: "Laboratory, X-ray and ECG: {lab}, every day including Sundays and holidays. Doctor consultation: {hours}, Monday to Saturday (no doctor on Sundays). You can come for your tests any time from {labStart}, so the reports are ready when the doctor sees you.",
         ta: "ஆய்வகம், எக்ஸ்-ரே, ECG: {lab}, ஞாயிறு, விடுமுறை நாட்கள் உட்பட தினமும். மருத்துவர் ஆலோசனை: {hours}, திங்கள் முதல் சனி வரை (ஞாயிறு மருத்துவர் இல்லை). பரிசோதனைகளுக்கு {labStart} முதல் எப்போது வேண்டுமானாலும் வரலாம்; மருத்துவர் பார்க்கும்போது ரிப்போர்ட்டுகள் தயாராக இருக்கும்." } },
  { q: { en: "Is it open 24 hours?", ta: "24 மணி நேரமும் திறந்திருக்குமா?" },
    a: { en: "No. We are open {lab} (doctor {hours}). For serious injuries outside these hours, please go to the nearest hospital emergency department or call 108 for an ambulance.",
         ta: "இல்லை. {lab} மட்டும் திறந்திருக்கும் (மருத்துவர் {hours}). இந்த நேரத்துக்கு வெளியே கடுமையான காயம் என்றால், அருகிலுள்ள மருத்துவமனை அவசரப் பிரிவுக்குச் செல்லவும் அல்லது 108 ஆம்புலன்ஸை அழைக்கவும்." } },
  { q: { en: "Do I need an appointment?", ta: "முன்பதிவு அவசியமா?" },
    a: { en: "You can walk in during opening hours. Booking a time online helps us plan and can reduce your waiting time. If you book, please arrive 15 minutes before your time for vitals and tests; if you are late, you will be seen in the regular walk-in queue.",
         ta: "திறந்திருக்கும் நேரத்தில் நேரடியாகவும் வரலாம். ஆன்லைனில் முன்பதிவு செய்தால் காத்திருக்கும் நேரம் குறையும். முன்பதிவு செய்தவர்கள் உங்கள் நேரத்துக்கு 15 நிமிடம் முன்பே வரவும்; தாமதமானால் வழக்கமான நேரடி வருகை (walk-in) வரிசையில் பார்க்கப்படுவீர்கள்." } },
  { q: { en: "Can I get an X-ray, ECG or blood test here?", ta: "எக்ஸ்-ரே, ECG, இரத்தப் பரிசோதனை இங்கே உண்டா?" },
    a: { en: "Yes. X-ray, ECG and basic laboratory investigations are done right here, {lab}, even before the doctor arrives.", ta: "ஆம். எக்ஸ்-ரே, ECG மற்றும் அடிப்படை ஆய்வகப் பரிசோதனைகள் {lab} இங்கேயே செய்யப்படும் — மருத்துவர் வருவதற்கு முன்பும்." } },
  { q: { en: "Where are operations done?", ta: "அறுவை சிகிச்சை எங்கே செய்யப்படும்?" },
    a: { en: "There is no operation theatre here. When surgery is needed, the doctor performs it at a nearby hospital and explains the plan and arrangements during your consultation.",
         ta: "இங்கே அறுவை அரங்கு (Operation theatre) இல்லை. அறுவை தேவைப்பட்டால், மருத்துவரே அருகிலுள்ள மருத்துவமனையில் செய்வார்; திட்டம் மற்றும் ஏற்பாடுகளை ஆலோசனையின்போது விளக்குவார்." } },
  { q: { en: "Do you treat children?", ta: "குழந்தைகளுக்கு சிகிச்சை உண்டா?" },
    a: { en: "Yes. We see children of all ages with fractures, clubfoot, bow legs, flat feet, limping and other bone and joint problems.",
         ta: "ஆம். எல்லா வயதுக் குழந்தைகளுக்கும் எலும்பு முறிவு, கோணல் பாதம், வளைந்த கால்கள், தட்டைப் பாதம், நொண்டி நடை போன்ற பிரச்சனைகளுக்கு சிகிச்சை அளிக்கிறோம்." } },
  { q: { en: "What should I bring to my visit?", ta: "வரும்போது என்ன எடுத்து வர வேண்டும்?" },
    a: { en: "Please bring any earlier X-rays, scans, reports and prescriptions, and the medicines you take now.",
         ta: "பழைய எக்ஸ்-ரே, ஸ்கேன், ரிப்போர்ட்டுகள், மருந்துச் சீட்டுகள் மற்றும் இப்போது சாப்பிடும் மருந்துகளை எடுத்து வரவும்." } },
];
