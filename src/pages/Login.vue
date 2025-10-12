<template>
  <div class="login-page">
    <form @submit.prevent="handleSubmit" class="formLogin animated-form">
      <h1>Bem-vindo de volta!</h1>
      <p>Digite seus dados para acessar sua conta</p>

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

<script>
import Swal from "sweetalert2";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleSubmit() {
      if (!this.email || !this.password) {
        this.showToast("warning", "Preencha todos os campos!");
        return;
      }

      this.showToast("success", `Login feito com ${this.email}`);
      setTimeout(() => this.$router.push("/dashboard"), 2000); 
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
</style>