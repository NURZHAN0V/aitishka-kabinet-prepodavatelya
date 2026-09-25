/** Рейтинг группы: 50% средний балл + 50% доля ДЗ вовремя */

export const RATING_PERIODS = [
  { id: 'current', label: 'Текущий месяц' },
  { id: 'previous', label: 'Прошлый месяц' },
]

/** Mock scores by period */
export const RATING_BY_PERIOD = {
  current: [
    { studentId: 's3', avgGrade: 5.0, hwOnTime: 1.0 },
    { studentId: 's1', avgGrade: 4.6, hwOnTime: 0.9 },
    { studentId: 's5', avgGrade: 4.4, hwOnTime: 0.85 },
    { studentId: 's4', avgGrade: 4.1, hwOnTime: 0.75 },
    { studentId: 's2', avgGrade: 3.9, hwOnTime: 0.7 },
  ],
  previous: [
    { studentId: 's3', avgGrade: 4.9, hwOnTime: 0.95 },
    { studentId: 's5', avgGrade: 4.5, hwOnTime: 0.9 },
    { studentId: 's1', avgGrade: 4.4, hwOnTime: 0.8 },
    { studentId: 's2', avgGrade: 4.0, hwOnTime: 0.65 },
    { studentId: 's4', avgGrade: 3.8, hwOnTime: 0.7 },
  ],
}

export function calcRatingScore(avgGrade, hwOnTime) {
  const gradePart = (avgGrade / 5) * 50
  const hwPart = hwOnTime * 50
  return Math.round((gradePart + hwPart) * 10) / 10
}

export function getMonthLabel(periodId) {
  const now = new Date(2026, 8, 25)
  const date = periodId === 'previous' ? new Date(now.getFullYear(), now.getMonth() - 1, 1) : now
  return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
}
