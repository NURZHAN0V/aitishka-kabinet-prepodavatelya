<script setup>
import { computed, ref } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  error: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const showPassword = ref(false)
const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 9)}`)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)

const describedBy = computed(() => {
  const ids = []
  if (props.error) ids.push(errorId.value)
  else if (props.hint) ids.push(hintId.value)
  return ids.length ? ids.join(' ') : undefined
})

function onInput(event) {
  emit('update:modelValue', event.target.value)
}

function togglePassword() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div
    class="base-input"
    :class="{ 'base-input--error': error, 'base-input--disabled': disabled }"
  >
    <label v-if="label" class="base-input__label" :for="inputId">
      {{ label }}
    </label>
    <div class="base-input__wrapper">
      <input
        :id="inputId"
        class="base-input__field"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="!!error"
        :aria-describedby="describedBy"
        @input="onInput"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="base-input__toggle"
        :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
        :disabled="disabled"
        @click="togglePassword"
      >
        <BaseIcon :name="showPassword ? 'eye-off' : 'eye'" :size="20" />
      </button>
    </div>
    <p v-if="hint && !error" :id="hintId" class="base-input__hint">
      {{ hint }}
    </p>
    <p v-if="error" :id="errorId" class="base-input__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.base-input {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
  }

  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__field {
    width: 100%;
    padding: $space-3 $space-4;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    background-color: $color-bg-card;
    font-family: inherit;
    font-size: $font-size-base;
    color: $color-text-primary;
    transition: border-color $transition-base, box-shadow $transition-base;

    &::placeholder {
      color: $color-text-placeholder;
    }

    &:focus {
      outline: none;
      border-color: $color-border-focus;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.15);
    }

    &:disabled {
      background-color: $color-bg-muted;
      cursor: not-allowed;
    }
  }

  &__toggle {
    position: absolute;
    right: $space-3;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: transparent;
    color: $color-text-muted;
    cursor: pointer;

    &:hover:not(:disabled) {
      color: $color-text-primary;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &:has(.base-input__toggle) &__field {
    padding-right: $space-10;
  }

  &__hint {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }

  &__error {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-error;
  }

  &--error &__field {
    border-color: $color-error;

    &:focus {
      box-shadow: 0 0 0 3px rgba($color-error, 0.15);
    }
  }

  &--disabled {
    opacity: 0.7;
  }
}
</style>
