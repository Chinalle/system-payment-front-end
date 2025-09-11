<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Calendário</h3>
      <div class="flex items-center gap-2 text-sm">
        <button class="px-2 py-1 bg-white/5 rounded-lg" @click="prevMonth">◀</button>
        <div class="opacity-80">{{ monthName }} {{ year }}</div>
        <button class="px-2 py-1 bg-white/5 rounded-lg" @click="nextMonth">▶</button>
      </div>
    </div>

    <div class="grid grid-cols-7 text-xs text-gray-400 mb-2">
      <div v-for="d in weekdays" :key="d" class="p-2">{{ d }}</div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div v-for="n in startOffset" :key="'e'+n"></div>
      <button
        v-for="d in daysInMonth"
        :key="d"
        class="p-2 rounded-lg text-sm hover:bg-white/5 border border-white/5"
        :class="{'bg-white/10 border-primary text-white font-medium': isToday(d)}"
      >
        {{ d }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const today = new Date()
const current = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const year = computed(() => current.value.getFullYear())
const month = computed(() => current.value.getMonth())
const monthName = computed(() => current.value.toLocaleString('pt-BR', { month: 'long' }).replace(/^./, m => m.toUpperCase()))

const daysInMonth = computed(() => new Date(year.value, month.value + 1, 0).getDate())
const startOffset = computed(() => new Date(year.value, month.value, 1).getDay())

function prevMonth() { current.value = new Date(year.value, month.value - 1, 1) }
function nextMonth() { current.value = new Date(year.value, month.value + 1, 1) }
function isToday(d) {
  return today.getFullYear() === year.value &&
         today.getMonth() === month.value &&
         today.getDate() === d
}
</script>
