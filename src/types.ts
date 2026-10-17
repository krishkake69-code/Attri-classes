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

export interface StatItem {
  label: string;
  value: string;
  note: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
}

export interface AboutContent {
  heading: string;
  paragraph1: string;
  paragraph2: string;
}

/** Shape served by GET /api/content (see api-app.ts). */
export interface DynamicContent {
  admissionMessage?: string;
  stats?: StatItem[];
  heroContent?: HeroContent;
  aboutContent?: AboutContent;
  methodology?: MethodStep[];
  features?: BentoFeature[];
  faqs?: FaqItem[];
  batches?: BatchSlot[];
  courses?: Course[];
  results?: ResultItem[];
  testimonials?: Testimonial[];
  gallery?: GalleryItem[];
  contactInfo?: ContactInfo;
  centers?: CenterLocation[];
  inquiries?: Inquiry[];
  newsletter?: string[];
  students?: Student[];
  attendance?: AttendanceRecord[];
  marks?: MarkRecord[];
  calendar?: CalendarEvent[];
}

/* ------------------------------------------------------------------ */
/* Student portal: batches, students, attendance, marks, calendar      */
/* ------------------------------------------------------------------ */

export type BatchId = 'MON_TUE_WED_11' | 'MON_TUE_WED_12' | 'FRI_SAT_SUN_11' | 'FRI_SAT_SUN_12';

export interface BatchInfo {
  id: BatchId;
  name: string;
  days: string;
  class: '11th' | '12th';
  studentsCount: number;
  description: string;
}

export interface Student {
  id: string;
  username: string;
  name: string;
  class: '11th' | '12th';
  batchId: BatchId;
  phone?: string;
  email?: string;
  subjects?: string[];
  createdAt: string;
  updatedAt?: string;
}

/** Server-side only (never sent to clients). */
export interface StudentRecord extends Student {
  passwordHash: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  batchId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedBy: 'admin';
  markedAt: string;
}

export interface MarkRecord {
  id: string;
  studentId: string;
  batchId: string;
  testName: string;
  subject: string;
  maxMarks: number;
  marksObtained: number;
  date: string; // YYYY-MM-DD
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  batchId?: string;
  class?: '11th' | '12th' | 'all';
  createdAt: string;
  updatedAt?: string;
}

/** GET /api/student/me response payload. */
export interface StudentMe {
  student: Student;
  attendance: AttendanceRecord[];
  marks: MarkRecord[];
  calendar: CalendarEvent[];
}
