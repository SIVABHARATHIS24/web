/* ==========================================================================
   Varnika Health Care — site content
   --------------------------------------------------------------------------
   Edit this file to update hospital details, departments, doctors, packages
   and FAQs. Every page reads from here, so a change made once shows up
   everywhere.

   NOTE: The contact details, doctor names and prices below are SAMPLE
   placeholders. Replace them with Varnika Health Care's real information
   before publishing.
   ========================================================================== */

window.SITE = {
  name: "Varnika Health Care",
  tagline: "Multi-Speciality Hospital",
  phone: "+91 98765 43210",
  emergencyPhone: "+91 98765 00108",
  whatsapp: "919876543210", // country code + number, digits only
  email: "care@varnikahealthcare.in",
  address: "No. 12, Main Road, Anna Nagar, Chennai, Tamil Nadu 600040",
  mapQuery: "Anna Nagar, Chennai", // used for the Google Maps embed on the Contact page
  founded: 2008,
  // OPD hours by weekday (0 = Sunday). null = closed. Emergency is 24/7 regardless.
  opdHours: {
    0: ["09:00", "13:00"],
    1: ["08:00", "20:00"],
    2: ["08:00", "20:00"],
    3: ["08:00", "20:00"],
    4: ["08:00", "20:00"],
    5: ["08:00", "20:00"],
    6: ["08:00", "18:00"],
  },
  social: { facebook: "#", instagram: "#", youtube: "#", linkedin: "#" },
};

window.DEPARTMENTS = [
  { id: "cardiology", name: "Cardiology", icon: "heart", group: "medical",
    short: "Complete heart care — from ECG and echo to angioplasty and cardiac rehab.",
    about: "Our cardiology team diagnoses and treats conditions of the heart and blood vessels, with a 24/7 cath lab and a dedicated cardiac ICU.",
    services: ["ECG, Echo & TMT", "Coronary angiography & angioplasty", "Pacemaker implantation", "Heart failure clinic", "Cardiac rehabilitation"] },
  { id: "neurology", name: "Neurology", icon: "brain", group: "medical",
    short: "Expert care for stroke, epilepsy, migraine, and nerve & spine disorders.",
    about: "Stroke-ready emergency protocols, EEG/EMG studies and long-term management of neurological conditions.",
    services: ["Stroke management", "EEG & nerve conduction studies", "Epilepsy & seizure clinic", "Headache & migraine clinic", "Movement disorders"] },
  { id: "orthopaedics", name: "Orthopaedics", icon: "bone", group: "surgical",
    short: "Joint replacement, sports injuries, fracture care and spine surgery.",
    about: "From a sprained ankle to a total knee replacement, our orthopaedic surgeons help you move freely again.",
    services: ["Knee & hip replacement", "Arthroscopy & sports injuries", "Fracture & trauma care", "Spine surgery", "Paediatric orthopaedics"] },
  { id: "paediatrics", name: "Paediatrics", icon: "baby", group: "women-child",
    short: "Gentle, child-friendly care from newborns to teenagers, with a Level III NICU.",
    about: "Vaccinations, growth monitoring, neonatal intensive care and treatment for childhood illnesses — in a space designed for kids.",
    services: ["Level III NICU", "Vaccination clinic", "Growth & development", "Paediatric emergency", "Child nutrition"] },
  { id: "obgyn", name: "Obstetrics & Gynaecology", icon: "venus", group: "women-child",
    short: "Pregnancy care, safe deliveries, fertility support and women's wellness.",
    about: "Comfortable birthing suites, high-risk pregnancy care and minimally invasive gynaecological surgery.",
    services: ["Antenatal & postnatal care", "Normal & C-section delivery", "High-risk pregnancy", "Fertility & IVF counselling", "Laparoscopic gynae surgery"] },
  { id: "general-medicine", name: "General Medicine", icon: "pill", group: "medical",
    short: "Your first stop for fever, diabetes, BP, infections and preventive check-ups.",
    about: "Our physicians manage acute illnesses and long-term conditions, and coordinate your care across specialities.",
    services: ["Diabetes & thyroid care", "Hypertension clinic", "Fever & infections", "Preventive health check-ups", "Geriatric care"] },
  { id: "general-surgery", name: "General & Laparoscopic Surgery", icon: "scissors", group: "surgical",
    short: "Keyhole surgery for gallbladder, hernia, appendix and more — faster recovery.",
    about: "Modular operation theatres and minimally invasive techniques mean less pain and shorter hospital stays.",
    services: ["Laparoscopic gallbladder surgery", "Hernia repair", "Appendectomy", "Piles & fistula (laser)", "Day-care surgery"] },
  { id: "ent", name: "ENT", icon: "ear", group: "surgical",
    short: "Ear, nose and throat care including sinus surgery and hearing tests.",
    about: "Endoscopic sinus surgery, tonsil and adenoid care, audiometry and treatment for vertigo.",
    services: ["Endoscopic sinus surgery", "Audiometry & hearing aids", "Tonsillectomy", "Vertigo clinic", "Voice & swallowing disorders"] },
  { id: "dermatology", name: "Dermatology", icon: "sparkles", group: "medical",
    short: "Skin, hair and nail care — acne, allergies, psoriasis and cosmetic treatments.",
    about: "Clinical and aesthetic dermatology using evidence-based treatments for all skin types.",
    services: ["Acne & scar treatment", "Psoriasis & eczema", "Hair loss clinic", "Chemical peels", "Skin allergy testing"] },
  { id: "ophthalmology", name: "Ophthalmology", icon: "eye", group: "surgical",
    short: "Cataract surgery, glaucoma care, retina checks and vision correction.",
    about: "Micro-incision cataract surgery and complete eye check-ups for every age.",
    services: ["Cataract surgery (MICS)", "Glaucoma care", "Diabetic retinopathy screening", "Paediatric eye care", "Spectacle & contact lens clinic"] },
  { id: "nephrology", name: "Nephrology & Dialysis", icon: "droplet", group: "medical",
    short: "Kidney care with a modern dialysis unit open seven days a week.",
    about: "Management of kidney disease, stones and hypertension, with a calm, well-equipped dialysis unit.",
    services: ["Haemodialysis", "Chronic kidney disease clinic", "Kidney stone management", "Renal transplant follow-up"] },
  { id: "emergency", name: "Emergency & Trauma", icon: "ambulance", group: "critical",
    short: "24/7 emergency room, ambulance service and critical care ICU.",
    about: "Our emergency department is staffed round the clock with emergency physicians, and backed by a 20-bed ICU.",
    services: ["24/7 emergency room", "Ambulance with life support", "Trauma care", "Critical care ICU", "Poison & burns care"] },
  { id: "radiology", name: "Radiology & Imaging", icon: "scan", group: "diagnostics",
    short: "Digital X-ray, ultrasound, CT and MRI with quick, accurate reports.",
    about: "In-house imaging means faster diagnosis and fewer trips for you.",
    services: ["Digital X-ray", "Ultrasound & Doppler", "CT scan", "MRI", "Mammography"] },
  { id: "laboratory", name: "Laboratory & Pathology", icon: "flask", group: "diagnostics",
    short: "Fully automated lab with home sample collection and online reports.",
    about: "Accurate, quality-controlled testing with most reports available the same day.",
    services: ["Blood tests & biochemistry", "Microbiology", "Histopathology", "Home sample collection", "Online report access"] },
  { id: "physiotherapy", name: "Physiotherapy & Rehab", icon: "person", group: "allied",
    short: "Recover strength and mobility after injury, surgery or stroke.",
    about: "Personalised rehab plans from experienced physiotherapists.",
    services: ["Post-surgery rehab", "Sports physiotherapy", "Stroke rehabilitation", "Back & neck pain", "Pain management"] },
  { id: "dental", name: "Dental Care", icon: "smile", group: "allied",
    short: "Check-ups, root canals, braces, implants and smile makeovers.",
    about: "Complete dental care for the whole family in a comfortable, hygienic setting.",
    services: ["Root canal treatment", "Dental implants", "Braces & aligners", "Teeth cleaning & whitening", "Paediatric dentistry"] },
];

window.DEPT_GROUPS = [
  { id: "all", name: "All" },
  { id: "medical", name: "Medical" },
  { id: "surgical", name: "Surgical" },
  { id: "women-child", name: "Women & Child" },
  { id: "critical", name: "Emergency" },
  { id: "diagnostics", name: "Diagnostics" },
  { id: "allied", name: "Allied care" },
];

// days: 0 = Sun … 6 = Sat. Sample doctors — replace with your real team.
window.DOCTORS = [
  { id: "arjun-mehta", name: "Dr. Arjun Mehta", dept: "cardiology", title: "Senior Consultant Cardiologist", quals: "MBBS, MD, DM (Cardiology)", exp: 18, langs: ["English", "Tamil", "Hindi"], days: [1, 2, 3, 4, 5, 6], rating: 4.9, color: "#0f8b8d" },
  { id: "kavya-raman", name: "Dr. Kavya Raman", dept: "obgyn", title: "Consultant Obstetrician & Gynaecologist", quals: "MBBS, MS (OBG), DNB", exp: 14, langs: ["English", "Tamil"], days: [1, 2, 3, 5, 6], rating: 4.9, color: "#e0607e" },
  { id: "rohan-iyer", name: "Dr. Rohan Iyer", dept: "orthopaedics", title: "Orthopaedic & Joint Replacement Surgeon", quals: "MBBS, MS (Ortho), FIJR", exp: 16, langs: ["English", "Tamil", "Malayalam"], days: [1, 3, 4, 6], rating: 4.8, color: "#3b82c4" },
  { id: "sneha-pillai", name: "Dr. Sneha Pillai", dept: "paediatrics", title: "Consultant Paediatrician & Neonatologist", quals: "MBBS, MD (Paed), Fellowship Neonatology", exp: 12, langs: ["English", "Tamil", "Malayalam"], days: [0, 1, 2, 3, 4, 5], rating: 5.0, color: "#f59e0b" },
  { id: "vikram-nair", name: "Dr. Vikram Nair", dept: "neurology", title: "Consultant Neurologist", quals: "MBBS, MD, DM (Neurology)", exp: 15, langs: ["English", "Malayalam", "Hindi"], days: [2, 4, 6], rating: 4.8, color: "#7c5cd6" },
  { id: "priya-subramanian", name: "Dr. Priya Subramanian", dept: "general-medicine", title: "Senior Physician & Diabetologist", quals: "MBBS, MD (Gen. Med.)", exp: 20, langs: ["English", "Tamil", "Telugu"], days: [1, 2, 3, 4, 5, 6], rating: 4.9, color: "#10a37f" },
  { id: "karthik-rao", name: "Dr. Karthik Rao", dept: "general-surgery", title: "Laparoscopic & General Surgeon", quals: "MBBS, MS, FMAS", exp: 13, langs: ["English", "Tamil", "Kannada"], days: [1, 2, 4, 5], rating: 4.7, color: "#ef6c4a" },
  { id: "ananya-krishnan", name: "Dr. Ananya Krishnan", dept: "dermatology", title: "Consultant Dermatologist", quals: "MBBS, MD (DVL)", exp: 9, langs: ["English", "Tamil"], days: [1, 3, 5, 6], rating: 4.8, color: "#d9467a" },
  { id: "suresh-babu", name: "Dr. Suresh Babu", dept: "ent", title: "ENT & Head-Neck Surgeon", quals: "MBBS, MS (ENT)", exp: 17, langs: ["English", "Tamil", "Telugu"], days: [2, 3, 5, 6], rating: 4.7, color: "#2b8fb0" },
  { id: "meera-joshi", name: "Dr. Meera Joshi", dept: "ophthalmology", title: "Cataract & Refractive Surgeon", quals: "MBBS, MS (Ophth), FICO", exp: 11, langs: ["English", "Hindi", "Marathi"], days: [1, 2, 4, 6], rating: 4.9, color: "#4c7bd9" },
  { id: "rahul-varma", name: "Dr. Rahul Varma", dept: "nephrology", title: "Consultant Nephrologist", quals: "MBBS, MD, DM (Nephrology)", exp: 12, langs: ["English", "Tamil", "Hindi"], days: [1, 3, 5], rating: 4.8, color: "#0e7490" },
  { id: "lakshmi-devi", name: "Dr. Lakshmi Devi", dept: "emergency", title: "Head — Emergency Medicine", quals: "MBBS, MD (Emergency Medicine)", exp: 14, langs: ["English", "Tamil"], days: [0, 1, 2, 3, 4, 5, 6], rating: 4.9, color: "#e5484d" },
  { id: "aditya-sharma", name: "Dr. Aditya Sharma", dept: "dental", title: "Consultant Dental Surgeon", quals: "BDS, MDS (Endodontics)", exp: 8, langs: ["English", "Hindi", "Tamil"], days: [1, 2, 3, 4, 5, 6], rating: 4.8, color: "#14a3a3" },
  { id: "divya-menon", name: "Dr. Divya Menon", dept: "physiotherapy", title: "Senior Physiotherapist", quals: "BPT, MPT (Ortho)", exp: 10, langs: ["English", "Malayalam", "Tamil"], days: [1, 2, 3, 4, 5, 6], rating: 4.9, color: "#8b5cf6" },
  { id: "sanjay-kumar", name: "Dr. Sanjay Kumar", dept: "radiology", title: "Consultant Radiologist", quals: "MBBS, MD (Radiodiagnosis)", exp: 15, langs: ["English", "Tamil", "Hindi"], days: [1, 2, 3, 4, 5, 6], rating: 4.7, color: "#64748b" },
  { id: "nisha-thomas", name: "Dr. Nisha Thomas", dept: "cardiology", title: "Interventional Cardiologist", quals: "MBBS, MD, DM (Cardiology)", exp: 10, langs: ["English", "Malayalam", "Tamil"], days: [0, 2, 4, 5], rating: 4.8, color: "#0b7a75" },
];

window.PACKAGES = [
  { name: "Basic Wellness", price: 1499, mrp: 2200, tests: 32, desc: "A smart yearly check for adults under 30.",
    items: ["Complete blood count", "Blood sugar (fasting)", "Lipid profile", "Liver & kidney function", "Urine routine", "Physician consultation"] },
  { name: "Executive Health", price: 3999, mrp: 6500, tests: 68, featured: true, desc: "Our most popular full-body check for busy professionals.",
    items: ["Everything in Basic", "HbA1c & thyroid profile", "ECG & chest X-ray", "Ultrasound abdomen", "Vitamin D & B12", "Diet & physician consultation"] },
  { name: "Senior Citizen Care", price: 4999, mrp: 8000, tests: 80, desc: "Thorough screening tailored for those above 60.",
    items: ["Everything in Executive", "Echo / TMT", "Bone density (BMD)", "Eye & ENT check-up", "PSA (men) / Pap smear (women)", "Cardiology consultation"] },
];

window.TESTIMONIALS = [
  { name: "Ramesh K.", detail: "Knee replacement patient", rating: 5, color: "#3b82c4",
    text: "Six weeks after my knee replacement I was walking to the temple again. The doctors explained everything clearly and the nurses treated me like family." },
  { name: "Divya S.", detail: "New mother", rating: 5, color: "#e0607e",
    text: "From my first scan to delivery, Varnika's maternity team was calm, kind and always available. The birthing suite felt like home." },
  { name: "Mohammed A.", detail: "Emergency care", rating: 5, color: "#e5484d",
    text: "My father had chest pain at 2 AM. The ambulance came quickly and the cardiac team was ready when we arrived. They saved his life." },
  { name: "Lakshmi P.", detail: "Diabetes clinic", rating: 5, color: "#10a37f",
    text: "My sugar levels are finally under control. The diabetes clinic gave me a plan I could actually follow, and they follow up every month." },
];

window.FAQS = [
  { q: "Do I need an appointment to see a doctor?", a: "Walk-ins are welcome during OPD hours, but booking an appointment online or by phone means a much shorter wait. Emergency care never needs an appointment — just come in or call our emergency line." },
  { q: "Which insurance and TPA cards do you accept?", a: "We accept most major health insurance providers and TPAs, as well as government schemes. Our insurance desk will help you with cashless approvals — bring your insurance card and a photo ID." },
  { q: "Is the emergency department open 24/7?", a: "Yes. Our emergency room, ICU, pharmacy, laboratory and ambulance service are available 24 hours a day, 7 days a week, including holidays." },
  { q: "Can I get my lab reports online?", a: "Yes. Most reports are ready the same day and are sent to your registered mobile number and email. You can also collect printed copies from the lab counter." },
  { q: "Do you offer home sample collection?", a: "Yes, we offer home sample collection for blood and urine tests within the city. Call us or message us on WhatsApp to schedule a convenient time." },
  { q: "What should I bring for my first visit?", a: "Please bring a photo ID, any previous prescriptions or medical reports, a list of medicines you take, and your insurance card if applicable." },
];
