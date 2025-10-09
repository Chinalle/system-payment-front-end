import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "@/pages/Dashboard.vue";
import Login from "@/pages/Login.vue"; // ✅ tela de login oficial
import Register from "@/components/Register.vue";
import Providers from "@/pages/Providers.vue";
import Agenda from "@/pages/Agenda.vue";

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
    path: "/register",
    name: "Register",
    component: Register,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
