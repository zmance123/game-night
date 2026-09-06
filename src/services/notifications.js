import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
} from 'firebase/firestore'
import { db } from '@/firebase.js'
import { listUserBorrowings, isOverdue } from '@/services/borrowings.js'
import { formatDate } from '@/utils/dateUtils.js'

const notificationsCollection = collection(db, 'notifications')

function overdueMessage(borrowing) {
    return `"${borrowing.gameTitle}" was due on ${formatDate(borrowing.returnBy)}. Please return it.`
}

export async function syncOverdueNotifications(userId) {
    const borrowings = await listUserBorrowings(userId)

    for (const borrowing of borrowings.filter(isOverdue)) {
        const notificationRef = doc(notificationsCollection, borrowing.id)
        const existing = await getDoc(notificationRef)
        if (existing.exists()) continue

        await setDoc(notificationRef, {
            userId,
            message: overdueMessage(borrowing),
            createdAt: new Date().toISOString(),
            read: false,
        })
    }
}

export async function listNotifications(userId) {
    const snap = await getDocs(query(notificationsCollection, where('userId', '==', userId)))
    return snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function markAsRead(notificationId) {
    await updateDoc(doc(db, 'notifications', notificationId), { read: true })
}
