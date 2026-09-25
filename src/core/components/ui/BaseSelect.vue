<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Выберите…',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const rootRef = ref(null)
const selectId = computed(() => props.id || `select-${Math.random().toString(36).slice(2, 9)}`)

const selectedOption = computed(() =>
  props.options.find((opt) => opt.value === props.modelValue),
)

const displayLabel = computed(
  () => selectedOption.value?.label ?? props.placeholder,
)

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function select(value) {
  emit('update:modelValue', value)
  open.value = false
}

function onClickOutside(event) {
  if (rootRef.value && !rootRef.value.contains(event.target)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div
    ref="rootRef"
    class="base-select"
    :class="{
      'base-select--open': open,
      'base-select--error': error,
      'base-select--disabled': disabled,
    }"
  >
    <label v-if="label" class="base-select__label" :for="selectId">
      {{ label }}
    </label>
    <div class="base-select__field">
      <button
        :id="selectId"
        type="button"
        class="base-select__trigger"
        :disabled="disabled"
        :aria-expanded="open"
        :aria-haspopup="true"
        @click="toggle"
      >
        <span
          class="base-select__value"
          :class="{ 'base-select__value--placeholder': !selectedOption }"
        >
          {{ displayLabel }}
        </span>
        <BaseIcon name="chevron-down" :size="18" class="base-select__chevron" />
      </button>
      <ul v-if="open" class="base-select__dropdown" role="listbox">
        <li
          v-for="opt in options"
          :key="opt.value"
          role="option"
          class="base-select__option"
          :class="{ 'base-select__option--selected': opt.value === modelValue }"
          :aria-selected="opt.value === modelValue"
          @click="select(opt.value)"
        >
          {{ opt.label }}
        </li>
      </ul>
    </div>
    <p v-if="error" class="base-select__error" role="alert">{{ error }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.base-select {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
  }

  &__field {
    position: relative;
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-3;
    width: 100%;
    padding: $space-3 $space-4;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    background-color: $color-bg-card;
    font-family: inherit;
    font-size: $font-size-base;
    color: $color-text-primary;
    cursor: pointer;
    @include no-select;
    transition: border-color $transition-base, box-shadow $transition-base;

    &:focus-visible {
      @include focus-ring;
    }

    &:disabled {
      background-color: $color-bg-muted;
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  &--open &__trigger {
    border-color: $color-border-focus;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.15);
  }

  &--error &__trigger {
    border-color: $color-error;
  }

  &__value--placeholder {
    color: $color-text-placeholder;
  }

  &__chevron {
    flex-shrink: 0;
    color: $color-text-muted;
    transition: transform $transition-base;
  }

  &--open &__chevron {
    transform: rotate(180deg);
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + #{$space-1});
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    gap: $space-1;
    margin: 0;
    padding: $space-2;
    list-style: none;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    background-color: $color-bg-card;
    box-shadow: $shadow-lg;
    max-height: 240px;
    overflow-y: auto;
  }

  &__option {
    padding: $space-3 $space-4;
    border-radius: $radius-sm;
    font-size: $font-size-sm;
    color: $color-text-primary;
    cursor: pointer;
    transition: background-color $transition-fast;

    &:hover {
      background-color: $color-bg-muted;
    }

    &--selected {
      background-color: $color-primary-light;
      color: $color-primary;
      font-weight: $font-weight-medium;
    }
  }

  &__error {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-error;
  }
}
</style>
