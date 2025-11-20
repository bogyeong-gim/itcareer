import { Company, CompanyProject, DiagnosisResult } from '@/types';
import { getFromStorage, saveToStorage, generateId } from './utils';

/**
 * 기업 정보 저장 (예시 데이터)
 */
const SAMPLE_COMPANIES: Company[] = [
  {
    id: '1',
    name: '당근마켓',
    industry: '소셜 커머스',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    blogUrl: 'https://medium.com/daangn',
    description: '동네 커뮤니티 기반 중고거래 플랫폼'
  },
  {
    id: '2',
    name: '토스',
    industry: '핀테크',
    techStack: ['React', 'TypeScript', 'Kotlin', 'Swift', 'Spring Boot', 'Kubernetes'],
    blogUrl: 'https://toss.tech',
    description: '금융 서비스를 쉽고 간편하게 만드는 핀테크 기업'
  },
  {
    id: '3',
    name: '라인',
    industry: '소셜 네트워크',
    techStack: ['Java', 'Python', 'Go', 'Kubernetes', 'MySQL', 'MongoDB'],
    blogUrl: 'https://engineering.linecorp.com',
    description: '글로벌 메신저 및 다양한 서비스를 제공하는 IT 기업'
  }
];

/**
 * 기업 목록 가져오기
 */
export function getCompanies(): Company[] {
  const stored = getFromStorage<Company[]>('companies', []);
  return stored.length > 0 ? stored : SAMPLE_COMPANIES;
}

/**
 * 기업 정보 가져오기
 */
export function getCompany(companyId: string): Company | null {
  const companies = getCompanies();
  return companies.find(c => c.id === companyId) || null;
}

/**
 * 기업 기술 스택 분석 및 프로젝트 목표 생성
 */
export function generateCompanyProject(
  companyId: string,
  diagnosisResult: DiagnosisResult | null
): CompanyProject {
  const company = getCompany(companyId);
  if (!company) {
    throw new Error('기업 정보를 찾을 수 없습니다.');
  }

  // 진단 결과 기반으로 난이도 결정
  const experience = diagnosisResult?.experience || '주니어 (1-3년)';
  const difficulty: 'beginner' | 'intermediate' | 'advanced' = 
    experience.includes('신입') || experience.includes('주니어') ? 'beginner' :
    experience.includes('미들') ? 'intermediate' : 'advanced';

  // 기술 스택에서 주요 기술 선택
  const mainTech = company.techStack.slice(0, 5);
  const targetJob = diagnosisResult?.targetJob || '개발자';

  // 프로젝트 목표 생성
  const objectives = generateProjectObjectives(company, targetJob, difficulty);

  const project: CompanyProject = {
    id: generateId(),
    companyId: company.id,
    companyName: company.name,
    title: `${company.name} 스타일의 ${getProjectType(targetJob)} 프로젝트`,
    description: `${company.name}의 기술 스택과 개발 문화를 학습하기 위한 실무형 프로젝트입니다. ${company.description}의 실제 서비스와 유사한 기능을 구현합니다.`,
    objectives,
    techStack: mainTech,
    difficulty,
    estimatedDuration: difficulty === 'beginner' ? '4주' : difficulty === 'intermediate' ? '6주' : '8주',
    mentorAvailable: true,
    participants: [],
    status: 'open',
    createdAt: new Date().toISOString()
  };

  // 프로젝트 저장
  const allProjects = getFromStorage<CompanyProject[]>('companyProjects', []);
  allProjects.push(project);
  saveToStorage('companyProjects', allProjects);

  return project;
}

/**
 * 프로젝트 타입 결정
 */
function getProjectType(targetJob: string): string {
  if (targetJob.includes('프론트엔드')) return '프론트엔드';
  if (targetJob.includes('백엔드')) return '백엔드';
  if (targetJob.includes('풀스택')) return '풀스택';
  if (targetJob.includes('데이터')) return '데이터 분석';
  return '웹 서비스';
}

/**
 * 프로젝트 목표 생성
 */
function generateProjectObjectives(
  company: Company,
  targetJob: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): string[] {
  const baseObjectives: string[] = [
    `${company.name}의 기술 스택(${company.techStack.slice(0, 3).join(', ')})을 활용한 프로젝트 구현`,
    '실제 서비스와 유사한 기능 및 사용자 경험 구현',
    '코드 리뷰 및 협업 프로세스 경험'
  ];

  if (targetJob.includes('프론트엔드')) {
    baseObjectives.push('반응형 UI/UX 구현', '상태 관리 및 성능 최적화');
  } else if (targetJob.includes('백엔드')) {
    baseObjectives.push('RESTful API 설계 및 구현', '데이터베이스 설계 및 최적화');
  } else if (targetJob.includes('풀스택')) {
    baseObjectives.push('프론트엔드와 백엔드 통합', '전체 시스템 아키텍처 설계');
  }

  if (difficulty === 'intermediate') {
    baseObjectives.push('테스트 코드 작성', 'CI/CD 파이프라인 구축');
  } else if (difficulty === 'advanced') {
    baseObjectives.push('마이크로서비스 아키텍처 적용', '모니터링 및 로깅 시스템 구축');
  }

  return baseObjectives;
}

/**
 * 사용자에게 추천할 프로젝트 가져오기
 */
export function getRecommendedProjects(userId: string): CompanyProject[] {
  const diagnosisResult = getFromStorage<DiagnosisResult>('diagnosisResults', null);
  const allProjects = getFromStorage<CompanyProject[]>('companyProjects', []);
  
  // 사용자가 참여하지 않은 프로젝트만 필터링
  const availableProjects = allProjects.filter(
    p => !p.participants.includes(userId) && p.status === 'open'
  );

  // 진단 결과 기반으로 필터링
  if (diagnosisResult) {
    const targetJob = diagnosisResult.targetJob || '';
    return availableProjects.filter(p => 
      p.title.includes(targetJob) || 
      p.techStack.some(tech => 
        targetJob.includes('프론트엔드') && ['React', 'Vue', 'Angular'].includes(tech) ||
        targetJob.includes('백엔드') && ['Node.js', 'Python', 'Java', 'Spring'].includes(tech)
      )
    );
  }

  return availableProjects;
}

/**
 * 프로젝트 참여
 */
export function joinProject(projectId: string, userId: string): CompanyProject | null {
  const allProjects = getFromStorage<CompanyProject[]>('companyProjects', []);
  const project = allProjects.find(p => p.id === projectId);

  if (!project) return null;
  if (project.participants.includes(userId)) return project;
  if (project.status !== 'open') return null;

  project.participants.push(userId);
  if (project.participants.length >= 1) {
    project.status = 'in-progress';
  }

  saveToStorage('companyProjects', allProjects);
  return project;
}

/**
 * 사용자가 참여한 프로젝트 가져오기
 */
export function getUserProjects(userId: string): CompanyProject[] {
  const allProjects = getFromStorage<CompanyProject[]>('companyProjects', []);
  return allProjects.filter(p => p.participants.includes(userId));
}

