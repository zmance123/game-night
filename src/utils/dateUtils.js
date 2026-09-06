export function formatDate(iso) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function todayIso() {
    return new Date().toISOString().slice(0, 10)
}

export function addDays(date, days) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
}
