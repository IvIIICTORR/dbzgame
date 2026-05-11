<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    name: string
    type?: 'text' | 'password' | 'email' | 'number'
    autocomplete?: string
    modelValue?: string | number
    error?: string
  }>(),
  {
    type: 'text',
    autocomplete: 'off',
    modelValue: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isPasswordVisible = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const togglePassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<template>
  <div>
    <div
      class="relative flex items-center rounded border-2 transition-all"
      :class="[
        error
          ? 'border-red-500 bg-red-50 focus-within:bg-red-50'
          : 'border-transparent bg-neutral-100 focus-within:border-neutral-950 focus-within:bg-transparent',
      ]"
    >
      <input
        :id="name"
        :name="name"
        :type="inputType"
        :value="modelValue"
        @input="handleInput"
        :autocomplete="autocomplete"
        placeholder=" "
        class="peer block w-full bg-transparent px-4 pt-6 pb-2 font-bold text-neutral-950 outline-none"
      />

      <label
        :for="name"
        :class="error ? 'text-red-500' : 'text-neutral-500'"
        class="pointer-events-none absolute top-5 left-4 text-xs font-extrabold tracking-wider uppercase transition-all peer-focus:top-2.5 peer-focus:left-4 peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[10px]"
      >
        {{ label }}
      </label>

      <button
        v-if="type === 'password'"
        type="button"
        @click="togglePassword"
        @mousedown.prevent
        class="absolute top-2.25 right-3 hidden cursor-pointer pt-2 text-xl text-neutral-400 transition-all peer-focus:block hover:text-neutral-950"
      >
        <i-lucide:eye v-if="!isPasswordVisible" />
        <i-lucide:eye-off v-else />
      </button>
    </div>

    <AuthInputError :message="error" />
  </div>
</template>
