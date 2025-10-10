import { useEffect, useState } from "react"

/**
 * Hook para debounce que retarda la ejecución de un valor hasta que no haya cambios por un tiempo determinado
 * @param value - El valor a debounce
 * @param delay - El delay en milisegundos (default: 300ms)
 * @returns El valor con debounce aplicado
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
