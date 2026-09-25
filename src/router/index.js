import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/current-lesson',
      name: 'current-lesson',
      component: () => import('@/views/CurrentLessonView.vue'),
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('@/views/ScheduleView.vue'),
    },
    {
      path: '/journal',
      name: 'journal',
      component: () => import('@/views/JournalView.vue'),
    },
    {
      path: '/grades',
      name: 'grades',
      component: () => import('@/views/GradesView.vue'),
    },
    {
      path: '/homework',
      name: 'homework',
      component: () => import('@/views/HomeworkView.vue'),
    },
    {
      path: '/exams',
      name: 'exams',
      component: () => import('@/views/ExamsView.vue'),
    },
    {
      path: '/students',
      name: 'students',
      component: () => import('@/views/StudentsView.vue'),
    },
    {
      path: '/students/:id',
      name: 'student-detail',
      component: () => import('@/views/StudentDetailView.vue'),
    },
    {
      path: '/reviews/new',
      name: 'reviews-new',
      component: () => import('@/views/ReviewNewView.vue'),
    },
    {
      path: '/rating',
      name: 'rating',
      component: () => import('@/views/RatingView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/views/HelpView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
