<template>
    <div class="row justify-content-center">
        <div class="col-md-7 col-lg-5">
            <div class="card">
                <div class="card-body">
                    <h2 class="mb-1">Register</h2>
                    <p class="text-muted small mb-4">
                        Create an account and join the next game night.
                    </p>

                    <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

                    <form @submit.prevent="submit">
                        <div class="form-group">
                            <label for="register-name">Name</label>
                            <input
                                id="register-name"
                                v-model="name"
                                type="text"
                                class="form-control"
                                autocomplete="name"
                                placeholder="Full name"
                                required
                            />
                        </div>
                        <div class="form-group">
                            <label for="register-email">Email</label>
                            <input
                                id="register-email"
                                v-model="email"
                                type="email"
                                class="form-control"
                                autocomplete="email"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div class="form-group">
                            <label for="register-password">Password</label>
                            <input
                                id="register-password"
                                v-model="password"
                                type="password"
                                class="form-control"
                                autocomplete="new-password"
                                minlength="6"
                                required
                            />
                            <small class="form-text text-muted">At least 6 characters.</small>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block" :disabled="busy">
                            {{ busy ? 'Creating account...' : 'Register' }}
                        </button>
                    </form>
                </div>
                <div class="card-footer bg-white text-center">
                    <span class="text-muted small mr-1">Have an account?</span>
                    <RouterLink to="/login">Log in</RouterLink>
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

    const name = ref('')
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const busy = ref(false)

    async function submit() {
        error.value = ''
        busy.value = true
        try {
            await authStore.register(name.value, email.value, password.value)
            router.push('/')
        } catch (err) {
            error.value = err.message
        } finally {
            busy.value = false
        }
    }
</script>
