<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">Game Night</RouterLink>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/catalog">Catalog</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/events">Events</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/admin">Admin</RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav">
          <template v-if="user">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/profile">{{ profileName }}</RouterLink>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" @click.prevent="signOut">Logout</a>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">Login</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/register">Register</RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore.js'
  import { RouterLink } from 'vue-router'

  const router = useRouter()
  const authStore = useAuthStore()

  const user = computed(() => authStore.user)
  const profileName = computed(() => (authStore.profile && authStore.profile.name) || 'Profile')

  async function signOut() {
    await authStore.logout()
    router.push('/')
  }
</script>