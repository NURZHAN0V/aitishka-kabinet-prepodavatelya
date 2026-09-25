<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  tabs: {
    type: Array,
    default: () => [],
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md'].includes(v),
  },
})

const emit = defineEmits(['update:modelValue'])

const tabsRoot = ref(null)
const tabRefs = ref({})
const gliderStyle = ref({
  width: '0px',
  height: '0px',
  transform: 'translate(0, 0)',
  opacity: '0',
})

const activeTab = computed({
  get: () => props.modelValue || props.tabs[0]?.id || '',
  set: (value) => emit('update:modelValue', value),
})

let resizeObserver = null

function setTabRef(id) {
  return (el) => {
    if (el) {
      tabRefs.value[id] = el
    } else {
      delete tabRefs.value[id]
    }
  }
}

function updateGlider() {
  const root = tabsRoot.value
  const activeEl = tabRefs.value[activeTab.value]

  if (!root || !activeEl) {
    gliderStyle.value = {
      ...gliderStyle.value,
      opacity: '0',
    }
    return
  }

  const rootRect = root.getBoundingClientRect()
  const tabRect = activeEl.getBoundingClientRect()

  gliderStyle.value = {
    width: `${tabRect.width}px`,
    height: `${tabRect.height}px`,
    transform: `translate(${tabRect.left - rootRect.left}px, ${tabRect.top - rootRect.top}px)`,
    opacity: '1',
  }
}

function selectTab(id) {
  activeTab.value = id
}

watch(activeTab, () => {
  nextTick(updateGlider)
})

watch(
  () => props.tabs,
  () => {
    nextTick(updateGlider)
  },
  { deep: true },
)

onMounted(() => {
  nextTick(updateGlider)

  if (tabsRoot.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => updateGlider())
    resizeObserver.observe(tabsRoot.value)
  }

  window.addEventListener('resize', updateGlider)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updateGlider)
})
</script>

<template>
  <div
    ref="tabsRoot"
    class="base-tabs"
    :class="`base-tabs--${size}`"
    role="tablist"
  >
    <span
      class="base-tabs__glider"
      aria-hidden="true"
      :style="gliderStyle"
    />

    <button
      v-for="tab in tabs"
      :key="tab.id"
      :ref="setTabRef(tab.id)"
      type="button"
      role="tab"
      class="base-tabs__tab"
      :class="{ 'base-tabs__tab--active': activeTab === tab.id }"
      :aria-selected="activeTab === tab.id"
      @click="selectTab(tab.id)"
    >
      {{ tab.label }}
      <span v-if="tab.count != null" class="base-tabs__count">{{ tab.count }}</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.base-tabs {
  position: relative;
  display: inline-flex;
  flex-wrap: wrap;
  gap: $space-2;
  padding: $space-1;
  border-radius: $radius-md;
  background-color: $color-bg-muted;
  @include no-select;

  &__glider {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    border-radius: $radius-md;
    background: $gradient-primary;
    box-shadow: $shadow-sm;
    pointer-events: none;
    transition:
      transform 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      width 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      height 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      opacity $transition-fast;
    will-change: transform, width, height;
  }

  &--sm &__tab {
    padding: $space-2 $space-3;
    font-size: $font-size-xs;
  }

  &--md &__tab {
    padding: $space-2 $space-4;
    font-size: $font-size-sm;
  }

  &__tab {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    border: 1px solid transparent;
    border-radius: $radius-md;
    background: transparent;
    color: $color-text-secondary;
    font-family: inherit;
    font-weight: $font-weight-medium;
    cursor: pointer;
    @include press-scale(0.95);
    transition: transform $transition-press, color $transition-base;

    &:hover:not(&--active) {
      color: $color-text-primary;
      background-color: $color-bg-card;
    }

    &:focus-visible {
      @include focus-ring;
    }

    &--active {
      color: $color-text-inverse;
    }
  }

  &__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 $space-1;
    border-radius: $radius-chip;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    background-color: rgba(255, 255, 255, 0.25);
  }

  &__tab:not(&__tab--active) &__count {
    background-color: $color-bg-muted;
    color: $color-text-secondary;
  }
}
</style>
