<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-mask">
      <div class="modal-wrapper" @click.self="$emit('close')">
        <div
          class="modal-container bg-gray-800 shadow-xl border border-blue-900/40 transform transition-all duration-300 ease-in-out rounded-xl w-[500px] max-w-full"
        >
          <!-- HEADER -->
          <div class="modal-header flex justify-between items-center border-b border-gray-700 px-4 py-3">
            <h3 class="text-xl font-bold text-blue-300">
              Configuração de Agenda
            </h3>
            <button class="modal-close-btn text-gray-400 hover:text-gray-200 text-2xl" @click="$emit('close')">
              ×
            </button>
          </div>

          <!-- CONTEÚDO -->
          <div class="modal-body p-5 space-y-4">
            
            <!-- COLLAPSE -->
            <div class="collapse-section border border-gray-700 rounded-lg overflow-hidden">
              <!-- Título do Collapse -->
              <button
                @click="isCollapseOpen = !isCollapseOpen"
                class="w-full flex justify-between items-center px-4 py-3 bg-gray-700 hover:bg-gray-600 transition"
              >
                <span class="text-gray-200 font-medium">🗓️ Configurar dias de trabalho</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  :class="['w-5 h-5 transition-transform', { 'rotate-180': isCollapseOpen }]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Conteúdo do Collapse -->
<transition name="expand">
  <div v-show="isCollapseOpen" class="p-4 bg-gray-800 border-t border-gray-700 space-y-3">

      <h4 class="text-gray-300 text-sm font-semibold mb-2">Horário de trabalho</h4>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <!-- Início -->
    <div>
      <label class="block text-gray-400 text-xs mb-1">Início</label>
      <input
        type="time"
        v-model="workStart"
        class="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Intervalo -->
    <div>
      <label class="block text-gray-400 text-xs mb-1">Intervalo</label>
      <input
        type="time"
        v-model="workBreak"
        class="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Fim -->
    <div>
      <label class="block text-gray-400 text-xs mb-1">Fim</label>
      <input
        type="time"
        v-model="workEnd"
        class="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>

  <!-- Exibição do resumo -->
  <div v-if="workStart && workEnd" class="mt-3 text-sm text-gray-400">
    <p>
      Horário selecionado: 
      <span class="text-gray-200 font-medium">
        {{ workStart }} - {{ workBreak ? workBreak + ' (intervalo) - ' : '' }}{{ workEnd }}
      </span>
    </p>
  </div>
    
    <!-- Checkbox -->
    <div class="flex items-center space-x-2">
      <input
        id="cantWorkCheckbox"
        type="checkbox"
        v-model="hasUnavailableDays"
        class="w-4 h-4 text-blue-500 border-gray-600 rounded focus:ring-blue-500 bg-gray-900"
      />
      <label for="cantWorkCheckbox" class="text-gray-300 text-sm">
        Existem dias da semana em que você <strong>não pode trabalhar</strong>?
      </label>
    </div>

    <!-- Select múltiplo -->
    <div>
      <label class="block text-gray-300 text-sm font-semibold mb-1">
        Selecione os dias indisponíveis:
      </label>

      <select
        multiple
        v-model="unavailableDays"
        :disabled="!hasUnavailableDays"
        class="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <option v-for="day in weekDays" :key="day" :value="day">{{ day }}</option>
      </select>
    </div>

    <!-- Exibir resultado -->
    <div v-if="hasUnavailableDays && unavailableDays.length" class="text-sm text-gray-400 mt-2">
      <p>Dias marcados como indisponíveis:</p>
      <ul class="list-disc ml-5 text-gray-300">
        <li v-for="day in unavailableDays" :key="day">{{ day }}</li>
      </ul>
    </div>

    <!-- Selecionar horários de trabalho -->
<div class="mt-6 border-t border-gray-700 pt-4">

<!-- Exceção de horário -->
<div class="mt-6 border-t border-gray-700 pt-4">
  <label class="flex items-center space-x-2 text-gray-300 font-semibold">
    <input
      type="checkbox"
      v-model="hasException"
      class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
    />
    <span>Existe algum horário de exceção?</span>
  </label>

  <transition name="fade">
    <div
      v-show="hasException"
      class="mt-3 bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3"
    >
      <p class="text-sm text-gray-400 mb-2">
        Selecione o intervalo em que <span class="text-red-400">não poderá trabalhar</span>:
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-gray-400 text-xs mb-1">Início da exceção</label>
          <input
            type="time"
            v-model="exceptionStart"
            class="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-gray-400 text-xs mb-1">Fim da exceção</label>
          <input
            type="time"
            v-model="exceptionEnd"
            class="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Resumo -->
      <div v-if="exceptionStart && exceptionEnd" class="text-sm text-gray-400 mt-2">
        <p>
          Exceção ativa:
          <span class="text-red-400 font-medium">{{ exceptionStart }} - {{ exceptionEnd }}</span>
        </p>
      </div>
    </div>
  </transition>
</div>
  
</div>

  </div>
</transition>
            </div>

          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';
// 🚨 Importar o novo componente de dropdown
import CategoryDropdown from './CategoryDropdown.vue'; 


// Estado do collapse
const isCollapseOpen = ref(false);

// Campo do input
const workdayName = ref("");

// Simulação de ação (exemplo)
const saveWorkday = () => {
  console.log("Nome do dia salvo:", workdayName.value);
  alert(`Dia de trabalho salvo: ${workdayName.value}`);
};

const workStart = ref("");
const workBreak = ref("");
const workEnd = ref("");

const hasException = ref(false);
const exceptionStart = ref("");
const exceptionEnd = ref("");

const props = defineProps({
  isVisible: Boolean,
  category: Object,         // A categoria padrão do painel lateral
  eventCategories: Array,   // 🚨 A lista completa de categorias (USADA PELO DROPDOWN)
  selectInfo: Object,       // Informações de seleção do FullCalendar
});

const emit = defineEmits(['close', 'create']);

const eventData = reactive({
  title: '',
  start: '',
  end: '',
});

const hasUnavailableDays = ref(false);
const unavailableDays = ref([]);

// Lista de dias da semana
const weekDays = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

// Estado que será atualizado pelo CategoryDropdown
const selectedCategory = ref(props.category); 

// Função para atualizar a categoria quando o dropdown emitir a mudança
const updateCategory = (newCategory) => {
    selectedCategory.value = newCategory;
}

watch(() => props.isVisible, (newVal) => {
  if (newVal && props.selectInfo) {
    eventData.title = '';
    eventData.start = props.selectInfo.startStr.slice(0, 16); 
    eventData.end = props.selectInfo.endStr.slice(0, 16);
    
    // Resetar a seleção de categoria para o valor inicial (do painel lateral)
    selectedCategory.value = props.category;
  }
});

const submitEvent = () => {
  if (!eventData.title) {
    alert('O nome do evento é obrigatório!');
    return;
  }
  
  // Envia a className da categoria SELECIONADA
  emit('create', {
    title: eventData.title,
    start: eventData.start,
    end: eventData.end,
    // 🚨 PONTO CHAVE: Usar a className do ref reativo, que o usuário pode ter alterado
    className: selectedCategory.value.className, 
    allDay: props.selectInfo.allDay,
  });
};
</script>

<style scoped>
/* Estilos mantidos (removi a lógica de select customizado que estava aqui antes) */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75); 
  transition: opacity 0.3s ease;
  animation: pulse-bg 10s infinite alternate; 
}
@keyframes pulse-bg {
  from { background-color: rgba(0, 0, 0, 0.75); }
  to { background-color: rgba(0, 0, 0, 0.85); }
}

.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.modal-container {
  width: 400px;
  max-width: 90%;
  padding: 20px 30px;
  border-radius: 8px;
  opacity: 1;
  transform: scale(1);
}

.modal-header {
  @apply flex justify-between items-center pb-3 mb-4 border-b border-gray-700;
}

.modal-close-btn {
  @apply text-gray-500 hover:text-red-400 text-2xl leading-none transition duration-150;
}

.modal-footer {
  @apply flex justify-end space-x-3 pt-4 border-t border-gray-700 mt-6;
}

.btn-primary {
  @apply bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-cancel {
  @apply bg-gray-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-150;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/* Fundo semitransparente */
.modal-mask {
  @apply fixed inset-0 bg-black/60 flex justify-center items-center z-50;
}

/* Animação de abrir/fechar modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Animação suave de expand/collapse */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>