<template>
  <div class="page">
    <form @submit.prevent="handleLogin" class="formLogin">
      <h1>Bem-vindo</h1>
      <p>Digite seus dados para acessar sua conta</p>

      <label for="email">E-mail</label>
      <input
        type="email"
        id="email"
        v-model="email"
        placeholder="Digite seu e-mail"
        autofocus
      />

      <label for="password">Senha</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Digite sua senha"
      />

      <a href="#">Esqueci minha senha</a>

      <button type="submit" class="btn">Entrar</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    handleLogin() {
      console.log("Email:", this.email);
      console.log("Senha:", this.password);
      alert(Login com ${this.email});
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap");

body {
  font-family: "Inter", sans-serif;
  margin: 0;
  padding: 0;
  color: #023047;
}

/* Fundo sofisticado */
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #3a0ca3, #7209b7, #f72585);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

/* Animação do gradiente */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Card de login com efeito vidro */
.formLogin {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 40px 50px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  color: #fff;
  width: 350px;
}

/* Título e texto */
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
  color: #ddd;
}

/* Inputs modernos */
.formLogin input {
  padding: 15px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.formLogin input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.formLogin input:focus {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 0 2px #f72585;
}

/* Label discreta */
.formLogin label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: -8px;
  color: #f1f1f1;
}

/* Link */
.formLogin a {
  font-size: 13px;
  color: #ffb3d9;
  text-align: right;
  transition: color 0.3s;
}

.formLogin a:hover {
  color: #fff;
}

/* Botão elegante */
.btn {
  background: linear-gradient(135deg, #f72585, #ff0676);
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
  box-shadow: 0 8px 20px rgba(247, 37, 133, 0.4);
}
</style>