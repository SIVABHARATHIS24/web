/* ==========================================================================
   Varnika Speciality Hospital: site content
   --------------------------------------------------------------------------
   Edit this file to update clinic details, services and FAQs. Every page
   reads from here, so a change made once shows up everywhere.
   ========================================================================== */

window.SITE = {
  name: "Varnika Speciality Hospital",
  type: "Orthopaedics · Keeramangalam",
  domain: "varnikahospital.in",
  phone: "+91 91599 98099",
  whatsapp: "919159998099", // country code + number, digits only
  address: "No. 2, Annai Vaniha Valagam, Keeramangalam, Opposite to Bus Terminus, Alangudi Taluk, Pudukottai – 614 624",
  addressShort: "Opp. Bus Terminus, Keeramangalam, Alangudi Tk, Pudukottai",
  // Google Maps pin for the clinic, used by every "Get directions" button.
  mapLink: "https://maps.app.goo.gl/VpykLbZAs5YMKypq6",
  // Used for the embedded map on the Contact page. For an exact pin, replace
  // with the clinic's coordinates, e.g. "10.4050,79.0500".
  mapQuery: "Keeramangalam Bus Stand, Pudukkottai 614624",
  // Same hours every day of the week, including Sundays and holidays.
  hours: ["17:00", "21:00"],
  doctor: {
    name: "Dr. S. SIVABHARATHI",
    initials: "SS",
    quals: "MBBS, MS (Ortho)",
    title: "Consultant Orthopaedic Surgeon",
    reg: "114118",
    photo: "img/doctor.jpg", // add the photo at this path; initials show until then
  },
};

// Facilities available at the clinic itself.
window.FACILITIES = [
  { icon: "stethoscope", title: "Doctor consultation", text: "Examination and treatment advice by the orthopaedic surgeon." },
  { icon: "scan", title: "X-ray", text: "X-rays taken at the clinic, so you don't need to go elsewhere first." },
  { icon: "activity", title: "ECG", text: "Heart tracing, for example as a check before surgery." },
  { icon: "flask", title: "Clinical laboratory", text: "Basic blood and urine investigations." },
];

/* Orthopaedic services.
   where: "clinic" = done at the clinic, "hospital" = surgery done by the
   doctor at a nearby hospital. Some services include both. */
window.SERVICE_GROUPS = [
  { id: "all", name: "All" },
  { id: "trauma", name: "Trauma & fractures" },
  { id: "joints", name: "Joints & sports" },
  { id: "spine", name: "Spine" },
  { id: "children", name: "Children" },
  { id: "procedures", name: "Clinic procedures" },
  { id: "surgery", name: "Surgeries" },
];

window.SERVICES = [
  { group: "trauma", icon: "bandage", title: "Fracture & trauma care", where: ["clinic", "hospital"],
    text: "Care for broken bones and injuries from accidents, falls and work, from first assessment to recovery.",
    items: ["Fractures of the arm, leg, wrist, ankle, hip and more", "Plaster casts, slabs and splints", "Closed reduction (setting a bone without an operation)", "Dislocations of the shoulder, elbow, finger and more", "Operation for fractures when needed, at a nearby hospital"] },
  { group: "trauma", icon: "shield", title: "Soft tissue injuries", where: ["clinic"],
    text: "Injuries to muscles, ligaments and tendons.",
    items: ["Sprains and strains", "Muscle and ligament tears", "Wounds, dressings and suture removal", "Crush injuries of the hand and foot"] },
  { group: "joints", icon: "bone", title: "Knee, hip & joint pain", where: ["clinic", "hospital"],
    text: "Diagnosis and treatment of painful, stiff or swollen joints.",
    items: ["Knee and hip osteoarthritis", "Rheumatoid and other inflammatory arthritis", "Gout", "Joint injections", "Knee and hip replacement, at a nearby hospital"] },
  { group: "joints", icon: "dumbbell", title: "Sports injuries", where: ["clinic", "hospital"],
    text: "Injuries from sport, exercise and active work.",
    items: ["Ligament injuries of the knee (ACL, PCL, MCL)", "Meniscus tears", "Ankle sprains and instability", "Tendon problems", "Arthroscopic (keyhole) surgery, at a nearby hospital"] },
  { group: "joints", icon: "person", title: "Shoulder & elbow", where: ["clinic", "hospital"],
    text: "Pain, stiffness and weakness in the shoulder and elbow.",
    items: ["Frozen shoulder", "Rotator cuff problems", "Recurrent shoulder dislocation", "Tennis elbow and golfer's elbow"] },
  { group: "joints", icon: "hand", title: "Hand & wrist", where: ["clinic", "hospital"],
    text: "Problems that affect the grip and fine movements.",
    items: ["Carpal tunnel syndrome", "Trigger finger", "De Quervain's tenosynovitis", "Ganglion cysts", "Hand and wrist fractures"] },
  { group: "joints", icon: "footprints", title: "Foot & ankle", where: ["clinic", "hospital"],
    text: "Pain and deformities of the foot and ankle.",
    items: ["Heel pain and plantar fasciitis", "Achilles tendon problems", "Flat feet", "Bunions and toe deformities", "Diabetic foot problems"] },
  { group: "spine", icon: "spine", title: "Back & neck pain", where: ["clinic", "hospital"],
    text: "Assessment and treatment of spine problems.",
    items: ["Low back pain and neck pain", "Disc prolapse and sciatica", "Cervical and lumbar spondylosis", "Spine fractures", "Spine surgery when needed, at a nearby hospital"] },
  { group: "children", icon: "baby", title: "Paediatric orthopaedics", where: ["clinic", "hospital"],
    text: "Bone and joint problems in babies, children and teenagers.",
    items: ["Clubfoot (CTEV) — Ponseti casting", "Children's fractures", "Bow legs and knock knees", "Limping child", "Hip problems in babies (DDH)", "Flat feet and walking problems"] },
  { group: "joints", icon: "shield", title: "Bone health", where: ["clinic"],
    text: "Keeping bones strong, especially as you get older.",
    items: ["Osteoporosis assessment and treatment", "Vitamin D and calcium deficiency", "Fall and fracture prevention advice", "Bone infections and bone swellings (assessment)"] },
  { group: "procedures", icon: "syringe", title: "Procedures at the clinic", where: ["clinic"],
    text: "Minor procedures done at the clinic itself.",
    items: ["Plaster cast application and removal", "Splinting and strapping", "Joint aspiration (removing fluid)", "Joint and soft-tissue injections", "Wound dressing and suture removal"] },
  { group: "surgery", icon: "hospital", title: "Surgeries at a nearby hospital", where: ["hospital"],
    text: "When an operation is needed, the doctor performs it at a nearby hospital and continues your follow-up at the clinic.",
    items: ["Fracture fixation (plates, nails, screws, wires)", "Arthroscopy (keyhole joint surgery)", "Knee and hip replacement", "Spine surgery", "Implant removal", "Deformity correction in children and adults"] },
];

window.FAQS = [
  { q: "What are the clinic timings?", a: "The clinic is open from 5 PM to 9 PM every day, including Sundays and holidays." },
  { q: "Is the clinic open 24 hours?", a: "No. The clinic is open only from 5 PM to 9 PM. For serious injuries outside these hours, please go to the nearest hospital emergency department or call 108 for an ambulance." },
  { q: "Do I need an appointment?", a: "You can walk in during clinic hours. Booking a time in advance helps us plan and can reduce your waiting time." },
  { q: "Can I get an X-ray, ECG or blood test at the clinic?", a: "Yes. X-ray, ECG and basic laboratory investigations are available at the clinic." },
  { q: "Where are operations done?", a: "The clinic does not have an operation theatre. When surgery is needed, the doctor performs it at a nearby hospital and explains the plan and arrangements during your consultation." },
  { q: "Do you treat children?", a: "Yes. We see children of all ages with fractures, clubfoot, bow legs, flat feet, limping and other bone and joint problems." },
  { q: "What should I bring to my visit?", a: "Please bring any earlier X-rays, scans, reports and prescriptions, and a list of the medicines you take." },
];
