<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// Importando os ícones
import {
  Menu,
  Home,
  User,
  Briefcase,
  Smartphone,
  Calendar,
  Store, // <-- O NOVO ÍCONE
  LogOut,
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const isExpanded = ref(true); // Controla se o menu está aberto ou fechado

// Lista dos links do menu.
// Esta lista CORRESPONDE aos ícones da sua imagem
const menuItems = ref([
  // Os seus 5 ícones existentes:
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: User, label: 'Perfil', path: '/profile' },
  { icon: Briefcase, label: 'Serviços', path: '/providers' },
  { icon: Smartphone, label: 'Financeiro', path: '/finance' }, // O ícone do "telemóvel"
  { icon: Calendar, label: 'Agenda', path: '/agenda' },
  
  // --- NOVO ITEM ADICIONADO AQUI ---
  { icon: Store, label: 'Marketplace', path: '/market' },
]);

const handleLogout = () => {
  if (authStore.logout) {
    authStore.logout();
  } else {
    authStore.isLoggedIn = false;
    authStore.user = null;
    authStore.token = null;
    localStorage.removeItem('token');
  }
  router.push('/login');
};

// Função para verificar se o link está ativo
const isActive = (path) => {
  return route.path === path;
};
</script>

<template>
  <!-- O 'w-64' é quando está expandido, 'w-20' é quando está fechado -->
  <aside 
    :class="[
      'fixed top-0 left-0 h-screen bg-slate-900 text-gray-300 flex flex-col transition-all duration-300 z-40 border-r border-slate-800',
      isExpanded ? 'w-64' : 'w-20'
    ]"
  >
    <!-- Logo e Botão de Menu -->
    <div class="flex items-center h-16 p-4 border-b border-slate-800" :class="isExpanded ? 'justify-between' : 'justify-center'">
      <h1 v-if="isExpanded" class="text-xl font-bold text-white whitespace-nowrap">Meu Painel</h1>
      <button @click="isExpanded = !isExpanded" class="p-2 rounded-lg hover:bg-slate-700">
        <Menu :size="20" />
      </button>
    </div>

    <!-- Navegação Principal -->
    <nav class="flex-1 py-4 space-y-2 overflow-y-auto">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex items-center py-3 mx-3 px-3 rounded-lg transition-colors hover:bg-slate-700 hover:text-white',
          isActive(item.path) ? 'bg-blue-600 text-white' : 'text-gray-400',
          !isExpanded ? 'justify-center' : ''
        ]"
      >
        <component :is="item.icon" :size="20" class="flex-shrink-0" />
        <span v-if="isExpanded" class="ml-4 font-medium whitespace-nowrap">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Rodapé com Logout -->
    <div class="p-4 border-t border-slate-800">
      <button
        @click="handleLogout"
        :class="[
          'flex items-center w-full py-3 mx-0 px-3 rounded-lg transition-colors hover:bg-red-600/20 hover:text-red-400 text-red-500',
          !isExpanded ? 'justify-center' : ''
        ]"
      >
        <LogOut :size="20" class="flex-shrink-0" />
        <span v-if="isExpanded" class="ml-4 font-medium whitespace-nowrap">Sair</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* Estilização da barra de scroll (opcional, mas profissional) */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background-color: #475569; /* slate-600 */
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>