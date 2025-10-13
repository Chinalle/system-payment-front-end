<template>
  <div class="register-page">
    <form @submit.prevent="handleRegister" class="form-grid animated-form">
      <h1 class="span-12">Crie sua conta</h1>
      <p class="span-12">Selecione seu perfil e preencha os campos abaixo.</p>

      <div class="user-type-selector span-12">
        <button type="button" :class="{ active: selectedUserType === 'client' }" @click="setUserType('client')">
          Sou Cliente
        </button>
        <button type="button" :class="{ active: selectedUserType === 'provider' }" @click="setUserType('provider')">
          Sou Provedor
        </button>
      </div>
      
      <div class="form-group span-4">
        <label for="fullName">Nome Completo <span class="text-red-500">*</span></label>
        <input type="text" id="fullName" v-model="formData.fullName" placeholder="Digite seu nome completo" />
        <p v-if="errors.fullName" class="error-message">{{ errors.fullName }}</p>
      </div>
      <div class="form-group span-4">
        <label for="cpf">CPF <span class="text-red-500">*</span></label>
        <input type="text" id="cpf" v-model="formData.cpf" placeholder="000.000.000-00" />
        <p v-if="errors.cpf" class="error-message">{{ errors.cpf }}</p>
      </div>
      <div class="form-group span-4">
        <label for="phone">Telefone <span class="text-red-500">*</span></label>
        <input type="tel" id="phone" v-model="formData.phone" placeholder="(XX) XXXXX-XXXX" />
        <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
      </div>

      <div class="form-group span-4">
        <label for="email">E-mail <span class="text-red-500">*</span></label>
        <input type="email" id="email" v-model="formData.email" placeholder="Digite seu e-mail" />
        <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
      </div>
      <div class="form-group span-4">
        <label for="password">Senha <span class="text-red-500">*</span></label>
        <input type="password" id="password" v-model="formData.password" placeholder="Crie uma senha forte" />
        <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
      </div>
      <div class="form-group span-4">
        <label for="confirmPassword">Confirmar Senha <span class="text-red-500">*</span></label>
        <input type="password" id="confirmPassword" v-model="formData.confirmPassword" placeholder="Confirme sua senha" />
        <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
      </div>
    
      <div class="form-group span-4">
        <label for="birthDate">Data de Nascimento</label>
        <input type="date" id="birthDate" v-model="formData.birthDate" />
        <p v-if="errors.birthDate" class="error-message">{{ errors.birthDate }}</p>
      </div>
      <div class="form-group span-4">
        <label for="cep">CEP</label>
        <input type="text" id="cep" v-model="formData.cep" @blur="fetchAddressFromCep" placeholder="00000-000" />
        <p v-if="errors.cep" class="error-message">{{ errors.cep }}</p>
      </div>
      <div class="form-group span-4">
        <label for="logradouro">Logradouro</label>
        <input type="text" id="logradouro" v-model="formData.logradouro" placeholder="Rua, Avenida, etc." />
        <p v-if="errors.logradouro" class="error-message">{{ errors.logradouro }}</p>
      </div>
      
      <div class="form-group span-2">
        <label for="numero">Número</label>
        <input type="text" id="numero" v-model="formData.numero" placeholder="Ex: 123" />
        <p v-if="errors.numero" class="error-message">{{ errors.numero }}</p>
      </div>
      <div class="form-group span-4">
        <label for="bairro">Bairro</label>
        <input type="text" id="bairro" v-model="formData.bairro" placeholder="Digite o bairro" />
        <p v-if="errors.bairro" class="error-message">{{ errors.bairro }}</p>
      </div>
      <div class="form-group span-4">
        <label for="cidade">Cidade</label>
        <input type="text" id="cidade" v-model="formData.cidade" placeholder="Digite a cidade" />
        <p v-if="errors.cidade" class="error-message">{{ errors.cidade }}</p>
      </div>
      <div class="form-group span-2">
        <label for="estado">Estado (UF)</label>
        <input type="text" id="estado" v-model="formData.estado" placeholder="Ex: SP" />
        <p v-if="errors.estado" class="error-message">{{ errors.estado }}</p>
      </div>
      
      <div class="form-group span-12">
        <button type="submit" class="btn">Cadastrar</button>
      </div>
      <div class="links span-12">
        <router-link to="/login">Já tenho uma conta</router-link>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Swal from "sweetalert2";
import { z, ZodError } from "zod";


const RegisterSchema = z.object({
  fullName: z.string({ error: "O nome completo é obrigatório." }).min(5, "O nome completo deve ter no mínimo 5 caracteres.").max(100, "O nome excedeu o limite de 100 caracteres."),
  email: z.email("Por favor, insira um e-mail válido."),
  phone: z.string({ error: "O número de telefone é obrigatório." }).min(10, "O telefone deve ter no mínimo 10 dígitos.").max(11, "O telefone deve ter no máximo 11 dígitos."),
  cpf: z.string({ error: "O CPF é obrigatório." }).length(11, "O CPF deve ter 11 dígitos."),
  password: z.string({ error: "A senha é obrigatória." })
  .min(8, "A senha deve ter no mínimo 8 caracteres.")
  .regex(/(?=.*[a-z])/, "Deve conter pelo menos uma letra minúscula.")
  .regex(/(?=.*[A-Z])/, "Deve conter pelo menos uma letra maiúscula.")
  .regex(/(?=.*[^A-Za-z0-9])/, "Deve conter pelo menos um caractere especial."),
  confirmPassword: z.string({ error: "A confirmação de senha é obrigatória." }),
  birthDate: z.preprocess((val) => (val === "" ? undefined : val),
    z.coerce.date()
      .min(new Date("1900-01-01"), { message: "A data de nascimento não pode ser anterior a 1900." })
      .max(new Date(), { message: "A data de nascimento não pode ser no futuro." })
      .optional()
  ),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof RegisterSchema>;

export default defineComponent({
  name: "RegisterPage",
  data() {
    return {
      selectedUserType: 'client',
      formData: {} as Partial<FormData>,
      errors: {} as Record<string, string>,
    };
  },
  methods: {
    setUserType(type: 'client' | 'provider') {
      this.selectedUserType = type;
    },
    handleRegister() {
      this.errors = {};
      try {
        const validatedData = RegisterSchema.parse(this.formData);
        const payload = {
          ...validatedData,
          userType: this.selectedUserType
        };
        console.log("Dados a serem enviados para o backend:", payload);
        console.log("Dados validados com sucesso:", validatedData);
        this.showToast("success", `Cadastro como ${this.selectedUserType} realizado com sucesso!`);
        setTimeout(() => { this.$router.push('/login'); }, 2000);
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors: Record<string, string> = {};
          const fieldErrors = error.format();
          for (const key in fieldErrors) {
             if (key !== "_errors" && Object.prototype.hasOwnProperty.call(fieldErrors, key)) {
                const errorArray = (fieldErrors as any)[key]?._errors;
                if (errorArray && errorArray.length > 0) {
                    formattedErrors[key] = errorArray[0];
                }
            }
          }
          this.errors = formattedErrors;
          console.log("Erros formatados:", this.errors);
          this.showToast("error", "Por favor, corrija os erros no formulário.");
        }
      }
    },
    async fetchAddressFromCep() {
      const cep = (this.formData.cep || "").replace(/\D/g, ''); 
      if (cep.length !== 8) return;
      
      try {
        this.showToast('info', 'Buscando CEP...');
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (data.erro) {
          this.showToast('error', 'CEP não encontrado.');
          return;
        }
        this.formData.logradouro = data.logradouro;
        this.formData.bairro = data.bairro;
        this.formData.cidade = data.localidade;
        this.formData.estado = data.uf;
      } catch (error) {
        this.showToast('error', 'Não foi possível buscar o CEP.');
        console.error("Erro ao buscar CEP:", error);
      }
    },
    showToast(icon: 'success' | 'error' | 'warning' | 'info' | 'question', title: string) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon,
        title,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    },
  },
});
</script>

<style scoped>
/* ESTILOS GERAIS DA PÁGINA */
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px; /* Espaçamento no topo e base da página */
  box-sizing: border-box;
}

/* NOVO LAYOUT EM GRID */
.form-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr); /* Define um grid de 12 colunas */
  gap: 16px 20px; /* Espaçamento vertical e horizontal */
  
  /* Estilos visuais do formulário */
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 30px 40px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  color: #fff;
  width: 100%;
  max-width: 1200px; /* Largura máxima do formulário horizontal */
}

/* CLASSES PARA CONTROLAR O TAMANHO DAS COLUNAS */
.span-2 { grid-column: span 2; }
.span-4 { grid-column: span 4; }
.span-12 { grid-column: span 12; }


/* Títulos e Parágrafos */
h1, p:not(.error-message) {
  text-align: center;
  margin-bottom: 8px;
}
h1 { font-size: 2em; font-weight: 700; }
p:not(.error-message) { color: #a0aec0; margin-bottom: 24px; }


/* Agrupador de Label + Input */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #e2e8f0;
}

input {
  padding: 14px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 100%;
}
input::placeholder { color: rgba(255, 255, 255, 0.5); }
input:focus { box-shadow: 0 0 0 2px #3b82f6; }

/* BOTÕES DE SELEÇÃO DE PERFIL */
.user-type-selector {
  display: flex;
  gap: 12px;
  justify-content: center; /* Centraliza os botões */
}
.user-type-selector button {
  flex: 0 1 250px; /* Impede que os botões estiquem demais */
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background-color: transparent;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 600;
}
.user-type-selector button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.user-type-selector button.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

/* ESTILO PARA MENSAGEM DE ERRO */
.error-message {
  color: #ef4444; /* Vermelho */
  font-size: 12px;
  margin: 0;
  text-align: left; /* Alinha o erro à esquerda */
}

/* OUTROS ESTILOS */
.btn {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border: none;
  padding: 15px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
  width: 100%; /* Garante que o botão dentro do form-group ocupe o espaço */
}
.links {
  text-align: center;
}
.links a {
  font-size: 14px;
  color: #93c5fd;
}
.text-red-500 {
  color: #ef4444;
  margin-left: 2px;
}

/* ANIMAÇÃO */
.animated-form {
  animation: scaleIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes scaleIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}

/* === RESPONSIVIDADE PARA CELULAR === */
@media (max-width: 800px) {
  .form-grid {
    grid-template-columns: 1fr; /* Em telas menores, usamos apenas 1 coluna */
  }

  /* Todos os campos voltam a ocupar a largura total */
  .span-2, .span-4, .span-12 {
    grid-column: span 1;
  }
}
</style>