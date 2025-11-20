'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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
    try {
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
          const errorMessage = error instanceof Error 
            ? error.message 
            : '포트폴리오를 생성할 수 없습니다. 역량 진단을 먼저 완료해주세요.';
          alert(errorMessage);
        }
      }

      setPortfolio(existingPortfolio);
    } catch (error) {
      console.error('포트폴리오 로드 중 오류:', error);
      alert('포트폴리오를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
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

  const handleDownload = () => {
    if (!portfolio) return;

    try {
      // 포트폴리오를 HTML로 변환
      const portfolioHTML = generatePortfolioHTML(portfolio);
      
      // 새 창에서 열기
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
        return;
      }
      
      printWindow.document.write(portfolioHTML);
      printWindow.document.close();
      
      // PDF로 인쇄 (브라우저의 인쇄 기능 사용)
      setTimeout(() => {
        printWindow.print();
      }, 250);
    } catch (error) {
      console.error('포트폴리오 다운로드 중 오류:', error);
      alert('포트폴리오 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleShare = async () => {
    if (!portfolio) return;

    try {
      // 공유할 데이터 생성
      const shareData = {
        title: `${portfolio.name}의 포트폴리오`,
        text: `${portfolio.name}님의 커리어 포트폴리오를 확인해보세요.`,
        url: window.location.href
      };

      // Web Share API 사용 (지원되는 경우)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 클립보드에 URL 복사
        await navigator.clipboard.writeText(window.location.href);
        alert('포트폴리오 URL이 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      // 사용자가 공유를 취소한 경우 등
      if ((error as Error).name !== 'AbortError') {
        console.error('공유 중 오류:', error);
        // 클립보드 복사로 대체
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('포트폴리오 URL이 클립보드에 복사되었습니다!');
        } catch (clipboardError) {
          alert('공유 기능을 사용할 수 없습니다. URL을 수동으로 복사해주세요.');
        }
      }
    }
  };

  const generatePortfolioHTML = (portfolio: Portfolio): string => {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.name} - 포트폴리오</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; line-height: 1.6; color: #333; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #2563eb; }
    .avatar { width: 100px; height: 100px; border-radius: 50%; background: #2563eb; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 48px; font-weight: bold; margin-bottom: 20px; }
    h1 { font-size: 36px; margin-bottom: 10px; }
    .subtitle { font-size: 20px; color: #666; margin-bottom: 5px; }
    .section { margin-bottom: 40px; }
    h2 { font-size: 24px; margin-bottom: 20px; color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
    .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px; }
    .skill-item { padding: 15px; background: #f9fafb; border-radius: 8px; }
    .skill-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .skill-name { font-weight: 600; }
    .skill-level { color: #666; }
    .progress-bar { width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; background: #2563eb; }
    .project-item { margin-bottom: 30px; padding-left: 20px; border-left: 4px solid #2563eb; }
    .project-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .project-title { font-size: 20px; font-weight: 600; }
    .project-status { padding: 4px 12px; border-radius: 12px; font-size: 12px; }
    .status-completed { background: #d1fae5; color: #065f46; }
    .status-in-progress { background: #fef3c7; color: #92400e; }
    .status-planned { background: #f3f4f6; color: #374151; }
    .tech-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .tech-tag { padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 12px; font-size: 12px; }
    .education-item { padding: 15px; background: #f9fafb; border-radius: 8px; margin-bottom: 15px; }
    .education-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .education-title { font-weight: 600; }
    .education-date { color: #666; font-size: 14px; }
    @media print {
      body { padding: 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="avatar">${portfolio.name.charAt(0).toUpperCase()}</div>
    <h1>${portfolio.name}</h1>
    <p class="subtitle">목표 직무: ${portfolio.targetJob}</p>
    <p style="color: #666;">${portfolio.email}</p>
  </div>

  <div class="section">
    <h2>기술 스택</h2>
    <div class="skills-grid">
      ${portfolio.skills.map(skill => `
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-level">${skill.level}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${skill.level}%"></div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2>프로젝트</h2>
    ${portfolio.projects.map(project => `
      <div class="project-item">
        <div class="project-header">
          <span class="project-title">${project.title}</span>
          <span class="project-status status-${project.status}">
            ${project.status === 'completed' ? '완료' : project.status === 'in-progress' ? '진행 중' : '계획됨'}
          </span>
        </div>
        <p style="margin-bottom: 10px; color: #666;">${project.description}</p>
        <div class="tech-tags">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        ${project.completedAt ? `<p style="margin-top: 10px; font-size: 12px; color: #666;">완료일: ${new Date(project.completedAt).toLocaleDateString('ko-KR')}</p>` : ''}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>학습 이력</h2>
    ${portfolio.education.map(edu => `
      <div class="education-item">
        <div class="education-header">
          <span class="education-title">${edu.title}</span>
          <span class="education-date">${new Date(edu.completedAt).toLocaleDateString('ko-KR')}</span>
        </div>
        <p style="color: #666; font-size: 14px;">${edu.description}</p>
      </div>
    `).join('')}
  </div>
</body>
</html>
    `;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 animate-pulse">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-40 mx-auto"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 animate-pulse">
            <div className="h-7 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">포트폴리오를 생성할 수 없습니다.</p>
          <Link
            href="/roadmap-generate"
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
              <button 
                onClick={handleShare}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                공유
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
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
