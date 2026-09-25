<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { BaseCard, BaseIcon, BaseInput, BaseButton } from '@/core/components/ui'

const blockedMessage = 'Обратитесь в учебную часть'
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Настройки' }]"
    active-route="settings"
  >
    <div class="settings-view">
      <header class="settings-view__header">
        <h1 class="settings-view__title">Настройки</h1>
        <p class="settings-view__subtitle">Безопасность аккаунта</p>
      </header>

      <BaseCard padding="md" class="settings-view__card">
        <template #title>Смена пароля</template>
        <div class="settings-view__blocked" role="status">
          <BaseIcon name="info-circle" :size="22" />
          <div>
            <p class="settings-view__blocked-title">Самостоятельная смена пароля недоступна</p>
            <p class="settings-view__blocked-text">{{ blockedMessage }}</p>
          </div>
        </div>

        <div class="settings-view__form">
          <BaseInput label="Текущий пароль" type="password" model-value="" disabled />
          <BaseInput label="Новый пароль" type="password" model-value="" disabled />
          <BaseInput label="Повтор нового пароля" type="password" model-value="" disabled />
          <BaseButton variant="primary" disabled>Сохранить пароль</BaseButton>
        </div>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.settings-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.settings-view__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.settings-view__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.settings-view__card {
  max-width: 520px;
}

.settings-view__blocked {
  display: flex;
  gap: $space-3;
  align-items: flex-start;
  margin-bottom: $space-5;
  padding: $space-4;
  border-radius: $radius-md;
  background: $color-warning-light;
  color: $color-warning-hover;
}

.settings-view__blocked-title {
  margin: 0 0 $space-1;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
}

.settings-view__blocked-text {
  margin: 0;
  font-size: $font-size-sm;
}

.settings-view__form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}
</style>
