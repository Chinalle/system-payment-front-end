<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">{{ title }}</h3>
    </div>
    <Bar :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend
} from 'chart.js'
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({ title: String })
const data = {
  labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul'],
  datasets: [{
    label: 'Atendimentos',
    data: [20, 25, 22, 28, 30, 40, 45]
  },{
    label: 'Novos Clientes',
    data: [5, 9, 8, 12, 11, 15, 18]
  }]
}
const options = {
  responsive: true,
  plugins: {
    legend: { labels: { color: '#cbd5e1' } }
  },
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } }
  }
}
</script>
