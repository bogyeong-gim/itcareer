'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, BookOpen, CheckCircle } from 'lucide-react';
import { ModuleContent, DiagnosisResult } from '@/types';
import { generateModuleContent } from '@/lib/content';
import { getFromStorage, saveToStorage, getCurrentUser } from '@/lib/utils';
import { startModuleLearning, completeSection, completeModule, getModuleLearningHistory } from '@/lib/learning-history';
import { generateTutorResponse, createTutorMessage, enhanceResponseWithContext } from '@/lib/ai-tutor';

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;
  const [moduleContent, setModuleContent] = useState<ModuleContent | null>(null);
  const [showTutor, setShowTutor] = useState(false);
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  useEffect(() => {
    // 진단 결과 가져오기
    const diagnosisResult = getFromStorage<DiagnosisResult>('diagnosisResults', null);
    
    // 모듈 콘텐츠 생성
    const content = generateModuleContent(moduleId, diagnosisResult || undefined);
    setModuleContent(content);
    
    // 사용자 정보 가져오기
    const user = getCurrentUser();
    
    if (user) {
      // 학습 이력 불러오기
      const history = getModuleLearningHistory(user.id, moduleId);
      if (history) {
        setCompletedSections(history.sectionsCompleted);
      } else {
        // 학습 시작
        const roadmap = getFromStorage('roadmap', null);
        if (roadmap) {
          const module = roadmap.modules.find((m: any) => m.id === moduleId);
          if (module) {
            startModuleLearning(user.id, module);
          }
        }
      }
    } else {
      // 비회원인 경우 로컬 스토리지 사용
      const savedProgress = getFromStorage<string[]>(`module-${moduleId}-progress`, []);
      setCompletedSections(savedProgress);
    }
  }, [moduleId]);
  const handleSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      const user = getCurrentUser();
      const updated = [...completedSections, sectionId];
      setCompletedSections(updated);
      
      if (user) {
        // 회원인 경우 학습 이력에 저장
        completeSection(user.id, moduleId, sectionId);
        
        // 모든 섹션이 완료되었는지 확인
        if (moduleContent && updated.length === moduleContent.sections.length) {
          completeModule(user.id, moduleId);
          
          // 로드맵 업데이트
          const roadmap = getFromStorage('roadmap', null);
          if (roadmap) {
            const updatedModules = roadmap.modules.map((m: any) =>
              m.id === moduleId ? { ...m, completed: true, completedAt: new Date().toISOString() } : m
            );
            saveToStorage('roadmap', { ...roadmap, modules: updatedModules });
          }
        }
      } else {
        // 비회원인 경우 로컬 스토리지만 사용
        saveToStorage(`module-${moduleId}-progress`, updated);
      }
    }
  };

  const handleTutorQuestion = async () => {
    if (!tutorQuestion.trim()) return;

    setTutorResponse('AI 튜터가 답변을 생성하고 있습니다...');
    
    try {
      // AI Tutor 응답 생성
      const response = await generateTutorResponse(
        tutorQuestion,
        moduleContent,
        `모듈 ID: ${moduleId}`
      );
      
      // 컨텍스트 기반 응답 개선
      const enhancedResponse = enhanceResponseWithContext(response, moduleContent);
      
      // 메시지 저장
      const message = createTutorMessage(tutorQuestion, enhancedResponse, moduleId);
      const allMessages = getFromStorage('tutorMessages', []);
      allMessages.push(message);
      saveToStorage('tutorMessages', allMessages);
      
      setTutorResponse(enhancedResponse);
      setTutorQuestion(''); // 질문 초기화
    } catch (error) {
      console.error('AI Tutor 응답 생성 중 오류:', error);
      setTutorResponse('죄송합니다. 답변을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
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
        {moduleContent ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {moduleContent.title}
                  </h1>
                  <p className="text-gray-600">{moduleContent.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span>예상 소요 시간: {moduleContent.estimatedTime}</span>
                    <span>난이도: {moduleContent.level === 'beginner' ? '초급' : moduleContent.level === 'intermediate' ? '중급' : '고급'}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {moduleContent.sections.map((section) => (
                    <div key={section.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                          {completedSections.includes(section.id) && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </div>
                      <div className="mt-4 prose max-w-none">
                        <pre className="whitespace-pre-wrap text-gray-700 font-sans bg-gray-50 p-4 rounded-lg">
                          {section.content}
                        </pre>
                        <button
                          onClick={() => handleSectionComplete(section.id)}
                          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          {completedSections.includes(section.id) ? '✓ 완료됨' : '완료 표시'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    진행률: {completedSections.length} / {moduleContent.sections.length} 섹션 완료
                  </div>
                  <Link
                    href="/roadmap"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    로드맵으로 돌아가기
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">콘텐츠를 불러오는 중...</p>
          </div>
        )}
      </main>
    </div>
  );
}


