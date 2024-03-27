import { useState, useEffect } from 'react'

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) : initialValue
    })

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(storedValue))
    }, [key, storedValue])

    const setValue = (value) => {
        setStoredValue(value)
    }

    return [storedValue, setValue]
}

export default useLocalStorage
