/**
 * Stub catalog data for milestone 1 — every screen reads from this module.
 *
 * Content is carried over from the original NBRI Academy HTML prototype and the
 * official site. Copy shown to visitors is bilingual (`l(en, id)`); names and
 * program titles that are the same in both languages stay plain strings.
 * Anything that could not be confirmed is flagged `verified: false` so the
 * public UI labels it instead of presenting it as fact.
 * A later milestone replaces this file with Netlify Database queries managed
 * from the Admin Dashboard (see PLAN.md).
 *
 * No discounts or promotions are published yet (it is too early), so there is
 * no promotion data here.
 */

import { l, type L, type Text } from "./text";

export type CategoryId = "battery-school" | "industrial" | "tot" | "edutech";
export type Level = "Basic" | "Intermediate" | "Advanced";
export type Mode = "offline" | "online";
/** available: can be bought now · quote: corporate enquiry · coming-soon: not yet sold */
export type Availability = "available" | "quote" | "coming-soon";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: L;
  image: string;
}

export interface Session {
  id: string;
  start: string; // ISO date, local Jakarta day
  end: string;
  seatsTotal: number;
  seatsLeft: number;
}

export interface VariantGroup {
  label: L;
  options: { label: L; surcharge: number }[];
}

export interface Course {
  slug: string;
  title: Text;
  category: CategoryId;
  mode: Mode;
  level: Level;
  duration: L;
  location: Text;
  availability: Availability;
  /** Price in IDR. 0 = free, null = price on request. */
  price: number | null;
  /** True when the price is an illustrative example awaiting admin confirmation. */
  priceIsExample?: boolean;
  summary: L;
  outcomes: L[];
  agenda: L[];
  sessions: Session[];
  variants: VariantGroup[];
  instructor: { name: string; role: Text } | null;
  /** Notes the admin must resolve before this listing is final (internal). */
  verificationNotes: string[];
}

export const CONTACT = {
  whatsapp: "6281181251717",
  whatsappDisplay: "+62 811 8125 1717",
  email: "admin@n-bri.org",
  social: [
    {
      network: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/nbri.indonesia/",
    },
    {
      network: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/69897535/",
    },
    {
      network: "youtube",
      label: "YouTube",
      url: "https://www.youtube.com/@nbri.indonesia",
    },
    {
      network: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/nbri.indonesia/",
    },
    { network: "x", label: "X", url: "https://x.com/nbri_indonesia" },
  ] as const,
  address:
    "Indonesian Life Sciences Center, Zona Bisnis Teknologi Kawasan Puspiptek BRIN, Pengasinan, Gunung Sindur, Bogor Regency, West Java 16340",
};

/** Bank details are placeholders in the prototype — admin must enter the official account. */
export const BANK_ACCOUNTS: {
  bank: L;
  accountNumber: string | null;
  holder: string;
  verified: boolean;
}[] = [
  {
    bank: l("Bank (set by admin)", "Bank (diatur admin)"),
    accountNumber: null,
    holder: "National Battery Research Institute",
    verified: false,
  },
];

/** Hours a customer has to transfer before an unpaid order expires. */
export const PAYMENT_WINDOW_HOURS = 24;
export const MAX_TICKETS_PER_LINE = 6;

export const CATEGORIES: Category[] = [
  {
    id: "battery-school",
    name: "Battery School",
    tagline: l(
      "Two-day in-person class with laboratory practice",
      "Kelas offline 2 hari dengan praktik laboratorium",
    ),
    image: "/img/cat-battery-school.png",
  },
  {
    id: "industrial",
    name: "Industrial Training",
    tagline: l(
      "Custom corporate program, 3–5 days",
      "Program khusus perusahaan, 3–5 hari",
    ),
    image: "/img/cat-industrial.png",
  },
  {
    id: "tot",
    name: "Training of Trainers",
    tagline: l(
      "Developing battery & EV instructors",
      "Mencetak instruktur baterai & EV",
    ),
    image: "/img/cat-tot.png",
  },
  {
    id: "edutech",
    name: "Online Learning",
    tagline: l(
      "Self-paced courses and live online sessions",
      "Kursus mandiri dan sesi online langsung",
    ),
    image: "/img/cat-edutech.png",
  },
];

const WORKSHOP_PACKAGES: VariantGroup[] = [
  {
    label: l("Package", "Paket"),
    options: [
      { label: l("Standard", "Standar"), surcharge: 0 },
      {
        label: l(
          "Plus: lab kit + printed certificate",
          "Plus: lab kit + sertifikat cetak",
        ),
        surcharge: 750000,
      },
    ],
  },
];

const ONLINE_ACCESS: VariantGroup[] = [
  {
    label: l("Access", "Akses"),
    options: [
      { label: l("1 year", "1 tahun"), surcharge: 0 },
      { label: l("Lifetime", "Selamanya"), surcharge: 100000 },
    ],
  },
];

const TWO_DAYS = l("2 days", "2 hari");
const WORKSHOP_LOCATION = "NBRI Workshop, Puspiptek BRIN";
const ONLINE_LOCATION = l("Self-paced online", "Belajar mandiri online");
const INSTRUCTOR_NOTE = "Instructor not yet assigned";
const NEXT_DATE_NOTE = "Next date not yet announced";

export const COURSES: Course[] = [
  {
    slug: "lithium-ion-battery-safety",
    title: "Lithium Ion Battery Safety & Fire Risk Mitigation in EV",
    category: "battery-school",
    mode: "offline",
    level: "Basic",
    duration: TWO_DAYS,
    location: WORKSHOP_LOCATION,
    availability: "available",
    price: 5000000,
    summary: l(
      "Understand thermal runaway, fire-risk mitigation and emergency response for EV batteries, with hands-on laboratory sessions.",
      "Pahami thermal runaway, mitigasi risiko kebakaran dan tanggap darurat pada baterai EV, lengkap dengan sesi praktik laboratorium.",
    ),
    outcomes: [
      l(
        "Recognise thermal runaway triggers",
        "Mengenali pemicu thermal runaway",
      ),
      l(
        "Apply risk mitigation protocols",
        "Menerapkan protokol mitigasi risiko",
      ),
      l(
        "Handle & store batteries safely",
        "Menangani & menyimpan baterai dengan aman",
      ),
      l("Emergency response simulation", "Simulasi tanggap darurat"),
    ],
    agenda: [
      l(
        "Day 1 · Cell chemistry & failure modes",
        "Hari 1 · Kimia sel & mode kegagalan",
      ),
      l(
        "Day 1 · Lab: abuse test observation",
        "Hari 1 · Lab: pengamatan uji abuse",
      ),
      l(
        "Day 2 · Pack-level safety design",
        "Hari 2 · Desain keselamatan level pack",
      ),
      l(
        "Day 2 · Emergency response & certification",
        "Hari 2 · Tanggap darurat & sertifikasi",
      ),
    ],
    sessions: [
      {
        id: "safety-2026-10",
        start: "2026-10-28",
        end: "2026-10-29",
        seatsTotal: 30,
        seatsLeft: 0,
      },
    ],
    variants: WORKSHOP_PACKAGES,
    instructor: null,
    verificationNotes: [INSTRUCTOR_NOTE, NEXT_DATE_NOTE],
  },
  {
    slug: "advanced-material-processing",
    title:
      "Advanced Material Processing in Battery Technology: From Nickel to Battery",
    category: "battery-school",
    mode: "offline",
    level: "Basic",
    duration: TWO_DAYS,
    location: WORKSHOP_LOCATION,
    availability: "available",
    price: 6000000,
    summary: l(
      "Upstream to downstream: nickel processing, cathode precursor chemistry, through to battery cell fabrication.",
      "Dari hulu ke hilir: pengolahan nikel, kimia prekursor katoda, hingga fabrikasi sel baterai.",
    ),
    outcomes: [
      l(
        "Understand the nickel-to-cell value chain",
        "Memahami rantai nilai nikel hingga sel",
      ),
      l(
        "HPAL process & precursor synthesis",
        "Proses HPAL & sintesis prekursor",
      ),
      l("Select cathode materials", "Memilih material katoda"),
      l("Assess ESG impact", "Menilai dampak ESG"),
    ],
    agenda: [
      l("Day 1 · Raw materials & HPAL", "Hari 1 · Bahan baku & HPAL"),
      l("Day 1 · High-purity nickel", "Hari 1 · Nikel kemurnian tinggi"),
      l(
        "Day 2 · Electrode & cell fabrication",
        "Hari 2 · Fabrikasi elektroda & sel",
      ),
      l("Day 2 · Lab tour & Q&A", "Hari 2 · Tur lab & tanya jawab"),
    ],
    sessions: [
      {
        id: "material-2026-04",
        start: "2026-04-28",
        end: "2026-04-29",
        seatsTotal: 30,
        seatsLeft: 0,
      },
      {
        id: "material-2026-08",
        start: "2026-08-27",
        end: "2026-08-28",
        seatsTotal: 30,
        seatsLeft: 0,
      },
      {
        id: "material-2026-12",
        start: "2026-12-15",
        end: "2026-12-16",
        seatsTotal: 30,
        seatsLeft: 29,
      },
    ],
    variants: WORKSHOP_PACKAGES,
    instructor: null,
    verificationNotes: [INSTRUCTOR_NOTE],
  },
  {
    slug: "battery-standard-performance-safety-ev",
    title:
      "Battery Standard, Performance, and Safety in Electric Vehicles (EV)",
    category: "battery-school",
    mode: "offline",
    level: "Basic",
    duration: TWO_DAYS,
    location: WORKSHOP_LOCATION,
    availability: "available",
    price: 7000000,
    summary: l(
      "Standards, performance and safety of electric-vehicle batteries for industry practitioners.",
      "Standar, performa dan keselamatan baterai kendaraan listrik untuk praktisi industri.",
    ),
    outcomes: [
      l("Read EV battery standards", "Membaca standar baterai EV"),
      l("Evaluate battery performance", "Mengevaluasi performa baterai"),
      l("Apply safety practices", "Menerapkan praktik keselamatan"),
      l("Build a compliance checklist", "Menyusun checklist kepatuhan"),
    ],
    agenda: [
      l("Day 1 · Standards & regulation", "Hari 1 · Standar & regulasi"),
      l("Day 1 · Performance metrics", "Hari 1 · Metrik performa"),
      l("Day 2 · Safety & testing", "Hari 2 · Keselamatan & pengujian"),
      l("Day 2 · Case studies", "Hari 2 · Studi kasus"),
    ],
    sessions: [
      {
        id: "standard-2026-06",
        start: "2026-06-03",
        end: "2026-06-04",
        seatsTotal: 30,
        seatsLeft: 0,
      },
    ],
    variants: WORKSHOP_PACKAGES,
    instructor: null,
    verificationNotes: [INSTRUCTOR_NOTE, NEXT_DATE_NOTE],
  },
  {
    slug: "battery-energy-storage-system",
    title: "Battery Energy Storage System for Residential and Industry",
    category: "battery-school",
    mode: "offline",
    level: "Intermediate",
    duration: TWO_DAYS,
    location: WORKSHOP_LOCATION,
    availability: "available",
    price: 7000000,
    summary: l(
      "Design and deployment of battery energy storage systems (BESS) for homes and industry.",
      "Desain dan penerapan sistem penyimpanan energi baterai (BESS) untuk rumah tangga dan industri.",
    ),
    outcomes: [
      l("BESS components & architecture", "Komponen & arsitektur BESS"),
      l("System sizing", "Sizing sistem"),
      l("Integration with renewables", "Integrasi dengan energi terbarukan"),
      l("Safety & operations", "Aspek keselamatan & operasi"),
    ],
    agenda: [
      l("Day 1 · BESS fundamentals", "Hari 1 · Dasar BESS"),
      l("Day 1 · Sizing & design", "Hari 1 · Sizing & desain"),
      l("Day 2 · Integration & operations", "Hari 2 · Integrasi & operasi"),
      l("Day 2 · Industry case studies", "Hari 2 · Studi kasus industri"),
    ],
    sessions: [
      {
        id: "bess-2026-07",
        start: "2026-07-14",
        end: "2026-07-15",
        seatsTotal: 30,
        seatsLeft: 0,
      },
    ],
    variants: WORKSHOP_PACKAGES,
    instructor: null,
    verificationNotes: [INSTRUCTOR_NOTE, NEXT_DATE_NOTE],
  },
  {
    slug: "industrial-training",
    title: l(
      "Industrial Training: Custom Corporate Program",
      "Industrial Training: Program Khusus Perusahaan",
    ),
    category: "industrial",
    mode: "offline",
    level: "Intermediate",
    duration: l("3–5 days", "3–5 hari"),
    location: l("Your site or Puspiptek", "Lokasi Anda atau Puspiptek"),
    availability: "quote",
    price: null,
    summary: l(
      "An exclusive corporate program designed around your team: a diagnostics-based approach, flexible scheduling, a confidential curriculum and a program impact report.",
      "Program eksklusif korporat yang dirancang untuk kebutuhan tim Anda: pendekatan berbasis diagnostik, jadwal fleksibel, kurikulum rahasia dan laporan dampak program.",
    ),
    outcomes: [
      l("Team needs diagnostics", "Diagnostik kebutuhan tim"),
      l("Custom curriculum", "Kurikulum khusus"),
      l(
        "Practice with industrial equipment",
        "Praktik dengan peralatan industri",
      ),
      l("Program Impact Report", "Program Impact Report"),
    ],
    agenda: [
      l("Diagnostics", "Diagnostik"),
      l("Curriculum design", "Desain kurikulum"),
      l("3–5 day delivery", "Pelaksanaan 3–5 hari"),
      l("Impact report", "Laporan dampak"),
    ],
    sessions: [],
    variants: [],
    instructor: null,
    verificationNotes: [],
  },
  {
    slug: "training-of-trainers",
    title: "Training of Trainers (TOT) Battery & EV",
    category: "tot",
    mode: "offline",
    level: "Advanced",
    duration: l("5 days", "5 hari"),
    location: "Puspiptek BRIN",
    availability: "quote",
    price: null,
    summary: l(
      "Develop the knowledge, technical competencies and instructional skills needed to teach battery and electric-vehicle technology.",
      "Mencetak instruktur ahli untuk pendidikan teknologi baterai dan kendaraan listrik.",
    ),
    outcomes: [
      l("Design a battery curriculum", "Merancang kurikulum baterai"),
      l("Deliver technical material", "Menyampaikan materi teknis"),
      l("Lead lab practice", "Memimpin praktik lab"),
      l("Assess participants", "Menilai peserta"),
    ],
    agenda: [
      l("Pedagogy", "Pedagogi"),
      l("Technical deep dive", "Pendalaman teknis"),
      l("Teaching practice", "Praktik mengajar"),
      l("Instructor certification", "Sertifikasi instruktur"),
    ],
    sessions: [],
    variants: [],
    instructor: null,
    verificationNotes: [],
  },
  {
    slug: "battery-pack-handling-2w-ev",
    title: "Battery Pack Handling, Safety, Risk Mitigation & Recycling (2W-EV)",
    category: "edutech",
    mode: "online",
    level: "Basic",
    duration: l("6 hours · 24 lessons", "6 jam · 24 materi"),
    location: ONLINE_LOCATION,
    availability: "coming-soon",
    price: 350000,
    priceIsExample: true,
    summary: l(
      "A video course based on the May 2026 training on handling, safety, risk mitigation and recycling of two-wheeler battery packs.",
      "Kursus video berbasis pelatihan Mei 2026 tentang penanganan, keselamatan, mitigasi risiko dan daur ulang battery pack kendaraan roda dua.",
    ),
    outcomes: [
      l("Handle 2W-EV packs", "Menangani pack 2W-EV"),
      l("Understand recycling pathways", "Memahami jalur daur ulang"),
      l("Identify damaged packs", "Mengenali pack rusak"),
      l("Quizzes & certificate", "Kuis & sertifikat"),
    ],
    agenda: [
      l("Module 1 · Pack anatomy", "Modul 1 · Anatomi pack"),
      l("Module 2 · Safe handling", "Modul 2 · Penanganan aman"),
      l("Module 3 · Risk mitigation", "Modul 3 · Mitigasi risiko"),
      l("Module 4 · Recycling", "Modul 4 · Daur ulang"),
    ],
    sessions: [],
    variants: ONLINE_ACCESS,
    instructor: null,
    verificationNotes: [
      "Price is an example",
      "Video lessons not yet uploaded",
      INSTRUCTOR_NOTE,
    ],
  },
  {
    slug: "pengantar-teknologi-baterai",
    title: l(
      "Introduction to Battery Technology",
      "Pengantar Teknologi Baterai",
    ),
    category: "edutech",
    mode: "online",
    level: "Basic",
    duration: l("1.5 hours · 8 lessons", "1,5 jam · 8 materi"),
    location: ONLINE_LOCATION,
    availability: "coming-soon",
    price: 0,
    summary: l(
      "A free introduction to how batteries work, key terms, applications, and career paths in the battery industry.",
      "Pengenalan gratis cara kerja baterai, istilah kunci, penerapan, dan jalur karier di industri baterai.",
    ),
    outcomes: [
      l("Battery cell basics", "Dasar sel baterai"),
      l("Key terms", "Istilah kunci"),
      l("Battery applications", "Penerapan baterai"),
      l("Next steps", "Langkah berikutnya"),
    ],
    agenda: [
      l("Lesson 1 · What is a battery", "Materi 1 · Apa itu baterai"),
      l("Lesson 2 · Chemistry", "Materi 2 · Kimia"),
      l("Lesson 3 · Applications", "Materi 3 · Aplikasi"),
      l("Lesson 4 · Careers", "Materi 4 · Karier"),
    ],
    sessions: [],
    variants: [],
    instructor: null,
    verificationNotes: ["Video lessons not yet uploaded"],
  },
];

/**
 * Institution figures as published on the official NBRI Academy site
 * (nbriacademy.n-bri.org, "Building Expertise in the Battery Ecosystem").
 */
export const STATS = {
  verified: true,
  items: [
    { value: "1000+", label: l("Participants trained", "Peserta terlatih") },
    {
      value: "100+",
      label: l("Industries & institutions", "Industri & institusi"),
    },
    { value: "80", label: l("Activities", "Kegiatan") },
    { value: "10", label: l("Training programs", "Program pelatihan") },
  ],
};

export interface PartnerLogo {
  name: string;
  logo?: string;
  /** Shown beside a symbol-only mark whose official wordmark isn't legible at small size. */
  label?: string;
  /** The official logo only exists in white, so it sits on a navy tile. */
  dark?: boolean;
}

/**
 * Organisations shown on the official site under "Trusted by experts from various
 * sectors". Logos are the original full-colour marks; entries without a logo
 * render as a name.
 */
export const PARTNERS: { verified: boolean; logos: PartnerLogo[] } = {
  verified: true,
  logos: [
    { name: "Pertamina", logo: "/img/logos-color/pertamina.png" },
    { name: "PLN", logo: "/img/logos-color/pln.png" },
    { name: "Toyota Indonesia", logo: "/img/logos-color/toyota-indonesia.png" },
    {
      name: "Komatsu Indonesia",
      logo: "/img/logos-color/komatsu-indonesia.png",
    },
    {
      name: "PT Century Batteries Indonesia",
      logo: "/img/logos-color/cbi-mark.png",
      label: "Century Batteries Indonesia",
    },
    { name: "Kementerian ESDM", logo: "/img/logos-color/esdm.png" },
    { name: "Bukit Asam", logo: "/img/logos-color/bukit-asam.png" },
    { name: "Sucofindo", logo: "/img/logos-color/sucofindo.png" },
    { name: "VKTR", logo: "/img/logos-color/vktr.png" },
    { name: "Pamapersada (PAMA)", logo: "/img/logos-color/pama.png" },
    { name: "Indonesia Battery Corporation", logo: "/img/logos-color/ibc.png" },
    { name: "Carsurin", logo: "/img/logos-color/carsurin.png" },
    { name: "Electrum", logo: "/img/logos-color/electrum.png" },
    {
      name: "Charged Indonesia",
      logo: "/img/logos-color/charged-mark.png",
      label: "Charged",
    },
    { name: "ALVA", logo: "/img/logos-color/alva-white.png", dark: true },
    { name: "ABC", logo: "/img/logos-color/abc.png" },
    { name: "GFA", logo: "/img/logos-color/gfa.png" },
    { name: "Qualis", logo: "/img/logos-color/qualis.png" },
    { name: "Lippo Malls", logo: "/img/logos-color/lippo-malls.png" },
    { name: "Treesse", logo: "/img/logos-color/treesse.png" },
  ],
};

export interface Testimonial {
  quote: L;
  name: string;
  org: Text;
  photo?: string;
  /** Organisation logo, when the official site publishes one. */
  orgLogo?: string;
  program?: string;
}

/**
 * Participant testimonials from the past year, supplied by NBRI. The Indonesian
 * text is the participant's original wording; the English is a faithful
 * translation. Don't add, merge or paraphrase quotes here.
 */
export const TESTIMONIALS: { verified: boolean; items: Testimonial[] } = {
  verified: true,
  items: [
    {
      quote: l(
        "My experience at Battery School was fun, and I gained a lot of new knowledge that I didn't get at my university.",
        "Pengalaman saya ikut di Battery School ini seru, dapat banyak ilmu baru yang nggak didapatkan di kampus saya.",
      ),
      name: "Fiona Angellinov",
      photo: "/img/people/fiona-angellinov.png",
      org: "Universitas Indonesia",
      orgLogo: "/img/logos-color/universitas-indonesia.png",
    },
    {
      quote: l(
        "It felt exciting, and I gained a lot of insight into the future use of batteries in Indonesia.",
        "Ngerasa seru dan banyak insight untuk penggunaan baterai ke masa depan di Indonesia.",
      ),
      name: "Kevin Vicario Aritonang",
      photo: "/img/people/kevin-vicario-aritonang.png",
      org: "PT PLN Mandau Cipta Tenaga Nusantara",
      orgLogo: "/img/logos-color/pln.png",
    },
    {
      quote: l(
        "What a battery is, what a battery pack is, and much more, I learned it all here.",
        "Apa itu baterai, apa itu baterai pack, dan lain-lain di sini saya belajar semua.",
      ),
      name: "Hilal Sayyid Abdurrobbani",
      photo: "/img/people/hilal-sayyid-abdurrobbani.png",
      org: l("Teacher at SMK AL-AMANAH", "Guru SMK AL-AMANAH"),
    },
    {
      quote: l(
        "Two days of learning here didn't feel like enough; we need more days, because here we don't only learn the practice, we also gain a solid understanding.",
        "Kami belajar di sini selama dua hari rasanya tidak cukup, perlu tambah hari, karena kami di sini bukan hanya belajar praktek tetapi dilengkapi dengan pemahaman.",
      ),
      name: "Ir. Sirmayanti, S.T., M.Eng., Ph.D, IPU, ASEAN Eng, APEC Eng",
      photo: "/img/people/sirmayanti.png",
      org: "Politeknik Negeri Ujung Pandang",
      orgLogo: "/img/logos-color/pnup.png",
    },
  ],
};

/** Workplaces/institutions of the participants whose testimonials are published. */
export const ALUMNI_WORKPLACES: { name: string; logo?: string }[] = [
  {
    name: "Universitas Indonesia",
    logo: "/img/logos-color/universitas-indonesia.png",
  },
  {
    name: "PT PLN Mandau Cipta Tenaga Nusantara",
    logo: "/img/logos-color/pln.png",
  },
  { name: "SMK AL-AMANAH" },
  {
    name: "Politeknik Negeri Ujung Pandang",
    logo: "/img/logos-color/pnup.png",
  },
];

/** Experts in the NBRI Academy network, as listed on nbriacademy.n-bri.org/experts. */
/**
 * Speakers who have taught at Battery School. Reynaldi Istanto and Pak Elly are
 * on hold and must not be listed anywhere on the site.
 */
export const EXPERTS: { name: string; role: Text; photo?: string }[] = [
  {
    name: "Prof. Dr. rer. nat. Evvy Kartini",
    role: l(
      "Founder, National Battery Research Institute (NBRI)",
      "Pendiri National Battery Research Institute (NBRI)",
    ),
    photo: "/img/experts/evvy-kartini.png",
  },
  {
    name: "Muhammad Firmansyah, S.E.",
    role: "CEO & Founder PT Infiniti Energi Indonesia · Program Director NBRI",
    photo: "/img/experts/muhammad-firmansyah.png",
  },
  {
    name: "Dr. Eka Rakhman Priandana",
    role: l(
      "Coordinator, e-Mobility Research Group, BRIN",
      "Koordinator Kelompok Riset e-Mobility, BRIN",
    ),
    photo: "/img/experts/eka-priandana.png",
  },
  {
    name: "Yoga Bagus Wicaksono",
    role: "Service & Solution Manager, Huawei — energy storage & digital power",
    photo: "/img/experts/yoga-wicaksono.png",
  },
  {
    name: "Hendro Kusumo",
    role: l(
      "Deputy for Standards Development, National Standardization Agency (BSN)",
      "Deputi Pengembangan Standar, Badan Standardisasi Nasional",
    ),
    photo: "/img/experts/hendro-kusumo.png",
  },
  {
    name: "Christian Priatmoko",
    role: "Business Development Manager, PT Sembcorp Energy Indonesia",
    photo: "/img/experts/christian-priatmoko.png",
  },
  {
    name: "Muhammad Fakhrudin, S.T.",
    role: l(
      "Researcher, Research Center for Advanced Materials, BRIN",
      "Peneliti, Pusat Riset Material Maju, BRIN",
    ),
    photo: "/img/experts/muhammad-fakhrudin.png",
  },
  {
    name: "Steven",
    role: l(
      "Director, PT Indonesia Puqing Recycling Technology",
      "Direktur PT Indonesia Puqing Recycling Technology",
    ),
    photo: "/img/experts/steven.png",
  },
  {
    name: "Jack Kim",
    role: l(
      "President Director, PT TDL Energy Indonesia",
      "Presiden Direktur PT TDL Energy Indonesia",
    ),
    photo: "/img/experts/jack-kim.png",
  },
  
];

/**
 * Alumni career stories. No real stories have been collected yet, so these are
 * clearly labelled illustrations of the format — replace with real alumni
 * (with their consent) before presenting them as fact.
 */
export const SUCCESS_STORIES = {
  verified: false,
  items: [
    {
      initials: "AR",
      persona: l(
        "Electrical vocational school graduate",
        "Lulusan SMK teknik listrik",
      ),
      from: l(
        "A regency in Central Java · no prior battery-industry experience",
        "Kabupaten di Jawa Tengah · belum pernah kerja di industri baterai",
      ),
      program: "Battery Safety & Fire Risk Mitigation",
      to: l(
        "Battery pack assembly technician",
        "Teknisi perakitan battery pack",
      ),
      workplace: l(
        "Electric motorcycle maker, West Java",
        "Produsen motor listrik, Jawa Barat",
      ),
      quote: l(
        "The lab practice gave me confidence in interviews — I could explain thermal runaway with real examples.",
        "Praktik lab membuat saya percaya diri saat wawancara — saya bisa menjelaskan thermal runaway dengan contoh nyata.",
      ),
    },
    {
      initials: "DS",
      persona: l(
        "Chemical engineering fresh graduate",
        "Fresh graduate teknik kimia",
      ),
      from: l(
        "A regional university in Sulawesi · no work experience",
        "Kampus daerah di Sulawesi · lulus tanpa pengalaman kerja",
      ),
      program: "Advanced Material Processing: Nickel to Battery",
      to: l("HPAL process engineer", "Process engineer HPAL"),
      workplace: l(
        "Nickel smelter, Central Sulawesi",
        "Smelter nikel, Sulawesi Tengah",
      ),
      quote: l(
        "I came to understand the value chain from nickel to battery cell — exactly what was asked in the selection process.",
        "Saya jadi paham rantai nilai nikel sampai sel baterai, persis topik yang ditanyakan saat seleksi.",
      ),
    },
    {
      initials: "RH",
      persona: l(
        "Generator & solar panel technician",
        "Teknisi genset & panel surya",
      ),
      from: l(
        "A small service business in Sumatra",
        "Usaha servis kecil di Sumatera",
      ),
      program: "Battery Energy Storage System (BESS)",
      to: l("BESS field engineer", "Field engineer BESS"),
      workplace: l(
        "Renewable energy company, Jakarta",
        "Perusahaan energi terbarukan, Jakarta",
      ),
      quote: l(
        "After learning BESS sizing, I moved from generator servicing to energy-storage projects.",
        "Setelah belajar sizing BESS, saya pindah dari servis genset ke proyek penyimpanan energi.",
      ),
    },
  ],
};

export const PAST_PROGRAMS: { title: Text; date: string }[] = [
  {
    title:
      "Training Battery Handling, Safety, Risk Mitigation, and Recycling of Battery Pack 2W-EV",
    date: "2026-05-28",
  },
  {
    title: l(
      "ESG in the Battery Materials Industry: New Standards for Energy Sustainability",
      "ESG dalam Industri Material Baterai: Standar Baru untuk Keberlanjutan Energi",
    ),
    date: "2026-04-28",
  },
  {
    title: l(
      "HPAL in the Battery Industry: Key Technology for Nickel Production",
      "Proses HPAL dalam Industri Baterai: Teknologi Kunci Produksi Nickel",
    ),
    date: "2026-04-28",
  },
];

export const FAQ: { q: L; a: L }[] = [
  {
    q: l(
      "Where are in-person trainings held?",
      "Di mana pelatihan offline dilaksanakan?",
    ),
    a: l(
      "At the NBRI Workshop, Puspiptek BRIN area, Gn. Sindur, Bogor Regency, West Java.",
      "Di NBRI Workshop, Kawasan Puspiptek BRIN, Gn. Sindur, Kabupaten Bogor, Jawa Barat.",
    ),
  },
  {
    q: l("How long is each program?", "Berapa lama setiap program?"),
    a: l(
      "Battery School runs for 2 days, Industrial Training for 3–5 days, and Training of Trainers for 5 days.",
      "Battery School berlangsung 2 hari, Industrial Training 3–5 hari, dan TOT 5 hari.",
    ),
  },
  {
    q: l("Do I receive a certificate?", "Apakah saya mendapat sertifikat?"),
    a: l(
      "Yes, every program includes a verifiable certificate of completion.",
      "Ya, setiap program menyertakan sertifikat penyelesaian yang dapat diverifikasi.",
    ),
  },
  {
    q: l("How do I pay?", "Bagaimana cara membayar?"),
    a: l(
      "By direct bank transfer to the official NBRI account. After checkout, confirm via WhatsApp and attach your transfer receipt. Your ticket is activated once the admin verifies the payment.",
      "Transfer bank langsung ke rekening resmi NBRI. Setelah checkout, konfirmasi lewat WhatsApp dan lampirkan bukti transfer. Tiket aktif setelah admin memverifikasi dana masuk.",
    ),
  },
  {
    q: l('What does "seats left" mean?', 'Apa arti "kursi tersisa"?'),
    a: l(
      "The number of participant seats still available for that date. Your seat is locked in once your payment is verified.",
      "Jumlah kursi peserta yang masih tersedia pada jadwal tersebut. Kursi terkunci untuk Anda setelah pembayaran diverifikasi.",
    ),
  },
  {
    q: l(
      "Can my company request custom training?",
      "Bisakah perusahaan saya meminta pelatihan khusus?",
    ),
    a: l(
      "Yes. Industrial Training is designed around your team's needs, schedule and location. Contact us via WhatsApp.",
      "Bisa. Industrial Training dirancang sesuai kebutuhan, jadwal dan lokasi tim Anda. Hubungi kami via WhatsApp.",
    ),
  },
  {
    q: l(
      "When will online learning be available?",
      "Kapan kursus online tersedia?",
    ),
    a: l(
      "Online courses are being prepared. You can ask to be notified via WhatsApp on the course page.",
      "Kursus online sedang disiapkan. Anda dapat meminta pemberitahuan lewat WhatsApp di halaman kursus.",
    ),
  },
];
