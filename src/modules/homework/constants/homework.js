/** Моки домашних заданий для кабинета преподавателя */

export const HW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  OVERDUE: 'overdue',
  MISSING: 'missing',
  REJECTED: 'rejected',
}

export const HW_STATUS_CHIPS = [
  { id: 'pending', label: 'На проверке', variant: 'pending' },
  { id: 'approved', label: 'Проверенные', variant: 'approved' },
  { id: 'overdue', label: 'Просроченные', variant: 'overdue' },
  { id: 'missing', label: 'Не сданные', variant: 'missing' },
  { id: 'rejected', label: 'Отклонённые', variant: 'rejected' },
]

export const HW_MONTH_OPTIONS = [
  { value: 'all', label: 'Все месяцы' },
  { value: '2026-09', label: 'Сентябрь 2026' },
  { value: '2026-08', label: 'Август 2026' },
]

export const HW_MAIN_TABS = [
  { id: 'list', label: 'Список' },
  { id: 'create', label: 'Создать' },
]

export function createInitialHomework() {
  return [
    {
      id: 'hw1',
      title: 'Циклы for и while',
      topic: 'Циклы',
      subject: 'Python',
      groupId: 'g-python-1',
      deadline: '2026-09-20',
      fileName: 'cycles.pdf',
      submissions: [
        {
          id: 'sub1',
          studentId: 's1',
          status: 'pending',
          submittedAt: '2026-09-19',
          fileName: 'alina_cycles.py',
          grade: null,
          comment: '',
          transferred: false,
        },
        {
          id: 'sub2',
          studentId: 's2',
          status: 'approved',
          submittedAt: '2026-09-18',
          fileName: 'maxim_cycles.py',
          grade: 4,
          comment: 'Хорошо',
          transferred: false,
        },
        {
          id: 'sub3',
          studentId: 's3',
          status: 'approved',
          submittedAt: '2026-09-17',
          fileName: 'sofia_cycles.py',
          grade: 5,
          comment: '',
          transferred: false,
        },
      ],
    },
    {
      id: 'hw2',
      title: 'Списки и кортежи',
      topic: 'Коллекции',
      subject: 'Python',
      groupId: 'g-python-1',
      deadline: '2026-09-10',
      fileName: 'lists.pdf',
      submissions: [
        {
          id: 'sub4',
          studentId: 's1',
          status: 'overdue',
          submittedAt: '2026-09-12',
          fileName: 'alina_lists.py',
          grade: null,
          comment: '',
          transferred: false,
        },
        {
          id: 'sub5',
          studentId: 's2',
          status: 'missing',
          submittedAt: null,
          fileName: null,
          grade: null,
          comment: '',
          transferred: false,
        },
        {
          id: 'sub6',
          studentId: 's6',
          status: 'approved',
          submittedAt: '2026-08-05',
          fileName: 'artem_lists.py',
          grade: 4,
          comment: 'До перевода',
          transferred: true,
        },
      ],
    },
    {
      id: 'hw3',
      title: 'Анимация спрайта',
      topic: 'Анимация',
      subject: 'Scratch',
      groupId: 'g-scratch-1',
      deadline: '2026-09-22',
      fileName: 'sprite.sb3',
      submissions: [
        {
          id: 'sub7',
          studentId: 's5',
          status: 'rejected',
          submittedAt: '2026-09-21',
          fileName: 'eva_sprite.sb3',
          grade: null,
          comment: 'Нужно доработать костюмы',
          transferred: false,
        },
      ],
    },
    {
      id: 'hw4',
      title: 'Верстка карточки',
      topic: 'CSS',
      subject: 'HTML',
      groupId: 'g-html-1',
      deadline: '2026-08-28',
      fileName: 'card.zip',
      submissions: [
        {
          id: 'sub8',
          studentId: 's6',
          status: 'pending',
          submittedAt: '2026-08-27',
          fileName: 'artem_card.zip',
          grade: null,
          comment: '',
          transferred: true,
        },
      ],
    },
  ]
}

export const HW_STATUS_LABELS = {
  pending: 'На проверке',
  approved: 'Проверено',
  overdue: 'Просрочено',
  missing: 'Не сдано',
  rejected: 'Отклонено',
}
