<script setup>
import { ref, computed } from 'vue';
// Importação dos ícones Lucide para Vue
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Clock,
  User,
  DollarSign,
  Edit,
  Trash2,
  ListOrdered // Novo ícone para ordenação
} from 'lucide-vue-next';

// --- Dados Estáticos ---
const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const mockEvents = [
  {
    id: 1,
    date: 17,
    title: "Reunião com cliente",
    description: "Apresentação do projeto",
    client: "João Silva",
    value: 500.00,
    time: "10:00 - 11:00",
    deliveryTime: "11:00", // Adicionado para ordenação
    status: "Reunião",
    priority: "high"
  },
  {
    id: 2,
    date: 17,
    title: "Revisão de código",
    description: "Sprint review",
    client: "Maria Santos",
    value: 350.00,
    time: "14:00 - 15:30",
    deliveryTime: "15:30", // Adicionado para ordenação
    status: "Confirmado",
    priority: "medium"
  },
  {
    id: 3,
    date: 18,
    title: "Desenvolvimento do Site",
    description: "Landing page para produto",
    client: "Tech Startup",
    value: 1200.00,
    time: "16:00 - 18:00",
    deliveryTime: "18:00", // Adicionado para ordenação
    status: "Pendente",
    priority: "low"
  },
  {
    id: 4,
    date: 17,
    title: "Call de Alinhamento",
    description: "Alinhamento de escopo",
    client: "Tech Startup",
    value: 100.00,
    time: "09:00 - 09:30",
    deliveryTime: "09:30",
    status: "Confirmado",
    priority: "low"
  },
];

// --- Estado Reativo ---
const currentMonth = ref(9);
const currentYear = ref(2025);
const selectedDay = ref(17);

// Estado para os filtros e ordenação
const filterState = ref({
    order: 'arrival', // arrival, priority, delivery, time
    priority: 'todos',
    client: 'todos',
    dayOfWeek: 'todos',
    status: 'todos',
});

// --- Funções de Lógica e Computadas ---

// Calcula o número total de dias no mês atual
const getDaysInMonth = () => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
};

// Calcula o dia da semana do primeiro dia do mês (0 = Dom, 6 = Sáb)
const getFirstDayOfMonth = () => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
};

// Lógica de Filtragem
const filteredEvents = computed(() => {
    let events = mockEvents.filter(event => event.date === selectedDay.value);
    const filters = filterState.value;

    // Filtro por Prioridade
    if (filters.priority !== 'todos') {
        events = events.filter(event => event.priority === filters.priority);
    }

    // Filtro por Cliente (Implementação básica, assumindo que mockEvents tem todos os clientes)
    if (filters.client !== 'todos') {
        events = events.filter(event => event.client === filters.client);
    }

    // Filtro por Status
    if (filters.status !== 'todos') {
        events = events.filter(event => event.status.toLowerCase() === filters.status);
    }

    // A ordenação é aplicada após a filtragem
    return events.sort((a, b) => {
        switch (filters.order) {
            case 'priority':
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'delivery':
                // Ordena por horário final/entrega
                const timeA = a.deliveryTime || a.time.split(' - ')[1];
                const timeB = b.deliveryTime || b.time.split(' - ')[1];
                return timeA.localeCompare(timeB);
            case 'time':
                // Ordena pelo horário de início (o primeiro da string 'HH:MM - HH:MM')
                const startA = a.time.split(' - ')[0];
                const startB = b.time.split(' - ')[0];
                return startA.localeCompare(startB);
            case 'arrival':
            default:
                // Por ID (ordem de chegada/criação)
                return a.id - b.id;
        }
    });
});

// Lógica para renderizar o calendário (sem mudanças)
const calendarDays = computed(() => {
  const daysInMonth = getDaysInMonth();
  const firstDay = getFirstDayOfMonth();
  const days = [];

  // Espaços vazios no início do mês
  for (let i = 0; i < firstDay; i++) {
    days.push({ key: `empty-${i}`, content: '', isEmpty: true });
  }

  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const hasEvents = mockEvents.some(event => event.date === day);
    const isSelected = day === selectedDay.value;

    days.push({
      key: day,
      content: day,
      isEmpty: false,
      hasEvents,
      isSelected,
    });
  }

  return days;
});

// Lista de clientes únicos para o filtro
const uniqueClients = computed(() => {
    const clients = new Set(mockEvents.map(event => event.client));
    return Array.from(clients).sort();
});

// Funções de manipulação
const handleSelectDay = (day) => {
  selectedDay.value = day;
};

// Funções de Estilização (mantidas as cores azuis)
const getStatusBadgeVariant = (status) => {
    if (status === "Confirmado") return "bg-green-500/10 text-green-700 border-green-500";
    if (status === "Reunião") return "bg-blue-500/10 text-blue-700 border-blue-500";
    return "bg-gray-500/10 text-gray-700 border-gray-500";
};

const getPriorityBadgeClass = (priority) => {
    if (priority === "high") return "border-red-500 text-red-500 bg-red-50/70";
    if (priority === "medium") return "border-yellow-500 text-yellow-600 bg-yellow-50/70";
    return "border-green-500 text-green-600 bg-green-50/70";
};

</script>

<template>
  <div class="space-y-6 p-4 sm:p-6 md:p-8 bg-blue-60/80 min-h-screen font-sans">
    <!-- Cabeçalho Principal -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <h1 :class="['text-4xl font-black tracking-tight mb-4 sm:mb-0', `text-${PRIMARY_COLOR}`]">Agenda Interativa</h1>
      <div class="flex gap-3">
        <button
          class="inline-flex items-center justify-center rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
        >
          <Filter class="h-4 w-4 mr-2 text-blue-500" />
          Filtros
        </button>
        <button
          class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <Plus class="h-4 w-4 mr-2" />
          Novo Evento
        </button>
      </div>
    </div>

    <!-- Layout Principal: Calendário + Filtros -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Card: Calendário (Mantido do código anterior) -->
      <div class="bg-white border border-blue-100 rounded-xl shadow-2xl shadow-blue-200/50 lg:col-span-2">
        <div class="p-5 border-b border-blue-100">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-800">
              {{ months[currentMonth] }} {{ currentYear }}
            </h2>
            <div class="flex gap-2">
              <button
                class="inline-flex items-center justify-center w-8 h-8 rounded-full border border-blue-200 text-blue-600 transition-colors hover:bg-blue-50 hover:border-blue-300"
              >
                <ChevronLeft class="h-4 w-4" />
              </button>
              <button
                class="rounded-lg border border-blue-300 bg-blue-50/50 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
              >
                Hoje
              </button>
              <button
                class="inline-flex items-center justify-center w-8 h-8 rounded-full border border-blue-200 text-blue-600 transition-colors hover:bg-blue-50 hover:border-blue-300"
              >
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div class="p-5">
          <!-- Dias da Semana -->
          <div class="grid grid-cols-7 gap-2 mb-2">
            <div
              v-for="day in daysOfWeek"
              :key="day"
              class="text-center text-sm font-semibold text-blue-600 py-2"
            >
              {{ day }}
            </div>
          </div>
          <!-- Dias do Mês -->
          <div class="grid grid-cols-7 gap-2">
            <template v-for="dayItem in calendarDays" :key="dayItem.key">
              <div v-if="dayItem.isEmpty" class="h-16"></div>
              <button
                v-else
                @click="handleSelectDay(dayItem.content)"
                :class="[
                  'h-16 rounded-lg border transition-all shadow-md',
                  dayItem.isSelected
                    ? 'bg-blue-600 text-white border-blue-700 scale-[1.03] shadow-blue-400/50'
                    : 'bg-white border-gray-200 text-gray-900 hover:border-blue-400 hover:shadow-lg'
                ]"
              >
                <div class="flex flex-col items-center justify-center h-full p-1">
                  <span
                    :class="[
                      'text-lg font-bold',
                      dayItem.isSelected ? 'text-white' : 'text-gray-900'
                    ]"
                  >
                    {{ dayItem.content }}
                  </span>
                  <div
                    v-if="dayItem.hasEvents"
                    :class="[
                      'w-2 h-2 rounded-full mt-1',
                      dayItem.isSelected ? 'bg-white' : 'bg-blue-500 animate-pulse'
                    ]"
                  />
                </div>
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Card: Filtros (Refatorado) -->
      <div class="bg-white border border-blue-100 rounded-xl shadow-lg shadow-blue-100/50">
        <div class="p-5 border-b border-blue-100">
          <h2 class="text-xl font-semibold text-gray-800">Filtros de Agenda</h2>
        </div>
        <div class="p-5 space-y-5">
            <!-- 1. ORDEM DE CHEGADA/PRIORIDADE/ENTREGA/HORÁRIO -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <ListOrdered class="h-4 w-4 text-blue-500" />
                    Ordenar por
                </label>
                <select v-model="filterState.order" class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                    <option value="arrival">Ordem de Chegada</option>
                    <option value="priority">Prioridade</option>
                    <option value="time">Horário de Início</option>
                    <option value="delivery">Horário de Entrega</option>
                </select>
            </div>

            <!-- 2. PRIORIDADE (Filtro) -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-gray-600">Filtrar por Prioridade</label>
                <select v-model="filterState.priority" class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                    <option value="todos">Todas</option>
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                </select>
            </div>

            <!-- 3. CLIENTE -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-gray-600">Filtrar por Cliente</label>
                <select v-model="filterState.client" class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                    <option value="todos">Todos</option>
                    <option v-for="client in uniqueClients" :key="client" :value="client">{{ client }}</option>
                </select>
            </div>

            <!-- 4. STATUS -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-gray-600">Filtrar por Status</label>
                <select v-model="filterState.status" class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                    <option value="todos">Todos</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="pendente">Pendente</option>
                    <option value="reuniao">Reunião</option>
                </select>
            </div>

            <!-- 5. DIA DA SEMANA (Mantido, mas agora está centralizado no estado) -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-gray-600">Filtrar por Dia da Semana</label>
                <select v-model="filterState.dayOfWeek" class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                    <option value="todos">Todos</option>
                    <option v-for="day in daysOfWeek" :key="day" :value="day.toLowerCase()">{{ day }}</option>
                </select>
            </div>
        </div>
      </div>
    </div>

    <!-- Card: Eventos do Dia (Agora usa filteredEvents) -->
    <div class="bg-white border border-blue-100 rounded-xl shadow-lg shadow-blue-100/50">
      <div class="p-5 border-b border-blue-100">
        <h2 class="text-xl font-semibold text-gray-800">
          Eventos Agendados ({{ filteredEvents.length }} - {{ selectedDay }} de {{ months[currentMonth] }})
        </h2>
      </div>
      <div class="p-5 space-y-4">
        <template v-if="filteredEvents.length > 0">
          <div
            v-for="event in filteredEvents"
            :key="event.id"
            class="p-4 rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-200"
          >
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <!-- Badge Status -->
                  <span
                    :class="['px-3 py-1 text-xs font-semibold rounded-full border', getStatusBadgeVariant(event.status)]"
                  >
                    {{ event.status }}
                  </span>
                  <!-- Badge Prioridade -->
                  <span
                    :class="['px-3 py-1 text-xs font-semibold rounded-full border', getPriorityBadgeClass(event.priority)]"
                  >
                    Prioridade: {{ event.priority === "high" ? "Alta" : event.priority === "medium" ? "Média" : "Baixa" }}
                  </span>
                </div>
                <h3 class="font-bold text-gray-900 text-lg truncate">{{ event.title }}</h3>
                <p class="text-sm text-gray-500 truncate">{{ event.description }}</p>
              </div>
              <div class="flex gap-2 min-w-max">
                <button
                  class="p-2 rounded-full border border-gray-300 text-blue-600 transition-colors hover:bg-blue-50"
                  title="Editar"
                >
                  <Edit class="h-4 w-4" />
                </button>
                <button
                  class="p-2 rounded-full border border-gray-300 text-red-600 transition-colors hover:bg-red-50"
                  title="Excluir"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
            <!-- Detalhes do Evento -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <User class="h-4 w-4 text-blue-400" />
                <span>{{ event.client }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <DollarSign class="h-4 w-4 text-blue-400" />
                <span class="text-blue-700 font-bold">R$ {{ event.value.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <Clock class="h-4 w-4 text-blue-400" />
                <span>{{ event.time }}</span>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="text-center py-12 bg-blue-50/50 rounded-xl border border-dashed border-blue-300">
          <p class="text-lg text-blue-700 font-medium">Nenhum evento corresponde aos filtros neste dia.</p>
          <button
            class="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
          >
            <Plus class="h-4 w-4 mr-2" />
            Criar Evento
          </button>
        </div>
      </div>
    </div>

    <!-- Card: Serviços Pendentes (Mantido) -->
    <div class="bg-white border border-blue-100 rounded-xl shadow-lg shadow-blue-100/50">
      <div class="p-5 border-b border-blue-100">
        <h2 class="text-xl font-semibold text-gray-800">Serviços Pendentes de Confirmação (1)</h2>
      </div>
      <div class="p-5">
        <div class="p-4 rounded-xl bg-yellow-50/70 border border-yellow-400 shadow-sm">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 class="font-bold text-gray-900">Desenvolvimento do Site</h3>
              <p class="text-sm text-gray-600 mt-1">Tech Startup • R$ 1.200,00 • 17/10 - 16:00</p>
            </div>
            <div class="flex gap-2 min-w-max">
              <button
                class="inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow transition-colors hover:bg-green-700"
              >
                Confirmar
              </button>
              <button
                class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 shadow transition-colors hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos específicos se necessário */
</style>
