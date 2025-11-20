'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, FileText, Target, Settings, LogOut, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('user');
    
    if (!isLoggedIn || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">대시보드</h1>
          <p className="text-gray-600">커리어 성장을 위한 모든 도구를 한 곳에서</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link
            href="/diagnosis"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">프로젝트</h3>
            <p className="text-sm text-gray-600">실무 프로젝트 참여하기</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">최근 활동</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">역량 진단 완료</p>
                <p className="text-sm text-gray-600">맞춤형 로드맵이 생성되었습니다</p>
              </div>
              <Link href="/roadmap" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                보기 →
              </Link>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">학습 모듈 진행 중</p>
                <p className="text-sm text-gray-600">기초 역량 강화 모듈을 학습하고 있습니다</p>
              </div>
              <Link href="/roadmap" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                계속하기 →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


