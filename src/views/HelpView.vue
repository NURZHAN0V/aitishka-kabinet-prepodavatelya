<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { BaseCard, BaseIcon } from '@/core/components/ui'
import { HELP_FAQ } from '@/modules/help/constants/help.js'
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Помощь' }]"
    active-route="help"
  >
    <div class="help-view">
      <header class="help-view__header">
        <h1 class="help-view__title">Помощь</h1>
        <p class="help-view__subtitle">Краткие ответы на частые вопросы</p>
      </header>

      <BaseCard padding="md">
        <template #title>Частые вопросы</template>
        <div class="help-faq">
          <details v-for="item in HELP_FAQ" :key="item.id" class="help-faq__item">
            <summary class="help-faq__question">
              <span>{{ item.question }}</span>
              <BaseIcon name="chevron-down" :size="18" class="help-faq__chevron" />
            </summary>
            <p class="help-faq__answer">{{ item.answer }}</p>
          </details>
        </div>
      </BaseCard>

      <BaseCard padding="md">
        <template #title>Контакты учебной части</template>
        <p class="help-view__contact">
          По вопросам доступа, пароля и исправлений в журнале после срока редактирования —
          напишите в учебную часть: <strong>office@itcampsochi.ru</strong>
        </p>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.help-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
  max-width: 720px;
}

.help-view__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.help-view__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.help-faq {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.help-faq__item {
  border-radius: $radius-card;
  background: $color-bg-muted;
  overflow: hidden;

  &[open] .help-faq__chevron {
    transform: rotate(180deg);
  }
}

.help-faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-3;
  padding: $space-3 $space-4;
  cursor: pointer;
  list-style: none;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  user-select: none;

  &::-webkit-details-marker {
    display: none;
  }
}

.help-faq__chevron {
  flex-shrink: 0;
  color: $color-text-muted;
  transition: transform $transition-fast;
}

.help-faq__answer {
  margin: 0;
  padding: 0 $space-4 $space-4;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: $line-height-base;
}

.help-view__contact {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: $line-height-base;

  strong {
    color: $color-text-primary;
  }
}
</style>
