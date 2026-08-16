import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    orderBy,
    arrayUnion,
    arrayRemove,
    increment
} from 'firebase/firestore'
import { db } from '@/firebase.js'

const eventsCollection = collection(db, 'events')

export async function listEvents() {
    const snap = await getDocs(query(eventsCollection, orderBy('date')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getEvent(id) {
    const snap = await getDoc(doc(db, 'events', id))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() }
}

export async function registerForEvent(eventId, userId) {
    await updateDoc(doc(db, 'events', eventId), {
        attendees: arrayUnion(userId),
        registered: increment(1)
    })
}

export async function cancelRegistration(eventId, userId) {
    await updateDoc(doc(db, 'events', eventId), {
        attendees: arrayRemove(userId),
        registered: increment(-1)
    })
}
