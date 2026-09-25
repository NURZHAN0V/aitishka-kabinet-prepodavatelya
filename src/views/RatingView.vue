<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { BaseCard, BaseTabs } from '@/core/components/ui'
import { RATING_PERIODS } from '@/modules/rating/constants/rating.js'
import { useRating } from '@/modules/rating/composables/useRating.js'

const { period, periodLabel, rows, setPeriod } = useRating()

function onPeriodChange(id) {
  setPeriod(id)
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Рейтинг' }]"
    active-route="rating"
  >
    <div class="rating-view">
      <header class="rating-view__header">
        <h1 class="rating-view__title">Рейтинг группы</h1>
        <p class="rating-view__subtitle">
          50% средний балл + 50% доля ДЗ, сданных вовремя. Только просмотр.
        </p>
      </header>

      <BaseTabs
        :model-value="period"
        :tabs="RATING_PERIODS"
        @update:model-value="onPeriodChange"
      />

      <BaseCard padding="md">
        <template #title>{{ periodLabel }}</template>
        <div class="rating-table-wrap">
          <table class="rating-table">
            <thead>
              <tr>
                <th>Место</th>
                <th>ФИО</th>
                <th>Балл рейтинга</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.studentId">
                <td class="rating-table__place">{{ row.place }}</td>
                <td>{{ row.name }}</td>
                <td class="rating-table__score">{{ row.score }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.rating-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.rating-view__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.rating-view__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.rating-table-wrap {
  overflow-x: auto;
}

.rating-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: $space-3 $space-4;
    text-align: left;
    border-bottom: 1px solid $color-border-light;
    font-size: $font-size-sm;
  }

  th {
    font-weight: $font-weight-semibold;
    color: $color-text-secondary;
  }

  td {
    color: $color-text-primary;
  }

  &__place {
    width: 72px;
    font-weight: $font-weight-bold;
    color: $color-primary;
  }

  &__score {
    font-weight: $font-weight-semibold;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}
</style>
