<template>
  <Navbar />
  <main class="container py-4">
    <RouterView />
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
</script>
