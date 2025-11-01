<template>
  
  <div class="container-grid">
    <!-- Coluna 1: AGENDA & PESSOAS (HOJE, CLIENTES, PRESTADORES) -->
    <section class="space-y-6">
      
      <!-- 1. Card HOJE (ListCard) - Mover para o topo -->
      <ListCard
        title="Hoje"
        :items="
          clients.map(c => ({
            id: c.id,
            name: c.name,
            meta: c.service + ' • ' + c.next,
            pill: 'Agendado'
          }))
        "
      />

      <!-- 2. Card CLIENTES - Embaixo de HOJE -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Clientes</h3>
          <button
            class="text-xs px-2 py-1 rounded-lg bg-primary/20 border border-primary/30"
          >
            + Adicionar
          </button>
        </div>
        <div class="grid gap-3">
          <div
            v-for="c in clients"
            :key="c.id"
            class="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-3 py-2"
          >
            <div class="flex items-center gap-3">
              <img
                :src="'https://i.pravatar.cc/100?u='+c.name"
                class="w-8 h-8 rounded-full"
              />
              <div>
                <div class="text-sm font-medium">{{ c.name }}</div>
                <div class="text-xs text-gray-400">{{ c.service }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="badge border-primary/30 text-primary">{{
                c.status
              }}</span>
              <span class="text-xs text-gray-400">{{ c.next }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 3. Card PRESTADORES - Embaixo de CLIENTES -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Prestadores</h3>
          <button
            class="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/5"
          >
            Convites
          </button>
        </div>
        <div class="space-y-3">
          <div
            v-for="p in providers"
            :key="p.id"
            class="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-3"
          >
            <div class="flex items-center gap-3">
              <img
                :src="'https://i.pravatar.cc/100?u='+p.name"
                class="w-9 h-9 rounded-full"
              />
              <div>
                <div class="text-sm font-medium">{{ p.name }}</div>
                <div class="text-xs text-gray-400">{{ p.role }}</div>
              </div>
            </div>
            <span
              class="badge"
              :class="
                p.online
                  ? 'border-green-500/20 text-green-400'
                  : 'border-gray-500/20 text-gray-400'
              "
            >
              {{ p.online ? "Online" : "Offline" }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Coluna 2: BACK-OFFICE & FINANÇAS -->
    <section class="space-y-6">
      
      <!-- 1. Card BACK-OFFICE (Antigas Receita/Despesas/Conversão) -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Back-Office</h3>
          <div class="text-sm text-gray-400">Indicadores Operacionais</div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <StatCard
            title="Receita Bruta"
            :value="'R$ ' + metrics.revenue"
            subtitle="semana"
            trend="+12%"
            :positive="true"
          />
          <StatCard
            title="Despesas Fixas"
            :value="'R$ ' + metrics.expenses"
            subtitle="semana"
            trend="-4%"
            :positive="false"
          />
          <StatCard
            title="Conversão"
            :value="(metrics.conversion * 100).toFixed(1) + '%'"
            subtitle="30 dias"
            trend="+2%"
            :positive="true"
          />
        </div>
      </div>
      
      <!-- 2. NOVO Card: DESEMPENHO FINANCEIRO (Profissional) -->
      <div class="card bg-gray-800 border-yellow-500/20 shadow-yellow-500/10">
        <div class="card-header border-b border-yellow-500/30">
          <h3 class="card-title text-yellow-300">Desempenho Financeiro</h3>
          <div class="text-sm text-yellow-500">Métricas Chave</div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <StatCard
            title="Lucro Líquido"
            :value="'R$ ' + (metrics.revenue - metrics.expenses)"
            subtitle="mês atual"
            trend="+8%"
            :positive="true"
          />
          <StatCard
            title="Ticket Médio"
            value="R$ 105.50"
            subtitle="últimos 30 dias"
            trend="+1.5%"
            :positive="true"
          />
          <StatCard
            title="Churn Rate"
            value="3.2%"
            subtitle="clientes perdidos"
            trend="-0.5%"
            :positive="true"
          />
        </div>
      </div>

      <!-- 3. Seleção de serviços (REMOVIDO) -->
      <!-- 4. Solicitações Recentes (REMOVIDO) -->
      
    </section>

    <!-- Coluna 3: GRÁFICOS -->
    <section class="space-y-6">
      <LineChartCard title="Relatório Diário" />
      <DoughnutChartCard title="Meios de Pagamento" />
      <BarChartCard title="Desempenho por Mês" />
      
      <!-- Remoção do Card de Back-Office original da Coluna 3 -->
    </section>

    <!-- Modal de pagamento (REMOVIDO, pois estava ligado à seleção de serviço) -->
    
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue"; // Removido onUnmounted se não for mais usado
import { storeToRefs } from "pinia";
import { useAppStore } from "../stores/app";
// import { useRouter } from 'vue-router'; // Removido se goToCheckout foi removido

// import CalendarCard from "../components/CalendarCard.vue"; // Removido
import ListCard from "../components/ListCard.vue";
import StatCard from "../components/StatCard.vue";
import LineChartCard from "../components/LineChartCard.vue";
import DoughnutChartCard from "../components/DoughnutChartCard.vue";
import BarChartCard from "../components/BarChartCard.vue";

// const router = useRouter(); // Removido
const store = useAppStore();
const { clients, providers, metrics } = storeToRefs(store);

// Serviços simulados (REMOVIDO)
// const services = ref([...]);

// selectedServices, totalDuration, totalPrice (REMOVIDO)
// const selectedServices = ref([]);
// const totalDuration = computed(...);
// const totalPrice = computed(...);

// Lógica de Pagamento (Modal original e funções relacionadas REMOVIDAS)
// const showPayment = ref(false);
// const countdown = ref(900);
// let timer = null;
// const handleDateClick = (info) => {...}; // Removido
// const startCountdown = () => {...};
// const confirmPayment = () => {...};

// Função de Checkout (REMOVIDA)
// const goToCheckout = () => {...};

// onUnmounted para limpar timer (REMOVIDO)
// onUnmounted(() => {...});
</script>

<style scoped>
/* Estilos globais para o dashboard */
.container-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1.5rem; /* 24px */
    padding: 1.5rem; /* 24px */
}

/* Responsividade para 3 colunas (tablet e desktop) */
@media (min-width: 1024px) { /* lg breakpoint */
    .container-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

/* Estilos de Card genéricos, assumindo um tema escuro */
.card {
    background-color: var(--card-bg, #1f2937); /* gray-800 */
    border: 1px solid var(--card-border, #374151); /* gray-700 */
    border-radius: 0.75rem; /* rounded-xl */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
    padding: 1rem; /* p-4 */
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--header-border, #374151); /* gray-700 */
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

.card-title {
    font-size: 1.25rem; /* text-xl */
    font-weight: 700; /* font-bold */
    color: var(--card-title, #f3f4f6); /* gray-100 */
}

.badge {
    padding: 0.25rem 0.5rem;
    border-radius: 9999px; /* rounded-full */
    font-size: 0.75rem; /* text-xs */
    border: 1px solid;
    font-weight: 600;
}

/* Variáveis para cores */
:root {
    --primary: #3b82f6; /* blue-500 */
    --primary-text: #bfdbfe; /* blue-200 */
    --card-bg: #1f2937;
    --card-border: #374151;
    --card-title: #f3f4f6;
    --header-border: #374151;
}


</style>

