<template>
    <AppNavbar />
    <main class="container py-4">
        <RouterView />
    </main>
</template>

<script setup>
    import { RouterView } from 'vue-router'
    import AppNavbar from '@/components/AppNavbar.vue'
</script>
