<template>
  <div class="animated-bg"></div>
</template>

<style scoped>
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(-45deg, #0f172a, #1e293b, #334155, #1e293b);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
}

/* Animação de transição suave */
@keyframes gradientAnimation {
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
</style>
