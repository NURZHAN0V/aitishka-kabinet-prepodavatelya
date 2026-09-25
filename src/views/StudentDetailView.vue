<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseAvatar,
  BaseButton,
  BaseCard,
  BaseChip,
  BaseTabs,
} from '@/core/components/ui'
import {
  STATUS_LABELS,
  getGroupById,
  getStudentById,
} from '@/modules/shared/constants/groups.js'
import {
  ATTENDANCE_LABELS,
  STUDENT_DETAIL_TABS,
  getAttendanceFeed,
} from '@/modules/students/constants/students.js'
import { useReviews } from '@/modules/reviews/composables/useReviews.js'

const route = useRoute()
const router = useRouter()
const { getReviewsByStudent } = useReviews()

const activeTab = ref('attendance')

const student = computed(() => getStudentById(route.params.id))
const group = computed(() => (student.value ? getGroupById(student.value.groupId) : null))
const isReadOnly = computed(
  () => student.value?.status === 'transferred' || student.value?.status === 'expelled',
)
const feed = computed(() => (student.value ? getAttendanceFeed(student.value.id) : []))
const reviews = computed(() => (student.value ? getReviewsByStudent(student.value.id) : []))

function formatDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU')
}

function attendanceVariant(kind) {
  if (kind === 'present') return 'approved'
  if (kind === 'late') return 'pending'
  return 'rejected'
}

function goReview() {
  if (!student.value) return
  router.push({ path: '/reviews/new', query: { student: student.value.id } })
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[
      { label: 'Главная', href: '/' },
      { label: 'Студенты', href: '/students' },
      { label: student?.name || 'Студент' },
    ]"
    active-route="students"
  >
    <div class="student-detail">
      <div v-if="!student" class="student-detail__empty">
        Студент не найден
        <BaseButton variant="secondary" as="a" href="/students">К списку</BaseButton>
      </div>

      <template v-else>
        <BaseCard padding="md" class="student-detail__summary">
          <div class="student-detail__head">
            <BaseAvatar :name="student.name" size="xl" />
            <div class="student-detail__info">
              <h1 class="student-detail__title">{{ student.name }}</h1>
              <p class="student-detail__meta">
                {{ group?.name }} · {{ STATUS_LABELS[student.status] }}
              </p>
              <p class="student-detail__contacts">
                {{ student.phone }} · {{ student.email }}
              </p>
            </div>
            <BaseButton
              v-if="!isReadOnly"
              variant="primary"
              icon="pencil-edit-02"
              @click="goReview"
            >
              Написать отзыв
            </BaseButton>
          </div>

          <div v-if="isReadOnly" class="student-detail__notice" role="status">
            Карточка доступна только для просмотра
            ({{ student.status === 'transferred' ? 'студент переведён' : 'студент отчислен' }}).
          </div>

          <dl class="student-detail__stats">
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

        <BaseTabs v-model="activeTab" :tabs="STUDENT_DETAIL_TABS" />

        <section v-if="activeTab === 'attendance'" class="student-detail__section">
          <div v-if="!feed.length" class="student-detail__empty-block">Нет записей</div>
          <ul v-else class="feed-list">
            <li v-for="item in feed" :key="item.id" class="feed-item">
              <div class="feed-item__row">
                <span class="feed-item__date">{{ formatDate(item.date) }}</span>
                <BaseChip :variant="attendanceVariant(item.attendance)" size="sm">
                  {{ ATTENDANCE_LABELS[item.attendance] }}
                </BaseChip>
              </div>
              <p class="feed-item__subject">{{ item.subject }}</p>
              <p class="feed-item__grade">
                Оценка: {{ item.grade ?? '—' }}
              </p>
              <p v-if="item.comment" class="feed-item__comment">{{ item.comment }}</p>
            </li>
          </ul>
        </section>

        <section v-else class="student-detail__section">
          <div v-if="!reviews.length" class="student-detail__empty-block">
            Отзывов пока нет
          </div>
          <ul v-else class="review-list">
            <li v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-item__head">
                <strong>{{ review.subject }}</strong>
                <span>{{ formatDate(review.updatedAt) }}</span>
              </div>
              <p>{{ review.text }}</p>
            </li>
          </ul>
        </section>
      </template>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.student-detail {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.student-detail__empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-4;
  color: $color-text-muted;
}

.student-detail__head {
  display: flex;
  flex-wrap: wrap;
  gap: $space-4;
  align-items: flex-start;
  margin-bottom: $space-4;
}

.student-detail__info {
  flex: 1;
  min-width: 200px;
}

.student-detail__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.student-detail__meta,
.student-detail__contacts {
  margin: 0 0 $space-1;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.student-detail__notice {
  margin-bottom: $space-4;
  padding: $space-3 $space-4;
  border-radius: $radius-md;
  background: $color-warning-light;
  color: $color-warning-hover;
  font-size: $font-size-sm;
}

.student-detail__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: $space-4;
  margin: 0;

  @media (max-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }

  dt {
    margin: 0;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  dd {
    margin: $space-1 0 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }
}

.student-detail__empty-block {
  padding: $space-6;
  text-align: center;
  color: $color-text-muted;
  background: $color-bg-muted;
  border-radius: $radius-card;
}

.feed-list,
.review-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.feed-item,
.review-item {
  padding: $space-4;
  border-radius: $radius-card;
  background: $color-bg-muted;
}

.feed-item__row {
  display: flex;
  justify-content: space-between;
  gap: $space-3;
  margin-bottom: $space-2;
}

.feed-item__date {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
}

.feed-item__subject,
.feed-item__grade,
.feed-item__comment,
.review-item p {
  margin: 0 0 $space-1;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.review-item__head {
  display: flex;
  justify-content: space-between;
  gap: $space-3;
  margin-bottom: $space-2;
  font-size: $font-size-sm;
  color: $color-text-muted;

  strong {
    color: $color-text-primary;
  }
}
</style>
