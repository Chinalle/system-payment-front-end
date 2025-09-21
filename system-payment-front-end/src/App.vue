<template>
  <!-- <login/> -->
   <RegisterPage/>
  <login/>

</template>

<script>
// import login from './components/login.vue'
import RegisterPage from './components/RegisterPage.vue'


export default {
  name: 'App',
  components: {
    // login
    RegisterPage
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
