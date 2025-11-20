import { ModuleContent, ContentSection, DiagnosisResult } from '@/types';

/**
 * 모듈 ID에 따른 기본 콘텐츠 생성
 */
export function generateModuleContent(
  moduleId: string,
  diagnosisResult?: DiagnosisResult
): ModuleContent {
  const baseContent = getBaseModuleContent(moduleId);
  
  // 진단 결과가 있으면 맞춤형으로 수정
  if (diagnosisResult) {
    return customizeContent(baseContent, diagnosisResult);
  }
  
  return baseContent;
}

/**
 * 기본 모듈 콘텐츠
 */
function getBaseModuleContent(moduleId: string): ModuleContent {
  const contentMap: Record<string, ModuleContent> = {
    '1': {
      moduleId: '1',
      title: '기초 역량 강화',
      description: '목표 직무에 필요한 기본 기술과 개념을 학습합니다.',
      estimatedTime: '4주',
      level: 'beginner',
      sections: [
        {
          id: '1-1',
          title: '기초 개념 이해',
          content: `목표 직무에 필요한 기본 개념들을 학습합니다.

1. 핵심 기술 스택
   - 프론트엔드: React, Vue, 또는 Angular
   - 백엔드: Node.js, Python, 또는 Java
   - 데이터베이스: SQL 및 NoSQL 데이터베이스 이해

2. 개발 환경 설정
   - IDE 선택 및 설정
   - 버전 관리 시스템 (Git) 활용
   - 패키지 관리자 사용법

3. 기본 프로그래밍 개념
   - 변수, 함수, 객체 지향 프로그래밍
   - 알고리즘과 자료구조 기초
   - 비동기 프로그래밍 이해`,
          order: 1
        },
        {
          id: '1-2',
          title: '실습 프로젝트',
          content: `이론을 바탕으로 간단한 프로젝트를 진행합니다.

프로젝트 예시:
- Todo 앱 만들기
- 간단한 API 서버 구축
- 데이터베이스 CRUD 구현

각 프로젝트는 단계별로 진행하며, 실무에서 자주 사용되는 패턴을 학습합니다.`,
          order: 2
        }
      ]
    },
    '2': {
      moduleId: '2',
      title: '실무 프로젝트 경험',
      description: '실제 업무 환경과 유사한 프로젝트를 기획하고 진행합니다.',
      estimatedTime: '6주',
      level: 'intermediate',
      sections: [
        {
          id: '2-1',
          title: '실무 프로젝트 기획',
          content: `실제 업무 환경과 유사한 프로젝트를 기획하고 진행합니다.

1. 프로젝트 선정
   - 기업의 실제 기술 스택 분석
   - 비즈니스 요구사항 이해
   - 기술적 도전 과제 설정

2. 팀 협업
   - Git 브랜치 전략
   - 코드 리뷰 프로세스
   - 애자일 방법론 적용`,
          order: 1
        },
        {
          id: '2-2',
          title: '프로젝트 실행',
          content: `프로젝트를 실제로 구현하고 배포합니다.

주요 단계:
- 요구사항 분석 및 설계
- 개발 및 테스트
- 배포 및 모니터링
- 피드백 수집 및 개선`,
          order: 2
        }
      ]
    },
    '3': {
      moduleId: '3',
      title: '포트폴리오 구축',
      description: '효과적인 포트폴리오를 작성하는 방법을 학습합니다.',
      estimatedTime: '2주',
      level: 'intermediate',
      sections: [
        {
          id: '3-1',
          title: '포트폴리오 작성 가이드',
          content: `효과적인 포트폴리오를 작성하는 방법을 학습합니다.

1. 프로젝트 소개
   - 문제 정의와 해결 과정
   - 사용한 기술 스택
   - 주요 성과와 배운 점

2. 코드 품질
   - 깔끔한 코드 작성
   - 문서화
   - 테스트 코드 작성`,
          order: 1
        }
      ]
    },
    '4': {
      moduleId: '4',
      title: '면접 준비 및 네트워킹',
      description: '기술 면접과 인성 면접을 준비합니다.',
      estimatedTime: '3주',
      level: 'advanced',
      sections: [
        {
          id: '4-1',
          title: '면접 준비',
          content: `기술 면접과 인성 면접을 준비합니다.

1. 기술 면접
   - 알고리즘 문제 풀이
   - 시스템 설계 질문
   - 기술 스택 관련 질문

2. 인성 면접
   - 프로젝트 경험 설명
   - 팀워크 경험
   - 커리어 목표`,
          order: 1
        }
      ]
    }
  };

  return contentMap[moduleId] || contentMap['1'];
}

/**
 * 진단 결과를 기반으로 콘텐츠 맞춤화
 */
function customizeContent(
  content: ModuleContent,
  diagnosisResult: DiagnosisResult
): ModuleContent {
  // 목표 직무에 따라 콘텐츠 수정
  if (diagnosisResult.targetJob?.includes('프론트엔드')) {
    content.sections = content.sections.map(section => ({
      ...section,
      content: section.content.replace(
        /프론트엔드: React, Vue, 또는 Angular/g,
        '프론트엔드: React, Vue, Angular (프론트엔드 개발에 집중)'
      )
    }));
  }

  return content;
}

