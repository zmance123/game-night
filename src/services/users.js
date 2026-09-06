import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase.js'

const usersCollection = collection(db, 'users')

export async function listUserNames() {
    const snap = await getDocs(usersCollection)
    const names = {}
    snap.docs.forEach((d) => {
        names[d.id] = d.data().name
    })
    return names
}
