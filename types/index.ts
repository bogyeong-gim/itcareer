// 사용자 관련 타입
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

// 역량 진단 관련 타입
export interface DiagnosisQuestion {
  id: number;
  question: string;
  type: 'select' | 'text' | 'rating' | 'multiple';
  options?: string[];
  required: boolean;
}

export interface DiagnosisAnswer {
  questionId: number;
  answer: string | number | string[];
}

export interface DiagnosisResult {
  answers: DiagnosisAnswer[];
  currentJob?: string;
  targetJob?: string;
  experience?: string;
  weakAreas?: string[];
  learningHours?: string;
  analyzedAt: string;
}

// 로드맵 관련 타입
export type ModuleLevel = 'beginner' | 'intermediate' | 'advanced';

export interface RoadmapModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: ModuleLevel;
  order: number;
  completed: boolean;
  completedAt?: string;
  skills: string[];
  prerequisites?: string[];
}

export interface Roadmap {
  id: string;
  userId?: string;
  targetJob: string;
  modules: RoadmapModule[];
  createdAt: string;
  updatedAt?: string;
}

// 콘텐츠 관련 타입
export interface ContentSection {
  id: string;
  title: string;
  content: string;
  order: number;
  completed?: boolean;
}

export interface ModuleContent {
  moduleId: string;
  title: string;
  description: string;
  sections: ContentSection[];
  estimatedTime: string;
  level: ModuleLevel;
}

// 학습 이력 관련 타입
export interface LearningHistory {
  id: string;
  userId: string;
  moduleId: string;
  moduleTitle: string;
  startedAt: string;
  completedAt?: string;
  progress: number; // 0-100
  sectionsCompleted: string[];
}

// 포트폴리오 관련 타입
export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'technical' | 'soft' | 'domain';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planned';
  startedAt?: string;
  completedAt?: string;
  url?: string;
  githubUrl?: string;
}

export interface Education {
  id: string;
  title: string;
  description: string;
  completedAt: string;
  certificateUrl?: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  email: string;
  targetJob: string;
  skills: Skill[];
  projects: Project[];
  education: Education[];
  diagnosisResults?: DiagnosisResult;
  createdAt: string;
  updatedAt?: string;
  publicUrl?: string;
}

// 기업 프로젝트 관련 타입
export interface Company {
  id: string;
  name: string;
  industry: string;
  techStack: string[];
  blogUrl?: string;
  description?: string;
}

export interface CompanyProject {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  objectives: string[];
  techStack: string[];
  difficulty: ModuleLevel;
  estimatedDuration: string;
  mentorAvailable: boolean;
  participants: string[];
  status: 'open' | 'in-progress' | 'completed';
  createdAt: string;
}

// AI Tutor 관련 타입
export interface TutorMessage {
  id: string;
  question: string;
  response: string;
  timestamp: string;
  moduleId?: string;
}

// 대시보드 통계 관련 타입
export interface DashboardStats {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  totalLearningHours: number;
  skillsAcquired: number;
  projectsCompleted: number;
  currentStreak: number; // 연속 학습 일수
}

