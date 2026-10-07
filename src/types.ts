export interface Course {
  id: string;
  name: string;
  category: 'NEET' | 'JEE' | 'Boards' | 'Foundation';
  duration: string;
  features: string[];
  description: string;
  tag: string;
  accentColor: string;
}

export interface ResultItem {
  id: string;
  name: string;
  rank: string;
  exam: string;
  score: string;
  year: string;
  image: string;
  achievement: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: 'Student' | 'Parent';
  review: string;
  rating: number;
  course: string;
  avatarSeed: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface BentoFeature {
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  variant: 'image' | 'accent' | 'pattern' | 'plain';
  image?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
}

export interface CenterLocation {
  id: string;
  name: string;
  address: string;
  details: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course: string;
  message?: string;
  type: 'enroll' | 'contact';
  timestamp: string;
  read: boolean;
}

export interface GalleryItem {
  id: string;
  category: 'Classroom' | 'Lab' | 'Events';
  title: string;
  desc: string;
  imgUrl: string;
  aspect?: 'square' | 'video' | 'photo';
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BatchSlot {
  id: string;
  batch: string;
  audience: string;
  days: string;
  time: string;
  seatsLeft: number;
  seatsTotal: number;
  mode: string;
}

export interface MethodStep {
  title: string;
  detail: string;
}

export interface ElementTile {
  symbol: string;
  number: number;
  name: string;
}
