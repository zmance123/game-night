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

            <h3 class="mb-3">Notifications</h3>
            <p v-if="!notifications.length" class="text-muted">No notifications.</p>
            <ul v-else class="list-group mb-4">
                <li
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="list-group-item d-flex justify-content-between align-items-center"
                >
                    <span :class="{ 'text-muted': notification.read }">
                        {{ notification.message }}
                    </span>
                    <button
                        v-if="!notification.read"
                        class="btn btn-sm btn-outline-primary"
                        @click="markRead(notification)"
                    >
                        Mark as read
                    </button>
                </li>
            </ul>

            <h3 class="mb-3">My events</h3>
            <p v-if="!events.length" class="text-muted">No registered events.</p>
            <div v-else class="list-group mb-4">
                <RouterLink
                    v-for="event in events"
                    :key="event.id"
                    :to="{ name: 'event-detail', params: { id: event.id } }"
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                    <span>{{ event.title }}</span>
                    <span class="text-muted">{{ formatDate(event.date) }} at {{ event.time }}</span>
                </RouterLink>
            </div>

            <h3 class="mb-3">Borrowed games</h3>
            <div v-if="response.error" class="alert alert-danger">{{ response.message }}</div>
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
                            <span v-else :class="isOverdue(b) ? 'text-danger' : 'text-success'">
                                {{ isOverdue(b) ? 'Overdue' : 'On time' }}
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
    import {
        syncOverdueNotifications,
        listNotifications,
        markAsRead,
    } from '@/services/notifications.js'
    import { listUserEvents } from '@/services/events.js'
    import { useResponse } from '@/composables/useResponse.js'
    import { formatDate } from '@/utils/dateUtils.js'

    const authStore = useAuthStore()
    const { response, setError } = useResponse()

    const borrowings = ref([])
    const notifications = ref([])
    const events = ref([])

    const user = computed(() => authStore.user)
    const profile = computed(() => authStore.profile)

    watch(
        user,
        async (currentUser) => {
            if (!currentUser) {
                borrowings.value = []
                notifications.value = []
                events.value = []
                return
            }
            try {
                borrowings.value = await listUserBorrowings(currentUser.uid)
                await syncOverdueNotifications(currentUser.uid)
                notifications.value = await listNotifications(currentUser.uid)
                events.value = await listUserEvents(currentUser.uid)
            } catch (err) {
                setError('Could not load profile data: ', err)
            }
        },
        { immediate: true },
    )

    async function markRead(notification) {
        try {
            await markAsRead(notification.id)
            notification.read = true
        } catch (err) {
            setError('Could not update notification: ', err)
        }
    }
</script>
