/** Моки посещений и отзывов для карточки студента */

export const STUDENT_DETAIL_TABS = [
  { id: 'attendance', label: 'Посещение и оценки' },
  { id: 'reviews', label: 'Отзывы' },
]

export const STUDENT_STATUS_FILTERS = [
  { id: 'active', label: 'Активные' },
  { id: 'transferred', label: 'Переведённые' },
  { id: 'expelled', label: 'Отчисленные' },
]

/** Лента занятий студента (mock) */
export const ATTENDANCE_FEED = {
  s1: [
    { id: 'a1', date: '2026-09-23', subject: 'Python', attendance: 'present', grade: 4, comment: '' },
    { id: 'a2', date: '2026-09-19', subject: 'Python', attendance: 'present', grade: 5, comment: 'ДЗ сдано вовремя' },
    { id: 'a3', date: '2026-09-16', subject: 'Python', attendance: 'late', grade: 4, comment: '' },
    { id: 'a4', date: '2026-09-12', subject: 'Python', attendance: 'present', grade: 5, comment: '' },
    { id: 'a5', date: '2026-09-09', subject: 'Python', attendance: 'absent', grade: null, comment: 'Болела' },
  ],
  s2: [
    { id: 'a6', date: '2026-09-23', subject: 'Python', attendance: 'present', grade: 3, comment: '' },
    { id: 'a7', date: '2026-09-19', subject: 'Python', attendance: 'present', grade: 4, comment: '' },
    { id: 'a8', date: '2026-09-16', subject: 'Python', attendance: 'late', grade: 3, comment: '' },
  ],
  s3: [
    { id: 'a9', date: '2026-09-23', subject: 'Python', attendance: 'present', grade: 5, comment: '' },
    { id: 'a10', date: '2026-09-19', subject: 'Python', attendance: 'present', grade: 5, comment: 'Отлично' },
  ],
  s4: [
    { id: 'a11', date: '2026-09-22', subject: 'Python', attendance: 'present', grade: 4, comment: '' },
    { id: 'a12', date: '2026-09-16', subject: 'Python', attendance: 'absent', grade: null, comment: '' },
  ],
  s5: [
    { id: 'a13', date: '2026-09-24', subject: 'Scratch', attendance: 'present', grade: 5, comment: '' },
    { id: 'a14', date: '2026-09-17', subject: 'Scratch', attendance: 'present', grade: 4, comment: '' },
  ],
  s6: [
    { id: 'a15', date: '2026-08-10', subject: 'HTML', attendance: 'present', grade: 4, comment: 'До перевода' },
  ],
  s7: [
    { id: 'a16', date: '2026-05-20', subject: 'Python', attendance: 'absent', grade: 2, comment: '' },
  ],
}

export const ATTENDANCE_LABELS = {
  present: 'Присутствовал',
  absent: 'Пропуск',
  late: 'Опоздание',
}

export function getAttendanceFeed(studentId) {
  return ATTENDANCE_FEED[studentId] || []
}
