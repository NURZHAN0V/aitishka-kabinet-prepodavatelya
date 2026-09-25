import { computed, ref } from 'vue'
import { getStudentById } from '@/modules/shared/constants/groups.js'
import {
  RATING_BY_PERIOD,
  calcRatingScore,
  getMonthLabel,
} from '@/modules/rating/constants/rating.js'

export function useRating() {
  const period = ref('current')

  const periodLabel = computed(() => getMonthLabel(period.value))

  const rows = computed(() => {
    const raw = RATING_BY_PERIOD[period.value] || []
    return raw
      .map((item) => {
        const student = getStudentById(item.studentId)
        const score = calcRatingScore(item.avgGrade, item.hwOnTime)
        return {
          studentId: item.studentId,
          name: student?.name || '—',
          avgGrade: item.avgGrade,
          hwOnTime: item.hwOnTime,
          score,
        }
      })
      .sort((a, b) => b.score - a.score)
      .map((row, index) => ({ ...row, place: index + 1 }))
  })

  function setPeriod(id) {
    period.value = id
  }

  return {
    period,
    periodLabel,
    rows,
    setPeriod,
  }
}
