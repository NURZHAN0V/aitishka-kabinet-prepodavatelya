<script setup>
import BaseToast from './BaseToast.vue'
import { toasts, useToast } from '@/core/composables/useToast'

const { dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="base-toast-container" aria-live="polite">
      <TransitionGroup name="toast">
        <BaseToast
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
          @dismiss="dismiss"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.base-toast-container {
  position: fixed;
  bottom: $space-6;
  right: $space-6;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: $space-4;
  pointer-events: none;

  :deep(.base-toast) {
    pointer-events: auto;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity $transition-base, transform $transition-base;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
