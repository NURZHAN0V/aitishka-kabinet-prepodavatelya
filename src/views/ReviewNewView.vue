<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseSelect,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { STUDENTS, SUBJECTS, getStudentById } from '@/modules/shared/constants/groups.js'
import { useReviews } from '@/modules/reviews/composables/useReviews.js'

const route = useRoute()
const toast = useToast()
const { allReviews, editingId, saveReview, startEdit, cancelEdit } = useReviews()

const studentOptions = STUDENTS.filter((s) => s.status === 'active').map((s) => ({
  value: s.id,
  label: s.name,
}))
const subjectOptions = SUBJECTS.map((s) => ({ value: s, label: s }))

const form = reactive({
  studentId: '',
  subject: SUBJECTS[0],
  text: '',
})

watch(
  () => route.query.student,
  (id) => {
    if (typeof id === 'string' && studentOptions.some((o) => o.value === id)) {
      form.studentId = id
    } else if (!form.studentId && studentOptions.length) {
      form.studentId = studentOptions[0].value
    }
  },
  { immediate: true },
)

watch(editingId, (id) => {
  if (!id) return
  const review = allReviews.value.find((r) => r.id === id)
  if (!review) return
  form.studentId = review.studentId
  form.subject = review.subject
  form.text = review.text
})

const formTitle = computed(() => (editingId.value ? 'Редактировать отзыв' : 'Новый отзыв'))

function onSave() {
  if (!form.studentId || !form.text.trim()) {
    toast.error('Выберите студента и введите текст отзыва')
    return
  }
  const wasEdit = Boolean(editingId.value)
  const ok = saveReview({
    id: editingId.value || undefined,
    studentId: form.studentId,
    subject: form.subject,
    text: form.text.trim(),
  })
  if (ok) {
    toast.success(wasEdit ? 'Отзыв обновлён' : 'Отзыв сохранён')
    form.text = ''
    cancelEdit()
  }
}

function onEdit(review) {
  startEdit(review.id)
}

function formatDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU')
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Написать отзыв' }]"
    active-route="reviews-new"
  >
    <div class="review-new">
      <header class="review-new__header">
        <h1 class="review-new__title">Отзывы о студентах</h1>
        <p class="review-new__subtitle">Можно редактировать. Удаление недоступно.</p>
      </header>

      <BaseCard padding="md">
        <template #title>{{ formTitle }}</template>
        <div class="review-new__form">
          <BaseSelect
            v-model="form.studentId"
            label="Студент"
            :options="studentOptions"
            :disabled="Boolean(editingId)"
          />
          <BaseSelect v-model="form.subject" label="Предмет" :options="subjectOptions" />
          <div class="review-new__text">
            <label class="review-new__label" for="review-text">Текст отзыва</label>
            <textarea
              id="review-text"
              v-model="form.text"
              class="review-new__textarea"
              rows="5"
              placeholder="Напишите отзыв…"
            />
          </div>
          <div class="review-new__actions">
            <BaseButton v-if="editingId" variant="secondary" @click="cancelEdit(); form.text = ''">
              Отмена
            </BaseButton>
            <BaseButton variant="primary" @click="onSave">Сохранить</BaseButton>
          </div>
        </div>
      </BaseCard>

      <section class="review-new__list-section">
        <h2 class="review-new__list-title">Существующие отзывы</h2>
        <div v-if="!allReviews.length" class="review-new__empty">Пока нет отзывов</div>
        <div v-else class="review-new__list">
          <BaseCard
            v-for="review in allReviews"
            :key="review.id"
            padding="md"
          >
            <div class="review-card__head">
              <div>
                <h3 class="review-card__name">
                  {{ getStudentById(review.studentId)?.name || 'Студент' }}
                </h3>
                <p class="review-card__meta">
                  {{ review.subject }} · обновлён {{ formatDate(review.updatedAt) }}
                </p>
              </div>
              <BaseButton
                variant="secondary"
                size="sm"
                icon="pencil-edit-02"
                @click="onEdit(review)"
              >
                Редактировать
              </BaseButton>
            </div>
            <p class="review-card__text">{{ review.text }}</p>
          </BaseCard>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.review-new {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.review-new__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.review-new__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.review-new__form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.review-new__text,
.review-new__actions {
  grid-column: 1 / -1;
}

.review-new__label {
  display: block;
  margin-bottom: $space-2;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
}

.review-new__textarea {
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

.review-new__actions {
  display: flex;
  gap: $space-3;
  justify-content: flex-end;
}

.review-new__list-title {
  margin: 0 0 $space-4;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.review-new__empty {
  padding: $space-6;
  text-align: center;
  color: $color-text-muted;
  background: $color-bg-muted;
  border-radius: $radius-card;
}

.review-new__list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.review-card__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: $space-3;
  margin-bottom: $space-3;
}

.review-card__name {
  margin: 0 0 $space-1;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.review-card__meta {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-muted;
}

.review-card__text {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: $line-height-base;
}
</style>
