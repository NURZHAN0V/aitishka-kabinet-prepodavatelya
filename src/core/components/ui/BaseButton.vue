<script setup>
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'link'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
  },
  as: {
    type: String,
    default: 'button',
    validator: (v) => ['button', 'a'].includes(v),
  },
  href: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  iconType: {
    type: String,
    default: 'svg',
    validator: (v) => ['svg', 'avif'].includes(v),
  },
  iconPosition: {
    type: String,
    default: 'leading',
    validator: (v) => ['leading', 'trailing'].includes(v),
  },
})

const tag = computed(() => props.as)
const isLink = computed(() => props.as === 'a')
const iconSize = computed(() => {
  if (props.iconType === 'avif') {
    return props.size === 'sm' ? 20 : props.size === 'lg' ? 28 : 24
  }
  return props.size === 'sm' ? 16 : props.size === 'lg' ? 22 : 18
})
</script>

<template>
  <component
    :is="tag"
    :type="isLink ? undefined : type"
    :href="isLink ? href : undefined"
    class="base-button"
    :class="[
      `base-button--${variant}`,
      `base-button--${size}`,
      { 'base-button--disabled': disabled },
    ]"
    :disabled="isLink ? undefined : disabled"
    :aria-disabled="isLink && disabled ? true : undefined"
  >
    <BaseIcon
      v-if="icon && iconPosition === 'leading'"
      :name="icon"
      :type="iconType"
      :size="iconSize"
      class="base-button__icon"
    />
    <span class="base-button__label"><slot /></span>
    <BaseIcon
      v-if="icon && iconPosition === 'trailing'"
      :name="icon"
      :type="iconType"
      :size="iconSize"
      class="base-button__icon"
    />
  </component>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  border: none;
  border-radius: $radius-button;
  font-family: inherit;
  font-weight: $font-weight-semibold;
  line-height: $line-height-tight;
  cursor: pointer;
  text-decoration: none;
  @include no-select;
  @include press-scale(0.93);
  transition: transform $transition-press, background-color $transition-base,
    color $transition-base, border-color $transition-base, box-shadow $transition-base,
    filter $transition-base;

  &:focus-visible {
    @include focus-ring;
  }

  &--sm {
    padding: $space-2 $space-3;
    font-size: $font-size-sm;
    min-height: 32px;
  }

  &--md {
    padding: $space-3 $space-5;
    font-size: $font-size-base;
    min-height: 40px;
  }

  &--lg {
    padding: $space-4 $space-6;
    font-size: $font-size-lg;
    min-height: 48px;
    border-radius: $radius-button;
  }

  &--primary {
    background: $gradient-primary;
    color: $color-text-inverse;
    box-shadow: $shadow-sm;

    &:hover:not(.base-button--disabled) {
      filter: brightness(1.05);
    }

    &:active:not(.base-button--disabled) {
      filter: brightness(0.95);
    }
  }

  &--secondary {
    background-color: $color-bg-card;
    color: $color-text-primary;
    border: 1px solid $color-border;

    &:hover:not(.base-button--disabled) {
      border-color: $color-primary-muted;
      background-color: $color-primary-light;
    }

    &:active:not(.base-button--disabled) {
      background-color: $color-bg-muted;
    }
  }

  &--link {
    background: transparent;
    color: $color-text-link;
    padding-left: 0;
    padding-right: 0;
    min-height: auto;

    &:hover:not(.base-button--disabled) {
      color: $color-text-link-hover;
      text-decoration: underline;
    }
  }

  &--disabled,
  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &__label {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
  }
}
</style>
