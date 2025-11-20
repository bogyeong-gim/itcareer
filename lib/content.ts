import { ModuleContent, ContentSection, DiagnosisResult } from '@/types';
import { fetchRelevantDocs, extractLibraryNames } from './context7';

/**
 * 모듈 ID에 따른 기본 콘텐츠 생성 (동기 버전 - 호환성 유지)
 */
export function generateModuleContentSync(
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
 * 모듈 ID에 따른 기본 콘텐츠 생성 (비동기 버전 - context7-mcp 통합)
 * context7-mcp를 통해 관련 라이브러리 문서를 참조하여 콘텐츠를 보강합니다.
 */
export async function generateModuleContent(
  moduleId: string,
  diagnosisResult?: DiagnosisResult
): Promise<ModuleContent> {
  const baseContent = getBaseModuleContent(moduleId);
  
  // 진단 결과에서 관련 라이브러리 추출
  let relevantLibraries: string[] = [];
  if (diagnosisResult?.targetJob) {
    relevantLibraries = extractLibraryNames(diagnosisResult.targetJob);
  }
  
  // 모듈 콘텐츠에서도 라이브러리 추출
  const moduleLibraries = extractLibraryNames(
    baseContent.title + ' ' + baseContent.description + ' ' + 
    baseContent.sections.map(s => s.content).join(' ')
  );
  relevantLibraries = [...new Set([...relevantLibraries, ...moduleLibraries])];
  
  // 관련 라이브러리 문서 가져오기
  let libraryDocsContent = '';
  if (relevantLibraries.length > 0) {
    try {
      const docs = await fetchRelevantDocs(
        relevantLibraries.join(' '),
        baseContent.title
      );
      
      if (docs.length > 0) {
        libraryDocsContent = '\n\n**추가 학습 자료 (최신 문서):**\n';
        docs.forEach(doc => {
          libraryDocsContent += `\n- **${doc.libraryName}**: ${doc.content.substring(0, 200)}...\n`;
        });
      }
    } catch (error) {
      console.warn('라이브러리 문서 가져오기 실패:', error);
      // 문서 가져오기 실패해도 계속 진행
    }
  }
  
  // 라이브러리 문서가 있으면 첫 번째 섹션에 추가
  let enhancedContent = baseContent;
  if (libraryDocsContent && enhancedContent.sections.length > 0) {
    enhancedContent = {
      ...enhancedContent,
      sections: enhancedContent.sections.map((section, index) => {
        if (index === 0) {
          return {
            ...section,
            content: section.content + libraryDocsContent
          };
        }
        return section;
      })
    };
  }
  
  // 진단 결과가 있으면 맞춤형으로 수정
  if (diagnosisResult) {
    return customizeContent(enhancedContent, diagnosisResult);
  }
  
  return enhancedContent;
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
        },
        {
          id: '1-3',
          title: '디버깅 및 문제 해결',
          content: `프로그래밍에서 가장 중요한 역량 중 하나인 디버깅과 문제 해결 능력을 기릅니다.

1. 디버깅 도구 활용
   - 브라우저 개발자 도구
   - 로깅 및 에러 추적
   - 성능 프로파일링

2. 문제 해결 방법론
   - 문제 분석 및 원인 파악
   - 체계적인 접근 방법
   - 커뮤니티 리소스 활용

3. 일반적인 오류와 해결 방법
   - 문법 오류
   - 논리 오류
   - 런타임 오류`,
          order: 3
        },
        {
          id: '1-4',
          title: '코드 리뷰 및 리팩토링',
          content: `깔끔하고 유지보수 가능한 코드를 작성하는 방법을 학습합니다.

1. 코드 품질 기준
   - 가독성
   - 재사용성
   - 확장성

2. 리팩토링 기법
   - 중복 코드 제거
   - 함수 분리
   - 네이밍 개선

3. 코드 리뷰 프로세스
   - 리뷰 체크리스트
   - 피드백 수용 및 개선`,
          order: 4
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
        },
        {
          id: '2-3',
          title: '테스팅 및 품질 보증',
          content: `소프트웨어 품질을 보장하기 위한 테스팅 전략을 학습합니다.

1. 테스트 종류
   - 단위 테스트 (Unit Test)
   - 통합 테스트 (Integration Test)
   - E2E 테스트 (End-to-End Test)

2. 테스트 도구
   - Jest, Mocha (JavaScript)
   - pytest (Python)
   - JUnit (Java)

3. 테스트 주도 개발 (TDD)
   - Red-Green-Refactor 사이클
   - 테스트 작성 우선
   - 코드 커버리지`,
          order: 3
        },
        {
          id: '2-4',
          title: 'CI/CD 파이프라인',
          content: `지속적인 통합과 배포를 위한 CI/CD 파이프라인을 구축합니다.

1. CI/CD 개념
   - 지속적인 통합 (Continuous Integration)
   - 지속적인 배포 (Continuous Deployment)

2. CI/CD 도구
   - GitHub Actions
   - Jenkins
   - GitLab CI

3. 파이프라인 구성
   - 빌드 자동화
   - 테스트 자동화
   - 배포 자동화`,
          order: 4
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
        },
        {
          id: '3-2',
          title: 'GitHub 프로필 최적화',
          content: `GitHub를 효과적으로 활용하여 개발자 브랜딩을 강화합니다.

1. README 작성
   - 프로젝트 소개
   - 설치 및 사용 방법
   - 기여 가이드

2. GitHub 프로필 설정
   - 프로필 README 작성
   - 기여 그래프 관리
   - 핀된 저장소 선정

3. 오픈소스 기여
   - 이슈 리포트
   - Pull Request 작성
   - 코드 리뷰 참여`,
          order: 2
        },
        {
          id: '3-3',
          title: '기술 블로그 운영',
          content: `기술 블로그를 통해 지식을 공유하고 커리어를 발전시킵니다.

1. 블로그 플랫폼 선택
   - 개인 웹사이트
   - Medium, Dev.to
   - 기술 블로그 플랫폼

2. 글쓰기 전략
   - 주제 선정
   - 독자 중심 작성
   - SEO 최적화

3. 지속적인 운영
   - 정기적인 포스팅
   - 커뮤니티 참여
   - 피드백 수용`,
          order: 3
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
        },
        {
          id: '4-2',
          title: '알고리즘 문제 풀이',
          content: `기술 면접에서 자주 나오는 알고리즘 문제를 체계적으로 준비합니다.

1. 기본 알고리즘
   - 정렬 알고리즘
   - 탐색 알고리즘
   - 동적 프로그래밍

2. 자료구조
   - 배열, 리스트
   - 스택, 큐
   - 트리, 그래프

3. 문제 풀이 전략
   - 문제 분석
   - 접근 방법 설계
   - 시간/공간 복잡도 분석

4. 연습 플랫폼
   - LeetCode
   - 프로그래머스
   - 백준 온라인 저지`,
          order: 2
        },
        {
          id: '4-3',
          title: '네트워킹 및 커뮤니티',
          content: `개발자 커뮤니티에 참여하여 네트워크를 구축하고 지식을 공유합니다.

1. 온라인 커뮤니티
   - GitHub
   - Stack Overflow
   - Reddit (r/programming)

2. 오프라인 모임
   - 개발자 밋업
   - 컨퍼런스 참여
   - 해커톤 참가

3. 멘토링
   - 멘토 찾기
   - 멘티 되기
   - 지식 공유`,
          order: 3
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

