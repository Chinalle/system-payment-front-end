<template>

</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import {
  Chart, ArcElement, Tooltip, Legend
} from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)

const props = defineProps({ title: String })
const data = {
  labels: ['Cartão', 'PIX', 'Dinheiro', 'Boleto'],
  datasets: [{
    data: [55, 25, 15, 5]
  }]
}
const options = {
  responsive: true,
  plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } }
}
</script>
