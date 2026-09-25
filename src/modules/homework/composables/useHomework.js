import { computed, ref } from 'vue'
import {
  createInitialHomework,
  HW_STATUS,
} from '@/modules/homework/constants/homework.js'

export function useHomework() {
  const items = ref(createInitialHomework())
  const mainTab = ref('list')
  const groupFilter = ref('all')
  const subjectFilter = ref('all')
  const monthFilter = ref('all')
  const statusFilter = ref('pending')
  const showTransferred = ref(false)

  const statusCounts = computed(() => {
    const counts = {
      pending: 0,
      approved: 0,
      overdue: 0,
      missing: 0,
      rejected: 0,
    }
    for (const hw of items.value) {
      for (const sub of hw.submissions) {
        if (sub.transferred && !showTransferred.value) continue
        if (showTransferred.value && !sub.transferred) continue
        if (groupFilter.value !== 'all' && hw.groupId !== groupFilter.value) continue
        if (subjectFilter.value !== 'all' && hw.subject !== subjectFilter.value) continue
        if (monthFilter.value !== 'all' && !hw.deadline.startsWith(monthFilter.value)) continue
        if (counts[sub.status] != null) counts[sub.status] += 1
      }
    }
    return counts
  })

  const filteredCards = computed(() => {
    const result = []
    for (const hw of items.value) {
      if (groupFilter.value !== 'all' && hw.groupId !== groupFilter.value) continue
      if (subjectFilter.value !== 'all' && hw.subject !== subjectFilter.value) continue
      if (monthFilter.value !== 'all' && !hw.deadline.startsWith(monthFilter.value)) continue

      const submissions = hw.submissions.filter((sub) => {
        if (showTransferred.value) return sub.transferred
        if (sub.transferred) return false
        return sub.status === statusFilter.value
      })

      if (!submissions.length) continue

      for (const sub of submissions) {
        result.push({ homework: hw, submission: sub })
      }
    }
    return result
  })

  function createHomework(payload) {
    const id = `hw-${Date.now()}`
    items.value.unshift({
      id,
      title: payload.title,
      topic: payload.topic,
      subject: payload.subject,
      groupId: payload.groupId,
      deadline: payload.deadline,
      fileName: payload.fileName || 'задание.pdf',
      submissions: [],
    })
    mainTab.value = 'list'
    return id
  }

  function setSubmissionStatus(homeworkId, submissionId, status, { grade = null, comment = '' } = {}) {
    const hw = items.value.find((item) => item.id === homeworkId)
    if (!hw) return false
    const sub = hw.submissions.find((s) => s.id === submissionId)
    if (!sub || sub.transferred) return false
    sub.status = status
    if (grade != null) sub.grade = grade
    if (comment !== undefined) sub.comment = comment
    if (status === HW_STATUS.APPROVED && sub.grade == null) {
      sub.grade = grade ?? 4
    }
    return true
  }

  function setGrade(homeworkId, submissionId, grade) {
    const hw = items.value.find((item) => item.id === homeworkId)
    if (!hw) return false
    const sub = hw.submissions.find((s) => s.id === submissionId)
    if (!sub || sub.transferred) return false
    sub.grade = grade
    if (sub.status === HW_STATUS.PENDING || sub.status === HW_STATUS.OVERDUE) {
      sub.status = HW_STATUS.APPROVED
    }
    return true
  }

  return {
    items,
    mainTab,
    groupFilter,
    subjectFilter,
    monthFilter,
    statusFilter,
    showTransferred,
    statusCounts,
    filteredCards,
    createHomework,
    setSubmissionStatus,
    setGrade,
  }
}
