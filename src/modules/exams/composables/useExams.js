import { computed, ref } from 'vue'
import { getStudentsByGroup } from '@/modules/shared/constants/groups.js'
import { createInitialExams, EXAM_STATUS } from '@/modules/exams/constants/exams.js'

export function useExams() {
  const items = ref(createInitialExams())
  const groupFilter = ref('all')
  const subjectFilter = ref('all')
  const monthFilter = ref('all')
  const statusFilter = ref('all')
  const showCreate = ref(false)

  const filteredItems = computed(() =>
    items.value.filter((item) => {
      if (groupFilter.value !== 'all' && item.groupId !== groupFilter.value) return false
      if (subjectFilter.value !== 'all' && item.subject !== subjectFilter.value) return false
      if (monthFilter.value !== 'all' && !item.submitDeadline.startsWith(monthFilter.value)) {
        return false
      }
      if (statusFilter.value !== 'all' && item.status !== statusFilter.value) return false
      return true
    }),
  )

  const statusCounts = computed(() => {
    const counts = { all: 0, awaiting: 0, uploaded: 0, reviewed: 0, missed: 0 }
    for (const item of items.value) {
      if (groupFilter.value !== 'all' && item.groupId !== groupFilter.value) continue
      if (subjectFilter.value !== 'all' && item.subject !== subjectFilter.value) continue
      if (monthFilter.value !== 'all' && !item.submitDeadline.startsWith(monthFilter.value)) {
        continue
      }
      counts.all += 1
      if (counts[item.status] != null) counts[item.status] += 1
    }
    return counts
  })

  function createExam({ subject, groupId, submitDeadline, reviewDate }) {
    const students = getStudentsByGroup(groupId).filter((s) => s.status === 'active')
    const created = students.map((student, index) => ({
      id: `ex-${Date.now()}-${index}`,
      subject,
      groupId,
      submitDeadline,
      reviewDate,
      studentId: student.id,
      status: EXAM_STATUS.AWAITING,
      uploadedAt: null,
      fileName: null,
      grade: null,
    }))
    items.value = [...created, ...items.value]
    showCreate.value = false
    return created.length
  }

  function setGrade(examId, grade) {
    const exam = items.value.find((item) => item.id === examId)
    if (
      !exam ||
      (exam.status !== EXAM_STATUS.UPLOADED && exam.status !== EXAM_STATUS.REVIEWED)
    ) {
      return false
    }
    if (!exam.fileName) return false
    exam.grade = grade
    exam.status = EXAM_STATUS.REVIEWED
    return true
  }

  return {
    items,
    groupFilter,
    subjectFilter,
    monthFilter,
    statusFilter,
    showCreate,
    filteredItems,
    statusCounts,
    createExam,
    setGrade,
  }
}
