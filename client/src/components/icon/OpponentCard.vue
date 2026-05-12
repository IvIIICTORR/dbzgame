<script setup lang="ts">
defineProps<{
  name: string
  level: number
  race: string
  transformation: string
  currentHp: number
  maxHp: number
  currentKi: number
  maxKi: number
  avatarUrl: string
  isDead: boolean
  isSelected: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<template>
  <div
    @click="$emit('select')"
    class="relative flex items-center gap-3 px-4 py-3 border cursor-pointer transition-all duration-300"
    :class="[
      isDead ? 'opacity-40 grayscale' : 'hover:border-red-500/50 hover:bg-red-500/5',
      isSelected ? 'border-red-500 bg-red-500/10' : 'border-neutral-200'
    ]"
  >
    <div class="relative shrink-0">
      <img :src="avatarUrl" class="size-10 rounded-full object-cover" />
      <span
        v-if="isDead"
        class="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black px-1 rounded"
      >
        K.O.
      </span>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span class="text-sm font-black uppercase italic truncate" :class="isDead ? 'text-neutral-400' : 'text-neutral-900'">{{ name }}</span>
        <span class="text-[9px] font-bold text-neutral-400">Lv.{{ level }}</span>
      </div>
      <div class="flex gap-2 mt-1">
        <div class="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div class="h-full bg-red-500 transition-all" :style="`width: ${(currentHp / maxHp) * 100}%`" />
        </div>
        <div class="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div class="h-full bg-cyan-500 transition-all" :style="`width: ${(currentKi / maxKi) * 100}%`" />
        </div>
      </div>
    </div>
  </div>
</template>
