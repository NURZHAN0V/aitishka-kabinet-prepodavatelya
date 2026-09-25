/** Общие моки групп и студентов */

export const GROUPS = [
  { id: 'g-python-1', name: 'Python-1', subject: 'Python', studentsCount: 8 },
  { id: 'g-python-2', name: 'Python-2', subject: 'Python', studentsCount: 7 },
  { id: 'g-scratch-1', name: 'Scratch-1', subject: 'Scratch', studentsCount: 10 },
  { id: 'g-html-1', name: 'HTML-1', subject: 'HTML', studentsCount: 6 },
]

export const SUBJECTS = ['Python', 'Scratch', 'HTML', 'Roblox']

export const STUDENTS = [
  {
    id: 's1',
    name: 'Алина Петрова',
    groupId: 'g-python-1',
    status: 'active',
    avgGrade: 4.6,
    attendance: 96,
    coins: 340,
    lastActivity: '2026-09-24',
    phone: '+7 (900) 111-22-33',
    email: 'alina.p@example.com',
  },
  {
    id: 's2',
    name: 'Максим Орлов',
    groupId: 'g-python-1',
    status: 'active',
    avgGrade: 3.9,
    attendance: 88,
    coins: 210,
    lastActivity: '2026-09-23',
    phone: '+7 (900) 222-33-44',
    email: 'maxim.o@example.com',
  },
  {
    id: 's3',
    name: 'София Иванова',
    groupId: 'g-python-1',
    status: 'active',
    avgGrade: 5.0,
    attendance: 100,
    coins: 520,
    lastActivity: '2026-09-25',
    phone: '+7 (900) 333-44-55',
    email: 'sofia.i@example.com',
  },
  {
    id: 's4',
    name: 'Даниил Смирнов',
    groupId: 'g-python-2',
    status: 'active',
    avgGrade: 4.1,
    attendance: 91,
    coins: 180,
    lastActivity: '2026-09-22',
    phone: '+7 (900) 444-55-66',
    email: 'daniil.s@example.com',
  },
  {
    id: 's5',
    name: 'Ева Кузнецова',
    groupId: 'g-scratch-1',
    status: 'active',
    avgGrade: 4.4,
    attendance: 94,
    coins: 275,
    lastActivity: '2026-09-24',
    phone: '+7 (900) 555-66-77',
    email: 'eva.k@example.com',
  },
  {
    id: 's6',
    name: 'Артём Волков',
    groupId: 'g-html-1',
    status: 'transferred',
    avgGrade: 3.7,
    attendance: 80,
    coins: 95,
    lastActivity: '2026-08-10',
    phone: '+7 (900) 666-77-88',
    email: 'artem.v@example.com',
  },
  {
    id: 's7',
    name: 'Кира Морозова',
    groupId: 'g-python-2',
    status: 'expelled',
    avgGrade: 2.8,
    attendance: 55,
    coins: 12,
    lastActivity: '2026-06-01',
    phone: '+7 (900) 777-88-99',
    email: 'kira.m@example.com',
  },
]

export function getGroupById(id) {
  return GROUPS.find((g) => g.id === id) ?? null
}

export function getStudentById(id) {
  return STUDENTS.find((s) => s.id === id) ?? null
}

export function getStudentsByGroup(groupId) {
  return STUDENTS.filter((s) => s.groupId === groupId)
}

export const STATUS_LABELS = {
  active: 'Активный',
  transferred: 'Переведён',
  expelled: 'Отчислен',
}
