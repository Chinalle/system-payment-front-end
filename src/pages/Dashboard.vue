<template>
  <div class="container-grid">
    <!-- Coluna 1: Clientes -->
    <section class="space-y-6">
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

      <!-- Calendário com evento de clique -->
      <CalendarCard @dateClick="handleDateClick" />

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
    </section>

    <!-- Coluna 2: Prestadores -->
    <section class="space-y-6">
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

      <!-- Seleção de serviços -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Selecione Serviços</h3>
        </div>
        <div class="space-y-2">
          <div
            v-for="s in services"
            :key="s.id"
            class="flex items-center gap-3"
          >
            <input type="checkbox" v-model="selectedServices" :value="s" />
            <span>{{ s.name }} - {{ s.duration }}min - R$ {{ s.price }}</span>
          </div>
        </div>
        
        <!-- NOVO BLOCO DE PAGAMENTO -->
        <div class="mt-4 p-3 bg-gray-800 rounded-lg">
          <p class="mb-2"><b>Duração total:</b> {{ totalDuration }} min</p>
          <p class="mb-4"><b>Preço total:</b> R$ {{ totalPrice }}</p>

          <button
            @click="goToCheckout"
            :disabled="totalPrice === 0"
            class="w-full py-2 rounded-lg font-bold transition-all"
            :class="totalPrice > 0 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'"
          >
            Pagar Serviços (R$ {{ totalPrice }})
          </button>
        </div>
      </div>

      <ListCard
        title="Solicitações Recentes"
        :items="[
          { id: 1, name: 'Samuel Freitas', meta: 'Corte Masculino', pill: 'Aguardando' },
          { id: 2, name: 'Lívia Santos', meta: 'Sobrancelhas', pill: 'Confirmado' },
          { id: 3, name: 'Monalisa', meta: 'Massagem Relaxante', pill: 'Pendente' }
        ]"
      />
    </section>

    <!-- Coluna 3: Back-Office -->
    <section class="space-y-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Back-Office</h3>
          <div class="text-sm text-gray-400">Sistemas</div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <StatCard
            title="Receita"
            :value="'R$ ' + metrics.revenue"
            subtitle="semana"
            trend="+12%"
            :positive="true"
          />
          <StatCard
            title="Despesas"
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

      <LineChartCard title="Relatório Diário" />
      <DoughnutChartCard title="Meios de Pagamento" />
      <BarChartCard title="Desempenho por Mês" />
    </section>

    <!-- Modal de pagamento -->
    <div
      v-if="showPayment"
      class="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
    >
      <div class="bg-white p-6 rounded-xl w-full max-w-md text-black">
        <h2 class="text-xl font-bold mb-4">Confirmação de Pagamento</h2>
        <p>Finalize seu pagamento em até:</p>
        <p class="text-2xl font-bold text-red-600">{{ countdown }}s</p>
        <button
          @click="confirmPayment"
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Confirmar Pagamento
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "../stores/app";
import { useRouter } from 'vue-router'; // Importar o useRouter

import CalendarCard from "../components/CalendarCard.vue";
import ListCard from "../components/ListCard.vue";
import StatCard from "../components/StatCard.vue";
import LineChartCard from "../components/LineChartCard.vue";
import DoughnutChartCard from "../components/DoughnutChartCard.vue";
import BarChartCard from "../components/BarChartCard.vue";

const router = useRouter(); // Inicializar o router
const store = useAppStore();
const { clients, providers, metrics } = storeToRefs(store);

// Serviços simulados
const services = ref([
  { id: 1, name: "Corte de Cabelo", duration: 30, price: 50 },
  { id: 2, name: "Barba", duration: 20, price: 30 },
  { id: 3, name: "Massagem Relaxante", duration: 60, price: 120 },
]);

const selectedServices = ref([]);
const totalDuration = computed(() =>
  selectedServices.value.reduce((acc, s) => acc + s.duration, 0)
);
const totalPrice = computed(() =>
  selectedServices.value.reduce((acc, s) => acc + s.price, 0)
);

// Pagamento (Modal original)
const showPayment = ref(false);
const countdown = ref(900); // 15 minutos
let timer = null;

const handleDateClick = (info) => {
  alert(`Reserva temporária em ${info.dateStr}`);
  showPayment.value = true;
  startCountdown();
};

const startCountdown = () => {
  countdown.value = 900;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      showPayment.value = false;
      alert("Tempo esgotado! Reserva cancelada.");
    }
  }, 1000);
};

const confirmPayment = () => {
  clearInterval(timer);
  alert("Pagamento confirmado com sucesso!");
  showPayment.value = false;
};

// NOVA FUNÇÃO: Redirecionar para o Checkout
const goToCheckout = () => {
    if (totalPrice.value > 0) {
        router.push('/checkout');
    }
}

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
