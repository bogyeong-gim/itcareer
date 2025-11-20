import { Roadmap, RoadmapModule, DiagnosisResult, ModuleLevel } from '@/types';
import { extractRequiredSkills } from './diagnosis';

/**
 * 진단 결과를 기반으로 로드맵 생성
 */
export function generateRoadmap(result: DiagnosisResult, userId?: string): Roadmap {
  const skills = extractRequiredSkills(result);
  const { targetJob, experience, learningHours } = result;

  // 경력에 따른 난이도 조정
  const baseLevel: ModuleLevel = 
    experience?.includes('신입') || experience?.includes('주니어') ? 'beginner' :
    experience?.includes('미들') ? 'intermediate' : 'advanced';

  const modules: RoadmapModule[] = [
    {
      id: '1',
      title: '기초 역량 강화',
      englishTitle: 'Foundation Skills',
      subtitle: 'Basic Programming & Core Concepts',
      description: '목표 직무에 필요한 기본 기술과 개념을 학습합니다. 처음 개발을 시작하는 분들께 강력 추천합니다.',
      duration: learningHours?.includes('5시간 미만') ? '2주' : 
               learningHours?.includes('5-10시간') ? '4주' :
               learningHours?.includes('10-20시간') ? '6주' : '8주',
      level: baseLevel,
      order: 1,
      completed: false,
      skills: skills.slice(0, 5),
      prerequisites: [],
      provider: '인프런',
      price: '무료'
    },
    {
      id: '2',
      title: '실무 프로젝트 경험',
      englishTitle: 'Practical Project Experience',
      subtitle: 'Real-world Development & Collaboration',
      description: '실제 프로젝트를 통해 실무 역량을 키웁니다. 팀 협업과 프로젝트 관리 경험을 쌓을 수 있습니다.',
      duration: '6주',
      level: baseLevel === 'beginner' ? 'intermediate' : baseLevel,
      order: 2,
      completed: false,
      skills: skills.slice(0, 8),
      prerequisites: ['1'],
      provider: '인프런',
      price: 88000
    },
    {
      id: '3',
      title: '포트폴리오 구축',
      englishTitle: 'Portfolio Development',
      subtitle: 'Showcase Your Work & Skills',
      description: '학습한 내용을 바탕으로 포트폴리오를 작성합니다. 효과적인 포트폴리오 작성 방법을 학습합니다.',
      duration: '2주',
      level: 'intermediate',
      order: 3,
      completed: false,
      skills: ['Portfolio Development', 'Documentation', 'Presentation'],
      prerequisites: ['1', '2'],
      provider: '인프런',
      price: 44000
    },
    {
      id: '4',
      title: '면접 준비 및 네트워킹',
      englishTitle: 'Interview Prep & Networking',
      subtitle: 'Career Development & Community',
      description: '면접 스킬과 커뮤니티 활동을 통해 커리어를 확장합니다. 기술 면접과 인성 면접을 준비합니다.',
      duration: '3주',
      level: 'advanced',
      order: 4,
      completed: false,
      skills: ['Interview Skills', 'Networking', 'Career Development'],
      prerequisites: ['1', '2', '3'],
      provider: '인프런',
      price: 66000
    }
  ];

  return {
    id: `roadmap-${Date.now()}`,
    userId,
    targetJob: targetJob || '개발자',
    modules,
    createdAt: new Date().toISOString()
  };
}

/**
 * 모듈 완료 처리
 */
export function markModuleComplete(roadmap: Roadmap, moduleId: string): Roadmap {
  return {
    ...roadmap,
    modules: roadmap.modules.map(module =>
      module.id === moduleId
        ? { ...module, completed: true, completedAt: new Date().toISOString() }
        : module
    ),
    updatedAt: new Date().toISOString()
  };
}

/**
 * 로드맵 진행률 계산
 */
export function calculateRoadmapProgress(roadmap: Roadmap): number {
  if (roadmap.modules.length === 0) return 0;
  const completed = roadmap.modules.filter(m => m.completed).length;
  return Math.round((completed / roadmap.modules.length) * 100);
}

/**
 * 기본 임시 로드맵 생성 (진단 결과가 없을 때 사용)
 */
export function generateDefaultRoadmap(userId?: string): Roadmap {
  const modules: RoadmapModule[] = [
    {
      id: '1',
      title: '기초 역량 강화',
      englishTitle: 'Foundation Skills',
      subtitle: 'Basic Programming & Core Concepts',
      description: '목표 직무에 필요한 기본 기술과 개념을 학습합니다. 처음 개발을 시작하는 분들께 강력 추천합니다.',
      duration: '4주',
      level: 'beginner',
      order: 1,
      completed: false,
      skills: ['기본 프로그래밍', '데이터 구조', '알고리즘', '버전 관리', '기본 도구 사용'],
      prerequisites: [],
      provider: '인프런',
      price: '무료'
    },
    {
      id: '2',
      title: '실무 프로젝트 경험',
      englishTitle: 'Practical Project Experience',
      subtitle: 'Real-world Development & Collaboration',
      description: '실제 프로젝트를 통해 실무 역량을 키웁니다. 팀 협업과 프로젝트 관리 경험을 쌓을 수 있습니다.',
      duration: '6주',
      level: 'intermediate',
      order: 2,
      completed: false,
      skills: ['프로젝트 관리', '협업 도구', '코드 리뷰', '테스팅', '배포'],
      prerequisites: ['1'],
      provider: '인프런',
      price: 88000
    },
    {
      id: '3',
      title: '포트폴리오 구축',
      englishTitle: 'Portfolio Development',
      subtitle: 'Showcase Your Work & Skills',
      description: '학습한 내용을 바탕으로 포트폴리오를 작성합니다. 효과적인 포트폴리오 작성 방법을 학습합니다.',
      duration: '2주',
      level: 'intermediate',
      order: 3,
      completed: false,
      skills: ['Portfolio Development', 'Documentation', 'Presentation'],
      prerequisites: ['1', '2'],
      provider: '인프런',
      price: 44000
    },
    {
      id: '4',
      title: '면접 준비 및 네트워킹',
      englishTitle: 'Interview Prep & Networking',
      subtitle: 'Career Development & Community',
      description: '면접 스킬과 커뮤니티 활동을 통해 커리어를 확장합니다. 기술 면접과 인성 면접을 준비합니다.',
      duration: '3주',
      level: 'advanced',
      order: 4,
      completed: false,
      skills: ['Interview Skills', 'Networking', 'Career Development'],
      prerequisites: ['1', '2', '3'],
      provider: '인프런',
      price: 66000
    }
  ];

  return {
    id: `roadmap-default-${Date.now()}`,
    userId,
    targetJob: '개발자',
    modules,
    createdAt: new Date().toISOString()
  };
}

