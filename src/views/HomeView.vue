<script setup>
import { computed } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import { BaseAvatar, BaseCard, BaseIcon } from '@/core/components/ui'
import DossierKpiCard from '@/modules/home/components/DossierKpiCard.vue'
import { TEACHER_USER, DOSSIER_KPIS } from '@/modules/home/constants/dossier.js'

const startDateLabel = computed(() => {
  const date = new Date(TEACHER_USER.startDate)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const phoneHref = computed(() =>
  `tel:${TEACHER_USER.phone.replace(/[\s()-]/g, '')}`,
)
</script>

<template>
  <AppLayout greeting active-route="home">
    <div class="page">
      <BaseCard class="profile" padding="lg">
        <div class="profile__inner">
          <BaseAvatar
            :name="TEACHER_USER.name"
            :src="TEACHER_USER.avatar"
            size="xl"
          />
          <div class="profile__info">
            <p class="profile__role">{{ TEACHER_USER.role }}</p>
            <h1 class="profile__name">{{ TEACHER_USER.name }}</h1>
            <dl class="profile__meta">
              <div class="profile__meta-item">
                <dt>
                  <BaseIcon name="info-circle" :size="16" />
                  Почта
                </dt>
                <dd>
                  <a :href="`mailto:${TEACHER_USER.email}`">{{ TEACHER_USER.email }}</a>
                </dd>
              </div>
              <div class="profile__meta-item">
                <dt>
                  <BaseIcon name="info-circle" :size="16" />
                  Телефон
                </dt>
                <dd>
                  <a :href="phoneHref">
                    {{ TEACHER_USER.phone }}
                  </a>
                </dd>
              </div>
              <div class="profile__meta-item">
                <dt>
                  <BaseIcon name="calendar-03" :size="16" />
                  В школе с
                </dt>
                <dd>{{ startDateLabel }}</dd>
              </div>
              <div class="profile__meta-item profile__meta-item--subjects">
                <dt>
                  <BaseIcon name="book-02" :size="16" />
                  Предметы
                </dt>
                <dd>
                  <ul class="profile__subjects">
                    <li v-for="subject in TEACHER_USER.subjects" :key="subject">
                      {{ subject }}
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </BaseCard>

      <section class="kpis" aria-label="Ключевые показатели">
        <header class="kpis__header">
          <h2 class="kpis__title">Досье</h2>
          <p class="kpis__hint">Динамика относительно прошлого месяца</p>
        </header>
        <div class="kpis__grid">
          <DossierKpiCard
            v-for="kpi in DOSSIER_KPIS"
            :key="kpi.id"
            :kpi="kpi"
          />
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.page {
  padding: $space-4 $space-6 $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.profile {
  &__inner {
    display: flex;
    gap: $space-6;
    align-items: flex-start;
  }

  &__role {
    margin: 0 0 $space-1;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-primary;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__name {
    margin: 0 0 $space-4;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $space-4 $space-6;
    margin: 0;
  }

  &__meta-item {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    min-width: 0;

    dt {
      display: inline-flex;
      align-items: center;
      gap: $space-2;
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;
      color: $color-text-muted;
    }

    dd {
      margin: 0;
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;

      a {
        color: inherit;
        text-decoration: none;

        &:hover {
          color: $color-primary;
        }
      }
    }
  }

  &__subjects {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      padding: $space-1 $space-3;
      border-radius: $radius-chip;
      background: $color-primary-light;
      color: $color-primary;
      font-size: $font-size-xs;
      font-weight: $font-weight-semibold;
    }
  }
}

.kpis {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: $space-2 $space-4;
  }

  &__title {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__hint {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: $space-4;
  }
}

@include media-tablet-down {
  .page {
    padding: $space-4;
  }

  .profile {
    &__inner {
      flex-direction: column;
      gap: $space-4;
    }

    &__meta {
      grid-template-columns: 1fr;
    }
  }

  .kpis__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@include media-phone {
  .kpis__grid {
    grid-template-columns: 1fr;
  }
}
</style>
