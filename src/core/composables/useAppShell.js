import { readonly, ref, watch } from 'vue'

/** Совпадает с `$bp-tablet` в tokens — ниже этого сайдбар становится drawer. */
export const APP_SHELL_TABLET_MQ = `(max-width: 900px)`

const navOpen = ref(false)
const isDrawerMode = ref(false)

let initialized = false
let bodyOverflowLocked = false

function lockBodyScroll(lock) {
  if (typeof document === 'undefined') return
  if (lock && !bodyOverflowLocked) {
    document.body.style.overflow = 'hidden'
    bodyOverflowLocked = true
  } else if (!lock && bodyOverflowLocked) {
    document.body.style.overflow = ''
    bodyOverflowLocked = false
  }
}

function blurSidebarFocus() {
  if (typeof document === 'undefined') return
  const active = document.activeElement
  if (active instanceof HTMLElement && active.closest('.app-sidebar')) {
    active.blur()
  }
}

function syncDrawerMode(matches) {
  isDrawerMode.value = matches
  if (!matches) {
    blurSidebarFocus()
    navOpen.value = false
  }
}

function ensureInit() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  const mediaQuery = window.matchMedia(APP_SHELL_TABLET_MQ)
  syncDrawerMode(mediaQuery.matches)

  const mediaHandler = (event) => {
    syncDrawerMode(event.matches)
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', mediaHandler)
  } else {
    mediaQuery.addListener(mediaHandler)
  }

  watch([navOpen, isDrawerMode], ([open, drawer]) => {
    lockBodyScroll(open && drawer)
  })
}

/**
 * Оболочка приложения: drawer-навигация на телефоне/планшете.
 * Состояние общее для AppLayout / AppHeader / AppSidebar.
 */
export function useAppShell() {
  ensureInit()

  function openNav() {
    if (!isDrawerMode.value) return
    navOpen.value = true
  }

  function closeNav() {
    blurSidebarFocus()
    navOpen.value = false
  }

  function toggleNav() {
    if (!isDrawerMode.value) return
    if (navOpen.value) {
      closeNav()
    } else {
      openNav()
    }
  }

  return {
    navOpen: readonly(navOpen),
    isDrawerMode: readonly(isDrawerMode),
    openNav,
    closeNav,
    toggleNav,
  }
}
