<template>
  <div class="relative" v-click-outside="closeDropdown">
    
    <div 
      class="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white flex items-center justify-between cursor-pointer transition duration-150 hover:border-blue-500"
      @click="toggleDropdown"
      :class="{'ring-2 ring-blue-500 border-blue-500': isOpen}"
    >
      <div class="flex items-center">
        <span :class="`bg-${modelValue.color}-500`" class="w-3 h-3 rounded-full mr-2"></span>
        <span class="font-medium" :class="`text-${modelValue.color}-400`">{{ modelValue.name }}</span>
      </div>
      
      <svg 
        class="w-4 h-4 text-gray-400 transform transition-transform duration-200" 
        :class="{'rotate-180': isOpen}" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>

    <Transition name="fade-slide">
      <div 
        v-if="isOpen" 
        class="absolute z-10 w-full mt-2 p-1 bg-gray-800 rounded-lg shadow-2xl border border-blue-700/50"
      >
        <ul class="space-y-1 text-sm">
          <li
            v-for="category in categories"
            :key="category.name"
            @click="selectCategory(category)"
            class="flex items-center p-2 rounded-md cursor-pointer transition duration-150"
            :class="{
              // Destaque de seleção
              'bg-blue-900/40 border border-blue-600': modelValue.name === category.name, 
              'hover:bg-gray-700': modelValue.name !== category.name
            }"
          >
            <span 
              class="w-3 h-3 rounded-full mr-2" 
              :class="`bg-${category.color}-500`" 
            ></span>
            <span 
              :class="`text-${category.color}-400`" 
              class="font-medium"
            >{{ category.name }}</span>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  categories: Array, 
  modelValue: Object, // A categoria selecionada (v-model)
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const selectCategory = (category) => {
  emit('update:modelValue', category); 
  closeDropdown();
};

// **Diretiva Customizada v-click-outside (Necessária)**
// ATENÇÃO: Se você usa Vue 3, a diretiva customizada deve ser registrada 
// no seu arquivo principal (main.js) para funcionar corretamente.

const vClickOutside = {
    mounted(el, binding) {
        el.__ClickOutsideHandler__ = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.body.addEventListener('click', el.__ClickOutsideHandler__);
    },
    unmounted(el) {
        document.body.removeEventListener('click', el.__ClickOutsideHandler__);
    },
};
</script>

<style scoped>
/* Transição para a lista de opções */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>