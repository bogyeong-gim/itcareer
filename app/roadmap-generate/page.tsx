'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Send, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
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

interface AssessmentAnswer {
  questionId: number;
  answer: string;
}

export default function RoadmapGeneratePage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [enableQuestions, setEnableQuestions] = useState(false);
  const [enableAssessment, setEnableAssessment] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [customAnswer, setCustomAnswer] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [assessmentAnswers, setAssessmentAnswers] = useState<AssessmentAnswer[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  // 질문과 태그 옵션들 (주제에 따라 동적으로 변경 가능)
  const currentQuestion = topic 
    ? `${topic}를 학습하면서 어떤 결과나 개선을 기대하시나요?`
    : '어떤 결과나 개선을 기대하시나요?';

  const tagOptions = [
    '특정 작업에서의 성능 개선',
    '일반 모델을 특정 도메인에 맞게 조정',
    '모델 크기 또는 추론 비용 감소',
    '새로운 연구 기회 탐색',
    '커스텀 애플리케이션 구축'
  ];

  // 퀴즈 문항들
  const quizQuestions = [
    {
      id: 1,
      question: '다음 중 JavaScript의 기본 데이터 타입이 아닌 것은?',
      options: [
        'Number',
        'String',
        'Array',
        'Boolean',
        'Undefined'
      ],
      correctAnswer: 'Array',
      explanation: 'Array는 객체(Object)의 일종이며, JavaScript의 기본(원시) 데이터 타입이 아닙니다.'
    },
    {
      id: 2,
      question: 'React에서 컴포넌트의 상태(state)를 변경할 때 사용하는 함수는?',
      options: [
        'setState',
        'updateState',
        'changeState',
        'modifyState',
        'useState'
      ],
      correctAnswer: 'useState',
      explanation: 'React Hooks의 useState를 사용하여 함수형 컴포넌트에서 상태를 관리합니다.'
    },
    {
      id: 3,
      question: '다음 중 비동기 처리를 위한 JavaScript 문법이 아닌 것은?',
      options: [
        'Promise',
        'async/await',
        'Callback',
        'setTimeout',
        'forEach'
      ],
      correctAnswer: 'forEach',
      explanation: 'forEach는 배열을 순회하는 동기 메서드이며, 비동기 처리를 위한 문법이 아닙니다.'
    },
    {
      id: 4,
      question: 'CSS에서 요소를 화면 중앙에 배치하는 방법이 아닌 것은?',
      options: [
        'margin: 0 auto',
        'display: flex; justify-content: center',
        'position: absolute; left: 50%; transform: translateX(-50%)',
        'text-align: center',
        'float: center'
      ],
      correctAnswer: 'float: center',
      explanation: 'float 속성에는 center 값이 없습니다. float는 left, right, none만 가능합니다.'
    },
    {
      id: 5,
      question: '다음 중 Git 명령어가 아닌 것은?',
      options: [
        'git commit',
        'git push',
        'git clone',
        'git save',
        'git branch'
      ],
      correctAnswer: 'git save',
      explanation: 'git save는 존재하지 않는 명령어입니다. 변경사항을 저장하려면 git add와 git commit을 사용합니다.'
    }
  ];

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setCustomAnswer(tag);
  };

  const handleQuizAnswer = (questionId: number, answer: string) => {
    const updatedAnswers = [...assessmentAnswers];
    const existingIndex = updatedAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = { questionId, answer };
    } else {
      updatedAnswers.push({ questionId, answer });
    }
    
    setAssessmentAnswers(updatedAnswers);
    
    // 답변 후 자동으로 다음 문제로 이동 (마지막 문제가 아닐 경우)
    if (currentQuizIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuizIndex(currentQuizIndex + 1);
      }, 500);
    }
  };

  const handlePreviousQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  };

  const getQuizAnswer = (questionId: number): string | undefined => {
    return assessmentAnswers.find(a => a.questionId === questionId)?.answer;
  };

  const getCurrentQuiz = () => {
    return quizQuestions[currentQuizIndex];
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

  const handleGenerateRoadmap = async () => {
    if (!topic.trim()) {
      alert('학습 주제를 입력해주세요.');
      return;
    }

    setIsGenerating(true);

    try {
      // 퀴즈 답변에서 정보 추출 (퀴즈 결과를 기반으로 수준 파악)
      const quizResults = assessmentAnswers.map(answer => {
        const question = quizQuestions.find(q => q.id === answer.questionId);
        return {
          questionId: answer.questionId,
          isCorrect: question?.correctAnswer === answer.answer
        };
      });
      
      const correctCount = quizResults.filter(r => r.isCorrect).length;
      const experienceAnswer = correctCount >= 4 ? '시니어 (5-10년)' : correctCount >= 2 ? '미들 (3-5년)' : '주니어 (1-3년)';
      const learningHoursAnswer = '10-20시간';
      const weakAreasFromAssessment = quizResults
        .filter(r => !r.isCorrect)
        .map(r => {
          const question = quizQuestions.find(q => q.id === r.questionId);
          return question?.question || '';
        });

      // 대화 내용을 기반으로 진단 결과 생성
      const diagnosisResult: DiagnosisResult = {
        answers: [],
        targetJob: topic,
        analyzedAt: new Date().toISOString(),
        // 평가 답변에서 추출한 정보 우선 사용
        experience: experienceAnswer || chatMessages.find(m => m.content.includes('경력') || m.content.includes('신입'))?.content || undefined,
        learningHours: learningHoursAnswer || chatMessages.find(m => m.content.includes('시간') || m.content.includes('학습'))?.content || undefined,
        weakAreas: weakAreasFromAssessment.length > 0 
          ? weakAreasFromAssessment 
          : chatMessages
              .filter(m => m.role === 'user')
              .map(m => m.content)
              .slice(0, 3)
      };

      // 진단 결과 저장
      saveToStorage('diagnosisResults', diagnosisResult);

      // 로드맵 생성
      const user = getCurrentUser();
      const roadmap = generateRoadmap(diagnosisResult, user?.id);
      saveToStorage('roadmap', roadmap);

      // 로드맵 페이지로 이동
      setTimeout(() => {
        router.push('/roadmap');
      }, 1000);
    } catch (error) {
      console.error('로드맵 생성 중 오류:', error);
      alert('로드맵 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
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
            무엇을 배우고 싶으신가요?
          </h1>
          <p className="text-lg text-gray-600">
            아래에 주제를 입력하면 맞춤형 로드맵을 생성해드립니다.
          </p>
        </div>

        {/* Topic Input */}
        <div className="mb-8">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            무엇을 배우고 싶으신가요?
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
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
        {enableQuestions && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentQuestion}
            </h3>

            {/* Tag Options */}
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

        {/* Quiz Section */}
        {enableAssessment && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-end mb-6">
              <span className="text-sm text-gray-600">
                {currentQuizIndex + 1} / {quizQuestions.length}
              </span>
            </div>

            {getCurrentQuiz() && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                    문제 {currentQuizIndex + 1}
                  </span>
                  <h4 className="text-lg font-semibold text-gray-900 mt-2">
                    {getCurrentQuiz().question}
                  </h4>
                </div>
                
                <div className="space-y-3 mb-6">
                  {getCurrentQuiz().options.map((option, index) => {
                    const isSelected = getQuizAnswer(getCurrentQuiz().id) === option;
                    const isCorrect = option === getCurrentQuiz().correctAnswer;
                    const showResult = getQuizAnswer(getCurrentQuiz().id) !== undefined;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(getCurrentQuiz().id, option)}
                        disabled={showResult}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? showResult && isCorrect
                              ? 'border-green-600 bg-green-50 text-green-900'
                              : showResult && !isCorrect
                              ? 'border-red-600 bg-red-50 text-red-900'
                              : 'border-blue-600 bg-blue-50 text-blue-900'
                            : showResult && isCorrect
                            ? 'border-green-300 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showResult && isSelected && (
                            <span className="text-sm font-medium">
                              {isCorrect ? '✓ 정답' : '✗ 오답'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {getQuizAnswer(getCurrentQuiz().id) && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">해설:</span> {getCurrentQuiz().explanation}
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handlePreviousQuiz}
                    disabled={currentQuizIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    이전
                  </button>
                  
                  <div className="flex gap-2">
                    {quizQuestions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuizIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentQuizIndex
                            ? 'bg-blue-600'
                            : getQuizAnswer(quizQuestions[index].id)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                        aria-label={`문제 ${index + 1}로 이동`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextQuiz}
                    disabled={currentQuizIndex === quizQuestions.length - 1}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    다음
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerateRoadmap}
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

