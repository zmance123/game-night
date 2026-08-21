<template>
    <form @submit.prevent="submit">
        <h2>Login</h2>
        <hr />

        <input v-model="email" type="email" placeholder="Email..." />
        <input v-model="password" type="password" placeholder="Password..." />

        <button type="submit">Log in</button>

        <span v-if="error">{{ error }}</span>
    </form>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/authStore.js'

    const router = useRouter()
    const authStore = useAuthStore()

    const email = ref('')
    const password = ref('')
    const error = ref('')

    async function submit() {
        error.value = ''
        try {
            await authStore.login(email.value, password.value)
            router.push('/')
        } catch (err) {
            error.value = err.message
        }
    }
</script>
