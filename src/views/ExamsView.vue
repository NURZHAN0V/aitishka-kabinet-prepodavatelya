<script setup>
import { reactive } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseChip,
  BaseInput,
  BaseSelect,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import {
  GROUPS,
  SUBJECTS,
  getGroupById,
  getStudentById,
} from '@/modules/shared/constants/groups.js'
import {
  EXAM_MONTH_OPTIONS,
  EXAM_STATUS,
  EXAM_STATUS_CHIPS,
  EXAM_STATUS_LABELS,
} from '@/modules/exams/constants/exams.js'
import { useExams } from '@/modules/exams/composables/useExams.js'

const toast = useToast()
const {
  groupFilter,
  subjectFilter,
  monthFilter,
  statusFilter,
  showCreate,
  filteredItems,
  statusCounts,
  createExam,
  setGrade,
} = useExams()

const groupOptions = [
  { value: 'all', label: 'Все группы' },
  ...GROUPS.map((g) => ({ value: g.id, label: g.name })),
]
const subjectOptions = [
  { value: 'all', label: 'Все предметы' },
  ...SUBJECTS.map((s) => ({ value: s, label: s })),
]
const createSubjectOptions = SUBJECTS.map((s) => ({ value: s, label: s }))
const createGroupOptions = GROUPS.map((g) => ({ value: g.id, label: g.name }))
const gradeOptions = [2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))

const form = reactive({
  subject: SUBJECTS[0],
  groupId: GROUPS[0].id,
  submitDeadline: '',
  reviewDate: '',
})

function chipVariant(status) {
  if (status === EXAM_STATUS.AWAITING) return 'pending'
  if (status === EXAM_STATUS.UPLOADED) return 'current'
  if (status === EXAM_STATUS.REVIEWED) return 'approved'
  return 'missing'
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU')
}

function onCreate() {
  if (!form.submitDeadline || !form.reviewDate) {
    toast.error('Укажите даты сдачи и проверки')
    return
  }
  const count = createExam({ ...form })
  form.submitDeadline = ''
  form.reviewDate = ''
  toast.success(`Экзамен создан для ${count} студентов`)
}

function onGrade(exam, value) {
  const ok = setGrade(exam.id, Number(value))
  if (ok) toast.success('Оценка за экзамен сохранена')
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Экзамены' }]"
    active-route="exams"
  >
    <div class="exams-view">
      <header class="exams-view__header">
        <div>
          <h1 class="exams-view__title">Экзамены</h1>
          <p class="exams-view__subtitle">Создание и проверка экзаменационных работ</p>
        </div>
        <BaseButton
          :variant="showCreate ? 'secondary' : 'primary'"
          icon="file-02"
          @click="showCreate = !showCreate"
        >
          {{ showCreate ? 'К списку' : 'Создать экзамен' }}
        </BaseButton>
      </header>

      <BaseCard v-if="showCreate" padding="md">
        <template #title>Новый экзамен</template>
        <div class="exams-create">
          <BaseSelect v-model="form.subject" label="Предмет" :options="createSubjectOptions" />
          <BaseSelect v-model="form.groupId" label="Группа" :options="createGroupOptions" />
          <BaseInput v-model="form.submitDeadline" label="Срок сдачи" type="date" />
          <BaseInput v-model="form.reviewDate" label="Дата проверки" type="date" />
          <BaseButton variant="primary" @click="onCreate">Создать</BaseButton>
        </div>
      </BaseCard>

      <template v-else>
        <div class="exams-view__filters">
          <BaseSelect v-model="groupFilter" label="Группа" :options="groupOptions" />
          <BaseSelect v-model="subjectFilter" label="Предмет" :options="subjectOptions" />
          <BaseSelect v-model="monthFilter" label="Период" :options="EXAM_MONTH_OPTIONS" />
        </div>

        <div class="exams-view__chips">
          <BaseChip
            v-for="chip in EXAM_STATUS_CHIPS"
            :key="chip.id"
            mode="filter"
            toned
            :variant="chip.variant"
            :active="statusFilter === chip.id"
            :count="statusCounts[chip.id]"
            @click="statusFilter = chip.id"
          >
            {{ chip.label }}
          </BaseChip>
        </div>

        <div v-if="!filteredItems.length" class="exams-view__empty">
          Нет экзаменов по фильтрам
        </div>

        <div v-else class="exams-view__list">
          <BaseCard
            v-for="exam in filteredItems"
            :key="exam.id"
            padding="md"
            class="exam-card"
          >
            <div class="exam-card__top">
              <div>
                <h3 class="exam-card__title">
                  {{ getStudentById(exam.studentId)?.name || 'Студент' }}
                </h3>
                <p class="exam-card__meta">
                  {{ exam.subject }} · {{ getGroupById(exam.groupId)?.name }}
                </p>
              </div>
              <BaseChip :variant="chipVariant(exam.status)" size="sm">
                {{ EXAM_STATUS_LABELS[exam.status] }}
              </BaseChip>
            </div>

            <dl class="exam-card__details">
              <div>
                <dt>Срок сдачи</dt>
                <dd>{{ formatDate(exam.submitDeadline) }}</dd>
              </div>
              <div>
                <dt>Дата проверки</dt>
                <dd>{{ formatDate(exam.reviewDate) }}</dd>
              </div>
              <div>
                <dt>Загружено</dt>
                <dd>{{ formatDate(exam.uploadedAt) }}</dd>
              </div>
              <div>
                <dt>Файл</dt>
                <dd>{{ exam.fileName || '—' }}</dd>
              </div>
              <div v-if="exam.grade != null">
                <dt>Оценка</dt>
                <dd>{{ exam.grade }}</dd>
              </div>
            </dl>

            <div
              v-if="exam.status === 'uploaded' || exam.status === 'reviewed'"
              class="exam-card__actions"
            >
              <BaseSelect
                :model-value="exam.grade != null ? String(exam.grade) : ''"
                label="Оценка 2–5"
                :options="gradeOptions"
                placeholder="Выставить"
                :disabled="!exam.fileName"
                @update:model-value="onGrade(exam, $event)"
              />
            </div>
          </BaseCard>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.exams-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.exams-view__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
}

.exams-view__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.exams-view__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.exams-view__filters,
.exams-create {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: $space-4;
  align-items: end;
}

.exams-view__chips {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.exams-view__empty {
  padding: $space-8;
  text-align: center;
  color: $color-text-muted;
  font-size: $font-size-sm;
  background: $color-bg-muted;
  border-radius: $radius-card;
}

.exams-view__list {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.exam-card__top {
  display: flex;
  justify-content: space-between;
  gap: $space-3;
  margin-bottom: $space-4;
}

.exam-card__title {
  margin: 0 0 $space-1;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.exam-card__meta {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.exam-card__details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: $space-3;
  margin: 0 0 $space-4;

  dt {
    margin: 0;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  dd {
    margin: $space-1 0 0;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
  }
}

.exam-card__actions {
  max-width: 180px;
}
</style>
