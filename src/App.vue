<template>
  <div class="flex">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Conteúdo dinâmico -->
    <main class="flex-1 p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue";
</script>
