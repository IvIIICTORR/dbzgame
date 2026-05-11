import { getCurrentUser, logoutUser } from '@/api/sdk.gen'
import type { GetCurrentUserResponse, LoginUserResponse } from '@/api/types.gen'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Tipo completo do usuário autenticado.
 * Após o login, o store recebe o perfil básico (id, username, email).
 * Após fetchCurrentUser, o perfil é enriquecido com todos os campos.
 */
type AuthUser = LoginUserResponse['user'] | GetCurrentUserResponse

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // ---------------------------------------------------------------------------
  // Estado
  // ---------------------------------------------------------------------------

  /** Usuário autenticado, ou null quando não há sessão ativa. */
  const user = ref<AuthUser | null>(null)

  /**
   * Indica se a verificação inicial de sessão já foi concluída.
   * Útil para evitar flashes de tela enquanto o app ainda não sabe se o
   * usuário está logado (ex.: mostrar spinner no router guard).
   */
  const isInitialized = ref(false)

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  const isAuthenticated = computed(() => !!user.value)

  /**
   * Retorna o perfil completo apenas quando já foi feito o fetchCurrentUser.
   * Usar em componentes que precisem de campos além de id/username/email.
   */
  const fullProfile = computed(() =>
    user.value && 'role' in user.value ? (user.value as GetCurrentUserResponse) : null,
  )

  // ---------------------------------------------------------------------------
  // Ações
  // ---------------------------------------------------------------------------

  /**
   * Salva o usuário no store após o login.
   * Recebe o objeto `user` retornado pelo endpoint POST /auth/login.
   */
  function setUser(userData: LoginUserResponse['user'] | null) {
    user.value = userData
  }

  /**
   * Busca o perfil completo do usuário logado via GET /auth/me.
   * Deve ser chamado na inicialização do app (ex.: App.vue ou router guard)
   * para restaurar a sessão a partir do cookie httpOnly.
   */
  async function fetchCurrentUser(): Promise<void> {
    try {
      const { data } = await getCurrentUser({ throwOnError: true })
      user.value = data ?? null
    } catch {
      user.value = null
    } finally {
      isInitialized.value = true
    }
  }

  /**
   * Encerra a sessão: chama POST /auth/logout, limpa o estado local
   * e redireciona para a tela de login.
   */
  async function logout(): Promise<void> {
    try {
      await logoutUser()
    } finally {
      user.value = null
      router.push({ name: 'login' })
    }
  }

  /**
   * Limpa o usuário do store sem chamar a API.
   * Útil quando um interceptor de resposta detecta um 401.
   */
  function clearUser(): void {
    user.value = null
  }

  return {
    // estado
    user,
    isInitialized,
    // getters
    isAuthenticated,
    fullProfile,
    // ações
    setUser,
    fetchCurrentUser,
    logout,
    clearUser,
  }
})
