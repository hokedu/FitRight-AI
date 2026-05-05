import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const currentSessionId = ref(null)

  const setCurrentSession = (id) => {
    currentSessionId.value = id
  }

  const clearCurrentSession = () => {
    currentSessionId.value = null
  }

  return { currentSessionId, setCurrentSession, clearCurrentSession }
})
