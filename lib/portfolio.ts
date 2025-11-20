import { Portfolio, DiagnosisResult, Roadmap, LearningHistory, Project, Skill, Education } from '@/types';
import { getFromStorage, saveToStorage, generateId, getCurrentUser } from './utils';
import { getUserLearningHistory } from './learning-history';

/**
 * 포트폴리오 자동 생성
 */
export function generatePortfolio(userId: string): Portfolio {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('사용자 정보를 찾을 수 없습니다.');
  }

  const diagnosisResult = getFromStorage<DiagnosisResult>('diagnosisResults', null);
  const roadmap = getFromStorage<Roadmap>('roadmap', null);
  const learningHistory = getUserLearningHistory(userId);

  // 역량 추출
  const skills = extractSkillsFromHistory(roadmap, learningHistory, diagnosisResult);

  // 프로젝트 생성
  const projects = extractProjectsFromHistory(learningHistory, roadmap);

  // 교육 이력 생성
  const education = extractEducationFromHistory(learningHistory, roadmap);

  const portfolio: Portfolio = {
    id: generateId(),
    userId,
    name: user.name,
    email: user.email,
    targetJob: diagnosisResult?.targetJob || '개발자',
    skills,
    projects,
    education,
    diagnosisResults: diagnosisResult || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 포트폴리오 저장
  saveToStorage('portfolio', portfolio);

  return portfolio;
}

/**
 * 학습 이력에서 역량 추출
 */
function extractSkillsFromHistory(
  roadmap: Roadmap | null,
  learningHistory: LearningHistory[],
  diagnosisResult: DiagnosisResult | null
): Skill[] {
  const skillsMap = new Map<string, number>();

  // 로드맵에서 역량 추출
  if (roadmap) {
    roadmap.modules.forEach(module => {
      if (module.completed) {
        module.skills.forEach(skill => {
          const currentLevel = skillsMap.get(skill) || 0;
          skillsMap.set(skill, Math.min(currentLevel + 25, 100));
        });
      }
    });
  }

  // 학습 이력에서 역량 추출
  learningHistory.forEach(history => {
    if (history.completedAt) {
      const roadmap = getFromStorage<Roadmap>('roadmap', null);
      if (roadmap) {
        const module = roadmap.modules.find(m => m.id === history.moduleId);
        if (module) {
          module.skills.forEach(skill => {
            const currentLevel = skillsMap.get(skill) || 0;
            const progress = Math.round((history.progress / 100) * 30);
            skillsMap.set(skill, Math.min(currentLevel + progress, 100));
          });
        }
      }
    }
  });

  // 진단 결과에서 필요한 역량 추가
  // DiagnosisResult 타입에 requiredSkills가 없으므로 타입 가드 사용
  interface DiagnosisResultWithSkills extends DiagnosisResult {
    requiredSkills?: string[];
  }
  const diagnosisWithSkills = diagnosisResult as DiagnosisResultWithSkills | null;
  if (diagnosisWithSkills?.requiredSkills) {
    diagnosisWithSkills.requiredSkills.forEach((skill: string) => {
      if (!skillsMap.has(skill)) {
        skillsMap.set(skill, 20); // 기본 수준
      }
    });
  }

  // Skill 배열로 변환
  const skills: Skill[] = Array.from(skillsMap.entries()).map(([name, level]) => ({
    name,
    level,
    category: determineSkillCategory(name)
  }));

  // 레벨 순으로 정렬
  return skills.sort((a, b) => b.level - a.level);
}

/**
 * 역량 카테고리 결정
 */
function determineSkillCategory(skillName: string): 'technical' | 'soft' | 'domain' {
  const technicalKeywords = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java',
    'Database', 'API', 'Git', 'HTML', 'CSS', 'SQL', 'Programming'
  ];
  
  const softKeywords = [
    'Communication', 'Presentation', 'Documentation', 'Teamwork',
    'Leadership', 'Problem Solving', 'Agile'
  ];

  const lowerSkill = skillName.toLowerCase();
  
  if (technicalKeywords.some(keyword => lowerSkill.includes(keyword.toLowerCase()))) {
    return 'technical';
  }
  if (softKeywords.some(keyword => lowerSkill.includes(keyword.toLowerCase()))) {
    return 'soft';
  }
  
  return 'domain';
}

/**
 * 학습 이력에서 프로젝트 추출
 */
function extractProjectsFromHistory(
  learningHistory: LearningHistory[],
  roadmap: Roadmap | null
): Project[] {
  const projects: Project[] = [];

  // 완료된 모듈을 프로젝트로 변환
  learningHistory.forEach(history => {
    if (history.completedAt) {
      const roadmap = getFromStorage<Roadmap>('roadmap', null);
      if (roadmap) {
        const module = roadmap.modules.find(m => m.id === history.moduleId);
        if (module && module.title.includes('프로젝트')) {
          projects.push({
            id: generateId(),
            title: `${module.title} - ${history.moduleTitle}`,
            description: `로드맵 모듈 "${module.title}"을 완료하며 학습한 내용을 바탕으로 한 프로젝트입니다.`,
            technologies: module.skills.slice(0, 5),
            status: 'completed',
            completedAt: history.completedAt
          });
        }
      }
    }
  });

  // 기본 프로젝트 추가 (예시)
  if (projects.length === 0 && roadmap) {
    const completedModules = roadmap.modules.filter(m => m.completed);
    if (completedModules.length > 0) {
      completedModules.forEach(module => {
        projects.push({
          id: generateId(),
          title: `${module.title} 학습 프로젝트`,
          description: `${module.description}`,
          technologies: module.skills.slice(0, 5),
          status: 'completed',
          completedAt: module.completedAt || new Date().toISOString()
        });
      });
    }
  }

  return projects;
}

/**
 * 학습 이력에서 교육 이력 추출
 */
function extractEducationFromHistory(
  learningHistory: LearningHistory[],
  roadmap: Roadmap | null
): Education[] {
  const education: Education[] = [];

  learningHistory.forEach(history => {
    if (history.completedAt) {
      education.push({
        id: generateId(),
        title: history.moduleTitle,
        description: `로드맵 모듈 "${history.moduleTitle}"을 완료했습니다.`,
        completedAt: history.completedAt
      });
    }
  });

  return education;
}

/**
 * 포트폴리오 가져오기
 */
export function getPortfolio(userId: string): Portfolio | null {
  const portfolio = getFromStorage<Portfolio>('portfolio', null);
  if (portfolio && portfolio.userId === userId) {
    return portfolio;
  }
  return null;
}

/**
 * 포트폴리오 업데이트
 */
export function updatePortfolio(portfolio: Portfolio): Portfolio {
  portfolio.updatedAt = new Date().toISOString();
  saveToStorage('portfolio', portfolio);
  return portfolio;
}


