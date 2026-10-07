import {
  Course,
  ResultItem,
  Testimonial,
  QuizQuestion,
  BentoFeature,
  GalleryItem,
  FaqItem,
  BatchSlot,
  MethodStep,
  ElementTile,
} from './types';

export const COURSES: Course[] = [
  {
    id: 'neet-chem',
    name: 'NEET Chemistry Masterclass',
    category: 'NEET',
    duration: '1 Year / 2 Years Program',
    description:
      'Built for medical aspirants. Complete coverage of physical, organic and inorganic chemistry with intensive MCQ practice and national-level simulated papers.',
    features: [
      'NCERT decoded line by line',
      'Daily practice problems with video solutions',
      'Organic reaction mechanisms from scratch',
      'Weekly NEET-pattern simulated exams',
    ],
    tag: 'NEET Aspirants',
    accentColor: 'rose',
  },
  {
    id: 'jee-chem',
    name: 'JEE Mains & Advanced Chemistry',
    category: 'JEE',
    duration: '1 Year / 2 Years Program',
    description:
      'A rigorous course built around analytical thinking and multi-step problem solving. Physical calculations, stereochemistry and inorganic reasoning for JEE Advanced.',
    features: [
      'Advanced numerical problem-solving sessions',
      'Inorganic reaction memory maps',
      'Twenty years of JEE papers discussed in class',
      'Time-management coaching for both papers',
    ],
    tag: 'JEE Mains & Advanced',
    accentColor: 'blue',
  },
  {
    id: 'class-11-chem',
    name: 'Class 11 Chemistry Concepts Booster',
    category: 'Boards',
    duration: '10 Months Program',
    description:
      'The foundation year of senior secondary science. Mole concept, chemical bonding and thermodynamics are rebuilt from first principles.',
    features: [
      'Every derivation explained on the board',
      'Bridge from school syllabus to competitive level',
      'Printed notes and study material included',
      'Chapter-wise objective and subjective tests',
    ],
    tag: 'Class 11th',
    accentColor: 'indigo',
  },
  {
    id: 'class-12-chem',
    name: 'Class 12 Boards with JEE / NEET Sync',
    category: 'Boards',
    duration: '10 Months Program',
    description:
      'Protect your board percentage while keeping entrance preparation aligned. Electrochemistry, kinetics and coordination compounds covered in depth.',
    features: [
      'Board-pattern answer writing practice',
      'Practical chemistry mock evaluations',
      'Rapid revision modules for Class 11 topics',
      'Full syllabus mocks with strict board grading',
    ],
    tag: 'Class 12th',
    accentColor: 'emerald',
  },
  {
    id: 'cbse-boards',
    name: 'CBSE & State Boards Edge',
    category: 'Boards',
    duration: '6 Months Crash Course',
    description:
      'A targeted six-month sprint for the board examinations, with special emphasis on high-yield questions, naming reactions and derivation-heavy chapters.',
    features: [
      'NCERT exercises solved in class',
      'Sample paper evaluation with feedback',
      'Formula and naming reaction cheatsheets',
      'Doubt-clearing sessions before the boards',
    ],
    tag: 'Boards Prep',
    accentColor: 'orange',
  },
  {
    id: 'foundation-chem',
    name: 'Junior Olympiad & Foundation Chemistry',
    category: 'Foundation',
    duration: '1 Year Program',
    description:
      'An early-start program for Class 9 and 10 students. Scientific aptitude, logical reasoning and first exposure to high-school chemistry concepts.',
    features: [
      'Demonstration experiments and visual models',
      'Aptitude and logical reasoning problems',
      'Early introduction to Class 11 topics',
      'NTSE and IJSO preparation track',
    ],
    tag: 'Class 9th & 10th',
    accentColor: 'amber',
  },
];

export const RESULTS: ResultItem[] = [
  {
    id: 'res-1',
    name: 'Aarav Sharma',
    rank: 'AIR 42',
    exam: 'NEET UG',
    score: '710 / 720',
    year: '2025',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=500',
    achievement: 'Chemistry perfect score, 180 out of 180',
  },
  {
    id: 'res-2',
    name: 'Ishaan Attri',
    rank: 'AIR 118',
    exam: 'JEE Advanced',
    score: '112 / 120 in Chemistry',
    year: '2025',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500',
    achievement: 'Admitted to IIT Bombay, Computer Science',
  },
  {
    id: 'res-3',
    name: 'Priya Verma',
    rank: '99.6%',
    exam: 'CBSE Class 12 Boards',
    score: '100 / 100 in Chemistry',
    year: '2025',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=500',
    achievement: 'State chemistry topper',
  },
  {
    id: 'res-4',
    name: 'Rahul Singhal',
    rank: 'AIR 235',
    exam: 'JEE Mains',
    score: '99.91 percentile in Chemistry',
    year: '2025',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=500',
    achievement: 'Admitted to IIT Delhi',
  },
  {
    id: 'res-5',
    name: 'Sneha Gupta',
    rank: 'AIR 312',
    exam: 'NEET UG',
    score: '695 / 720',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&h=500',
    achievement: 'Chemistry score 175 out of 180',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Aditya Raj',
    role: 'Student',
    review:
      'I used to memorise reactions. Attri Sir made me build them from the mechanism up, and NEET organic questions stopped feeling random.',
    rating: 5,
    course: 'NEET Chemistry Masterclass',
    avatarSeed: 'Aditya',
  },
  {
    id: 'test-2',
    name: 'Rekha Sharma',
    role: 'Parent',
    review:
      'Personal attention in a competitive batch is rare. The weekly score reports told me exactly where my son stood, without me having to ask.',
    rating: 5,
    course: 'Parent of Aarav, NEET AIR 42',
    avatarSeed: 'Rekha',
  },
  {
    id: 'test-3',
    name: 'Mehul Deshmukh',
    role: 'Student',
    review:
      'Physical chemistry numericals that took me five minutes now take under one. The shortcuts are built on derivations, not tricks.',
    rating: 5,
    course: 'JEE Mains & Advanced Chemistry',
    avatarSeed: 'Mehul',
  },
  {
    id: 'test-4',
    name: 'Vivek Verma',
    role: 'Parent',
    review:
      'Priya scored a perfect 100 in chemistry boards. The chapter notes and answer-writing practice carried her through the paper.',
    rating: 5,
    course: 'Parent of Priya, Boards topper',
    avatarSeed: 'Vivek',
  },
];

export const BENTO_FEATURES: BentoFeature[] = [
  {
    title: 'Concept clarity first',
    description:
      'Every mechanism, bond and formula is explained from first principles. Nothing is memorised without a reason behind it.',
    stat: '0',
    statLabel: 'chapters taught by rote',
    variant: 'image',
    image:
      'https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?auto=format&fit=crop&q=80&w=1200&h=900',
  },
  {
    title: 'Small batches',
    description: 'Interactive sessions with every student visible on the mentor radar.',
    stat: '18',
    statLabel: 'seats per batch',
    variant: 'accent',
  },
  {
    title: 'Weekly assessments',
    description: 'Timed papers on the NTA interface, followed by an error analysis class.',
    stat: '52',
    statLabel: 'tests per year',
    variant: 'plain',
  },
  {
    title: 'Daily doubt counters',
    description:
      'Open every evening after lectures. Bring an unsolved equation and leave with the reasoning, not just the answer.',
    stat: '6 PM',
    statLabel: 'counter opens daily',
    variant: 'pattern',
  },
  {
    title: 'Printed study material',
    description:
      'Structured booklets, NCERT summaries, reaction maps and updated question banks for NEET and JEE.',
    stat: '4',
    statLabel: 'bound volumes per year',
    variant: 'plain',
  },
  {
    title: 'Parent progress reports',
    description:
      'Attendance, mock scores and focus areas sent to parents on WhatsApp every month.',
    stat: '12',
    statLabel: 'reports a year',
    variant: 'accent',
  },
];

export const METHOD_STEPS: MethodStep[] = [
  {
    title: 'Diagnose',
    detail:
      'A baseline paper and a chapter-wise gap map in the first week, so teaching starts from where the student actually is.',
  },
  {
    title: 'Build',
    detail:
      'Concepts from first principles. Derivations on the board, mechanisms drawn step by step, no shortcut before the logic.',
  },
  {
    title: 'Drill',
    detail:
      'Daily practice problems with video solutions, weekly timed sets and a personal error notebook that travels with you.',
  },
  {
    title: 'Simulate',
    detail:
      'Full NEET and JEE pattern papers every Sunday, graded on the same marking scheme as the real examination.',
  },
];

export const BATCH_SCHEDULE: BatchSlot[] = [
  {
    id: 'batch-1',
    batch: 'NEET Foundation',
    audience: 'Class 11',
    days: 'Mon, Wed, Fri',
    time: '4:00 - 5:30 PM',
    seatsLeft: 6,
    seatsTotal: 18,
    mode: 'Offline + Online',
  },
  {
    id: 'batch-2',
    batch: 'NEET Target',
    audience: 'Class 12 & Droppers',
    days: 'Tue, Thu, Sat',
    time: '6:00 - 7:30 PM',
    seatsLeft: 4,
    seatsTotal: 18,
    mode: 'Offline + Online',
  },
  {
    id: 'batch-3',
    batch: 'JEE Advanced Chemistry',
    audience: 'Class 11 & 12',
    days: 'Mon, Wed, Fri',
    time: '6:30 - 8:00 PM',
    seatsLeft: 7,
    seatsTotal: 18,
    mode: 'Offline',
  },
  {
    id: 'batch-4',
    batch: 'Boards Master',
    audience: 'Class 11 & 12',
    days: 'Sat, Sun',
    time: '9:00 - 11:00 AM',
    seatsLeft: 9,
    seatsTotal: 20,
    mode: 'Offline + Online',
  },
  {
    id: 'batch-5',
    batch: 'Junior Foundation',
    audience: 'Class 9 & 10',
    days: 'Sat, Sun',
    time: '11:30 AM - 1:00 PM',
    seatsLeft: 12,
    seatsTotal: 20,
    mode: 'Offline',
  },
];

export const FAQS: FaqItem[] = [
  {
    question: 'How large are the batches?',
    answer:
      'Batches are capped at 18 students for entrance programmes and 20 for board and foundation programmes. Seats are not added mid-session.',
  },
  {
    question: 'Can my child attend a demo before enrolling?',
    answer:
      'Yes. Every student gets three free demo lectures and one doubt session before the fee is due. No card or advance payment is collected for the demo.',
  },
  {
    question: 'Are online or hybrid classes available?',
    answer:
      'NEET, Boards and Foundation batches run in hybrid mode. Live online students get the same tests, printed material and doubt-counter access as offline students.',
  },
  {
    question: 'What study material is included in the fee?',
    answer:
      'Printed chapter booklets, NCERT summaries, reaction maps, and question banks for NEET and JEE are included. Material is handed out chapter by chapter, not dumped at admission.',
  },
  {
    question: 'How do parents track progress?',
    answer:
      'Parents receive a WhatsApp progress report every month with attendance, mock scores and the topics that need attention. Subject teachers are available on the same line.',
  },
  {
    question: 'Are scholarships or fee instalments available?',
    answer:
      'Fees can be paid term-wise. Merit scholarships of up to 40 percent are offered through the Scholar Admission Test held before each session.',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    category: 'Classroom',
    title: 'Reading room and reference library',
    desc: 'Between lectures, students work through previous-year papers here.',
    imgUrl:
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200&h=800',
    aspect: 'video',
  },
  {
    id: 'gal-2',
    category: 'Lab',
    title: 'Titration practical',
    desc: 'Qualitative salt analysis and acid-base titration demonstration.',
    imgUrl:
      'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=900&h=900',
    aspect: 'square',
  },
  {
    id: 'gal-3',
    category: 'Events',
    title: 'Sunday mock test hall',
    desc: 'Full-length NEET and JEE papers run here every Sunday morning.',
    imgUrl:
      'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&q=80&w=1200&h=900',
    aspect: 'photo',
  },
  {
    id: 'gal-4',
    category: 'Lab',
    title: 'Microscope and crystal work',
    desc: 'Crystal structures and salt samples examined up close.',
    imgUrl:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=900&h=900',
    aspect: 'square',
  },
  {
    id: 'gal-5',
    category: 'Lab',
    title: 'Glassware and titration bench',
    desc: 'Acids, bases and a very steady hand over the burette.',
    imgUrl:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200&h=900',
    aspect: 'photo',
  },
  {
    id: 'gal-6',
    category: 'Events',
    title: 'Parent orientation',
    desc: 'Score-tracking systems and the year plan explained to parents.',
    imgUrl:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200&h=800',
    aspect: 'video',
  },
];

export const ELEMENT_TILES: ElementTile[] = [
  { symbol: 'H', number: 1, name: 'Hydrogen' },
  { symbol: 'C', number: 6, name: 'Carbon' },
  { symbol: 'N', number: 7, name: 'Nitrogen' },
  { symbol: 'O', number: 8, name: 'Oxygen' },
  { symbol: 'Na', number: 11, name: 'Sodium' },
  { symbol: 'Mg', number: 12, name: 'Magnesium' },
  { symbol: 'Al', number: 13, name: 'Aluminium' },
  { symbol: 'Si', number: 14, name: 'Silicon' },
  { symbol: 'P', number: 15, name: 'Phosphorus' },
  { symbol: 'S', number: 16, name: 'Sulphur' },
  { symbol: 'Cl', number: 17, name: 'Chlorine' },
  { symbol: 'K', number: 19, name: 'Potassium' },
  { symbol: 'Ca', number: 20, name: 'Calcium' },
  { symbol: 'Fe', number: 26, name: 'Iron' },
  { symbol: 'Cu', number: 29, name: 'Copper' },
  { symbol: 'Zn', number: 30, name: 'Zinc' },
  { symbol: 'Br', number: 35, name: 'Bromine' },
  { symbol: 'Ag', number: 47, name: 'Silver' },
  { symbol: 'I', number: 53, name: 'Iodine' },
  { symbol: 'Au', number: 79, name: 'Gold' },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which of the following organic compounds has the highest boiling point?',
    options: ['Butane', 'Butan-1-ol', 'Butanal', 'Ethoxyethane'],
    correctAnswer: 1,
    explanation:
      'Butan-1-ol forms strong intermolecular hydrogen bonds, which need significantly more energy to break than dipole-dipole interactions or London dispersion forces.',
  },
  {
    id: 2,
    question: 'Which element has the highest first ionisation enthalpy?',
    options: ['Nitrogen (N)', 'Oxygen (O)', 'Carbon (C)', 'Boron (B)'],
    correctAnswer: 0,
    explanation:
      'Nitrogen has a stable half-filled 2p subshell, which makes it more resistant to losing an electron than oxygen despite the lower nuclear charge.',
  },
  {
    id: 3,
    question: 'What is the molecular geometry of xenon tetrafluoride (XeF4)?',
    options: ['Tetrahedral', 'Square planar', 'Octahedral', 'Trigonal bipyramidal'],
    correctAnswer: 1,
    explanation:
      'XeF4 has six electron pairs, four bonding and two lone pairs. Under VSEPR theory the electron pairs sit octahedrally, but the molecular shape is square planar.',
  },
];
