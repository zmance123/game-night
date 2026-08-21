<template>
    <div class="card h-100">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title mb-1">{{ game.title }}</h5>
                <span class="badge badge-light">{{ game.genre }}</span>
            </div>
            <p class="text-muted small mb-2">
                {{ game.minPlayers }}-{{ game.maxPlayers }} players · {{ game.durationMinutes }} min
                · {{ game.difficulty }}
            </p>
            <p class="card-text">{{ game.description }}</p>
        </div>
        <div class="card-footer bg-white d-flex justify-content-between align-items-center">
            <span v-if="game.averageRating" class="text-muted small">
                {{ game.averageRating.toFixed(1) }} / 5 ({{ game.ratingCount || 0 }})
            </span>
            <span v-else class="text-muted small">No ratings</span>
            <RouterLink
                :to="{ name: 'game-detail', params: { id: game.id } }"
                class="btn btn-sm btn-outline-primary"
                >Details</RouterLink
            >
        </div>
    </div>
</template>

<script setup>
    defineProps({
        game: { type: Object, required: true },
    })
</script>
