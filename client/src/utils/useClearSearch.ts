import { ref } from 'vue'

export function useClearSearch() {
  const searchQuery = ref('')
  const searchInput = ref<HTMLInputElement | null>(null)

  const clearSearch = () => {
    searchQuery.value = ''
    setTimeout(() => {
      searchInput.value?.focus()
    }, 0)
  }

  return {
    searchQuery,
    searchInput,
    clearSearch,
  }
}
