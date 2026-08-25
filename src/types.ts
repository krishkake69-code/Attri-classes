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

export interface FeatureCard {
  title: string;
  description: string;
  iconName: string;
  color: string;
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


