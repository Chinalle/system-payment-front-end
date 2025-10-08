<template>
  <div class="checkout-page">
    <div class="checkout-container animated-box">
      <h1>Finalizar Compra</h1>
      <p class="description">Revise seu pedido e escolha o método de pagamento.</p>

      <div class="summary-card">
        <h2>Seu Pedido</h2>
        <div class="item-line">
          <span>Serviço Agendado</span>
          <span>R$ 170,00</span>
        </div>
        <div class="item-line">
          <span>Taxa de Serviço</span>
          <span>R$ 29,90</span>
        </div>
        <div class="divider"></div>
        <div class="item-line total">
          <strong>Total a Pagar</strong>
          <strong>R$ 199,90</strong>
        </div>
      </div>

      <div class="payment-options">
        <h2>Escolha o Pagamento</h2>
        
        <label class="payment-option-label" @click="selectPayment('card')">
          <input type="radio" name="payment-method" value="card" v-model="selectedMethod">
          <span class="custom-radio"></span>
          Pagamento com Cartão de Crédito/Débito
        </label>
        
        <label class="payment-option-label" @click="selectPayment('pix')" :class="{ 'disabled': true }">
          <input type="radio" name="payment-method" value="pix" v-model="selectedMethod" disabled>
          <span class="custom-radio"></span>
          PIX (Em Breve)
        </label>
      </div>

      <button 
        @click="proceedToPayment" 
        class="btn" 
        :disabled="selectedMethod !== 'card'">
        Ir para Pagamento
      </button>

      <a @click.prevent="$router.go(-1)" class="back-link" href="#">
        ← Voltar
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Checkout',
  data() {
    return {
      selectedMethod: null, // 'card', 'pix', etc.
    };
  },
  methods: {
    selectPayment(method) {
      if (method === 'pix') {
        // Apenas para simular que PIX está desativado
        this.selectedMethod = null;
        alert("O pagamento via PIX estará disponível em breve!");
      } else {
        this.selectedMethod = method;
      }
    },
    
    proceedToPayment() {
      if (this.selectedMethod === 'card') {
        // Redireciona para o formulário de cartão
        this.$router.push('/payment');
      } else {
        alert('Por favor, selecione um método de pagamento.');
      }
    }
  }
}
</script>

<style scoped>
.checkout-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1e1e2d; 
}

.checkout-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 40px 50px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  color: #fff;
  width: 450px; /* Um pouco mais largo para o resumo */
}

h1 {
  font-size: 2em;
  font-weight: 700;
  text-align: center;
  margin-bottom: 5px;
}

.description {
  font-size: 14px;
  text-align: center;
  margin-bottom: 15px;
  color: #a0aec0;
}

/* --- Resumo do Pedido --- */
.summary-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 10px;
}

.summary-card h2 {
  font-size: 1.1em;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 15px;
  color: #e2e8f0;
}

.item-line {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin-bottom: 10px;
  color: #a0aec0;
}

.item-line span:last-child {
    font-weight: 600;
    color: #fff;
}

.divider {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 15px 0;
}

.item-line.total {
  font-size: 1.2em;
  color: #93c5fd; /* Cor do link, ou outra cor de destaque */
}

.item-line.total strong {
  font-weight: 700;
  color: #93c5fd;
}

/* --- Opções de Pagamento --- */
.payment-options {
    gap: 15px;
}

.payment-options h2 {
    font-size: 1.1em;
    font-weight: 600;
    margin-bottom: 15px;
    color: #e2e8f0;
}

.payment-option-label {
  display: flex;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 10px;
}

.payment-option-label:hover {
  background: rgba(255, 255, 255, 0.1);
}

.payment-option-label.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.payment-option-label input {
    /* Esconder o radio button nativo */
    display: none;
}

/* Estilo do botão radio customizado */
.custom-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #a0aec0;
  margin-right: 15px;
  display: inline-block;
  position: relative;
  transition: all 0.2s;
}

.payment-option-label input:checked + .custom-radio {
  border-color: #3b82f6;
}

.payment-option-label input:checked + .custom-radio::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3b82f6;
  position: absolute;
  top: 4px;
  left: 4px;
}

/* --- Botão Principal --- */
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
  width: 100%;
}

.btn:disabled {
    background: #4a5568;
    cursor: not-allowed;
    opacity: 0.7;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

.back-link {
    text-align: center;
    font-size: 13px;
    color: #93c5fd;
    transition: color 0.3s;
    margin-top: 5px;
    cursor: pointer;
}
</style>