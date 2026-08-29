import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/catalog',
            name: 'catalog',
            component: () => import('../views/CatalogView.vue'),
        },
        {
            path: '/catalog/:id',
            name: 'game-detail',
            component: () => import('../views/GameDetailView.vue'),
        },
        {
            path: '/events',
            name: 'events',
            component: () => import('../views/EventsView.vue'),
        },
        {
            path: '/events/:id',
            name: 'event-detail',
            component: () => import('../views/EventDetailView.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue'),
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('../views/AdminView.vue'),
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../views/ProfileView.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('../views/NotFoundView.vue'),
        },
    ],
})

export default router
