<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  toast: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['dismiss'])

const iconName = computed(() => {
  const map = {
    success: 'check-circle',
    error: 'alert-circle',
    info: 'info-circle',
  }
  return map[props.toast.variant] ?? 'info-circle'
})

let timer = null

onMounted(() => {
  if (props.toast.duration > 0) {
    timer = setTimeout(() => emit('dismiss', props.toast.id), props.toast.duration)
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div
    class="base-toast"
    :class="`base-toast--${toast.variant}`"
    role="alert"
  >
    <BaseIcon :name="iconName" :size="28" class="base-toast__icon" />
    <p class="base-toast__message">{{ toast.message }}</p>
    <button
      type="button"
      class="base-toast__close"
      aria-label="Закрыть"
      @click="emit('dismiss', toast.id)"
    >
      <BaseIcon name="x-close" :size="22" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.base-toast {
  display: flex;
  align-items: center;
  gap: $space-4;
  min-width: min(420px, calc(100vw - #{$space-12}));
  max-width: min(560px, calc(100vw - #{$space-12}));
  padding: $space-5 $space-6;
  border-radius: $radius-card;
  background-color: $color-bg-card;
  box-shadow: $shadow-lg;

  &--success {
    .base-toast__icon {
      color: $color-success;
    }
  }

  &--error {
    .base-toast__icon {
      color: $color-error;
    }
  }

  &--info {
    .base-toast__icon {
      color: $color-info;
    }
  }

  &__message {
    flex: 1;
    margin: 0;
    font-size: $font-size-base;
    color: $color-text-primary;
    line-height: $line-height-relaxed;
  }

  &__close {
    display: flex;
    flex-shrink: 0;
    padding: $space-1;
    border: none;
    background: transparent;
    color: $color-text-muted;
    cursor: pointer;

    &:hover {
      color: $color-text-primary;
    }
  }
}
</style>
