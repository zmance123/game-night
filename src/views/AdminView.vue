<template>
    <div>
        <h1 class="mb-4">Admin dashboard</h1>

        <div v-if="!isAdmin" class="alert alert-danger">
            You need administrator rights to view this page.
        </div>

        <template v-else>
            <ul class="nav nav-tabs mb-4">
                <li class="nav-item">
                    <a
                        href="#"
                        class="nav-link"
                        :class="{ active: tab === 'games' }"
                        @click.prevent="tab = 'games'"
                        >Games</a
                    >
                </li>
                <li class="nav-item">
                    <a
                        href="#"
                        class="nav-link"
                        :class="{ active: tab === 'events' }"
                        @click.prevent="tab = 'events'"
                        >Events</a
                    >
                </li>
                <li class="nav-item">
                    <a
                        href="#"
                        class="nav-link"
                        :class="{ active: tab === 'registrations' }"
                        @click.prevent="tab = 'registrations'"
                        >Registrations</a
                    >
                </li>
                <li class="nav-item">
                    <a
                        href="#"
                        class="nav-link"
                        :class="{ active: tab === 'borrowings' }"
                        @click.prevent="tab = 'borrowings'"
                        >Borrowings</a
                    >
                </li>
            </ul>

            <div v-if="tab === 'games'">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="mb-0">Game catalog</h3>
                    <button v-if="!editingGame" class="btn btn-primary" @click="startNewGame">
                        Add game
                    </button>
                </div>

                <div v-if="editingGame" class="card mb-4">
                    <div class="card-body">
                        <h5 class="mb-3">{{ editingGame.id ? 'Edit game' : 'New game' }}</h5>
                        <GameForm
                            :initial="editingGame.id ? editingGame : null"
                            @submit="saveGame"
                            @cancel="editingGame = null"
                        />
                    </div>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Players</th>
                            <th>Duration</th>
                            <th>Available</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="g in games" :key="g.id">
                            <td>{{ g.title }}</td>
                            <td>{{ g.genre }}</td>
                            <td>{{ g.minPlayers }}-{{ g.maxPlayers }}</td>
                            <td>{{ g.durationMinutes }} min</td>
                            <td>{{ g.available ? 'Yes' : 'No' }}</td>
                            <td class="text-right">
                                <button
                                    class="btn btn-sm btn-outline-secondary mr-2"
                                    @click="editingGame = { ...g }"
                                >
                                    Edit
                                </button>
                                <button
                                    class="btn btn-sm btn-outline-danger"
                                    @click="removeGame(g)"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="tab === 'events'">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="mb-0">Game nights</h3>
                    <button v-if="!editingEvent" class="btn btn-primary" @click="startNewEvent">
                        Schedule night
                    </button>
                </div>

                <div v-if="editingEvent" class="card mb-4">
                    <div class="card-body">
                        <h5 class="mb-3">{{ editingEvent.id ? 'Edit night' : 'New night' }}</h5>
                        <EventForm
                            :initial="editingEvent.id ? editingEvent : null"
                            :available-games="games"
                            @submit="saveEvent"
                            @cancel="editingEvent = null"
                        />
                    </div>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Registered</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="e in events" :key="e.id">
                            <td>{{ e.title }}</td>
                            <td>{{ e.date }}</td>
                            <td>{{ e.time }}</td>
                            <td>{{ e.registered || 0 }} / {{ e.capacity }}</td>
                            <td class="text-right">
                                <button
                                    class="btn btn-sm btn-outline-secondary mr-2"
                                    @click="editingEvent = { ...e }"
                                >
                                    Edit
                                </button>
                                <button
                                    class="btn btn-sm btn-outline-danger"
                                    @click="removeEvent(e)"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue'
    import GameForm from '@/components/GameForm.vue'
    import EventForm from '@/components/EventForm.vue'
    import { listGames, createGame, updateGame, deleteGame } from '@/services/games.js'
    import { listEvents, createEvent, updateEvent, deleteEvent } from '@/services/events.js'

    import { useAuthStore } from '@/stores/authStore.js'

    const authStore = useAuthStore()

    const tab = ref('games')
    const games = ref([])
    const events = ref([])
    const editingGame = ref(null)
    const editingEvent = ref(null)

    const isAdmin = computed(() => authStore.isAdmin)

    async function refresh() {
        games.value = await listGames()
        events.value = await listEvents()
    }

    watch(
        isAdmin,
        async (admin) => {
            if (!admin) {
                games.value = []
                return
            }
            await refresh()
        },
        { immediate: true },
    )

    function startNewGame() {
        editingGame.value = {}
    }

    function startNewEvent() {
        editingEvent.value = {}
    }

    async function saveGame(data) {
        if (editingGame.value && editingGame.value.id) {
            await updateGame(editingGame.value.id, data)
        } else {
            await createGame(data)
        }
        editingGame.value = null
        await refresh()
    }

    async function saveEvent(data) {
        if (editingEvent.value && editingEvent.value.id) {
            await updateEvent(editingEvent.value.id, data)
        } else {
            await createEvent(data)
        }
        editingEvent.value = null
        await refresh()
    }

    async function removeGame(g) {
        if (!confirm(`Delete game "${g.title}"?`)) return
        await deleteGame(g.id)
        await refresh()
    }

    async function removeEvent(e) {
        if (!confirm(`Delete night "${e.title}"?`)) return
        await deleteEvent(e.id)
        await refresh()
    }
</script>
