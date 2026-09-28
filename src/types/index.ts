export type UserCondition = 'wheelchair' | 'walker' | 'ankle_fracture' | 'reduced_mobility';

export type AffectedLimb = 'Izquierda' | 'Derecha' | 'Ambas';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  condition: UserCondition;
  affectedLimb: AffectedLimb;
  primaryGoal: string;
  painLevel: number; // 0 to 10
  streakDays: number;
  totalReps: number;
  totalMinutes: number;
  completedSessionsCount: number;
  onboardingCompleted: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  voiceGuide: boolean;
}

export interface ExerciseStep {
  id: string;
  title: string;
  targetZone: 'verde' | 'rojo' | 'azul' | 'amarillo' | 'base_giratoria' | 'canasta' | 'mini_saquitos' | 'arco' | 'almohadillas' | 'canastilla';
  zoneColor: string;
  reps: number;
  durationSeconds: number;
  instruction: string;
  focusTip: string;
  caution: string;
  audioPrompt: string;
  habilidadClave?: string;
  therapeuticBenefit?: string;
  stepType?: 'touch' | 'rotate_base' | 'zigzag_track' | 'basket_action' | 'saquitos_action';
}

export interface RoutineSession {
  id: string;
  title: string;
  subtitle: string;
  targetCondition: UserCondition;
  level: 'Inicial' | 'Intermedio' | 'Avanzado';
  estimatedMinutes: number;
  totalReps: number;
  steps: ExerciseStep[];
  deviceFocus: string;
  benefits: string[];
}

export interface ProgressPhoto {
  id: string;
  date: string;
  stage: 'Antes' | 'En Proceso' | 'Después';
  angleDegrees?: number;
  notes: string;
  imageUrl: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  color: 'red' | 'blue' | 'green' | 'yellow';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  name: string;
  age: number;
  city: string;
  condition: UserCondition;
  conditionLabel: string;
  timeUsingWiggle: string;
  improvementMetric: string;
  quote: string;
  avatarUrl: string;
  rating: number;
  verified: boolean;
}

export interface ForumPost {
  id: string;
  author: string;
  authorCondition: string;
  date: string;
  title: string;
  content: string;
  likes: number;
  likedByMe?: boolean;
  physioReply?: string;
  tags: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'dispositivo' | 'ejercicios' | 'seguridad' | 'limpieza';
}
