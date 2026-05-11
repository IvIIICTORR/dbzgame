<script setup lang="ts">
defineProps<{
  name: string
  time: string
  avatar?: string
  content: string
  isMine?: boolean
  isSequence?: boolean
  isVerified?: boolean
  hasNext?: boolean
}>()
</script>

<template>
  <div
    :class="[
      'flex flex-col transition-all',
      isMine ? 'items-end' : 'items-start',
      isSequence ? 'mt-0.5' : 'mt-4',
    ]"
  >
    <div
      v-if="!isSequence"
      :class="['mb-1 flex items-center gap-2', isMine ? 'flex-row-reverse' : 'flex-row']"
    >
      <Avatar v-if="!isMine" :src="avatar" class="size-8 shrink-0 rounded-full" />
      <span class="text-xs font-bold" :class="isMine ? 'text-blue-600' : 'text-neutral-700'">
        {{ isMine ? 'Você' : name }}
      </span>
      <i-ic:round-verified v-if="isVerified" class="size-3.5 text-blue-500" />
      <span class="text-[10px] text-neutral-400">{{ time }}</span>
    </div>

    <div
      :class="[
        'max-w-[85%] rounded-2xl px-3 py-2 text-sm transition-all',
        isMine ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-800',
        isMine
          ? [isSequence ? 'rounded-tr-md' : '', hasNext ? 'rounded-br-md' : '']
          : [isSequence ? 'rounded-tl-md' : '', hasNext ? 'rounded-bl-md' : ''],
      ]"
    >
      {{ content }}
    </div>
  </div>
</template>
