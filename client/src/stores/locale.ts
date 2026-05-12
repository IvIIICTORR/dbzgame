import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref('pt-br')

  function setLocale(newLocale: string) {
    locale.value = newLocale
  }

  return { locale, setLocale }
})
