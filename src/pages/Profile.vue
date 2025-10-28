<template>
  <div class="p-6 bg-gray-900 min-h-screen text-gray-300">
    <h2 class="text-3xl font-bold text-gray-100 mb-8">Perfil da Empresa</h2>

    <div class="max-w-5xl mx-auto">
      <form @submit.prevent="saveProfile">
        <div class="bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg">
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div class="md:col-span-1 flex flex-col items-center">
              <h3 class="text-lg font-semibold text-gray-200 mb-4 text-center">Imagem de Perfil</h3>
              
              <div class="w-48 h-48 rounded-full bg-gray-700 mb-4 flex items-center justify-center overflow-hidden border-4 border-gray-700">
                <img v-if="imagePreview" :src="imagePreview" alt="Pré-visualização" class="w-full h-full object-cover">
                <UserIcon v-else class="w-24 h-24 text-gray-500" />
              </div>

              <input 
                type="file" 
                ref="fileInput" 
                @change="onFileSelected" 
                accept="image/png, image/jpeg, image/webp" 
                class="hidden"
              >

              <div class="flex flex-col sm:flex-row md:flex-col gap-3 w-full max-w-xs px-4 md:px-0">
                <button 
                  type="button" 
                  @click="triggerFileUpload" 
                  class="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
                >
                  <UploadIcon class="w-4 h-4" />
                  Alterar Imagem
                </button>
                <button 
                  type="button" 
                  @click="removeImage" 
                  class="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-gray-200"
                >
                  <Trash2Icon class="w-4 h-4" />
                  Remover
                </button>
              </div>
            </div>

            <div class="md:col-span-2 space-y-5">
              <h3 class="text-lg font-semibold text-gray-200 mb-4">Informações da Empresa</h3>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div class="form-group">
                  <label for="companyName">Nome da Empresa</label>
                  <input type="text" id="companyName" v-model="companyProfile.name" class="form-input" placeholder="Ex: Minha Empresa LTDA">
                  <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
                </div>

                <div class="form-group">
                  <label for="cnpj">CNPJ</label>
                  <input type="text" id="cnpj" v-model="companyProfile.cnpj" v-imask="cnpjMask" class="form-input" placeholder="00.000.000/0000-00">
                  <p v-if="errors.cnpj" class="error-message">{{ errors.cnpj }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div class="form-group">
                  <label for="email">E-mail de Contato</label>
                  <input type="email" id="email" v-model="companyProfile.email" class="form-input" placeholder="contato@empresa.com">
                  <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
                </div>

                <div class="form-group">
                  <label for="phone">Telefone</label>
                  <input type="tel" id="phone" v-model="companyProfile.phone" v-imask="phoneMask" class="form-input" placeholder="(00) 00000-0000">
                  <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
                </div>
              </div>
              
              <div class="form-group">
                <label for="description">Descrição</label>
                <textarea id="description" v-model="companyProfile.description" rows="4" class="form-input" placeholder="Fale um pouco sobre a sua empresa..."></textarea>
                <p v-if="errors.description" class="error-message">{{ errors.description }}</p>
              </div>

              <div class="form-group">
                <label for="address">Endereço</label>
                <textarea id="address" v-model="companyProfile.address" rows="3" class="form-input" placeholder="Ex: Rua Exemplo, 123, Bairro, Cidade - UF, 00000-000"></textarea>
                 <p v-if="errors.address" class="error-message">{{ errors.address }}</p>
              </div>

            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-700 flex justify-end">
            <button 
              type="submit" 
              class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 px-6"
            >
              <SaveIcon class="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>

        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { z, ZodError } from 'zod';
import Swal from 'sweetalert2';
import { UploadIcon, Trash2Icon, UserIcon, SaveIcon } from 'lucide-vue-next';
// A diretiva v-imask é registada globalmente no main.ts

// --- Estado do Formulário ---
const companyProfile = reactive({
  name: '',
  cnpj: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  imageUrl: '', // URL da imagem salva (vem do backend)
});

const imagePreview = ref<string | null>(null); // Pré-visualização local
const fileInput = ref<HTMLInputElement | null>(null); // Referência ao input de arquivo
const selectedFile = ref<File | null>(null); // Arquivo selecionado
const errors = ref<Record<string, string>>({}); // Erros de validação

// --- Máscaras (IMask) ---
const cnpjMask = { 
  mask: '00.000.000/0000-00', 
  lazy: false 
};
const phoneMask = { 
  mask: '(00) 00000-0000', 
  lazy: false 
};

// --- Validação (Zod) ---
const ProfileSchema = z.object({
  name: z.string().min(1, "Nome da empresa é obrigatório."),
  cnpj: z.string().refine(doc => (doc || '').replace(/\D/g, '').length === 14, "CNPJ inválido (deve ter 14 dígitos)."),
  description: z.string().max(500, "Descrição muito longa (máx. 500 caracteres).").optional(),
  email: z.string().min(1, "E-mail é obrigatório.").email("Formato de e-mail inválido."),
  phone: z.string().refine(tel => (tel || '').replace(/\D/g, '').length === 11, "Telefone inválido (deve ter 11 dígitos)."),
  address: z.string().max(300, "Endereço muito longo (máx. 300 caracteres).").optional(),
});

// --- Funções de Imagem ---

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  // Salva o arquivo para futuro upload
  selectedFile.value = file;

  // Cria a pré-visualização
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  imagePreview.value = null;
  selectedFile.value = null;
  companyProfile.imageUrl = ''; // Limpa também a URL "salva"
  if (fileInput.value) {
    fileInput.value.value = ''; // Limpa o input de arquivo
  }
};

// --- Funções de Formulário ---

const saveProfile = () => {
  errors.value = {}; // Limpa erros antigos

  try {
    // 1. Validar os dados de texto
    const dataToValidate = {
      ...companyProfile,
      cnpj: (companyProfile.cnpj || '').replace(/\D/g, ''),
      phone: (companyProfile.phone || '').replace(/\D/g, ''),
    };
    const validatedData = ProfileSchema.parse(dataToValidate);

    // 2. Lógica de Salvamento (Simulação)
    // Aqui você enviaria 'validatedData' e 'selectedFile.value' para o seu backend
    console.log("Dados validados para salvar:", validatedData);
    if (selectedFile.value) {
      console.log("Arquivo de imagem para upload:", selectedFile.value);
      // Após o upload, o backend retornaria uma URL
      // companyProfile.imageUrl = backendResponse.imageUrl;
      // Por enquanto, apenas usamos o preview local
      companyProfile.imageUrl = imagePreview.value; 
    }

    // Atualiza o estado reativo (apenas para simulação,
    // o ideal é que os dados venham do backend)
    companyProfile.name = validatedData.name;
    companyProfile.cnpj = companyProfile.cnpj; // Manter a máscara
    companyProfile.phone = companyProfile.phone; // Manter a máscara
    companyProfile.email = validatedData.email;
    companyProfile.description = validatedData.description || '';
    companyProfile.address = validatedData.address || '';
    
    selectedFile.value = null; // Limpa o arquivo selecionado após "salvar"

    showToast('success', 'Perfil salvo com sucesso!');

  } catch (error) {
    if (error instanceof ZodError) {
      errors.value = formatZodErrors(error);
      showToast('error', 'Por favor, corrija os erros no formulário.');
    } else {
      console.error(error);
      showToast('error', 'Ocorreu um erro inesperado.');
    }
  }
};

// --- Funções Auxiliares (copiadas do seu outro componente) ---

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

const showToast = (icon: 'success' | 'error' | 'warning', title: string) => {
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
/* Estilos dos Formulários (consistente com seu outro componente) */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
}

input[type="text"],
input[type="email"],
input[type="tel"],
textarea {
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
input::placeholder,
textarea::placeholder { 
  color: #4b5563; 
}

input:focus,
textarea:focus {
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

.bg-blue-600 {
     @apply shadow-lg shadow-blue-600/30 py-2.5;
}

.error-message {
  color: #ef4444; /* Vermelho */
  font-size: 12px;
  margin-top: 2px;
}
</style>