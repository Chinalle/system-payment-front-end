<script setup lang="ts">
import { ref, computed } from 'vue';
// Corrigido: O caminho agora "sobe" (..) e "entra" em components/
import ServiceModals from '../components/ServiceModals.vue';

// Importando ícones da Lucide
import {
  Plus,
  Search,
  BookUser,
  Activity,
  DollarSign,
  Clock,
  Pencil,
  Trash2,
  Scissors,
  Hand,
  Sparkles,
  Paintbrush2, // Para Unhas
  CloudDrizzle, // Para Depilação
} from 'lucide-vue-next';

// --- Tipos de Dados ---
interface Service {
  id: number;
  name: string;
  category: string;
  duration: string;
  price: number;
  active: boolean;
}

// --- Mock Data (Baseado na sua imagem) ---
const services = ref<Service[]>([
  { id: 1, name: 'Corte de Cabelo', category: 'Cabelo', duration: '30min', price: 50.00, active: true },
  { id: 2, name: 'Barba', category: 'Cabelo', duration: '20min', price: 30.00, active: true },
  { id: 3, name: 'Massagem Relaxante', category: 'Massagem', duration: '60min', price: 120.00, active: true },
  { id: 4, name: 'Limpeza de Pele', category: 'Estética', duration: '45min', price: 90.00, active: true },
  { id: 5, name: 'Manicure', category: 'Unhas', duration: '40min', price: 45.00, active: true },
  { id: 6, name: 'Pedicure', category: 'Unhas', duration: '45min', price: 50.00, active: true },
  { id: 7, name: 'Coloração', category: 'Cabelo', duration: '90min', price: 150.00, active: false },
  { id: 8, name: 'Depilação (Axila)', category: 'Depilação', duration: '15min', price: 25.00, active: true },
]);

// --- 'categories' agora é reativo ---
// Esta é a lista "mestra" de categorias que a aplicação conhece.
const categories = ref(["Cabelo", "Massagem", "Estética", "Unhas", "Depilação"]);

// --- Os botões de filtro agora usam 'categories' ---
const filterCategories = computed(() => {
  // Adiciona "Todos" no início da lista de categorias para os botões de filtro
  return ["Todos", ...categories.value];
});

// --- Estado da UI ---
const searchTerm = ref('');
const selectedCategory = ref('Todos');

// --- Estado dos Modais ---
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedService = ref<Service | null>(null);

// --- Lógica de Filtro ---
const filteredServices = computed(() => {
  return services.value.filter(service => {
    const matchesCategory = selectedCategory.value === 'Todos' || service.category === selectedCategory.value;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
});

// --- Lógica de Estatísticas (KPIs) ---
const totalCount = computed(() => services.value.length);
const activeCount = computed(() => services.value.filter(s => s.active).length);
const avgRevenue = computed(() => {
  if (services.value.length === 0) return 0;
  const total = services.value.reduce((sum, s) => sum + s.price, 0);
  return (total / services.value.length);
});
const avgDuration = computed(() => {
  if (services.value.length === 0) return 0;
  // Extrai o número de '30min', '60min', etc.
  const totalMinutes = services.value.reduce((sum, s) => sum + parseInt(s.duration.replace('min', '')), 0);
  return Math.round(totalMinutes / services.value.length);
});

// --- Funções Auxiliares ---
function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Mapeia categoria para um componente de ícone
function getCategoryIcon(category: string) {
  switch (category) {
    case 'Cabelo': return Scissors;
    case 'Massagem': return Hand;
    case 'Estética': return Sparkles;
    case 'Unhas': return Paintbrush2;
    case 'Depilação': return CloudDrizzle;
    default: return Sparkles; // Ícone padrão para novas categorias
  }
}

// --- Funções de Interatividade (Abrir Modais) ---
function openNewServiceModal() {
  selectedService.value = null;
  isEditModalOpen.value = true;
}

function openEditModal(service: Service) {
  selectedService.value = service;
  isEditModalOpen.value = true;
}

function openDeleteModal(service: Service) {
  selectedService.value = service;
  isDeleteModalOpen.value = true;
}

// --- Funções de Interatividade (Salvar/Excluir) ---
function handleSaveService(serviceData: Service) {
  const index = services.value.findIndex(s => s.id === serviceData.id);
  if (index !== -1) {
    // Editando
    services.value[index] = serviceData;
  } else {
    // Criando
    services.value.push(serviceData);
  }

  // --- Aprende a nova categoria ---
  // Se a categoria do serviço guardado não existe na nossa lista 'mestra',
  // adiciona-a.
  if (!categories.value.includes(serviceData.category)) {
    categories.value.push(serviceData.category);
  }
  // (Aqui você também enviaria para a API)
}

function handleDeleteService(serviceId: number) {
  services.value = services.value.filter(s => s.id !== serviceId);
  // (Aqui você também enviaria para a API)
}

</script>

<template>
  <div class="text-gray-200 min-h-screen p-4 md:p-8 font-sans">
    
    <!-- Conteúdo Principal (com padding para o header) -->
    <main class="max-w-7xl mx-auto pt-14">
      
      <!-- Título da Página e Botão de Ação -->
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 my-8">
        <div>
          <h2 class="text-3xl font-bold text-white">Gestão de Serviços</h2>
          <p class="text-gray-400 mt-1">Gerencie e organize todos os serviços do seu negócio</p>
        </div>
        <button
          @click="openNewServiceModal"
          class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg"
        >
          <Plus :size="18" />
          Novo Serviço
        </button>
      </div>

      <!-- 1. Cards de Estatísticas (KPIs) -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        <!-- Card: Total de Serviços -->
        <div class="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm text-gray-400">Total de Serviços</p>
              <h3 class="text-3xl font-bold text-white mt-2">{{ totalCount }}</h3>
            </div>
            <div class="p-3 rounded-full bg-blue-500/20 text-blue-400">
              <BookUser :size="20" />
            </div>
          </div>
        </div>
        <!-- Card: Serviços Ativos -->
        <div class="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm text-gray-400">Serviços Ativos</p>
              <h3 class="text-3xl font-bold text-white mt-2">{{ activeCount }}</h3>
            </div>
            <div class="p-3 rounded-full bg-green-500/20 text-green-400">
              <Activity :size="20" />
            </div>
          </div>
        </div>
        <!-- Card: Receita Média -->
        <div class="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm text-gray-400">Receita Média</p>
              <h3 class="text-3xl font-bold text-white mt-2">{{ formatCurrency(avgRevenue) }}</h3>
            </div>
            <div class="p-3 rounded-full bg-yellow-500/20 text-yellow-400">
              <DollarSign :size="20" />
            </div>
          </div>
        </div>
        <!-- Card: Duração Média -->
        <div class="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm text-gray-400">Duração Média</p>
              <h3 class="text-3xl font-bold text-white mt-2">{{ avgDuration }}min</h3>
            </div>
            <div class="p-3 rounded-full bg-purple-500/20 text-purple-400">
              <Clock :size="20" />
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Barra de Busca e Filtros -->
      <section class="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 flex flex-col md:flex-row justify-between gap-4 my-8">
        <!-- Input de Busca -->
        <div class="relative w-full md:w-1/3">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Buscar serviços..."
            class="w-full bg-slate-700 border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <!-- Botões de Filtro (agora usam filterCategories) -->
        <div class="flex gap-2 flex-wrap justify-start md:justify-end">
          <button
            v-for="cat in filterCategories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </section>

      <!-- 3. Lista de Serviços -->
      <section>
        <h3 class="text-xl font-semibold text-white mb-4">{{ filteredServices.length }} Serviços</h3>
        
        <!-- Grid de Cards de Serviço -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="service in filteredServices"
            :key="service.id"
            class="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <!-- Corpo do Card -->
            <div class="p-5">
              <div class="flex justify-between items-start">
                <!-- Ícone, Nome e Categoria -->
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-slate-700 text-blue-400">
                    <component :is="getCategoryIcon(service.category)" :size="20" />
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-white">{{ service.name }}</h4>
                    <p class="text-sm text-gray-400">{{ service.category }}</p>
                  </div>
                </div>
                <!-- Badge Ativo/Inativo -->
                <span 
                  :class="[
                    'text-xs font-medium px-2.5 py-0.5 rounded-full',
                    service.active
                      ? 'bg-green-600/20 text-green-300'
                      : 'bg-red-600/20 text-red-300'
                  ]"
                >
                  {{ service.active ? 'Ativo' : 'Inativo' }}
                </span>
              </div>
              
              <!-- Duração e Preço -->
              <div class="flex justify-between items-center my-4 pt-4 border-t border-slate-700">
                <span class="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock :size="16" />
                  {{ service.duration }}
                </span>
                <span class="text-lg font-semibold text-white">
                  {{ formatCurrency(service.price) }}
                </span>
              </div>
            </div>
            
            <!-- Ações (Rodapé do Card) -->
            <div class="flex gap-2 p-4 bg-slate-800/50 border-t border-slate-700">
              <button
                @click="openEditModal(service)"
                class="flex w-full items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-medium px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Pencil :size="16" />
                Editar
              </button>
              <button
                @click="openDeleteModal(service)"
                class="flex items-center justify-center bg-slate-700 hover:bg-red-600/20 text-red-500 hover:text-red-400 font-medium px-3 py-2 rounded-lg transition-colors"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>

        <!-- Mensagem de "Nenhum resultado" -->
        <div v-if="filteredServices.length === 0" class="text-center text-gray-400 py-16">
          <p class="text-lg">Nenhum serviço encontrado</p>
          <p class="text-sm">Tente ajustar sua busca ou filtros.</p>
        </div>
      </section>
    </main>

    <!-- 4. Componente de Modais -->
    <!-- Passa a lista de 'categories' como prop -->
    <ServiceModals
      v-model:editModalOpen="isEditModalOpen"
      v-model:deleteModalOpen="isDeleteModalOpen"
      :service="selectedService"
      :categories="categories" 
      @save="handleSaveService"
      @delete="handleDeleteService"
    />
  </div>
</template>

