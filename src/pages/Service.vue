<template>
  <div class="min-h-screen bg-[#0e1621] text-white flex flex-col items-center p-10">
    <div class="w-full max-w-4xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Serviços Cadastrados</h1>
        <button
          @click="abrirModal = true; modoEdicao = false"
          class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
        >
          Novo Serviço
        </button>
      </div>

      <!-- LISTA DE SERVIÇOS -->
      <div
        v-if="servicos.length === 0"
        class="text-center text-gray-400 border border-dashed border-gray-600 rounded-lg p-10"
      >
        Nenhum serviço cadastrado ainda.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(servico, i) in servicos"
          :key="i"
          class="bg-[#1a2230] p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 relative"
        >
          <!-- BOTÕES DE AÇÃO -->
          <div class="absolute top-3 right-3 flex gap-2">
            <button
              @click="editarServico(i)"
              class="text-blue-400 hover:text-blue-500 text-sm bg-blue-600/10 px-2 py-1 rounded-md"
              title="Editar"
            >
              ✏️
            </button>
            <button
              @click="excluirServico(i)"
              class="text-red-400 hover:text-red-500 text-sm bg-red-600/10 px-2 py-1 rounded-md"
              title="Excluir"
            >
              🗑️
            </button>
          </div>
<br>
          <h2 class="text-xl font-semibold text-white mb-2">{{ servico.nome }}</h2>

          <span
            class="inline-block bg-blue-600/20 text-blue-400 text-xs uppercase tracking-wide font-medium px-3 py-1 rounded-full mb-3"
          >
            {{ servico.categoria }}
          </span>

          <p class="text-gray-400 text-sm mb-4 leading-relaxed">
            {{ servico.descricao }}
          </p>

          <div class="border-t border-gray-700 pt-3 mt-3 text-sm text-gray-300 space-y-1">
            <p><span class="font-medium text-gray-400">Duração:</span> {{ servico.duracao }} min</p>
            <p>
              <span class="font-medium text-gray-400">Preço:</span>
              R$ {{ Number(servico.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
            </p>
            <p><span class="font-medium text-gray-400">Pagamento:</span> {{ servico.pagamento }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE CADASTRO / EDIÇÃO -->
    <div
      v-if="abrirModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div class="bg-[#1a2230] rounded-2xl shadow-lg w-full max-w-lg p-8 relative">
        <h2 class="text-center text-2xl font-bold mb-6">
          {{ modoEdicao ? 'Editar Serviço' : 'Cadastro de Serviço' }}
        </h2>

        <form @submit.prevent="salvarServico" class="flex flex-col gap-4">
          <div>
            <label class="text-sm font-semibold">Nome do Serviço</label>
            <input
              v-model="novoServico.nome"
              type="text"
              placeholder="Ex: Corte de cabelo, manutenção elétrica..."
              class="w-full mt-1 p-2 rounded-md bg-[#121822] border-none outline-none text-white"
            />
          </div>

          <div>
            <label class="text-sm font-semibold">Categoria</label>
            <select
              v-model="novoServico.categoria"
              class="w-full mt-1 p-2 rounded-md bg-[#121822] border-none outline-none text-white"
            >
              <option value="">Selecione...</option>
              <option value="beleza">Beleza</option>
              <option value="tecnico">Serviços Técnicos</option>
              <option value="consultoria">Consultoria</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-semibold">Descrição</label>
            <textarea
              v-model="novoServico.descricao"
              placeholder="Descreva o serviço oferecido..."
              class="w-full mt-1 p-2 rounded-md bg-[#121822] border-none outline-none text-white"
              rows="3"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-semibold">Duração (min)</label>
              <input
                v-model="novoServico.duracao"
                type="number"
                placeholder="Ex: 60"
                class="w-full mt-1 p-2 rounded-md bg-[#121822] border-none outline-none text-white"
              />
            </div>

            <div>
              <label class="text-sm font-semibold">Preço (R$)</label>
              <input
                v-model="novoServico.preco"
                type="number"
                placeholder="Ex: 150.00"
                class="w-full mt-1 p-2 rounded-md bg-[#121822] border-none outline-none text-white"
              />
            </div>
          </div>

          <div>
            <label class="text-sm font-semibold">Condições de Pagamento</label>
            <input
              v-model="novoServico.pagamento"
              type="text"
              placeholder="Ex: Pix, Cartão, Dinheiro"
              class="w-full mt-1 p-2 rounded-md bg-[#121822] border-none outline-none text-white"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 mt-3 py-2 rounded-lg font-semibold transition"
          >
            {{ modoEdicao ? 'Salvar Alterações' : 'Cadastrar Serviço' }}
          </button>
        </form>

        <button
          @click="abrirModal = false"
          class="w-full text-blue-400 text-sm text-center mt-4 hover:underline"
        >
          Voltar ao painel
        </button>

        <button
          @click="abrirModal = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const abrirModal = ref(false);
const modoEdicao = ref(false);
const indiceEdicao = ref(null);
const servicos = ref([]);

const novoServico = ref({
  nome: "",
  categoria: "",
  descricao: "",
  duracao: "",
  preco: "",
  pagamento: "",
});

function salvarServico() {
  if (!novoServico.value.nome) return alert("Informe o nome do serviço!");

  if (modoEdicao.value && indiceEdicao.value !== null) {
    // Atualiza serviço existente
    servicos.value[indiceEdicao.value] = { ...novoServico.value };
  } else {
    // Adiciona novo serviço
    servicos.value.push({ ...novoServico.value });
  }

  // Limpa formulário e fecha modal
  Object.keys(novoServico.value).forEach((key) => (novoServico.value[key] = ""));
  abrirModal.value = false;
  modoEdicao.value = false;
  indiceEdicao.value = null;
}

function editarServico(index) {
  modoEdicao.value = true;
  indiceEdicao.value = index;
  abrirModal.value = true;
  novoServico.value = { ...servicos.value[index] };
}

function excluirServico(index) {
  if (confirm("Deseja realmente excluir este serviço?")) {
    servicos.value.splice(index, 1);
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #2c3e50;
  border-radius: 8px;
}
</style>
