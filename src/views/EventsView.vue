<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="mb-0">Upcoming events</h1>
        </div>

        <div v-if="loading" class="text-center text-muted py-5">Loading events...</div>

        <div v-else-if="!events.length" class="alert alert-info">No upcoming events.</div>

        <div v-else>
            <div v-for="event in events" :key="event.id" class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h4 class="card-title mb-1">{{ event.title }}</h4>
                            <p class="text-muted mb-2">
                                {{ formatDate(event.date) }} at {{ event.time }}
                            </p>
                            <p class="mb-1">
                                <strong>Games:</strong>
                                <span v-for="(g, i) in event.games" :key="g">
                                    {{ g }}<span v-if="i < event.games.length - 1">, </span>
                                </span>
                            </p>
                            <p class="mb-0 text-muted small">
                                {{ event.registered }} of {{ event.capacity }} seats taken
                            </p>
                        </div>
                        <RouterLink
                            :to="{ name: 'event-detail', params: { id: event.id } }"
                            class="btn btn-outline-primary"
                            >Details</RouterLink
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { listEvents } from '@/services/events.js'

    const loading = ref(true)
    const events = ref([])

    onMounted(async () => {
        events.value = await listEvents()
        loading.value = false
    })

    function formatDate(iso) {
        const d = new Date(iso)
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }
</script>
