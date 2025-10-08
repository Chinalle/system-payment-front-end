<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

import { Line } from "vue-chartjs";
import { reactive, computed } from 'vue'; 
import { useRouter } from 'vue-router'; // Importar o useRouter

// Registrar Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const router = useRouter(); // Inicializar o router

// -------------------------------------------------------------------
// 1. DADOS MOCKADOS AVANÇADOS (Simulando o Backend)
// -------------------------------------------------------------------

// Mapeamento de meses para gerar os dados do gráfico
const monthLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

// Lista de transações detalhadas (simulando uma API)
const allTransactions = reactive([
  // Janeiro (Jan)
  { date: '2025-01-05', description: 'Mensalidade Ana', type: 'Receita', value: 300.00, status: 'Pago', month: 0 },
  { date: '2025-01-15', description: 'Aluguel do Espaço', type: 'Despesa', value: 150.00, status: 'Pago', month: 0 },
  // Fevereiro (Fev)
  { date: '2025-02-02', description: 'Mensalidade Pedro', type: 'Receita', value: 450.00, status: 'Pago', month: 1 },
  // Março (Mar)
  { date: '2025-03-10', description: 'Mensalidade Lucas', type: 'Receita', value: 400.00, status: 'Pago', month: 2 },
  { date: '2025-03-20', description: 'Energia Elétrica', type: 'Despesa', value: 200.00, status: 'Pendente', month: 2 },
  // Abril (Abr)
  { date: '2025-04-01', description: 'Mensalidade Sofia', type: 'Receita', value: 600.00, status: 'Pago', month: 3 },
  // Maio (Mai)
  { date: '2025-05-12', description: 'Material de Escritório', type: 'Despesa', value: 50.00, status: 'Pago', month: 4 },
  { date: '2025-05-08', description: 'Mensalidade Vários', type: 'Receita', value: 550.00, status: 'Pago', month: 4 },
  // Junho (Jun)
  { date: '2025-06-03', description: 'Serviço Extra Cliente X', type: 'Receita', value: 700.00, status: 'Pago', month: 5 },
  { date: '2025-06-15', description: 'Marketing Digital', type: 'Despesa', value: 350.00, status: 'Pago', month: 5 },
]);

// -------------------------------------------------------------------
// 2. LÓGICA DE PROCESSAMENTO (Criando os dados do gráfico)
// -------------------------------------------------------------------

// Propriedade COMPUTADA que agrupa e soma os valores por mês
const monthlySummary = computed(() => {
  const summary = Array(monthLabels.length).fill(0).map(() => ({ receita: 0, despesa: 0 }));

  allTransactions.forEach(t => {
    if (t.status === 'Pago' || t.status === 'Recebido') {
      const monthIndex = t.month;
      if (t.type === 'Receita') {
        summary[monthIndex].receita += t.value;
      } else if (t.type === 'Despesa') {
        summary[monthIndex].despesa += t.value;
      }
    }
  });
  return summary;
});

// Propriedade COMPUTADA para formatar os dados para o Chart.js
const chartData = computed(() => ({
  labels: monthLabels,
  datasets: [
    {
      label: "Receita Paga (R$)",
      data: monthlySummary.value.map(m => m.receita),
      borderColor: "#4ade80", // Verde
      backgroundColor: "rgba(74, 222, 128, 0.2)",
      tension: 0.3,
      fill: true,
    },
    {
      label: "Despesa Paga (R$)",
      data: monthlySummary.value.map(m => m.despesa),
      borderColor: "#f87171", // Vermelho
      backgroundColor: "rgba(248, 113, 113, 0.2)",
      tension: 0.3,
      fill: true,
    },
  ],
}));

// Opções do gráfico (usando a propriedade reativa 'chartData')
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#fff" } },
  },
  scales: {
    x: { 
      ticks: { color: "#fff" }, 
      grid: { color: "rgba(255, 255, 255, 0.1)" } 
    },
    y: { 
      ticks: { 
        color: "#fff",
        callback: function(value) { return 'R$ ' + value.toFixed(2); }
      }, 
      grid: { color: "rgba(255, 255, 255, 0.1)" }
    },
  },
};

// Dados para a tabela (ordenados por data decrescente)
const recentTransactions = computed(() => {
    return [...allTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Função de formatação (para a tabela)
const formatCurrency = (value) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
};
const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

// Classe Tailwind condicional para status
const getStatusClass = (status) => {
    switch (status) {
        case 'Pago':
        case 'Recebido':
            return 'text-green-400';
        case 'Pendente':
        case 'A Pagar':
            return 'text-yellow-400';
        case 'Atrasado':
            return 'text-red-400';
        default:
            return 'text-gray-400';
    }
};

// NOVA FUNÇÃO: Redirecionar para o Checkout
const goToCheckout = () => {
    router.push('/checkout');
}
</script>

<template>
  <div class="p-6">
    <!-- CABEÇALHO E BOTÃO DE PAGAMENTO -->
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-100">💰 Dashboard Financeiro</h2>
        
        <button
            @click="goToCheckout"
            class="px-4 py-2 rounded-lg font-bold transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
        >
            + Nova Receita / Pagamento
        </button>
    </div>

    <div class="bg-gray-800 p-4 rounded-2xl shadow w-full h-80 mb-6">
      <h3 class="text-lg font-semibold mb-2 text-gray-200">Visão Geral Mensal</h3>
      <Line :data="chartData" :options="chartOptions" /> 
    </div>

    <div class="bg-gray-800 p-4 rounded-2xl shadow">
      <h3 class="text-lg font-semibold mb-4 text-gray-200">Transações Recentes</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="text-gray-400 border-b border-gray-700">
              <th class="pb-2 pt-2 pr-4">Data</th>
              <th class="pb-2 pt-2 pr-4">Descrição</th>
              <th class="pb-2 pt-2 pr-4">Tipo</th>
              <th class="pb-2 pt-2 pr-4 text-right">Valor</th>
              <th class="pb-2 pt-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody class="text-gray-200 divide-y divide-gray-700">
            <tr v-for="transaction in recentTransactions" :key="transaction.date + transaction.description">
              <td class="py-2 pr-4">{{ formatDate(transaction.date) }}</td>
              <td class="py-2 pr-4">{{ transaction.description }}</td>
              <td class="py-2 pr-4" :class="transaction.type === 'Receita' ? 'text-green-500' : 'text-red-500'">
                {{ transaction.type }}
              </td>
              <td class="py-2 pr-4 font-medium text-right" :class="transaction.type === 'Receita' ? 'text-green-400' : 'text-red-400'">
                {{ formatCurrency(transaction.value) }}
              </td>
              <td class="py-2 pr-4">
                <span :class="getStatusClass(transaction.status)">{{ transaction.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos globais para a página */
.p-6 {
  background-color: #1f2937; /* Fundo cinza escuro */
  min-height: 100vh;
}
/* Altera o bg dos cards para um tom um pouco mais escuro */
.bg-gray-800 {
  background-color: #1f2937; 
}
.bg-gray-900 {
    background-color: #111827; 
}
</style>
