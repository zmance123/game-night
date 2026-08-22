<template>
    <div>
        <div class="jumbotron py-4 mb-4">
            <h1 class="display-5">Game Night</h1>
            <p class="lead">A place where board games meet good company.</p>
            <RouterLink class="btn btn-primary" to="/events">See upcoming nights</RouterLink>
        </div>

        <div class="row mb-4">
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="card-body text-center">
                        <h6 class="text-muted text-uppercase mb-2">Nights held</h6>
                        <p class="display-4 mb-0">{{ stats.nightsHeld }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="card-body text-center">
                        <h6 class="text-muted text-uppercase mb-2">Games in catalog</h6>
                        <p class="display-4 mb-0">{{ stats.gamesInCatalog }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="card-body text-center">
                        <h6 class="text-muted text-uppercase mb-2">Registered visitors</h6>
                        <p class="display-4 mb-0">{{ stats.visitors }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-7">
                <h3 class="mb-3">Most popular games</h3>
                <p v-if="!popularGames.length" class="text-muted">No ratings yet.</p>
                <ul v-else class="list-group mb-4">
                    <li
                        v-for="game in popularGames"
                        :key="game.id"
                        class="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <RouterLink :to="{ name: 'game-detail', params: { id: game.id } }">
                            {{ game.title }}
                        </RouterLink>
                        <span class="badge badge-primary badge-pill"
                            >{{ game.averageRating.toFixed(1) }} / 5</span
                        >
                    </li>
                </ul>
            </div>
            <div class="col-md-5">
                <h3 class="mb-3">Most active visitors</h3>
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
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { collection, getDocs } from 'firebase/firestore'
    import { listGames } from '@/services/games.js'
    import { listEvents } from '@/services/events.js'
    import { db } from '@/firebase.js'

    const stats = ref({
        nightsHeld: 0,
        gamesInCatalog: 0,
        visitors: 0,
    })
    const popularGames = ref([])
    const activeVisitors = ref([])

    onMounted(async () => {
        const [games, events, usersSnap] = await Promise.all([
            listGames(),
            listEvents(),
            getDocs(collection(db, 'users')),
        ])

        const today = new Date().toISOString().slice(0, 10)
        stats.value.gamesInCatalog = games.length
        stats.value.nightsHeld = events.filter((e) => e.date < today).length
        stats.value.visitors = usersSnap.size

        popularGames.value = games
            .filter((g) => g.averageRating)
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 5)

        const counts = {}
        events.forEach((e) => {
            ;(e.attendees || []).forEach((uid) => {
                counts[uid] = (counts[uid] || 0) + 1
            })
        })
        const users = {}
        usersSnap.docs.forEach((d) => {
            users[d.id] = d.data().name
        })
        activeVisitors.value = Object.entries(counts)
            .map(([uid, n]) => ({ id: uid, name: users[uid] || 'Unknown', nightsAttended: n }))
            .sort((a, b) => b.nightsAttended - a.nightsAttended)
            .slice(0, 5)
    })
</script>
