<template>
  <div class="p-6 bg-gray-900 min-h-screen text-gray-300">
    <h2 class="text-3xl font-bold text-gray-100 mb-8">Cadastro de Contas Bancárias da Empresa</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

      <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 class="text-xl font-semibold text-gray-100 mb-6">Adicionar Nova Conta</h3>

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

        <form v-if="selectedAccountType === 'corrente' || selectedAccountType === 'poupanca'" @submit.prevent="handleSubmitBankAccount" class="space-y-4">
            <p class="text-lg font-medium text-gray-200 mb-4">{{ selectedAccountType === 'corrente' ? 'Nova Conta Corrente' : 'Nova Conta Poupança' }}</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label for="bankName">Banco</label>
                <input type="text" id="bankName" v-model="bankAccountForm.bankName" placeholder="Nome do banco" required class="form-input"/>
                <p v-if="bankErrors.bankName" class="error-message">{{ bankErrors.bankName }}</p>
              </div>
              <div class="form-group">
                <label for="agency">Agência</label>
                <input type="text" id="agency" v-model="bankAccountForm.agency" v-imask="{ mask: '0000' }" placeholder="0000" required class="form-input"/>
                <p v-if="bankErrors.agency" class="error-message">{{ bankErrors.agency }}</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-span-2">
                  <div class="form-group sm:col-span-2">
                      <label for="accountNumber">Número da Conta</label>
                      
                      <input type="text" id="accountNumber" v-model="bankAccountForm.accountNumber" v-imask="{ mask: Number, scale: 0 }" placeholder="Somente números" required class="form-input"/>
                      <p v-if="bankErrors.accountNumber" class="error-message">{{ bankErrors.accountNumber }}</p>
                  </div>
                  <div class="form-group sm:col-span-1">
                      <label for="accountDigit">Dígito</label>
                      <input type="text" id="accountDigit" v-model="bankAccountForm.accountDigit" v-imask="{ mask: 'A[A]', definitions: { 'A': /[a-zA-Z0-9]/ }, uppercase: true }" placeholder="X" required class="form-input" maxlength="2" />
                      <p v-if="bankErrors.accountDigit" class="error-message">{{ bankErrors.accountDigit }}</p>
                  </div>
              </div>

              <div class="form-group md:col-span-2">
                <label for="accountHolderName">Nome do Titular</label>
                <input type="text" id="accountHolderName" v-model="bankAccountForm.accountHolderName" placeholder="Nome completo" required class="form-input"/>
                  <p v-if="bankErrors.accountHolderName" class="error-message">{{ bankErrors.accountHolderName }}</p>
              </div>
                <div class="form-group md:col-span-2">
                <label for="accountHolderDocument">CPF/CNPJ do Titular</label>
                <input type="text" id="accountHolderDocument" v-model="bankAccountForm.accountHolderDocument" v-imask="documentMask" placeholder="CPF ou CNPJ" required class="form-input"/>
                  <p v-if="bankErrors.accountHolderDocument" class="error-message">{{ bankErrors.accountHolderDocument }}</p>
              </div>
            </div>
            <button type="submit" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30">
              Salvar Conta
            </button>
        </form>

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
                  <p v-if="pixErrors.pixKeyType" class="error-message">{{ pixErrors.pixKeyType }}</p>
              </div>
                <div class="form-group">
                  <label for="pixKey">Chave PIX</label>
                  <input 
                    type="text" 
                    id="pixKey" 
                    :key="pixForm.pixKeyType"
                    v-model="pixForm.pixKey" 
                    v-imask="pixKeyMask" 
                    placeholder="Digite a chave PIX" 
                    required 
                    class="form-input"
                  />
                  <p v-if="pixErrors.pixKey" class="error-message">{{ pixErrors.pixKey }}</p>
              </div>
                <div class="form-group">
                  <label for="pixAccountHolderName">Nome do Titular</label>
                  <input type="text" id="pixAccountHolderName" v-model="pixForm.accountHolderName" placeholder="Nome associado à chave" required class="form-input"/>
                  <p v-if="pixErrors.accountHolderName" class="error-message">{{ pixErrors.accountHolderName }}</p>
              </div>
            </div>
            <button type="submit" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30">
                Salvar Chave PIX
            </button>
        </form>
      </div>

      <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 class="text-xl font-semibold text-gray-100 mb-6">Contas Cadastradas</h3>
        <div v-if="registeredAccounts.length === 0" class="text-center text-gray-500 py-8">
            Nenhuma conta cadastrada ainda.
        </div>
        <ul v-else class="space-y-4">
          <li v-for="account in registeredAccounts" :key="account.id" class="bg-gray-700 p-4 rounded-lg flex items-center justify-between gap-4 hover:bg-gray-600 transition duration-150">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium px-2 py-0.5 rounded" :class="getAccountTypeBadgeClass(account.type)">
                    {{ formatAccountType(account.type) }}
                  </span>
                  <span v-if="account.type !== 'pix'" class="text-gray-300 font-semibold truncate">{{ account.bankName }}</span>
                  <span v-else class="text-gray-400 text-xs truncate">({{ account.pixKeyType }})</span>
              </div>
              <p v-if="account.type !== 'pix'" class="text-xs text-gray-400 truncate">
                  Ag: {{ account.agency }} | CC: {{ account.accountNumber }}-{{ account.accountDigit }}
              </p>
              <p v-else class="text-xs text-gray-400 truncate">
                  Chave: {{ account.pixKey }}
              </p>
              <p class="text-xs text-gray-500 truncate mt-1">Titular: {{ account.accountHolderName }}</p>
            </div>

            <div class="flex items-center space-x-3 flex-shrink-0">
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
                <button @click="editAccount(account.id)" class="text-gray-400 hover:text-blue-400 transition" title="Editar conta">
                    <PencilIcon class="h-4 w-4" />
                </button>
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
import { ref, reactive, computed, watch } from 'vue';
import { PencilIcon, Trash2Icon } from 'lucide-vue-next';
import { z, ZodError } from 'zod';
import Swal from 'sweetalert2';
import IMask from 'imask'; 

// A diretiva v-imask é registada globalmente no main.ts

// --- ESQUEMAS ZOD ---
const BankAccountSchema = z.object({
  bankName: z.string({ required_error: "Nome do banco é obrigatório." }).min(1, "Nome do banco é obrigatório.").max(100, "Máximo de 100 caracteres."),
  agency: z.string({ required_error: "Agência é obrigatória." }).length(4, "Agência deve ter 4 dígitos.").regex(/^[0-9]+$/, "Agência deve conter apenas números."),
  accountNumber: z.string({ required_error: "Número da conta é obrigatório." }).min(1, "Número da conta é obrigatório.").max(20, "Máximo de 20 caracteres.").regex(/^[0-9]+$/, "Conta deve conter apenas números."),
  accountDigit: z.string({ required_error: "Dígito é obrigatório." }).min(1, "Dígito é obrigatório.").max(2, "Máximo de 2 caracteres.").regex(/^[a-zA-Z0-9]+$/, "Dígito inválido."),
  accountHolderName: z.string({ required_error: "Nome do titular é obrigatório." }).min(1, "Nome do titular é obrigatório.").max(100, "Máximo de 100 caracteres."),
  accountHolderDocument: z.string({ required_error: "Documento é obrigatório." }).refine(doc => (doc || '').replace(/\D/g, '').length === 11 || (doc || '').replace(/\D/g, '').length === 14, "CPF/CNPJ inválido."),
});

const PixSchema = z.object({
  pixKeyType: z.enum(['cpf', 'cnpj', 'email', 'telefone', 'aleatoria'], { required_error: "Tipo de chave é obrigatório."}),
  pixKey: z.string({ required_error: "Chave PIX é obrigatória." }).min(1, "Chave PIX é obrigatória."),
  accountHolderName: z.string({ required_error: "Nome do titular é obrigatório." }).min(1, "Nome do titular é obrigatório.").max(100, "Máximo de 100 caracteres."),
}).superRefine((data, ctx) => {
    const key = (data.pixKey || '').replace(/\D/g, ''); 
    switch(data.pixKeyType) {
        case 'email':
            if (!z.string().email().safeParse(data.pixKey).success) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Formato de e-mail inválido.", path: ["pixKey"] });
            }
            break;
        case 'cpf':
            if (key.length !== 11) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CPF deve ter 11 dígitos.", path: ["pixKey"] });
            }
            break;
        case 'cnpj':
            if (key.length !== 14) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CNPJ deve ter 14 dígitos.", path: ["pixKey"] });
            }
            break;
        case 'telefone':
             const unmaskedTelefone = (data.pixKey || '').replace(/\D/g, '');
             if (unmaskedTelefone.length !== 11) {
                 ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Telefone deve ter 11 dígitos.", path: ["pixKey"] });
             }
            break;
        case 'aleatoria':
             // Nenhuma validação extra necessária além do min(1)
            break;
    }
});

// Tipos e Estado
type AccountType = 'corrente' | 'poupanca' | 'pix';
interface BankAccount {
  id: number;
  type: AccountType;
  bankName?: string;
  agency?: string;
  accountNumber?: string;
  accountDigit?: string;
  pixKeyType?: string;
  pixKey?: string;
  accountHolderName: string;
  accountHolderDocument?: string;
  isPrimary: boolean;
  isActive: boolean;
}

const selectedAccountType = ref<AccountType>('corrente');
const accountTypes = [
  { label: 'Conta Corrente', value: 'corrente' },
  { label: 'Conta Poupança', value: 'poupanca' },
  { label: 'PIX', value: 'pix' },
];

const initialBankAccountForm = { bankName: '', agency: '', accountNumber: '', accountDigit: '', accountHolderName: '', accountHolderDocument: '' };
const initialPixForm = { pixKeyType: '', pixKey: '', accountHolderName: '' };

const bankAccountForm = ref({ ...initialBankAccountForm });
const pixForm = ref({ ...initialPixForm });

// Lista de contas começa vazia
const registeredAccounts = reactive<BankAccount[]>([]);

const bankErrors = ref<Record<string, string>>({});
const pixErrors = ref<Record<string, string>>({});


const resetBankAccountForm = () => {
    bankAccountForm.value = { ...initialBankAccountForm };
    bankErrors.value = {};
};

const resetPixForm = () => {
    pixForm.value = { ...initialPixForm };
    pixErrors.value = {};
};


// --- LÓGICA DE MÁSCARA DINÂMICA (com vue-imask) ---
const documentMask = computed(() => ({
    mask: [
        { mask: '000.000.000-00' },
        { mask: '00.000.000/0000-00' }
    ],
    dispatch: (appended: string, dynamicMask: any) => {
        const unmaskedValue = (dynamicMask.value + appended).replace(/\D/g, '');
        if (unmaskedValue.length > 11) {
            return dynamicMask.compiledMasks[1]; 
        }
        return dynamicMask.compiledMasks[0];
    }
}));

const pixKeyMask = computed(() => {
    switch (pixForm.value.pixKeyType) {
        case 'cpf': 
            return { mask: '000.000.000-00', lazy: false };
        case 'cnpj': 
            return { mask: '00.000.000/0000-00', lazy: false };
        case 'telefone': 
            return { mask:  '(00) 00000-0000', lazy: false };
        case 'email':
        case 'aleatoria':
        default: 
            return { mask: /.*/, lazy: false };
    }
});

watch(() => pixForm.value.pixKeyType, () => {
    pixForm.value.pixKey = '';
});

watch(selectedAccountType, (newValue, oldValue) => {
    if (oldValue === 'pix') {
        resetPixForm();
    } 
    else if (oldValue === 'corrente' || oldValue === 'poupanca') {
        resetBankAccountForm();
    }
});


// --- FUNÇÕES DE SUBMISSÃO ---
const handleSubmitBankAccount = () => {
  bankErrors.value = {};
  try {
      const dataToValidate = {
          ...bankAccountForm.value,
          accountHolderDocument: (bankAccountForm.value.accountHolderDocument || '').replace(/\D/g, ''),
          agency: bankAccountForm.value.agency, 
          accountNumber: bankAccountForm.value.accountNumber,
          accountDigit: bankAccountForm.value.accountDigit
      };
      
      const validatedData = BankAccountSchema.parse(dataToValidate);

      const newAccount: BankAccount = {
        id: Date.now(),
        type: selectedAccountType.value,
        bankName: validatedData.bankName,
        agency: validatedData.agency,
        accountNumber: validatedData.accountNumber,
        accountDigit: validatedData.accountDigit,
        accountHolderName: validatedData.accountHolderName,
        accountHolderDocument: validatedData.accountHolderDocument,
        isPrimary: registeredAccounts.length === 0,
        isActive: true,
      };
      registeredAccounts.push(newAccount);
      resetBankAccountForm();
      showToast('success', 'Conta salva com sucesso!');

  } catch (error) {
      if (error instanceof ZodError) {
          bankErrors.value = formatZodErrors(error);
          showToast('error', 'Por favor, corrija os erros.');
      }
  }
};

const handleSubmitPix = () => {
   pixErrors.value = {};
   try {
       const dataToValidate = {
           ...pixForm.value,
           pixKey: (['cpf', 'cnpj', 'telefone'].includes(pixForm.value.pixKeyType))
                   ? (pixForm.value.pixKey || '').replace(/\D/g, '')
                   : pixForm.value.pixKey,
       };
       const validatedData = PixSchema.parse(dataToValidate);

       const newAccount: BankAccount = {
         id: Date.now(),
         type: 'pix',
         pixKeyType: validatedData.pixKeyType,
         pixKey: pixForm.value.pixKey,
         accountHolderName: validatedData.accountHolderName,
         isPrimary: registeredAccounts.length === 0,
         isActive: true,
       };
       
       registeredAccounts.push(newAccount);
       resetPixForm();
       showToast('success', 'Chave PIX salva com sucesso!');

   } catch (error) {
       if (error instanceof ZodError) {
           pixErrors.value = formatZodErrors(error);
           showToast('error', 'Por favor, corrija os erros.');
       }
   }
};

const formatZodErrors = (error: ZodError): Record<string, string> => {
    const formattedErrors: Record<string, string> = {};
    const fieldErrors = error.format();
     for (const key in fieldErrors) {
         if (key !== "_errors" && Object.prototype.hasOwnProperty.call(fieldErrors, key)) {
           const errorArray = (fieldErrors[key as keyof typeof fieldErrors] as any)?._errors;
           if (errorArray && errorArray.length > 0) {
               formattedErrors[key] = errorArray[0];
           }
         }
     }
    return formattedErrors;
}

// --- FUNÇÕES DA LISTA ---
const setPrimaryAccount = (accountId: number) => {
  registeredAccounts.forEach(acc => { acc.isPrimary = acc.id === accountId; });
  console.log(`Conta ID ${accountId} definida como principal.`);
};
const toggleAccountStatus = (accountId: number) => {
  const account = registeredAccounts.find(acc => acc.id === accountId);
  if (account) {
    if (account.isPrimary && account.isActive) {
        showToast('error', 'Não é possível desativar a conta principal.');
        return;
    }
    account.isActive = !account.isActive;
    console.log(`Status da Conta ID ${accountId} alterado para ${account.isActive ? 'Ativa' : 'Inativa'}.`);
  }
};


// --- LÓGICA DE EDIÇÃO (COM CORREÇÕES) ---

const editAccount = (accountId: number) => {
    const account = registeredAccounts.find(acc => acc.id === accountId);
    if (!account) return;

    if (account.isActive) {
        showToast('error', 'Contas ativas não podem ser editadas.');
        return;
    }

    if (account.type === 'pix') {
        openEditPixModal(account);
    } else {
        openEditBankAccountModal(account);
    }
};

const openEditBankAccountModal = (account: BankAccount) => {
    let agencyMask: IMask.InputMask<any>;
    let accountMask: IMask.InputMask<any>;
    let digitMask: IMask.InputMask<any>;
    let documentMask: IMask.InputMask<any>;

    Swal.fire({
        title: `Editar Conta ${account.type === 'corrente' ? 'Corrente' : 'Poupança'}`,
        html: `
            <div class="swal-form-container space-y-4 text-left">
                <div class="form-group">
                    <label for="swal-bankName">Banco</label>
                    <input id="swal-bankName" class="form-input" value="${account.bankName || ''}" placeholder="Nome do banco">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                        <label for="swal-agency">Agência</label>
                        <input id="swal-agency" class="form-input" value="${account.agency || ''}" placeholder="0000">
                    </div>
                </div>
                 <div class="grid grid-cols-3 gap-4">
                    <div class="form-group col-span-2">
                        <label for="swal-accountNumber">Número da Conta</label>
                        <input id="swal-accountNumber" class="form-input" value="${account.accountNumber || ''}" placeholder="Somente números">
                    </div>
                    <div class="form-group col-span-1">
                        <label for="swal-accountDigit">Dígito</label>
                        <input id="swal-accountDigit" class="form-input" value="${account.accountDigit || ''}" placeholder="X" maxlength="2">
                    </div>
                </div>
                <div class="form-group">
                    <label for="swal-accountHolderName">Nome do Titular</label>
                    <input id="swal-accountHolderName" class="form-input" value="${account.accountHolderName || ''}" placeholder="Nome completo">
                </div>
                <div class="form-group">
                    <label for="swal-accountHolderDocument">CPF/CNPJ do Titular</label>
                    <input id="swal-accountHolderDocument" class="form-input" value="${account.accountHolderDocument || ''}" placeholder="CPF ou CNPJ">
                </div>
            </div>
        `,
        background: '#1f2937',
        color: '#e5e7eb',
        showCancelButton: true,
        confirmButtonText: 'Salvar Alterações',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#4b5563',
        didOpen: () => {
            agencyMask = IMask(document.getElementById('swal-agency')!, { mask: '0000' });
            
            // ======================================================
            // CORREÇÃO (Delay): Usar a máscara 'Number' otimizada no modal
            // ======================================================
            accountMask = IMask(document.getElementById('swal-accountNumber')!, { mask: Number, scale: 0 });
            // ======================================================
            
            digitMask = IMask(document.getElementById('swal-accountDigit')!, { mask: 'A[A]', definitions: { 'A': /[a-zA-Z0-9]/ }, uppercase: true });
            documentMask = IMask(document.getElementById('swal-accountHolderDocument')!, {
                 mask: [ { mask: '000.000.000-00' }, { mask: '00.000.000/0000-00' } ],
                 dispatch: (appended: string, dynamicMask: any) => {
                    const unmaskedValue = (dynamicMask.value + appended).replace(/\D/g, '');
                    return dynamicMask.compiledMasks[unmaskedValue.length > 11 ? 1 : 0];
                 }
            });
        },
        willClose: () => {
            agencyMask?.destroy();
            accountMask?.destroy();
            digitMask?.destroy();
            documentMask?.destroy();
        },
        preConfirm: () => {
            try {
                // ======================================================
                // CORREÇÃO (Delay): Usar 'unmaskedValue' para validar
                // ======================================================
                const dataToValidate = {
                    bankName: (document.getElementById('swal-bankName') as HTMLInputElement).value,
                    agency: agencyMask.value, // Zod valida '0000'
                    accountNumber: accountMask.unmaskedValue, // Zod valida o número puro
                    accountDigit: digitMask.unmaskedValue.toUpperCase(),
                    accountHolderName: (document.getElementById('swal-accountHolderName') as HTMLInputElement).value,
                    accountHolderDocument: documentMask.unmaskedValue,
                };
                // ======================================================
                
                const validatedData = BankAccountSchema.parse(dataToValidate);

                // ======================================================
                // CORREÇÃO (Delay): Retornar o valor desmascarado validado
                // ======================================================
                return validatedData; // validatedData já contém o accountNumber desmascarado
                // ======================================================

            } catch (error) {
                // CORREÇÃO (Modal Travado): Remover 'return false'
                if (error instanceof ZodError) {
                    Swal.showValidationMessage(error.errors[0].message);
                }
            }
        }
    }).then((result) => {
        // Só executa se a validação (preConfirm) passar
        if (result.isConfirmed && result.value) { 
            const validatedData = result.value as z.infer<typeof BankAccountSchema>;
            
            const accountIndex = registeredAccounts.findIndex(acc => acc.id === account.id);
            if (accountIndex !== -1) {
                registeredAccounts[accountIndex] = {
                    ...registeredAccounts[accountIndex], 
                    bankName: validatedData.bankName,
                    agency: validatedData.agency,
                    accountNumber: validatedData.accountNumber,
                    accountDigit: validatedData.accountDigit,
                    accountHolderName: validatedData.accountHolderName,
                    accountHolderDocument: validatedData.accountHolderDocument,
                };
                showToast('success', 'Conta atualizada com sucesso!');
            }
        }
    });
};

const openEditPixModal = (account: BankAccount) => {
    let pixKeyMaskInstance: IMask.InputMask<any>;

    const getPixTypeOptions = (selectedType?: string) => {
        const types = [
            { value: 'cpf', label: 'CPF' },
            { value: 'cnpj', label: 'CNPJ' },
            { value: 'email', label: 'E-mail' },
            { value: 'telefone', label: 'Telefone' },
            { value: 'aleatoria', label: 'Chave Aleatória' },
        ];
        return types.map(type => 
            `<option value="${type.value}" ${type.value === selectedType ? 'selected' : ''}>${type.label}</option>`
        ).join('');
    };
    
    const updatePixMask = (keyType: string) => {
        pixKeyMaskInstance?.destroy();
        const keyEl = document.getElementById('swal-pixKey') as HTMLInputElement;
        if (!keyEl) return;

        let maskOptions: IMask.MaskOptions;
        switch (keyType) {
            case 'cpf': maskOptions = { mask: '000.000.000-00', lazy: false }; break;
            case 'cnpj': maskOptions = { mask: '00.000.000/0000-00', lazy: false }; break;
            case 'telefone': maskOptions = { mask: '(00) 00000-0000', lazy: false }; break;
            default: maskOptions = { mask: /.*/, lazy: false };
        }
        pixKeyMaskInstance = IMask(keyEl, maskOptions);
    };

    Swal.fire({
        title: 'Editar Chave PIX',
        html: `
            <div class="swal-form-container space-y-4 text-left">
                <div class="form-group">
                    <label for="swal-pixKeyType">Tipo de Chave PIX</label>
                    <select id="swal-pixKeyType" class="form-input">
                        ${getPixTypeOptions(account.pixKeyType)}
                    </select>
                </div>
                <div class="form-group">
                    <label for="swal-pixKey">Chave PIX</label>
                    <input id="swal-pixKey" class="form-input" value="${account.pixKey || ''}" placeholder="Digite a chave PIX">
                </div>
                <div class="form-group">
                    <label for="swal-pixAccountHolderName">Nome do Titular</label>
                    <input id="swal-pixAccountHolderName" class="form-input" value="${account.accountHolderName || ''}" placeholder="Nome associado à chave">
                </div>
            </div>
        `,
        background: '#1f2937',
        color: '#e5e7eb',
        showCancelButton: true,
        confirmButtonText: 'Salvar Alterações',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#4b5563',
        didOpen: () => {
            const selectEl = document.getElementById('swal-pixKeyType') as HTMLSelectElement;
            updatePixMask(selectEl.value);
            selectEl.addEventListener('change', () => updatePixMask(selectEl.value));
        },
        willClose: () => {
            pixKeyMaskInstance?.destroy();
        },
        preConfirm: () => {
            try {
                const pixKeyType = (document.getElementById('swal-pixKeyType') as HTMLSelectElement).value;
                const pixKey = (document.getElementById('swal-pixKey') as HTMLInputElement).value;
                const accountHolderName = (document.getElementById('swal-pixAccountHolderName') as HTMLInputElement).value;
                
                const keyForValidation = (['cpf', 'cnpj', 'telefone'].includes(pixKeyType))
                    ? pixKeyMaskInstance.unmaskedValue
                    : pixKey;

                const dataToValidate = {
                    pixKeyType: pixKeyType,
                    pixKey: keyForValidation,
                    accountHolderName: accountHolderName,
                };

                const validatedData = PixSchema.parse(dataToValidate);
                
                return {
                    ...validatedData,
                    pixKey: pixKey, // Retorna valor COM máscara
                };
            } catch (error) {
                // CORREÇÃO (Modal Travado): Remover 'return false'
                if (error instanceof ZodError) {
                    Swal.showValidationMessage(error.errors[0].message);
                }
            }
        }
    }).then((result) => {
        // Só executa se a validação (preConfirm) passar
        if (result.isConfirmed && result.value) { 
            const validatedData = result.value as (z.infer<typeof PixSchema> & { pixKey: string });
            
            const accountIndex = registeredAccounts.findIndex(acc => acc.id === account.id);
            if (accountIndex !== -1) {
                registeredAccounts[accountIndex] = {
                    ...registeredAccounts[accountIndex],
                    pixKeyType: validatedData.pixKeyType,
                    pixKey: validatedData.pixKey,
                    accountHolderName: validatedData.accountHolderName,
                };
                showToast('success', 'Chave PIX atualizada com sucesso!');
            }
        }
    });
};


const deleteAccount = (accountId: number) => {
  Swal.fire({
    title: 'Tem certeza?',
    text: "Esta ação não pode ser revertida!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
    background: '#1f2937', 
    color: '#e5e7eb'      
  }).then((result) => {
    if (result.isConfirmed) {
        const index = registeredAccounts.findIndex(acc => acc.id === accountId);
        if (index !== -1) {
            const wasPrimary = registeredAccounts[index].isPrimary;
            registeredAccounts.splice(index, 1);
            console.log(`Conta ID ${accountId} excluída.`);
            showToast('success', 'Conta excluída com sucesso.');
            if (wasPrimary && !registeredAccounts.some(acc => acc.isPrimary) && registeredAccounts.length > 0) {
                registeredAccounts[0].isPrimary = true;
            }
        }
    }
  })
};

// --- FUNÇÕES AUXILIARES ---
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
const showToast = (icon: 'success' | 'error' | 'warning' | 'info' | 'question', title: string) => {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon,
        title,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#1f2937',
        color: '#e5e7eb'      
      });
};
</script>

<style scoped>
/* Estilos gerais herdados do tema escuro, adicionando específicos para formulário */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Garante que o form-group não adicione margem extra quando dentro de um grid */
.grid .form-group {
    margin-bottom: 0;
}


label {
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
}

input[type="text"],
input[type="tel"],
select {
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
input::placeholder { color: #4b5563; }
input:focus,
select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
}
.form-input {
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
     @apply shadow-lg shadow-blue-600/30 py-2.5;
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

.error-message {
  color: #ef4444; /* Vermelho */
  font-size: 12px;
  margin-top: 2px;
}


/* Estilos globais para o formulário DENTRO do SweetAlert */
:global(.swal-form-container .form-group) {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 0; 
}

:global(.swal-form-container label) {
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
  margin-bottom: 0;
}

:global(.swal-form-container .form-input) {
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #374151;
  border-radius: 6px;
  outline: none;
  background: #1f2937; 
  color: #e5e7eb;
  width: 100%;
  box-sizing: border-box; 
  transition: border-color 0.2s, box-shadow 0.2s;
}

:global(.swal-form-container .form-input:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
}

:global(.swal2-validation-message) {
  background-color: #1f2937 !important;
  color: #ef4444 !important; 
  margin-top: 1rem !important;
}

</style>