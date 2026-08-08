<template>
    <div class="card h-100">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title mb-1">{{ game.title }}</h5>
                <span class="badge badge-light">{{ game.genre }}</span>
            </div>
            <p class="text-muted small mb-2">
                {{ game.minPlayers }}-{{ game.maxPlayers }} players · {{ game.durationMinutes }} min · {{ game.difficulty }}
            </p>
            <p class="card-text">{{ game.description }}</p>
        </div>    
    </div>
</template>

<script setup>
defineProps({
  game: { type: Object, required: true }
})
</script>