'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface DiagnosisAnswer {
  questionId: number;
  answer: string | number;
}

export default function DiagnosisPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const questions = [
    {
      id: 1,
      question: '현재 직무는 무엇인가요?',
      type: 'select',
      options: [
        '개발자 (프론트엔드)',
        '개발자 (백엔드)',
        '개발자 (풀스택)',
        '데이터 분석가',
        '프로덕트 매니저',
        '디자이너',
        '마케터',
        '기타',
        '취준생 (직무 미정)'
      ]
    },
    {
      id: 2,
      question: '경력 기간은 얼마나 되나요?',
      type: 'select',
      options: [
        '신입 (1년 미만)',
        '주니어 (1-3년)',
        '미들 (3-5년)',
        '시니어 (5-10년)',
        '리드 (10년 이상)'
      ]
    },
    {
      id: 3,
      question: '목표 직무는 무엇인가요?',
      type: 'select',
      options: [
        '개발자 (프론트엔드)',
        '개발자 (백엔드)',
        '개발자 (풀스택)',
        '데이터 분석가',
        '프로덕트 매니저',
        '디자이너',
        '마케터',
        '기타',
        '현재 직무 유지 및 역량 강화'
      ]
    },
    {
      id: 4,
      question: '현재 가장 부족하다고 느끼는 역량은 무엇인가요?',
      type: 'select',
      options: [
        '기술적 역량 (프로그래밍, 도구 사용 등)',
        '비즈니스 이해도',
        '커뮤니케이션 능력',
        '프로젝트 관리 능력',
        '리더십',
        '전문 도메인 지식'
      ]
    },
    {
      id: 5,
      question: '주당 학습 가능한 시간은 얼마나 되나요?',
      type: 'select',
      options: [
        '5시간 미만',
        '5-10시간',
        '10-20시간',
        '20시간 이상'
      ]
    }
  ];

  const handleAnswer = (answer: string | number) => {
    const newAnswer: DiagnosisAnswer = {
      questionId: questions[currentStep].id,
      answer
    };
    
    const updatedAnswers = [...answers];
    const existingIndex = updatedAnswers.findIndex(a => a.questionId === questions[currentStep].id);
    
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }
    
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 진단 완료
      setIsComplete(true);
      // 결과 페이지로 이동 (로컬 스토리지에 저장)
      localStorage.setItem('diagnosisResults', JSON.stringify(answers));
      setTimeout(() => {
        router.push('/roadmap');
      }, 2000);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentAnswer = answers.find(a => a.questionId === questions[currentStep].id)?.answer;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">진단이 완료되었습니다!</h2>
          <p className="text-gray-600">맞춤형 로드맵을 생성하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              홈으로
            </Link>
            <div className="text-sm text-gray-500">
              {currentStep + 1} / {questions.length}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {questions[currentStep].question}
          </h2>
          
          <div className="space-y-3">
            {questions[currentStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  currentAnswer === option
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            이전
          </button>
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            {currentStep === questions.length - 1 ? '완료' : '다음'}
          </button>
        </div>
      </main>
    </div>
  );
}


