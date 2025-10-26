<template>
  <div class="p-6 bg-gray-900 min-h-screen text-gray-300">
    <h2 class="text-3xl font-bold text-gray-100 mb-8">Cadastro de Contas Bancárias da Empresa</h2>

    <!-- Layout principal em duas colunas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

      <!-- Coluna Esquerda: Formulário de Cadastro -->
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 class="text-xl font-semibold text-gray-100 mb-6">Adicionar Nova Conta</h3>

        <!-- Seleção do Tipo de Conta -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-400 mb-2">Tipo de Conta</label>
          <div class="flex space-x-4">
            <button
              v-for="type in accountTypes"
              :key="type.value"
              @click="selectedAccountType = type.value"
              :class="['px-4 py-2 text-sm rounded-md transition flex-1', selectedAccountType === type.value ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300']"
            >
              {{ type.label }}
            </button>
          </div>
        </div>

        <!-- Formulário para Conta Corrente/Poupança -->
        <form v-if="selectedAccountType === 'corrente' || selectedAccountType === 'poupanca'" @submit.prevent="handleSubmitBankAccount" class="space-y-4">
           <p class="text-lg font-medium text-gray-200 mb-4">{{ selectedAccountType === 'corrente' ? 'Nova Conta Corrente' : 'Nova Conta Poupança' }}</p>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label for="bankName">Banco</label>
                <input type="text" id="bankName" v-model="bankAccountForm.bankName" placeholder="Nome do banco" required class="form-input"/>
              </div>
              <div class="form-group">
                <label for="agency">Agência</label>
                <input type="text" id="agency" v-model="bankAccountForm.agency" placeholder="0000" required class="form-input"/>
              </div>
              <div class="form-group md:col-span-2">
                <label for="accountNumber">Número da Conta (com dígito)</label>
                <input type="text" id="accountNumber" v-model="bankAccountForm.accountNumber" placeholder="00000-0" required class="form-input"/>
              </div>
              <div class="form-group md:col-span-2">
                <label for="accountHolderName">Nome do Titular</label>
                <input type="text" id="accountHolderName" v-model="bankAccountForm.accountHolderName" placeholder="Nome completo" required class="form-input"/>
              </div>
               <div class="form-group md:col-span-2">
                <label for="accountHolderDocument">CPF/CNPJ do Titular</label>
                <input type="text" id="accountHolderDocument" v-model="bankAccountForm.accountHolderDocument" placeholder="000.000.000-00 ou 00.000.000/0000-00" required class="form-input"/>
              </div>
           </div>
           <button type="submit" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30">
             Salvar Conta
           </button>
        </form>

        <!-- Formulário para PIX -->
        <form v-if="selectedAccountType === 'pix'" @submit.prevent="handleSubmitPix" class="space-y-4">
           <p class="text-lg font-medium text-gray-200 mb-4">Nova Chave PIX</p>
           <div class="grid grid-cols-1 gap-4">
              <div class="form-group">
                  <label for="pixKeyType">Tipo de Chave PIX</label>
                  <select id="pixKeyType" v-model="pixForm.pixKeyType" required class="form-input">
                      <option disabled value="">Selecione o tipo</option>
                      <option value="cpf">CPF</option>
                      <option value="cnpj">CNPJ</option>
                      <option value="email">E-mail</option>
                      <option value="telefone">Telefone</option>
                      <option value="aleatoria">Chave Aleatória</option>
                  </select>
              </div>
               <div class="form-group">
                  <label for="pixKey">Chave PIX</label>
                  <input type="text" id="pixKey" v-model="pixForm.pixKey" placeholder="Digite a chave PIX" required class="form-input"/>
              </div>
               <div class="form-group">
                  <label for="pixAccountHolderName">Nome do Titular (Opcional)</label>
                  <input type="text" id="pixAccountHolderName" v-model="pixForm.accountHolderName" placeholder="Nome associado à chave" class="form-input"/>
              </div>
           </div>
            <button type="submit" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30">
                Salvar Chave PIX
            </button>
        </form>
      </div>

      <!-- Coluna Direita: Lista de Contas Cadastradas -->
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 class="text-xl font-semibold text-gray-100 mb-6">Contas Cadastradas</h3>
        <div v-if="registeredAccounts.length === 0" class="text-center text-gray-500 py-8">
            Nenhuma conta cadastrada ainda.
        </div>
        <ul v-else class="space-y-4">
          <li v-for="account in registeredAccounts" :key="account.id" class="bg-gray-700 p-4 rounded-lg flex items-center justify-between gap-4 hover:bg-gray-600 transition duration-150">
            <!-- Informações da Conta -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                 <span class="text-sm font-medium px-2 py-0.5 rounded" :class="getAccountTypeBadgeClass(account.type)">
                   {{ formatAccountType(account.type) }}
                 </span>
                 <span v-if="account.type !== 'pix'" class="text-gray-300 font-semibold truncate">{{ account.bankName }}</span>
                 <span v-else class="text-gray-400 text-xs truncate">({{ account.pixKeyType }})</span>
              </div>
              <p v-if="account.type !== 'pix'" class="text-xs text-gray-400 truncate">
                  Ag: {{ account.agency }} | CC: {{ account.accountNumber }}
              </p>
               <p v-else class="text-xs text-gray-400 truncate">
                  Chave: {{ account.pixKey }}
              </p>
               <p class="text-xs text-gray-500 truncate mt-1">Titular: {{ account.accountHolderName }}</p>
            </div>

            <!-- Ações -->
            <div class="flex items-center space-x-3 flex-shrink-0">
               <!-- Seletor Principal -->
               <div class="flex items-center" title="Definir como conta principal">
                   <input
                       type="radio"
                       :id="'primary-' + account.id"
                       name="primaryAccount"
                       :value="account.id"
                       :checked="account.isPrimary"
                       @change="setPrimaryAccount(account.id)"
                       class="h-4 w-4 text-blue-600 bg-gray-600 border-gray-500 focus:ring-blue-500 focus:ring-offset-gray-800 cursor-pointer"
                   >
                   <label :for="'primary-' + account.id" class="ml-1.5 text-xs text-gray-400 cursor-pointer">Principal</label>
               </div>
               <!-- Seletor Ativo/Inativo -->
               <div class="flex items-center" :title="account.isActive ? 'Desativar conta' : 'Ativar conta'">
                  <label :for="'active-' + account.id" class="text-xs mr-1.5" :class="account.isActive ? 'text-green-400' : 'text-gray-500'">
                    {{ account.isActive ? 'Ativa' : 'Inativa' }}
                  </label>
                   <button
                       @click="toggleAccountStatus(account.id)"
                       :class="[account.isActive ? 'bg-blue-600' : 'bg-gray-600', 'relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800']"
                       role="switch" :aria-checked="account.isActive.toString()"
                   >
                       <span :class="[account.isActive ? 'translate-x-4' : 'translate-x-0', 'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']"></span>
                   </button>
               </div>
                <!-- Botão Editar -->
                <button @click="editAccount(account.id)" class="text-gray-400 hover:text-blue-400 transition" title="Editar conta">
                    <PencilIcon class="h-4 w-4" />
                </button>
                <!-- Botão Excluir -->
                <button @click="deleteAccount(account.id)" class="text-gray-400 hover:text-red-400 transition" title="Excluir conta">
                    <Trash2Icon class="h-4 w-4" />
                </button>
            </div>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { PencilIcon, Trash2Icon } from 'lucide-vue-next'; // Importar ícones

// Tipos
type AccountType = 'corrente' | 'poupanca' | 'pix';
interface BankAccount {
  id: number; // Identificador único
  type: AccountType;
  bankName?: string;
  agency?: string;
  accountNumber?: string;
  pixKeyType?: string;
  pixKey?: string;
  accountHolderName: string;
  accountHolderDocument?: string; // Adicionado
  isPrimary: boolean; // Se é a conta principal
  isActive: boolean; // Se está ativa ou inativa
}

// Estado do formulário
const selectedAccountType = ref<AccountType>('corrente');
const accountTypes = [
  { label: 'Conta Corrente', value: 'corrente' },
  { label: 'Conta Poupança', value: 'poupanca' },
  { label: 'PIX', value: 'pix' },
];
const bankAccountForm = ref({ bankName: '', agency: '', accountNumber: '', accountHolderName: '', accountHolderDocument: '' });
const pixForm = ref({ pixKeyType: '', pixKey: '', accountHolderName: '' });

// Estado da lista de contas (Dados Mockados)
const registeredAccounts = reactive<BankAccount[]>([
  { id: 1, type: 'corrente', bankName: 'Banco Exemplo S/A', agency: '1234', accountNumber: '56789-0', accountHolderName: 'Empresa Exemplo LTDA', accountHolderDocument: '00.000.000/0001-00', isPrimary: true, isActive: true },
  { id: 2, type: 'pix', pixKeyType: 'cnpj', pixKey: '00.000.000/0001-00', accountHolderName: 'Empresa Exemplo LTDA', isPrimary: false, isActive: true },
  { id: 3, type: 'poupanca', bankName: 'Caixa Econômica', agency: '0001', accountNumber: '112233-4', accountHolderName: 'Empresa Exemplo LTDA', accountHolderDocument: '00.000.000/0001-00', isPrimary: false, isActive: false },
]);

// Funções de manipulação (Placeholders)
const handleSubmitBankAccount = () => {
  const newAccount: BankAccount = {
    id: Date.now(), // ID simples baseado no timestamp
    type: selectedAccountType.value,
    ...bankAccountForm.value,
    isPrimary: registeredAccounts.length === 0, // A primeira conta é a principal
    isActive: true,
  };
  registeredAccounts.push(newAccount);
  console.log('Salvando Conta Bancária:', newAccount);
  bankAccountForm.value = { bankName: '', agency: '', accountNumber: '', accountHolderName: '', accountHolderDocument: '' };
  // Adicionar Swal feedback
};

const handleSubmitPix = () => {
   const newAccount: BankAccount = {
    id: Date.now(),
    type: 'pix',
    ...pixForm.value,
    isPrimary: registeredAccounts.length === 0,
    isActive: true,
  };
  registeredAccounts.push(newAccount);
  console.log('Salvando Chave PIX:', newAccount);
  pixForm.value = { pixKeyType: '', pixKey: '', accountHolderName: '' };
   // Adicionar Swal feedback
};

const setPrimaryAccount = (accountId: number) => {
  registeredAccounts.forEach(acc => {
    acc.isPrimary = acc.id === accountId;
  });
  console.log(`Conta ID ${accountId} definida como principal.`);
  // Aqui você chamaria a API para atualizar o status no backend
};

const toggleAccountStatus = (accountId: number) => {
  const account = registeredAccounts.find(acc => acc.id === accountId);
  if (account) {
    account.isActive = !account.isActive;
    console.log(`Status da Conta ID ${accountId} alterado para ${account.isActive ? 'Ativa' : 'Inativa'}.`);
    // Aqui você chamaria a API para atualizar o status no backend
  }
};

const editAccount = (accountId: number) => {
  const account = registeredAccounts.find(acc => acc.id === accountId);
  console.log('Editar conta:', account);
  // Lógica para abrir um modal de edição ou preencher o formulário com os dados
  alert(`Editar conta ID: ${accountId} (Implementar)`);
};

const deleteAccount = (accountId: number) => {
  // Adicionar confirmação antes de excluir
  if (confirm(`Tem certeza que deseja excluir a conta ID ${accountId}?`)) {
     const index = registeredAccounts.findIndex(acc => acc.id === accountId);
     if (index !== -1) {
         registeredAccounts.splice(index, 1);
         console.log(`Conta ID ${accountId} excluída.`);
         // Aqui você chamaria a API para excluir no backend
     }
  }
};


// Funções auxiliares para formatação na lista
const formatAccountType = (type: AccountType): string => {
  switch (type) {
    case 'corrente': return 'Corrente';
    case 'poupanca': return 'Poupança';
    case 'pix': return 'PIX';
    default: return type;
  }
};

const getAccountTypeBadgeClass = (type: AccountType): string => {
   switch (type) {
    case 'corrente': return 'bg-blue-900 text-blue-300';
    case 'poupanca': return 'bg-green-900 text-green-300';
    case 'pix': return 'bg-purple-900 text-purple-300';
    default: return 'bg-gray-700 text-gray-300';
  }
}

</script>

<style scoped>
/* Estilos gerais herdados do tema escuro, adicionando específicos para formulário */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px; /* Espaço ligeiramente menor */
  margin-bottom: 16px;
}

label {
  font-size: 13px; /* Label um pouco menor */
  font-weight: 500;
  color: #9ca3af;
}

input[type="text"],
input[type="tel"],
select {
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #374151;
  border-radius: 6px; /* Bordas um pouco menos arredondadas */
  outline: none;
  background: #1f2937; /* Fundo mais escuro para inputs */
  color: #e5e7eb;
  width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
}
input::placeholder { color: #4b5563; } /* Placeholder mais escuro */
input:focus,
select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
}
.form-input { /* Reutiliza estilos de input */
   padding: 10px 12px;
   font-size: 14px;
   border: 1px solid #374151;
   border-radius: 6px;
   outline: none;
   background: #1f2937;
   color: #e5e7eb;
   width: 100%;
   transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input::placeholder { color: #4b5563; }
.form-input:focus {
   border-color: #3b82f6;
   box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
}

button {
   /* Estilo base para botões */
    @apply px-4 py-2 rounded-lg font-bold transition-all text-sm;
}
.bg-gray-800 {
  background-color: #1f2937;
}
.bg-gray-700 {
  background-color: #374151;
}
.bg-gray-600 {
  background-color: #4b5563;
}
.hover\:bg-gray-600:hover {
     background-color: #4b5563;
}
.bg-gray-900 {
    background-color: #111827;
}
.bg-blue-600 {
     @apply shadow-lg shadow-blue-600/30 py-2.5; /* Botão principal ligeiramente maior */
}

/* Estilo para Radio button (Principal) */
input[type="radio"] {
    appearance: none;
    background-color: #374151;
    border: 1px solid #4b5563;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    cursor: pointer;
}
input[type="radio"]:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
}
input[type="radio"]:checked::after {
    content: '';
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

</style>

