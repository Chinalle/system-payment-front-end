<template>
  <div class="register-page">
    <form @submit.prevent="handleRegister" class="formRegister animated-form">
      <h1>Crie sua conta</h1>
      <p>Selecione seu perfil e preencha os campos abaixo.</p>

      <div class="user-type-selector">
        <button
          type="button"
          :class="{ active: selectedUserType === 'cliente' }"
          @click="setUserType('cliente')"
        >
          Sou Cliente
        </button>
        <button
          type="button"
          :class="{ active: selectedUserType === 'provider' }"
          @click="setUserType('provider')"
        >
          Sou Profissional
        </button>
      </div>

      <div class="form-group">
        <label for="fullName">Nome Completo <span class="text-red-500">*</span></label>
        <input type="text" id="fullName" v-model="formData.fullName" placeholder="Digite seu nome completo" />
      </div>

      <div class="form-group">
        <label for="email">E-mail <span class="text-red-500">*</span></label>
        <input type="email" id="email" v-model="formData.email" placeholder="Digite seu e-mail" />
      </div>
      
      <div class="form-group">
        <label for="phone">Telefone <span class="text-red-500">*</span></label>
        <input type="tel" id="phone" v-model="formData.phone" placeholder="(XX) XXXXX-XXXX" />
      </div>

      <div class="form-group">
        <label for="cpf">CPF <span class="text-red-500">*</span></label>
        <input type="text" id="cpf" v-model="formData.cpf" placeholder="000.000.000-00" />
      </div>

      <div class="form-group">
        <label for="password">Senha <span class="text-red-500">*</span></label>
        <input type="password" id="password" v-model="formData.password" placeholder="Crie uma senha forte" />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar Senha <span class="text-red-500">*</span></label>
        <input type="password" id="confirmPassword" v-model="formData.confirmPassword" placeholder="Confirme sua senha" />
      </div>
    
      <div class="form-group">
        <label for="birthDate">Data de Nascimento</label>
        <input type="date" id="birthDate" v-model="formData.birthDate" />
      </div>

      <div class="form-group">
        <label for="cep">CEP</label>
        <input type="text" id="cep" v-model="formData.cep" @blur="fetchAddressFromCep" placeholder="00000-000" />
      </div>
      <div class="form-group">
        <label for="logradouro">Logradouro</label>
        <input type="text" id="logradouro" v-model="formData.logradouro" placeholder="Rua, Avenida, etc." />
      </div>
      <div class="form-group">
        <label for="numero">Número</label>
        <input type="text" id="numero" v-model="formData.numero" placeholder="Ex: 123" />
      </div>
       <div class="form-group">
        <label for="bairro">Bairro</label>
        <input type="text" id="bairro" v-model="formData.bairro" placeholder="Digite o bairro" />
      </div>
       <div class="form-group">
        <label for="cidade">Cidade</label>
        <input type="text" id="cidade" v-model="formData.cidade" placeholder="Digite a cidade" />
      </div>
       <div class="form-group">
        <label for="estado">Estado (UF)</label>
        <input type="text" id="estado" v-model="formData.estado" placeholder="Ex: SP" />
      </div>
      

      <button type="submit" class="btn">
        Cadastrar
      </button>

      <div class="links">
        <router-link to="/login">Já tenho uma conta</router-link>
      </div>
    </form>
  </div>
</template>

<script>
/*import Swal from "sweetalert2";
import {z} from "zod";

// criação do schema com zod que vai validar e caso exista um erro vai devolver para o usuario e repetir esse processo para a tela de login

const RegisterSchema = z.object({fullName: z.string().min(5, "Tamanho mínimo não atingido").max(100,"Excedeu o limite de caracter!"), email: z.email})
type FormData = z.infer <>*/
export default {
  name: "RegisterPage",
  data() {
    return {
      selectedUserType: 'cliente',
      formData: {
        fullName: "",
        email: "",
        phone: "",
        cpf: "",
        password: "",
        confirmPassword: "",
        birthDate: "",
        cep: "",
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
      },
    };
  },
  methods: {
    setUserType(type) {
      this.selectedUserType = type;
    },

    async handleRegister() {
      const requiredFields = ['fullName', 'email', 'phone', 'cpf', 'password', 'confirmPassword'];
      for (const field of requiredFields) {
        if (!this.formData[field]) {
          this.showToast("warning", "Por favor, preencha todos os campos obrigatórios.");
          return;
        }
      }
      if (this.formData.password !== this.formData.confirmPassword) {
        this.showToast("error", "As senhas não coincidem!");
        return;
      }
      
      const payload = {
        userType: this.selectedUserType,
        fullName: this.formData.fullName,
        email: this.formData.email,
        phone: this.formData.phone,
        cpf: this.formData.cpf,
        password: this.formData.password,
        birthDate: this.formData.birthDate || null,
        address: {
          cep: this.formData.cep || null,
          logradouro: this.formData.logradouro || null,
          numero: this.formData.numero || null,
          bairro: this.formData.bairro || null,
          cidade: this.formData.cidade || null,
          estado: this.formData.estado || null,
        }
      };

      console.log("Enviando para a API:", payload);

      try {
        this.showToast("success", `Cadastro como ${this.selectedUserType} realizado com sucesso!`);
        setTimeout(() => { this.$router.push('/login'); }, 2000);
      } catch (error) {
        this.showToast("error", "Ocorreu um erro no cadastro. Tente novamente.");
        console.error("Erro no cadastro:", error);
      }
    },

    async fetchAddressFromCep() {
      const cep = this.formData.cep.replace(/\D/g, '');
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

    showToast(icon, title) {
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
};
</script>

<style scoped>
/* ESTILOS GERAIS DO FORMULÁRIO */
.formRegister {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 30px 40px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  color: #fff;
  width: 100%;
  max-width: 500px;
}

/* Títulos e Parágrafos */
h1 {
  text-align: center;
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 8px;
}
p {
  text-align: center;
  color: #a0aec0;
  margin-bottom: 24px;
}

/* Agrupador de Label + Input */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
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
  margin-bottom: 24px;
}
.user-type-selector button {
  flex: 1;
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
  margin-top: 10px;
}
.links {
  text-align: center;
  margin-top: 20px;
}
.links a {
  font-size: 14px;
  color: #93c5fd;
}


.text-red-500 {
  color: #ef4444;
  margin-left: 2px;
}
.animated-form {
  animation: scaleIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes scaleIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
</style>