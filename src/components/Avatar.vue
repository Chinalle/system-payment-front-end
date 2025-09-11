<template>
  <div class="relative">
    <img :src="src" :alt="name" class="w-8 h-8 rounded-full object-cover" />
    <span
      v-if="status"
      :class="['absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card', statusClass]"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
  src: { type: String, default: 'https://i.pravatar.cc/100?img=1' },
  status: { type: String, default: '' } // 'online' | 'offline' | 'busy'
})

const statusClass = computed(() => {
  if (props.status === 'online') return 'bg-green-500'
  if (props.status === 'busy') return 'bg-yellow-500'
  if (props.status === 'offline') return 'bg-gray-500'
  return 'hidden'
})
</script>
