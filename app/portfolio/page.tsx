'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, Code, BookOpen, Award, Briefcase } from 'lucide-react';

export default function PortfolioPage() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // 진단 결과와 학습 이력 가져오기
    const diagnosisResults = localStorage.getItem('diagnosisResults');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // 포트폴리오 자동 생성
    const generatedPortfolio = {
      name: user.name || '사용자',
      email: user.email || '',
      targetJob: diagnosisResults ? JSON.parse(diagnosisResults).find((r: any) => r.questionId === 3)?.answer || '개발자' : '개발자',
      skills: [
        { name: 'JavaScript', level: 75 },
        { name: 'React', level: 70 },
        { name: 'Node.js', level: 65 },
        { name: 'TypeScript', level: 60 }
      ],
      projects: [
        {
          title: 'Todo 앱 프로젝트',
          description: 'React와 TypeScript를 사용한 Todo 애플리케이션',
          technologies: ['React', 'TypeScript', 'Tailwind CSS'],
          status: '완료'
        },
        {
          title: 'API 서버 구축',
          description: 'Node.js와 Express를 활용한 RESTful API 서버',
          technologies: ['Node.js', 'Express', 'MongoDB'],
          status: '진행 중'
        }
      ],
      education: [
        {
          title: '기초 역량 강화',
          period: '4주',
          status: '완료'
        },
        {
          title: '실무 프로젝트 경험',
          period: '6주',
          status: '진행 중'
        }
      ],
      achievements: [
        '커리어 로드맵 완료',
        '3개 모듈 학습 완료',
        '프로젝트 2개 진행'
      ]
    };

    setPortfolio(generatedPortfolio);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">포트폴리오 생성 중...</p>
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
          <div className="space-y-4">
            {portfolio.skills.map((skill: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-900 font-medium">{skill.name}</span>
                  <span className="text-gray-600 text-sm">{skill.level}%</span>
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
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
            프로젝트
          </h2>
          <div className="space-y-6">
            {portfolio.projects.map((project: any, index: number) => (
              <div key={index} className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.technologies.map((tech: string, techIndex: number) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  project.status === '완료' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-blue-600" />
            학습 이력
          </h2>
          <div className="space-y-4">
            {portfolio.education.map((edu: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.title}</h3>
                  <p className="text-sm text-gray-600">기간: {edu.period}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  edu.status === '완료' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {edu.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Award className="h-6 w-6 mr-2 text-blue-600" />
            주요 성과
          </h2>
          <ul className="space-y-3">
            {portfolio.achievements.map((achievement: string, index: number) => (
              <li key={index} className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-gray-700">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}


