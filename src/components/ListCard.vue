<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">{{ title }}</h3>
      <slot name="action" />
    </div>
    <div class="space-y-3">
      <div v-for="item in items" :key="item.id" class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <img :src="item.avatar || 'https://i.pravatar.cc/100?u=' + item.name" class="w-8 h-8 rounded-full" />
          <div>
            <div class="text-sm font-medium">{{ item.name }}</div>
            <div class="text-xs text-gray-400">{{ item.meta }}</div>
          </div>
        </div>
        <span class="badge" :class="pillColor(item.pill)">{{ item.pill }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  items: Array
})

const pillColor = (pill) => {
  if (!pill) return 'border-white/10 text-gray-300'
  if (/(ok|online|confirmado|ativo)/i.test(pill)) return 'border-green-500/20 text-green-400'
  if (/(pendente|aguardando)/i.test(pill)) return 'border-yellow-500/20 text-yellow-400'
  if (/(erro|cancelado|inativo)/i.test(pill)) return 'border-red-500/20 text-red-400'
  return 'border-white/10 text-gray-300'
}
</script>
