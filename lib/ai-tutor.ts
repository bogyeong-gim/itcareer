import { TutorMessage, ModuleContent } from '@/types';
import { generateId } from './utils';

/**
 * OpenAI API를 사용한 AI 응답 생성
 */
async function callOpenAIAPI(
  question: string,
  moduleContent: ModuleContent | null,
  context?: string
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'https://api.openai.com/v1/chat/completions';

  if (!apiKey) {
    throw new Error('OpenAI API 키가 설정되지 않았습니다.');
  }

  const systemPrompt = `당신은 친절하고 전문적인 AI 튜터입니다. 사용자의 질문에 대해 명확하고 도움이 되는 답변을 제공해주세요.
${moduleContent ? `현재 학습 중인 모듈: ${moduleContent.title}\n설명: ${moduleContent.description}` : ''}
${context ? `컨텍스트: ${context}` : ''}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '응답을 생성할 수 없습니다.';
  } catch (error) {
    console.error('OpenAI API 호출 오류:', error);
    throw error;
  }
}

/**
 * AI Tutor 응답 생성
 * 환경 변수에 API 키가 설정되어 있으면 실제 API를 호출하고, 없으면 시뮬레이션 응답을 반환합니다.
 */
export async function generateTutorResponse(
  question: string,
  moduleContent: ModuleContent | null,
  context?: string
): Promise<string> {
  // 환경 변수 확인
  const enableAITutor = process.env.NEXT_PUBLIC_ENABLE_AI_TUTOR === 'true';
  const hasAPIKey = !!process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  // API 키가 있고 AI Tutor가 활성화되어 있으면 실제 API 호출
  if (enableAITutor && hasAPIKey) {
    try {
      return await callOpenAIAPI(question, moduleContent, context);
    } catch (error) {
      console.warn('AI API 호출 실패, 시뮬레이션 모드로 전환:', error);
      // API 호출 실패 시 시뮬레이션 모드로 fallback
    }
  }

  // 시뮬레이션 모드: 컨텍스트 기반 응답 생성
  const lowerQuestion = question.toLowerCase();
  
  // 로드맵 생성 컨텍스트 확인
  const isRoadmapContext = context?.includes('로드맵') || context?.includes('roadmap');
  
  // 로드맵 생성 관련 질문에 대한 응답
  if (isRoadmapContext) {
    if (lowerQuestion.includes('성능') || lowerQuestion.includes('개선') || lowerQuestion.includes('특정 작업')) {
      return `좋은 목표입니다! 특정 작업에서의 성능 개선을 목표로 하시는군요.

**로드맵 제안:**
1. 현재 성능 기준선을 측정하고 벤치마크를 설정하세요
2. 해당 작업에 특화된 데이터셋을 준비하세요
3. Fine-tuning 전략을 수립하세요 (전체 모델 vs LoRA 등)
4. 평가 지표를 명확히 정의하세요

이런 목표를 바탕으로 맞춤형 학습 경로를 제안해드리겠습니다. 더 구체적인 정보가 있으시면 알려주세요!`;
    }
    
    if (lowerQuestion.includes('도메인') || lowerQuestion.includes('니치') || lowerQuestion.includes('특정 도메인')) {
      return `도메인 특화 모델을 만드는 것은 흥미로운 도전입니다!

**도메인 적응 전략:**
1. 도메인별 전문 데이터 수집 및 정제
2. 도메인 전문 용어와 컨텍스트 이해
3. 도메인 특화 평가 방법론 개발
4. 일반 모델과의 성능 비교

어떤 도메인에 관심이 있으신가요? 더 구체적인 정보를 주시면 더 정확한 로드맵을 제안해드릴 수 있습니다.`;
    }
    
    if (lowerQuestion.includes('비용') || lowerQuestion.includes('크기') || lowerQuestion.includes('추론')) {
      return `모델 최적화는 실무에서 매우 중요한 요소입니다!

**최적화 전략:**
1. 모델 압축 기법 학습 (양자화, 프루닝 등)
2. 효율적인 아키텍처 탐색
3. 추론 최적화 기법 적용
4. 하드웨어별 최적화 방법

이런 최적화 목표를 바탕으로 효율적인 학습 경로를 제안해드리겠습니다.`;
    }
    
    if (lowerQuestion.includes('연구') || lowerQuestion.includes('탐색') || lowerQuestion.includes('기회')) {
      return `연구와 탐색은 혁신의 시작입니다!

**연구 로드맵 제안:**
1. 최신 논문 및 연구 동향 파악
2. 실험 설계 및 검증 방법론 학습
3. 오픈소스 도구 및 프레임워크 활용
4. 커뮤니티 참여 및 협업

어떤 연구 분야에 관심이 있으신가요? 더 구체적인 방향을 알려주시면 맞춤형 연구 로드맵을 제안해드리겠습니다.`;
    }
    
    if (lowerQuestion.includes('애플리케이션') || lowerQuestion.includes('앱') || lowerQuestion.includes('커스텀')) {
      return `커스텀 애플리케이션 구축은 실무 경험을 쌓는 좋은 방법입니다!

**애플리케이션 개발 로드맵:**
1. 요구사항 분석 및 설계
2. 모델 통합 및 API 개발
3. 사용자 인터페이스 구축
4. 배포 및 모니터링

어떤 종류의 애플리케이션을 만들고 싶으신가요? 더 구체적인 정보를 주시면 단계별 학습 경로를 제안해드리겠습니다.`;
    }
  }
  
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

