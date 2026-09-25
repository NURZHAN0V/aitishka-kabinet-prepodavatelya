<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import ProfileMenu from './ProfileMenu.vue'
import { BaseAvatar, BaseIcon } from '@/core/components/ui'
import { useAppShell } from '@/core/composables/useAppShell.js'

const props = defineProps({
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
  greeting: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: () => ({
      name: '',
      group: '',
      avatar: '',
    }),
  },
})

const { isDrawerMode, navOpen, toggleNav } = useAppShell()

const firstName = computed(() => props.user.name.trim().split(/\s+/)[0] || 'преподаватель')
const shortName = computed(() => {
  const parts = props.user.name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'Преподаватель'
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[1][0]}.`
})

const profileOpen = ref(false)
const profileRef = ref(null)
const isCoarsePointer = ref(false)

let closeTimer = null
let suppressHoverOpen = false

function syncPointerMode() {
  if (typeof window === 'undefined') return
  isCoarsePointer.value = window.matchMedia('(pointer: coarse)').matches
}

function clearCloseTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

function openProfile() {
  if (isCoarsePointer.value || suppressHoverOpen) return
  clearCloseTimer()
  profileOpen.value = true
}

function scheduleCloseProfile() {
  if (isCoarsePointer.value) return
  clearCloseTimer()
  closeTimer = setTimeout(() => {
    profileOpen.value = false
  }, 180)
}

function toggleProfile() {
  clearCloseTimer()

  if (profileOpen.value) {
    profileOpen.value = false
    suppressHoverOpen = true
    setTimeout(() => {
      suppressHoverOpen = false
    }, 250)
    return
  }

  profileOpen.value = true
}

function closeProfile() {
  clearCloseTimer()
  profileOpen.value = false
}

function onClickOutside(event) {
  if (profileRef.value && !profileRef.value.contains(event.target)) {
    closeProfile()
  }
}

onMounted(() => {
  syncPointerMode()
  document.addEventListener('click', onClickOutside)
  window.matchMedia('(pointer: coarse)').addEventListener?.('change', syncPointerMode)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  clearCloseTimer()
})
</script>

<template>
  <header class="app-header">
    <div class="app-header__start">
      <button
        v-if="isDrawerMode"
        type="button"
        class="app-header__menu-btn"
        :aria-expanded="navOpen"
        aria-controls="app-sidebar-nav"
        aria-label="Открыть меню"
        @click="toggleNav"
      >
        <BaseIcon name="menu-01" :size="22" />
      </button>

      <h1 v-if="greeting" class="app-header__greeting">
        Привет, {{ firstName }}! 👋
      </h1>
      <nav v-else-if="breadcrumbs.length" class="app-header__breadcrumbs" aria-label="Хлебные крошки">
        <template v-for="(crumb, index) in breadcrumbs" :key="index">
          <span v-if="index > 0" class="app-header__sep">→</span>
          <RouterLink
            v-if="crumb.href"
            :to="crumb.href"
            class="app-header__crumb app-header__crumb--link"
          >
            {{ crumb.label }}
          </RouterLink>
          <span v-else class="app-header__crumb">{{ crumb.label }}</span>
        </template>
      </nav>
      <div v-else class="app-header__spacer" />
    </div>

    <div class="app-header__actions">
      <div
        ref="profileRef"
        class="app-header__profile"
        @mouseenter="openProfile"
        @mouseleave="scheduleCloseProfile"
      >
        <button
          type="button"
          class="app-header__profile-trigger app-header__action-block"
          :class="{ 'app-header__profile-trigger--open': profileOpen }"
          :aria-expanded="profileOpen"
          aria-haspopup="menu"
          @click.stop="toggleProfile"
        >
          <BaseAvatar :name="user.name" :src="user.avatar" size="sm" status="online" />
          <span class="app-header__profile-info">
            <span class="app-header__name app-header__name--full">{{ user.name }}</span>
            <span class="app-header__name app-header__name--short">{{ shortName }}</span>
            <span class="app-header__group">{{ user.group }}</span>
          </span>
          <BaseIcon
            name="chevron-down"
            :size="18"
            class="app-header__chevron"
            :class="{ 'app-header__chevron--open': profileOpen }"
          />
        </button>
        <ProfileMenu
          v-if="profileOpen"
          class="app-header__menu"
          @close="closeProfile"
        />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-3;
  min-height: $header-height;
  padding: $space-4 $space-6;
  flex-shrink: 0;

  &__start {
    display: flex;
    align-items: center;
    gap: $space-3;
    min-width: 0;
    flex: 1;
  }

  &__menu-btn {
    @include flex-center;
    @include touch-target;
    @include press-scale(0.96);

    flex-shrink: 0;
    padding: 0;
    border: 1px solid $color-border-light;
    border-radius: $radius-md;
    background-color: $color-bg-card;
    color: $color-text-primary;
    cursor: pointer;

    &:hover {
      background-color: $color-bg-muted;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__greeting {
    margin: 0;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    line-height: $line-height-tight;
    color: $color-text-primary;
    @include truncate;
    @include no-select;
  }

  &__breadcrumbs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: $space-2;
    min-width: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    @include no-select;
  }

  &__sep {
    color: $color-text-muted;
  }

  &__crumb {
    @include truncate;
  }

  &__crumb--link {
    color: $color-text-link;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__spacer {
    flex: 1;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex-shrink: 0;
  }

  &__action-block {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    border-radius: $radius-md;
  }

  &__profile {
    position: relative;
    display: flex;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      right: 0;
      left: 0;
      height: $space-2;
    }
  }

  &__profile-trigger {
    gap: $space-3;
    min-height: $touch-target-min;
    padding: $space-1 $space-2;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: inherit;

    &:hover,
    &--open {
      .app-header__name {
        color: $color-primary;
      }
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__profile-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    min-width: 0;
  }

  &__name {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    transition: color $transition-base;
    @include truncate;
    max-width: 10rem;

    &--short {
      display: none;
    }
  }

  &__group {
    font-size: $font-size-xs;
    color: $color-text-muted;
    @include truncate;
    max-width: 10rem;
  }

  &__chevron {
    flex-shrink: 0;
    color: $color-text-muted;
    transition: transform $transition-base;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__menu {
    position: absolute;
    top: calc(100% + #{$space-2});
    right: 0;
    z-index: 100;
    max-width: calc(100vw - #{$space-6});
  }

  @include media-tablet-down {
    padding: $space-3 $space-4;
    gap: $space-2;

    &__greeting {
      font-size: $font-size-xl;
    }

    &__actions {
      gap: $space-2;
    }

    &__name--full {
      display: none;
    }

    &__name--short {
      display: block;
    }

    &__group {
      display: none;
    }

    &__chevron {
      display: none;
    }
  }

  @include media-phone {
    &__breadcrumbs {
      display: none;
    }

    &__greeting {
      display: none;
    }
  }
}
</style>
