<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: {
    type: [Number, String],
    default: 0,
  },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'primary', 'coin', 'error'].includes(v),
  },
  max: {
    type: Number,
    default: 99,
  },
  dot: {
    type: Boolean,
    default: false,
  },
})

const displayCount = computed(() => {
  const num = Number(props.count)
  if (Number.isNaN(num) || num <= 0) return ''
  return num > props.max ? `${props.max}+` : String(num)
})

const isVisible = computed(() => props.dot || Number(props.count) > 0)
</script>

<template>
  <span
    v-if="isVisible"
    class="base-badge"
    :class="[
      `base-badge--${variant}`,
      { 'base-badge--dot': dot },
    ]"
  >
    <template v-if="!dot">{{ displayCount }}</template>
  </span>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.base-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 $space-2;
  border-radius: $radius-chip;
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  line-height: 1;
  color: $color-text-inverse;

  &--dot {
    min-width: 8px;
    width: 8px;
    height: 8px;
    padding: 0;
  }

  &--default {
    background-color: $color-error;
  }

  &--primary {
    background-color: $color-primary;
  }

  &--coin {
    background: $gradient-coin;
    color: $color-text-primary;
  }

  &--error {
    background-color: $color-error;
  }
}
</style>
