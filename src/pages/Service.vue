<template>
  <div class="min-h-screen bg-[#0e1525] flex items-center justify-center p-4">
    <div class="bg-[#141c2f] rounded-2xl p-6 w-full max-w-md shadow-lg">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-semibold text-white">Lista de Serviços</h1>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          Cadastrar Serviço
        </button>
      </div>

      <!-- Search -->
      <input
        v-model="search"
        type="text"
        placeholder="Buscar serviços"
        class="w-full bg-[#1c2539] text-gray-300 placeholder-gray-500 rounded-lg px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-600"
      />

      <!-- Lista -->
      <div v-if="filteredServices.length">
        <div
          v-for="service in filteredServices"
          :key="service.id"
          class="flex items-center justify-between bg-[#1c2539] rounded-lg px-4 py-3 mb-3"
        >
          <div>
            <h2 class="text-white font-semibold">{{ service.nome }}</h2>
            <p class="text-gray-400 text-sm">{{ service.categoria }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-white font-medium">{{ service.preco }}</span>
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
            >
              Editar
            </button>
          </div>
        </div>
      </div>

      <!-- Estado vazio -->
      <div
        v-else
        class="flex flex-col items-center justify-center text-center py-12 text-gray-300"
      >
        <p class="text-lg mb-6">Nenhum serviço encontrado.</p>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Cadastrar Serviço
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Mock de dados
const services = ref([
  { id: 1, nome: "Corte de cabelo", categoria: "Beleza", preco: "R$ 50,00" },
  { id: 2, nome: "Reparo de computador", categoria: "Tecnologia", preco: "R$ 150,00" },
  { id: 3, nome: "Limpeza de casa", categoria: "Reformas", preco: "R$ 100,00" },
  { id: 4, nome: "Limpeza de casa", categoria: "Reformas", preco: "R$ 100,00" },
]);

const search = ref("");

// Filtro de busca
const filteredServices = computed(() => {
  if (!search.value) return services.value;
  return services.value.filter((s) =>
    s.nome.toLowerCase().includes(search.value.toLowerCase())
  );
});
</script>

<style scoped>
/* Apenas para uma leve transição */
button {
  transition: all 0.2s ease;
}
</style>
