import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
} from 'firebase/firestore'
import { db } from '@/firebase.js'

const borrowingsCollection = collection(db, 'borrowings')
const BORROW_DAYS = 14

function addDays(date, days) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
}

export async function borrowGame(game, userId, userName) {
    const now = new Date()
    const returnBy = addDays(now, BORROW_DAYS)

    await addDoc(borrowingsCollection, {
        gameId: game.id,
        gameTitle: game.title,
        userId,
        userName,
        borrowedAt: now.toISOString(),
        returnBy: returnBy.toISOString(),
        returnedAt: null,
    })
    await updateDoc(doc(db, 'games', game.id), { available: false })
}

export async function listUserBorrowings(userId) {
    const snap = await getDocs(
        query(borrowingsCollection, where('userId', '==', userId), orderBy('borrowedAt', 'desc')),
    )
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export function isOverdue(borrowing) {
    if (borrowing.returnedAt) return false
    return new Date(borrowing.returnBy) < new Date()
}

export async function listActiveBorrowings() {
    const snap = await getDocs(query(borrowingsCollection, where('returnedAt', '==', null)))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function returnBorrowing(borrowingId, gameId) {
    await updateDoc(doc(db, 'borrowings', borrowingId), { returnedAt: new Date().toISOString() })
    await updateDoc(doc(db, 'games', gameId), { available: true })
}
