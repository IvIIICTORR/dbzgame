<script setup lang="ts">
import { ref } from 'vue'

interface Option {
  label: string
  value: string | number
}

defineProps<{
  label: string
  name: string
  options: Option[]
  modelValue?: string | number
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isFocused = ref(false)

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="mb-4">
    <div
      class="relative flex items-center rounded border-2 transition-all"
      :class="[
        error
          ? 'border-red-500 bg-red-50 focus-within:bg-red-50'
          : 'border-transparent bg-neutral-100 focus-within:border-neutral-950 focus-within:bg-transparent',
      ]"
    >
      <select
        :id="name"
        :name="name"
        :value="modelValue"
        @change="handleChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
        class="peer block w-full appearance-none bg-transparent px-4 pt-6 pb-2 font-bold text-neutral-950 outline-none"
      >
        <option value="" disabled selected hidden></option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          class="bg-white font-sans font-normal"
        >
          {{ option.label }}
        </option>
      </select>

      <label
        :for="name"
        :class="[
          'pointer-events-none absolute left-4 font-extrabold tracking-wider uppercase transition-all',
          error ? 'text-red-500' : 'text-neutral-500',
          isFocused || modelValue ? 'top-2.5 text-[10px]' : 'top-5 text-xs',
        ]"
      >
        {{ label }}
      </label>

      <div class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400">
        <i-lucide:chevron-down class="text-xl" />
      </div>
    </div>

    <AuthInputError :message="error" />
  </div>
</template>
