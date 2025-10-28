import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import { IMaskDirective } from 'vue-imask';

createApp(App).use(createPinia()).use(router).directive('imask', IMaskDirective).mount('#app')
/*const app = createApp(App)

app.use(router)
app.directive('maska', vMaska);

app.mount('#app')*/
