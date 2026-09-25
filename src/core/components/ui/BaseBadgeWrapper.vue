<script setup>
import BaseBadge from './BaseBadge.vue'

defineProps({
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
  position: {
    type: String,
    default: 'top-right',
    validator: (v) => ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(v),
  },
})
</script>

<template>
  <span class="base-badge-wrapper" :class="`base-badge-wrapper--${position}`">
    <slot />
    <BaseBadge
      class="base-badge-wrapper__badge"
      :count="count"
      :variant="variant"
      :max="max"
      :dot="dot"
    />
  </span>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.base-badge-wrapper {
  position: relative;
  display: inline-flex;

  &__badge {
    position: absolute;
    z-index: 1;
  }

  &--top-right &__badge {
    top: -4px;
    right: -4px;
  }

  &--top-left &__badge {
    top: -4px;
    left: -4px;
  }

  &--bottom-right &__badge {
    bottom: -4px;
    right: -4px;
  }

  &--bottom-left &__badge {
    bottom: -4px;
    left: -4px;
  }
}
</style>
