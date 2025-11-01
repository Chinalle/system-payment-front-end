<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';

// --- Definição de Tipos (sem ícone) ---
interface Service {
  id: number;
  name: string;
  category: string;
  duration: string;
  price: number;
  active: boolean;
}

interface ServiceFormData {
  name: string;
  category: string;
  duration: string;
  price: string; // O formulário usa string
  active: boolean;
}

// --- Props e Emits ---
const props = defineProps<{
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  service: Service | null;
  categories: string[]; // Recebe as categorias do pai
}>();

const emit = defineEmits<{
  (e: 'update:editModalOpen', value: boolean): void;
  (e: 'update:deleteModalOpen', value: boolean): void;
  (e: 'save', data: Service): void;
  (e: 'delete', id: number): void;
}>();

// --- Constantes (sem ícones) ---
// A lista de 'categories' foi movida para as props
const durations = ["15min", "20min", "30min", "40min", "45min", "60min", "90min", "120min"];

// --- Estado do Formulário ---
const defaultFormData = (): ServiceFormData => ({
  name: "",
  category: "", // Categoria inicial vazia
  duration: "30min",
  price: "",
  active: true,
});

// Usamos 'reactive' para o formulário
const formData = reactive<ServiceFormData>(defaultFormData());
// Estado para erros de validação
const errors = reactive({
  name: '',
  category: '',
  duration: '',
  price: '',
});

// --- Lógica do Título ---
const modalTitle = computed(() => (props.service ? "Editar Serviço" : "Novo Serviço"));
const modalDescription = computed(() =>
  props.service ? "Atualize as informações do serviço" : "Preencha os dados do novo serviço"
);

// --- Sincronizar Props com o Formulário ---
// Quando o modal de edição abre, preenche o formulário com os dados do serviço
watch(
  () => props.service,
  (newService) => {
    if (newService) {
      formData.name = newService.name;
      formData.category = newService.category;
      formData.duration = newService.duration;
      formData.price = newService.price.toString();
      formData.active = newService.active;
    } else {
      // Reseta o formulário se não houver serviço
      Object.assign(formData, defaultFormData());
    }
  }
);

// Limpa os erros quando o modal é aberto
watch(() => props.editModalOpen, (isOpen) => {
  if (isOpen) {
    Object.assign(errors, { name: '', category: '', duration: '', price: '' });
  }
});

// --- Manipuladores de Eventos ---

function closeEditModal() {
  emit('update:editModalOpen', false);
  // Reseta o formulário ao fechar
  Object.assign(formData, defaultFormData());
}

function closeDeleteModal() {
  emit('update:deleteModalOpen', false);
}

// Validação simples
function validateForm(): boolean {
  let isValid = true;
  Object.assign(errors, { name: '', category: '', duration: '', price: '' }); // Limpa erros

  if (formData.name.length < 3) {
    errors.name = "Nome deve ter pelo menos 3 caracteres";
    isValid = false;
  }
  // Validação de categoria agora verifica se não está vazia
  if (!formData.category || formData.category.trim() === '') {
    errors.category = "Selecione ou digite uma categoria";
    isValid = false;
  }
  if (!formData.duration) {
    errors.duration = "Informe a duração";
    isValid = false;
  }
  if (!formData.price || parseFloat(formData.price) <= 0) {
    errors.price = "Informe um preço válido";
    isValid = false;
  }
  return isValid;
}


function handleSubmit() {
  if (!validateForm()) {
    return; // Para se a validação falhar
  }
  
  const serviceData: Service = {
    ...formData,
    // 'trim()' para limpar espaços em branco da nova categoria
    category: formData.category.trim(), 
    price: parseFloat(formData.price), // Converte preço para número
    id: props.service?.id || Date.now(), // Usa ID existente ou cria novo
  };

  emit('save', serviceData);
  // Não temos mais 'toast', o componente pai deve tratar a notificação
  closeEditModal();
}

function handleDeleteConfirm() {
  if (props.service) {
    emit('delete', props.service.id);
  }
  // Não temos mais 'toast'
  closeDeleteModal();
}
</script>

<template>
  <!-- FUNDO ESCURO DO MODAL (OVERLAY) -->
  <div v-if="editModalOpen || deleteModalOpen" 
       class="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300"
       @click.self="closeEditModal(); closeDeleteModal()">
    
    <!-- ======================== -->
    <!--   MODAL DE EDIÇÃO/CRIAÇÃO  -->
    <!-- ======================== -->
    <div v-if="editModalOpen" 
         class="bg-slate-800 border border-slate-700 text-gray-200 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
         style="animation: modal-fade-in 0.2s ease-out;">
      
      <!-- Cabeçalho -->
      <div class="p-6 border-b border-slate-700">
        <h2 class="text-2xl font-semibold text-white">{{ modalTitle }}</h2>
        <p class="text-gray-400 text-sm mt-1">{{ modalDescription }}</p>
      </div>

      <!-- Formulário (com overflow) -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto">
        
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300 mb-1">Nome do Serviço</label>
          <input id="name" type="text" v-model="formData.name" placeholder="Ex: Corte de Cabelo"
                 class="w-full bg-slate-700 border-slate-600 rounded-md p-2 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" />
          <p v-if="errors.name" class="text-sm text-red-500 mt-1">{{ errors.name }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-300 mb-1">Categoria</label>
            <!--
              Substituímos o <select> por um <input> com <datalist>.
              Isto permite que o utilizador escreva um novo valor ou escolha um existente.
            -->
            <input 
              id="category" 
              type="text" 
              v-model="formData.category"
              placeholder="Selecione ou digite..."
              list="category-list"
              class="w-full bg-slate-700 border-slate-600 rounded-md p-2 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
            <datalist id="category-list">
              <!-- As sugestões vêm da prop 'categories' -->
              <option v-for="cat in categories" :key="cat" :value="cat"></option>
            </datalist>
            
            <p v-if="errors.category" class="text-sm text-red-500 mt-1">{{ errors.category }}</p>
          </div>
          <div>
            <label for="duration" class="block text-sm font-medium text-gray-300 mb-1">Duração</label>
            <select id="duration" v-model="formData.duration"
                    class="w-full bg-slate-700 border-slate-600 rounded-md p-2 text-white focus:ring-blue-500 focus:border-blue-500">
              <option v-for="dur in durations" :key="dur" :value="dur">{{ dur }}</option>
            </select>
            <p v-if="errors.duration" class="text-sm text-red-500 mt-1">{{ errors.duration }}</p>
          </div>
        </div>

        <div>
          <label for="price" class="block text-sm font-medium text-gray-300 mb-1">Preço (R$)</label>
          <input id="price" type="number" step="0.01" v-model="formData.price" placeholder="0.00"
                 class="w-full bg-slate-700 border-slate-600 rounded-md p-2 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" />
          <p v-if="errors.price" class="text-sm text-red-500 mt-1">{{ errors.price }}</p>
        </div>

        <!-- Switch de Status -->
        <div class="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 border border-slate-700">
          <div>
            <label for="active" class="text-sm font-medium text-white">Status do Serviço</label>
            <p class="text-sm text-gray-400">
              {{ formData.active ? "Serviço ativo e disponível" : "Serviço inativo" }}
            </p>
          </div>
          <!-- Switch CSS customizado (mantido do original, mas pode ser Tailwind) -->
          <label class="switch-toggle">
            <input id="active" type="checkbox" v-model="formData.active" />
            <span class="slider"></span>
          </label>
        </div>
      </form>

      <!-- Rodapé / Botões -->
      <div class="p-6 flex justify-end gap-3 bg-slate-800 border-t border-slate-700">
        <button type="button" 
                class="px-4 py-2 rounded-md font-semibold text-gray-300 bg-slate-700 hover:bg-slate-600 transition-colors"
                @click="closeEditModal">
          Cancelar
        </button>
        <button type="submit" 
                class="px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                @click="handleSubmit"> <!-- @click aqui funciona pois o form tem o @submit.prevent -->
          {{ service ? "Salvar Alterações" : "Criar Serviço" }}
        </button>
      </div>
    </div>

    <!-- ======================== -->
    <!--   MODAL DE EXCLUSÃO      -->
    <!-- ======================== -->
    <div v-if="deleteModalOpen" 
         class="bg-slate-800 border border-slate-700 text-gray-200 rounded-lg shadow-xl w-full max-w-md"
         style="animation: modal-fade-in 0.2s ease-out;">
       
       <div class="p-6">
        <h2 class="text-xl font-semibold text-white flex items-center gap-2">
          Excluir "{{ service?.name }}"?
        </h2>
        <p class="text-gray-400 text-sm mt-2">
          Esta ação não pode ser desfeita. O serviço será permanentemente removido
          do sistema e todos os agendamentos relacionados serão afetados.
        </p>
      </div>

      <div class="p-4 flex justify-end gap-3 bg-slate-800/50 border-t border-slate-700">
        <button type="button" 
                class="px-4 py-2 rounded-md font-semibold text-gray-300 bg-slate-700 hover:bg-slate-600 transition-colors"
                @click="closeDeleteModal">
          Cancelar
        </button>
        <button type="button" 
                class="px-4 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                @click="handleDeleteConfirm">
          Excluir Serviço
        </button>
      </div>
    </div>

  </div>
</template>

<!-- Estilos para a animação do modal e o switch (o resto é Tailwind) -->
<style scoped>
@keyframes modal-fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Toggle Switch CSS (mantido do seu original) */
.switch-toggle {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}
.switch-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #4b5563; /* gray-600 */
  transition: 0.4s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #3b82f6; /* primary (blue-500) */
}
input:checked + .slider:before {
  transform: translateX(16px);
}
</style>

