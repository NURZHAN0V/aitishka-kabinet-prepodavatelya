import { ref } from 'vue'

const toasts = ref([])
let nextId = 1

export function useToast() {
  function show({ message, variant = 'info', duration = 4000 }) {
    const id = nextId++
    toasts.value.push({ id, message, variant, duration })
    return id
  }

  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(message, duration) {
    return show({ message, variant: 'success', duration })
  }

  function error(message, duration) {
    return show({ message, variant: 'error', duration })
  }

  function info(message, duration) {
    return show({ message, variant: 'info', duration })
  }

  return { toasts, show, dismiss, success, error, info }
}

export { toasts }
