// Ucitavanje potrebnih funkcija
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase konfiguracija
const firebaseConfig = {
    apiKey: 'AIzaSyCSn-W0FqmCUcMFlyshjeCvqgLj0HNuyJM',
    authDomain: 'game-night-8fdf1.firebaseapp.com',
    projectId: 'game-night-8fdf1',
    storageBucket: 'game-night-8fdf1.firebasestorage.app',
    messagingSenderId: '1011095720421',
    appId: '1:1011095720421:web:accd98bc45008b31645f0c',
}

// Firebase inicijalizacija
const app = initializeApp(firebaseConfig)

// Inicijalizacija servisa
const auth = getAuth(app)
const db = getFirestore(app)

// Izvoz servisa
export { auth, db }
