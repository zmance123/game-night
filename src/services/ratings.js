import { collection, doc, getDocs, setDoc, updateDoc, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase.js'

function ratingsCollection(gameId) {
    return collection(db, 'games', gameId, 'ratings')
}

export async function listRatings(gameId) {
    const snap = await getDocs(query(ratingsCollection(gameId), orderBy('createdAt', 'desc')))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addRating(gameId, { userId, userName, score, comment }) {
    await setDoc(doc(ratingsCollection(gameId), userId), {
        userId,
        userName,
        score,
        comment,
        createdAt: new Date().toISOString(),
    })
    const all = await getDocs(ratingsCollection(gameId))
    const scores = all.docs.map((d) => d.data().score)
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    await updateDoc(doc(db, 'games', gameId), {
        averageRating: Math.round(avg * 10) / 10,
        ratingCount: scores.length,
    })
}
