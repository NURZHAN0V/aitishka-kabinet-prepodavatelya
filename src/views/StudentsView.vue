<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseAvatar,
  BaseCard,
  BaseChip,
  BaseInput,
  BaseSelect,
} from '@/core/components/ui'
import {
  GROUPS,
  STUDENTS,
  STATUS_LABELS,
  getGroupById,
} from '@/modules/shared/constants/groups.js'
import { STUDENT_STATUS_FILTERS } from '@/modules/students/constants/students.js'

const router = useRouter()

const search = ref('')
const groupFilter = ref('all')
const statusFilter = ref('active')

const groupOptions = [
  { value: 'all', label: 'Все группы' },
  ...GROUPS.map((g) => ({ value: g.id, label: g.name })),
]

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return STUDENTS.filter((s) => {
    if (statusFilter.value !== 'all' && s.status !== statusFilter.value) return false
    if (groupFilter.value !== 'all' && s.groupId !== groupFilter.value) return false
    if (q && !s.name.toLowerCase().includes(q)) return false
    return true
  })
})

function formatDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU')
}

function statusVariant(status) {
  if (status === 'active') return 'approved'
  if (status === 'transferred') return 'pending'
  return 'rejected'
}

function openStudent(id) {
  router.push(`/students/${id}`)
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Студенты' }]"
    active-route="students"
  >
    <div class="students-view">
      <header class="students-view__header">
        <h1 class="students-view__title">Студенты</h1>
        <p class="students-view__subtitle">Поиск и фильтры по группам и статусу</p>
      </header>

      <div class="students-view__filters">
        <BaseInput
          v-model="search"
          label="Поиск"
          placeholder="ФИО студента"
        />
        <BaseSelect v-model="groupFilter" label="Группа" :options="groupOptions" />
      </div>

      <div class="students-view__chips">
        <BaseChip
          v-for="chip in STUDENT_STATUS_FILTERS"
          :key="chip.id"
          mode="filter"
          :active="statusFilter === chip.id"
          @click="statusFilter = chip.id"
        >
          {{ chip.label }}
        </BaseChip>
      </div>

      <div v-if="!filtered.length" class="students-view__empty">
        Студенты не найдены
      </div>

      <div v-else class="students-view__grid">
        <button
          v-for="student in filtered"
          :key="student.id"
          type="button"
          class="student-card-btn"
          @click="openStudent(student.id)"
        >
          <BaseCard padding="md" class="student-card">
            <div class="student-card__head">
              <BaseAvatar :name="student.name" size="lg" />
              <div class="student-card__info">
                <h3 class="student-card__name">{{ student.name }}</h3>
                <p class="student-card__group">
                  {{ getGroupById(student.groupId)?.name || '—' }}
                </p>
                <BaseChip :variant="statusVariant(student.status)" size="sm">
                  {{ STATUS_LABELS[student.status] }}
                </BaseChip>
              </div>
            </div>
            <dl class="student-card__stats">
              <div>
                <dt>Средний балл</dt>
                <dd>{{ student.avgGrade.toFixed(1) }}</dd>
              </div>
              <div>
                <dt>Посещаемость</dt>
                <dd>{{ student.attendance }}%</dd>
              </div>
              <div>
                <dt>Коины</dt>
                <dd>{{ student.coins }}</dd>
              </div>
              <div>
                <dt>Активность</dt>
                <dd>{{ formatDate(student.lastActivity) }}</dd>
              </div>
            </dl>
          </BaseCard>
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.students-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.students-view__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.students-view__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.students-view__filters {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(180px, 240px);
  gap: $space-4;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.students-view__chips {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.students-view__empty {
  padding: $space-8;
  text-align: center;
  color: $color-text-muted;
  background: $color-bg-muted;
  border-radius: $radius-card;
}

.students-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $space-4;
}

.student-card-btn {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  border-radius: $radius-card;
  transition: transform $transition-fast;

  &:hover {
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.student-card__head {
  display: flex;
  gap: $space-4;
  margin-bottom: $space-4;
}

.student-card__name {
  margin: 0 0 $space-1;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.student-card__group {
  margin: 0 0 $space-2;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.student-card__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-3;
  margin: 0;

  dt {
    margin: 0;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  dd {
    margin: $space-1 0 0;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }
}
</style>
