<script setup>
defineProps({
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  variant: {
    type: String,
    default: 'default',
    validator: (v) =>
      ['default', 'gradient-purple', 'gradient-green', 'gradient-orange', 'gradient-blue'].includes(v),
  },
})
</script>

<template>
  <article
    class="base-card"
    :class="[`base-card--padding-${padding}`, `base-card--${variant}`]"
  >
    <header v-if="$slots.title || $slots.header" class="base-card__header">
      <slot name="header">
        <h3 v-if="$slots.title" class="base-card__title">
          <slot name="title" />
        </h3>
      </slot>
    </header>
    <div class="base-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.base-card {
  @include card-surface;

  &--padding-sm {
    padding: $space-4;
  }

  &--padding-md {
    padding: $space-5;
  }

  &--padding-lg {
    padding: $space-6;
  }

  &--gradient-purple {
    background: $gradient-primary;
    color: $color-text-inverse;
    border-color: transparent;
    box-shadow: none;

    .base-card__title,
    .base-card__body {
      color: $color-text-inverse;
    }

    .base-card__footer {
      border-top-color: rgba(255, 255, 255, 0.2);
    }
  }

  &--gradient-green {
    background: $gradient-green;
    color: $color-text-inverse;
    border-color: transparent;
    box-shadow: none;

    .base-card__title,
    .base-card__body {
      color: $color-text-inverse;
    }

    .base-card__footer {
      border-top-color: rgba(255, 255, 255, 0.2);
    }
  }

  &--gradient-orange {
    background: $gradient-orange;
    color: $color-text-inverse;
    border-color: transparent;
    box-shadow: none;

    .base-card__title,
    .base-card__body {
      color: $color-text-inverse;
    }

    .base-card__footer {
      border-top-color: rgba(255, 255, 255, 0.2);
    }
  }

  &--gradient-blue {
    background: $gradient-blue;
    color: $color-text-inverse;
    border-color: transparent;
    box-shadow: none;

    .base-card__title,
    .base-card__body {
      color: $color-text-inverse;
    }

    .base-card__footer {
      border-top-color: rgba(255, 255, 255, 0.2);
    }
  }

  &__header {
    margin-bottom: $space-4;
    @include no-select;
  }

  &__title {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__body {
    color: $color-text-secondary;
  }

  &--default &__body {
    color: $color-text-secondary;
  }

  &__footer {
    margin-top: $space-4;
    padding-top: $space-4;
    border-top: 1px solid $color-border-light;
    @include no-select;
  }
}
</style>
