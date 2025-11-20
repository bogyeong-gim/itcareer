'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Loader2, Send } from 'lucide-react';
import { generateTutorResponse } from '@/lib/ai-tutor';
import { generateRoadmap } from '@/lib/roadmap';
import { saveToStorage, getCurrentUser } from '@/lib/utils';
import { DiagnosisResult } from '@/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// topic에 따라 다른 질문과 태그 옵션을 반환하는 함수
const getQuestionByTopic = (topic: string) => {
  const lowerTopic = topic.toLowerCase();
  
  // AI/머신러닝 관련
  if (lowerTopic.includes('ai') || lowerTopic.includes('인공지능') || 
      lowerTopic.includes('machine learning') || lowerTopic.includes('머신러닝') ||
      lowerTopic.includes('fine tuning') || lowerTopic.includes('딥러닝') ||
      lowerTopic.includes('deep learning') || lowerTopic.includes('모델')) {
    return {
      question: `${topic} 역량을 기르면서 어떤 결과나 개선을 기대하시나요?`,
      tags: [
        '특정 작업에서의 성능 개선',
        '일반 모델을 특정 도메인에 맞게 조정',
        '모델 크기 또는 추론 비용 감소',
        '새로운 연구 기회 탐색',
        '커스텀 애플리케이션 구축'
      ]
    };
  }
  
  // 웹 개발 관련
  if (lowerTopic.includes('react') || lowerTopic.includes('vue') || 
      lowerTopic.includes('angular') || lowerTopic.includes('프론트엔드') ||
      lowerTopic.includes('frontend') || lowerTopic.includes('next') ||
      lowerTopic.includes('javascript') || lowerTopic.includes('typescript')) {
    return {
      question: `${topic} 역량을 기르면서 어떤 프로젝트나 목표를 갖고 계신가요?`,
      tags: [
        '포트폴리오 웹사이트 구축',
        '실무 프로젝트 참여 준비',
        '특정 프레임워크 마스터하기',
        '성능 최적화 능력 향상',
        '반응형 UI/UX 개발'
      ]
    };
  }
  
  // 데이터 분석 관련
  if (lowerTopic.includes('데이터') || lowerTopic.includes('data') ||
      lowerTopic.includes('분석') || lowerTopic.includes('analysis') ||
      lowerTopic.includes('python') || lowerTopic.includes('pandas') ||
      lowerTopic.includes('sql')) {
    return {
      question: `${topic} 역량을 기르면서 어떤 데이터 활용 목표가 있으신가요?`,
      tags: [
        '비즈니스 인사이트 도출',
        '데이터 시각화 능력 향상',
        '머신러닝 모델 구축',
        '대용량 데이터 처리',
        '데이터 기반 의사결정'
      ]
    };
  }
  
  // 백엔드 관련
  if (lowerTopic.includes('backend') || lowerTopic.includes('백엔드') ||
      lowerTopic.includes('node') || lowerTopic.includes('spring') ||
      lowerTopic.includes('api') || lowerTopic.includes('서버')) {
    return {
      question: `${topic} 역량을 기르면서 어떤 시스템을 구축하고 싶으신가요?`,
      tags: [
        'RESTful API 개발',
        '마이크로서비스 아키텍처',
        '데이터베이스 설계 및 최적화',
        '서버 성능 및 보안 강화',
        '실시간 시스템 구축'
      ]
    };
  }
  
  // 기본 질문
  return {
    question: `${topic} 역량을 기르면서 어떤 목표나 결과를 기대하시나요?`,
    tags: [
      '실무 적용 능력 향상',
      '전문성을 통한 커리어 발전',
      '새로운 프로젝트 참여',
      '현재 업무 효율성 개선',
      '개인 포트폴리오 강화'
    ]
  };
};

export default function RoadmapGeneratePage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [enableQuestions, setEnableQuestions] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [customAnswer, setCustomAnswer] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // topic에 따라 동적으로 질문과 태그 생성
  const questionData = topic ? getQuestionByTopic(topic) : null;
  const currentQuestion = questionData?.question || '어떤 결과나 개선을 기대하시나요?';
  const tagOptions = questionData?.tags || [];

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setCustomAnswer(tag);
  };

  const handleSendMessage = async () => {
    if (!customAnswer.trim() && !selectedTag) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: customAnswer || selectedTag || '',
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCustomAnswer('');
    setSelectedTag(null);
    setIsLoading(true);

    try {
      // AI 응답 생성
      const response = await generateTutorResponse(
        userMessage.content,
        null,
        `주제: ${topic}. 사용자가 로드맵 생성을 위해 질문에 답변하고 있습니다.`
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI 응답 생성 중 오류:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSearch = async () => {
    if (!topic.trim()) {
      return;
    }

    // 'AI Fine Tuning' 검색어 감지 (대소문자 무시, 공백 무시)
    const normalizedTopic = topic.trim().toLowerCase().replace(/\s+/g, ' ');
    const aiFineTuningKeywords = [
      'ai fine tuning',
      'ai fine-tuning',
      'fine tuning',
      'fine-tuning',
      'ai 파인튜닝',
      '파인튜닝'
    ];

    if (aiFineTuningKeywords.some(keyword => normalizedTopic.includes(keyword))) {
      // 로드맵 생성 애니메이션 표시
      setIsGenerating(true);
      
      // 애니메이션을 보여주기 위해 약간의 지연
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // AI Fine Tuning 페이지로 이동
      router.push('/fine-tuning');
      return;
    }

    // 다른 검색어는 기존 로직대로 진행
    handleGenerateRoadmap();
  };

  const handleGenerateRoadmap = async () => {
    if (!topic.trim()) {
      alert('학습 주제를 입력해주세요.');
      return;
    }

    setIsGenerating(true);

    try {
      if (!topic || topic.trim().length === 0) {
        throw new Error('학습 주제를 입력해주세요.');
      }
      // 대화 내용을 기반으로 진단 결과 생성
      const diagnosisResult: DiagnosisResult = {
        answers: [],
        targetJob: topic,
        analyzedAt: new Date().toISOString(),
        experience: chatMessages.find(m => m.content.includes('경력') || m.content.includes('신입'))?.content || undefined,
        learningHours: chatMessages.find(m => m.content.includes('시간') || m.content.includes('학습'))?.content || undefined,
        weakAreas: chatMessages
          .filter(m => m.role === 'user')
          .map(m => m.content)
          .slice(0, 3)
      };

      // 진단 결과 저장
      saveToStorage('diagnosisResults', diagnosisResult);

      // 로드맵 생성 (비동기 - context7 통합)
      const user = getCurrentUser();
      const roadmap = await generateRoadmap(diagnosisResult, user?.id);
      saveToStorage('roadmap', roadmap);

      // 로드맵 페이지로 이동
      setTimeout(() => {
        router.push('/roadmap');
      }, 1000);
    } catch (error) {
      console.error('로드맵 생성 중 오류:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : '로드맵 생성 중 오류가 발생했습니다. 다시 시도해주세요.';
      alert(errorMessage);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              홈으로
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            어떤 역량을 기르고 싶으신가요?
          </h1>
          <p className="text-lg text-gray-600">
            아래에 주제를 입력하면 맞춤형 로드맵을 생성해드립니다.
          </p>
        </div>

        {/* Topic Input */}
        <div className="mb-8">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            어떤 역량을 기르고 싶으신가요?
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleTopicSearch();
              }
            }}
            placeholder="예: AI Fine Tuning, React 개발, 데이터 분석 등"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>

        {/* Enable Questions Checkbox */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableQuestions}
              onChange={(e) => setEnableQuestions(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">
              더 나은 로드맵을 위해 다음 질문에 답변해주세요
            </span>
          </label>
        </div>

        {/* Questions Section */}
        {enableQuestions && topic && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentQuestion}
            </h3>

            {/* Tag Options */}
            {tagOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tagOptions.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => handleTagClick(tag)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-yellow-100 text-gray-700 hover:bg-yellow-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Messages */}
            {chatMessages.length > 0 && (
              <div className="mb-4 space-y-4 max-h-96 overflow-y-auto">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input Field */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customAnswer}
                onChange={(e) => setCustomAnswer(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="답변을 입력하세요..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={(!customAnswer.trim() && !selectedTag) || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleTopicSearch}
            disabled={!topic.trim() || isGenerating}
            className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                로드맵 생성
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

