<script setup lang="ts">
interface Props {
  modelValue: boolean
  id: string
  label?: string
  error?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="group flex items-center gap-3">
      <div class="relative flex size-5 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          :id="id"
          :name="id"
          :checked="modelValue"
          @change="handleChange"
          class="peer absolute z-10 size-full cursor-pointer opacity-0"
        />

        <div
          class="flex size-full items-center justify-center rounded-md bg-neutral-100 transition-all duration-200 peer-checked:scale-110 peer-checked:bg-red-600 peer-hover:bg-neutral-200 peer-checked:peer-hover:bg-red-700 peer-active:scale-95 peer-checked:[&_svg]:scale-100 peer-checked:[&_svg]:opacity-100"
          :class="[
            error
              ? 'border border-red-600 bg-red-50 peer-checked:bg-red-600 peer-hover:bg-red-200'
              : 'border-transparent bg-neutral-100 peer-checked:bg-red-600 peer-hover:bg-neutral-200',
          ]"
        >
          <i-streamline-sharp:check-solid
            class="size-3 scale-50 text-white opacity-0 transition-all duration-200"
          />
        </div>
      </div>

      <label
        :for="id"
        class="cursor-pointer text-sm font-semibold transition-colors select-none"
        :class="[error ? 'text-red-500' : 'text-neutral-600 group-hover:text-neutral-950']"
      >
        <slot>{{ label }}</slot>
      </label>
    </div>

    <AuthInputError :message="error" />
  </div>
</template>
