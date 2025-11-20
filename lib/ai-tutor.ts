import { TutorMessage, ModuleContent } from '@/types';
import { generateId } from './utils';

/**
 * AI Tutor 응답 생성 (시뮬레이션)
 * 실제로는 OpenAI API나 다른 AI 서비스를 사용할 수 있습니다.
 */
export async function generateTutorResponse(
  question: string,
  moduleContent: ModuleContent | null,
  context?: string
): Promise<string> {
  // 실제로는 AI API 호출
  // 여기서는 컨텍스트 기반 시뮬레이션 응답 생성
  
  const lowerQuestion = question.toLowerCase();
  
  // 키워드 기반 응답 생성
  if (lowerQuestion.includes('기초') || lowerQuestion.includes('시작') || lowerQuestion.includes('처음')) {
    return `좋은 질문입니다! 기초부터 차근차근 시작하는 것이 중요합니다.

${moduleContent ? `현재 "${moduleContent.title}" 모듈을 학습하고 계시는군요. ` : ''}

**학습 방법 제안:**
1. 기본 개념을 먼저 이해하세요
2. 간단한 예제부터 시작하세요
3. 직접 코드를 작성해보세요
4. 오류가 발생하면 그 과정에서 배울 수 있습니다

더 구체적인 질문이 있으시면 언제든지 물어보세요!`;
  }

  if (lowerQuestion.includes('프로젝트') || lowerQuestion.includes('실습')) {
    return `실습 프로젝트는 이론을 실제로 적용하는 가장 좋은 방법입니다.

**프로젝트 진행 팁:**
1. 작은 기능부터 시작하세요
2. 단계별로 기능을 추가하세요
3. 코드 리뷰를 받아보세요
4. 문서화를 습관화하세요

${moduleContent ? `"${moduleContent.title}" 모듈의 실습 섹션을 참고하시면 도움이 될 것입니다.` : ''}

프로젝트 진행 중 막히는 부분이 있으면 구체적으로 질문해주세요!`;
  }

  if (lowerQuestion.includes('오류') || lowerQuestion.includes('에러') || lowerQuestion.includes('문제')) {
    return `오류를 해결하는 것도 중요한 학습 과정입니다!

**오류 해결 방법:**
1. 오류 메시지를 자세히 읽어보세요
2. 관련 문서나 공식 문서를 확인하세요
3. 검색 엔진에서 오류 메시지를 검색해보세요
4. 코드를 단계별로 확인하세요

구체적인 오류 메시지나 코드를 공유해주시면 더 정확한 도움을 드릴 수 있습니다.`;
  }

  if (lowerQuestion.includes('면접') || lowerQuestion.includes('취업')) {
    return `면접 준비는 꾸준한 학습과 연습이 필요합니다.

**면접 준비 팁:**
1. 프로젝트 경험을 명확하게 설명할 수 있도록 준비하세요
2. 기술 스택에 대한 깊은 이해를 갖추세요
3. 알고리즘 문제를 꾸준히 풀어보세요
4. 자신의 학습 과정과 성장을 어필하세요

포트폴리오를 잘 정리하고, 학습한 내용을 체계적으로 정리하는 것도 중요합니다.

더 구체적인 질문이 있으시면 알려주세요!`;
  }

  // 기본 응답
  return `질문해주셔서 감사합니다!

${moduleContent ? `현재 "${moduleContent.title}" 모듈을 학습 중이시군요. ` : ''}

**학습 가이드:**
- 개념을 이해하는 것도 중요하지만, 직접 실습하는 것이 더 중요합니다
- 막히는 부분이 있으면 작은 단위로 나누어 접근해보세요
- 꾸준한 학습이 가장 중요합니다

더 구체적인 질문이나 막히는 부분이 있으면 구체적으로 설명해주시면 더 정확한 답변을 드릴 수 있습니다.

예를 들어:
- "React에서 상태 관리가 어려워요"
- "API 연동 방법을 모르겠어요"
- "이 개념이 왜 필요한지 이해가 안 돼요"

이런 식으로 구체적으로 질문해주시면 더 도움이 될 것 같습니다!`;
}

/**
 * Tutor 메시지 생성
 */
export function createTutorMessage(
  question: string,
  response: string,
  moduleId?: string
): TutorMessage {
  return {
    id: generateId(),
    question,
    response,
    timestamp: new Date().toISOString(),
    moduleId
  };
}

/**
 * 학습 컨텍스트 기반 응답 개선
 */
export function enhanceResponseWithContext(
  baseResponse: string,
  moduleContent: ModuleContent | null
): string {
  if (!moduleContent) return baseResponse;

  const contextInfo = `
  
**현재 학습 중인 모듈 정보:**
- 모듈: ${moduleContent.title}
- 설명: ${moduleContent.description}
- 예상 소요 시간: ${moduleContent.estimatedTime}
- 난이도: ${moduleContent.level === 'beginner' ? '초급' : moduleContent.level === 'intermediate' ? '중급' : '고급'}

이 모듈의 주요 섹션:
${moduleContent.sections.map(s => `- ${s.title}`).join('\n')}
`;

  return baseResponse + contextInfo;
}

