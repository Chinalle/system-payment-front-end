<template>
  <div class="agenda-wrapper">
    <div class="sidebar-left">
      <div class="mini-calendar-mock p-4 bg-gray-800 rounded-lg shadow-inner">
        <h3 class="font-semibold text-gray-300 mb-3 text-lg">Janeiro 2024</h3>
        <div class="text-sm text-gray-400">
          <p class="mb-1">Dom Seg Ter Qua Qui Sex Sáb</p>
          <p>...Grade de Dias...</p>
        </div>
      </div>

      <div class="filters-panel mt-6 p-4 bg-gray-800 rounded-lg shadow-inner">
        <h3 class="font-semibold text-gray-300 mb-3 text-lg border-b border-gray-700 pb-2">Categoria de Criação</h3>
        <ul class="space-y-2 text-sm">
          <li
            v-for="category in eventCategories"
            :key="category.name"
            @click="selectCategory(category)"
            class="flex items-center p-2 rounded-md cursor-pointer transition duration-150"
            :class="{
              'bg-blue-900/40 border border-blue-600': selectedCategory.name === category.name, 
              'hover:bg-gray-700': selectedCategory.name !== category.name
            }"
          >
            <span 
              class="w-3 h-3 rounded-full mr-2" 
              :class="`bg-${category.color}-500`" 
            ></span>
            <span 
              :class="`text-${category.color}-400`" 
              class="font-medium"
            >{{ category.name }}</span>
          </li>
        </ul>
      </div>

      <div class="filters-panel mt-6 p-4 bg-gray-800 rounded-lg shadow-inner">
        <h3 class="font-semibold text-gray-300 mb-3 text-lg border-b border-gray-700 pb-2">Filtros de Agenda</h3>
        <ul class="space-y-2 text-sm">
          <li
            v-for="category in eventCategories"
            :key="category.name"
            @click="toggleFilter(category.className)"
            class="flex items-center p-2 rounded-md cursor-pointer transition duration-150"
            :class="{
              'bg-blue-900/40 border border-blue-600': activeFilters.includes(category.className), 
              'hover:bg-gray-700': !activeFilters.includes(category.className)
            }"
          >
            <span 
              class="w-3 h-3 rounded-full mr-2" 
              :class="`bg-${category.color}-500`" 
            ></span>
            <span 
              :class="`text-${category.color}-400`" 
              class="font-medium"
            >{{ category.name }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="calendar-main-column">
      <h1 class="title">📅 Minha Agenda Interativa</h1>
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>

    <div class="sidebar-right">
      <div class="upcoming-panel p-4 bg-gray-800 rounded-lg shadow-inner mb-6">
        <h3 class="font-semibold text-gray-300 mb-3 text-lg border-b border-gray-700 pb-2">Próximos em 45 min</h3>
        <p class="text-sm text-blue-300 font-medium">Operations Research Standup</p>
        <p class="text-xs text-gray-400">9:45 AM – 10:00 AM · 15 min</p>
      </div>

      <div class="shortcuts-panel p-4 bg-gray-800 rounded-lg shadow-inner">
        <h3 class="font-semibold text-gray-300 mb-3 text-lg border-b border-gray-700 pb-2">Atalhos Úteis</h3>
        <ul class="text-sm text-gray-400 space-y-1">
          <li>Menu bar calendar: <kbd class="kbd">Ctrl</kbd> <kbd class="kbd">X</kbd></li>
          <li>Notion Calendar menu: <kbd class="kbd">Ctrl</kbd> <kbd>K</kbd></li>
        </ul>
      </div>
    </div>
  </div>

  <EventModal
    :is-visible="isModalVisible"
    :category="selectedCategory"        :event-categories="eventCategories" :select-info="currentSelectInfo"
    @close="isModalVisible = false"
    @create="finalizeEventCreation"
  />
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ref, reactive, computed } from 'vue' 

import EventModal from '../components/EventModal.vue' 

// ----------------------------------------------------
// 1. ESTADO DO MODAL E CORES (Prioridade)
// ----------------------------------------------------
const eventCategories = reactive([
  // Cores de Prioridade
  { name: 'Crítico', color: 'red', className: 'event-red' },
  { name: 'Alto', color: 'orange', className: 'event-orange' },
  { name: 'Médio', color: 'cyan', className: 'event-cyan' },
  { name: 'Baixo', color: 'lime', className: 'event-lime' },
])

const selectedCategory = ref(eventCategories[0])
const isModalVisible = ref(false)
const currentSelectInfo = ref(null)

const selectCategory = (category) => {
  selectedCategory.value = category
}

// ----------------------------------------------------
// 2. LÓGICA DE FILTRAGEM
// ----------------------------------------------------

const allEvents = reactive([
  { title: 'Reunião Crítica', start: '2025-09-26T10:00:00', end: '2025-09-26T11:00:00', className: 'event-red' },
  { title: 'Planejamento Alto', start: '2025-09-30T09:00:00', end: '2025-09-30T10:00:00', className: 'event-orange' },
  { title: 'Consulta de Rotina', start: '2025-09-28T15:30:00', end: '2025-09-28T16:00:00', className: 'event-cyan' },
  { title: 'Tarefa Baixa', start: '2025-10-01T14:00:00', end: '2025-10-01T15:00:00', className: 'event-lime' },
])

const activeFilters = ref(eventCategories.map(c => c.className))

const toggleFilter = (className) => {
  const index = activeFilters.value.indexOf(className)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(className)
  }
}

const filteredEvents = computed(() => {
  if (activeFilters.value.length === 0 || activeFilters.value.length === eventCategories.length) {
    return allEvents
  }
  return allEvents.filter(event => 
    activeFilters.value.includes(event.className)
  )
})

// ----------------------------------------------------
// 3. FUNÇÕES DE MANIPULAÇÃO DO CALENDÁRIO
// ----------------------------------------------------
const calendarRef = ref(null)

const handleDateSelect = (selectInfo) => {
  currentSelectInfo.value = selectInfo
  isModalVisible.value = true
}

const finalizeEventCreation = (eventData) => {
  const calendarApi = calendarRef.value.getApi();
  calendarApi.unselect();
  
  const newEvent = {
    id: Date.now().toString(),
    title: eventData.title,
    start: eventData.start,
    end: eventData.end,
    allDay: eventData.allDay,
    className: eventData.className // Usa a className ESCOLHIDA no modal
  };
  
  allEvents.push(newEvent); 
  
  isModalVisible.value = false;
}

const handleEventClick = (clickInfo) => {
  if (confirm(`Deseja deletar o evento '${clickInfo.event.title}'?`)) {
    clickInfo.event.remove()
    
    const index = allEvents.findIndex(e => e.id === clickInfo.event.id)
    if (index > -1) {
      allEvents.splice(index, 1)
    }
  }
}

// ----------------------------------------------------
// 4. OPÇÕES DO FULLCALENDAR
// ----------------------------------------------------
const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  
  initialView: 'timeGridWeek', 
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'timeGridWeek,timeGridDay'
  },
  
  locale: 'pt-br', 
  buttonText: { today: 'Hoje', week: 'Semana', day: 'Dia' },
  titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
  dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true },

  editable: true,
  selectable: true,
  selectMirror: true,
  select: handleDateSelect,
  eventClick: handleEventClick,

  nowIndicator: true,
  slotMinTime: '07:00:00',
  slotMaxTime: '20:00:00',
  aspectRatio: 1.5, 
  handleWindowResize: true,
  
  events: filteredEvents,
})
</script>

<style scoped>
/* Estilos mantidos */
/* ... */

.agenda-wrapper {
  @apply lg:grid lg:grid-cols-[250px_1fr_250px] lg:gap-6 max-w-7xl mx-auto my-7 p-4;
  @apply bg-gray-900 rounded-xl shadow-2xl border border-blue-900/20;
}

/* Colunas Laterais */
.sidebar-left, .sidebar-right {
  @apply hidden lg:block; 
  @apply h-full overflow-y-auto; 
}

/* Coluna Central */
.calendar-main-column {
  @apply w-full;
}

/* Título */
.title {
  @apply hidden; 
}

/* Estilos para o FullCalendar (Dark Theme e Profissionalismo) */
.fc {
  @apply text-gray-100;
  
  --fc-page-bg-color: theme('colors.gray.900');
  --fc-neutral-bg-color: theme('colors.gray.800');
  --fc-border-color: theme('colors.gray.700');
  --fc-timegrid-event-border-color: transparent;
  
  /* Cor de fundo suave para o dia de hoje */
  --fc-today-bg-color: theme('colors.blue.900'); 
}

/* Animação sutil para o fundo da coluna do dia atual */
:deep(.fc-timegrid-slots .fc-day.fc-day-today) {
    animation: subtlePulse 8s infinite alternate ease-in-out;
}

@keyframes subtlePulse {
    0% {
        background-color: theme('colors.blue.900');
    }
    100% {
        background-color: theme('colors.blue.900 / 0.7');
    }
}

/* Ajusta a barra de cabeçalho do calendário */
:deep(.fc-header-toolbar) {
  @apply p-0 bg-transparent border-none rounded-none;
  @apply flex-row justify-between items-center;
}

:deep(.fc-toolbar-chunk:nth-child(2)) { 
  @apply flex-grow text-center text-xl font-semibold; 
}

:deep(.fc-toolbar-chunk:nth-child(1) button),
:deep(.fc-toolbar-chunk:nth-child(3) button) {
  @apply bg-gray-700 hover:bg-gray-600 border-none text-gray-100;
  @apply px-3 py-1.5 rounded-md text-sm font-medium;
  @apply transition duration-150 ease-in-out;
}

:deep(.fc-col-header-cell) {
  @apply bg-gray-800 border-b border-gray-700/50;
}
:deep(.fc-col-header-cell-cushion) {
  @apply text-gray-300 font-semibold text-sm py-2;
}
:deep(.fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion) {
  @apply text-yellow-300; 
}

/* CORES DOS EVENTOS (Classes de PRIORIDADE) */
.event-red {
  @apply bg-red-800/80 border-red-700/80 text-white font-medium;
}
.event-orange {
  @apply bg-orange-700/80 border-orange-600/80 text-white font-medium;
}
.event-cyan {
  @apply bg-cyan-700/80 border-cyan-600/80 text-white font-medium;
}
.event-lime {
  @apply bg-lime-700/80 border-lime-600/80 text-gray-900 font-medium;
}

/* Estilo para simular o teclado na coluna direita */
.kbd {
  @apply inline-block px-1 py-0.5 text-xs font-mono bg-gray-700 border border-gray-600 rounded shadow-sm text-gray-300;
}
</style>