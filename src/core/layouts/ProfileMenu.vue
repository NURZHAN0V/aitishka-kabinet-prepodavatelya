<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { BaseIcon } from '@/core/components/ui'

const emit = defineEmits(['close'])
const route = useRoute()

const menuItems = [
  {
    id: 'profile',
    label: 'Мой профиль',
    icon: 'user',
    href: '/profile',
    routeName: 'profile',
  },
  {
    id: 'settings',
    label: 'Настройки аккаунта',
    icon: 'settings-01',
    href: '/settings',
    routeName: 'settings',
  },
  {
    id: 'help',
    label: 'Помощь и поддержка',
    icon: 'help-circle',
    href: '/help',
    routeName: 'help',
  },
]

function isInternalHref(href) {
  return typeof href === 'string' && href.startsWith('/')
}

function isItemActive(item) {
  if (item.routeName) {
    return route.name === item.routeName
  }
  return isInternalHref(item.href) && route.path === item.href
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="profile-menu" @click.stop>
    <nav class="profile-menu__nav" aria-label="Меню профиля">
      <component
        :is="isInternalHref(item.href) ? RouterLink : 'a'"
        v-for="item in menuItems"
        :key="item.id"
        v-bind="isInternalHref(item.href) ? { to: item.href } : { href: item.href }"
        class="profile-menu__link"
        :class="{ 'profile-menu__link--active': isItemActive(item) }"
        @click="emit('close')"
      >
        <span class="profile-menu__icon-slot">
          <BaseIcon :name="item.icon" :size="22" class="profile-menu__icon" :label="item.label" />
        </span>
        {{ item.label }}
      </component>
    </nav>

    <footer class="profile-menu__footer">
      <button type="button" class="profile-menu__logout" @click="emit('close')">
        <span class="profile-menu__icon-slot">
          <BaseIcon name="logout-01" :size="22" class="profile-menu__icon" label="Выйти из аккаунта" />
        </span>
        Выйти из аккаунта
      </button>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.profile-menu {
  width: min(280px, calc(100vw - #{$space-6}));
  padding: $space-2;
  border-radius: $radius-card;
  background-color: $color-bg-card;
  box-shadow: $shadow-lg;
  border: 1px solid $color-border-light;

  &__nav {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    padding: $space-1 0;
  }

  &__link,
  &__logout {
    display: flex;
    align-items: center;
    gap: $space-3;
    height: 48px;
    padding: 0 $space-4;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    transition: background-color $transition-fast;
  }

  &__link {
    color: $color-text-primary;
    text-decoration: none;

    &:hover {
      background-color: $color-bg-muted;
    }

    &--active {
      background-color: $color-primary-light;
      color: $color-primary;
      font-weight: $font-weight-medium;
    }
  }

  &__icon-slot {
    @include flex-center;

    flex-shrink: 0;
    width: 28px;
    height: 28px;
    color: currentColor;
  }

  &__icon {
    flex-shrink: 0;
  }

  &__footer {
    padding-top: $space-2;
    border-top: 1px solid $color-border-light;
  }

  &__logout {
    width: 100%;
    border: none;
    background: transparent;
    color: $color-error;
    font-family: inherit;
    font-weight: $font-weight-medium;
    cursor: pointer;

    &:hover {
      background-color: $color-error-light;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}
</style>
