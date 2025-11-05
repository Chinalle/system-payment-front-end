import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// --- IMPORTAÇÃO DA NOVA PÁGINA ---
import Market from "@/pages/Market.vue"; // A sua nova página de marketplace

// Importações das Views existentes
import Dashboard from "@/pages/Dashboard.vue";
import Login from "@/pages/Login.vue";
import Providers from "@/pages/Providers.vue";
import Agenda from "@/pages/Agenda.vue";
import Finance from "@/pages/Finance.vue"; 
import Register from "@/pages/Register.vue";
import Profile from '@/pages/Profile.vue';


// 💳 NOVAS IMPORTAÇÕES das Views de Pagamento
import Checkout from "@/pages/Checkout.vue";
import PaymentForm from "@/pages/PaymentForm.vue";
import PaymentSuccess from "@/pages/PaymentSuccess.vue";
import PaymentFailure from "@/pages/PaymentFailure.vue";
import BankAccountsCompany from "@/pages/BankAccountsCompany.vue"; 

const routes = [
  // --- ROTA PRINCIPAL VOLTOU AO ORIGINAL ---
  // O fluxo padrão é redirecionar para o login
  {
    path: '/',
    redirect: '/login'
  },
  
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false } 
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresAuth: false } 
  },

  {
    path: "/dashboard", 
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: false } 
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true } // Corrigido 'eta' para 'meta'
  },
  {
    path: "/providers",
    name: "Providers",
    component: Providers,
    meta: { requiresAuth: false } 
  },
  {
    path: "/agenda",
    name: "Agenda",
    component: Agenda,
    meta: { requiresAuth: true } 
  },
  {
    path: "/finance",
    name: "Finance",
    component: Finance,
    meta: { requiresAuth: true } 
  },
  
  {
    path: "/checkout",
    name: "Checkout",
    component: Checkout,
    meta: { requiresAuth: true } 
  },
  {
    path: "/payment",
    name: "PaymentForm",
    component: PaymentForm,
    meta: { requiresAuth: true } 
  },
  {
    path: "/payment-success",
    name: "PaymentSuccess",
    component: PaymentSuccess,
    meta: { requiresAuth: true } 
  },
  {
    path: "/payment-failure",
    name: "PaymentFailure",
    component: PaymentFailure,
    meta: { requiresAuth: true } 
  },
  {
    path: "/bank-accounts-company",
    name: "BankAccountsCompany",
    component: BankAccountsCompany,
    meta: { requiresAuth: true, title: 'Contas Bancárias' }
  },

  // --- NOVA ROTA DO MARKETPLACE (ADICIONADA AO FIM) ---
  {
    path: '/market',
    name: "Market",
    component: Market,
    meta: { requiresAuth: false } // Não requer autenticação
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


// Este bloco 'beforeEach' roda ANTES de CADA mudança de rota.
router.beforeEach((to, from, next) => {
  // Pega a store de autenticação
  const authStore = useAuthStore();

  // Cenário 1: A rota REQUER autenticação (ex: /dashboard)
  // E o usuário NÃO ESTÁ logado
  if (to.meta.requiresAuth === true && !authStore.isLoggedIn) {
    // Redireciona para o login
    next({ name: 'Login' });
  } 
  
  // Cenário 2: A rota NÃO REQUER autenticação (ex: /login, /register)
  // E o usuário JÁ ESTÁ logado
  // --- LÓGICA ATUALIZADA ---
  // Adicionamos "&& to.name !== 'Market'" para permitir que utilizadores logados VEJAM o marketplace
  else if (to.meta.requiresAuth === false && authStore.isLoggedIn && to.name !== 'Market') {
    // Redireciona para o dashboard (evita que o usuário logado veja a tela de login)
    next({ name: 'Dashboard' });
  } 
  
  // Cenário 3: Todos os outros casos (deixa o usuário ir)
  // (Ex: Rota requer auth E usuário está logado)
  // (Ex: Rota não requer auth E usuário não está logado)
  // (Ex: Rota é 'Market' E usuário está logado)
  else {
    next();
  }
});

export default router;

