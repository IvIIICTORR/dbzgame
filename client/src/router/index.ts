import { useAuthStore } from '@/stores/auth'
import { useProgressStore } from '@/stores/progress'
import HomeView from '@/views/Web/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- GROUP: WEBSITE ---
    {
      path: '/',
      component: () => import('@/layouts/WebLayout.vue'),
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'sobre', name: 'about', component: () => import('@/views/Web/AboutView.vue') },
        { path: 'carreiras', name: 'careers', component: () => import('@/views/Web/CareersView.vue') },
        { path: 'termos-de-servico', name: 'terms-of-service', component: () => import('@/views/Web/TermsOfServiceView.vue') },
        { path: 'politica-de-privacidade', name: 'privacy-policy', component: () => import('@/views/Web/PrivacyPolicyView.vue') },
        { path: 'preferencias-de-cookies', name: 'cookie-preferences', component: () => import('@/views/Web/CookiePreferencesView.vue') },
        { path: 'noticias', name: 'news.index', component: () => import('@/views/Web/Blog/IndexView.vue') },
        { path: 'noticias/:slug', name: 'news.show', component: () => import('@/views/Web/Blog/ShowView.vue') },
      ],
    },

    // --- GROUP: AUTHENTICATION ---
    {
      path: '/',
      meta: { requiresGuest: true },
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        { path: 'entrar', name: 'login', component: () => import('@/views/Auth/LoginView.vue') },
        { path: 'registrar', name: 'register', component: () => import('@/views/Auth/RegisterView.vue') },
        { path: 'recuperar-senha', name: 'forgot-password', component: () => import('@/views/Auth/ForgotPasswordView.vue') },
        { path: 'resetar-senha', name: 'reset-password', component: () => import('@/views/Auth/ResetPasswordView.vue') },
      ],
    },

    // --- GROUP: GAME ---
    {
      path: '/',
      meta: { requiresAuth: true },
      component: () => import('@/layouts/GameLayout.vue'),
      children: [
        { path: 'inicio', name: 'game-home', component: () => import('@/views/Game/HomeView.vue') },
        { path: 'messages', name: 'messages', component: () => import('@/views/Game/MessagesView.vue') },
        { path: 'battles', name: 'battles', component: () => import('@/views/Game/BattlesView.vue') },
        { path: 'battles1v1', name: 'battles1v1', component: () => import('@/views/Game/BattleMatch.vue') },
        { path: 'profile', name: 'profile', component: () => import('@/views/Game/ProfileView.vue') },
        { path: 'indique', name: 'indique', component: () => import('@/views/Game/ReferralSystem.vue') },
        { path: 'arena', name: 'arena', component: () => import('@/views/Game/ArenaLobby.vue') },
        { path: 'arena-combate', name: 'arena1', component: () => import('@/views/Game/ArenaCombate.vue') },
        { path: 'inventario', name: 'inventario', component: () => import('@/views/Game/Inventory.vue') },
        { path: 'trabalho', name: 'trabalho', component: () => import('@/views/Game/WorkMap.vue') },
        { path: 'recompensas', name: 'recompensas', component: () => import('@/views/Game/Rewards.vue') },
        { path: 'treino', name: 'treino', component: () => import('@/views/Game/Training.vue') },
        { path: 'loja', name: 'loja', component: () => import('@/views/Game/Shop.vue') },
        { path: 'invasao', name: 'invasao', component: () => import('@/views/Game/GlobalInvasion.vue') },
        { path: 'rankings', name: 'rankings', component: () => import('@/views/Game/Ranking.vue') },
        { path: 'scouter', name: 'scouter', component: () => import('@/views/Game/Scouter.vue') },
        { path: 'suporte', name: 'suporte', component: () => import('@/views/Game/Support.vue') },
        { path: 'feedbacks', name: 'feedbacks', component: () => import('@/views/Game/FeedbackView.vue') },
        { path: 'capsule', name: 'capsule', component: () => import('@/views/Game/CapsulaView.vue') },
      ],
    },

    // --- GROUP: BATALHAS ---
    {
      path: '/',
      meta: { requiresAuth: true },
      component: () => import('@/layouts/GameLayout.vue'),
      children: [
        { path: 'sagas', name: 'sagas', component: () => import('@/views/Game/Batalhas/SagasView.vue') },
        { path: 'sagas-luta/:sagaId', name: 'sagas_luta', component: () => import('@/views/Game/Batalhas/SagaBattleView.vue'), props: true },
        { path: 'arena-luta', name: 'arena_luta', component: () => import('@/views/Game/Batalhas/ArenaBattleView.vue') },
        { path: 'torneio', name: 'torneio', component: () => import('@/views/Game/Batalhas/BudokaiView.vue') },
        { path: 'gravidade', name: 'gravidade', component: () => import('@/views/Game/Batalhas/GravityRoomView.vue') },
      ],
    },

    // --- GROUP: ERRORS ---
    {
      path: '/',
      component: () => import('@/layouts/WebLayout.vue'),
      children: [
        { path: ':pathMatch(.*)*', name: 'error.404', component: () => import('@/views/Errors/NotFoundView.vue') },
      ],
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const progressStore = useProgressStore()

  progressStore.start()

  if (!authStore.isInitialized) {
    await authStore.fetchCurrentUser()
  }

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
