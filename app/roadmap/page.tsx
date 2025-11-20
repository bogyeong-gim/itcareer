'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Target } from 'lucide-react';

interface RoadmapModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
}

export default function RoadmapPage() {
  const [diagnosisData, setDiagnosisData] = useState<any>(null);
  const [modules, setModules] = useState<RoadmapModule[]>([]);

  useEffect(() => {
    // 로컬 스토리지에서 진단 결과 가져오기
    const stored = localStorage.getItem('diagnosisResults');
    if (stored) {
      const results = JSON.parse(stored);
      setDiagnosisData(results);
      generateRoadmap(results);
    }
  }, []);

  const generateRoadmap = (results: any[]) => {
    // 진단 결과를 기반으로 로드맵 생성 (간단한 예시)
    const targetJob = results.find(r => r.questionId === 3)?.answer || '개발자 (풀스택)';
    const experience = results.find(r => r.questionId === 2)?.answer || '주니어 (1-3년)';
    
    // 목표 직무에 따른 모듈 생성
    const generatedModules: RoadmapModule[] = [
      {
        id: '1',
        title: '기초 역량 강화',
        description: '목표 직무에 필요한 기본 기술과 개념을 학습합니다.',
        duration: '4주',
        level: 'beginner',
        completed: false
      },
      {
        id: '2',
        title: '실무 프로젝트 경험',
        description: '실제 프로젝트를 통해 실무 역량을 키웁니다.',
        duration: '6주',
        level: 'intermediate',
        completed: false
      },
      {
        id: '3',
        title: '포트폴리오 구축',
        description: '학습한 내용을 바탕으로 포트폴리오를 작성합니다.',
        duration: '2주',
        level: 'intermediate',
        completed: false
      },
      {
        id: '4',
        title: '면접 준비 및 네트워킹',
        description: '면접 스킬과 커뮤니티 활동을 통해 커리어를 확장합니다.',
        duration: '3주',
        level: 'advanced',
        completed: false
      }
    ];

    setModules(generatedModules);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              홈으로
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">맞춤형 커리어 로드맵</h1>
          <p className="text-xl text-gray-600">
            진단 결과를 바탕으로 개인화된 학습 경로를 제시합니다.
          </p>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-6">
          {modules.map((module, index) => (
            <div key={module.id} className="relative">
              {/* Timeline Line */}
              {index < modules.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" />
              )}
              
              <div className="flex items-start">
                {/* Timeline Dot */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                  module.completed ? 'bg-green-500' : 'bg-blue-600'
                }`}>
                  {module.completed ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : (
                    <span className="text-white font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Module Card */}
                <div className="ml-6 flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{module.title}</h3>
                      <p className="text-gray-600">{module.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      module.level === 'beginner' ? 'bg-green-100 text-green-700' :
                      module.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {module.level === 'beginner' ? '초급' : module.level === 'intermediate' ? '중급' : '고급'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      예상 소요 시간: {module.duration}
                    </div>
                    <Link
                      href={`/module/${module.id}`}
                      className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      학습 시작하기
                      <BookOpen className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                포트폴리오 자동 생성 기능을 사용하시겠어요?
              </h3>
              <p className="text-gray-600">
                학습 이력을 기반으로 커리어 포트폴리오를 자동으로 생성할 수 있습니다.
              </p>
            </div>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 whitespace-nowrap"
            >
              회원가입하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}


