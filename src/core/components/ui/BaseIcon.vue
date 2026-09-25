<script setup>
import { computed } from 'vue'
import { getAvifIcon, getSvgIcon } from '@/utils/icons'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'svg',
    validator: (v) => ['svg', 'avif'].includes(v),
  },
  size: {
    type: [String, Number],
    default: 24,
  },
  label: {
    type: String,
    default: '',
  },
})

const sizeValue = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
)

const svgContent = computed(() =>
  props.type === 'svg' ? getSvgIcon(props.name) : null,
)

const avifSrc = computed(() =>
  props.type === 'avif' ? getAvifIcon(props.name) : null,
)

const hasIcon = computed(() =>
  props.type === 'avif' ? !!avifSrc.value : !!svgContent.value,
)
</script>

<template>
  <span
    class="base-icon"
    :style="{ width: sizeValue, height: sizeValue }"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : true"
  >
    <img
      v-if="type === 'avif' && avifSrc"
      class="base-icon__img"
      :src="avifSrc"
      :alt="label || ''"
    />
    <span
      v-else-if="type === 'svg' && svgContent"
      class="base-icon__svg"
      v-html="svgContent"
    />
    <span v-else class="base-icon__fallback" :title="name">?</span>
  </span>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.base-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: currentColor;

  &__svg {
    display: flex;
    width: 100%;
    height: 100%;

    :deep(svg) {
      width: 100%;
      height: 100%;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: $radius-sm;
    background-color: $color-bg-muted;
    color: $color-text-muted;
    font-size: 0.65em;
    font-weight: $font-weight-bold;
  }
}
</style>
