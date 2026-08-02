<template>
  <div>
    <h1>Catalog</h1>
    <ul>
      <li v-for="game in games" :key="game.id">
        {{ game.title }} |
        {{ game.genre }} |
        {{ game.minPlayers }}-{{ game.maxPlayers }} players |
        {{ game.durationMinutes }} min |
        {{ game.difficulty }} |
        {{ game.available ? 'available' : 'borrowed' }} |
        {{ game.description }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase.js'

const games = ref([])

onMounted(async () => {
  const snapshot = await getDocs(collection(db, 'games'))
  games.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
})
</script>
