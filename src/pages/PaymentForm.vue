<template>
  <div class="payment-page">
    <form @submit.prevent="processPayment" class="payment-form animated-form">
      <h1>Informações do Cartão</h1>
      <p>Insira os dados do seu cartão para finalizar a compra.</p>

      <!-- NOVO: Componente CardDisplay integrado -->
      <div class="card-display-container">
        <CardDisplay :cardData="cardData" />
      </div>

      <div class="form-group">
        <label for="cardName">Nome (como está no cartão)</label>
        <input
          type="text"
          id="cardName"
          v-model="cardData.name"
          placeholder="Ex: JOAO DA SILVA"
        />
      </div>

      <div class="form-group">
        <label for="cardNumber">Número do Cartão</label>
        <input
          type="text"
          id="cardNumber"
          v-model="cardData.number"
          placeholder="0000 0000 0000 0000"
        />
      </div>

      <div class="form-row">
        <div class="form-group half-width">
          <label for="cardExpiry">Validade (MM/AA)</label>
          <input
            type="text"
            id="cardExpiry"
            v-model="cardData.expiry"
            placeholder="MM/AA"
          />
        </div>

        <div class="form-group half-width">
          <label for="cardCvv">CVV</label>
          <input
            type="password"
            id="cardCvv"
            v-model="cardData.cvv"
            placeholder="000"
            maxlength="4"
          />
        </div>
      </div>
      
      <button type="submit" class="btn">Pagar R$ 199,90</button>
      
    </form>
  </div>
</template>

<script>
// Importa o componente CardDisplay (assumindo que está em src/components/CardDisplay.vue)
import CardDisplay from '../components/CardDisplay.vue'; 

export default {
  name: "PaymentForm",
  // Adiciona o componente à lista de componentes
  components: { CardDisplay }, 
  data() {
    return {
      cardData: {
        name: "",
        number: "",
        expiry: "",
        cvv: "",
      },
    };
  },
  methods: {
    processPayment() {
      // Usando console.log em vez de alert
      if (this.cardData.number.length < 16) {
        console.error("Número do cartão inválido!");
        return;
      }
      
      // Simulação: Após 2 segundos, redireciona para a página de sucesso
      console.log("Processando pagamento...", this.cardData);
      setTimeout(() => {
        this.$router.push("/payment-success"); 
      }, 2000);
    },
  },
};
</script>

<style scoped>
/* Reutilize e adapte o CSS do LoginPage para manter a consistência */
.payment-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #1e1e2d; /* Cor de fundo escura */
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Ajuste o espaçamento geral */
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 40px 50px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  color: #fff;
  width: 400px; /* Um pouco mais largo que o login */
}

.form-group {
    display: flex;
    flex-direction: column; 
    gap: 8px;
}

.form-row {
    display: flex;
    gap: 20px; /* Espaço entre os campos de validade e CVV */
}

.half-width {
    flex: 1; /* Faz com que Validade e CVV dividam o espaço igualmente */
}

/* Estilos de input, label, h1, p e btn do seu código anterior */
.payment-form input {
  padding: 15px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 100%; 
}

.payment-form label {
  font-size: 13px;
  font-weight: 500;
  color: #e2e8f0;
}

.btn {
  /* Mantenha o estilo do botão Cadastrar/Entrar */
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

/* Removido o estilo do placeholder obsoleto */
.card-display-placeholder {
    display: none; 
}

/* Estilo para garantir que o CardDisplay ocupe o espaço */
.card-display-container {
    margin-bottom: 20px;
}

/* Adicione as animações .animated-form aqui se quiser */
</style>
