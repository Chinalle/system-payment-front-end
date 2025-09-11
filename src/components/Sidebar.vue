<template>
  <aside class="w-64 h-screen bg-slate-900 text-white p-4">
    <nav class="flex flex-col space-y-4">
      <router-link
        to="/"
        class="flex items-center space-x-2 hover:text-blue-400"
      >
        <span>🔹</span>
        <span>Visão Geral</span>
      </router-link>

      <router-link
        to="/clientes"
        class="flex items-center space-x-2 hover:text-blue-400"
      >
        <span>👤</span>
        <span>Clientes</span>
      </router-link>

      <router-link
        to="/prestadores"
        class="flex items-center space-x-2 hover:text-blue-400"
      >
        <span>🛡️</span>
        <span>Prestadores</span>
      </router-link>

      <router-link
        to="/financeiro"
        class="flex items-center space-x-2 hover:text-blue-400"
      >
        <span>💰</span>
        <span>Financeiro</span>
      </router-link>

      <router-link
        to="/configuracoes"
        class="flex items-center space-x-2 hover:text-blue-400"
      >
        <span>⚙️</span>
        <span>Configurações</span>
      </router-link>
    </nav>
  </aside>
</template>
