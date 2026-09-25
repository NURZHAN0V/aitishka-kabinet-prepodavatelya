import { ref } from 'vue'

const confirmState = ref(null)

export function useConfirm() {
  function confirm(options = {}) {
    return new Promise((resolve) => {
      confirmState.value = {
        title: options.title ?? 'Подтвердите действие',
        message: options.message ?? '',
        confirmText: options.confirmText ?? 'Подтвердить',
        cancelText: options.cancelText ?? 'Отмена',
        variant: options.variant ?? 'primary',
        closeOnOverlay: options.closeOnOverlay ?? true,
        resolve,
      }
    })
  }

  function handleConfirm() {
    confirmState.value?.resolve(true)
    confirmState.value = null
  }

  function handleCancel() {
    confirmState.value?.resolve(false)
    confirmState.value = null
  }

  return { confirmState, confirm, handleConfirm, handleCancel }
}

export { confirmState }
