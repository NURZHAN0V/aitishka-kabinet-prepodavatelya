<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import { BaseCard, BaseIcon, BaseTabs, PeriodNav } from '@/core/components/ui'
import {
  PAIR_NUMBERS,
  PAIR_TIMES,
  SCHEDULE_VIEW_TABS,
  WEEKDAY_SHORT,
  addDays,
  buildMockSchedule,
  formatDateIso,
  formatWeekLabel,
  getLessonAt,
  getLessonsForDay,
  startOfWeek,
  subjectColorKey,
} from '@/modules/schedule/constants/schedule.js'

const router = useRouter()
const view = ref('week')
const weekStart = ref(startOfWeek(new Date()))
const selectedDay = ref(formatDateIso(new Date()))

const lessons = computed(() => buildMockSchedule(weekStart.value))

const weekDays = computed(() =>
  WEEKDAY_SHORT.map((label, index) => {
    const date = addDays(weekStart.value, index)
    return {
      index,
      label,
      date,
      iso: formatDateIso(date),
      isToday: formatDateIso(date) === formatDateIso(new Date()),
    }
  }),
)

const periodLabel = computed(() => formatWeekLabel(weekStart.value))

const dayLessons = computed(() => getLessonsForDay(lessons.value, selectedDay.value))

const weekRows = computed(() =>
  PAIR_NUMBERS.map((pair) => ({
    pair,
    time: PAIR_TIMES[pair],
    cells: weekDays.value.map((day) => ({
      day,
      lesson: getLessonAt(lessons.value, day.iso, pair),
    })),
  })),
)

const selectedDayLabel = computed(() => {
  const date = new Date(`${selectedDay.value}T12:00:00`)
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
})

function locationLabel(lesson) {
  if (lesson.online) return 'онлайн'
  return lesson.room ? `ауд. ${lesson.room}` : '—'
}

function openJournal(lesson) {
  router.push({
    path: '/journal',
    query: {
      group: lesson.groupId,
      date: lesson.date,
      pair: String(lesson.pair),
    },
  })
}

function goPrev() {
  weekStart.value = addDays(weekStart.value, -7)
  selectedDay.value = formatDateIso(weekStart.value)
}

function goNext() {
  weekStart.value = addDays(weekStart.value, 7)
  selectedDay.value = formatDateIso(weekStart.value)
}

function goCurrent() {
  weekStart.value = startOfWeek(new Date())
  selectedDay.value = formatDateIso(new Date())
}

function onSelectDay(iso) {
  selectedDay.value = iso
  if (view.value !== 'day') {
    view.value = 'day'
  }
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Занятия' }, { label: 'Расписание' }]"
    active-route="schedule"
  >
    <div class="page">
      <header class="page__header">
        <div>
          <h1 class="page__title">Расписание</h1>
          <p class="page__hint">Отменённые занятия не отображаются</p>
        </div>
        <BaseTabs v-model="view" :tabs="SCHEDULE_VIEW_TABS" size="sm" />
      </header>

      <PeriodNav
        :label="periodLabel"
        prev-label="Предыдущая неделя"
        next-label="Следующая неделя"
        current-label="Текущая неделя"
        @prev="goPrev"
        @next="goNext"
        @current="goCurrent"
      />

      <div v-if="view === 'week'" class="week">
        <div class="week__corner" aria-hidden="true" />
        <div
          v-for="day in weekDays"
          :key="day.iso"
          class="week__day-head"
          :class="{ 'week__day-head--today': day.isToday }"
        >
          <button
            type="button"
            class="week__day-btn"
            @click="onSelectDay(day.iso)"
          >
            <span>{{ day.label }}</span>
            <span class="week__day-num">{{ day.date.getDate() }}</span>
          </button>
        </div>

        <template v-for="row in weekRows" :key="`pair-${row.pair}`">
          <div class="week__pair">
            <span class="week__pair-num">{{ row.pair }}</span>
            <span class="week__pair-time">
              {{ row.time.start }}
            </span>
          </div>
          <div
            v-for="cell in row.cells"
            :key="`${cell.day.iso}-${row.pair}`"
            class="week__cell"
            :class="{ 'week__cell--today': cell.day.isToday }"
          >
            <button
              v-if="cell.lesson"
              type="button"
              class="lesson-card"
              :class="`lesson-card--${subjectColorKey(cell.lesson.subject)}`"
              @click="openJournal(cell.lesson)"
            >
              <span class="lesson-card__subject">
                {{ cell.lesson.subject }}
              </span>
              <span class="lesson-card__group">
                {{ cell.lesson.groupName }}
              </span>
              <span class="lesson-card__meta">
                {{ row.time.start }}–{{ row.time.end }}
                ·
                {{ locationLabel(cell.lesson) }}
              </span>
            </button>
          </div>
        </template>
      </div>

      <div v-else class="day">
        <h2 class="day__title">{{ selectedDayLabel }}</h2>
        <ul v-if="dayLessons.length" class="day__list">
          <li v-for="lesson in dayLessons" :key="lesson.id">
            <BaseCard
              class="day-card"
              padding="md"
              role="button"
              tabindex="0"
              @click="openJournal(lesson)"
              @keydown.enter.prevent="openJournal(lesson)"
            >
              <div class="day-card__row">
                <span
                  class="day-card__stripe"
                  :class="`day-card__stripe--${subjectColorKey(lesson.subject)}`"
                  aria-hidden="true"
                />
                <div class="day-card__body">
                  <div class="day-card__top">
                    <strong>{{ lesson.subject }}</strong>
                    <span>{{ PAIR_TIMES[lesson.pair].start }}–{{ PAIR_TIMES[lesson.pair].end }}</span>
                  </div>
                  <p>
                    {{ lesson.groupName }} · {{ locationLabel(lesson) }} · {{ lesson.pair }}-я пара
                  </p>
                </div>
                <BaseIcon name="chevron-right" :size="18" class="day-card__chevron" />
              </div>
            </BaseCard>
          </li>
        </ul>
        <BaseCard v-else class="day__empty" padding="lg">
          <p>На этот день занятий нет</p>
        </BaseCard>
      </div>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.page {
  padding: $space-4 $space-6 $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-5;

  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: $space-4;
  }

  &__title {
    margin: 0 0 $space-1;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__hint {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }
}

.week {
  display: grid;
  grid-template-columns: 64px repeat(7, minmax(110px, 1fr));
  gap: $space-2;
  overflow-x: auto;
  padding-bottom: $space-2;

  &__corner {
    min-height: 48px;
  }

  &__day-head {
    @include card-surface;

    padding: $space-2;
    text-align: center;

    &--today {
      border-color: $color-primary-muted;
      background: $color-primary-light;
    }
  }

  &__day-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-1;
    width: 100%;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: $color-text-secondary;
    cursor: pointer;
  }

  &__day-num {
    font-size: $font-size-base;
    color: $color-text-primary;
  }

  &__pair {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: $space-2;
    color: $color-text-muted;
  }

  &__pair-num {
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__pair-time {
    font-size: 0.65rem;
  }

  &__cell {
    min-height: 88px;
    border-radius: $radius-lg;
    background: $color-bg-muted;

    &--today {
      background: color.mix($color-primary-light, $color-bg-muted, 40%);
    }
  }
}

.lesson-card {
  display: flex;
  flex-direction: column;
  gap: $space-1;
  width: 100%;
  height: 100%;
  min-height: 88px;
  padding: $space-3;
  border: 1px solid transparent;
  border-radius: $radius-lg;
  border-left-width: 4px;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  @include press-scale(0.98);
  transition: transform $transition-press, box-shadow $transition-base;

  &:hover {
    box-shadow: $shadow-sm;
  }

  &:focus-visible {
    @include focus-ring;
  }

  &__subject {
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__group {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: $color-text-secondary;
  }

  &__meta {
    margin-top: auto;
    font-size: 0.7rem;
    color: $color-text-muted;
  }

  @each $name, $color in $subject-colors {
    &--#{$name} {
      background: color.mix($color, $color-bg-card, 12%);
      border-left-color: $color;
    }
  }
}

.day {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__title {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    text-transform: capitalize;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__empty {
    p {
      margin: 0;
      color: $color-text-secondary;
    }
  }
}

.day-card {
  cursor: pointer;
  @include press-scale(0.98);
  transition: transform $transition-press, border-color $transition-base;

  &:hover {
    border-color: $color-primary-muted;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: $space-4;
  }

  &__stripe {
    width: 4px;
    align-self: stretch;
    border-radius: 4px;
    background: $color-primary;

    @each $name, $color in $subject-colors {
      &--#{$name} {
        background: $color;
      }
    }
  }

  &__body {
    flex: 1;
    min-width: 0;

    p {
      margin: $space-1 0 0;
      font-size: $font-size-sm;
      color: $color-text-secondary;
    }
  }

  &__top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: $space-2;
    color: $color-text-primary;
    font-size: $font-size-base;

    span {
      font-size: $font-size-sm;
      color: $color-text-muted;
      font-weight: $font-weight-medium;
    }
  }

  &__chevron {
    color: $color-text-muted;
  }
}

@include media-tablet-down {
  .page {
    padding: $space-4;
  }

  .week {
    grid-template-columns: 52px repeat(7, minmax(96px, 1fr));
  }
}
</style>
