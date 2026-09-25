/** Моки оценок: матрица студенты × даты занятий */

export const GRADE_TABS = [
  { id: 'lesson', label: 'Оценка за урок' },
  { id: 'control', label: 'Контрольная работа' },
]

export const GRADE_LEGEND = [
  { id: 'hw', label: 'ДЗ', mark: 'ДЗ' },
  { id: 'classwork', label: 'Работа на уроке', mark: 'У' },
  { id: 'absent', label: 'Пропуск', mark: 'Н' },
  { id: 'late', label: 'Опоздание', mark: 'О' },
  { id: 'comment', label: 'Комментарий', mark: '💬' },
]

export const MONTH_OPTIONS = [
  { value: '2026-09', label: 'Сентябрь 2026' },
  { value: '2026-08', label: 'Август 2026' },
  { value: '2026-07', label: 'Июль 2026' },
]

/** Даты занятий по месяцу (mock) */
export const LESSON_DATES_BY_MONTH = {
  '2026-09': ['2026-09-02', '2026-09-05', '2026-09-09', '2026-09-12', '2026-09-16', '2026-09-19', '2026-09-23'],
  '2026-08': ['2026-08-05', '2026-08-08', '2026-08-12', '2026-08-15', '2026-08-19', '2026-08-22', '2026-08-26'],
  '2026-07': ['2026-07-01', '2026-07-04', '2026-07-08', '2026-07-11', '2026-07-15', '2026-07-18', '2026-07-22'],
}

/**
 * Ячейка: { value: 2-5|null, marks: string[], comment?: string }
 * marks: 'hw' | 'classwork' | 'absent' | 'late' | 'comment'
 */
export function createInitialGrades() {
  return {
    lesson: {
      s1: {
        '2026-09-02': { value: 5, marks: ['classwork'] },
        '2026-09-05': { value: 4, marks: ['hw'] },
        '2026-09-09': { value: null, marks: ['absent'] },
        '2026-09-12': { value: 5, marks: ['classwork', 'comment'], comment: 'Отличная работа' },
        '2026-09-16': { value: 4, marks: ['late', 'classwork'] },
        '2026-09-19': { value: 5, marks: ['hw'] },
        '2026-09-23': { value: 4, marks: [] },
      },
      s2: {
        '2026-09-02': { value: 4, marks: ['classwork'] },
        '2026-09-05': { value: 3, marks: ['hw'] },
        '2026-09-09': { value: 4, marks: [] },
        '2026-09-12': { value: null, marks: ['absent'] },
        '2026-09-16': { value: 3, marks: ['late'] },
        '2026-09-19': { value: 4, marks: ['hw'] },
        '2026-09-23': { value: 3, marks: ['classwork'] },
      },
      s3: {
        '2026-09-02': { value: 5, marks: ['classwork', 'hw'] },
        '2026-09-05': { value: 5, marks: [] },
        '2026-09-09': { value: 5, marks: ['comment'], comment: 'Лидер группы' },
        '2026-09-12': { value: 5, marks: ['classwork'] },
        '2026-09-16': { value: 5, marks: ['hw'] },
        '2026-09-19': { value: 5, marks: [] },
        '2026-09-23': { value: 5, marks: ['classwork'] },
      },
      s4: {
        '2026-09-02': { value: 4, marks: [] },
        '2026-09-05': { value: 4, marks: ['hw'] },
        '2026-09-09': { value: 3, marks: ['classwork'] },
        '2026-09-12': { value: 4, marks: [] },
        '2026-09-16': { value: null, marks: ['absent'] },
        '2026-09-19': { value: 4, marks: ['late'] },
        '2026-09-23': { value: 5, marks: ['hw'] },
      },
      s5: {
        '2026-09-02': { value: 4, marks: ['classwork'] },
        '2026-09-05': { value: 5, marks: ['hw'] },
        '2026-09-09': { value: 4, marks: [] },
        '2026-09-12': { value: 4, marks: ['classwork'] },
        '2026-09-16': { value: 5, marks: [] },
        '2026-09-19': { value: 4, marks: ['hw'] },
        '2026-09-23': { value: 5, marks: [] },
      },
    },
    control: {
      s1: {
        '2026-09-12': { value: 5, marks: [] },
        '2026-09-23': { value: 4, marks: ['comment'], comment: 'Небольшая ошибка в цикле' },
      },
      s2: {
        '2026-09-12': { value: 3, marks: [] },
        '2026-09-23': { value: 4, marks: [] },
      },
      s3: {
        '2026-09-12': { value: 5, marks: [] },
        '2026-09-23': { value: 5, marks: [] },
      },
      s4: {
        '2026-09-12': { value: 4, marks: [] },
        '2026-09-23': { value: 3, marks: [] },
      },
      s5: {
        '2026-09-12': { value: 4, marks: [] },
        '2026-09-23': { value: 5, marks: [] },
      },
    },
  }
}

export function formatLessonDate(iso) {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}

/** Цикл: пусто → 2 → 3 → 4 → 5 → пусто */
export function nextGradeValue(current) {
  if (current == null) return 2
  if (current >= 5) return null
  return current + 1
}
