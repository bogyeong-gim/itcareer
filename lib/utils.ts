// 유틸리티 함수들

/**
 * 로컬 스토리지에서 데이터 가져오기
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * 로컬 스토리지에 데이터 저장하기
 */
export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
}

/**
 * 로컬 스토리지에서 데이터 삭제하기
 */
export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

/**
 * 사용자 로그인 상태 확인
 */
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isLoggedIn') === 'true';
}

/**
 * 현재 사용자 정보 가져오기
 */
export function getCurrentUser() {
  return getFromStorage('user', null);
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 날짜와 시간 포맷팅
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * 진행률 계산
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * 레벨에 따른 색상 반환
 */
export function getLevelColor(level: 'beginner' | 'intermediate' | 'advanced'): string {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-700';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-700';
    case 'advanced':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

/**
 * 레벨 한글 변환
 */
export function getLevelLabel(level: 'beginner' | 'intermediate' | 'advanced'): string {
  switch (level) {
    case 'beginner':
      return '초급';
    case 'intermediate':
      return '중급';
    case 'advanced':
      return '고급';
    default:
      return '미정';
  }
}

/**
 * 고유 ID 생성
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 프로젝트 완료 수 계산
 */
export function calculateCompletedProjects(userId: string): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const allProjects = getFromStorage<Array<{ participants?: string[]; status?: string }>>('companyProjects', []);
    return allProjects.filter(
      (p) => p.participants?.includes(userId) && p.status === 'completed'
    ).length;
  } catch (error) {
    console.error('Error calculating completed projects:', error);
    return 0;
  }
}

/**
 * 연속 학습 일수 계산
 */
export function calculateLearningStreak(userId: string): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const learningHistory = getFromStorage<Array<{ userId: string; startedAt?: string; completedAt?: string }>>('learningHistory', []);
    const userHistory = learningHistory.filter((h) => h.userId === userId);
    
    if (userHistory.length === 0) return 0;
    
    // 날짜별로 학습한 날짜 추출
    const learningDates = new Set<string>();
    userHistory.forEach((h) => {
      if (h.startedAt) {
        const date = new Date(h.startedAt);
        const dateStr = date.toISOString().split('T')[0];
        learningDates.add(dateStr);
      }
      if (h.completedAt) {
        const date = new Date(h.completedAt);
        const dateStr = date.toISOString().split('T')[0];
        learningDates.add(dateStr);
      }
    });
    
    // 날짜를 정렬
    const sortedDates = Array.from(learningDates).sort().reverse();
    
    if (sortedDates.length === 0) return 0;
    
    // 오늘 날짜
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    // 어제 날짜
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // 오늘 또는 어제 학습했는지 확인
    let streak = 0;
    let checkDate = todayStr;
    
    // 오늘 학습했으면 streak 시작
    if (sortedDates.includes(checkDate)) {
      streak = 1;
      checkDate = yesterdayStr;
    } else if (sortedDates.includes(yesterdayStr)) {
      // 어제만 학습했으면 streak 시작
      streak = 1;
      checkDate = yesterdayStr;
    } else {
      // 최근 학습 날짜부터 연속 확인
      const mostRecentDate = sortedDates[0];
      const mostRecent = new Date(mostRecentDate);
      const daysDiff = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
      
      // 최근 학습이 1일 이내면 streak 시작
      if (daysDiff <= 1) {
        streak = 1;
        checkDate = mostRecentDate;
      } else {
        return 0;
      }
    }
    
    // 연속된 날짜 확인
    let currentDate = new Date(checkDate);
    currentDate.setDate(currentDate.getDate() - 1);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating learning streak:', error);
    return 0;
  }
}

