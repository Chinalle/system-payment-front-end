<template>
  <!-- ADICIONEI a classe 'overflow-y-auto' e garanti 'h-full' em vez de 'h-screen' para melhor integração -->
  <aside class="w-16 h-full bg-[#0f172a] flex flex-col items-center py-4 space-y-6 overflow-y-auto">
    
    <!-- Dashboard -->
    <router-link 
      to="/" 
      class="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
      :class="$route.path === '/' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-400'">
      <i class="fas fa-home"></i>
    </router-link>

    <!-- Login -->
    <router-link 
      to="/login" 
      class="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
      :class="$route.path === '/login' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-400'">
      <i class="fas fa-user"></i>
    </router-link>

    <!-- Clientes -->
    <router-link 
      to="/clients" 
      class="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
      :class="$route.path === '/clients' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-400'">
      <i class="fas fa-briefcase"></i>
    </router-link>

    <!-- Agenda -->
    <router-link 
      to="/agenda" 
      class="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
      :class="$route.path === '/agenda' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-400'">
      <i class="fas fa-calendar-alt"></i>
    </router-link>
    
    <!-- NOVO ITEM: PAGAMENTOS/CHECKOUT (Usando um ícone conhecido por funcionar) -->
    <router-link 
      to="/checkout" 
      class="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
      :class="$route.path === '/checkout' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-400'">
      <!-- Usando o ícone de finanças que confirmamos ser visível -->
      <i class="fas fa-chart-bar"></i> 
    </router-link>

  </aside>
</template>