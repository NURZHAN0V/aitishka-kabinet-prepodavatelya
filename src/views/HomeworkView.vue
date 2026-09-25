<script setup>
import { computed, reactive, ref } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseChip,
  BaseFileUpload,
  BaseInput,
  BaseModal,
  BaseSelect,
  BaseTabs,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import {
  GROUPS,
  SUBJECTS,
  getGroupById,
  getStudentById,
} from '@/modules/shared/constants/groups.js'
import {
  HW_MAIN_TABS,
  HW_MONTH_OPTIONS,
  HW_STATUS,
  HW_STATUS_CHIPS,
  HW_STATUS_LABELS,
} from '@/modules/homework/constants/homework.js'
import { useHomework } from '@/modules/homework/composables/useHomework.js'

const toast = useToast()
const {
  mainTab,
  groupFilter,
  subjectFilter,
  monthFilter,
  statusFilter,
  showTransferred,
  statusCounts,
  filteredCards,
  createHomework,
  setSubmissionStatus,
  setGrade,
} = useHomework()

const groupOptions = [
  { value: 'all', label: 'Все группы' },
  ...GROUPS.map((g) => ({ value: g.id, label: g.name })),
]
const subjectOptions = [
  { value: 'all', label: 'Все предметы' },
  ...SUBJECTS.map((s) => ({ value: s, label: s })),
]

const form = reactive({
  title: '',
  topic: '',
  subject: SUBJECTS[0],
  groupId: GROUPS[0].id,
  deadline: '',
  file: null,
})

const reviewOpen = ref(false)
const reviewMode = ref('approve')
const reviewTarget = ref(null)
const reviewComment = ref('')
const reviewGrade = ref(4)

const createSubjectOptions = SUBJECTS.map((s) => ({ value: s, label: s }))
const createGroupOptions = GROUPS.map((g) => ({ value: g.id, label: g.name }))
const gradeOptions = [2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))

const isEmpty = computed(() => filteredCards.value.length === 0)

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU')
}

function onCreate() {
  if (!form.title.trim() || !form.deadline) {
    toast.error('Заполните заголовок и срок сдачи')
    return
  }
  createHomework({
    title: form.title.trim(),
    topic: form.topic.trim() || 'Без темы',
    subject: form.subject,
    groupId: form.groupId,
    deadline: form.deadline,
    fileName: form.file?.name || 'задание.pdf',
  })
  form.title = ''
  form.topic = ''
  form.deadline = ''
  form.file = null
  toast.success('Домашнее задание создано')
}

function downloadSubmission(card) {
  toast.info(`Скачивание: ${card.submission.fileName || card.homework.fileName}`)
}

function openReview(card, mode) {
  if (card.submission.transferred) return
  reviewTarget.value = card
  reviewMode.value = mode
  reviewComment.value = card.submission.comment || ''
  reviewGrade.value = card.submission.grade || 4
  reviewOpen.value = true
}

function confirmReview() {
  const card = reviewTarget.value
  if (!card) return
  const status = reviewMode.value === 'approve' ? HW_STATUS.APPROVED : HW_STATUS.REJECTED
  const ok = setSubmissionStatus(card.homework.id, card.submission.id, status, {
    grade: reviewMode.value === 'approve' ? Number(reviewGrade.value) : null,
    comment: reviewComment.value.trim(),
  })
  reviewOpen.value = false
  if (ok) {
    toast.success(reviewMode.value === 'approve' ? 'Работа зачтена' : 'Работа отклонена')
  }
}

function onGradeChange(card, value) {
  if (card.submission.transferred) return
  const ok = setGrade(card.homework.id, card.submission.id, Number(value))
  if (ok) toast.success('Оценка сохранена')
}

function toggleTransferred() {
  showTransferred.value = !showTransferred.value
  if (showTransferred.value) {
    toast.info('Показаны работы переведённых студентов (только просмотр)')
  }
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Домашние задания' }]"
    active-route="homework"
  >
    <div class="homework-view">
      <header class="homework-view__header">
        <h1 class="homework-view__title">Домашние задания</h1>
        <p class="homework-view__subtitle">Создание заданий и проверка работ студентов</p>
      </header>

      <BaseTabs v-model="mainTab" :tabs="HW_MAIN_TABS" />

      <section v-if="mainTab === 'create'" class="homework-create">
        <BaseCard padding="md">
          <template #title>Новое задание</template>
          <div class="homework-create__form">
            <BaseInput v-model="form.title" label="Заголовок" placeholder="Название задания" />
            <BaseInput v-model="form.topic" label="Тема" placeholder="Тема урока" />
            <BaseSelect
              v-model="form.subject"
              label="Предмет"
              :options="createSubjectOptions"
            />
            <BaseSelect
              v-model="form.groupId"
              label="Группа"
              :options="createGroupOptions"
            />
            <BaseInput
              v-model="form.deadline"
              label="Срок сдачи"
              type="date"
            />
            <div class="homework-create__upload">
              <p class="homework-create__label">Файл задания</p>
              <BaseFileUpload v-model="form.file" accept=".pdf,.zip,.doc,.docx,.sb3,.py" />
            </div>
            <BaseButton variant="primary" @click="onCreate">Создать задание</BaseButton>
          </div>
        </BaseCard>
      </section>

      <template v-else>
        <div class="homework-view__filters">
          <BaseSelect v-model="groupFilter" label="Группа" :options="groupOptions" />
          <BaseSelect v-model="subjectFilter" label="Предмет" :options="subjectOptions" />
          <BaseSelect v-model="monthFilter" label="Месяц" :options="HW_MONTH_OPTIONS" />
        </div>

        <div class="homework-view__chips" role="group" aria-label="Статус">
          <BaseChip
            v-for="chip in HW_STATUS_CHIPS"
            :key="chip.id"
            mode="filter"
            toned
            :variant="chip.variant"
            :active="statusFilter === chip.id && !showTransferred"
            :count="statusCounts[chip.id]"
            @click="statusFilter = chip.id; showTransferred = false"
          >
            {{ chip.label }}
          </BaseChip>
        </div>

        <button type="button" class="homework-view__transferred" @click="toggleTransferred">
          {{ showTransferred ? 'Скрыть переведённых студентов' : 'Показать переведённых студентов' }}
        </button>

        <div v-if="isEmpty" class="homework-view__empty">
          Нет работ по выбранным фильтрам
        </div>

        <div v-else class="homework-view__list">
          <BaseCard
            v-for="card in filteredCards"
            :key="card.submission.id"
            padding="md"
            class="hw-card"
          >
            <div class="hw-card__top">
              <div>
                <h3 class="hw-card__title">{{ card.homework.title }}</h3>
                <p class="hw-card__meta">
                  {{ getStudentById(card.submission.studentId)?.name || 'Студент' }}
                  · {{ getGroupById(card.homework.groupId)?.name }}
                  · {{ card.homework.subject }}
                </p>
              </div>
              <BaseChip :variant="card.submission.status" size="sm">
                {{ HW_STATUS_LABELS[card.submission.status] }}
              </BaseChip>
            </div>

            <dl class="hw-card__details">
              <div>
                <dt>Тема</dt>
                <dd>{{ card.homework.topic }}</dd>
              </div>
              <div>
                <dt>Срок</dt>
                <dd>{{ formatDate(card.homework.deadline) }}</dd>
              </div>
              <div>
                <dt>Сдано</dt>
                <dd>{{ formatDate(card.submission.submittedAt) }}</dd>
              </div>
              <div>
                <dt>Файл</dt>
                <dd>{{ card.submission.fileName || '—' }}</dd>
              </div>
              <div v-if="card.submission.grade != null">
                <dt>Оценка</dt>
                <dd>{{ card.submission.grade }}</dd>
              </div>
            </dl>

            <p v-if="card.submission.comment" class="hw-card__comment">
              {{ card.submission.comment }}
            </p>

            <p v-if="card.submission.transferred" class="hw-card__notice">
              Переведённый студент — только просмотр
            </p>

            <div class="hw-card__actions">
              <BaseButton
                variant="secondary"
                size="sm"
                icon="download-01"
                :disabled="!card.submission.fileName"
                @click="downloadSubmission(card)"
              >
                Скачать
              </BaseButton>
              <template v-if="!card.submission.transferred">
                <BaseButton
                  variant="primary"
                  size="sm"
                  icon="check-circle"
                  @click="openReview(card, 'approve')"
                >
                  Зачесть
                </BaseButton>
                <BaseButton
                  variant="secondary"
                  size="sm"
                  icon="x-close"
                  @click="openReview(card, 'reject')"
                >
                  Отклонить
                </BaseButton>
                <BaseSelect
                  :model-value="card.submission.grade != null ? String(card.submission.grade) : ''"
                  :options="gradeOptions"
                  placeholder="Оценка"
                  @update:model-value="onGradeChange(card, $event)"
                />
              </template>
            </div>
          </BaseCard>
        </div>
      </template>

      <BaseModal
        v-model="reviewOpen"
        :title="reviewMode === 'approve' ? 'Зачесть работу' : 'Отклонить работу'"
        size="md"
      >
        <div class="review-modal">
          <p v-if="reviewTarget" class="review-modal__lead">
            {{ getStudentById(reviewTarget.submission.studentId)?.name }} —
            {{ reviewTarget.homework.title }}
          </p>
          <BaseSelect
            v-if="reviewMode === 'approve'"
            :model-value="String(reviewGrade)"
            label="Оценка"
            :options="gradeOptions"
            @update:model-value="reviewGrade = Number($event)"
          />
          <label class="review-modal__label" for="review-comment">Комментарий</label>
          <textarea
            id="review-comment"
            v-model="reviewComment"
            class="review-modal__textarea"
            rows="4"
            placeholder="Комментарий для студента"
          />
        </div>
        <template #footer>
          <BaseButton variant="secondary" @click="reviewOpen = false">Отмена</BaseButton>
          <BaseButton variant="primary" @click="confirmReview">
            {{ reviewMode === 'approve' ? 'Зачесть' : 'Отклонить' }}
          </BaseButton>
        </template>
      </BaseModal>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.homework-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.homework-view__header {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.homework-view__title {
  margin: 0;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.homework-view__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.homework-view__filters,
.homework-create__form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: $space-4;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.homework-create__form {
  grid-template-columns: 1fr 1fr;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.homework-create__upload {
  grid-column: 1 / -1;
}

.homework-create__label {
  margin: 0 0 $space-2;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
}

.homework-view__chips {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.homework-view__transferred {
  align-self: flex-start;
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-link;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: $color-text-link-hover;
  }
}

.homework-view__empty {
  padding: $space-8;
  text-align: center;
  color: $color-text-muted;
  font-size: $font-size-sm;
  background: $color-bg-muted;
  border-radius: $radius-card;
}

.homework-view__list {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.hw-card__top {
  display: flex;
  justify-content: space-between;
  gap: $space-3;
  align-items: flex-start;
  margin-bottom: $space-4;
}

.hw-card__title {
  margin: 0 0 $space-1;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.hw-card__meta {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.hw-card__details {
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
    color: $color-text-primary;
    font-weight: $font-weight-medium;
  }
}

.hw-card__comment,
.hw-card__notice {
  margin: 0 0 $space-4;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.hw-card__notice {
  color: $color-warning-hover;
}

.hw-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: $space-3;
  align-items: flex-end;

  .base-select {
    min-width: 120px;
  }
}

.review-modal {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.review-modal__lead {
  margin: 0;
  color: $color-text-secondary;
  font-size: $font-size-sm;
}

.review-modal__label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
}

.review-modal__textarea {
  width: 100%;
  padding: $space-3 $space-4;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  font-family: inherit;
  font-size: $font-size-base;
  color: $color-text-primary;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: $color-border-focus;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.15);
  }
}
</style>
