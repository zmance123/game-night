<template>
    <div>
        <RouterLink to="/catalog" class="btn btn-link p-0 mb-3">&laquo; Back to catalog</RouterLink>

        <div v-if="loading" class="text-center text-muted py-5">Loading...</div>

        <div v-else-if="game">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h1 class="mb-1">{{ game.title }}</h1>
                    <span class="badge badge-light mr-2">{{ game.genre }}</span>
                    <span :class="game.available ? 'badge badge-success' : 'badge badge-danger'">
                        {{ game.available ? 'Available' : 'Borrowed' }}
                    </span>
                    <span v-if="game.averageRating" class="ml-2 text-muted">
                        {{ game.averageRating.toFixed(1) }} / 5
                        <small>({{ game.ratingCount || 0 }} ratings)</small>
                    </span>
                </div>
                <button
                    v-if="user"
                    class="btn btn-primary"
                    :disabled="!game.available || busy"
                    @click="borrow"
                >
                    {{ busy ? 'Working...' : 'Borrow' }}
                </button>
                <RouterLink v-else to="/login" class="btn btn-outline-primary"
                    >Sign in to borrow</RouterLink
                >
            </div>

            <span
                v-if="borrowResponse.message"
                :class="borrowResponse.error ? 'text-danger' : 'text-success'"
                >{{ borrowResponse.message }}</span
            >

            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="text-muted text-uppercase">Players</h6>
                            <p class="h4 mb-0">{{ game.minPlayers }}-{{ game.maxPlayers }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="text-muted text-uppercase">Duration</h6>
                            <p class="h4 mb-0">{{ game.durationMinutes }} min</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="text-muted text-uppercase">Difficulty</h6>
                            <p class="h4 mb-0">{{ game.difficulty }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <h4>Description</h4>
            <p>{{ game.description }}</p>

            <hr />

            <h4 class="mb-3">Ratings</h4>

            <div v-if="user" class="card mb-3">
                <div class="card-body">
                    <h6 class="mb-3">Leave a rating</h6>
                    <div class="form-group">
                        <label>Score</label>
                        <select v-model.number="newRating.score" class="form-control">
                            <option v-for="n in 5" :key="n" :value="n">
                                {{ n }} star{{ n > 1 ? 's' : '' }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Comment</label>
                        <textarea
                            v-model="newRating.comment"
                            class="form-control"
                            rows="2"
                            placeholder="A short thought about the game"
                        ></textarea>
                    </div>
                    <button class="btn btn-primary" :disabled="ratingBusy" @click="submitRating">
                        {{ ratingBusy ? 'Posting...' : 'Post rating' }}
                    </button>

                    <span
                        v-if="ratingResponse.message"
                        class="ml-2"
                        :class="ratingResponse.error ? 'text-danger' : 'text-success'"
                        >{{ ratingResponse.message }}</span
                    >
                </div>
            </div>
            <p v-if="!ratings.length" class="text-muted">No ratings yet.</p>
            <div v-for="r in ratings" :key="r.id" class="card mb-2">
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between">
                        <strong>{{ r.userName }}</strong>
                        <span class="text-warning"
                            >{{ '★'.repeat(r.score) }}{{ '☆'.repeat(5 - r.score) }}</span
                        >
                    </div>
                    <p class="mb-0 text-muted">{{ r.comment }}</p>
                </div>
            </div>
        </div>

        <div v-else class="alert alert-warning">Game not found.</div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { getGame } from '@/services/games.js'
    import { borrowGame } from '@/services/borrowings.js'
    import { useAuthStore } from '@/stores/authStore.js'
    import { listRatings, addRating } from '@/services/ratings.js'

    const route = useRoute()
    const authStore = useAuthStore()

    const loading = ref(true)
    const game = ref(null)
    const ratings = ref([])
    const busy = ref(false)
    const user = computed(() => authStore.user)
    const ratingBusy = ref(false)
    const newRating = ref({ score: 5, comment: '' })
    const borrowResponse = ref({ error: false, message: '' })
    const ratingResponse = ref({ error: false, message: '' })

    async function load() {
        loading.value = true
        game.value = await getGame(route.params.id)
        if (game.value) {
            ratings.value = await listRatings(game.value.id)
        }
        loading.value = false
    }

    onMounted(load)

    async function borrow() {
        if (!user.value || !game.value.available) return
        busy.value = true
        borrowResponse.value.message = ''
        try {
            const name = (authStore.profile && authStore.profile.name) || user.value.email
            await borrowGame(game.value, user.value.uid, name)
            game.value.available = false
        } catch (error) {
            borrowResponse.value.error = true
            borrowResponse.value.message = 'Could not borrow: ' + error.message
        } finally {
            busy.value = false
        }
    }

    async function submitRating() {
        if (!user.value) return
        ratingBusy.value = true
        ratingResponse.value.message = ''
        try {
            const name = (authStore.profile && authStore.profile.name) || user.value.email
            await addRating(game.value.id, {
                userId: user.value.uid,
                userName: name,
                score: newRating.value.score,
                comment: newRating.value.comment.trim(),
            })
            newRating.value = { score: 5, comment: '' }
            await load()
        } catch (error) {
            ratingResponse.value.error = true
            ratingResponse.value.message = 'Could not post rating: ' + error.message
        } finally {
            ratingBusy.value = false
        }
    }
</script>
