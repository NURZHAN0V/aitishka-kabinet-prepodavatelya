<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
  ariaLabel: {
    type: String,
    default: 'Слайдер',
  },
  itemKey: {
    type: String,
    default: 'id',
  },
  rounded: {
    type: Boolean,
    default: true,
  },
  allowOverflow: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const activeIndex = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const hasMultipleSlides = computed(() => props.items.length > 1)

function getItemKey(item, index) {
  return item?.[props.itemKey] ?? index
}

function getDotLabel(item, index) {
  return item?.ariaLabel ?? `Слайд ${index + 1}`
}

function goToSlide(index) {
  if (index >= 0 && index < props.items.length) {
    activeIndex.value = index
  }
}
</script>

<template>
  <section
    class="base-slider"
    aria-roledescription="carousel"
    :aria-label="ariaLabel"
  >
    <div
      class="base-slider__viewport"
      :class="{
        'base-slider__viewport--rounded': rounded,
        'base-slider__viewport--overflow': allowOverflow,
      }"
    >
      <div
        class="base-slider__track"
        :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
      >
        <div
          v-for="(item, index) in items"
          :key="getItemKey(item, index)"
          class="base-slider__slide"
          :aria-hidden="hasMultipleSlides && index !== activeIndex ? true : undefined"
          :aria-current="hasMultipleSlides && index === activeIndex ? 'true' : undefined"
        >
          <slot
            name="slide"
            :item="item"
            :index="index"
            :active="index === activeIndex"
          />
        </div>
      </div>
    </div>

    <div
      v-if="hasMultipleSlides"
      class="base-slider__dots"
      role="tablist"
      aria-label="Выбор слайда"
    >
      <button
        v-for="(item, index) in items"
        :key="`${getItemKey(item, index)}-dot`"
        type="button"
        class="base-slider__dot"
        :class="{ 'base-slider__dot--active': index === activeIndex }"
        role="tab"
        :aria-selected="index === activeIndex"
        :aria-label="getDotLabel(item, index)"
        @click="goToSlide(index)"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.base-slider {
  &__viewport {
    overflow: hidden;

    &--rounded {
      border-radius: $radius-card;
    }

    &--overflow {
      overflow: visible;
    }
  }

  &__track {
    display: flex;
    transition: transform $transition-sidebar;
  }

  &__slide {
    flex: 0 0 100%;
    min-width: 0;
  }

  &__dots {
    display: flex;
    justify-content: center;
    gap: $space-2;
    margin-top: $space-3;
  }

  &__dot {
    width: 8px;
    height: 8px;
    padding: 0;
    border: none;
    border-radius: $radius-chip;
    background-color: $color-border;
    cursor: pointer;
    transition: background-color $transition-fast, transform $transition-fast;

    &--active {
      background-color: $color-primary;
      transform: scale(1.15);
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}
</style>
