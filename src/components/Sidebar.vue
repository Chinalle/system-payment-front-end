<template>
  <aside class="w-16 h-screen bg-[#0f172a] flex flex-col items-center py-4 space-y-6">
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
  </aside>
</template>
