<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'
import BaseTooltip from './BaseTooltip.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v),
  },
  closable: {
    type: Boolean,
    default: true,
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
  closeIcon: {
    type: String,
    default: 'x-close',
  },
  closeLabel: {
    type: String,
    default: 'Закрыть',
  },
  closeTooltip: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onOverlayClick() {
  if (props.closeOnOverlay) {
    close()
  }
}

function onKeydown(event) {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  },
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="base-modal" role="dialog" aria-modal="true">
        <div class="base-modal__overlay" @click="onOverlayClick" />
        <div class="base-modal__content" :class="`base-modal__content--${size}`">
          <header v-if="title || $slots['title-extra'] || closable" class="base-modal__header">
            <div v-if="title || $slots['title-extra']" class="base-modal__heading">
              <h2 v-if="title" class="base-modal__title">{{ title }}</h2>
              <slot name="title-extra" />
            </div>
            <BaseTooltip
              v-if="closable"
              :text="closeTooltip || closeLabel"
              placement="top"
              :disabled="!closeTooltip"
            >
              <button
                type="button"
                class="base-modal__close"
                :aria-label="closeLabel"
                @click="close"
              >
                <BaseIcon :name="closeIcon" :size="20" />
              </button>
            </BaseTooltip>
          </header>
          <div class="base-modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="base-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.base-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  @include flex-center;
  padding: env(safe-area-inset-top, 0) env(safe-area-inset-right, 0) env(safe-area-inset-bottom, 0)
    env(safe-area-inset-left, 0);

  &__overlay {
    position: absolute;
    inset: 0;
    background-color: $color-bg-overlay;
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    width: calc(100vw - #{$space-8});
    max-height: calc(100dvh - #{$space-8});
    max-height: calc(100vh - #{$space-8});
    overflow: hidden;
    background-color: $color-bg-card;
    border-radius: $radius-2xl;
    box-shadow: $shadow-modal;

    &--sm {
      max-width: 360px;
    }

    &--md {
      max-width: 480px;
    }

    &--lg {
      max-width: 640px;
    }

    &--xl {
      width: min(80vw, calc(100vw - #{$space-8}));
      max-width: min(80vw, calc(100vw - #{$space-8}));
      height: min(80dvh, calc(100dvh - #{$space-8}));
      height: min(80vh, calc(100vh - #{$space-8}));
      max-height: min(80dvh, calc(100dvh - #{$space-8}));
      max-height: min(80vh, calc(100vh - #{$space-8}));
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    flex-shrink: 0;
    padding: $space-5 $space-6 $space-3;
    @include no-select;

    :deep(.base-tooltip) {
      flex-shrink: 0;
    }
  }

  &__heading {
    display: flex;
    align-items: center;
    gap: $space-2;
    min-width: 0;
    flex: 1;
  }

  &__title {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__close {
    @include flex-center;
    @include no-select;
    @include touch-target;

    flex-shrink: 0;
    width: $touch-target-min;
    height: $touch-target-min;
    border: none;
    border-radius: $radius-md;
    background: transparent;
    color: $color-text-secondary;
    cursor: pointer;
    transition: background-color $transition-base;

    &:hover {
      background-color: $color-bg-muted;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: $space-3 $space-6 $space-6;
    color: $color-text-secondary;
  }

  &__content--xl &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: $space-3;
    flex-shrink: 0;
    padding: $space-4 $space-6 calc(#{$space-6} + env(safe-area-inset-bottom, 0));
    border-top: 1px solid $color-border-light;

    > * {
      flex-shrink: 0;
    }
  }

  @include media-phone {
    align-items: flex-end;

    &__content {
      width: 100%;
      max-width: none;
      max-height: min(92dvh, calc(100dvh - env(safe-area-inset-top, 0)));
      max-height: min(92vh, calc(100vh - env(safe-area-inset-top, 0)));
      border-radius: $radius-2xl $radius-2xl 0 0;
      margin: 0;

      &--sm,
      &--md,
      &--lg,
      &--xl {
        width: 100%;
        max-width: none;
        height: auto;
      }

      &--xl {
        max-height: min(92dvh, calc(100dvh - env(safe-area-inset-top, 0)));
        max-height: min(92vh, calc(100vh - env(safe-area-inset-top, 0)));
      }
    }

    &__header {
      padding: $space-4 $space-4 $space-2;
    }

    &__body {
      padding: $space-2 $space-4 $space-4;
    }

    &__footer {
      flex-direction: column-reverse;
      align-items: stretch;
      padding: $space-3 $space-4 calc(#{$space-4} + env(safe-area-inset-bottom, 0));

      > * {
        width: 100%;
      }
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity $transition-base;

  .base-modal__content {
    transition: transform $transition-base;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .base-modal__content {
    transform: scale(0.95) translateY(8px);
  }
}

@include media-phone {
  .modal-enter-from,
  .modal-leave-to {
    .base-modal__content {
      transform: translateY(24px);
    }
  }
}
</style>
