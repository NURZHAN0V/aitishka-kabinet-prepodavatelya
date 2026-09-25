/** Константы журнала группы */

export const ATTENDANCE_OPTIONS = [
  { value: 'present', label: 'Присутствовал' },
  { value: 'absent', label: 'Отсутствовал' },
  { value: 'late', label: 'Опоздал' },
]

export const GRADE_OPTIONS = [
  { value: '', label: '—' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
]

export const MAX_LESSON_COINS = 5
export const EDIT_WINDOW_DAYS = 3

export const PAIR_TIMES = {
  0: { start: '09:00', end: '10:20' },
  1: { start: '10:40', end: '12:00' },
  2: { start: '12:20', end: '13:40' },
  3: { start: '14:00', end: '15:20' },
}

export function formatDateIso(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateIso(iso) {
  const [y, m, d] = String(iso).split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysBetween(fromIso, toDate = new Date()) {
  const from = parseDateIso(fromIso)
  from.setHours(0, 0, 0, 0)
  const to = new Date(toDate)
  to.setHours(0, 0, 0, 0)
  return Math.floor((to.getTime() - from.getTime()) / 86_400_000)
}
