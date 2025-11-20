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
      description: '목표 직무에 필요한 기본 기술과 개념을 학습합니다.',
      duration: learningHours?.includes('5시간 미만') ? '2주' : 
               learningHours?.includes('5-10시간') ? '4주' :
               learningHours?.includes('10-20시간') ? '6주' : '8주',
      level: baseLevel,
      order: 1,
      completed: false,
      skills: skills.slice(0, 5),
      prerequisites: []
    },
    {
      id: '2',
      title: '실무 프로젝트 경험',
      description: '실제 프로젝트를 통해 실무 역량을 키웁니다.',
      duration: '6주',
      level: baseLevel === 'beginner' ? 'intermediate' : baseLevel,
      order: 2,
      completed: false,
      skills: skills.slice(0, 8),
      prerequisites: ['1']
    },
    {
      id: '3',
      title: '포트폴리오 구축',
      description: '학습한 내용을 바탕으로 포트폴리오를 작성합니다.',
      duration: '2주',
      level: 'intermediate',
      order: 3,
      completed: false,
      skills: ['Portfolio Development', 'Documentation', 'Presentation'],
      prerequisites: ['1', '2']
    },
    {
      id: '4',
      title: '면접 준비 및 네트워킹',
      description: '면접 스킬과 커뮤니티 활동을 통해 커리어를 확장합니다.',
      duration: '3주',
      level: 'advanced',
      order: 4,
      completed: false,
      skills: ['Interview Skills', 'Networking', 'Career Development'],
      prerequisites: ['1', '2', '3']
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

