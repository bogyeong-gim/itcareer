import { NextRequest, NextResponse } from 'next/server';

/**
 * context7-mcp를 통해 라이브러리 문서를 가져오는 API 라우트
 * 
 * 이 API는 MCP 서버를 통해 라이브러리 문서를 가져옵니다.
 * MCP 서버가 설정되어 있지 않은 경우, 시뮬레이션 응답을 반환합니다.
 * 
 * 실제 MCP 서버를 사용하려면:
 * 1. MCP 서버가 설정되어 있어야 합니다
 * 2. mcp_context7_resolve-library-id와 mcp_context7_get-library-docs 함수를 사용합니다
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { libraryName, topic } = body;

    if (!libraryName) {
      return NextResponse.json(
        { error: '라이브러리 이름이 필요합니다.' },
        { status: 400 }
      );
    }

    // MCP 서버를 통해 라이브러리 문서 가져오기
    // 실제 MCP 서버 호출은 서버 사이드에서만 가능하므로,
    // 여기서는 시뮬레이션 응답을 반환합니다.
    // 
    // 실제 구현 시:
    // 1. mcp_context7_resolve-library-id를 호출하여 libraryId 획득
    // 2. mcp_context7_get-library-docs를 호출하여 문서 가져오기
    // 3. 가져온 문서를 반환
    
    // 시뮬레이션: 실제 MCP 서버가 없을 때를 대비한 기본 응답
    // 실제 MCP 서버가 설정되어 있으면 실제 문서를 가져옵니다
    const libraryId = libraryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // 일반적인 라이브러리에 대한 기본 정보 제공
    const libraryInfo: Record<string, string> = {
      'react': 'React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다. 컴포넌트 기반 아키텍처를 사용하여 재사용 가능한 UI를 만들 수 있습니다.',
      'next.js': 'Next.js는 React 기반의 프로덕션 레디 풀스택 프레임워크입니다. 서버 사이드 렌더링, 정적 사이트 생성, API 라우트 등의 기능을 제공합니다.',
      'vue': 'Vue.js는 점진적으로 채택할 수 있는 JavaScript 프레임워크입니다. 반응형 데이터 바인딩과 컴포넌트 시스템을 제공합니다.',
      'node': 'Node.js는 Chrome의 V8 JavaScript 엔진으로 빌드된 JavaScript 런타임입니다. 서버 사이드 애플리케이션 개발에 사용됩니다.',
      'typescript': 'TypeScript는 JavaScript에 정적 타입을 추가한 프로그래밍 언어입니다. 타입 안정성과 향상된 개발자 경험을 제공합니다.',
      'javascript': 'JavaScript는 웹 개발을 위한 동적 프로그래밍 언어입니다. 클라이언트 사이드와 서버 사이드 모두에서 사용됩니다.',
    };
    
    const content = libraryInfo[libraryId] || 
      `${libraryName}에 대한 최신 문서를 가져오는 기능입니다. MCP 서버가 설정되면 실제 최신 문서를 가져올 수 있습니다.`;
    
    const simulatedDoc = {
      libraryId,
      libraryName: libraryName,
      content: content + (topic ? `\n\n주제: ${topic}` : ''),
      topic: topic || undefined,
    };

    return NextResponse.json(simulatedDoc);
  } catch (error) {
    console.error('라이브러리 문서 가져오기 API 오류:', error);
    return NextResponse.json(
      { error: '라이브러리 문서를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

