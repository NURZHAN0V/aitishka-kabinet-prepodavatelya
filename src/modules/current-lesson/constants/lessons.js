/** Мок пар на текущий день */

export const PAIR_LABELS = [
  { id: '0', label: '0-я пара' },
  { id: '1', label: '1-я пара' },
  { id: '2', label: '2-я пара' },
  { id: '3', label: '3-я пара' },
]

export const PAIR_TIMES = {
  0: { start: '09:00', end: '10:20' },
  1: { start: '10:40', end: '12:00' },
  2: { start: '12:20', end: '13:40' },
  3: { start: '14:00', end: '15:20' },
}

/**
 * status: 'in-progress' | 'break' | 'empty' | 'upcoming' | 'done'
 */
export const TODAY_PAIRS = [
  {
    pair: 0,
    status: 'done',
    subject: null,
    groupId: null,
    groupName: null,
    room: null,
    message: 'Пара завершена. Занятий не было.',
  },
  {
    pair: 1,
    status: 'in-progress',
    subject: 'Python',
    groupId: 'g-python-1',
    groupName: 'Python-1',
    room: '204',
    message: null,
  },
  {
    pair: 2,
    status: 'break',
    subject: null,
    groupId: null,
    groupName: null,
    room: null,
    message: 'Перерыв. Следующая пара в 14:00.',
  },
  {
    pair: 3,
    status: 'empty',
    subject: null,
    groupId: null,
    groupName: null,
    room: null,
    message: 'На эту пару занятий нет.',
  },
]

export function getTodayPair(pairNumber) {
  return TODAY_PAIRS.find((p) => p.pair === Number(pairNumber)) ?? null
}

export function formatDateIso(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
