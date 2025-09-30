<template>
  <div class="h-screen flex bg-gray-900 text-white">
    <!-- Menu lateral -->
    <aside class="w-64 bg-gray-800 p-6 hidden md:block">
      <h2 class="text-xl font-bold mb-6">Categorias</h2>
      <ul class="space-y-3">
        <li
          v-for="(categoria, i) in categorias"
          :key="i"
          class="p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
          @click="filtro = categoria"
        >
          {{ categoria }}
        </li>
      </ul>
    </aside>

    <!-- Conteúdo principal -->
    <main class="flex-1 p-6 grid grid-rows-[auto,1fr] gap-6">
      <!-- Barra de pesquisa, filtro e adicionar -->
      <section
        class="bg-gray-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center"
      >
        <input
          v-model="search"
          type="text"
          placeholder="Pesquisar serviços..."
          class="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none"
        />
        <select
          v-model="filtro"
          class="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
        >
          <option value="">Todos</option>
          <option
            v-for="(categoria, i) in categorias"
            :key="i"
            :value="categoria"
          >
            {{ categoria }}
          </option>
        </select>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          ➕ Adicionar Cliente
        </button>
      </section>

      <!-- Área central de resultados -->
      <section
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto"
      >
        <div
          v-for="(cliente, index) in clientesFiltrados"
          :key="index"
          class="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700"
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
      </section>
    </main>

    <!-- Modal de adicionar cliente -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
    >
      <div class="bg-gray-900 p-6 rounded-xl w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Adicionar Cliente</h2>

        <form @submit.prevent="addCliente" class="flex flex-col gap-3">
          <input
            v-model="novoCliente.nome"
            type="text"
            placeholder="Nome"
            class="input"
            required
          />
          <input
            v-model="novoCliente.nascimento"
            type="date"
            class="input"
            required
          />
          <input
            v-model="novoCliente.cpf"
            type="text"
            placeholder="CPF"
            class="input"
            required
          />
          <input
            v-model="novoCliente.valor"
            type="number"
            placeholder="Valor do pagamento"
            class="input"
            required
          />
          <input
            v-model="novoCliente.dataPagamento"
            type="date"
            class="input"
            required
          />
          <input
            v-model="novoCliente.nicho"
            type="text"
            placeholder="Nicho de serviço"
            class="input"
            required
          />

          <div class="flex justify-end gap-3 mt-4">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 bg-gray-600 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
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
  name: "Dashboard",
  data() {
    return {
      categorias: [
        "Beleza",
        "Tecnologia",
        "Educação",
        "Saúde",
        "Serviços Gerais",
      ],
      search: "",
      filtro: "",
      clientes: [
        {
          nome: "Ana",
          nascimento: "1990-01-10",
          cpf: "111.111.111-11",
          valor: 200,
          dataPagamento: "2025-09-01",
          nicho: "Beleza",
        },
        {
          nome: "Carlos",
          nascimento: "1985-06-15",
          cpf: "222.222.222-22",
          valor: 350,
          dataPagamento: "2025-09-05",
          nicho: "Tecnologia",
        },
        {
          nome: "Marcos",
          nascimento: "1995-03-20",
          cpf: "333.333.333-33",
          valor: 150,
          dataPagamento: "2025-09-10",
          nicho: "Educação",
        },
      ],
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
  computed: {
    clientesFiltrados() {
      return this.clientes.filter((c) => {
        const matchSearch = c.nome
          .toLowerCase()
          .includes(this.search.toLowerCase());
        const matchFiltro = this.filtro ? c.nicho === this.filtro : true;
        return matchSearch && matchFiltro;
      });
    },
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
