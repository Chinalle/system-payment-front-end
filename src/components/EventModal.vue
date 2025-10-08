<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-mask">
      <div class="modal-wrapper" @click.self="$emit('close')">
        <div class="modal-container bg-gray-800 shadow-xl border border-blue-900/40 transform transition-all duration-300 ease-in-out">
          
          <div class="modal-header">
            <h3 class="text-xl font-bold text-blue-300">
              Criar Novo Evento ({{ selectedCategory.name }})
            </h3>
            <button class="modal-close-btn" @click="$emit('close')">×</button>
          </div>

          <div class="modal-body space-y-4">
            
            <div>
              <label for="title" class="block text-sm font-medium text-gray-400 mb-1">Nome do Evento</label>
              <input
                id="title"
                v-model="eventData.title"
                type="text"
                placeholder="Ex: Reunião de Planejamento"
                class="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="start" class="block text-sm font-medium text-gray-400 mb-1">Início</label>
                <input
                  id="start"
                  v-model="eventData.start"
                  type="datetime-local"
                  class="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div class="flex-1">
                <label for="end" class="block text-sm font-medium text-gray-400 mb-1">Fim</label>
                <input
                  id="end"
                  v-model="eventData.end"
                  type="datetime-local"
                  class="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Serviço/Categoria</label>
              
              <CategoryDropdown
                  :categories="eventCategories"
                  :modelValue="selectedCategory"
                  @update:modelValue="updateCategory"
              />

            </div>

          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
            <button class="btn-primary" @click="submitEvent" :disabled="!eventData.title">Criar Evento</button>
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
</style>