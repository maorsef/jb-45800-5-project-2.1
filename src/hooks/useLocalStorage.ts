import { useState } from 'react'

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key)

    return item
      ? (JSON.parse(item) as T)
      : initialValue
  })

  const setValue = (value: T) => {
    setStoredValue(value)

    localStorage.setItem(
      key,
      JSON.stringify(value)
    )
  }

  return [storedValue, setValue]
}

export default useLocalStorage