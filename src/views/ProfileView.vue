<script setup>
import { reactive, ref } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseAvatar,
  BaseButton,
  BaseCard,
  BaseInput,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { TEACHER_USER } from '@/modules/home/constants/dossier.js'

const toast = useToast()

const form = reactive({
  name: TEACHER_USER.name,
  email: TEACHER_USER.email,
  phone: TEACHER_USER.phone,
  avatar: TEACHER_USER.avatar,
})

const photoPreview = ref(TEACHER_USER.avatar)
const fileInput = ref(null)

function onPickPhoto() {
  fileInput.value?.click()
}

function onPhotoChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  photoPreview.value = url
  form.avatar = url
  event.target.value = ''
}

function onSave() {
  if (!form.email.trim() || !form.phone.trim()) {
    toast.error('Заполните контакты')
    return
  }
  toast.success('Профиль сохранён')
}

function formatStartDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Профиль' }]"
    active-route="profile"
  >
    <div class="profile-view">
      <header class="profile-view__header">
        <h1 class="profile-view__title">Профиль</h1>
        <p class="profile-view__subtitle">Редактирование контактов и фото</p>
      </header>

      <div class="profile-view__grid">
        <BaseCard padding="md">
          <div class="profile-view__photo">
            <BaseAvatar
              :name="form.name"
              :src="photoPreview"
              size="2xl"
            />
            <div>
              <p class="profile-view__role">{{ TEACHER_USER.role }}</p>
              <p class="profile-view__started">
                В школе с {{ formatStartDate(TEACHER_USER.startDate) }}
              </p>
              <BaseButton variant="secondary" size="sm" icon="upload-01" @click="onPickPhoto">
                Изменить фото
              </BaseButton>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="profile-view__file"
                @change="onPhotoChange"
              />
            </div>
          </div>

          <div class="profile-view__form">
            <BaseInput v-model="form.name" label="ФИО" disabled hint="ФИО меняет учебная часть" />
            <BaseInput v-model="form.email" label="Почта" type="email" />
            <BaseInput v-model="form.phone" label="Телефон" type="tel" />
            <p class="profile-view__subjects">
              Предметы: {{ TEACHER_USER.subjects.join(', ') }}
            </p>
            <BaseButton variant="primary" @click="onSave">Сохранить</BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.profile-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.profile-view__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.profile-view__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.profile-view__grid {
  max-width: 640px;
}

.profile-view__photo {
  display: flex;
  flex-wrap: wrap;
  gap: $space-5;
  align-items: center;
  margin-bottom: $space-6;
}

.profile-view__role {
  margin: 0 0 $space-1;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.profile-view__started {
  margin: 0 0 $space-3;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.profile-view__file {
  display: none;
}

.profile-view__form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.profile-view__subjects {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}
</style>
