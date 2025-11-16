<template>
  <!-- Container Fixo no Canto da Tela -->
  <div class="fixed bottom-5 right-5 z-50">
    
    <!-- Janela do Chat (Aparece se isOpen for true) -->
    <div
      v-if="isOpen"
      class="w-80 h-[450px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col transition-all"
    >
      <!-- Cabeçalho -->
      <header class="bg-gray-100 dark:bg-gray-700 p-3 rounded-t-lg flex justify-between items-center shadow">
        <h3 class="font-bold text-gray-900 dark:text-white">OlympiaChat</h3>
        <button @click="isOpen = false" class="text-gray-500 hover:text-gray-800 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <!-- Corpo das Mensagens -->
      <div ref="chatBody" class="flex-1 p-4 overflow-y-auto space-y-3">
        <!-- Mensagem de Boas-vindas -->
        <div class="flex">
          <div class="bg-indigo-100 dark:bg-indigo-800 text-black dark:text-white p-3 rounded-lg max-w-xs">
            <p class_="">Olá! Eu sou o OlympiaChat, seu assistente virtual.</p>
            <p class="mt-2 text-xs text-gray-700 dark:text-gray-300">
              Sou um assistente de IA. Por favor, não insira dados pessoais sensíveis nesta conversa.
            </p>
          </div>
        </div>

        <!-- Loop pelas mensagens do chat -->
        <div v-for="message in messages" :key="message.id">
          <!-- Mensagem do Usuário -->
          <div v-if="message.sender === 'user'" class="flex justify-end">
            <div class="bg-indigo-500 text-white p-3 rounded-lg max-w-xs">
              {{ message.text }}
            </div>
          </div>
          <!-- Mensagem do Bot -->
          <div v-else class="flex justify-start">
            <div
              class="bg-gray-200 dark:bg-gray-600 text-black dark:text-white p-3 rounded-lg max-w-xs"
              style="white-space: pre-wrap;"
            >
              {{ message.text }}
            </div>
          </div>
        </div>
        
        <!-- Feedback de "digitando..." -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="bg-gray-200 dark:bg-gray-600 text-black dark:text-white p-3 rounded-lg max-w-xs">
            Digitando...
          </div>
        </div>
      </div>

      <!-- Input de Texto -->
      <form @submit.prevent="sendMessage" class="p-3 bg-gray-100 dark:bg-gray-700 rounded-b-lg flex">
        <input
          v-model="userInput"
          type="text"
          placeholder="Digite sua mensagem..."
          class="flex-1 px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-indigo-500"
          :disabled="isLoading"
        />
        <button
          type="submit"
          class="ml-2 px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 focus:outline-none"
          :disabled="isLoading"
        >
          Enviar
        </button>
      </form>
    </div>

    <!-- Botão Flutuante -->
    <button
      v-if="!isOpen"
      @click="isOpen = true"
      class="w-16 h-16 bg-indigo-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-indigo-600"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

// Estado do Componente
const isOpen = ref(false);
const userInput = ref('');
const isLoading = ref(false);
const chatBody = ref(null);
const messages = ref([]);

// Use o store
const authStore = useAuthStore();

// Crie uma variável 'computed' para o userType
const currentUserType = computed(() => {
  if (authStore.isLoggedIn && authStore.userType) {
    return authStore.userType;
  }
  return 'guest';
});


// Funções
async function sendMessage() {
  if (userInput.value.trim() === '') return;

  const userMessage = userInput.value;

  messages.value.push({
    id: Date.now(),
    text: userMessage,
    sender: 'user',
  });

  userInput.value = '';
  isLoading.value = true;
  await scrollToBottom();

  try {
    const requestBody = {
      question: userMessage,
      // Use o valor dinâmico em vez de 'guest'
      userType: currentUserType.value,
    };

    const response = await fetch('http://localhost:3000/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Falha na resposta da API');
    }

    const data = await response.json();

    messages.value.push({
      id: Date.now() + 1,
      text: data.answer,
      sender: 'bot',
    });

  } catch (error) {
    console.error('Erro ao chamar a API do chatbot:', error);
    messages.value.push({
      id: Date.now() + 1,
      text: 'Desculpe, não consegui me conectar. Tente novamente.',
      sender: 'bot',
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
}

async function scrollToBottom() {
  await nextTick();
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight;
  }
}
</script>