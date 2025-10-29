<template>
  <div class="p-6 bg-blue-60/80 min-h-screen font-sans text-gray-900 space-y-8">
    
    <!-- HEADER DA APLICAÇÃO (Unificado: Agenda + Horário de Trabalho) --><div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-blue-200">
        <!-- Título Centralizado no Layout --><h1 class="text-3xl font-bold tracking-tight text-blue-800">Agenda Interativa</h1>
        
        <div class="flex gap-3 mt-4 sm:mt-0">
            <!-- Botão Horário de Trabalho --><button 
                @click="onWorkingHours"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-blue-300 rounded-lg bg-white hover:bg-blue-50 transition-colors shadow-sm"
            >
                <!-- Ícone Settings --><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-blue-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 0-.74 2.7l.06.39a2 2 0 0 1-1 1.73l-1.35.78a2 2 0 0 0-1 1.73v.25a2 2 0 0 0 1 1.73l1.35.78a2 2 0 0 1 1 1.73l-.06.39a2 2 0 0 0 .74 2.7l.43.25a2 2 0 0 1 1 1.73v.18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 0 .74-2.7l-.06-.39a2 2 0 0 1 1-1.73l1.35-.78a2 2 0 0 0 1-1.73v-.25a2 2 0 0 0-1-1.73l-1.35-.78a2 2 0 0 1-1-1.73l.06-.39a2 2 0 0 0-.74-2.7l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Horário de Trabalho
            </button>
            
            <!-- Botão Novo Evento --><button
                @click="openEventModal()"
                class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
                <Plus class="h-4 w-4 mr-2" />
                Novo Evento
            </button>
        </div>
    </div>

    <!-- Layout Principal: Calendário + Filtros --><div class="grid gap-6 lg:grid-cols-3">
      <!-- Card: Calendário --><div class="bg-white border border-blue-100 rounded-xl shadow-2xl shadow-blue-200/50 lg:col-span-2">
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
          <!-- Dias da Semana --><div class="grid grid-cols-7 gap-2 mb-2">
            <div
              v-for="day in daysOfWeek"
              :key="day"
              class="text-center text-sm font-semibold text-blue-600 py-2 bg-blue-50/70 rounded-md"
            >
              {{ day }}
            </div>
          </div>
          <!-- Dias do Mês --><div class="grid grid-cols-7 gap-2">
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

      <!-- Card: Filtros --><div class="bg-white border border-blue-100 rounded-xl shadow-lg shadow-blue-100/50">
        <div class="p-5 border-b border-blue-100">
          <h2 class="text-xl font-semibold text-gray-800">Filtros de Agenda</h2>
        </div>
        <div class="p-5 space-y-5">
            <!-- 1. ORDEM DE CHEGADA/PRIORIDADE/ENTREGA/HORÁRIO --><div class="space-y-2">
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

            <!-- 2. PRIORIDADE (Filtro) --><div class="space-y-2">
                <label class="text-sm font-medium text-gray-600">Filtrar por Prioridade</label>
                <select v-model="filterState.priority" class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                    <option value="todos">Todas</option>
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                </select>
            </div>

            <!-- 3. CLIENTE --><div class="space-y-2">
                <label class="text-sm font-medium text-gray-600">Filtrar por Cliente</label>
                <select v-model="filterState.client" class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                    <option value="todos">Todos</option>
                    <option v-for="client in uniqueClients" :key="client" :value="client">{{ client }}</option>
                </select>
            </div>

            <!-- 4. STATUS --><div class="space-y-2">
                <label class="text-sm font-medium text-gray-600">Filtrar por Status</label>
                <select v-model="filterState.status" class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                    <option value="todos">Todos</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="pendente">Pendente</option>
                    <option value="reuniao">Reunião</option>
                </select>
            </div>
            
        </div>
      </div>
    </div>

    <!-- Card: Eventos do Dia (Agora usa filteredEvents) --><div class="bg-white border border-blue-100 rounded-xl shadow-lg shadow-blue-100/50">
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
                  <!-- Badge Status --><span
                    :class="['px-3 py-1 text-xs font-semibold rounded-full border', getStatusBadgeVariant(event.status)]"
                  >
                    {{ event.status }}
                  </span>
                  <!-- Badge Prioridade --><span
                    :class="['px-3 py-1 text-xs font-semibold rounded-full border', getPriorityBadgeClass(event.priority)]"
                  >
                    Prioridade: {{ event.priority === 'high' ? 'Alta' : event.priority === 'medium' ? 'Média' : 'Baixa' }}
                  </span>
                </div>
                <h3 class="font-bold text-gray-900 text-lg truncate">{{ event.title }}</h3>
                <p class="text-sm text-gray-500 truncate">{{ event.description }}</p>
              </div>
              <div class="flex gap-2 min-w-max">
                <button
                  @click="openEventModal(event)"
                  class="p-2 rounded-full border border-gray-300 text-blue-600 transition-colors hover:bg-blue-50"
                  title="Editar"
                >
                  <Edit class="h-4 w-4" />
                </button>
                <button
                  @click="deleteEvent(event.id)"
                  class="p-2 rounded-full border border-gray-300 text-red-600 transition-colors hover:bg-red-50"
                  title="Excluir"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
            <!-- Detalhes do Evento --><div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
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
            @click="openEventModal()"
            class="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
          >
            <Plus class="h-4 w-4 mr-2" />
            Criar Evento
          </button>
        </div>
      </div>
    </div>

    <!-- Card: Serviços Pendentes --><div class="bg-white border border-blue-100 rounded-xl shadow-lg shadow-blue-100/50">
      <div class="p-5 border-b border-blue-100">
        <h2 class="text-xl font-semibold text-gray-800">Serviços Pendentes de Confirmação ({{ pendingEvents.length }})</h2>
      </div>
      <div class="p-5 space-y-4">
        <template v-if="pendingEvents.length > 0">
          <div v-for="event in pendingEvents" :key="event.id" class="p-4 rounded-xl bg-yellow-50/70 border border-yellow-400 shadow-sm">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 class="font-bold text-gray-900">{{ event.title }}</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ event.client }} • R$ {{ event.value.toFixed(2).replace('.', ',') }} • {{ event.date }}/{{ currentMonth + 1 }} - {{ event.time.split(' - ')[0] }}
                </p>
              </div>
              <div class="flex gap-2 min-w-max">
                <button
                  @click="confirmEvent(event.id)"
                  class="inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow transition-colors hover:bg-green-700"
                >
                  Confirmar
                </button>
                <button
                  @click="cancelEvent(event.id)"
                  class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 shadow transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="text-center py-4 text-gray-600">
            Nenhum serviço pendente de confirmação.
        </div>
      </div>
    </div>
    
    <!-- WORKING HOURS MODAL --><Transition name="fade">
        <div 
            v-if="isWorkingHoursOpen" 
            @click.self="isWorkingHoursOpen = false" 
            class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[95vh] p-6 space-y-6 transform transition-all duration-300 scale-100">
                
                <div class="flex flex-col items-center gap-2 mb-4">
                    <h2 class="text-2xl font-bold text-gray-900">Configurar Disponibilidade</h2>
                    
                    <div class="flex gap-2 p-1 bg-gray-100 rounded-lg">
                        <button 
                            @click="tab = 'general'"
                            :class="['px-3 py-1 text-sm font-medium rounded-md transition-colors', tab === 'general' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200']"
                        >
                            Agenda Geral
                        </button>
                        <button 
                            @click="tab = 'breaks'"
                            :class="['px-3 py-1 text-sm font-medium rounded-md transition-colors', tab === 'breaks' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200']"
                        >
                            Pausas
                        </button>
                        <button 
                            @click="tab = 'overrides'"
                            :class="['px-3 py-1 text-sm font-medium rounded-md transition-colors', tab === 'overrides' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200']"
                        >
                            Exceções
                        </button>
                    </div>
                </div>

                <!-- Conteúdo da Aba --><div class="space-y-4 py-4">
                    
                    <!-- 1. AGENDA GERAL (WorkingHours) --><div v-if="tab === 'general'" class="space-y-4">
                        <p class="text-gray-600">Defina os dias e horários padrão em que você está disponível para trabalhar.</p>
                        <div 
                            v-for="hour in hoursToEdit.general" 
                            :key="hour.day" 
                            :class="['flex items-center gap-4 p-3 border rounded-lg transition-colors', hour.enabled ? 'bg-blue-50' : 'bg-gray-100']"
                        >
                            <!-- Switch para ativar/desativar --><button 
                                @click="handleToggleDay(hour.day)"
                                :class="[
                                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                                    hour.enabled ? 'bg-blue-600' : 'bg-gray-300'
                                ]"
                                role="switch"
                            >
                                <span :class="[
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                    hour.enabled ? 'translate-x-5' : 'translate-x-0'
                                ]" />
                            </button>
                                
                            <!-- Nome do dia --><div class="flex-1 min-w-0">
                                <label :class="['font-medium', hour.enabled ? 'text-gray-900' : 'text-gray-600']">
                                    {{ weekDaysFull[hour.day] }}
                                </label>
                            </div>
                                
                            <!-- Inputs de horário (só aparecem se enabled) --><div v-if="hour.enabled" class="flex items-center gap-2">
                                <input 
                                    type="time" 
                                    :value="hour.startTime" 
                                    @input="handleTimeChange(hour.day, 'startTime', $event.target.value)"
                                    class="w-24 rounded-lg border border-gray-300 bg-white p-1.5 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                                />
                                <span class="text-gray-600">até</span>
                                <input 
                                    type="time" 
                                    :value="hour.endTime" 
                                    @input="handleTimeChange(hour.day, 'endTime', $event.target.value)"
                                    class="w-24 rounded-lg border border-gray-300 bg-white p-1.5 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                                />
                            </div>
                            <div v-else class="w-56 text-right text-sm text-gray-600">
                                Fechado
                            </div>
                        </div>
                    </div>

                    <!-- 2. PAUSAS (BreakHours) --><div v-else-if="tab === 'breaks'" class="space-y-4">
                        <p class="text-gray-600">Defina intervalos de tempo fixos (pausas, almoço) em que você não está disponível.</p>
                        
                        <div v-for="(breakHour, index) in hoursToEdit.breaks" :key="index" class="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                            <select v-model="breakHour.day" class="w-28 p-2 border border-gray-300 rounded-lg bg-white text-gray-700">
                                <option :value="i" v-for="(_, i) in weekDaysFull" :key="i">{{ weekDaysFull[i] }}</option>
                            </select>
                            <input 
                                type="time" 
                                v-model="breakHour.startTime"
                                class="w-24 rounded-lg border border-gray-300 bg-white p-1.5 text-gray-900" 
                            />
                            <span class="text-gray-600">até</span>
                            <input 
                                type="time" 
                                v-model="breakHour.endTime"
                                class="w-24 rounded-lg border border-gray-300 bg-white p-1.5 text-gray-900" 
                            />
                            <button @click="removeBreak(index)" class="p-2 text-red-500 hover:text-red-700" title="Remover Pausa">
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>
                        
                        <button @click="addBreak" class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <Plus class="h-4 w-4" />
                            Adicionar Pausa
                        </button>
                    </div>

                    <!-- 3. EXCEÇÕES (OverrideHours) - AJUSTES APLICADOS AQUI --><div v-else-if="tab === 'overrides'" class="space-y-4">
                        <p class="text-gray-600">Defina datas específicas com indisponibilidade total ou parcial, sobrescrevendo a agenda geral.</p>
                        
                        <div 
                            v-for="(override, index) in hoursToEdit.overrides" 
                            :key="index" 
                            :class="['flex flex-wrap items-center gap-3 p-3 border rounded-lg bg-gray-50']"
                            >
                            <!-- Input de Data --><input 
                                type="date" 
                                v-model="override.date"
                                class="w-full sm:w-32 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                            />
                            
                            <!-- Select de Tipo --><select 
                                v-model="override.type" 
                                class="w-full sm:w-auto flex-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                            >
                                <option value="unavailable">Dia Inteiro Indisponível</option>
                                <option value="partial">Indisponibilidade Parcial</option>
                            </select>
                            
                            <!-- Campos de Hora (Apenas se Parcial) --><template v-if="override.type === 'partial'">
                                <div class="flex items-center gap-2 w-full sm:w-auto"> <!-- NOVO CONTAINER FLEXÍVEL -->
                                    <input 
                                        type="time" 
                                        v-model="override.startTime"
                                        class="w-full sm:w-24 rounded-lg border border-gray-300 bg-white p-1.5 text-gray-900" 
                                    />
                                    <span class="text-gray-600">até</span>
                                    <input 
                                        type="time" 
                                        v-model="override.endTime"
                                        class="w-full sm:w-24 rounded-lg border border-gray-300 bg-white p-1.5 text-gray-900" 
                                    />
                                </div>
                            </template>
                            
                            <!-- Botão Remover --><button @click="removeOverride(index)" :class="['p-2 text-red-500 hover:text-red-700', override.type === 'partial' ? 'sm:ml-0' : 'sm:ml-auto']" title="Remover Exceção">
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>

                        <button @click="addOverride" class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <Plus class="h-4 w-4" />
                            Adicionar Exceção
                        </button>
                    </div>
                </div>

                <!-- Botões de Ação do Modal --><div class="flex justify-between gap-3 pt-4 border-t border-gray-200">
                    <div class="flex items-center">
                        <button 
                            @click="isWorkingHoursOpen = false"
                            class="h-10 px-4 rounded-lg text-sm font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                        >
                            Cancelar
                        </button>
                    </div>
                    <button 
                        @click="handleSave"
                        class="h-10 px-4 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    >
                        Salvar Configurações
                    </button>
                </div>
            </div>
        </div>
    </Transition>


    <!-- EVENT MODAL (Novo/Editar Evento) --><Transition name="fade">
        <div 
            v-if="isEventModalOpen" 
            @click.self="isEventModalOpen = false" 
            class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6 transform transition-all duration-300 scale-100">
                <h2 class="text-2xl font-bold text-gray-900">
                    {{ isEditingEvent ? 'Editar Evento' : 'Novo Evento' }}
                </h2>
                <form @submit.prevent="saveEvent" class="space-y-4">
                    
                    <!-- Linha 1: Título e Cliente --><div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Título do Evento</label>
                            <input 
                                v-model="currentEvent.title" 
                                type="text" 
                                required
                                class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                            <input 
                                v-model="currentEvent.client" 
                                type="text" 
                                required
                                class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />
                        </div>
                    </div>

                    <!-- Linha 2: Data, Hora Início e Hora Fim --><div class="grid grid-cols-3 gap-4">
                         <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Data</label>
                            <input 
                                :value="formatDate(currentEvent.date)" 
                                @input="updateEventDate($event.target.value)"
                                type="date" 
                                required
                                class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Hora Início</label>
                            <input 
                                :value="getEventTimePart('start')"
                                @input="setEventTimePart('start', $event.target.value)"
                                type="time" 
                                required
                                class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Hora Fim</label>
                            <input 
                                :value="getEventTimePart('end')"
                                @input="setEventTimePart('end', $event.target.value)"
                                type="time" 
                                required
                                class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />
                        </div>
                    </div>

                    <!-- Linha 3: Valor e Prioridade --><div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                            <input 
                                v-model.number="currentEvent.value" 
                                type="number" 
                                step="0.01"
                                required
                                class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                            <select 
                                v-model="currentEvent.priority" 
                                required
                                class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            >
                                <option value="high">Alta</option>
                                <option value="medium">Média</option>
                                <option value="low">Baixa</option>
                            </select>
                        </div>
                    </div>

                    <!-- Linha 4: Descrição --><div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea 
                            v-model="currentEvent.description" 
                            rows="3" 
                            class="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        ></textarea>
                    </div>

                    <!-- Botões de Ação do Modal --><div class="flex justify-end gap-3 pt-4">
                        <button 
                            @click="isEventModalOpen = false"
                            type="button"
                            class="h-10 px-4 rounded-lg text-sm font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            class="h-10 px-4 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                        >
                            {{ isEditingEvent ? 'Salvar Alterações' : 'Criar Evento' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// Importação dos ícones Lucide para Vue
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  DollarSign,
  Edit,
  Trash2,
  ListOrdered
} from 'lucide-vue-next';

// --- Dados e Lógica do Gerenciamento de Disponibilidade (Availability, Break, Override) ---

const weekDaysFull = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// --- 1. Estruturas de Dados ---

// Availability (Agenda Geral)
// export interface WorkingHours { day: number; enabled: boolean; startTime: string; endTime: string; }

// Break (Pausas)
// export interface BreakHours { day: number; startTime: string; endTime: string; }

// Override (Exceções)
// export interface OverrideHours { date: string; type: 'unavailable' | 'partial'; startTime?: string; endTime?: string; }


// --- 2. Estado Principal (Armazenamento das 3 Regras) ---

// Estado principal do horário de trabalho (Agenda Geral)
const workingHours = ref([
  { day: 0, enabled: false, startTime: "09:00", endTime: "18:00" }, // Domingo
  { day: 1, enabled: true, startTime: "09:00", endTime: "18:00" },  // Segunda
  { day: 2, enabled: true, startTime: "09:00", endTime: "18:00" },  // Terça
  { day: 3, enabled: true, startTime: "09:00", endTime: "18:00" },  // Quarta
  { day: 4, enabled: true, startTime: "09:00", endTime: "18:00" },  // Quinta
  { day: 5, enabled: true, startTime: "09:00", endTime: "18:00" },  // Sexta
  { day: 6, enabled: false, startTime: "09:00", endTime: "18:00" }, // Sábado
]);

// Estado de Pausas
const breakHours = ref([
    { day: 1, startTime: "12:00", endTime: "13:00" }, // Exemplo: Pausa de almoço segunda
    { day: 3, startTime: "12:00", endTime: "13:00" }, // Exemplo: Pausa de almoço quarta
]);

// Estado de Exceções
const overrideHours = ref([
    { date: "2025-11-03", type: 'partial', startTime: '14:00', endTime: '18:00' }, // Exemplo: Indisponível na tarde de 03/11
    { date: "2025-12-25", type: 'unavailable' }, // Exemplo: Natal, dia inteiro indisponível
]);


// --- 3. Lógica do Modal de Configuração (Tabs e Estado Local) ---

const isWorkingHoursOpen = ref(false);
const tab = ref('general'); // Controla a aba: 'general', 'breaks', 'overrides'

const initialHoursState = computed(() => ({
    general: JSON.parse(JSON.stringify(workingHours.value)),
    breaks: JSON.parse(JSON.stringify(breakHours.value)),
    overrides: JSON.parse(JSON.stringify(overrideHours.value))
}));

const hoursToEdit = ref(initialHoursState.value);

const onWorkingHours = () => {
    // Carrega o estado atual para edição
    hoursToEdit.value = initialHoursState.value;
    isWorkingHoursOpen.value = true;
};

// Funções para Agenda Geral (WorkingHours)
const handleToggleDay = (day) => {
  hoursToEdit.value.general = hoursToEdit.value.general.map((h) =>
    h.day === day ? { ...h, enabled: !h.enabled } : h
  );
};

const handleTimeChange = (day, field, value) => {
  hoursToEdit.value.general = hoursToEdit.value.general.map((h) =>
    h.day === day ? { ...h, [field]: value } : h
  );
};

// Funções para Pausas (BreakHours)
const addBreak = () => {
    hoursToEdit.value.breaks.push({ day: 1, startTime: "12:00", endTime: "13:00" });
};
const removeBreak = (index) => {
    hoursToEdit.value.breaks.splice(index, 1);
};

// Funções para Exceções (OverrideHours)
const addOverride = () => {
    // Dia padrão para o override: hoje
    const today = new Date().toISOString().substring(0, 10);
    hoursToEdit.value.overrides.push({ date: today, type: 'unavailable' });
};
const removeOverride = (index) => {
    hoursToEdit.value.overrides.splice(index, 1);
};

const handleSave = () => {
  // Salva os três estados no estado principal
  workingHours.value = hoursToEdit.value.general;
  breakHours.value = hoursToEdit.value.breaks;
  overrideHours.value = hoursToEdit.value.overrides;

  isWorkingHoursOpen.value = false;
  alert("Configurações de disponibilidade salvas!");
};


// --- 4. Função Principal de Disponibilidade (getAvailableSlots) ---

/**
 * Retorna os slots de disponibilidade para um dia específico (day: 1-31).
 * Implementa a hierarquia: Override > Break > General.
 */
const getAvailableSlots = (day, month, year) => {
    const fullDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const dayOfWeek = new Date(year, month, day).getDay(); // 0 (Dom) - 6 (Sáb)

    // Helper para converter HH:MM para minutos
    const timeToMinutes = (time) => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    };

    // --- PASSO 1: Verificar Override (Prioridade Máxima) ---
    const dayOverride = overrideHours.value.find(o => o.date === fullDate);

    if (dayOverride) {
        if (dayOverride.type === 'unavailable') {
            return []; // Dia inteiro indisponível
        }
        if (dayOverride.type === 'partial') {
            // Indisponibilidade Parcial é invertida: retorna o que NÃO está no override.
            const startOverride = timeToMinutes(dayOverride.startTime || '00:00');
            const endOverride = timeToMinutes(dayOverride.endTime || '23:59');
            
            let slots = [];
            // Slot 1: 00:00 até Início do Override
            if (startOverride > 0) {
                 slots.push({ startTime: '00:00', endTime: dayOverride.startTime });
            }
            // Slot 2: Fim do Override até 23:59
            if (endOverride < timeToMinutes('23:59')) {
                 slots.push({ startTime: dayOverride.endTime, endTime: '23:59' });
            }
            return slots;
        }
    }


    // --- PASSO 2: Aplicar Agenda Geral (Availability) ---
    const dayGeneral = workingHours.value[dayOfWeek];
    if (!dayGeneral.enabled) {
        return []; // Dia de trabalho desabilitado
    }
    
    // Inicia com 1 slot de disponibilidade geral
    let availableSlots = [{ 
        start: timeToMinutes(dayGeneral.startTime), 
        end: timeToMinutes(dayGeneral.endTime) 
    }];

    // --- PASSO 3: Aplicar Pausas (Break) ---
    const dayBreaks = breakHours.value.filter(b => b.day === dayOfWeek);

    dayBreaks.forEach(breakTime => {
        const breakStart = timeToMinutes(breakTime.startTime);
        const breakEnd = timeToMinutes(breakTime.endTime);
        let newSlots = [];

        availableSlots.forEach(slot => {
            // 1. Pausa antes do slot ou Pausa depois do slot (sem interseção)
            if (breakEnd <= slot.start || breakStart >= slot.end) {
                newSlots.push(slot);
                return;
            }

            // 2. Pausa começa antes do slot e termina dentro (corta o início)
            if (breakStart <= slot.start && breakEnd < slot.end) {
                newSlots.push({ start: breakEnd, end: slot.end });
                return;
            }

            // 3. Pausa começa dentro do slot e termina depois (corta o fim)
            if (breakStart > slot.start && breakEnd >= slot.end) {
                newSlots.push({ start: slot.start, end: breakStart });
                return;
            }
            
            // 4. Pausa está totalmente dentro do slot (divide em dois)
            if (breakStart > slot.start && breakEnd < slot.end) {
                newSlots.push({ start: slot.start, end: breakStart });
                newSlots.push({ start: breakEnd, end: slot.end });
                return;
            }

            // 5. Pausa cobre o slot inteiro (nenhum slot é adicionado)
        });
        availableSlots = newSlots;
    });

    // Converte os slots de minutos de volta para HH:MM
    const minutesToTime = (minutes) => {
        const h = Math.floor(minutes / 60).toString().padStart(2, '0');
        const m = (minutes % 60).toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    return availableSlots.map(slot => ({
        startTime: minutesToTime(slot.start),
        endTime: minutesToTime(slot.end)
    }));
};


// --- Dados e Lógica da Agenda (Existente e Refatorado) ---

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const mockEvents = ref([
  {
    id: 1,
    date: 17,
    title: "Reunião com cliente",
    description: "Apresentação do projeto",
    client: "João Silva",
    value: 500.00,
    time: "10:00 - 11:00",
    deliveryTime: "11:00", 
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
    deliveryTime: "15:30", 
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
    deliveryTime: "18:00", 
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
]);

// Estado reativo da Agenda
const currentMonth = ref(9);
const currentYear = ref(2025);
const selectedDay = ref(17); // Dia 17 é uma Segunda-feira (dayOfWeek = 1) no mock de Outubro

// Estado para os filtros e ordenação
const filterState = ref({
    order: 'arrival', 
    priority: 'todos',
    client: 'todos',
    status: 'todos',
});

// --- Lógica CRUD de Eventos (Mantida e com pequenas correções) ---

const isEventModalOpen = ref(false);
const isEditingEvent = ref(false);

const getDefaultEvent = () => ({
    id: Date.now(),
    date: selectedDay.value,
    title: '',
    description: '',
    client: '',
    value: 0.00,
    time: '09:00 - 10:00',
    deliveryTime: '10:00',
    status: 'Pendente',
    priority: 'medium',
});

const currentEvent = ref(getDefaultEvent());

const openEventModal = (event = null) => {
    isEditingEvent.value = !!event;
    if (event) {
        currentEvent.value = JSON.parse(JSON.stringify(event)); // Cópia profunda
    } else {
        currentEvent.value = getDefaultEvent();
    }
    isEventModalOpen.value = true;
};

const saveEvent = () => {
    // 1. Validar e formatar horário de entrega
    const timeParts = currentEvent.value.time.split(' - ');
    if (timeParts.length === 2 && timeParts[0] && timeParts[1]) {
        currentEvent.value.deliveryTime = timeParts[1];
    } else {
        alert("Formato de horário inválido. Use 'HH:MM - HH:MM' para Hora Início e Hora Fim.");
        return;
    }

    if (isEditingEvent.value) {
        // Atualiza evento existente
        const index = mockEvents.value.findIndex(e => e.id === currentEvent.value.id);
        if (index !== -1) {
            mockEvents.value[index] = currentEvent.value;
        }
    } else {
        // Cria novo evento
        mockEvents.value.push(currentEvent.value);
    }
    
    // Garantir que o dia selecionado seja o dia do novo evento
    selectedDay.value = currentEvent.value.date;

    isEventModalOpen.value = false;
    alert(`Evento ${isEditingEvent.value ? 'atualizado' : 'criado'} com sucesso!`);
};

const deleteEvent = (id) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
        mockEvents.value = mockEvents.value.filter(e => e.id !== id);
        alert("Evento excluído.");
    }
};

const confirmEvent = (id) => {
    const event = mockEvents.value.find(e => e.id === id);
    if (event) {
        event.status = 'Confirmado';
        alert(`Evento '${event.title}' confirmado!`);
        // **********************************************
        // Ação de UX: Mudar para o dia do evento confirmado
        // **********************************************
        handleSelectDay(event.date); 
    }
};

const cancelEvent = (id) => {
    const event = mockEvents.value.find(e => e.id === id);
    if (event) {
        event.status = 'Cancelado'; 
        alert(`Evento '${event.title}' cancelado.`);
    }
};

// Funções de formatação de data para o modal
const formatDate = (day) => {
    // Retorna a data no formato YYYY-MM-DD para o input type="date"
    const month = (currentMonth.value + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${currentYear.value}-${month}-${d}`;
};

const updateEventDate = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date)) {
        currentEvent.value.date = date.getDate();
    }
};

const getEventTimePart = (part) => {
    const times = currentEvent.value.time.split(' - ');
    if (part === 'start') return times[0] || '09:00';
    if (part === 'end') return times[1] || '10:00';
    return '';
};

const setEventTimePart = (part, value) => {
    const times = currentEvent.value.time.split(' - ');
    if (part === 'start') {
        currentEvent.value.time = `${value || '09:00'} - ${times[1] || '10:00'}`;
    } else if (part === 'end') {
        currentEvent.value.time = `${times[0] || '09:00'} - ${value || '10:00'}`;
        currentEvent.value.deliveryTime = value || '10:00';
    }
};


// --- Lógica de Calendário e Filtros (Existente) ---

const getDaysInMonth = () => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
};

const getFirstDayOfMonth = () => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
};

const filteredEvents = computed(() => {
    let events = mockEvents.value.filter(event => event.date === selectedDay.value);
    const filters = filterState.value;

    if (filters.priority !== 'todos') {
        events = events.filter(event => event.priority === filters.priority);
    }

    if (filters.client !== 'todos') {
        events = events.filter(event => event.client === filters.client);
    }

    if (filters.status !== 'todos') {
        events = events.filter(event => event.status.toLowerCase() === filters.status);
    }

    return events.sort((a, b) => {
        switch (filters.order) {
            case 'priority':
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'delivery':
                const timeA = a.deliveryTime || a.time.split(' - ')[1];
                const timeB = b.deliveryTime || b.time.split(' - ')[1];
                return timeA.localeCompare(timeB);
            case 'time':
                const startA = a.time.split(' - ')[0];
                const startB = b.time.split(' - ')[0];
                return startA.localeCompare(startB);
            case 'arrival':
            default:
                return a.id - b.id;
        }
    });
});

// NOVO: Eventos Pendentes
const pendingEvents = computed(() => {
    return mockEvents.value.filter(event => event.status === 'Pendente');
});


const calendarDays = computed(() => {
  const daysInMonth = getDaysInMonth();
  const firstDay = getFirstDayOfMonth();
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push({ key: `empty-${i}`, content: '', isEmpty: true });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    // Para fins de demonstração, vamos verificar a disponibilidade no dia.
    const isAvailable = getAvailableSlots(day, currentMonth.value, currentYear.value).length > 0;
    const hasEvents = mockEvents.value.some(event => event.date === day);
    const isSelected = day === selectedDay.value;

    days.push({
      key: day,
      content: day,
      isEmpty: false,
      hasEvents,
      isSelected,
      isAvailable
    });
  }

  return days;
});

const uniqueClients = computed(() => {
    const clients = new Set(mockEvents.value.map(event => event.client));
    return Array.from(clients).sort();
});

const handleSelectDay = (day) => {
  selectedDay.value = day;
};

const getStatusBadgeVariant = (status) => {
    if (status === "Confirmado") return "bg-green-500/10 text-green-700 border-green-500";
    if (status === "Reunião") return "bg-blue-500/10 text-blue-700 border-blue-500";
    if (status === "Pendente") return "bg-yellow-500/10 text-yellow-700 border-yellow-500";
    return "bg-gray-500/10 text-gray-700 border-gray-500"; // Inclui "Cancelado" e outros
};

const getPriorityBadgeClass = (priority) => {
    if (priority === "high") return "border-red-500 text-red-500 bg-red-50/70";
    if (priority === "medium") return "border-yellow-500 text-yellow-600 bg-yellow-50/70";
    return "border-green-500 text-green-600 bg-green-50/70";
};

// Funções de Ação (Substituem o toast/alert nativo)
function alert(message) {
    console.log(`[Toast Sucesso]: ${message}`);
}
function confirm(message) {
    return window.confirm(message); // Mantendo o nativo para esta demonstração
}
</script>

<style scoped>
/* Transição do Modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
