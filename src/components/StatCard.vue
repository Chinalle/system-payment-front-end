<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">{{ title }}</h3>
      <slot name="action" />
    </div>
    <div class="flex items-end gap-2">
      <div class="text-2xl font-semibold">{{ value }}</div>
      <div :class="['badge', positive ? 'text-green-400 border-green-500/20' : 'text-red-400 border-red-500/20']">
        {{ trend }}
      </div>
    </div>
    <p class="text-xs text-gray-400 mt-1">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,
  trend: String,
  positive: { type: Boolean, default: true }
})
</script>
