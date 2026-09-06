import { ref } from 'vue'

export function useResponse() {
    const response = ref({ error: false, message: '' })

    function setSuccess(message) {
        response.value = { error: false, message }
    }

    function setError(prefix, err) {
        response.value = { error: true, message: prefix + err.message }
    }

    function clear() {
        response.value = { error: false, message: '' }
    }

    return { response, setSuccess, setError, clear }
}
