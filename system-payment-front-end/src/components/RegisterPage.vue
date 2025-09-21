<template>
  <div class="page">
    <form @submit.prevent="handleRegister" class="formRegister">
      <h1>Cadastro de Cliente</h1>
      <p>Preencha seus dados para criar sua conta</p>

      <!-- Nome completo -->
      <label for="name">Nome completo *</label>
      <input
        type="text"
        id="name"
        v-model="name"
        placeholder="Digite seu nome completo"
        required
      />

      <!-- E-mail -->
      <label for="email">E-mail *</label>
      <input
        type="email"
        id="email"
        v-model="email"
        placeholder="Digite seu e-mail"
        required
      />

      <!-- Senha -->
      <label for="password">Senha *</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Digite sua senha"
        required
      />
      <small class="hint">Mínimo 8 caracteres, incluindo letras e números</small>

      <!-- Telefone -->
      <label for="phone">Telefone *</label>
      <input
        type="tel"
        id="phone"
        v-model="phone"
        placeholder="(00) 00000-0000"
        required
      />

      <!-- CPF -->
      <label for="cpf">CPF *</label>
      <input
        type="text"
        id="cpf"
        v-model="cpf"
        placeholder="000.000.000-00"
        required
      />

      <!-- Data de nascimento -->
      <label for="birthdate">Data de nascimento</label>
      <input type="date" id="birthdate" v-model="birthdate" />

      <!-- Endereço -->
      <label for="address">Endereço</label>
      <input type="text" id="address" v-model="address" placeholder="Rua, número, bairro..." />

      <button type="submit" class="btn">Cadastrar</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "RegisterPage",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      phone: "",
      cpf: "",
      birthdate: "",
      address: "",
    };
  },
  methods: {
    handleRegister() {
      // Validação básica de e-mail e senha
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

      if (!emailRegex.test(this.email)) {
        alert("E-mail inválido!");
        return;
      }

      if (!passwordRegex.test(this.password)) {
        alert("Senha fraca! Use pelo menos 8 caracteres com letras e números.");
        return;
      }

      console.log("Cadastro realizado com sucesso!", {
        name: this.name,
        email: this.email,
        password: this.password,
        phone: this.phone,
        cpf: this.cpf,
        birthdate: this.birthdate,
        address: this.address,
      });
      alert("Cadastro realizado com sucesso!");
    },
  },
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

.page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #3a0ca3, #7209b7, #f72585);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

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

.formRegister {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 40px 50px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  color: #fff;
  width: 400px;
}

.formRegister h1 {
  margin: 0 0 10px;
  font-size: 2em;
  font-weight: 700;
  text-align: center;
}

.formRegister p {
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
  color: #ddd;
}

.formRegister input {
  padding: 15px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.formRegister input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.formRegister input:focus {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 0 2px #f72585;
}

.formRegister label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: -8px;
  color: #f1f1f1;
}

.hint {
  font-size: 11px;
  color: #ffb3d9;
  margin-top: -10px;
  margin-bottom: 5px;
}

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
