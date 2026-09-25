<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  placement: {
    type: String,
    default: 'right',
    validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const TOOLTIP_GAP = 8

const triggerRef = ref(null)
const visible = ref(false)
const popupStyle = ref({})

function updatePosition() {
  const el = triggerRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()

  switch (props.placement) {
    case 'right':
      popupStyle.value = {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.right + TOOLTIP_GAP}px`,
        transform: 'translateY(-50%)',
      }
      break
    case 'left':
      popupStyle.value = {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.left - TOOLTIP_GAP}px`,
        transform: 'translate(-100%, -50%)',
      }
      break
    case 'top':
      popupStyle.value = {
        top: `${rect.top - TOOLTIP_GAP}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translate(-50%, -100%)',
      }
      break
    case 'bottom':
      popupStyle.value = {
        top: `${rect.bottom + TOOLTIP_GAP}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)',
      }
      break
    default:
      break
  }
}

function show() {
  if (props.disabled) return
  updatePosition()
  visible.value = true
}

function hide() {
  visible.value = false
}

watch(
  () => props.disabled,
  (isDisabled) => {
    if (isDisabled) hide()
  },
)

function onViewportChange() {
  if (visible.value) {
    updatePosition()
  }
}

onMounted(() => {
  window.addEventListener('scroll', onViewportChange, true)
  window.addEventListener('resize', onViewportChange)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onViewportChange, true)
  window.removeEventListener('resize', onViewportChange)
})
</script>

<template>
  <span
    ref="triggerRef"
    class="base-tooltip"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <Teleport to="body">
      <span
        v-if="!disabled"
        class="base-tooltip__popup"
        :class="{ 'base-tooltip__popup--visible': visible }"
        role="tooltip"
        :style="popupStyle"
      >
        {{ text }}
      </span>
    </Teleport>
  </span>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.base-tooltip {
  display: inline-flex;
  @include no-select;
}
</style>

<style lang="scss">
@use '@/assets/styles/tokens' as *;

.base-tooltip__popup {
  position: fixed;
  z-index: 5000;
  padding: $space-2 $space-3;
  border-radius: $radius-md;
  background-color: $color-text-primary;
  color: $color-text-inverse;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  line-height: $line-height-tight;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity $transition-fast, visibility $transition-fast;
  box-shadow: $shadow-md;

  &--visible {
    opacity: 1;
    visibility: visible;
  }
}
</style>
