import { createRouter, createWebHistory } from "vue-router";

// importando suas páginas
import Dashboard from "@/pages/Dashboard.vue";
import Clients from "@/pages/Clients.vue";
import Providers from "@/pages/Providers.vue";
import Finance from "@/pages/Finance.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/clients",
    name: "Clients",
    component: Clients,
  },
  {
    path: "/providers",
    name: "Providers",
    component: Providers,
  },
  {
    path: "/finance",
    name: "Finance",
    component: Finance,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
