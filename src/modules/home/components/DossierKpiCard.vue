<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { BaseIcon } from '@/core/components/ui'

const props = defineProps({
  kpi: {
    type: Object,
    required: true,
  },
})

const deltaAbs = computed(() => Math.abs(props.kpi.delta ?? 0))
const deltaTone = computed(() => {
  const d = props.kpi.delta ?? 0
  if (d > 0) return 'up'
  if (d < 0) return 'down'
  return 'flat'
})

const displayValue = computed(() => {
  const unit = props.kpi.unit || ''
  return `${props.kpi.value}${unit}`
})
</script>

<template>
  <RouterLink :to="kpi.href" class="dossier-kpi">
    <span class="dossier-kpi__icon" aria-hidden="true">
      <BaseIcon :name="kpi.icon" :size="22" />
    </span>
    <span class="dossier-kpi__label">{{ kpi.label }}</span>
    <span class="dossier-kpi__value">{{ displayValue }}</span>
    <span class="dossier-kpi__delta" :class="`dossier-kpi__delta--${deltaTone}`">
      <BaseIcon
        v-if="deltaTone === 'up'"
        name="arrow-up-01"
        :size="14"
      />
      <BaseIcon
        v-else-if="deltaTone === 'down'"
        name="arrow-down-01"
        :size="14"
      />
      <span v-else class="dossier-kpi__dash" aria-hidden="true">—</span>
      <span v-if="deltaTone !== 'flat'">{{ deltaAbs }}</span>
    </span>
  </RouterLink>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.dossier-kpi {
  @include card-surface;
  @include press-scale(0.97);

  display: flex;
  flex-direction: column;
  gap: $space-2;
  padding: $space-4;
  text-decoration: none;
  color: inherit;
  min-height: 132px;
  transition:
    transform $transition-press,
    border-color $transition-base,
    background-color $transition-base;

  &:hover {
    border-color: $color-primary-muted;
    background-color: color.mix($color-primary-light, $color-bg-card, 35%);
  }

  &:focus-visible {
    @include focus-ring;
  }

  &__icon {
    @include flex-center;

    width: 40px;
    height: 40px;
    border-radius: $radius-md;
    background: $color-primary-light;
    color: $color-primary;
  }

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
    line-height: $line-height-tight;
  }

  &__value {
    margin-top: auto;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__delta {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;

    &--up {
      color: $color-success;
    }

    &--down {
      color: $color-error;
    }

    &--flat {
      color: $color-text-muted;
    }
  }

  &__dash {
    line-height: 1;
  }
}
</style>
