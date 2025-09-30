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
        <h3 class="font-semibold text-gray-300 mb-3 text-lg border-b border-gray-700 pb-2">Filtros</h3>
        <ul class="space-y-2 text-sm">
          <li class="flex items-center text-blue-400"><span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>Work</li>
          <li class="flex items-center text-green-400"><span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Data Science Team</li>
          <li class="flex items-center text-purple-400"><span class="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>Data Science Core</li>
          <li class="flex items-center text-yellow-400"><span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>Personal</li>
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
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ref } from 'vue'

const calendarRef = ref(null)
const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  
  // Define a visualização principal
  initialView: 'timeGridWeek', 
  
  // Ajusta a barra de cabeçalho: Sem o botão de 'month'
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'timeGridWeek,timeGridDay' // Apenas Semana e Dia
  },
  
  // Mantém a tradução dos botões
  buttonText: {
    today: 'Hoje',
    week: 'Semana',
    day: 'Dia'
  },
  
  // Seus eventos
  events: [
    { title: 'Reunião com equipe', start: '2025-09-26T10:00:00', end: '2025-09-26T11:00:00', className: 'event-team' },
    { title: 'Consulta Cliente X', start: '2025-09-28T15:30:00', end: '2025-09-28T16:00:00', className: 'event-client' }
  ],
  
  // Outras opções
  editable: true,
  selectable: true,
  nowIndicator: true,
  slotMinTime: '07:00:00',
  slotMaxTime: '20:00:00',
  
  // Ajuste o aspecto ratio para que a coluna central tenha mais altura
  aspectRatio: 1.5, 
  handleWindowResize: true,
}
</script>

<style scoped>
/* Estilo principal para criar o layout de 3 colunas em telas maiores */
.agenda-wrapper {
  /* No desktop (a partir de 'lg'), usa grid de 3 colunas */
  @apply lg:grid lg:grid-cols-[250px_1fr_250px] lg:gap-6 max-w-7xl mx-auto my-7 p-4;
  
  /* Estilos de fundo e borda para o wrapper principal */
  @apply bg-gray-900 rounded-xl shadow-2xl border border-blue-900/20;
}

/* Colunas Laterais (Hidden in mobile, visible in desktop) */
.sidebar-left, .sidebar-right {
  @apply hidden lg:block; 
  @apply h-full overflow-y-auto; /* Permite scroll nas sidebars */
}

/* Coluna Central */
.calendar-main-column {
  @apply w-full;
}

/* Título */
.title {
  @apply text-center mb-6 text-3xl font-bold text-blue-300 lg:text-left lg:text-2xl;
}

/* Estilos para o FullCalendar (Dark Theme) */
.fc {
  @apply text-gray-100;
  /* Variáveis CSS para personalizar o FullCalendar com o tema escuro */
  --fc-page-bg-color: theme('colors.gray.900');
  --fc-neutral-bg-color: theme('colors.gray.800');
  --fc-border-color: theme('colors.gray.700');
  --fc-daygrid-event-dot-color: theme('colors.blue.400');
  --fc-timegrid-event-border-color: transparent;
}

/* Ajusta a barra de cabeçalho do calendário */
:deep(.fc-header-toolbar) {
  @apply flex-col space-y-4 lg:flex-row lg:space-y-0 p-3 bg-gray-800 rounded-t-lg border-b border-gray-700;
}
:deep(.fc-toolbar-chunk:nth-child(2)) { /* Título do Mês/Semana */
  @apply order-first lg:order-none mb-4 lg:mb-0;
}
:deep(.fc-toolbar-chunk:nth-child(3)) { /* Botões de visualização */
  @apply flex justify-center lg:justify-end;
}

/* Cores dos eventos */
.event-team {
  @apply bg-blue-600/70 border-blue-700/80 text-white font-medium;
}
.event-client {
  @apply bg-purple-600/70 border-purple-700/80 text-white font-medium;
}

/* Estilo para simular o teclado na coluna direita */
.kbd {
  @apply inline-block px-1 py-0.5 text-xs font-mono bg-gray-700 border border-gray-600 rounded shadow-sm text-gray-300;
}
</style>