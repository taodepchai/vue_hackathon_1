import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../components/userManagerment/Dashboard.vue";
import ManagerUser from "../components/userManagerment/ManagerUser.vue";
import ManagerProduct from "../components/userManagerment/ManagerProduct.vue";

const routes = [
  { path: "/admin", component: Dashboard },
  { path: "/admin/manager-user", component: ManagerUser },
  { path: "/admin/manager-product", component: ManagerProduct },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
