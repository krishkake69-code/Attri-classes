import { Course, ResultItem, Testimonial, QuizQuestion, FeatureCard } from './types';

export const COURSES: Course[] = [
  {
    id: 'neet-chem',
    name: 'NEET Chemistry Masterclass',
    category: 'NEET',
    duration: '1 Year / 2 Years Program',
    description: 'Designed specifically for medical aspirants. Complete coverage of physical, organic, and inorganic chemistry with intensive MCQ practice and national-level mock tests.',
    features: [
      'NCERT Line-by-Line Decoded',
      'Daily Practice Problems (DPPs) with video solutions',
      'Special focus on Organic reaction mechanisms',
      'Weekly NEET-pattern simulated exams'
    ],
    tag: 'NEET Aspirants',
    accentColor: 'rose'
  },
  {
    id: 'jee-chem',
    name: 'JEE Mains & Advanced Chemistry',
    category: 'JEE',
    duration: '1 Year / 2 Years Program',
    description: 'A highly rigorous course emphasizing analytical thinking and complex problem-solving. Master physical calculations and stereochemistry for JEE Advanced.',
    features: [
      'Advanced numerical problem-solving sessions',
      'Complete Inorganic reactions memory maps',
      'Previous 20 Years JEE Papers Discussion',
      'Regular feedback on time-management strategies'
    ],
    tag: 'JEE Mains & Advanced',
    accentColor: 'blue'
  },
  {
    id: 'class-11-chem',
    name: 'Class 11 Chemistry (Concepts Booster)',
    category: 'Boards',
    duration: '10 Months Program',
    description: 'The foundation of senior secondary science. We build fundamental concepts of mole concept, chemical bonding, and thermodynamics from scratch.',
    features: [
      'Crystal-clear fundamental derivations',
      'Bridges the gap between school and competitive physics/chemistry',
      'Detailed study material & hand-written notes',
      'Chapter-wise subjective & objective tests'
    ],
    tag: 'Class 11th',
    accentColor: 'indigo'
  },
  {
    id: 'class-12-chem',
    name: 'Class 12 Boards + JEE/NEET Sync',
    category: 'Boards',
    duration: '10 Months Program',
    description: 'Maximize your board percentages while keeping competitive preparation aligned. Detailed study of electrochemistry, kinetics, and coordinated compounds.',
    features: [
      'Board answer-writing representation skills',
      'Board practical chemistry mock evaluations',
      'Quick revision modules for Class 11 topics',
      'Full syllabus mock tests with strict board grading'
    ],
    tag: 'Class 12th',
    accentColor: 'emerald'
  },
  {
    id: 'cbse-boards',
    name: 'CBSE Boards Chemistry Edge',
    category: 'Boards',
    duration: '6 Months (Crash Course)',
    description: 'Highly targeted preparation focusing on getting a perfect 100/100 in CBSE/State board examinations. Special emphasis on high-yield questions.',
    features: [
      'NCERT exercises thoroughly solved in class',
      'Sample papers evaluation & feedback',
      'Chemical formula & naming reactions cheatsheets',
      'Special doubt-clearing sessions before board exams'
    ],
    tag: 'Boards Prep',
    accentColor: 'orange'
  },
  {
    id: 'foundation-chem',
    name: 'Junior Olympiad & Foundation Chemistry',
    category: 'Foundation',
    duration: '1 Year Program',
    description: 'An early-start program for students in Class 9 & 10 to trigger scientific aptitude, logic-building, and excel in Olympiads, NTSE, and early JEE/NEET concepts.',
    features: [
      'Playful chemistry experiments & visualizations',
      'Aptitude-building logical reasoning problems',
      'Early exposure to high-school chemistry concepts',
      'NTSE & Junior Science Olympiad (IJSO) preparation'
    ],
    tag: 'Class 9th & 10th',
    accentColor: 'amber'
  }
];

export const RESULTS: ResultItem[] = [
  {
    id: 'res-1',
    name: 'Aarav Sharma',
    rank: 'AIR 42',
    exam: 'NEET UG',
    score: '710/720',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300',
    achievement: 'Chemistry Perfect Score 180/180'
  },
  {
    id: 'res-2',
    name: 'Ishaan Attri',
    rank: 'AIR 118',
    exam: 'JEE Advanced',
    score: '112/120 in Chem',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
    achievement: 'Admitted to IIT Bombay Computer Science'
  },
  {
    id: 'res-3',
    name: 'Priya Verma',
    rank: '99.6%',
    exam: 'CBSE Class 12 Boards',
    score: '100/100 in Chemistry',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300',
    achievement: 'State Chemistry Topper'
  },
  {
    id: 'res-4',
    name: 'Rahul Singhal',
    rank: 'AIR 235',
    exam: 'JEE Mains',
    score: '99.91 %ile in Chem',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
    achievement: 'Admitted to IIT Delhi'
  },
  {
    id: 'res-5',
    name: 'Sneha Gupta',
    rank: 'AIR 312',
    exam: 'NEET UG',
    score: '695/720',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300',
    achievement: 'Chemistry Score 175/180'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Aditya Raj',
    role: 'Student',
    review: 'Attri Sir is a magician when it comes to Organic Chemistry. I used to memorize reactions, but here, I learned the physical reasons behind mechanisms. That clarity made NEET questions feel like child\'s play!',
    rating: 5,
    course: 'NEET Chemistry Masterclass',
    avatarSeed: 'Aditya'
  },
  {
    id: 'test-2',
    name: 'Mrs. Rekha Sharma',
    role: 'Parent',
    review: 'Finding a teacher who provides personal attention in a competitive atmosphere is rare. My son Aarav scored AIR 42 in NEET UG. The feedback mechanisms and regular tests at Attri Chemistry Classes kept him highly focused.',
    rating: 5,
    course: 'Parent of Aarav (NEET AIR 42)',
    avatarSeed: 'Rekha'
  },
  {
    id: 'test-3',
    name: 'Mehul Deshmukh',
    role: 'Student',
    review: 'The Physical Chemistry numerical tricks taught at Attri Classes are unmatched. Problems that used to take me 5 minutes now take less than a minute. Strongly recommend it for any JEE aspirant.',
    rating: 5,
    course: 'JEE Mains & Advanced Chemistry',
    avatarSeed: 'Mehul'
  },
  {
    id: 'test-4',
    name: 'Dr. Vivek Verma',
    role: 'Parent',
    review: 'Our daughter Priya scored 100/100 in Chemistry boards. The systematic chapter notes, board practice tests, and handholding by faculty boosted her self-confidence immensely. Best decision for her career.',
    rating: 5,
    course: 'Parent of Priya (100% in Boards)',
    avatarSeed: 'Vivek'
  }
];

export const FEATURES: FeatureCard[] = [
  {
    title: '100% Concept Clarity',
    description: 'We believe in depth. No rote memorization—every reaction mechanism, chemical bond, and physical formula is explained from first principles.',
    iconName: 'Atom',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: 'Small Batch Size',
    description: 'Limited seats per batch to guarantee interactive visual lessons, individual tracking, and direct question-asking without hesitation.',
    iconName: 'Users',
    color: 'from-orange-500 to-red-600'
  },
  {
    title: 'Weekly Assessments',
    description: 'Continuous assessment with computerized mock test templates (matching NTA/NEET software interface) and detailed visual analytics report.',
    iconName: 'ClipboardCheck',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    title: 'Doubt Solving Sessions',
    description: 'Dedicated 1-on-1 doubt counters open daily after lectures. Never carry an unsolved equation home—get answers instantly.',
    iconName: 'Sparkles',
    color: 'from-pink-500 to-rose-600'
  },
  {
    title: 'Premium Study Material',
    description: 'Highly structured booklets, NCERT summaries, reactions mapping charts, and meticulously updated question banks for NEET and JEE.',
    iconName: 'BookOpen',
    color: 'from-amber-500 to-orange-600'
  },
  {
    title: 'Performance Tracking',
    description: 'Interactive SMS/WhatsApp progress reports for parents and students detailing class attendance, mock score progression, and focus areas.',
    iconName: 'LineChart',
    color: 'from-purple-500 to-indigo-600'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which of the following organic compounds has the highest boiling point?',
    options: ['Butane', 'Butan-1-ol', 'Butanal', 'Ethoxyethane'],
    correctAnswer: 1, // Butan-1-ol
    explanation: 'Butan-1-ol forms strong intermolecular hydrogen bonds, which require significantly higher energy to break compared to dipole-dipole interactions or London dispersion forces.'
  },
  {
    id: 2,
    question: 'Which element possesses the highest first ionization enthalpy?',
    options: ['Nitrogen (N)', 'Oxygen (O)', 'Carbon (C)', 'Boron (B)'],
    correctAnswer: 0, // Nitrogen
    explanation: 'Nitrogen has a stable half-filled 2p subshell (1s² 2s² 2p³), which makes it highly resistant to losing an electron, giving it a higher ionization enthalpy than Oxygen despite Oxygen\'s higher nuclear charge.'
  },
  {
    id: 3,
    question: 'What is the correct molecular geometry of Xenon Tetrafluoride (XeF4)?',
    options: ['Tetrahedral', 'Square Planar', 'Octahedral', 'Trigonal Bipyramidal'],
    correctAnswer: 1, // Square Planar
    explanation: 'XeF4 has 6 electron pairs (4 bonding pairs and 2 lone pairs). Under VSEPR theory, this corresponds to an octahedral arrangement of electron pairs, but the physical molecular shape is Square Planar.'
  }
];
