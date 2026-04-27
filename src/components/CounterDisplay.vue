<script setup lang="ts">
interface Props {
  value: number
  label: string
  size?: 'md' | 'lg'
}

const { size = 'md' } = defineProps<Props>()
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <span class="text-surface-500 text-xs uppercase tracking-wider">{{ label }}</span>
    <span class="font-bold tabular-nums" :class="size === 'lg' ? 'text-7xl' : 'text-5xl'">
      {{ value }}
    </span>
  </div>
</template>
