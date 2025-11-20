'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Target } from 'lucide-react';
import { Roadmap, RoadmapModule, DiagnosisResult } from '@/types';
import { generateRoadmap, calculateRoadmapProgress } from '@/lib/roadmap';
import { getFromStorage, getCurrentUser, getLevelColor, getLevelLabel } from '@/lib/utils';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 로컬 스토리지에서 진단 결과 가져오기
    const storedResult = getFromStorage<DiagnosisResult>('diagnosisResults', null);
    
    if (storedResult) {
      setDiagnosisResult(storedResult);
      
      // 기존 로드맵이 있는지 확인
      const existingRoadmap = getFromStorage<Roadmap>('roadmap', null);
      
      if (existingRoadmap) {
        setRoadmap(existingRoadmap);
        setProgress(calculateRoadmapProgress(existingRoadmap));
      } else {
        // 새 로드맵 생성
        const user = getCurrentUser();
        const newRoadmap = generateRoadmap(storedResult, user?.id);
        setRoadmap(newRoadmap);
        setProgress(0);
        
        // 로컬 스토리지에 저장
        localStorage.setItem('roadmap', JSON.stringify(newRoadmap));
      }
    }
  }, []);

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">맞춤형 커리어 로드맵</h1>
              <p className="text-xl text-gray-600">
                {diagnosisResult?.targetJob ? `${diagnosisResult.targetJob}로 가는 길` : '진단 결과를 바탕으로 개인화된 학습 경로를 제시합니다.'}
              </p>
            </div>
            {roadmap && (
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{progress}%</div>
                <div className="text-sm text-gray-600">진행률</div>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {roadmap && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Roadmap Timeline */}
        {roadmap && (
          <div className="space-y-6">
          {roadmap.modules.map((module, index) => (
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(module.level)}`}>
                      {getLevelLabel(module.level)}
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
        )}
        
        {!roadmap && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">진단 결과가 없습니다.</p>
            <Link
              href="/diagnosis"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              역량 진단 시작하기
            </Link>
          </div>
        )}

        {/* CTA Section */}
        {roadmap && (
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
        )}
      </main>
    </div>
  );
}


