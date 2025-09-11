<template>
  <div class="card">
    <div class="card-header"><h3 class="card-title">{{ title }}</h3></div>
    <Line :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend
} from 'chart.js'
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

const props = defineProps({ title: String })
const data = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  datasets: [{
    label: 'Faturamento (R$)',
    data: [620, 540, 700, 480, 920, 800, 560],
    tension: 0.35,
    fill: false
  }]
}
const options = {
  responsive: true,
  plugins: { legend: { labels: { color: '#cbd5e1' } } },
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } }
  }
}
</script>
