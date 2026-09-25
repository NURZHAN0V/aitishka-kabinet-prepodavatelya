<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import { BaseButton, BaseCard, BaseChip, BaseIcon, BaseTabs } from '@/core/components/ui'
import {
  PAIR_LABELS,
  PAIR_TIMES,
  TODAY_PAIRS,
  formatDateIso,
  getTodayPair,
} from '@/modules/current-lesson/constants/lessons.js'

const activePair = ref('1')

const today = new Date()
const todayIso = formatDateIso(today)
const todayLabel = today.toLocaleDateString('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const tabs = PAIR_LABELS.map((p) => ({ id: p.id, label: p.label }))

const current = computed(() => getTodayPair(activePair.value) ?? TODAY_PAIRS[1])
const pairTime = computed(() => PAIR_TIMES[Number(activePair.value)] ?? PAIR_TIMES[1])

const isInProgress = computed(() => current.value?.status === 'in-progress')

const journalTo = computed(() => ({
  path: '/journal',
  query: {
    group: current.value?.groupId,
    date: todayIso,
    pair: String(current.value?.pair ?? 1),
  },
}))

const statusMeta = computed(() => {
  switch (current.value?.status) {
    case 'in-progress':
      return { variant: 'approved', label: 'Идёт сейчас' }
    case 'break':
      return { variant: 'pending', label: 'Перерыв' }
    case 'done':
      return { variant: 'missing', label: 'Завершено' }
    case 'upcoming':
      return { variant: 'current', label: 'Скоро' }
    default:
      return { variant: 'missing', label: 'Нет пары' }
  }
})
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Занятия' }, { label: 'Текущее занятие' }]"
    active-route="current-lesson"
  >
    <div class="page">
      <header class="page__header">
        <div>
          <h1 class="page__title">Текущее занятие</h1>
          <p class="page__date">
            <BaseIcon name="calendar-03" :size="18" />
            <time :datetime="todayIso">{{ todayLabel }}</time>
          </p>
        </div>
        <BaseTabs v-model="activePair" :tabs="tabs" size="sm" />
      </header>

      <BaseCard class="lesson" padding="lg">
        <div class="lesson__top">
          <BaseChip :variant="statusMeta.variant" size="sm">
            {{ statusMeta.label }}
          </BaseChip>
          <span class="lesson__time">
            <BaseIcon name="clock-01" :size="16" />
            {{ pairTime.start }}–{{ pairTime.end }}
          </span>
        </div>

        <template v-if="isInProgress">
          <h2 class="lesson__subject">{{ current.subject }}</h2>
          <dl class="lesson__facts">
            <div>
              <dt>Группа</dt>
              <dd>{{ current.groupName }}</dd>
            </div>
            <div>
              <dt>Аудитория</dt>
              <dd>{{ current.room }}</dd>
            </div>
            <div>
              <dt>Пара</dt>
              <dd>{{ current.pair }}-я</dd>
            </div>
          </dl>
          <RouterLink
            v-slot="{ href, navigate }"
            :to="journalTo"
            custom
          >
            <BaseButton
              as="a"
              :href="href"
              icon="clipboard"
              @click.prevent="navigate"
            >
              Открыть журнал
            </BaseButton>
          </RouterLink>
        </template>

        <template v-else>
          <div class="lesson__empty">
            <span class="lesson__empty-icon" aria-hidden="true">
              <BaseIcon
                :name="current.status === 'break' ? 'clock-01' : 'calendar-03'"
                :size="28"
              />
            </span>
            <p class="lesson__empty-text">{{ current.message }}</p>
          </div>
        </template>
      </BaseCard>
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
    margin: 0 0 $space-2;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__date {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    text-transform: capitalize;
  }
}

.lesson {
  max-width: 640px;

  &__top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-3;
    margin-bottom: $space-5;
  }

  &__time {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__subject {
    margin: 0 0 $space-4;
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: $space-4;
    margin: 0 0 $space-6;
    padding: $space-4;
    border-radius: $radius-lg;
    background: $color-bg-muted;

    dt {
      margin: 0 0 $space-1;
      font-size: $font-size-xs;
      color: $color-text-muted;
    }

    dd {
      margin: 0;
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $space-3;
    padding: $space-2 0;
  }

  &__empty-icon {
    @include flex-center;

    width: 56px;
    height: 56px;
    border-radius: $radius-lg;
    background: $color-primary-light;
    color: $color-primary;
  }

  &__empty-text {
    margin: 0;
    font-size: $font-size-lg;
    color: $color-text-secondary;
  }
}

@include media-tablet-down {
  .page {
    padding: $space-4;
  }

  .lesson__facts {
    grid-template-columns: 1fr;
  }
}
</style>
