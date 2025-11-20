'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, Code, BookOpen, Award, Briefcase, RefreshCw } from 'lucide-react';
import { Portfolio, User } from '@/types';
import { getFromStorage, getCurrentUser, isLoggedIn, formatDate } from '@/lib/utils';
import { generatePortfolio, getPortfolio } from '@/lib/portfolio';

export default function PortfolioPage() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    loadPortfolio();
  }, [router]);

  const loadPortfolio = () => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // 기존 포트폴리오 확인
    let existingPortfolio = getPortfolio(user.id);
    
    if (!existingPortfolio) {
      // 포트폴리오 생성
      try {
        existingPortfolio = generatePortfolio(user.id);
      } catch (error) {
        console.error('포트폴리오 생성 중 오류:', error);
      }
    }

    setPortfolio(existingPortfolio);
    setIsLoading(false);
  };

  const handleRegenerate = () => {
    const user = getCurrentUser();
    if (!user) return;

    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        const newPortfolio = generatePortfolio(user.id);
        setPortfolio(newPortfolio);
      } catch (error) {
        console.error('포트폴리오 재생성 중 오류:', error);
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">포트폴리오를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">포트폴리오를 생성할 수 없습니다.</p>
          <Link
            href="/diagnosis"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            역량 진단 시작하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              대시보드로
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? '재생성 중...' : '재생성'}
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <Share2 className="h-4 w-4 mr-2" />
                공유
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                다운로드
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Portfolio Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              {portfolio.name.charAt(0)}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{portfolio.name}</h1>
            <p className="text-xl text-gray-600 mb-4">목표 직무: {portfolio.targetJob}</p>
            <p className="text-gray-500">{portfolio.email}</p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Code className="h-6 w-6 mr-2 text-blue-600" />
            기술 스택
          </h2>
          {portfolio.skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.skills.map((skill) => (
                <div key={skill.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        skill.category === 'technical' ? 'bg-blue-100 text-blue-700' :
                        skill.category === 'soft' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {skill.category === 'technical' ? '기술' :
                         skill.category === 'soft' ? '소프트' : '도메인'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">아직 습득한 역량이 없습니다.</p>
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
            프로젝트
          </h2>
          {portfolio.projects.length > 0 ? (
            <div className="space-y-6">
              {portfolio.projects.map((project) => (
                <div key={project.id} className="border-l-4 border-blue-600 pl-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      project.status === 'completed' ? 'bg-green-100 text-green-700' :
                      project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status === 'completed' ? '완료' :
                       project.status === 'in-progress' ? '진행 중' : '계획됨'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.completedAt && (
                    <p className="text-sm text-gray-500">
                      완료일: {formatDate(project.completedAt)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">아직 완료한 프로젝트가 없습니다.</p>
              <Link
                href="/roadmap"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700"
              >
                로드맵에서 학습 시작하기 →
              </Link>
            </div>
          )}
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-blue-600" />
            학습 이력
          </h2>
          {portfolio.education.length > 0 ? (
            <div className="space-y-4">
              {portfolio.education.map((edu) => (
                <div key={edu.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.title}</h3>
                    <p className="text-sm text-gray-600">{edu.description}</p>
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(edu.completedAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">아직 완료한 교육 과정이 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
