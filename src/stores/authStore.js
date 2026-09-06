import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase.js'

export const useAuthStore = defineStore('authStore', () => {
    const user = ref(null)
    const profile = ref(null)

    const isAdmin = computed(() => profile.value && profile.value.role === 'admin')

    const displayName = computed(
        () => (profile.value && profile.value.name) || (user.value && user.value.email) || '',
    )

    onAuthStateChanged(auth, async (currentUser) => {
        user.value = currentUser
        if (currentUser) {
            const snap = await getDoc(doc(db, 'users', currentUser.uid))
            profile.value = snap.exists() ? snap.data() : null
        } else {
            profile.value = null
        }
    })

    async function register(name, email, password) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, 'users', cred.user.uid), {
            name,
            email,
            role: 'user',
            createdAt: new Date().toISOString(),
        })
    }

    async function login(email, password) {
        await signInWithEmailAndPassword(auth, email, password)
    }

    async function logout() {
        await signOut(auth)
    }

    return { user, profile, isAdmin, displayName, register, login, logout }
})
