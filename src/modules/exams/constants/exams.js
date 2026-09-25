/** Моки экзаменов */

export const EXAM_STATUS = {
  AWAITING: 'awaiting',
  UPLOADED: 'uploaded',
  REVIEWED: 'reviewed',
  MISSED: 'missed',
}

export const EXAM_STATUS_LABELS = {
  awaiting: 'Ожидает загрузки',
  uploaded: 'Загружено',
  reviewed: 'Проверено',
  missed: 'Пропущено',
}

export const EXAM_STATUS_CHIPS = [
  { id: 'all', label: 'Все', variant: 'current' },
  { id: 'awaiting', label: 'Ожидает загрузки', variant: 'pending' },
  { id: 'uploaded', label: 'Загружено', variant: 'current' },
  { id: 'reviewed', label: 'Проверено', variant: 'approved' },
  { id: 'missed', label: 'Пропущено', variant: 'missing' },
]

export const EXAM_MONTH_OPTIONS = [
  { value: 'all', label: 'Все периоды' },
  { value: '2026-09', label: 'Сентябрь 2026' },
  { value: '2026-08', label: 'Август 2026' },
]

export function createInitialExams() {
  return [
    {
      id: 'ex1',
      subject: 'Python',
      groupId: 'g-python-1',
      submitDeadline: '2026-09-25',
      reviewDate: '2026-09-28',
      studentId: 's1',
      status: 'uploaded',
      uploadedAt: '2026-09-24',
      fileName: 'alina_exam.py',
      grade: null,
    },
    {
      id: 'ex2',
      subject: 'Python',
      groupId: 'g-python-1',
      submitDeadline: '2026-09-25',
      reviewDate: '2026-09-28',
      studentId: 's2',
      status: 'awaiting',
      uploadedAt: null,
      fileName: null,
      grade: null,
    },
    {
      id: 'ex3',
      subject: 'Python',
      groupId: 'g-python-1',
      submitDeadline: '2026-09-25',
      reviewDate: '2026-09-28',
      studentId: 's3',
      status: 'reviewed',
      uploadedAt: '2026-09-22',
      fileName: 'sofia_exam.py',
      grade: 5,
    },
    {
      id: 'ex4',
      subject: 'Scratch',
      groupId: 'g-scratch-1',
      submitDeadline: '2026-09-18',
      reviewDate: '2026-09-20',
      studentId: 's5',
      status: 'missed',
      uploadedAt: null,
      fileName: null,
      grade: null,
    },
    {
      id: 'ex5',
      subject: 'HTML',
      groupId: 'g-html-1',
      submitDeadline: '2026-08-30',
      reviewDate: '2026-09-02',
      studentId: 's6',
      status: 'reviewed',
      uploadedAt: '2026-08-29',
      fileName: 'artem_exam.zip',
      grade: 4,
    },
  ]
}
