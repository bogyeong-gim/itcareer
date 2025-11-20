'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, BookOpen, CheckCircle } from 'lucide-react';

interface ContentSection {
  id: string;
  title: string;
  content: string;
}

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showTutor, setShowTutor] = useState(false);
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');

  // 모듈별 콘텐츠 (실제로는 API에서 가져올 수 있음)
  const moduleContent: Record<string, ContentSection[]> = {
    '1': [
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
   - 비동기 프로그래밍 이해`
      },
      {
        id: '1-2',
        title: '실습 프로젝트',
        content: `이론을 바탕으로 간단한 프로젝트를 진행합니다.

프로젝트 예시:
- Todo 앱 만들기
- 간단한 API 서버 구축
- 데이터베이스 CRUD 구현

각 프로젝트는 단계별로 진행하며, 실무에서 자주 사용되는 패턴을 학습합니다.`
      }
    ],
    '2': [
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
   - 애자일 방법론 적용`
      }
    ],
    '3': [
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
   - 테스트 코드 작성`
      }
    ],
    '4': [
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
   - 커리어 목표`
      }
    ]
  };

  const sections = moduleContent[moduleId] || moduleContent['1'];

  const handleTutorQuestion = async () => {
    if (!tutorQuestion.trim()) return;

    // 실제로는 AI API를 호출하지만, 여기서는 시뮬레이션
    setTutorResponse('AI 튜터가 답변을 생성하고 있습니다...');
    
    setTimeout(() => {
      setTutorResponse(`질문에 대한 답변:

${tutorQuestion}에 대해 설명드리겠습니다.

이 주제는 커리어 개발에 있어 중요한 부분입니다. 다음과 같은 접근 방법을 권장합니다:

1. 기본 개념부터 차근차근 학습
2. 실습을 통해 이해도 높이기
3. 프로젝트에 적용해보기

더 구체적인 질문이 있으시면 언제든지 물어보세요!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/roadmap" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              로드맵으로 돌아가기
            </Link>
            <button
              onClick={() => setShowTutor(!showTutor)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              AI 튜터
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                모듈 {moduleId} 학습 콘텐츠
              </h1>

              <div className="space-y-6">
                {sections.map((section) => (
                  <div key={section.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <button
                      onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                      className="w-full text-left flex items-center justify-between"
                    >
                      <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                      <span className="text-gray-400">
                        {activeSection === section.id ? '▼' : '▶'}
                      </span>
                    </button>
                    {activeSection === section.id && (
                      <div className="mt-4 prose max-w-none">
                        <pre className="whitespace-pre-wrap text-gray-700 font-sans bg-gray-50 p-4 rounded-lg">
                          {section.content}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
                <button className="flex items-center text-gray-600 hover:text-gray-900">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  완료 표시
                </button>
                <Link
                  href="/roadmap"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  다음 모듈로
                </Link>
              </div>
            </div>
          </div>

          {/* AI Tutor Sidebar */}
          {showTutor && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  AI 튜터
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  학습 중 궁금한 점이 있으면 언제든지 물어보세요!
                </p>
                
                <div className="space-y-4">
                  <textarea
                    value={tutorQuestion}
                    onChange={(e) => setTutorQuestion(e.target.value)}
                    placeholder="질문을 입력하세요..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                  <button
                    onClick={handleTutorQuestion}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    질문하기
                  </button>
                  
                  {tutorResponse && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{tutorResponse}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


