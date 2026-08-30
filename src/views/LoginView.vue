<template>
    <div class="row justify-content-center">
        <div class="col-md-7 col-lg-5">
            <div class="card">
                <div class="card-body">
                    <h2 class="mb-1">Login</h2>
                    <p class="text-muted small mb-4">
                        Sign in to borrow games and join game nights.
                    </p>

                    <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

                    <form @submit.prevent="submit">
                        <div class="form-group">
                            <label for="login-email">Email</label>
                            <input
                                id="login-email"
                                v-model="email"
                                type="email"
                                class="form-control"
                                autocomplete="email"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input
                                id="login-password"
                                v-model="password"
                                type="password"
                                class="form-control"
                                autocomplete="current-password"
                                required
                            />
                        </div>
                        <button type="submit" class="btn btn-primary btn-block" :disabled="busy">
                            {{ busy ? 'Logging in...' : 'Log in' }}
                        </button>
                    </form>
                </div>
                <div class="card-footer bg-white text-center">
                    <span class="text-muted small mr-1">No account?</span>
                    <RouterLink to="/register">Register</RouterLink>
                </div>
            </div>
        </div>
    </div>
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
    const busy = ref(false)

    async function submit() {
        error.value = ''
        busy.value = true
        try {
            await authStore.login(email.value, password.value)
            router.push('/')
        } catch (err) {
            error.value = err.message
        } finally {
            busy.value = false
        }
    }
</script>
