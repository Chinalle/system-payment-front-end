<template>
  <div class="flex justify-center items-center min-h-screen p-4">
    <form
      @submit.prevent="register"
      class="bg-gray-800/90 backdrop-blur-md p-10 rounded-3xl w-full max-w-xl shadow-2xl space-y-6 border border-gray-700"
    >
      <h1 class="text-4xl font-bold text-center mb-6 text-white">Cadastro</h1>

      <!-- Campos obrigatórios e opcionais -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Nome completo -->
        <div class="col-span-2 relative">
          <label class="block mb-2 font-semibold text-white text-lg">Nome completo *</label>
          <input
            type="text"
            v-model.trim="form.name"
            @input="validateName"
            placeholder="Digite seu nome"
            class="w-full p-4 text-lg rounded-xl bg-gray-700 text-white border focus:border-blue-500 focus:outline-none transition"
          />
          <span class="absolute right-3 top-10 text-gray-400 text-sm" title="Informe seu nome completo">?</span>
          <p v-if="errors.name" class="text-red-400 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <!-- E-mail -->
        <div class="col-span-2 relative">
          <label class="block mb-2 font-semibold text-white text-lg">E-mail *</label>
          <input
            type="email"
            v-model.trim="form.email"
            @input="validateEmail"
            placeholder="exemplo@dominio.com"
            class="w-full p-4 text-lg rounded-xl bg-gray-700 text-white border focus:border-blue-500 focus:outline-none transition"
          />
          <span class="absolute right-3 top-10 text-gray-400 text-sm" title="Informe um e-mail válido">?</span>
          <p v-if="errors.email" class="text-red-400 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Senha -->
        <div class="relative">
          <label class="block mb-2 font-semibold text-white text-lg">Senha *</label>
          <input
            type="password"
            v-model="form.password"
            @input="validatePassword"
            placeholder="Min. 8 caracteres"
            class="w-full p-4 text-lg rounded-xl bg-gray-700 text-white border focus:border-blue-500 focus:outline-none transition"
          />
          <span class="absolute right-3 top-10 text-gray-400 text-sm" title="Use pelo menos 8 caracteres, 1 maiúscula, 1 número e 1 símbolo">?</span>
          <div class="h-2 mt-2 w-full bg-gray-600 rounded-full">
            <div
              :class="passwordStrengthClass"
              :style="{ width: passwordStrength + '%' }"
              class="h-2 rounded-full transition-all"
            ></div>
          </div>
          <p v-if="errors.password" class="text-red-400 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <!-- Telefone -->
        <div class="relative">
          <label class="block mb-2 font-semibold text-white text-lg">Telefone *</label>
          <input
            type="tel"
            v-model="form.phone"
            @input="formatPhone"
            placeholder="(XX) XXXXX-XXXX"
            class="w-full p-4 text-lg rounded-xl bg-gray-700 text-white border focus:border-blue-500 focus:outline-none transition"
          />
          <span class="absolute right-3 top-10 text-gray-400 text-sm" title="Informe seu telefone com DDD">?</span>
          <p v-if="errors.phone" class="text-red-400 text-sm mt-1">{{ errors.phone }}</p>
        </div>

        <!-- CPF -->
        <div class="relative">
          <label class="block mb-2 font-semibold text-white text-lg">CPF *</label>
          <input
            type="text"
            v-model="form.cpf"
            @input="formatCPF"
            maxlength="14"
            placeholder="XXX.XXX.XXX-XX"
            class="w-full p-4 text-lg rounded-xl bg-gray-700 text-white border focus:border-blue-500 focus:outline-none transition"
          />
          <span class="absolute right-3 top-10 text-gray-400 text-sm" title="Informe seu CPF válido">?</span>
          <p v-if="errors.cpf" class="text-red-400 text-sm mt-1">{{ errors.cpf }}</p>
        </div>

        <!-- Data de nascimento -->
        <div>
          <label class="block mb-2 font-semibold text-white text-lg">Data de nascimento</label>
          <input
            type="date"
            v-model="form.birthDate"
            class="w-full p-4 text-lg rounded-xl bg-gray-700 text-white border focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        <!-- Endereço dividido -->
        <div class="col-span-2">
          <label class="block mb-2 font-semibold text-white text-lg">Endereço</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              v-model="form.address.street"
              placeholder="Rua"
              class="w-full p-4 text-lg rounded-xl bg-gray-700 text-white border focus:border-blue-500 focus:outline-none transition"
            />

            <input
              type="text"
              v-model="form.address.number"
              placeholder="Número"
              class="w-full p-4 text-lg rounded-xl bg-gray-700 text-white border focus:border-blue-500 focus:outline-none transition"
            />

            <input
              type="text"
              v-model="form.address.neighborhood"
              placeholder="Bairro"
              class="w-full p-4 text-lg rounded-xl bg-gray-700 text-white border focus:border-blue-500 focus:outline-none transition"
            />

            <input
              type="text"
              v-model="form.address.city"
              placeholder="Cidade"
              class="w-full p-4 text-lg rounded-xl bg-gray-700 text-white border focus:border-blue-500 focus:outline-none transition"
            />

            <input
              type="text"
              v-model="form.address.state"
              placeholder="Estado"
              class="w-full p-4 text-lg rounded-xl bg-gray-700 text-white border focus:border-blue-500 focus:outline-none transition"
            />

            <input
              type="text"
              v-model="form.address.zip"
              placeholder="CEP"
              class="w-full p-4 text-lg rounded-xl bg-gray-700 text-white border focus:border-blue-500 focus:outline-none transition"
            />
          </div>
        </div>

      </div>

      <!-- Botão de cadastro -->
      <button
        type="submit"
        class="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 py-4 rounded-xl font-bold shadow-lg text-lg transition-all transform hover:scale-105"
      >
        Cadastrar
      </button>

      <p v-if="successMessage" class="text-green-400 text-center mt-2 text-lg">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        phone: "",
        cpf: "",
        birthDate: "",
        address: {
          street: "",
          number: "",
          neighborhood: "",
          city: "",
          state: "",
          zip: "",
        },
      },
      errors: {
        name: "",
        email: "",
        password: "",
        phone: "",
        cpf: "",
      },
      successMessage: "",
      passwordStrength: 0,
    };
  },
  computed: {
    passwordStrengthClass() {
      if (this.passwordStrength < 40) return "bg-red-500";
      if (this.passwordStrength < 70) return "bg-yellow-400";
      return "bg-green-500";
    },
  },
  methods: {
    validateName() {
      this.errors.name = this.form.name.length < 3 ? "Nome muito curto" : "";
    },
    validateEmail() {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.errors.email = !re.test(this.form.email) ? "E-mail inválido" : "";
    },
    validatePassword() {
      const pwd = this.form.password;
      const reStrong = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      const reMedium = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      this.errors.password = !reStrong.test(pwd) ? "Senha fraca" : "";

      if (!pwd) {
        this.passwordStrength = 0;
      } else if (reStrong.test(pwd)) {
        this.passwordStrength = 100;
      } else if (reMedium.test(pwd)) {
        this.passwordStrength = 60;
      } else {
        this.passwordStrength = 30;
      }
    },
    formatPhone() {
      let v = this.form.phone.replace(/\D/g, "");
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
      } else {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
      }
      this.form.phone = v;
      this.errors.phone = v.length < 14 ? "Telefone incompleto" : "";
    },
    formatCPF() {
      let v = this.form.cpf.replace(/\D/g, "");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      this.form.cpf = v;
      this.errors.cpf = v.length < 14 ? "CPF incompleto" : "";
    },
    register() {
      // Validar tudo
      this.validateName();
      this.validateEmail();
      this.validatePassword();
      this.formatPhone();
      this.formatCPF();

      const hasErrors = Object.values(this.errors).some((e) => e !== "");
      if (hasErrors) return;

      console.log("Cadastro enviado:", this.form);
      this.successMessage = "Cadastro realizado! Verifique seu e-mail para confirmação.";

      this.form = {
        name: "",
        email: "",
        password: "",
        phone: "",
        cpf: "",
        birthDate: "",
        address: {
          street: "",
          number: "",
          neighborhood: "",
          city: "",
          state: "",
          zip: "",
        },
      };
      this.passwordStrength = 0;
    },
  },
};
</script>

<style scoped>
input {
  transition: border-color 0.2s, box-shadow 0.2s;
}
</style>
