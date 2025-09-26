<template>
  <div class="p-6 text-white">
    <h1 class="text-2xl font-bold mb-6">Gerenciamento de Clientes</h1>

    <!-- Botão adicionar -->
    <button
      @click="showAddModal = true"
      class="mb-6 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
    >
      ➕ Adicionar Cliente
    </button>

    <!-- Lista de clientes -->
    <div v-if="clientes.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(cliente, index) in clientes"
        :key="index"
        class="bg-gray-800/80 p-4 rounded-xl shadow-lg border border-white/10"
      >
        <h2 class="text-lg font-bold mb-2">{{ cliente.nome }}</h2>
        <p><b>Nascimento:</b> {{ cliente.nascimento }}</p>
        <p><b>CPF:</b> {{ cliente.cpf }}</p>
        <p><b>Valor:</b> R$ {{ cliente.valor }}</p>
        <p><b>Data Pgto:</b> {{ cliente.dataPagamento }}</p>
        <p><b>Nicho:</b> {{ cliente.nicho }}</p>

        <button
          @click="confirmDelete(index)"
          class="mt-4 w-full bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg"
        >
          🗑 Excluir
        </button>
      </div>
    </div>

    <p v-else class="text-gray-400">Nenhum cliente cadastrado ainda.</p>

    <!-- Modal de adicionar cliente -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
    >
      <div class="bg-gray-900 p-6 rounded-xl w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Adicionar Cliente</h2>

        <form @submit.prevent="addCliente" class="flex flex-col gap-3">
          <input v-model="novoCliente.nome" type="text" placeholder="Nome" class="input" required />
          <input v-model="novoCliente.nascimento" type="date" class="input" required />
          <input v-model="novoCliente.cpf" type="text" placeholder="CPF" class="input" required />
          <input v-model="novoCliente.valor" type="number" placeholder="Valor do pagamento" class="input" required />
          <input v-model="novoCliente.dataPagamento" type="date" class="input" required />
          <input v-model="novoCliente.nicho" type="text" placeholder="Nicho de serviço" class="input" required />

          <div class="flex justify-end gap-3 mt-4">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 bg-gray-600 rounded-lg">
              Cancelar
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "ProvidersPage",
  data() {
    return {
      clientes: [],
      showAddModal: false,
      novoCliente: {
        nome: "",
        nascimento: "",
        cpf: "",
        valor: "",
        dataPagamento: "",
        nicho: "",
      },
    };
  },
  methods: {
    addCliente() {
      this.clientes.push({ ...this.novoCliente });
      this.showAddModal = false;

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Cliente adicionado com sucesso!",
        showConfirmButton: false,
        timer: 2000,
      });

      this.novoCliente = {
        nome: "",
        nascimento: "",
        cpf: "",
        valor: "",
        dataPagamento: "",
        nicho: "",
      };
    },
    confirmDelete(index) {
      Swal.fire({
        title: "Você tem certeza?",
        text: "Deseja realmente excluir esse cliente?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e53e3e",
        cancelButtonColor: "#4b5563",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.clientes.splice(index, 1);
          Swal.fire("Excluído!", "O cliente foi removido.", "success");
        }
      });
    },
  },
};
</script>

<style scoped>
.input {
  @apply px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white;
}
</style>
