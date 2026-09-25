<script setup>
import BaseConfirm from './BaseConfirm.vue'
import { confirmState, useConfirm } from '@/core/composables/useConfirm'

const { handleConfirm, handleCancel } = useConfirm()
</script>

<template>
  <BaseConfirm
    v-if="confirmState"
    :model-value="!!confirmState"
    :title="confirmState.title"
    :message="confirmState.message"
    :confirm-text="confirmState.confirmText"
    :cancel-text="confirmState.cancelText"
    :variant="confirmState.variant"
    :close-on-overlay="confirmState.closeOnOverlay"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>
