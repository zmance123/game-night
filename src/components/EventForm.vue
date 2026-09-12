<template>
    <form @submit.prevent="submit">
        <div class="form-group">
            <label>Title</label>
            <input v-model="form.title" type="text" class="form-control" required />
        </div>
        <div class="form-row">
            <div class="form-group col-md-4">
                <label>Date</label>
                <input v-model="form.date" type="date" class="form-control" required />
            </div>
            <div class="form-group col-md-4">
                <label>Time</label>
                <input v-model="form.time" type="time" class="form-control" required />
            </div>
            <div class="form-group col-md-4">
                <label>Capacity</label>
                <input
                    v-model.number="form.capacity"
                    type="number"
                    min="1"
                    class="form-control"
                    required
                />
            </div>
        </div>
        <div class="form-group">
            <label>Games</label>
            <div class="row">
                <div v-for="g in availableGames" :key="g.id" class="col-md-6 col-lg-4 mb-1">
                    <div class="form-check">
                        <input
                            :id="'event-game-' + g.id"
                            v-model="form.games"
                            type="checkbox"
                            :value="g.id"
                            class="form-check-input"
                        />
                        <label :for="'event-game-' + g.id" class="form-check-label">{{
                            g.title
                        }}</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-link" @click="$emit('cancel')">Cancel</button>
            <button type="submit" class="btn btn-primary">{{ submitLabel }}</button>
        </div>
    </form>
</template>

<script setup>
    import { ref, computed } from 'vue'

    const empty = () => ({
        title: '',
        date: '',
        time: '19:00',
        capacity: 10,
        games: [],
    })

    const props = defineProps({
        initial: { type: Object, default: null },
        availableGames: { type: Array, default: () => [] },
    })

    const emit = defineEmits(['submit', 'cancel'])

    function toGameId(entry) {
        if (typeof entry === 'string') {
            const match = props.availableGames.find((g) => g.title === entry)
            return match ? match.id : null
        }
        return entry.id
    }

    const base = empty()
    const form = ref(
        props.initial
            ? {
                  ...base,
                  ...props.initial,
                  games: (props.initial.games || []).map(toGameId).filter(Boolean),
              }
            : base,
    )

    const submitLabel = computed(() => (props.initial ? 'Save changes' : 'Schedule event'))

    function submit() {
        const games = props.availableGames
            .filter((g) => form.value.games.includes(g.id))
            .map((g) => ({ id: g.id, title: g.title }))
        emit('submit', { ...form.value, games })
    }
</script>
