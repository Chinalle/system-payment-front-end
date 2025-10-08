<template>
  <div class="success-page">
    <div class="success-box animated-box">
      <svg class="check-icon" viewBox="0 0 24 24">
        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
      </svg>
      <h1>Pagamento Concluído com Sucesso!</h1>
      <p>Obrigado pela sua compra. Seu pedido foi confirmado e será processado.</p>
      <button @click="goToDashboard" class="btn">Voltar para o Dashboard</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentSuccess',
  methods: {
    goToDashboard() {
      // Redireciona o usuário para a página inicial
      this.$router.push('/'); 
    }
  }
}
</script>

<style scoped>
.success-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1e1e2d; /* Fundo escuro */
}

.success-box {
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
  color: #4CAF50; /* Cor verde para sucesso */
}

p {
  font-size: 16px;
  margin-bottom: 30px;
  color: #a0aec0;
}

.check-icon {
  fill: #4CAF50; /* Verde */
  width: 60px;
  height: 60px;
}

.btn {
  /* Mantendo o estilo do botão azul que você já usa */
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
}

/* Você pode adicionar a animação que já tem para o .animated-box aqui */
.animated-box {
  /* ... estilos de animação ... */
}
</style>