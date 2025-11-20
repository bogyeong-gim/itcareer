import { LearningHistory, RoadmapModule } from '@/types';
import { getFromStorage, saveToStorage, generateId } from './utils';

/**
 * 학습 이력 저장
 */
export function saveLearningHistory(
  userId: string,
  moduleId: string,
  moduleTitle: string,
  progress: number,
  sectionsCompleted: string[]
): LearningHistory {
  const history: LearningHistory = {
    id: generateId(),
    userId,
    moduleId,
    moduleTitle,
    startedAt: new Date().toISOString(),
    progress,
    sectionsCompleted
  };

  const allHistory = getFromStorage<LearningHistory[]>('learningHistory', []);
  allHistory.push(history);
  saveToStorage('learningHistory', allHistory);

  return history;
}

/**
 * 학습 이력 업데이트
 */
export function updateLearningHistory(
  historyId: string,
  progress: number,
  sectionsCompleted: string[],
  completed?: boolean
): LearningHistory | null {
  const allHistory = getFromStorage<LearningHistory[]>('learningHistory', []);
  const index = allHistory.findIndex(h => h.id === historyId);

  if (index === -1) return null;

  const updated: LearningHistory = {
    ...allHistory[index],
    progress,
    sectionsCompleted,
    ...(completed && { completedAt: new Date().toISOString() })
  };

  allHistory[index] = updated;
  saveToStorage('learningHistory', allHistory);

  return updated;
}

/**
 * 모듈 학습 시작
 */
export function startModuleLearning(
  userId: string,
  module: RoadmapModule
): LearningHistory {
  // 기존 학습 이력 확인
  const allHistory = getFromStorage<LearningHistory[]>('learningHistory', []);
  const existing = allHistory.find(
    h => h.userId === userId && h.moduleId === module.id && !h.completedAt
  );

  if (existing) {
    return existing;
  }

  return saveLearningHistory(userId, module.id, module.title, 0, []);
}

/**
 * 섹션 완료 처리
 */
export function completeSection(
  userId: string,
  moduleId: string,
  sectionId: string
): LearningHistory | null {
  const allHistory = getFromStorage<LearningHistory[]>('learningHistory', []);
  const history = allHistory.find(
    h => h.userId === userId && h.moduleId === moduleId && !h.completedAt
  );

  if (!history) return null;

  const sectionsCompleted = [...new Set([...history.sectionsCompleted, sectionId])];
  
  // 모듈의 전체 섹션 수 가져오기 (간단히 하드코딩, 실제로는 모듈 콘텐츠에서 가져와야 함)
  const totalSections = 2; // 기본값
  const progress = Math.round((sectionsCompleted.length / totalSections) * 100);

  return updateLearningHistory(history.id, progress, sectionsCompleted);
}

/**
 * 모듈 완료 처리
 */
export function completeModule(
  userId: string,
  moduleId: string
): LearningHistory | null {
  const allHistory = getFromStorage<LearningHistory[]>('learningHistory', []);
  const history = allHistory.find(
    h => h.userId === userId && h.moduleId === moduleId && !h.completedAt
  );

  if (!history) return null;

  return updateLearningHistory(history.id, 100, history.sectionsCompleted, true);
}

/**
 * 사용자의 학습 이력 가져오기
 */
export function getUserLearningHistory(userId: string): LearningHistory[] {
  const allHistory = getFromStorage<LearningHistory[]>('learningHistory', []);
  return allHistory.filter(h => h.userId === userId);
}

/**
 * 모듈별 학습 이력 가져오기
 */
export function getModuleLearningHistory(
  userId: string,
  moduleId: string
): LearningHistory | null {
  const allHistory = getFromStorage<LearningHistory[]>('learningHistory', []);
  return (
    allHistory.find(
      h => h.userId === userId && h.moduleId === moduleId && !h.completedAt
    ) || null
  );
}


