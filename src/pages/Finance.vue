<script setup lang="ts">
import {
  Chart as ChartJS,
  Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, BarElement
} from "chart.js";
import { Line, Bar } from "vue-chartjs";
import { reactive, computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

// Registrar Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement);

const router = useRouter();

// Definição do tipo para as transações para melhor type safety
interface Transaction {
  date: string;
  description: string;
  type: 'Receita' | 'Recebimento' | 'Despesa' | 'Saque';
  value: number;
  status: 'Pago' | 'Recebido' | 'Pendente' | 'A Pagar' | 'Atrasado';
  month: number; // Considerar remover ou calcular dinamicamente
}

// -------------------------------------------------------------------
// DADOS MOCKADOS
// -------------------------------------------------------------------
const allTransactions = reactive<Transaction[]>([ // Adicionada tipagem
  { date: '2025-10-25', description: 'Recebimento Cliente A', type: 'Recebimento', value: 250.00, status: 'Pago', month: 9 },
  { date: '2025-10-24', description: 'Saque para despesas', type: 'Saque', value: 100.00, status: 'Pago', month: 9 },
  { date: '2025-10-24', description: 'Consulta Dr. Silva', type: 'Receita', value: 150.00, status: 'Pendente', month: 9 },
  { date: '2025-10-23', description: 'Pagamento Fornecedor X', type: 'Despesa', value: 200.00, status: 'Pago', month: 9 },
  { date: '2025-10-22', description: 'Serviço Cliente Y', type: 'Receita', value: 300.00, status: 'Pago', month: 9 },
  { date: '2025-10-18', description: 'Mensalidade Academia', type: 'Despesa', value: 80.00, status: 'Pago', month: 9 },
  { date: '2025-10-15', description: 'Receita Cliente Z', type: 'Receita', value: 500.00, status: 'Pago', month: 9 },
  { date: '2025-01-05', description: 'Mensalidade Ana', type: 'Receita', value: 300.00, status: 'Pago', month: 0 },
  { date: '2025-01-15', description: 'Aluguel do Espaço', type: 'Despesa', value: 150.00, status: 'Pago', month: 0 },
  { date: '2025-02-02', description: 'Mensalidade Pedro', type: 'Receita', value: 450.00, status: 'Pago', month: 1 },
  { date: '2025-03-10', description: 'Mensalidade Lucas', type: 'Receita', value: 400.00, status: 'Pago', month: 2 },
  { date: '2025-03-20', description: 'Energia Elétrica', type: 'Despesa', value: 200.00, status: 'Pendente', month: 2 },
  { date: '2025-04-01', description: 'Mensalidade Sofia', type: 'Receita', value: 600.00, status: 'Pago', month: 3 },
  { date: '2025-05-12', description: 'Material de Escritório', type: 'Despesa', value: 50.00, status: 'Pago', month: 4 },
  { date: '2025-05-08', description: 'Mensalidade Vários', type: 'Receita', value: 550.00, status: 'Pago', month: 4 },
  { date: '2025-06-03', description: 'Serviço Extra Cliente X', type: 'Receita', value: 700.00, status: 'Pago', month: 5 },
  { date: '2025-06-15', description: 'Marketing Digital', type: 'Despesa', value: 350.00, status: 'Pago', month: 5 },
]);

// -------------------------------------------------------------------
// CÁLCULOS PARA OS CARDS DE RESUMO
// -------------------------------------------------------------------
const totalAReceber = computed(() =>
  allTransactions
    .filter(t => t.type === 'Receita' || t.type === 'Recebimento')
    .reduce((sum, t) => sum + t.value, 0)
);

const totalRecebido = computed(() =>
  allTransactions
    .filter(t => (t.type === 'Receita' || t.type === 'Recebimento') && (t.status === 'Pago' || t.status === 'Recebido'))
    .reduce((sum, t) => sum + t.value, 0)
);

const totalPendente = computed(() =>
  allTransactions
    .filter(t => (t.type === 'Receita' || t.type === 'Recebimento') && t.status === 'Pendente')
    .reduce((sum, t) => sum + t.value, 0)
);

// -------------------------------------------------------------------
// LÓGICA PARA O GRÁFICO
// -------------------------------------------------------------------
const chartView = ref<'mensal' | 'semanal' | 'diario' | 'personalizado'>('mensal');
const customStartDate = ref<string>('');
const customEndDate = ref<string>('');
const monthLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const getWeekNumber = (d: Date): number => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
};


const processedChartData = computed(() => {
  const labels: string[] = [];
  const receitaData: number[] = [];
  const despesaData: number[] = [];
  const now = new Date();

  const filterTransactionsByDate = (transactions: Transaction[]): Transaction[] => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      if (chartView.value === 'personalizado' && customStartDate.value && customEndDate.value) {
          const start = new Date(customStartDate.value + 'T00:00:00');
          const end = new Date(customEndDate.value + 'T23:59:59');
          return transactionDate >= start && transactionDate <= end;
      } else if (chartView.value === 'semanal') {
          const transactionWeek = getWeekNumber(transactionDate);
          const currentWeek = getWeekNumber(now);
          const startWeek = Math.max(1, currentWeek - 7);
          return transactionWeek >= startWeek && transactionWeek <= currentWeek;
      } else if (chartView.value === 'diario') {
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 6);
          return transactionDate >= new Date(sevenDaysAgo.toISOString().split('T')[0] + 'T00:00:00') &&
                 transactionDate <= new Date(now.toISOString().split('T')[0] + 'T23:59:59');
      }
      return true;
    });
  };

  const filteredTransactions = filterTransactionsByDate(allTransactions);

  const calculateSummary = (transactions: Transaction[]) => {
    const summary: { [key: string]: { receita: number, despesa: number } } = {};
    transactions.forEach(t => {
      if (t.status === 'Pago' || t.status === 'Recebido') {
        let key = '';
        const transactionDate = new Date(t.date);
        if (chartView.value === 'mensal') {
             if (transactionDate.getFullYear() !== now.getFullYear()) return;
             key = monthLabels[transactionDate.getMonth()];
        } else if (chartView.value === 'semanal') {
            key = `Sem ${getWeekNumber(transactionDate)}`;
        } else {
            key = t.date;
        }
        if (!summary[key]) summary[key] = { receita: 0, despesa: 0 };
        if (t.type === 'Receita' || t.type === 'Recebimento') summary[key].receita += t.value;
        else if (t.type === 'Despesa' || t.type === 'Saque') summary[key].despesa += t.value;
      }
    });
    return summary;
  };

  const summaryData = calculateSummary(filteredTransactions);

   if (chartView.value === 'mensal') {
     const currentMonthIndex = now.getMonth();
     const relevantMonths = allTransactions.length > 0
        ? Math.max(currentMonthIndex, ...allTransactions.map(t => new Date(t.date).getMonth()))
        : currentMonthIndex;
    for(let i = 0; i <= relevantMonths; i++){
        const monthKey = monthLabels[i];
        labels.push(monthKey);
        receitaData.push(summaryData[monthKey]?.receita || 0);
        despesaData.push(summaryData[monthKey]?.despesa || 0);
    }
  } else if (chartView.value === 'semanal') {
      const currentWeek = getWeekNumber(now);
      const startWeek = Math.max(1, currentWeek - 7);
      for (let w = startWeek; w <= currentWeek; w++) {
          const weekKey = `Sem ${w}`;
          labels.push(weekKey);
          receitaData.push(summaryData[weekKey]?.receita || 0);
          despesaData.push(summaryData[weekKey]?.despesa || 0);
      }
  } else {
      Object.keys(summaryData).sort().forEach(dateStr => {
          const [year, month, day] = dateStr.split('-');
          labels.push(`${day}/${month}`);
          receitaData.push(summaryData[dateStr].receita);
          despesaData.push(summaryData[dateStr].despesa);
      });
  }
  return { labels, receitaData, despesaData };
});


const chartData = computed(() => ({
  labels: processedChartData.value.labels,
  datasets: [
    {
      label: "Entradas Pagas (R$)",
      data: processedChartData.value.receitaData,
      borderColor: "#4ade80",
      backgroundColor: "rgba(74, 222, 128, 0.5)",
      tension: 0.3,
      fill: true,
    },
    {
      label: "Saídas Pagas (R$)",
      data: processedChartData.value.despesaData,
      borderColor: "#f87171",
      backgroundColor: "rgba(248, 113, 113, 0.5)",
      tension: 0.3,
      fill: true,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#cbd5e1" } },
    tooltip: {
       callbacks: {
            label: function(context: any) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed?.y !== null && context.parsed?.y !== undefined) {
                    label += formatCurrency(context.parsed.y);
                }
                return label;
            }
        }
    }
  },
  scales: {
    x: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255, 255, 255, 0.1)" } },
    y: {
      ticks: {
        color: "#cbd5e1",
        callback: function(value: number | string) { return formatCurrency(typeof value === 'number' ? value : parseFloat(value)); }
      },
      grid: { color: "rgba(255, 255, 255, 0.1)" }
    },
  },
};

// -------------------------------------------------------------------
// LÓGICA DA TABELA E FUNÇÕES AUXILIARES
// -------------------------------------------------------------------
const recentTransactions = computed(() => {
    return [...allTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const formatCurrency = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) return 'R$ 0,00';
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
};
const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString || !dateString.includes('-')) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};
const getStatusClass = (status: string): string => {
    switch (status) {
        case 'Pago': case 'Recebido': return 'text-green-400';
        case 'Pendente': case 'A Pagar': return 'text-yellow-400';
        case 'Atrasado': return 'text-red-400';
        default: return 'text-gray-400';
    }
};

const goToCheckout = () => { router.push('/checkout'); };
const goToBankAccounts = () => { router.push('/bank-accounts-company'); };
const setChartView = (view: 'mensal' | 'semanal' | 'diario') => {
    chartView.value = view;
    customStartDate.value = '';
    customEndDate.value = '';
};
const handleDateChange = () => {
    if (customStartDate.value && customEndDate.value) {
        if (new Date(customEndDate.value) < new Date(customStartDate.value)) {
           customEndDate.value = customStartDate.value;
        }
        chartView.value = 'personalizado';
    }
};

// --- CORREÇÃO AQUI: FUNÇÕES DEFINIDAS ---
const getTypeClass = (type: Transaction['type']): string => { // Adicionada tipagem
    if (type === 'Receita' || type === 'Recebimento') {
        return 'text-green-500';
    } else if (type === 'Despesa' || type === 'Saque') {
        return 'text-red-500';
    }
    return 'text-gray-400';
};

const getValueClass = (type: Transaction['type']): string => { // Adicionada tipagem
    if (type === 'Receita' || type === 'Recebimento') {
        return 'text-green-400';
    } else if (type === 'Despesa' || type === 'Saque') {
        return 'text-red-400';
    }
    return 'text-gray-300';
}
// --- FIM DA CORREÇÃO ---

</script>

<template>
  <div class="p-6 bg-gray-900 min-h-screen text-gray-300">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-100">Dashboard Financeiro</h2>
      <div class="flex space-x-4">
        <button
          @click="goToBankAccounts"
          class="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
        >
          + Cadastro contas bancarias
        </button>
      </div>
    </div>

    <!-- CARDS DE RESUMO -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">Total a Receber</h3>
          <p class="text-3xl font-semibold text-blue-400 mt-2">{{ formatCurrency(totalAReceber) }}</p>
      </div>
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">Valor Recebido</h3>
          <p class="text-3xl font-semibold text-green-400 mt-2">{{ formatCurrency(totalRecebido) }}</p>
      </div>
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">Valor Pendente</h3>
          <p class="text-3xl font-semibold text-yellow-400 mt-2">{{ formatCurrency(totalPendente) }}</p>
      </div>
    </div>

    <!-- GRÁFICO COM SELETORES DE VISÃO E DATAS -->
    <div class="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
      <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h3 class="text-xl font-semibold text-gray-100">Visão Geral</h3>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Botões Pré-definidos -->
          <button @click="setChartView('diario')" :class="['px-3 py-1 text-sm rounded-md transition', chartView === 'diario' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300']">Diário</button>
          <button @click="setChartView('semanal')" :class="['px-3 py-1 text-sm rounded-md transition', chartView === 'semanal' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300']">Semanal</button>
          <button @click="setChartView('mensal')" :class="['px-3 py-1 text-sm rounded-md transition', chartView === 'mensal' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300']">Mensal</button>
          
          <span class="text-gray-500 mx-1">|</span>

          <!-- Seletores de Data Personalizados -->
          <div class="flex items-center gap-2">
             <input
               type="date"
               v-model="customStartDate"
               @change="handleDateChange"
               class="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
               aria-label="Data de início"
             >
             <span class="text-gray-500">até</span>
             <input
               type="date"
               v-model="customEndDate"
               @change="handleDateChange"
               class="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
               aria-label="Data de fim"
             >
          </div>
        </div>
      </div>
      <div class="h-80">
        <!-- Lógica para escolher o tipo de gráfico -->
         <Bar v-if="chartView === 'diario' || chartView === 'semanal' || chartView === 'personalizado'" :data="chartData" :options="chartOptions" />
         <Line v-else :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- TABELA DE TRANSAÇÕES (Atualizada) -->
    <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 class="text-xl font-semibold mb-4 text-gray-100">Transações Recentes</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="text-gray-400 border-b border-gray-700 text-sm">
              <th class="py-3 px-4 font-medium">Data</th>
              <th class="py-3 px-4 font-medium">Descrição</th>
              <th class="py-3 px-4 font-medium">Tipo</th>
              <th class="py-3 px-4 font-medium text-right">Valor</th>
              <th class="py-3 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="text-gray-300 divide-y divide-gray-700">
            <tr v-if="recentTransactions.length === 0">
                 <td colspan="5" class="py-4 px-4 text-center text-gray-500">Nenhuma transação encontrada.</td>
            </tr>
            <tr v-for="(transaction, index) in recentTransactions" :key="index" class="hover:bg-gray-700/50 text-sm">
              <td class="py-3 px-4">{{ formatDate(transaction.date) }}</td>
              <td class="py-3 px-4">{{ transaction.description }}</td>
              <!-- Aplica a cor com base na nova função getTypeClass -->
              <td class="py-3 px-4" :class="getTypeClass(transaction.type)">
                {{ transaction.type }}
              </td>
              <!-- Aplica a cor com base na nova função getValueClass -->
              <td class="py-3 px-4 font-medium text-right" :class="getValueClass(transaction.type)">
                {{ formatCurrency(transaction.value) }}
              </td>
              <td class="py-3 px-4">
                <span :class="getStatusClass(transaction.status)" class="font-medium">{{ transaction.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
   /* Estilo base para botões */
    @apply px-4 py-2 rounded-lg font-bold transition-all;
}
.bg-gray-800 {
  background-color: #1f2937;
}
.bg-gray-900 {
    background-color: #111827;
}
.bg-blue-600 {
     @apply shadow-lg shadow-blue-600/30;
}
/* Nova classe para o botão de contas bancárias (cinza) */
.bg-gray-600 {
    background-color: #4b5563; /* Tom de cinza */
}
.hover\:bg-gray-700:hover {
     background-color: #374151; /* Tom de cinza mais escuro no hover */
}


/* Estilo para inputs de data para combinar com o tema escuro */
input[type="date"] {
    color-scheme: dark; /* Adapta o calendário interno para o tema escuro */
}
/* Opcional: Estilo para o ícone do calendário no Chrome/Edge */
input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(0.6); /* Deixa o ícone mais claro */
}

</style>

