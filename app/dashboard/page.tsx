'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, FileText, Target, Settings, LogOut, Sparkles, TrendingUp, Clock, BookOpen, Award, CheckCircle } from 'lucide-react';
import { User, Roadmap, DiagnosisResult, DashboardStats, LearningHistory } from '@/types';
import { getFromStorage, isLoggedIn, getCurrentUser, calculateProgress, formatDate, calculateCompletedProjects, calculateLearningStreak } from '@/lib/utils';
import { calculateRoadmapProgress } from '@/lib/roadmap';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    const userData = getCurrentUser();
    if (!userData) {
      router.push('/login');
      return;
    }

    setUser(userData);
    
    // 로드맵 데이터 가져오기
    const roadmapData = getFromStorage<Roadmap>('roadmap', null);
    setRoadmap(roadmapData);
    
    // 진단 결과 가져오기
    const diagnosisData = getFromStorage<DiagnosisResult>('diagnosisResults', null);
    setDiagnosisResult(diagnosisData);
    
    // 통계 계산
    if (roadmapData) {
      const progress = calculateRoadmapProgress(roadmapData);
      const completedModules = roadmapData.modules.filter(m => m.completed).length;
      const inProgressModules = roadmapData.modules.filter(m => !m.completed && progress > 0).length;
      
      // 학습 이력 가져오기
      const learningHistory = getFromStorage<LearningHistory[]>('learningHistory', []);
      const totalHours = learningHistory.reduce((sum, h) => {
        if (h.completedAt) {
          const start = new Date(h.startedAt);
          const end = new Date(h.completedAt);
          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return sum + hours;
        }
        return sum;
      }, 0);
      
      const user = getCurrentUser();
      const projectsCompleted = user ? calculateCompletedProjects(user.id) : 0;
      const currentStreak = user ? calculateLearningStreak(user.id) : 0;
      
      setStats({
        totalModules: roadmapData.modules.length,
        completedModules,
        inProgressModules,
        totalLearningHours: Math.round(totalHours),
        skillsAcquired: roadmapData.modules.reduce((sum, m) => sum + m.skills.length, 0),
        projectsCompleted,
        currentStreak
      });
    }
    
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">커리어 플랫폼</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user?.name}님</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {user?.name}님, 환영합니다!
          </h1>
          <p className="text-gray-600">커리어 성장을 위한 모든 도구를 한 곳에서</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">로드맵 진행률</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {roadmap ? calculateRoadmapProgress(roadmap) : 0}%
                  </p>
                </div>
                <div className="bg-blue-100 rounded-lg p-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">완료한 모듈</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.completedModules} / {stats.totalModules}
                  </p>
                </div>
                <div className="bg-green-100 rounded-lg p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">총 학습 시간</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalLearningHours}h
                  </p>
                </div>
                <div className="bg-purple-100 rounded-lg p-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">습득한 역량</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.skillsAcquired}
                  </p>
                </div>
                <div className="bg-orange-100 rounded-lg p-3">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Goal */}
        {diagnosisResult && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-12 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">현재 목표</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  {diagnosisResult.targetJob || '목표 직무 설정'}
                </p>
                {diagnosisResult.currentJob && (
                  <p className="text-sm text-gray-600">
                    현재: {diagnosisResult.currentJob} → 목표: {diagnosisResult.targetJob}
                  </p>
                )}
              </div>
              <Target className="h-12 w-12 text-blue-600" />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link
            href="/roadmap-generate"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">역량 진단</h3>
            <p className="text-sm text-gray-600">현재 역량 수준을 파악하세요</p>
          </Link>

          <Link
            href="/roadmap"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">커리어 로드맵</h3>
            <p className="text-sm text-gray-600">맞춤형 학습 경로 확인</p>
          </Link>

          <Link
            href="/portfolio"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">포트폴리오</h3>
            <p className="text-sm text-gray-600">자동 생성된 포트폴리오 보기</p>
          </Link>

          <Link
            href="/projects"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">기업 프로젝트</h3>
            <p className="text-sm text-gray-600">실무 프로젝트 참여하기</p>
          </Link>
        </div>

        {/* Current Roadmap Progress */}
        {roadmap && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">현재 로드맵</h2>
              <Link href="/roadmap" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                전체 보기 →
              </Link>
            </div>
            <div className="space-y-4">
              {roadmap.modules.slice(0, 3).map((module) => (
                <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      module.completed ? 'bg-green-500' : 'bg-blue-600'
                    }`}>
                      {module.completed ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        <span className="text-white font-semibold">{module.order}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{module.title}</p>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                  </div>
                  <Link 
                    href={`/module/${module.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {module.completed ? '복습하기' : '학습하기'} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">최근 활동</h2>
          <div className="space-y-4">
            {diagnosisResult && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">역량 진단 완료</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(diagnosisResult.analyzedAt)} - 맞춤형 로드맵이 생성되었습니다
                  </p>
                </div>
                <Link href="/roadmap" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  보기 →
                </Link>
              </div>
            )}
            {roadmap && roadmap.modules.some(m => !m.completed) && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">학습 모듈 진행 중</p>
                  <p className="text-sm text-gray-600">
                    {roadmap.modules.find(m => !m.completed)?.title} 모듈을 학습하고 있습니다
                  </p>
                </div>
                <Link 
                  href={`/module/${roadmap.modules.find(m => !m.completed)?.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  계속하기 →
                </Link>
              </div>
            )}
            {(!diagnosisResult && !roadmap) && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">아직 활동 내역이 없습니다.</p>
                <Link
                  href="/roadmap-generate"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  역량 진단 시작하기
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


