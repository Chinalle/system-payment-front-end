<template>
  <div class="login-page">
    <form @submit.prevent="handleSubmit" class="formLogin animated-form">
      <h1>{{ isRegister ? "Criar conta" : "Bem-vindo" }}</h1>
      <p>
        {{ isRegister
          ? "Preencha os campos para criar sua conta"
          : "Digite seus dados para acessar sua conta" }}
      </p>

      <div v-if="isRegister" class="form-group">
        <label for="name">Nome</label>
        <input
          type="text"
          id="name"
          v-model="name"
          placeholder="Digite seu nome completo"
        />
      </div>

      <div class="form-group">
        <label for="email">E-mail</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Digite seu e-mail"
          autofocus
        />
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Digite sua senha"
        />
      </div>

      <div v-if="isRegister" class="form-group">
        <label for="confirmPassword">Confirmar Senha</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="Confirme sua senha"
        />
      </div>

      <div class="links">
        <a v-if="!isRegister" href="#">Esqueci minha senha</a>
        <a href="#" @click.prevent="toggleMode">
          {{ isRegister ? "Já tenho conta" : "Criar uma conta" }}
        </a>
      </div>

      <button type="submit" class="btn">
        {{ isRegister ? "Cadastrar" : "Entrar" }}
      </button>
    </form>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
      isRegister: false,
    };
  },
  methods: {
    toggleMode() {
      this.isRegister = !this.isRegister;
      this.email = "";
      this.password = "";
      this.name = "";
      this.confirmPassword = "";
    },

    handleSubmit() {
      if (this.isRegister) {
        if (!this.name || !this.email || !this.password || !this.confirmPassword) {
          this.showToast("warning", "Preencha todos os campos!");
          return;
        }

        if (this.password !== this.confirmPassword) {
          this.showToast("error", "As senhas não coincidem!");
          return;
        }

        this.showToast("success", `Conta criada para ${this.name}!`);
        this.toggleMode(); // volta para a tela de login
      } else {
        if (!this.email || !this.password) {
          this.showToast("warning", "Preencha todos os campos!");
          return;
        }

        this.showToast("success", `Login feito com ${this.email}`);
        setTimeout(() => this.$router.push("/"), 2000);
      }
    },

    showToast(icon, title) {
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
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap");

.formLogin {
  display: flex;
  flex-direction: column;
  /* Removido: gap: 15px; (Espaçamento agora controlado pelo .form-group) */
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 40px 50px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  color: #fff;
  width: 350px;
}

/* NOVO ESTILO: Agrupa label e input, garante o input abaixo do label e define o espaçamento entre os campos */
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
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.formLogin h1 {
  margin: 0 0 10px;
  font-size: 2em;
  font-weight: 700;
  text-align: center;
}

.formLogin p {
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
  /* Adicionado para garantir o mesmo tamanho (100% da largura do .form-group) */
  width: 100%; 
}

.formLogin input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.formLogin input:focus {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px #3b82f6;
}

.formLogin label {
  font-size: 13px;
  font-weight: 500;
  /* Removido: margin-bottom: -8px; (Não é mais necessário devido ao `gap` no .form-group) */
  color: #e2e8f0;
}

.links {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.formLogin a {
  font-size: 13px;
  color: #93c5fd;
  transition: color 0.3s;
}

.formLogin a:hover {
  color: #fff;
}

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
</style>