<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Подтвердите действие',
  },
  message: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: 'Подтвердить',
  },
  cancelText: {
    type: String,
    default: 'Отмена',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'danger'].includes(v),
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

function onKeydown(event) {
  if (event.key === 'Escape' && props.modelValue) {
    emit('cancel')
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
    <Transition name="confirm">
      <div
        v-if="modelValue"
        class="base-confirm"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="title ? 'confirm-title' : undefined"
      >
        <div
          class="base-confirm__overlay"
          @click="closeOnOverlay && emit('cancel')"
        />
        <div class="base-confirm__content">
          <header class="base-confirm__header">
            <div
              class="base-confirm__icon-wrap"
              :class="`base-confirm__icon-wrap--${variant}`"
            >
              <BaseIcon
                :name="variant === 'danger' ? 'alert-circle' : 'info-circle'"
                :size="24"
              />
            </div>
            <h2 id="confirm-title" class="base-confirm__title">{{ title }}</h2>
          </header>

          <div v-if="message || $slots.default" class="base-confirm__body">
            <slot>
              <p class="base-confirm__message">{{ message }}</p>
            </slot>
          </div>

          <footer class="base-confirm__footer">
            <BaseButton variant="secondary" @click="emit('cancel')">
              {{ cancelText }}
            </BaseButton>
            <BaseButton
              :variant="variant === 'danger' ? 'primary' : 'primary'"
              :class="{ 'base-confirm__confirm--danger': variant === 'danger' }"
              @click="emit('confirm')"
            >
              {{ confirmText }}
            </BaseButton>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.base-confirm {
  position: fixed;
  inset: 0;
  z-index: 1100;
  @include flex-center;

  &__overlay {
    position: absolute;
    inset: 0;
    background-color: $color-bg-overlay;
  }

  &__content {
    position: relative;
    z-index: 1;
    width: min(400px, calc(100vw - #{$space-8}));
    padding: $space-6;
    border-radius: $radius-2xl;
    background-color: $color-bg-card;
    box-shadow: $shadow-modal;
    text-align: center;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-4;
    margin-bottom: $space-4;
    @include no-select;
  }

  &__icon-wrap {
    @include flex-center;

    width: 48px;
    height: 48px;
    border-radius: 50%;

    &--primary {
      background-color: $color-primary-light;
      color: $color-primary;
    }

    &--danger {
      background-color: $color-error-light;
      color: $color-error;
    }
  }

  &__title {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__body {
    margin-bottom: $space-6;
  }

  &__message {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-relaxed;
  }

  &__footer {
    display: flex;
    justify-content: center;
    gap: $space-3;
    @include no-select;
  }

  &__confirm--danger {
    background: linear-gradient(135deg, $color-error 0%, #f87171 100%);
  }
}

.confirm-enter-active,
.confirm-leave-active {
  transition: opacity $transition-base;

  .base-confirm__content {
    transition: transform $transition-base;
  }
}

.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;

  .base-confirm__content {
    transform: scale(0.95) translateY(8px);
  }
}
</style>
