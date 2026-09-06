<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="mb-0">Catalog</h1>
            <span class="text-muted">{{ filteredGames.length }} of {{ games.length }} games</span>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="form-row">
                    <div class="form-group col-md-4">
                        <label for="filter-search">Search</label>
                        <input
                            id="filter-search"
                            v-model="filters.search"
                            type="text"
                            class="form-control"
                            placeholder="Game title..."
                        />
                    </div>
                    <div class="form-group col-md-3">
                        <label for="filter-genre">Genre</label>
                        <select id="filter-genre" v-model="filters.genre" class="form-control">
                            <option value="">All genres</option>
                            <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
                        </select>
                    </div>
                    <div class="form-group col-md-3">
                        <label for="filter-players">Players</label>
                        <input
                            id="filter-players"
                            v-model.number="filters.players"
                            type="number"
                            min="1"
                            max="10"
                            class="form-control"
                            placeholder="e.g. 4"
                        />
                    </div>
                    <div class="form-group col-md-2">
                        <label for="filter-duration">Max duration</label>
                        <select
                            id="filter-duration"
                            v-model.number="filters.maxDuration"
                            class="form-control"
                        >
                            <option :value="0">Any</option>
                            <option :value="30">30 min</option>
                            <option :value="60">60 min</option>
                            <option :value="90">90 min</option>
                            <option :value="120">120 min</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="loading" class="text-center text-muted py-5">Loading games...</div>

        <div v-else-if="response.error" class="alert alert-danger">{{ response.message }}</div>

        <div v-else-if="!filteredGames.length" class="alert alert-info">
            No games match the current filters.
        </div>

        <div v-else class="row">
            <div v-for="game in filteredGames" :key="game.id" class="col-md-6 col-lg-4 mb-4">
                <GameCard :game="game" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { listGames } from '@/services/games.js'
    import GameCard from '@/components/GameCard.vue'
    import { useResponse } from '@/composables/useResponse.js'

    const { response, setError } = useResponse()

    const loading = ref(true)
    const games = ref([])
    const filters = ref({
        search: '',
        genre: '',
        players: null,
        maxDuration: 0,
    })

    onMounted(async () => {
        try {
            games.value = await listGames()
        } catch (err) {
            setError('Could not load games: ', err)
        } finally {
            loading.value = false
        }
    })

    const genres = computed(() => {
        const set = new Set(games.value.map((g) => g.genre))
        return Array.from(set).sort()
    })

    const filteredGames = computed(() => {
        const search = filters.value.search.trim().toLowerCase()
        return games.value.filter((game) => {
            if (search && !game.title.toLowerCase().includes(search)) return false
            if (filters.value.genre && game.genre !== filters.value.genre) return false
            if (filters.value.players) {
                const p = filters.value.players
                if (p < game.minPlayers || p > game.maxPlayers) return false
            }
            if (filters.value.maxDuration && game.durationMinutes > filters.value.maxDuration)
                return false
            return true
        })
    })
</script>
