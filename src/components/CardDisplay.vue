<template>
  <div class="card-display">
    <div class="chip"></div>
    
    <div class="card-number-display">
      {{ formattedCardNumber || '#### #### #### ####' }}
    </div>

    <div class="card-footer">
      <div class="card-name">
        <label>Nome do Titular</label>
        <div>{{ cardData.name.toUpperCase() || 'NOME COMPLETO' }}</div>
      </div>
      <div class="card-expiry">
        <label>Validade</label>
        <div>{{ cardData.expiry || 'MM/AA' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardDisplay',
  props: {
    // Estas props seriam passadas do PaymentForm.vue
    cardData: {
      type: Object,
      default: () => ({ name: '', number: '', expiry: '' })
    }
  },
  computed: {
    formattedCardNumber() {
      // Simples formatação: agrupa 4 dígitos, substituindo não-dígitos por # ou espaço
      let num = this.cardData.number.replace(/\s+/g, '').padEnd(16, '#');
      return num.replace(/(\d{4})/g, '$1 ').trim();
    }
  }
}
</script>

<style scoped>
.card-display {
  /* Design do cartão */
  width: 100%;
  height: 220px;
  background: linear-gradient(135deg, #1f2937, #374151); /* Gradiente escuro */
  border-radius: 15px;
  padding: 25px;
  color: #fff;
  font-family: 'Space Mono', monospace; /* Fonte monoespaçada para números */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  margin-bottom: 30px;
}

.chip {
  width: 40px;
  height: 30px;
  background: linear-gradient(180deg, #e0c279, #c7a759);
  border-radius: 5px;
  margin-bottom: 20px;
}

.card-number-display {
  font-size: 1.8em;
  letter-spacing: 3px;
  font-weight: 500;
  margin-bottom: 25px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
}

.card-name, .card-expiry {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 10px;
  opacity: 0.7;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.card-name div, .card-expiry div {
  font-size: 1em;
  font-weight: 600;
}
</style>