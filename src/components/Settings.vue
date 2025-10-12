<template>
  <transition name="slide">
    <aside
      v-if="visible"
      class="fixed top-0 right-0 w-64 h-full bg-gray-800/95 backdrop-blur border-l border-white/10 p-6 z-30"
    >
      <h2 class="text-lg font-semibold text-gray-100 mb-4">
        Configurações
      </h2>

      <!-- Tema -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Tema</label>
        <select
          :value="theme"
          @change="$emit('update:theme', $event.target.value)"
          class="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="dark">Escuro (azul/cinza)</option>
          <option value="light">Claro (cinza/azul)</option>
        </select>
      </div>

      <!-- Densidade dos Cards -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Densidade dos Cards</label>
        <select
          :value="density"
          @change="$emit('update:density', $event.target.value)"
          class="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="normal">Normal</option>
          <option value="compact">Compacto</option>
        </select>
      </div>

      <!-- Mostrar Badges -->
      <div class="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          :checked="showBadges"
          @change="$emit('update:showBadges', $event.target.checked)"
        />
        <label class="text-sm">Mostrar Badges</label>
      </div>

      <!-- Fechar -->
      <button
        @click="$emit('close')"
        class="mt-6 w-full py-2 rounded bg-red-600 hover:bg-red-500 transition text-white"
      >
        Fechar
      </button>
    </aside>
  </transition>
</template>

<script>
export default {
  name: "Settings",
  props: {
    visible: { type: Boolean, default: false },
    theme: { type: String, default: "dark" },
    density: { type: String, default: "normal" },
    showBadges: { type: Boolean, default: true },
  },
};
</script>

<style>
/* Animação de slide */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(100%);
}
</style>
