'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Target, ArrowUp, ExternalLink } from 'lucide-react';
import { Roadmap, RoadmapModule, DiagnosisResult } from '@/types';
import { generateRoadmap, calculateRoadmapProgress, generateDefaultRoadmap } from '@/lib/roadmap';
import { getFromStorage, getCurrentUser, getLevelColor, getLevelLabel } from '@/lib/utils';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 진단 결과 가져오기
    const storedResult = getFromStorage<DiagnosisResult>('diagnosisResults', null);
    
    // 기존 로드맵이 있는지 확인
    const existingRoadmap = getFromStorage<Roadmap>('roadmap', null);
    
    if (existingRoadmap) {
      // 기존 로드맵이 있으면 사용
      setRoadmap(existingRoadmap);
      setProgress(calculateRoadmapProgress(existingRoadmap));
      if (storedResult) {
        setDiagnosisResult(storedResult);
      }
    } else if (storedResult) {
      // 진단 결과가 있으면 로드맵 생성
      setDiagnosisResult(storedResult);
      const user = getCurrentUser();
      const newRoadmap = generateRoadmap(storedResult, user?.id);
      setRoadmap(newRoadmap);
      setProgress(0);
      
      // 로컬 스토리지에 저장
      localStorage.setItem('roadmap', JSON.stringify(newRoadmap));
    } else {
      // 진단 결과가 없으면 기본 로드맵 생성
      const user = getCurrentUser();
      const defaultRoadmap = generateDefaultRoadmap(user?.id);
      setRoadmap(defaultRoadmap);
      setProgress(0);
      
      // 로컬 스토리지에 저장
      localStorage.setItem('roadmap', JSON.stringify(defaultRoadmap));
    }

    // 스크롤 이벤트 리스너
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price: string | number | undefined): string => {
    if (!price) return '무료';
    if (typeof price === 'string') return price;
    return `₩${price.toLocaleString()}`;
  };

  const getModuleIcon = (module: RoadmapModule): string => {
    if (module.iconUrl) return module.iconUrl;
    // 기본 아이콘은 모듈 ID나 제목에 따라 결정
    if (module.title.includes('기초') || module.title.includes('Foundation')) {
      return '🌱';
    } else if (module.title.includes('프로젝트') || module.title.includes('Project')) {
      return '🚀';
    } else if (module.title.includes('포트폴리오') || module.title.includes('Portfolio')) {
      return '📁';
    } else if (module.title.includes('면접') || module.title.includes('Interview')) {
      return '💼';
    }
    return '📚';
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            로드맵 상세보기 총 {roadmap?.modules?.length || 0}개 코스
          </h1>
        </div>

        {/* Roadmap Timeline */}
        {roadmap && roadmap.modules && Array.isArray(roadmap.modules) && roadmap.modules.length > 0 && (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />
            
            <div className="space-y-8">
              {roadmap.modules.map((module, index) => {
                return (
                  <div key={module.id} className="relative flex items-start">
                    {/* Timeline Node */}
                    <div className="relative z-10 flex items-center justify-center w-4 h-4 rounded-full bg-white border-2 border-gray-400 mt-2 ml-6">
                      {module.completed && (
                        <div className="absolute w-3 h-3 rounded-full bg-green-500" />
                      )}
                    </div>

                    {/* Module Card */}
                    <div className="ml-8 flex-1 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                            {getModuleIcon(module)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* English Title & Subtitle */}
                            <div className="mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {module.englishTitle || module.title}
                              </h3>
                              {module.subtitle && (
                                <p className="text-sm text-gray-500 mb-2">{module.subtitle}</p>
                              )}
                            </div>

                            {/* Provider */}
                            {module.provider && (
                              <div className="text-xs text-gray-400 mb-2">{module.provider}</div>
                            )}

                            {/* Korean Title */}
                            <h4 className="text-base font-medium text-gray-800 mb-2">
                              {module.title}
                            </h4>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                              {module.description}
                            </p>

                            {/* Price & Action */}
                            <div className="flex items-center justify-between">
                              {module.price && module.price !== 0 && (
                                <div className="text-base font-semibold text-gray-900">
                                  {formatPrice(module.price)}
                                </div>
                              )}
                              <Link
                                href={`/module/${module.id}`}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                더보기
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {!roadmap && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">진단 결과가 없습니다.</p>
            <Link
              href="/roadmap-generate"
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

      {/* TOP Button */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors flex items-center justify-center z-50"
          aria-label="맨 위로"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}


