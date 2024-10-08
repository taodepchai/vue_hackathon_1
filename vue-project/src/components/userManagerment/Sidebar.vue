<template>
  <div class="sidebar">
    <ul>
      <li @click="navigateTo('/admin')" :class="{ active: isActive('/admin') }">Dashboard</li>
      <li @click="navigateTo('/admin/manager-user')" :class="{ active: isActive('/admin/manager-user') }">Manager User</li>
      <li @click="navigateTo('/admin/manager-product')" :class="{ active: isActive('/admin/manager-product') }">Manager Product</li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};

const isActive = (path) => {
  return router.currentRoute.value.path === path;
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #333;
  color: white;
  height: 100vh;
  padding: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px;
  cursor: pointer;
}

li.active {
  background-color: #555; 
}

li:hover {
  background-color: #444; 
}
</style>
