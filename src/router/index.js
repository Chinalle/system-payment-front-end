import { createRouter, createWebHistory } from "vue-router";

// Importações das Views existentes
import Dashboard from "@/pages/Dashboard.vue";
import Login from "@/pages/Login.vue";
import Providers from "@/pages/Providers.vue";
import Agenda from "@/pages/Agenda.vue";
import Finance from "@/pages/Finance.vue"; 
import Register from "@/pages/Register.vue";


// 💳 NOVAS IMPORTAÇÕES das Views de Pagamento
import Checkout from "@/pages/Checkout.vue";
import PaymentForm from "@/pages/PaymentForm.vue";
import PaymentSuccess from "@/pages/PaymentSuccess.vue";
import PaymentFailure from "@/pages/PaymentFailure.vue";

const routes = [
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
    meta: { requiresAuth: true } 
  },
  {
    path: "/providers",
    name: "Providers",
    component: Providers,
    meta: { requiresAuth: true } 
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;