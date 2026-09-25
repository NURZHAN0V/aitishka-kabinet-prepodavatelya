<script setup>
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  accept: {
    type: String,
    default: '*/*',
  },
  maxSize: {
    type: Number,
    default: 10 * 1024 * 1024,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  uploading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'error'])

const isDragging = ref(false)
const inputRef = ref(null)

function validateFile(file) {
  if (file.size > props.maxSize) {
    const mb = Math.round(props.maxSize / (1024 * 1024))
    emit('error', `Файл слишком большой. Максимум ${mb} МБ`)
    return false
  }
  return true
}

function setFile(file) {
  if (!file) return
  if (validateFile(file)) {
    emit('update:modelValue', file)
    emit('error', '')
  }
}

function onDrop(event) {
  event.preventDefault()
  isDragging.value = false
  if (props.disabled || props.uploading) return
  const file = event.dataTransfer?.files?.[0]
  setFile(file)
}

function onDragOver(event) {
  event.preventDefault()
  if (!props.disabled && !props.uploading) {
    isDragging.value = true
  }
}

function onDragLeave() {
  isDragging.value = false
}

function onFileChange(event) {
  const file = event.target.files?.[0]
  setFile(file)
  event.target.value = ''
}

function openPicker() {
  if (!props.disabled && !props.uploading) {
    inputRef.value?.click()
  }
}

function removeFile() {
  emit('update:modelValue', null)
  emit('error', '')
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}
</script>

<template>
  <div
    class="base-file-upload"
    :class="{
      'base-file-upload--dragging': isDragging,
      'base-file-upload--disabled': disabled || uploading,
      'base-file-upload--has-file': modelValue,
    }"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
  >
    <input
      ref="inputRef"
      type="file"
      class="base-file-upload__input"
      :accept="accept"
      :disabled="disabled || uploading"
      @change="onFileChange"
    />

    <template v-if="!modelValue">
      <BaseIcon name="upload-01" :size="40" class="base-file-upload__icon" />
      <p class="base-file-upload__text">
        Перетащите файл сюда или
      </p>
      <BaseButton
        variant="secondary"
        size="sm"
        :disabled="disabled || uploading"
        @click="openPicker"
      >
        Выбрать файл
      </BaseButton>
    </template>

    <template v-else>
      <BaseIcon name="clipboard" :size="32" class="base-file-upload__icon" />
      <p class="base-file-upload__filename">{{ modelValue.name }}</p>
      <p class="base-file-upload__meta">{{ formatSize(modelValue.size) }}</p>
      <BaseButton
        v-if="!uploading"
        variant="link"
        size="sm"
        @click="removeFile"
      >
        Удалить
      </BaseButton>
      <p v-else class="base-file-upload__uploading">Загрузка…</p>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.base-file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
  padding: $space-8 $space-6;
  border: 2px dashed $color-border;
  border-radius: $radius-card;
  background-color: $color-bg-muted;
  text-align: center;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: border-color $transition-base, background-color $transition-base;

  &--dragging {
    border-color: $color-primary;
    background-color: $color-primary-light;
  }

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &--has-file {
    border-style: solid;
    background-color: $color-bg-card;
  }

  &__input {
    display: none;
  }

  &__icon {
    color: $color-primary;
  }

  &__text {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__filename {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
    word-break: break-all;
  }

  &__meta,
  &__uploading {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }
}
</style>
