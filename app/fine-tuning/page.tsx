'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ExternalLink, Monitor, Users, Heart, Star, CheckCircle2, Circle, ChevronRight, Clock, Target } from 'lucide-react';
import { fineTuningData, educationResources, FineTuningSubModule } from '@/lib/fine-tuning-data';

export default function FineTuningPage() {
  const [selectedModule, setSelectedModule] = useState<FineTuningSubModule | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 첫 번째 모듈 자동 선택 제거 - 소개 텍스트를 먼저 보여주기 위해

  // 스크롤 감지로 현재 섹션 추적
  useEffect(() => {
    if (!selectedModule) return;

    const handleScroll = () => {
      const sections = extractSections(selectedModule.content);
      const scrollPosition = window.scrollY + 150; // 상단 여백 고려

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i].id;
        const element = contentRefs.current[sectionId];
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollPosition >= elementTop) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 실행

    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedModule]);

  const handleModuleClick = (module: FineTuningSubModule) => {
    setSelectedModule(module);
    setActiveSection(null);
    // 모듈 변경 시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = contentRefs.current[sectionId];
    if (element) {
      const offset = 100; // 상단 여백
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // 콘텐츠에서 섹션 추출
  const extractSections = (content: string) => {
    const sections: { id: string; title: string; level: number }[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.startsWith('### ')) {
        const title = line.substring(4).trim();
        const id = `section-${sections.length}`;
        sections.push({ id, title, level: 3 });
      } else if (line.startsWith('## ')) {
        const title = line.substring(3).trim();
        const id = `section-${sections.length}`;
        sections.push({ id, title, level: 2 });
      }
    });
    
    return sections;
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
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Mind Map Style (Depth 1) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {fineTuningData.title}
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                {fineTuningData.description}
              </p>

              {/* 마인드맵 스타일 모듈 리스트 */}
              <div className="relative mb-6 min-h-[600px]">
                {/* 중앙 수직선 */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-gray-300 to-blue-300 transform -translate-x-1/2"></div>
                
                <div className="space-y-6 relative">
                  {fineTuningData.subModules.map((module, index) => (
                    <div key={module.id} className="relative">
                      {/* 모듈에서 중앙선으로 연결선 (점선) */}
                      <div 
                        className={`absolute top-1/2 h-0.5 border-t-2 border-dashed border-gray-300 ${
                          index % 2 === 0 ? 'left-0 right-1/2' : 'left-1/2 right-0'
                        }`}
                        style={{ 
                          transform: 'translateY(-50%)'
                        }}
                      ></div>
                      
                      <button
                        onClick={() => handleModuleClick(module)}
                        className={`relative w-full p-4 rounded-lg border-2 transition-all ${
                          selectedModule?.id === module.id
                            ? 'border-blue-500 bg-yellow-100 shadow-lg scale-105'
                            : 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            selectedModule?.id === module.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-yellow-400 text-gray-800'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className={`font-bold text-gray-900 mb-1 ${
                              selectedModule?.id === module.id ? 'text-blue-700' : ''
                            }`}>
                              {module.title}
                            </h3>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {module.description}
                            </p>
                          </div>
                          {selectedModule?.id === module.id && (
                            <ChevronRight className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        
                        {/* 하위 주제 미리보기 */}
                        <div className="mt-3 pt-3 border-t border-yellow-200">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-left">
                              <div className="text-xs font-medium text-gray-500 mb-1">주요 주제</div>
                              <div className="flex flex-wrap gap-1">
                                {module.topics.left.slice(0, 2).map((topic, i) => (
                                  <span key={i} className="text-xs px-2 py-0.5 bg-white rounded border border-gray-200 text-gray-600">
                                    {topic.split(' ')[0]}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-left">
                              <div className="text-xs font-medium text-gray-500 mb-1">추가 주제</div>
                              <div className="flex flex-wrap gap-1">
                                {module.topics.right.slice(0, 2).map((topic, i) => (
                                  <span key={i} className="text-xs px-2 py-0.5 bg-white rounded border border-gray-200 text-gray-600">
                                    {topic.split(' ')[0]}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 학습 진행률 표시 */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">전체 진행률</span>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2">
            {selectedModule ? (
              <div className="space-y-6">
                {/* 모듈 헤더 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedModule.title}
                    </h2>
                    <p className="text-gray-600 mb-4 text-lg">{selectedModule.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">예상 소요 시간: {selectedModule.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-600">난이도: </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedModule.level === 'beginner'
                            ? 'bg-green-100 text-green-700'
                            : selectedModule.level === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {selectedModule.level === 'beginner'
                            ? '초급'
                            : selectedModule.level === 'intermediate'
                            ? '중급'
                            : '고급'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 학습 주제 카드 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      학습 주제
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...selectedModule.topics.left, ...selectedModule.topics.right].map((topic, index) => {
                      const topicNumber = index + 1;
                      const isLeft = index < selectedModule.topics.left.length;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            // 주제 이름으로 섹션 찾기
                            const sections = extractSections(selectedModule.content);
                            const matchingSection = sections.find(s => 
                              s.title.toLowerCase().includes(topic.toLowerCase().split(' ')[0]) ||
                              topic.toLowerCase().includes(s.title.toLowerCase().split(' ')[0])
                            );
                            if (matchingSection) {
                              scrollToSection(matchingSection.id);
                            }
                          }}
                          className="group text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              isLeft ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {topicNumber}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                {topic}
                              </h4>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 목차 (Table of Contents) */}
                {selectedModule && (() => {
                  const sections = extractSections(selectedModule.content);
                  if (sections.length > 0) {
                    return (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          목차
                        </h3>
                        <div className="space-y-2">
                          {sections.map((section, index) => (
                            <button
                              key={section.id}
                              onClick={() => scrollToSection(section.id)}
                              className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                                activeSection === section.id
                                  ? 'bg-blue-500 text-white shadow-md'
                                  : 'bg-white hover:bg-blue-100 text-gray-700'
                              }`}
                            >
                              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                activeSection === section.id
                                  ? 'bg-white text-blue-500'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {index + 1}
                              </span>
                              <span className="flex-1 font-medium">{section.title}</span>
                              <ChevronRight className={`h-4 w-4 flex-shrink-0 ${
                                activeSection === section.id ? 'text-white' : 'text-gray-400'
                              }`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Detailed Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="prose max-w-none">
                    <div className="text-gray-700">
                      <div className="font-sans">
                        {(() => {
                          const paragraphs = selectedModule.content.split('\n\n');
                          let sectionIndex = 0;
                          
                          return paragraphs.map((paragraph, pIndex) => {
                            const lines = paragraph.split('\n');
                            const firstLine = lines[0]?.trim() || '';
                            
                            // 헤더 처리
                            if (firstLine.startsWith('# ')) {
                              return (
                                <h1 key={pIndex} className="text-3xl font-bold text-gray-900 mt-8 mb-6 first:mt-0 pb-3 border-b-2 border-gray-200">
                                  {firstLine.substring(2)}
                                </h1>
                              );
                            }
                            if (firstLine.startsWith('## ')) {
                              return (
                                <h2 key={pIndex} className="text-2xl font-semibold text-gray-900 mt-8 mb-4 pt-4">
                                  {firstLine.substring(3)}
                                </h2>
                              );
                            }
                            if (firstLine.startsWith('### ')) {
                              const sectionId = `section-${sectionIndex++}`;
                              const title = firstLine.substring(4);
                              return (
                                <div
                                  key={pIndex}
                                  ref={(el) => {
                                    if (el) contentRefs.current[sectionId] = el;
                                  }}
                                  className="scroll-mt-24"
                                >
                                  <h3 
                                    id={sectionId}
                                    className="text-xl font-semibold text-gray-800 mt-8 mb-3 pt-6 flex items-center gap-3 group cursor-pointer hover:text-blue-600 transition-colors"
                                    onClick={() => scrollToSection(sectionId)}
                                  >
                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                                      {sectionIndex}
                                    </span>
                                    <span>{title}</span>
                                  </h3>
                                </div>
                              );
                            }
                            
                            // 리스트 처리
                            const listItems = lines.filter(line => line.trim().startsWith('- '));
                            if (listItems.length > 0) {
                              return (
                                <ul key={pIndex} className="list-disc list-inside mb-6 space-y-2 ml-4">
                                  {listItems.map((item, itemIndex) => (
                                    <li key={itemIndex} className="text-gray-700 leading-relaxed">
                                      {item.trim().substring(2)}
                                    </li>
                                  ))}
                                </ul>
                              );
                            }
                            
                            // 일반 텍스트
                            const text = lines.filter(line => !line.trim().startsWith('- ')).join('\n').trim();
                            if (text) {
                              return (
                                <p key={pIndex} className="mb-6 leading-relaxed text-gray-700 text-base">
                                  {text}
                                </p>
                              );
                            }
                            
                            return null;
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 파인튜닝 소개 섹션 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🔧</span>
                    <h2 className="text-3xl font-bold text-gray-900">
                      OpenAI API 파인튜닝(Fine-tuning)이란?
                    </h2>
                  </div>
                  
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p className="text-lg">
                      OpenAI의 GPT 모델은 이미 방대한 데이터를 기반으로 학습된 사전 학습(Pre-trained) 모델입니다.
                    </p>
                    <p className="text-lg">
                      하지만 실제 업무나 서비스에서는 우리 조직만의 문체, 전문 용어, 처리 방식이 필요할 때가 많습니다.
                    </p>
                    <p className="text-lg font-semibold text-blue-700">
                      이럴 때 활용하는 기술이 바로 파인튜닝(Fine-tuning) 입니다.
                    </p>
                  </div>
                </div>

                {/* 파인튜닝의 목적 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🎯</span>
                    <h3 className="text-2xl font-bold text-gray-900">
                      파인튜닝의 목적
                    </h3>
                  </div>
                  
                  <div className="space-y-4 text-gray-700">
                    <p className="text-lg">
                      파인튜닝은 기존 모델에 추가 학습을 시켜 특정 용도에 최적화하는 과정입니다.
                    </p>
                    <p className="text-lg font-medium">예를 들어 다음과 같은 상황에서 효과적입니다:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-lg">
                      <li>기업 전용 답변 스타일로 모델을 맞추고 싶을 때</li>
                      <li>전문 분야(의료, 법률, 교육 등) 용어와 문장을 더 정확히 처리하고 싶을 때</li>
                      <li>반복적인 패턴의 입력-출력 작업을 자동화하고 싶을 때</li>
                      <li>조직의 FAQ나 응대 스크립트를 그대로 답변하게 하고 싶을 때</li>
                    </ul>
                    <p className="text-lg font-semibold text-blue-700 mt-4">
                      즉, 파인튜닝은 일반형 AI → 우리 회사 맞춤형 AI로 진화시키는 기술입니다.
                    </p>
                  </div>
                </div>

                {/* 어떻게 학습되나요 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">📘</span>
                    <h3 className="text-2xl font-bold text-gray-900">
                      어떻게 학습되나요?
                    </h3>
                  </div>
                  
                  <div className="space-y-4 text-gray-700">
                    <p className="text-lg">
                      파인튜닝에서는 입력(Input) → 출력(Output) 형태의 예시 데이터를 모델에 제공합니다.
                    </p>
                    <p className="text-lg font-medium">이 데이터를 통해 모델은 다음을 학습합니다:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-lg">
                      <li>어떤 질문이 들어오면</li>
                      <li>어떤 방식으로 답변해야 하는지</li>
                      <li>어떤 표현, 어떤 흐름, 어떤 톤으로 말해야 하는지</li>
                    </ul>
                  </div>
                </div>

                {/* 예시 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">👩‍💻</span>
                    <h3 className="text-2xl font-bold text-gray-900">
                      예시
                    </h3>
                  </div>
                  
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="text-lg mb-2">
                        <span className="font-semibold">입력:</span> "A 상품 환불 규정 알려줘"
                      </p>
                      <p className="text-lg">
                        <span className="font-semibold">출력:</span> "A 상품은 구매 후 7일 이내 미개봉 상태일 때만 환불이 가능합니다."
                      </p>
                    </div>
                    <p className="text-lg">
                      이런 예시가 수십~수천 개 모이면 모델은 <span className="font-semibold text-blue-700">조직만의 규칙과 패턴을 '내재화'</span>하게 됩니다.
                    </p>
                  </div>
                </div>

                {/* 더 자세히 배우고 싶다면 */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">📚</span>
                    <h3 className="text-2xl font-bold text-gray-900">
                      더 자세히 배우고 싶다면?
                    </h3>
                  </div>
                  
                  <div className="space-y-4 text-gray-700">
                    <p className="text-lg">
                      아래 자료를 통해 파인튜닝 개념, 데이터 준비 방법, API 활용법 등을 단계적으로 학습할 수 있습니다.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-lg">
                      <li>OpenAI 공식 문서</li>
                      <li>모델 파인튜닝 가이드</li>
                      <li>학습 데이터 작성 팁</li>
                    </ul>
                    <p className="text-sm text-gray-600 italic mt-4">
                      (실제 교육에서는 실습용 데이터 구성 예시 + API 연동 실습 코드를 함께 제공합니다.)
                    </p>
                  </div>
                </div>

                {/* 모듈 선택 안내 */}
                <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-8 text-center">
                  <BookOpen className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    학습을 시작하세요
                  </h3>
                  <p className="text-gray-600 mb-4">
                    왼쪽에서 학습하고 싶은 모듈을 클릭하면 세부 내용을 확인할 수 있습니다.
                  </p>
                </div>
              </div>
            )}

            {/* Education Resources Section */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                추천 교육 리소스
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                아래 리소스를 통해 더 깊이 있는 학습을 진행할 수 있습니다.
              </p>

              {/* Free Resources */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-green-600" />
                  <h4 className="text-lg font-semibold text-green-600">무료 리소스</h4>
                </div>
                <div className="space-y-3">
                  {educationResources
                    .filter((resource) => resource.type === 'elearning' && resource.price?.includes('무료'))
                    .map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                Article
                              </span>
                              <span className="text-sm text-gray-500">{resource.provider}</span>
                            </div>
                            <h5 className="font-medium text-gray-900 mb-1">
                              {resource.title}
                            </h5>
                            {resource.description && (
                              <p className="text-sm text-gray-600">{resource.description}</p>
                            )}
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400 ml-4 flex-shrink-0" />
                        </div>
                      </a>
                    ))}
                </div>
              </div>

              {/* Premium Resources */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-purple-600" />
                  <h4 className="text-lg font-semibold text-purple-600">유료 리소스</h4>
                </div>
                <div className="space-y-3">
                  {educationResources
                    .filter((resource) => resource.price && !resource.price.includes('무료'))
                    .map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                {resource.type === 'elearning' ? 'Course' : 'Workshop'}
                              </span>
                              {resource.type === 'offline' && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                  오프라인
                                </span>
                              )}
                              <span className="text-sm text-gray-500">{resource.provider}</span>
                              {resource.id === 'resource-1' && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                  20% Off
                                </span>
                              )}
                            </div>
                            <h5 className="font-medium text-gray-900 mb-1">
                              {resource.title}
                            </h5>
                            {resource.description && (
                              <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                            )}
                            <p className="text-sm font-medium text-blue-600">{resource.price}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400 ml-4 flex-shrink-0" />
                        </div>
                      </a>
                    ))}
                </div>
              </div>

              {/* Resource Type Icons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span>이러닝</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>오프라인 교육</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

