<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import { BaseConfirmContainer, BaseToastContainer } from '@/core/components/ui'
import { useAppShell } from '@/core/composables/useAppShell.js'
import { TEACHER_USER } from '@/modules/home/constants/dossier.js'

const props = defineProps({
  showShell: {
    type: Boolean,
    default: true,
  },
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
  user: {
    type: Object,
    default: null,
  },
  activeRoute: {
    type: String,
    default: 'home',
  },
  greeting: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const { navOpen, isDrawerMode, closeNav } = useAppShell()

const displayUser = computed(() => ({
  name: props.user?.name || TEACHER_USER.name,
  group: props.user?.group || TEACHER_USER.role,
  avatar: props.user?.avatar || TEACHER_USER.avatar,
}))

watch(
  () => route.fullPath,
  () => {
    closeNav()
  },
)
</script>

<template>
  <div
    class="app-layout"
    :class="{
      'app-layout--drawer': isDrawerMode,
      'app-layout--nav-open': navOpen,
    }"
  >
    <div
      v-if="showShell && isDrawerMode && navOpen"
      class="app-layout__nav-overlay"
      aria-hidden="true"
      @click="closeNav"
    />

    <AppSidebar v-if="showShell" :active-route="activeRoute" />

    <div class="app-layout__main">
      <div class="app-layout__panel">
        <AppHeader
          v-if="showShell"
          :breadcrumbs="breadcrumbs"
          :greeting="greeting"
          :user="displayUser"
        />
        <main class="app-layout__content">
          <slot />
        </main>
      </div>
    </div>
    <BaseToastContainer />
    <BaseConfirmContainer />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.app-layout {
  display: flex;
  height: 100dvh;
  height: 100vh;
  overflow: hidden;
  background-color: $color-bg-page;
  padding-top: env(safe-area-inset-top, 0);
  padding-bottom: env(safe-area-inset-bottom, 0);

  &__nav-overlay {
    position: fixed;
    inset: 0;
    z-index: 900;
    background-color: $color-bg-overlay;
  }

  &__main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    padding: $space-4 $space-4 $space-4 $space-2;
    overflow: hidden;
  }

  &__panel {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    border: 1px solid $color-border-light;
    border-radius: $radius-2xl;
    background-color: $color-bg-card;
    box-shadow: none;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  @include media-tablet-down {
    &--drawer {
      .app-layout__main {
        padding: $space-2;
      }

      .app-layout__panel {
        border-radius: $radius-xl;
      }
    }
  }

  @include media-phone {
    &--drawer {
      .app-layout__main {
        padding: 0;
      }

      .app-layout__panel {
        border-radius: 0;
      }
    }
  }
}
</style>
