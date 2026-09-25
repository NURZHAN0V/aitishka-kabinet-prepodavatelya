<script setup>
import { computed } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseTooltip from './BaseTooltip.vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  prevLabel: {
    type: String,
    required: true,
  },
  nextLabel: {
    type: String,
    required: true,
  },
  currentLabel: {
    type: String,
    required: true,
  },
  withTooltips: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['prev', 'next', 'current'])

/** Long “current” CTAs (e.g. «Текущая неделя») get a full-width bar under the date row on phone. */
const stackCurrent = computed(() => props.currentLabel.length > 10)
</script>

<template>
  <div
    class="period-nav"
    :class="{ 'period-nav--stack-current': stackCurrent }"
    role="group"
    :aria-label="label"
  >
    <BaseTooltip v-if="withTooltips" :text="prevLabel" placement="bottom">
      <button
        type="button"
        class="period-nav__btn"
        :aria-label="prevLabel"
        @click="$emit('prev')"
      >
        <BaseIcon name="chevron-left" :size="18" />
      </button>
    </BaseTooltip>
    <button
      v-else
      type="button"
      class="period-nav__btn"
      :aria-label="prevLabel"
      @click="$emit('prev')"
    >
      <BaseIcon name="chevron-left" :size="18" />
    </button>

    <span class="period-nav__label">
      <BaseIcon name="calendar-03" :size="18" />
      <span class="period-nav__label-text">{{ label }}</span>
    </span>

    <BaseTooltip v-if="withTooltips" :text="nextLabel" placement="bottom">
      <button
        type="button"
        class="period-nav__btn"
        :aria-label="nextLabel"
        @click="$emit('next')"
      >
        <BaseIcon name="chevron-right" :size="18" />
      </button>
    </BaseTooltip>
    <button
      v-else
      type="button"
      class="period-nav__btn"
      :aria-label="nextLabel"
      @click="$emit('next')"
    >
      <BaseIcon name="chevron-right" :size="18" />
    </button>

    <BaseButton
      class="period-nav__current"
      variant="secondary"
      size="sm"
      @click="$emit('current')"
    >
      {{ currentLabel }}
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.period-nav {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: $space-1;
  height: 36px;
  min-width: 0;

  :deep(.base-tooltip) {
    display: inline-flex;
    align-items: center;
    height: 100%;
  }

  :deep(.base-button--sm) {
    height: 36px;
    min-height: 36px;
    box-sizing: border-box;
  }

  &__btn {
    @include flex-center;

    box-sizing: border-box;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    background-color: $color-bg-card;
    color: $color-text-secondary;
    cursor: pointer;
    @include press-scale(0.94);
    transition: transform $transition-press, border-color $transition-base, color $transition-base,
      background-color $transition-base;

    &:hover {
      border-color: $color-primary-muted;
      color: $color-primary;
      background-color: $color-primary-light;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    height: 100%;
    min-width: 0;
    padding-inline: $space-1;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    line-height: 1;
    color: $color-text-primary;
    white-space: nowrap;

    :deep(.base-icon) {
      display: block;
      flex-shrink: 0;
      line-height: 0;
    }
  }

  &__label-text {
    @include truncate;
  }

  /* Phone: one balanced row — [‹] date [›] [Сегодня], full width, no orphan cluster */
  @include media-phone {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    column-gap: $space-2;
    row-gap: $space-2;
    width: 100%;
    height: auto;
    min-height: $touch-target-min;

    :deep(.base-tooltip) {
      height: auto;
    }

    &__btn {
      width: $touch-target-min;
      height: $touch-target-min;
    }

    &__label {
      width: 100%;
      height: $touch-target-min;
      justify-content: center;
    }

    :deep(.period-nav__current) {
      height: $touch-target-min;
      min-height: $touch-target-min;
      padding-inline: $space-3;
      white-space: nowrap;
    }

    &--stack-current {
      grid-template-columns: auto minmax(0, 1fr) auto;

      :deep(.period-nav__current) {
        grid-column: 1 / -1;
        width: 100%;
        justify-content: center;
      }
    }
  }
}
</style>
