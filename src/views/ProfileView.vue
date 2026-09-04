<template>
    <div>
        <h1 class="mb-4">My profile</h1>

        <div v-if="!user" class="alert alert-info">
            Please <RouterLink to="/login">sign in</RouterLink> to see your profile.
        </div>

        <template v-else>
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title mb-1">{{ profile && profile.name }}</h5>
                    <p class="text-muted mb-0">{{ user.email }}</p>
                </div>
            </div>

            <h3 class="mb-3">Borrowed games</h3>
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <p v-else-if="!borrowings.length" class="text-muted">No borrowings yet.</p>
            <table v-else class="table table-bordered mb-4">
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>Borrowed on</th>
                        <th>Return by</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="b in borrowings" :key="b.id">
                        <td>{{ b.gameTitle }}</td>
                        <td>{{ formatDate(b.borrowedAt) }}</td>
                        <td>{{ formatDate(b.returnBy) }}</td>
                        <td>
                            <span v-if="b.returnedAt" class="text-muted">
                                Returned on {{ formatDate(b.returnedAt) }}
                            </span>
                            <span v-else :class="overdue(b) ? 'text-danger' : 'text-success'">
                                {{ overdue(b) ? 'Overdue' : 'On time' }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
    </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue'
    import { useAuthStore } from '@/stores/authStore.js'
    import { listUserBorrowings, isOverdue } from '@/services/borrowings.js'

    const authStore = useAuthStore()

    const borrowings = ref([])
    const error = ref('')

    const user = computed(() => authStore.user)
    const profile = computed(() => authStore.profile)

    watch(
        user,
        async (currentUser) => {
            if (!currentUser) {
                borrowings.value = []
                return
            }
            try {
                borrowings.value = await listUserBorrowings(currentUser.uid)
            } catch (err) {
                error.value = 'Could not load borrowings: ' + err.message
            }
        },
        { immediate: true },
    )

    function formatDate(iso) {
        const d = new Date(iso)
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    function overdue(b) {
        return isOverdue(b)
    }
</script>
