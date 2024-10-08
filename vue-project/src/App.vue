<template>
  <div id="app">
    <Sidebar />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "./components/userManagerment/Sidebar.vue"
</script>

<style>
#app {
  display: flex;
}

.content {
  width: 1650px;
  padding: 20px;
}
</style>
