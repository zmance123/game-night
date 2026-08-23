import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    arrayUnion,
    arrayRemove,
    increment,
} from 'firebase/firestore'
import { db } from '@/firebase.js'

const eventsCollection = collection(db, 'events')

export async function listEvents() {
    const snap = await getDocs(query(eventsCollection, orderBy('date')))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getEvent(id) {
    const snap = await getDoc(doc(db, 'events', id))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() }
}

export async function registerForEvent(eventId, userId) {
    await updateDoc(doc(db, 'events', eventId), {
        attendees: arrayUnion(userId),
        registered: increment(1),
    })
}

export async function cancelRegistration(eventId, userId) {
    await updateDoc(doc(db, 'events', eventId), {
        attendees: arrayRemove(userId),
        registered: increment(-1),
    })
}

export async function createEvent(data) {
    const ref = await addDoc(eventsCollection, { ...data, registered: 0, attendees: [] })
    return ref.id
}

export async function updateEvent(id, data) {
    await updateDoc(doc(db, 'events', id), data)
}

export async function deleteEvent(id) {
    await deleteDoc(doc(db, 'events', id))
}
