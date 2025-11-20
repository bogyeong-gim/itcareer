import Link from "next/link";
import { ArrowRight, Target, BookOpen, Briefcase, User, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">커리어 플랫폼</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/roadmap-generate" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                역량 진단
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                로그인
              </Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            당신의 커리어,
            <br />
            <span className="text-blue-600">맞춤형 로드맵</span>으로 시작하세요
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI 기반 역량 진단으로 현재 위치를 파악하고, 목표 직무까지의 개인화된 커리어 로드맵을 받아보세요.
          </p>
          <div className="flex justify-center">
            <Link
              href="/roadmap-generate"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              무료로 나만의 로드맵 받아보기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI 역량 진단</h3>
            <p className="text-gray-600">
              간단한 설문을 통해 현재 역량 수준을 파악하고, 목표 직무까지 필요한 역량을 분석합니다.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">맞춤형 로드맵</h3>
            <p className="text-gray-600">
              진단 결과를 바탕으로 개인화된 학습 로드맵과 필요한 교육 콘텐츠를 추천합니다.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">포트폴리오 자동 생성</h3>
            <p className="text-gray-600">
              학습 이력과 프로젝트 참여 내역을 기반으로 커리어 포트폴리오를 자동으로 생성합니다.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">작동 방식</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">역량 진단</h4>
              <p className="text-sm text-gray-600">간단한 설문으로 현재 역량 파악</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">로드맵 추천</h4>
              <p className="text-sm text-gray-600">AI가 개인화된 학습 경로 제시</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">학습 및 성장</h4>
              <p className="text-sm text-gray-600">추천 콘텐츠 학습 및 AI 튜터 활용</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">포트폴리오 생성</h4>
              <p className="text-sm text-gray-600">자동 생성된 포트폴리오로 커리어 연결</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            © 2024 커리어 플랫폼. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}


