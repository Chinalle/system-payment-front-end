<template>
  <div class="agenda-container">
    <h1 class="title">📅 Minha Agenda Interativa</h1>
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
  </div>
</template>

<script setup>
// Nada de imports de CSS aqui (v6 injeta CSS automaticamente)

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ref } from 'vue'

const calendarRef = ref(null)

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  editable: true,
  selectable: true,
  selectMirror: true,
  nowIndicator: true,
  slotMinTime: '07:00:00',
  slotMaxTime: '20:00:00',
  events: [
    { title: 'Reunião com equipe', start: '2025-09-26T10:00:00', end: '2025-09-26T11:00:00' },
    { title: 'Consulta Cliente X', start: '2025-09-28T15:30:00', end: '2025-09-28T16:00:00' }
  ],
  select: (info) => {
    const title = prompt('Digite o título do evento:')
    if (title && calendarRef.value) {
      const api = calendarRef.value.getApi()
      api.addEvent({ title, start: info.startStr, end: info.endStr, allDay: info.allDay })
    }
  },
  eventClick: (info) => {
    if (confirm(`Deseja excluir o evento "${info.event.title}"?`)) info.event.remove()
  }
}
</script>
