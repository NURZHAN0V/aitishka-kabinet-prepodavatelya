<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseChip,
  BaseIcon,
  BaseInput,
  BaseSelect,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { useJournal } from '@/modules/journal/composables/useJournal.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const {
  groupId,
  lessonDate,
  pair,
  rows,
  group,
  groupOptions,
  pairTime,
  isEditable,
  remainingCoins,
  totalCoins,
  maxCoins,
  attendanceOptions,
  gradeOptions,
  setAttendance,
  setGrade,
  setComment,
  setCoins,
  applyQuery,
} = useJournal({
  group: route.query.group,
  date: route.query.date,
  pair: route.query.pair,
})

watch(
  () => route.query,
  (query) => {
    applyQuery(query)
  },
  { deep: true },
)

const dateLabel = computed(() => {
  const date = new Date(`${lessonDate.value}T12:00:00`)
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const gradeSelectOptions = computed(() =>
  gradeOptions.map((opt) => ({
    value: opt.value === '' ? '' : String(opt.value),
    label: opt.label,
  })),
)

function onGradeChange(studentId, value) {
  setGrade(studentId, value === '' ? '' : Number(value))
}

function onCoinsInput(studentId, value) {
  setCoins(studentId, value)
}

function saveAndClose() {
  if (!isEditable.value) {
    toast.error('Редактирование только через учебную часть')
    return
  }
  toast.success('Журнал сохранён')
  router.push({ name: 'schedule' })
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Занятия' }, { label: 'Журнал группы' }]"
    active-route="journal"
  >
    <div class="page">
      <header class="page__header">
        <div>
          <h1 class="page__title">Журнал группы</h1>
          <p class="page__meta">
            <time :datetime="lessonDate">{{ dateLabel }}</time>
            · {{ pair }}-я пара · {{ pairTime.start }}–{{ pairTime.end }}
          </p>
        </div>
        <BaseButton
          :disabled="!isEditable"
          icon="checkmark-badge-01"
          @click="saveAndClose"
        >
          Сохранить и закрыть
        </BaseButton>
      </header>

      <BaseCard v-if="!isEditable" class="notice" padding="md">
        <div class="notice__inner">
          <BaseIcon name="alert-circle" :size="22" />
          <p>Редактирование только через учебную часть</p>
        </div>
      </BaseCard>

      <BaseCard class="toolbar" padding="md">
        <div class="toolbar__row">
          <BaseSelect
            v-model="groupId"
            class="toolbar__select"
            label="Группа"
            :options="groupOptions"
          />
          <div v-if="group" class="toolbar__lesson">
            <span class="toolbar__label">Предмет</span>
            <strong>{{ group.subject }}</strong>
          </div>
          <div class="toolbar__coins">
            <BaseIcon name="coin" :size="20" />
            <div>
              <span class="toolbar__label">Коины за урок</span>
              <strong>{{ totalCoins }} / {{ maxCoins }}</strong>
              <span class="toolbar__remain">осталось {{ remainingCoins }}</span>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="journal" padding="sm">
        <div class="journal__table" role="table" aria-label="Студенты занятия">
          <div class="journal__head" role="row">
            <span role="columnheader">Студент</span>
            <span role="columnheader">Посещаемость</span>
            <span role="columnheader">Оценка</span>
            <span role="columnheader">Комментарий</span>
            <span role="columnheader">Коины</span>
          </div>

          <div
            v-for="row in rows"
            :key="row.studentId"
            class="journal__row"
            role="row"
          >
            <div class="journal__student" role="cell">
              <strong>{{ row.name }}</strong>
            </div>

            <div class="journal__attendance" role="cell">
              <div
                class="journal__chips"
                :class="{ 'journal__chips--locked': !isEditable }"
                role="radiogroup"
                :aria-label="`Посещаемость: ${row.name}`"
              >
                <BaseChip
                  v-for="opt in attendanceOptions"
                  :key="opt.value"
                  mode="filter"
                  size="sm"
                  :active="row.attendance === opt.value"
                  :toned="row.attendance === opt.value"
                  :variant="opt.value === 'present' ? 'approved' : opt.value === 'late' ? 'pending' : 'rejected'"
                  @click="isEditable && setAttendance(row.studentId, opt.value)"
                >
                  {{ opt.label }}
                </BaseChip>
              </div>
            </div>

            <div class="journal__grade" role="cell">
              <BaseSelect
                :model-value="row.grade === '' ? '' : String(row.grade)"
                :options="gradeSelectOptions"
                :disabled="!isEditable"
                placeholder="—"
                @update:model-value="onGradeChange(row.studentId, $event)"
              />
            </div>

            <div class="journal__comment" role="cell">
              <BaseInput
                :model-value="row.comment"
                :disabled="!isEditable"
                placeholder="Комментарий"
                @update:model-value="setComment(row.studentId, $event)"
              />
            </div>

            <div class="journal__coins" role="cell">
              <BaseInput
                type="number"
                :model-value="row.coins"
                :disabled="!isEditable"
                placeholder="0"
                @update:model-value="onCoinsInput(row.studentId, $event)"
              />
            </div>
          </div>

          <p v-if="!rows.length" class="journal__empty">В группе нет студентов</p>
        </div>
      </BaseCard>

      <div class="page__footer">
        <BaseButton
          :disabled="!isEditable"
          icon="checkmark-badge-01"
          @click="saveAndClose"
        >
          Сохранить и закрыть
        </BaseButton>
      </div>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
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

  &__meta {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    text-transform: capitalize;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
  }
}

.notice {
  border-color: $color-warning;
  background: $color-warning-light;

  &__inner {
    display: flex;
    align-items: center;
    gap: $space-3;
    color: $color-warning-hover;

    p {
      margin: 0;
      font-weight: $font-weight-semibold;
    }
  }
}

.toolbar {
  &__row {
    display: grid;
    grid-template-columns: minmax(200px, 280px) auto 1fr;
    gap: $space-5;
    align-items: end;
  }

  &__label {
    display: block;
    margin-bottom: $space-1;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__lesson strong {
    font-size: $font-size-base;
    color: $color-text-primary;
  }

  &__coins {
    display: flex;
    align-items: center;
    gap: $space-3;
    justify-self: end;
    color: $color-coin-dark;

    strong {
      display: block;
      color: $color-text-primary;
    }
  }

  &__remain {
    display: block;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }
}

.journal {
  overflow: hidden;

  &__table {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__head,
  &__row {
    display: grid;
    grid-template-columns: minmax(140px, 1.2fr) minmax(220px, 1.6fr) 100px minmax(160px, 1.2fr) 88px;
    gap: $space-3;
    align-items: center;
  }

  &__head {
    padding: $space-3 $space-4;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__row {
    padding: $space-3 $space-4;
    border-radius: $radius-lg;
    background: $color-bg-muted;
  }

  &__student strong {
    color: $color-text-primary;
    font-size: $font-size-sm;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;

    &--locked {
      opacity: 0.65;
      pointer-events: none;
    }
  }

  &__empty {
    margin: 0;
    padding: $space-6;
    text-align: center;
    color: $color-text-secondary;
  }
}

@include media-tablet-down {
  .page {
    padding: $space-4;
  }

  .toolbar__row {
    grid-template-columns: 1fr;
    justify-items: stretch;
  }

  .toolbar__coins {
    justify-self: start;
  }

  .journal {
    overflow-x: auto;

    &__head,
    &__row {
      min-width: 760px;
    }
  }
}

@include media-phone {
  .page__header :deep(.base-button) {
    width: 100%;
  }

  .page__footer {
    justify-content: stretch;

    :deep(.base-button) {
      width: 100%;
    }
  }
}
</style>
