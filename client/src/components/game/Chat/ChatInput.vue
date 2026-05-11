<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  send: [content: string]
  typing: []
}>()

const MAX_LENGTH = 200

const { input: message, textarea } = useTextareaAutosize()

const isMessageEmpty = computed(() => !message.value?.trim())
const charCount = computed(() => message.value?.length ?? 0)

function handleSend() {
  if (isMessageEmpty.value || props.disabled) return
  emit('send', message.value.trim())
  message.value = ''
}

function handleInput() {
  emit('typing')
}

function handleEsc() {
  textarea.value?.blur()
}
</script>

<template>
  <div class="group relative mt-6 flex flex-col gap-2">
    <!-- Contador de caracteres -->
    <div
      v-if="charCount > MAX_LENGTH * 0.8"
      class="absolute -top-4 right-4 text-[10px] font-bold tracking-wider uppercase transition-colors"
      :class="charCount > MAX_LENGTH ? 'text-red-500' : 'text-gray-400'"
    >
      {{ charCount }} / {{ MAX_LENGTH }}
    </div>

    <div
      class="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-1.5 transition-all focus-within:border-blue-400/70 focus-within:ring-4 focus-within:ring-blue-500/10"
      :class="{ 'pointer-events-none opacity-50': disabled }"
    >
      <div class="relative flex-1 pl-2">
        <textarea
          ref="textarea"
          v-model="message"
          rows="1"
          :maxlength="MAX_LENGTH"
          :disabled="disabled"
          placeholder="Pressione Enter para enviar..."
          @keydown.enter.exact.prevent="handleSend"
          @keydown.esc="handleEsc"
          @input="handleInput"
          class="block w-full resize-none bg-transparent py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          style="max-height: 150px"
        />
      </div>

      <button
        type="button"
        @click="handleSend"
        :disabled="isMessageEmpty || disabled"
        class="group/btn relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-600 font-medium text-white transition-all duration-300 active:scale-90 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        <div
          class="absolute inset-0 bg-linear-to-tr from-black/20 to-transparent opacity-0 transition-opacity group-hover/btn:opacity-100"
        />
        <i-mingcute:arrow-up-line
          class="size-5 transition-transform duration-300"
          :class="{ '-translate-y-1 group-hover/btn:scale-110': !isMessageEmpty }"
        />
      </button>
    </div>

    <span
      class="px-3 text-[10px] font-medium tracking-widest text-gray-400 uppercase opacity-0 transition-opacity group-focus-within:opacity-100"
    >
      ENTER para enviar • ESC para cancelar
    </span>
  </div>
</template>

<style scoped>
textarea {
  scrollbar-width: none;
  -ms-overflow-style: none;
  line-height: 1.25rem;
}
textarea::-webkit-scrollbar {
  display: none;
}

textarea::placeholder {
  transition: transform 0.2s ease;
}
textarea:focus::placeholder {
  transform: translateX(4px);
  opacity: 0.7;
}
</style>
