import { computed, ref } from 'vue'
import { createInitialReviews } from '@/modules/reviews/constants/reviews.js'

const reviews = ref(createInitialReviews())

export function useReviews() {
  const editingId = ref(null)

  function getReviewsByStudent(studentId) {
    return reviews.value.filter((r) => r.studentId === studentId)
  }

  const allReviews = computed(() =>
    [...reviews.value].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
  )

  function saveReview({ id, studentId, subject, text }) {
    const now = new Date().toISOString().slice(0, 10)
    if (id) {
      const existing = reviews.value.find((r) => r.id === id)
      if (!existing) return false
      existing.subject = subject
      existing.text = text
      existing.updatedAt = now
      editingId.value = null
      return true
    }
    reviews.value.unshift({
      id: `r-${Date.now()}`,
      studentId,
      subject,
      text,
      createdAt: now,
      updatedAt: now,
    })
    return true
  }

  function startEdit(id) {
    editingId.value = id
  }

  function cancelEdit() {
    editingId.value = null
  }

  return {
    reviews,
    allReviews,
    editingId,
    getReviewsByStudent,
    saveReview,
    startEdit,
    cancelEdit,
  }
}
