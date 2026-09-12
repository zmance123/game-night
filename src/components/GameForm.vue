<template>
    <form @submit.prevent="submit">
        <div class="form-group">
            <label>Title</label>
            <input v-model="form.title" type="text" class="form-control" required />
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" class="form-control" rows="2"></textarea>
        </div>
        <div class="form-row">
            <div class="form-group col-md-6">
                <label>Genre</label>
                <input v-model="form.genre" type="text" class="form-control" required />
            </div>
            <div class="form-group col-md-6">
                <label>Difficulty</label>
                <select v-model="form.difficulty" class="form-control">
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-3">
                <label>Min players</label>
                <input
                    v-model.number="form.minPlayers"
                    type="number"
                    min="1"
                    class="form-control"
                />
            </div>
            <div class="form-group col-md-3">
                <label>Max players</label>
                <input
                    v-model.number="form.maxPlayers"
                    type="number"
                    :min="form.minPlayers"
                    class="form-control"
                />
            </div>
            <div class="form-group col-md-3">
                <label>Duration (min)</label>
                <input
                    v-model.number="form.durationMinutes"
                    type="number"
                    min="1"
                    class="form-control"
                />
            </div>
            <div class="form-group col-md-3 d-flex align-items-end">
                <div class="form-check">
                    <input
                        id="game-available"
                        v-model="form.available"
                        type="checkbox"
                        class="form-check-input"
                    />
                    <label for="game-available" class="form-check-label">Available</label>
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
        description: '',
        genre: '',
        difficulty: 'Medium',
        minPlayers: 2,
        maxPlayers: 4,
        durationMinutes: 60,
        available: true,
    })

    const props = defineProps({
        initial: { type: Object, default: null },
    })

    const emit = defineEmits(['submit', 'cancel'])

    const form = ref(props.initial ? { ...empty(), ...props.initial } : empty())

    const submitLabel = computed(() => (props.initial ? 'Save changes' : 'Add game'))

    function submit() {
        emit('submit', { ...form.value })
    }
</script>
