<template>
  <div class="login-page">
    <form @submit.prevent="handleSubmit" class="formLogin animated-form">
      <h1>Bem-vindo de volta!</h1>
      <p>Digite seus dados para acessar sua conta</p>

      <UserTypeSelector v-model="selectedUserType" />

      <div class="form-group">
        <label for="email">E-mail</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Digite seu e-mail"
          autofocus
        />
        <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Digite sua senha"
        />
        <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
      </div>

      <div class="links">
        <a href="#">Esqueci minha senha</a>
        <router-link to="/register">Criar uma conta</router-link>
      </div>

      <button type="submit" class="btn">
        Entrar
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Swal from "sweetalert2";
import { z, ZodError } from "zod";
import UserTypeSelector from '../components/UserTypeSelector.vue';
import 'vue-router';

declare module 'vue' {
  interface ComponentCustomProperties {
    $router: import('vue-router').Router;
    $route: import('vue-router').RouteLocationNormalizedLoaded;
  }
}

const LoginSchema = z.object({
  email: z.string()
    .min(1, 'E-mail é obrigatório.') // Garante que o campo não está vazio
    .email('Formato de e-mail inválido.'), 
  password: z.string()
    .min(1, "A senha é obrigatória."),
});

export default defineComponent({
  name: "LoginPage",
  components: {
    UserTypeSelector: UserTypeSelector 
  },
  data() {
    return {
      selectedUserType: 'client' as 'client' | 'provider',
      email: "",
      password: "",
      errors: {} as Record<string, string>,
    };
  },
  methods: {
    // 5. Lógica de validação com Zod no handleSubmit
    handleSubmit() {
      this.errors = {}; // Limpa erros antigos

      try {
        const dataToValidate = {
          email: this.email,
          password: this.password
        };
        
        // Tenta validar os dados
        LoginSchema.parse(dataToValidate);

        // Se a validação passar, continua...
        const payload = {
          ...dataToValidate,
          userType: this.selectedUserType
        };
        console.log("Dados de login a serem enviados:", payload);
        
        this.showToast("success", `Login feito como ${this.selectedUserType}`);
        this.$router.push("/dashboard");

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
          this.showToast("error", "Por favor, corrija os erros.");
        }
      }
    },
    showToast(icon: 'success' | 'error' | 'warning' | 'info' | 'question', title: string) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon,
        title,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap");

.login-page {
  /* Garante que o container da página exista para o App.vue centralizar */
}

.formLogin {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 40px 50px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  color: #fff;
  width: 350px;
}

.form-group {
    display: flex;
    flex-direction: column; 
    gap: 8px; /* Espaço entre o label e o input */
    margin-bottom: 15px; /* Espaço entre os grupos de formulário */
}

.animated-form {
  animation: scaleIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes scaleIn {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

.formLogin h1 {
  margin: 0 0 10px;
  font-size: 2em;
  font-weight: 700;
  text-align: center;
}

.formLogin p:not(.error-message) {
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
  color: #a0aec0;
}

.formLogin input {
  padding: 15px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 100%; 
}

.formLogin input::placeholder { color: rgba(255, 255, 255, 0.5); }
.formLogin input:focus {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px #3b82f6;
}

.formLogin label {
  font-size: 13px;
  font-weight: 500;
  color: #e2e8f0;
}

.links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 20px;
}

.formLogin a {
  font-size: 13px;
  color: #93c5fd;
  transition: color 0.3s;
}

.formLogin a:hover { color: #fff; }

.btn {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border: none;
  padding: 15px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
}

.btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

.error-message {
  color: #ef4444; /* Um tom de vermelho vivo */
  font-size: 12px;
  margin-top: -8px; /* Puxa a mensagem para mais perto do input */
}
</style>