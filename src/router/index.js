import { createRouter, createWebHistory } from "vue-router";

// Importações das Views existentes
import Dashboard from "@/pages/Dashboard.vue";
import Login from "@/pages/Login.vue";
import Providers from "@/pages/Providers.vue";
import Agenda from "@/pages/Agenda.vue";
import Finance from "@/pages/Finance.vue"; 

// 💳 NOVAS IMPORTAÇÕES das Views de Pagamento
import Checkout from "@/pages/Checkout.vue";
import PaymentForm from "@/pages/PaymentForm.vue";
import PaymentSuccess from "@/pages/PaymentSuccess.vue";
import PaymentFailure from "@/pages/PaymentFailure.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/providers",
    name: "Providers",
    component: Providers,
  },
  {
    path: "/agenda",
    name: "Agenda",
    component: Agenda,
  },
  {
    path: "/finance",
    name: "Finance",
    component: Finance,
  },

  // 💳 NOVAS ROTAS DE PAGAMENTO
  {
    path: "/checkout",
    name: "Checkout",
    component: Checkout,
  },
  {
    path: "/payment",
    name: "PaymentForm",
    component: PaymentForm,
  },
  {
    path: "/payment-success",
    name: "PaymentSuccess",
    component: PaymentSuccess,
  },
  {
    path: "/payment-failure",
    name: "PaymentFailure",
    component: PaymentFailure,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;