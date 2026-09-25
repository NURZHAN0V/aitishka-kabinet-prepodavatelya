<script setup>
import { computed, reactive, ref } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import { BaseSelect, BaseTabs, BaseCard } from '@/core/components/ui'
import { GROUPS, SUBJECTS, getStudentsByGroup } from '@/modules/shared/constants/groups.js'
import {
  GRADE_TABS,
  GRADE_LEGEND,
  MONTH_OPTIONS,
  LESSON_DATES_BY_MONTH,
  createInitialGrades,
  formatLessonDate,
  nextGradeValue,
} from '@/modules/grades/constants/grades.js'

const groupId = ref(GROUPS[0].id)
const subject = ref(GROUPS[0].subject)
const month = ref('2026-09')
const activeTab = ref('lesson')
const gradesStore = reactive(createInitialGrades())

const groupOptions = GROUPS.map((g) => ({ value: g.id, label: g.name }))
const subjectOptions = SUBJECTS.map((s) => ({ value: s, label: s }))

const students = computed(() =>
  getStudentsByGroup(groupId.value).filter((s) => s.status === 'active'),
)

const lessonDates = computed(() => LESSON_DATES_BY_MONTH[month.value] || [])

function getCell(studentId, date) {
  const bucket = gradesStore[activeTab.value]
  if (!bucket[studentId]) bucket[studentId] = {}
  if (!bucket[studentId][date]) {
    bucket[studentId][date] = { value: null, marks: [] }
  }
  return bucket[studentId][date]
}

function cycleGrade(studentId, date) {
  const cell = getCell(studentId, date)
  cell.value = nextGradeValue(cell.value)
}

function onGroupChange(id) {
  groupId.value = id
  const group = GROUPS.find((g) => g.id === id)
  if (group) subject.value = group.subject
}

const legendMarks = Object.fromEntries(GRADE_LEGEND.map((item) => [item.id, item.mark]))
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Оценки' }]"
    active-route="grades"
  >
    <div class="grades-view">
      <header class="grades-view__header">
        <h1 class="grades-view__title">Оценки</h1>
        <p class="grades-view__subtitle">Таблица студентов и дат занятий. Клик по ячейке — цикл 2–5.</p>
      </header>

      <div class="grades-view__filters">
        <BaseSelect
          :model-value="groupId"
          label="Группа"
          :options="groupOptions"
          @update:model-value="onGroupChange"
        />
        <BaseSelect
          v-model="subject"
          label="Предмет"
          :options="subjectOptions"
        />
        <BaseSelect
          v-model="month"
          label="Месяц"
          :options="MONTH_OPTIONS"
        />
      </div>

      <BaseTabs v-model="activeTab" :tabs="GRADE_TABS" />

      <BaseCard padding="sm" class="grades-view__matrix-card">
        <div class="grades-matrix-wrap">
          <table class="grades-matrix">
            <thead>
              <tr>
                <th class="grades-matrix__sticky">Студент</th>
                <th v-for="date in lessonDates" :key="date" class="grades-matrix__date">
                  {{ formatLessonDate(date) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.id">
                <td class="grades-matrix__sticky grades-matrix__name">{{ student.name }}</td>
                <td v-for="date in lessonDates" :key="`${student.id}-${date}`">
                  <button
                    type="button"
                    class="grades-cell"
                    :class="{
                      'grades-cell--empty': getCell(student.id, date).value == null,
                      'grades-cell--absent': getCell(student.id, date).marks.includes('absent'),
                    }"
                    :title="getCell(student.id, date).comment || 'Изменить оценку'"
                    @click="cycleGrade(student.id, date)"
                  >
                    <span class="grades-cell__value">
                      {{ getCell(student.id, date).value ?? '—' }}
                    </span>
                    <span
                      v-if="getCell(student.id, date).marks.length"
                      class="grades-cell__marks"
                    >
                      <span
                        v-for="mark in getCell(student.id, date).marks"
                        :key="mark"
                        class="grades-cell__mark"
                      >
                        {{ legendMarks[mark] }}
                      </span>
                    </span>
                  </button>
                </td>
              </tr>
              <tr v-if="!students.length">
                <td :colspan="lessonDates.length + 1" class="grades-matrix__empty">
                  Нет активных студентов в группе
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

      <ul class="grades-legend" aria-label="Легенда">
        <li v-for="item in GRADE_LEGEND" :key="item.id" class="grades-legend__item">
          <span class="grades-legend__mark">{{ item.mark }}</span>
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.grades-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.grades-view__header {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.grades-view__title {
  margin: 0;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.grades-view__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.grades-view__filters {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 220px));
  gap: $space-4;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.grades-matrix-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.grades-matrix {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;

  th,
  td {
    padding: $space-2;
    text-align: center;
    border-bottom: 1px solid $color-border-light;
    vertical-align: middle;
  }

  th {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: $color-text-secondary;
    white-space: nowrap;
  }

  &__sticky {
    position: sticky;
    left: 0;
    z-index: 1;
    background: $color-bg-card;
    text-align: left;
    min-width: 160px;
  }

  &__name {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
    white-space: nowrap;
  }

  &__empty {
    padding: $space-8;
    color: $color-text-muted;
    font-size: $font-size-sm;
  }
}

.grades-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-width: 48px;
  min-height: 48px;
  margin: 0 auto;
  padding: $space-1;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  background: $color-bg-muted;
  cursor: pointer;
  font-family: inherit;
  transition: border-color $transition-fast, background-color $transition-fast;

  &:hover {
    border-color: $color-primary-muted;
    background: $color-primary-light;
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }

  &--empty {
    color: $color-text-muted;
  }

  &--absent {
    background: $color-error-light;
    border-color: transparent;
  }

  &__value {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    line-height: 1;
  }

  &__marks {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    justify-content: center;
  }

  &__mark {
    font-size: 9px;
    line-height: 1;
    color: $color-text-secondary;
  }
}

.grades-legend {
  display: flex;
  flex-wrap: wrap;
  gap: $space-4;
  margin: 0;
  padding: 0;
  list-style: none;
}

.grades-legend__item {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.grades-legend__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 $space-1;
  border-radius: $radius-sm;
  background: $color-bg-muted;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}
</style>
