'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Users, Clock, Target, CheckCircle, Sparkles } from 'lucide-react';
import { CompanyProject, Company, DiagnosisResult } from '@/types';
import { getFromStorage, getCurrentUser, isLoggedIn, getLevelColor, getLevelLabel } from '@/lib/utils';
import { getCompanies, generateCompanyProject, getRecommendedProjects, joinProject } from '@/lib/company-project';

export default function ProjectsPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recommendedProjects, setRecommendedProjects] = useState<CompanyProject[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    const companiesList = getCompanies();
    setCompanies(companiesList);

    const user = getCurrentUser();
    if (user) {
      const projects = getRecommendedProjects(user.id);
      setRecommendedProjects(projects);
    }

    const diagnosis = getFromStorage<DiagnosisResult>('diagnosisResults', null);
    setDiagnosisResult(diagnosis);
  }, [router]);

  const handleGenerateProject = async (companyId: string) => {
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        const project = generateCompanyProject(companyId, diagnosisResult);
        const user = getCurrentUser();
        if (user) {
          const projects = getRecommendedProjects(user.id);
          setRecommendedProjects(projects);
        }
        alert(`${project.title} 프로젝트가 생성되었습니다!`);
      } catch (error) {
        console.error('프로젝트 생성 중 오류:', error);
        alert('프로젝트 생성에 실패했습니다.');
      } finally {
        setIsGenerating(false);
        setSelectedCompany(null);
      }
    }, 1000);
  };

  const handleJoinProject = (projectId: string) => {
    const user = getCurrentUser();
    if (!user) return;

    const project = joinProject(projectId, user.id);
    if (project) {
      const projects = getRecommendedProjects(user.id);
      setRecommendedProjects(projects);
      alert('프로젝트에 참여했습니다!');
    } else {
      alert('프로젝트 참여에 실패했습니다.');
    }
  };

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
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">기업 프로젝트</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">기업 기반 프로젝트</h1>
          <p className="text-xl text-gray-600">
            실제 기업의 기술 스택과 개발 문화를 학습할 수 있는 프로젝트에 참여하세요.
          </p>
        </div>

        {/* Recommended Projects */}
        {recommendedProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">추천 프로젝트</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-gray-900">{project.companyName}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(project.difficulty)}`}>
                      {getLevelLabel(project.difficulty)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      예상 기간: {project.estimatedDuration}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinProject(project.id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    프로젝트 참여하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Company Selection */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">새 프로젝트 생성</h2>
          <p className="text-gray-600 mb-6">
            기업을 선택하면 해당 기업의 기술 스택을 분석하여 맞춤형 프로젝트를 자동으로 생성합니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedCompany(company)}
              >
                <div className="flex items-center mb-4">
                  <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{company.description}</p>
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">주요 기술 스택:</p>
                  <div className="flex flex-wrap gap-2">
                    {company.techStack.slice(0, 4).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateProject(company.id);
                  }}
                  disabled={isGenerating}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                >
                  {isGenerating ? '생성 중...' : '프로젝트 생성'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {!diagnosisResult && (
          <div className="mt-12 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <p className="text-yellow-800 mb-4">
              역량 진단을 완료하면 더 정확한 프로젝트 추천을 받을 수 있습니다.
            </p>
            <Link
              href="/diagnosis"
              className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700"
            >
              역량 진단 시작하기
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

