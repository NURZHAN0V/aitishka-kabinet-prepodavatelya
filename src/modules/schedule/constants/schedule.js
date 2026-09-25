/** Мок расписания преподавателя */

export const WEEKDAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export const PAIR_NUMBERS = [0, 1, 2, 3]

export const PAIR_TIMES = {
  0: { start: '09:00', end: '10:20' },
  1: { start: '10:40', end: '12:00' },
  2: { start: '12:20', end: '13:40' },
  3: { start: '14:00', end: '15:20' },
}

export const SCHEDULE_VIEW_TABS = [
  { id: 'week', label: 'Неделя' },
  { id: 'day', label: 'День' },
]

/** Понедельник недели, содержащей date */
export function startOfWeek(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function formatDateIso(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatWeekLabel(weekStart) {
  const end = addDays(weekStart, 6)
  const opts = { day: 'numeric', month: 'short' }
  const from = weekStart.toLocaleDateString('ru-RU', opts)
  const to = end.toLocaleDateString('ru-RU', { ...opts, year: 'numeric' })
  return `${from} — ${to}`
}

function atWeekDay(weekStart, dayIndex, pair) {
  const date = addDays(weekStart, dayIndex)
  const times = PAIR_TIMES[pair]
  return {
    date: formatDateIso(date),
    pair,
    start: times.start,
    end: times.end,
  }
}

/**
 * Генерирует занятия относительно понедельника текущей недели.
 * cancelled: true — не показываются в UI.
 */
export function buildMockSchedule(weekStart = startOfWeek()) {
  const base = [
    {
      id: 'sch-mon-1',
      ...atWeekDay(weekStart, 0, 1),
      subject: 'Python',
      groupId: 'g-python-1',
      groupName: 'Python-1',
      room: '204',
      online: false,
      cancelled: false,
    },
    {
      id: 'sch-mon-2',
      ...atWeekDay(weekStart, 0, 2),
      subject: 'Scratch',
      groupId: 'g-scratch-1',
      groupName: 'Scratch-1',
      room: null,
      online: true,
      cancelled: false,
    },
    {
      id: 'sch-tue-0',
      ...atWeekDay(weekStart, 1, 0),
      subject: 'HTML',
      groupId: 'g-html-1',
      groupName: 'HTML-1',
      room: '101',
      online: false,
      cancelled: false,
    },
    {
      id: 'sch-wed-1-cancelled',
      ...atWeekDay(weekStart, 2, 1),
      subject: 'Python',
      groupId: 'g-python-2',
      groupName: 'Python-2',
      room: '205',
      online: false,
      cancelled: true,
    },
    {
      id: 'sch-wed-2',
      ...atWeekDay(weekStart, 2, 2),
      subject: 'Python',
      groupId: 'g-python-2',
      groupName: 'Python-2',
      room: '205',
      online: false,
      cancelled: false,
    },
    {
      id: 'sch-thu-1',
      ...atWeekDay(weekStart, 3, 1),
      subject: 'Scratch',
      groupId: 'g-scratch-1',
      groupName: 'Scratch-1',
      room: '110',
      online: false,
      cancelled: false,
    },
    {
      id: 'sch-fri-1',
      ...atWeekDay(weekStart, 4, 1),
      subject: 'Python',
      groupId: 'g-python-1',
      groupName: 'Python-1',
      room: '204',
      online: false,
      cancelled: false,
    },
    {
      id: 'sch-fri-3',
      ...atWeekDay(weekStart, 4, 3),
      subject: 'HTML',
      groupId: 'g-html-1',
      groupName: 'HTML-1',
      room: null,
      online: true,
      cancelled: false,
    },
    {
      id: 'sch-sat-0',
      ...atWeekDay(weekStart, 5, 0),
      subject: 'Python',
      groupId: 'g-python-2',
      groupName: 'Python-2',
      room: '204',
      online: false,
      cancelled: false,
    },
  ]

  return base
}

export function getVisibleLessons(lessons) {
  return lessons.filter((l) => !l.cancelled)
}

export function getLessonsForDay(lessons, dateIso) {
  return getVisibleLessons(lessons)
    .filter((l) => l.date === dateIso)
    .sort((a, b) => a.pair - b.pair)
}

export function getLessonAt(lessons, dateIso, pair) {
  return getVisibleLessons(lessons).find(
    (l) => l.date === dateIso && l.pair === pair,
  ) ?? null
}

export function subjectColorKey(subject) {
  return String(subject || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
}
