<template>
    <div>
        <RouterLink to="/events" class="btn btn-link p-0 mb-3">&laquo; Back to events</RouterLink>

        <div v-if="loading" class="text-center text-muted py-5">Loading...</div>

        <div v-else-if="event">
            <h1 class="mb-1">{{ event.title }}</h1>
            <p class="text-muted">{{ formatDate(event.date) }} at {{ event.time }}</p>

            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="text-muted text-uppercase">Capacity</h6>
                            <p class="h4 mb-0">{{ event.registered }} / {{ event.capacity }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-muted text-uppercase mb-1">Your registration</h6>
                                <p class="mb-0">
                                    <template v-if="!user">Sign in to register.</template>
                                    <template v-else-if="registered">You are signed up.</template>
                                    <template v-else>Not registered yet.</template>
                                </p>
                            </div>
                            <button
                                v-if="user"
                                class="btn"
                                :class="registered ? 'btn-outline-danger' : 'btn-primary'"
                                @click="toggleRegistration"
                                :disabled="
                                    busy || (!registered && event.registered >= event.capacity)
                                "
                            >
                                {{ registered ? 'Cancel' : 'Register' }}
                            </button>
                        </div>
                        <div v-if="response.message" class="card-footer bg-white">
                            <span :class="response.error ? 'text-danger' : 'text-success'">{{
                                response.message
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <h4 class="mb-3">Games for this night</h4>
            <ul class="list-group mb-4">
                <li v-for="g in event.games" :key="g" class="list-group-item">{{ g }}</li>
            </ul>
        </div>

        <div v-else class="alert alert-warning">Event not found.</div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { getEvent, registerForEvent, cancelRegistration } from '@/services/events.js'
    import { useAuthStore } from '@/stores/authStore.js'

    const route = useRoute()
    const authStore = useAuthStore()

    const loading = ref(true)
    const event = ref(null)
    const busy = ref(false)
    const response = ref({ error: false, message: '' })

    const user = computed(() => authStore.user)

    const registered = computed(() => {
        if (!user.value || !event.value || !event.value.attendees) return false
        return event.value.attendees.includes(user.value.uid)
    })

    async function load() {
        loading.value = true
        event.value = await getEvent(route.params.id)
        loading.value = false
    }

    onMounted(load)

    function formatDate(iso) {
        const d = new Date(iso)
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    async function toggleRegistration() {
        if (!user.value) return
        busy.value = true
        response.value.message = ''
        try {
            if (registered.value) {
                await cancelRegistration(event.value.id, user.value.uid)
            } else {
                await registerForEvent(event.value.id, user.value.uid)
            }
            await load()
        } catch (error) {
            response.value.error = true
            response.value.message = 'Could not change registration: ' + error.message
        } finally {
            busy.value = false
        }
    }
</script>
