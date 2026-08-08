import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase.js'

const gamesCollection = collection(db, 'games')

export async function listGames() {
  const snap = await getDocs(query(gamesCollection, orderBy('title')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}