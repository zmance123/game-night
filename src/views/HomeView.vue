<template>
    <div>
        <div v-if="response.error" class="alert alert-danger">{{ response.message }}</div>

        <div class="jumbotron py-4 mb-4">
            <h1 class="display-5">Game Night</h1>
            <p class="lead">A place where board games meet good company.</p>
            <RouterLink class="btn btn-primary" to="/events">See upcoming nights</RouterLink>
        </div>

        <div class="row">
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="card-body text-center">
                        <h6 class="text-muted text-uppercase mb-2">Games in catalog</h6>
                        <p class="display-4 mb-0">{{ gamesInCatalog }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <h3 class="mb-3">Most popular games</h3>
                <p v-if="!popularGames.length" class="text-muted">No ratings yet.</p>
                <div v-else class="list-group mb-4">
                    <RouterLink
                        v-for="game in popularGames"
                        :key="game.id"
                        :to="{ name: 'game-detail', params: { id: game.id } }"
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                        <span>{{ game.title }}</span>
                        <span class="badge badge-primary badge-pill"
                            >{{ game.averageRating.toFixed(1) }} / 5</span
                        >
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { listGames } from '@/services/games.js'
    import { useResponse } from '@/composables/useResponse.js'

    const { response, setError } = useResponse()

    const gamesInCatalog = ref(0)
    const popularGames = ref([])

    onMounted(async () => {
        try {
            const games = await listGames()

            gamesInCatalog.value = games.length

            popularGames.value = games
                .filter((g) => g.averageRating)
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 5)
        } catch (err) {
            setError('Could not load home page data: ', err)
        }
    })
</script>
