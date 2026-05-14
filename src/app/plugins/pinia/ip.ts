import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIpStore = defineStore('ip', () => {
  const value = ref('')

  const set = (ip) => {
    if (!ip) return

    value.value = ip
  }

  return { value, set }
})
