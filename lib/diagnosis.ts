import { DiagnosisResult, DiagnosisAnswer } from '@/types';

/**
 * 진단 결과 분석 및 요약 생성
 */
export function analyzeDiagnosisResults(answers: DiagnosisAnswer[]): DiagnosisResult {
  const currentJob = answers.find(a => a.questionId === 1)?.answer as string;
  const experience = answers.find(a => a.questionId === 2)?.answer as string;
  const targetJob = answers.find(a => a.questionId === 3)?.answer as string;
  const weakAreas = answers.find(a => a.questionId === 4)?.answer as string;
  const learningHours = answers.find(a => a.questionId === 5)?.answer as string;

  return {
    answers,
    currentJob,
    targetJob,
    experience,
    weakAreas: weakAreas ? [weakAreas] : [],
    learningHours,
    analyzedAt: new Date().toISOString()
  };
}

/**
 * 진단 결과를 기반으로 필요한 역량 추출
 */
export function extractRequiredSkills(result: DiagnosisResult): string[] {
  const skills: string[] = [];
  const { targetJob, weakAreas } = result;

  // 목표 직무에 따른 기본 스킬
  if (targetJob?.includes('프론트엔드')) {
    skills.push('React', 'JavaScript', 'TypeScript', 'CSS', 'HTML');
  } else if (targetJob?.includes('백엔드')) {
    skills.push('Node.js', 'Python', 'Database', 'API Design', 'Server Architecture');
  } else if (targetJob?.includes('풀스택')) {
    skills.push('React', 'Node.js', 'Database', 'Full-stack Development', 'API Integration');
  } else if (targetJob?.includes('데이터 분석가')) {
    skills.push('Python', 'Data Analysis', 'SQL', 'Statistics', 'Data Visualization');
  } else if (targetJob?.includes('프로덕트 매니저')) {
    skills.push('Product Strategy', 'User Research', 'Agile', 'Communication', 'Analytics');
  }

  // 부족한 역량에 따른 추가 스킬
  if (weakAreas?.includes('기술적 역량')) {
    skills.push('Programming Fundamentals', 'Problem Solving');
  }
  if (weakAreas?.includes('비즈니스 이해도')) {
    skills.push('Business Analysis', 'Domain Knowledge');
  }
  if (weakAreas?.includes('커뮤니케이션 능력')) {
    skills.push('Communication', 'Presentation', 'Documentation');
  }

  return [...new Set(skills)]; // 중복 제거
}

