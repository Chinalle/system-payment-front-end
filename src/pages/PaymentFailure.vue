<template>
  <div class="failure-page">
    <div class="failure-box animated-box">
      <svg class="fail-icon" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <h1>Falha no Pagamento</h1>
      <p>Ocorreu um erro ao processar seu pagamento. Por favor, verifique seus dados ou tente outro método.</p>
      
      <div class="actions">
        <button @click="retryPayment" class="btn btn-primary">Tentar Novamente</button>
        <button @click="contactSupport" class="btn btn-secondary">Entrar em Contato</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentFailure',
  methods: {
    retryPayment() {
      // Redireciona o usuário de volta para o formulário de pagamento
      this.$router.push('/payment'); 
    },
    contactSupport() {
      // Aqui você pode adicionar um link ou lógica para o suporte
      alert('Entrando em contato com o suporte...');
    }
  }
}
</script>

<style scoped>
.failure-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1e1e2d; /* Fundo escuro */
}

.failure-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 50px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  color: #fff;
  width: 400px;
}

h1 {
  font-size: 1.8em;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #f56565; /* Cor vermelha para falha */
}

p {
  font-size: 16px;
  margin-bottom: 30px;
  color: #a0aec0;
}

.fail-icon {
  fill: #f56565; /* Vermelho */
  width: 60px;
  height: 60px;
}

.actions {
    display: flex;
    gap: 15px;
    width: 100%;
    justify-content: center;
}

.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  flex: 1; /* Permite que os botões dividam o espaço */
}

.btn-primary {
  /* Botão principal (Tentar Novamente) */
  background: linear-gradient(135deg, #2563eb, #3b82f6);
}

.btn-secondary {
    /* Botão secundário (Entrar em Contato) */
    background: transparent;
    border: 1px solid #3b82f6;
    color: #3b82f6;
}

.btn-secondary:hover {
    background: rgba(59, 130, 246, 0.1);
}

/* Você pode adicionar a animação .animated-box aqui se quiser */
</style>