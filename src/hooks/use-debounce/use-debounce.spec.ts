import { act, renderHook } from "@testing-library/react"
import { useDebounce } from "./use-debounce"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("debe retornar el valor inicial inmediatamente", () => {
    const { result } = renderHook(() => useDebounce("initial", 300))

    expect(result.current).toBe("initial")
  })

  it("debe actualizar el valor después del delay", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 300 },
    })

    expect(result.current).toBe("initial")

    rerender({ value: "updated", delay: 300 })

    // El valor no debe cambiar inmediatamente
    expect(result.current).toBe("initial")

    // Después del delay debe actualizarse
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe("updated")
  })

  it("debe limpiar el timeout anterior cuando el valor cambia", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 300 },
    })

    expect(result.current).toBe("initial")

    // Cambiar el valor múltiples veces rápidamente
    rerender({ value: "update1", delay: 300 })
    rerender({ value: "update2", delay: 300 })
    rerender({ value: "final", delay: 300 })

    // El valor debe seguir siendo el inicial
    expect(result.current).toBe("initial")

    // Después del delay debe tener el último valor
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe("final")
  })

  it("debe usar un delay personalizado", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 500 },
    })

    expect(result.current).toBe("initial")

    rerender({ value: "updated", delay: 500 })

    // Después de 300ms no debe cambiar
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe("initial")

    // Después de 500ms debe cambiar
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe("updated")
  })

  it("debe funcionar con diferentes tipos de datos", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 0, delay: 300 },
    })

    expect(result.current).toBe(0)

    rerender({ value: 42, delay: 300 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe(42)
  })

  it("debe limpiar el timeout al desmontar", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout")
    const { unmount } = renderHook(() => useDebounce("test", 300))

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
