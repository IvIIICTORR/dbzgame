import AuthLayout from '@/layouts/AuthLayout.vue'
import GameLayout from '@/layouts/GameLayout.vue'
import WebLayout from '@/layouts/WebLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useProgressStore } from '@/stores/progress'
import HomeView from '@/views/Web/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: WebLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'sobre',
          name: 'about',
          component: () => import('@/views/Web/AboutView.vue'),
        },
        {
          path: 'carreiras',
          name: 'careers',
          component: () => import('@/views/Web/CareersView.vue'),
        },
        {
          path: 'termos-de-servico',
          name: 'terms-of-service',
          component: () => import('@/views/Web/TermsOfServiceView.vue'),
        },
        {
          path: 'politica-de-privacidade',
          name: 'privacy-policy',
          component: () => import('@/views/Web/PrivacyPolicyView.vue'),
        },
        {
          path: 'preferencias-de-cookies',
          name: 'cookie-preferences',
          component: () => import('@/views/Web/CookiePreferencesView.vue'),
        },
        {
          path: 'noticias',
          name: 'news.index',
          component: () => import('@/views/Web/Blog/IndexView.vue'),
        },
        {
          path: 'noticias/:slug',
          name: 'news.show',
          component: () => import('@/views/Web/Blog/ShowView.vue'),
        },
      ],
    },

    {
      path: '/',
      meta: { requiresGuest: true },
      component: AuthLayout,
      children: [
        {
          path: 'entrar',
          name: 'login',
          component: () => import('@/views/Auth/LoginView.vue'),
        },
        {
          path: 'registrar',
          name: 'register',
          component: () => import('@/views/Auth/RegisterView.vue'),
        },
        {
          path: 'recuperar-senha',
          name: 'forgot-password',
          component: () => import('@/views/Auth/ForgotPasswordView.vue'),
        },
        {
          path: 'resetar-senha',
          name: 'reset-password',
          component: () => import('@/views/Auth/ResetPasswordView.vue'),
        },
      ],
    },

    {
      path: '/',
      meta: { requiresAuth: true },
      component: GameLayout,
      children: [
        {
          path: 'inicio',
          name: 'game-home',
          component: () => import('@/views/Game/HomeView.vue'),
        },
        {
          path: 'messages',
          name: 'messages',
          component: () => import('@/views/Game/MessagesView.vue'),
        },
      ],
    },

    {
      path: '/',
      component: WebLayout,
      children: [
        {
          path: ':pathMatch(.*)*',
          name: 'error.404',
          component: () => import('@/views/Errors/NotFoundView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const progressStore = useProgressStore()

  // Inicia a barra de progresso imediatamente
  progressStore.start()

  // 1. Inicialização da sessão
  if (!authStore.isInitialized) {
    await authStore.fetchCurrentUser()
  }

  // 2. Verificação de Autenticação
  const isAuthRoute = to.matched.some((record) => record.meta.requiresAuth)
  const isGuestRoute = to.matched.some((record) => record.meta.requiresGuest)

  if (isAuthRoute && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  if (isGuestRoute && authStore.isAuthenticated) {
    return next({ name: 'game-home' })
  }

  next()
})

router.afterEach(() => {
  const progressStore = useProgressStore()
  progressStore.finish()
})

export default router
