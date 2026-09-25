<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl', '2xl'].includes(v),
  },
  status: {
    type: String,
    default: '',
    validator: (v) => ['', 'online', 'offline'].includes(v),
  },
})

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
})

const hasImage = computed(() => !!props.src)
</script>

<template>
  <span
    class="base-avatar"
    :class="[
      `base-avatar--${size}`,
      { 'base-avatar--image': hasImage },
      { [`base-avatar--status-${status}`]: status },
    ]"
    :aria-label="alt || name || 'Аватар'"
    role="img"
  >
    <img v-if="hasImage" class="base-avatar__img" :src="src" :alt="alt || name" />
    <span v-else class="base-avatar__initials">{{ initials }}</span>
    <span v-if="status" class="base-avatar__status" :class="`base-avatar__status--${status}`" />
  </span>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.base-avatar {
  @include flex-center;

  position: relative;
  flex-shrink: 0;
  border-radius: $radius-md;
  overflow: visible;
  background: $gradient-primary;
  color: $color-text-inverse;
  font-weight: $font-weight-semibold;
  user-select: none;

  &--sm {
    width: 32px;
    height: 32px;
    font-size: $font-size-xs;
  }

  &--md {
    width: 40px;
    height: 40px;
    font-size: $font-size-sm;
  }

  &--lg {
    width: 48px;
    height: 48px;
    font-size: $font-size-base;
  }

  &--xl {
    width: 64px;
    height: 64px;
    font-size: $font-size-lg;
  }

  &--2xl {
    width: 192px;
    height: 192px;
    font-size: $font-size-3xl;
    border-radius: $radius-lg;

    .base-avatar__img {
      border-radius: $radius-lg;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $radius-md;
  }

  &__initials {
    line-height: 1;
  }

  &__status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    border: 2px solid $color-bg-card;
    border-radius: 50%;

    &--online {
      background-color: $color-success;
    }

    &--offline {
      background-color: $color-neutral;
    }
  }

  &--sm &__status {
    width: 8px;
    height: 8px;
  }

  &--xl &__status {
    width: 12px;
    height: 12px;
  }

  &--2xl &__status {
    width: 16px;
    height: 16px;
  }
}
</style>
