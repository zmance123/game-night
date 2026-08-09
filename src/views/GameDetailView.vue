<template>
  <div>
    <RouterLink to="/catalog" class="btn btn-link p-0 mb-3">&laquo; Back to catalog</RouterLink>

    <div v-if="loading" class="text-center text-muted py-5">Loading...</div>

    <div v-else-if="game">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h1 class="mb-1">{{ game.title }}</h1>
          <span class="badge badge-light mr-2">{{ game.genre }}</span>
        </div>
      </div>

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
    </div>

    <div v-else class="alert alert-warning">Game not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getGame } from '@/services/games.js'

const route = useRoute()

const loading = ref(true)
const game = ref(null)

async function load() {
  loading.value = true
  game.value = await getGame(route.params.id)
  loading.value = false
}

onMounted(load)

</script>