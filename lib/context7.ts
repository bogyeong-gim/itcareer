/**
 * context7-mcp를 활용한 라이브러리 문서 가져오기
 * 
 * 이 파일은 context7 MCP 서버를 통해 라이브러리 문서를 가져오는 기능을 제공합니다.
 * MCP 서버는 서버 사이드에서만 동작하므로, API 라우트를 통해 접근해야 합니다.
 */

export interface LibraryDoc {
  libraryId: string;
  libraryName: string;
  content: string;
  topic?: string;
}

/**
 * 라이브러리 이름에서 라이브러리 ID 추출 시도
 * 일반적인 라이브러리 이름 매핑
 */
const LIBRARY_NAME_MAP: Record<string, string> = {
  'react': 'react',
  'next.js': 'next.js',
  'nextjs': 'next.js',
  'vue': 'vue',
  'angular': 'angular',
  'node.js': 'node',
  'nodejs': 'node',
  'typescript': 'typescript',
  'javascript': 'javascript',
  'python': 'python',
  'django': 'django',
  'flask': 'flask',
  'express': 'express',
  'mongodb': 'mongodb',
  'postgresql': 'postgresql',
  'tailwindcss': 'tailwindcss',
  'tailwind': 'tailwindcss',
};

/**
 * 질문에서 라이브러리 이름 추출
 */
export function extractLibraryNames(question: string): string[] {
  const lowerQuestion = question.toLowerCase();
  const libraries: string[] = [];
  
  // 매핑된 라이브러리 이름 확인
  for (const [key, value] of Object.entries(LIBRARY_NAME_MAP)) {
    if (lowerQuestion.includes(key)) {
      libraries.push(value);
    }
  }
  
  // 일반적인 패턴 확인 (예: "React의", "Next.js에서" 등)
  const libraryPatterns = [
    /(react|vue|angular|next\.?js|node\.?js|typescript|javascript|python|django|flask|express|mongodb|postgresql|tailwind)/gi
  ];
  
  libraryPatterns.forEach(pattern => {
    const matches = question.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const normalized = match.toLowerCase().replace(/\./g, '');
        if (LIBRARY_NAME_MAP[normalized]) {
          const lib = LIBRARY_NAME_MAP[normalized];
          if (!libraries.includes(lib)) {
            libraries.push(lib);
          }
        }
      });
    }
  });
  
  return libraries;
}

/**
 * API 라우트를 통해 라이브러리 문서 가져오기
 */
export async function fetchLibraryDocs(
  libraryName: string,
  topic?: string
): Promise<LibraryDoc | null> {
  try {
    const response = await fetch('/api/context7/docs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        libraryName,
        topic,
      }),
    });

    if (!response.ok) {
      console.warn(`라이브러리 문서 가져오기 실패: ${libraryName}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('라이브러리 문서 가져오기 중 오류:', error);
    return null;
  }
}

/**
 * 여러 라이브러리 문서 가져오기
 */
export async function fetchMultipleLibraryDocs(
  libraryNames: string[],
  topic?: string
): Promise<LibraryDoc[]> {
  const docs = await Promise.all(
    libraryNames.map(name => fetchLibraryDocs(name, topic))
  );
  
  return docs.filter((doc): doc is LibraryDoc => doc !== null);
}

/**
 * 질문에서 관련 라이브러리 문서 가져오기
 */
export async function fetchRelevantDocs(
  question: string,
  topic?: string
): Promise<LibraryDoc[]> {
  const libraryNames = extractLibraryNames(question);
  
  if (libraryNames.length === 0) {
    return [];
  }
  
  return await fetchMultipleLibraryDocs(libraryNames, topic);
}

