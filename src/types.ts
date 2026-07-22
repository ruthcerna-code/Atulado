export type MoodType = 'radiant' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'overwhelmed';

export interface MoodOption {
  id: MoodType;
  emoji: string;
  label: string;
  color: string;
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  dateStr: string; // YYYY-MM-DD
  mood: MoodType;
  intensity: number; // 1 to 5
  tags: string[];
  note: string;
  photoUrl?: string;
  syncedToCloud: boolean;
}

export interface EpdsQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    score: number;
  }[];
}

export interface EpdsResult {
  id: string;
  timestamp: number;
  dateStr: string;
  totalScore: number;
  item10Score: number; // Self-harm risk item
  riskLevel: 'low' | 'moderate' | 'high';
  notes?: string;
}

export interface CommunityWorkshop {
  id: string;
  title: string;
  category: 'Duelo Perinatal' | 'Posparto' | 'Autocuidado' | 'Legal / Ley Dominga';
  speaker: string;
  role: string;
  date: string;
  time: string;
  mode: 'Online (Zoom)' | 'Presencial';
  description: string;
  isEnrolled: boolean;
  spotsLeft: number;
}

export interface SupportResource {
  id: string;
  name: string;
  category: 'Línea de Crisis' | 'Fundación / Apoyo' | 'Hospital / Urgencia' | 'Salud Mental Perinatal';
  region: string;
  phone: string;
  address?: string;
  hours: string;
  description: string;
  website?: string;
  isFavorite: boolean;
  isEmergencyLine?: boolean;
}

export interface EducationalArticle {
  id: string;
  title: string;
  category: 'Ley Dominga' | 'Duelo Perinatal' | 'Ansiedad y Depresión' | 'Culpa y Autocuidado' | 'Pareja y Redes';
  readTime: string;
  summary: string;
  content: string[];
  infographicUrl?: string;
  isBookmarked: boolean;
}

export interface ClinicalHealthData {
  fullName: string;
  age: number;
  weightKg: number;
  heightCm: number;
  lastPeriodStartDate: string; // YYYY-MM-DD
  periodDurationDays: number;
  cycleDurationDays: number;
  contraceptiveMethod: string;
  healthConditions: string[]; // e.g. ['Diabetes', 'Obesidad', 'Celíaca', 'Depresión']
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string;
  isGuest: boolean;
  pregnancyOrPostpartumStatus: 'gestational' | 'postpartum' | 'grief_loss' | 'seeking';
  trustedContactName?: string;
  trustedContactPhone?: string;
  hasConsented: boolean;
  syncEnabled: boolean;
  clinicalProfile?: ClinicalHealthData;
}
