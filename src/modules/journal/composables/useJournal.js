import { computed, ref, watch } from 'vue'
import { getGroupById, getStudentsByGroup, GROUPS } from '@/modules/shared/constants/groups.js'
import {
  ATTENDANCE_OPTIONS,
  EDIT_WINDOW_DAYS,
  GRADE_OPTIONS,
  MAX_LESSON_COINS,
  PAIR_TIMES,
  daysBetween,
  formatDateIso,
} from '@/modules/journal/constants/journal.js'

function createRow(student) {
  return {
    studentId: student.id,
    name: student.name,
    attendance: 'present',
    grade: '',
    comment: '',
    coins: 0,
  }
}

export function useJournal(initialQuery = {}) {
  const groupId = ref(initialQuery.group || GROUPS[0]?.id || '')
  const lessonDate = ref(initialQuery.date || formatDateIso())
  const pair = ref(Number(initialQuery.pair ?? 1))

  const rows = ref([])

  function reloadRows() {
    const students = getStudentsByGroup(groupId.value)
    rows.value = students.map(createRow)
  }

  reloadRows()

  watch(groupId, () => {
    reloadRows()
  })

  const group = computed(() => getGroupById(groupId.value))

  const groupOptions = computed(() =>
    GROUPS.map((g) => ({ value: g.id, label: `${g.name} · ${g.subject}` })),
  )

  const pairTime = computed(() => PAIR_TIMES[pair.value] ?? PAIR_TIMES[1])

  const ageDays = computed(() => daysBetween(lessonDate.value))

  const isEditable = computed(() => ageDays.value <= EDIT_WINDOW_DAYS)

  const totalCoins = computed(() =>
    rows.value.reduce((sum, row) => sum + (Number(row.coins) || 0), 0),
  )

  const remainingCoins = computed(() => Math.max(0, MAX_LESSON_COINS - totalCoins.value))

  function setAttendance(studentId, value) {
    if (!isEditable.value) return
    const row = rows.value.find((r) => r.studentId === studentId)
    if (row) row.attendance = value
  }

  function setGrade(studentId, value) {
    if (!isEditable.value) return
    const row = rows.value.find((r) => r.studentId === studentId)
    if (row) row.grade = value === '' || value == null ? '' : Number(value)
  }

  function setComment(studentId, value) {
    if (!isEditable.value) return
    const row = rows.value.find((r) => r.studentId === studentId)
    if (row) row.comment = value
  }

  function setCoins(studentId, rawValue) {
    if (!isEditable.value) return
    const row = rows.value.find((r) => r.studentId === studentId)
    if (!row) return

    let next = Math.max(0, Math.floor(Number(rawValue) || 0))
    const others = rows.value
      .filter((r) => r.studentId !== studentId)
      .reduce((sum, r) => sum + (Number(r.coins) || 0), 0)
    const maxForRow = Math.max(0, MAX_LESSON_COINS - others)
    row.coins = Math.min(next, maxForRow)
  }

  function applyQuery(query) {
    if (query.group) groupId.value = String(query.group)
    if (query.date) lessonDate.value = String(query.date)
    if (query.pair != null && query.pair !== '') pair.value = Number(query.pair)
  }

  return {
    groupId,
    lessonDate,
    pair,
    rows,
    group,
    groupOptions,
    pairTime,
    ageDays,
    isEditable,
    totalCoins,
    remainingCoins,
    attendanceOptions: ATTENDANCE_OPTIONS,
    gradeOptions: GRADE_OPTIONS,
    maxCoins: MAX_LESSON_COINS,
    setAttendance,
    setGrade,
    setComment,
    setCoins,
    applyQuery,
  }
}
