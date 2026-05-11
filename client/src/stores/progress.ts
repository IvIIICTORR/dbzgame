import { defineStore } from 'pinia'

interface ProgressState {
  width: number
  isVisible: boolean
  interval: ReturnType<typeof setInterval> | null
}

export const useProgressStore = defineStore('progress', {
  state: (): ProgressState => ({
    width: 0,
    isVisible: false,
    interval: null,
  }),
  actions: {
    start() {
      this.isVisible = true
      this.width = 0
      if (this.interval) clearInterval(this.interval)

      this.interval = setInterval(() => {
        if (this.width < 90) this.width += Math.random() * 10
      }, 200)
    },
    finish() {
      if (this.interval) clearInterval(this.interval)
      this.width = 100

      setTimeout(() => {
        this.isVisible = false
        setTimeout(() => {
          this.width = 0
        }, 200)
      }, 300)
    },
  },
})
