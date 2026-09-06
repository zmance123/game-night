<template>
    <div>
        <h1 class="mb-4">Admin dashboard</h1>

        <div v-if="!isAdmin" class="alert alert-danger">
            You need administrator rights to view this page.
        </div>

        <template v-else>
            <p v-if="response.message" :class="response.error ? 'text-danger' : 'text-success'">
                {{ response.message }}
            </p>

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
                <li class="nav-item">
                    <a
                        href="#"
                        class="nav-link"
                        :class="{ active: tab === 'statistics' }"
                        @click.prevent="tab = 'statistics'"
                        >Statistics</a
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
            <div v-if="tab === 'registrations'">
                <h3 class="mb-3">Registrations per night</h3>
                <div v-for="e in events" :key="e.id" class="card mb-3">
                    <div class="card-body">
                        <h5 class="mb-2">
                            {{ e.title }} <small class="text-muted">- {{ e.date }}</small>
                        </h5>
                        <ul v-if="(e.attendees || []).length" class="mb-0">
                            <li v-for="uid in e.attendees" :key="uid">
                                {{ userName(uid) }}
                            </li>
                        </ul>
                        <p v-else class="mb-0 text-muted">No registrations yet.</p>
                    </div>
                </div>
            </div>

            <div v-if="tab === 'borrowings'">
                <h3 class="mb-3">Active borrowings</h3>
                <p v-if="!borrowings.length" class="text-muted">No active borrowings.</p>
                <table v-else class="table">
                    <thead>
                        <tr>
                            <th>Game</th>
                            <th>Borrower</th>
                            <th>Borrowed on</th>
                            <th>Return by</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="b in borrowings"
                            :key="b.id"
                            :class="{ 'table-danger': overdue(b) }"
                        >
                            <td>{{ b.gameTitle }}</td>
                            <td>{{ b.userName }}</td>
                            <td>{{ formatDate(b.borrowedAt) }}</td>
                            <td>{{ formatDate(b.returnBy) }}</td>
                            <td>
                                <span :class="overdue(b) ? 'text-danger' : 'text-success'">
                                    {{ overdue(b) ? 'Overdue' : 'On time' }}
                                </span>
                            </td>
                            <td class="text-right">
                                <button
                                    class="btn btn-sm btn-outline-primary"
                                    @click="markReturned(b)"
                                >
                                    Mark returned
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="tab === 'statistics'">
                <h3 class="mb-3">Statistics</h3>
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body text-center">
                                <h6 class="text-muted text-uppercase mb-2">Nights held</h6>
                                <p class="display-4 mb-0">{{ nightsHeld }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body text-center">
                                <h6 class="text-muted text-uppercase mb-2">Registered visitors</h6>
                                <p class="display-4 mb-0">{{ visitorCount }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h4 class="mb-3">Most active visitors</h4>
                <p v-if="!activeVisitors.length" class="text-muted">No registrations yet.</p>
                <ul v-else class="list-group">
                    <li
                        v-for="visitor in activeVisitors"
                        :key="visitor.id"
                        class="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <span>{{ visitor.name }}</span>
                        <span class="badge badge-secondary badge-pill"
                            >{{ visitor.nightsAttended }} nights</span
                        >
                    </li>
                </ul>
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
    import { listActiveBorrowings, returnBorrowing, isOverdue } from '@/services/borrowings.js'
    import { collection, getDocs } from 'firebase/firestore'
    import { db } from '@/firebase.js'

    import { useAuthStore } from '@/stores/authStore.js'

    const authStore = useAuthStore()

    const tab = ref('games')
    const games = ref([])
    const events = ref([])
    const borrowings = ref([])
    const editingGame = ref(null)
    const editingEvent = ref(null)
    const users = ref({})
    const response = ref({ error: false, message: '' })

    const isAdmin = computed(() => authStore.isAdmin)

    const nightsHeld = computed(() => {
        const today = new Date().toISOString().slice(0, 10)
        return events.value.filter((e) => e.date < today).length
    })

    const visitorCount = computed(() => Object.keys(users.value).length)

    const activeVisitors = computed(() => {
        const counts = {}
        events.value.forEach((e) => {
            ;(e.attendees || []).forEach((uid) => {
                counts[uid] = (counts[uid] || 0) + 1
            })
        })
        return Object.entries(counts)
            .map(([uid, n]) => ({ id: uid, name: userName(uid), nightsAttended: n }))
            .sort((a, b) => b.nightsAttended - a.nightsAttended)
            .slice(0, 5)
    })

    async function refresh() {
        games.value = await listGames()
        events.value = await listEvents()
        borrowings.value = await listActiveBorrowings()
    }

    async function loadUsers() {
        const snap = await getDocs(collection(db, 'users'))
        const map = {}
        snap.docs.forEach((d) => {
            map[d.id] = d.data().name
        })
        users.value = map
    }

    function userName(uid) {
        return users.value[uid] || uid
    }

    watch(
        isAdmin,
        async (admin) => {
            if (!admin) {
                games.value = []
                events.value = []
                users.value = {}
                return
            }
            await refresh()
            await loadUsers()
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
        try {
            if (editingGame.value && editingGame.value.id) {
                await updateGame(editingGame.value.id, data)
            } else {
                await createGame(data)
            }
            editingGame.value = null
            await refresh()
            response.value.error = false
            response.value.message = 'Game saved.'
        } catch (error) {
            response.value.error = true
            response.value.message = 'Could not save game: ' + error.message
        }
    }

    async function saveEvent(data) {
        try {
            if (editingEvent.value && editingEvent.value.id) {
                await updateEvent(editingEvent.value.id, data)
            } else {
                await createEvent(data)
            }
            editingEvent.value = null
            await refresh()
            response.value.error = false
            response.value.message = 'Night saved.'
        } catch (error) {
            response.value.error = true
            response.value.message = 'Could not save night: ' + error.message
        }
    }

    async function removeGame(g) {
        if (!confirm(`Delete game "${g.title}"?`)) return
        try {
            await deleteGame(g.id)
            await refresh()
            response.value.error = false
            response.value.message = 'Game deleted.'
        } catch (error) {
            response.value.error = true
            response.value.message = 'Could not delete game: ' + error.message
        }
    }

    async function removeEvent(e) {
        if (!confirm(`Delete night "${e.title}"?`)) return
        try {
            await deleteEvent(e.id)
            await refresh()
            response.value.error = false
            response.value.message = 'Night deleted.'
        } catch (error) {
            response.value.error = true
            response.value.message = 'Could not delete night: ' + error.message
        }
    }

    async function markReturned(b) {
        if (!confirm(`Mark "${b.gameTitle}" as returned by ${b.userName}?`)) return
        try {
            await returnBorrowing(b.id, b.gameId)
            await refresh()
            response.value.error = false
            response.value.message = 'Marked as returned.'
        } catch (error) {
            response.value.error = true
            response.value.message = 'Could not mark as returned: ' + error.message
        }
    }

    function overdue(b) {
        return isOverdue(b)
    }

    function formatDate(iso) {
        const d = new Date(iso)
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }
</script>
