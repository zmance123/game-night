import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase.js'

const gamesCollection = collection(db, 'games')

export async function listGames() {
  const snap = await getDocs(query(gamesCollection, orderBy('title')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getGame(id) {
  const snap = await getDoc(doc(db, 'games', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}