<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // 1. IMPORTAMOS A AUTH STORE
// Importamos os nossos dados mockados
import { mockServices, mockUsers } from '@/data/mockData.js';
// Ícones para o Market e para os Resultados
import { Search, MapPin, Star, Clock, DollarSign, ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore(); // 2. INICIAMOS A STORE
const services = ref(mockServices);
const providers = ref(mockUsers.filter(u => u.role === 'provider'));

// --- ESTADO DA PÁGINA ---
const searchTerm = ref('');
const searchCategory = ref('');
// 'isSearching' controla qual estado a página mostra
const isSearching = ref(false); 

// --- DADOS PARA A VITRINE (v-if="!isSearching") ---
const featuredProviders = ref(providers.value.slice(0, 2));
const uniqueCategories = computed(() => {
  const categories = mockServices.map(s => s.category);
  return [...new Set(categories)]; // Remove duplicados
});

// --- DADOS PARA OS RESULTADOS (v-if="isSearching") ---
// Lógica de filtro (movida de Search.vue para aqui)
const filteredServices = computed(() => {
  return services.value.filter(service => {
    const matchesCategory = searchCategory.value 
      ? service.category.toLowerCase() === searchCategory.value.toLowerCase() 
      : true;
      
    const matchesSearch = searchTerm.value
      ? service.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        getProviderForService(service.providerId).name.toLowerCase().includes(searchTerm.value.toLowerCase())
      : true;
      
    return matchesCategory && matchesSearch;
  });
});

// Título dinâmico para os resultados
const resultsTitle = computed(() => {
  if (searchTerm.value) return `Resultados para "${searchTerm.value}"`;
  if (searchCategory.value) return `Serviços de "${searchCategory.value}"`;
  return "Todos os Serviços";
});

// --- FUNÇÕES HELPER ---
function getProviderForService(providerId) {
  return providers.value.find(p => p.id === providerId) || {};
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- FUNÇÕES DE NAVEGAÇÃO E AÇÃO ---

// Entra no modo "Resultados"
function handleSearch() {
  if (searchTerm.value.trim()) {
    searchCategory.value = ''; // Pesquisa por texto limpa a categoria
    isSearching.value = true;
  }
}

// Entra no modo "Resultados" com uma categoria
function goToCategorySearch(category) {
  searchTerm.value = ''; // Pesquisa por categoria limpa o texto
  searchCategory.value = category;
  isSearching.value = true;
}

// Limpa a busca e volta para a "Vitrine"
function clearSearchAndGoHome() {
  isSearching.value = false;
  searchTerm.value = '';
  searchCategory.value = '';
}

// Navega para a página de perfil (continua a ser uma nova página)
const goToProviderProfile = (providerId) => {
  router.push(`/provider/${providerId}`);
};

// **NOVA FUNÇÃO**
const goToCheckout = (service) => {
  // No futuro, você pode passar o service.id via query ou state management
  // router.push({ name: 'Checkout', query: { serviceId: service.id } });
  console.log('Contratando serviço:', service.name);
  router.push('/checkout');
};

const goToLogin = () => {
  router.push('/login');
};

const goToRegister = () => {
  router.push('/login'); // Alterado conforme solicitado
};

// 3. ADICIONAMOS A FUNÇÃO DE LOGOUT
const handleLogout = () => {
  // Assumindo que a sua store tem uma função 'logout'
  // Se o nome for diferente (ex: 'clearAuth'), atualize aqui
  if (authStore.logout) {
    authStore.logout();
  } else {
    // Fallback caso a função não exista com esse nome
    authStore.isLoggedIn = false;
    authStore.user = null;
    authStore.token = null;
    localStorage.removeItem('token'); // Limpa o token se estiver no localStorage
  }
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen text-gray-200 font-sans">
    
    <!-- Header de Navegação (Fixo) -->
    <header class="p-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-white cursor-pointer" @click="clearSearchAndGoHome">
        Marketplace
      </h1>
      
      <!-- 4. LÓGICA DE HEADER ATUALIZADA -->
      <div>
        <!-- Se NÃO estiver logado -->
        <div v-if="!authStore.isLoggedIn">
          <!-- O botão "Registar" foi removido e "Login" virou "Dashboard" -->
          <button @click="goToLogin" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
            Dashboard
          </button>
        </div>
        <!-- Se ESTIVER logado -->
        <div v-else class="flex items-center gap-4">
          <button @click="router.push('/dashboard')" class="text-gray-300 hover:text-white font-medium">
            Dashboard
          </button>
          <button @click="handleLogout" class="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md">
            Sair
          </button>
        </div>
      </div>
    </header>

    <!-- Conteúdo Principal (Muda com base no 'isSearching') -->
    <main class="container mx-auto p-4 md:p-8">

      <!-- =================================== -->
      <!-- ==   ESTADO 1: VITRINE           == -->
      <!-- =================================== -->
      <div v-if="!isSearching">
        <!-- Secção Hero (Principal) -->
        <section class="text-center my-12 md:my-20">
          <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-4">
            Encontre o serviço perfeito
          </h1>
          <p class="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Descubra e agende serviços de beleza, bem-estar e muito mais.
          </p>

          <!-- Barra de Busca -->
          <form @submit.prevent="handleSearch" class="max-w-xl mx-auto flex">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="O que você procura? Ex: 'Corte de Cabelo'"
              class="w-full bg-slate-800 border border-slate-700 rounded-l-md p-4 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-r-md flex items-center"
            >
              <Search class="h-5 w-5" />
            </button>
          </form>
        </section>

        <!-- Secção de Categorias -->
        <section class="my-16">
          <h2 class="text-3xl font-bold text-white mb-6">Navegue por categorias</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div
              v-for="category in uniqueCategories"
              :key="category"
              @click="goToCategorySearch(category)"
              class="bg-slate-800 p-6 rounded-lg text-center font-semibold text-white hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <span>{{ category }}</span>
            </div>
          </div>
        </section>

        <!-- Secção de Prestadores em Destaque -->
        <section class="my-16">
          <h2 class="text-3xl font-bold text-white mb-6">Prestadores em destaque</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <!--
              *** ALTERAÇÃO AQUI ***
              Removido: @click, cursor-pointer, hover: e transition-all
            -->
            <div
              v-for="provider in featuredProviders"
              :key="provider.id"
              class="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex items-center p-5"
            >
              <img :src="provider.avatar" alt="Avatar do Prestador" class="h-24 w-24 rounded-full border-4 border-slate-700 object-cover">
              <div class="ml-5">
                <h3 class="text-2xl font-bold text-white">{{ provider.name }}</h3>
                <p class="text-gray-400 flex items-center mt-1">
                  <MapPin class="h-4 w-4 mr-2" />
                  {{ provider.location }}
                </p>
                <p class="text-gray-400 text-sm mt-2 line-clamp-2">
                  {{ provider.bio }}
                </p>
                <div class="flex items-center mt-3">
                  <Star class="h-5 w-5 text-yellow-400" fill="currentColor" />
                  <span class="ml-1 text-white font-semibold">4.9</span>
                  <span class="text-gray-400 text-sm ml-2">(120 avaliações)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- =================================== -->
      <!-- ==   ESTADO 2: RESULTADOS        == -->
      <!-- =================================== -->
      <div v-if="isSearching">
        <!-- Título da Busca e Botão "Voltar" -->
        <div class="flex items-center gap-4 mb-6">
          <button @click="clearSearchAndGoHome" class="p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-white">
            <ArrowLeft :size="20" />
          </button>
          <h1 class="text-3xl font-bold text-white">{{ resultsTitle }}</h1>
        </div>

        <!-- Lista de Resultados -->
        <div v-if="filteredServices.length > 0" class="space-y-6">
          <div 
            v-for="service in filteredServices" 
            :key="service.id"
            class="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-xl hover:border-slate-600"
          >
            <img 
              :src="`https://placehold.co/300x200/1e293b/94a3b8?text=${service.name.replace(' ', '+')}`" 
              alt="Imagem do Serviço" 
              class="h-48 w-full md:h-auto md:w-48 object-cover"
            >
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center mb-2 cursor-pointer" @click="goToProviderProfile(getProviderForService(service.providerId).id)">
                  <img :src="getProviderForService(service.providerId).avatar" alt="Avatar" class="h-8 w-8 rounded-full mr-2">
                  <span class="text-sm font-medium text-gray-300 hover:text-white">{{ getProviderForService(service.providerId).name }}</span>
                </div>
                <h2 class="text-2xl font-semibold text-white">{{ service.name }}</h2>
                <p class="text-sm text-blue-400 font-medium">{{ service.category }}</p>
              </div>
              
              <!-- **** SEÇÃO MODIFICADA **** -->
              <div class="flex flex-col md:flex-row justify-between md:items-center mt-4 pt-4 border-t border-slate-700">
                <div class="flex items-center gap-4 text-gray-400">
                  <span class="flex items-center gap-1.5 text-sm"><Clock :size="16" /> {{ service.duration }}</span>
                  <span class="flex items-center gap-1.5 text-sm"><Star :size="16" class="text-yellow-400" /> 4.9 (120)</span>
                </div>
                <!-- Botão "Contratar" adicionado aqui -->
                <div class="mt-4 md:mt-0 flex items-center gap-4">
                  <span class="text-2xl font-bold text-white">{{ formatCurrency(service.price) }}</span>
                  <button 
                    @click="goToCheckout(service)" 
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                  >
                    Contratar
                  </button>
                </div>
              </div>
              <!-- **** FIM DA SEÇÃO MODIFICADA **** -->

            </div>
          </div>
        </div>
        
        <!-- Nenhum Resultado -->
        <div v-else class="text-center text-gray-400 py-16">
          <Search :size="48" class="mx-auto mb-4" />
          <h2 class="text-2xl font-semibold text-white">Nenhum resultado encontrado</h2>
          <p class="mt-2">Tente ajustar a sua busca ou filtros.</p>
        </div>
      </div>

    </main>

    <!-- Rodapé -->
    <footer class="text-center p-8 border-t border-slate-800 text-gray-500">
      © {{ new Date().getFullYear() }} Marketplace. Todos os direitos reservados.
    </footer>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>