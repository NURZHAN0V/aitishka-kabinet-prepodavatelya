/** Моки отзывов о студентах */

export function createInitialReviews() {
  return [
    {
      id: 'r1',
      studentId: 's1',
      subject: 'Python',
      text: 'Алина активно работает на уроке, помогает одногруппникам.',
      createdAt: '2026-09-15',
      updatedAt: '2026-09-15',
    },
    {
      id: 'r2',
      studentId: 's3',
      subject: 'Python',
      text: 'София стабильно показывает высокий уровень. Рекомендую олимпиаду.',
      createdAt: '2026-09-10',
      updatedAt: '2026-09-12',
    },
    {
      id: 'r3',
      studentId: 's5',
      subject: 'Scratch',
      text: 'Ева творчески подходит к проектам, нужно чуть больше внимания к дедлайнам.',
      createdAt: '2026-09-08',
      updatedAt: '2026-09-08',
    },
  ]
}
