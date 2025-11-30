import { useEffect, useRef } from "react"
import type { UseParallaxReturn } from "./use-parallax.interface"

export const useParallax = (): UseParallaxReturn => {
  const parallaxRefs = useRef<Record<string, HTMLElement | null>>({})
  const rafId = useRef<number | null>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const updateParallax = () => {
      const scrollY = window.scrollY || window.pageYOffset

      // Solo actualizar si el scroll cambió significativamente (optimización)
      if (Math.abs(scrollY - lastScrollY.current) < 0.5) {
        rafId.current = requestAnimationFrame(updateParallax)
        return
      }

      lastScrollY.current = scrollY

      // Aplicar parallax directamente al DOM para mejor rendimiento
      Object.keys(parallaxRefs.current).forEach((key) => {
        const element = parallaxRefs.current[key]
        if (element) {
          const speed = parseFloat(element.getAttribute("data-parallax-speed") || "0")
          const translateY = scrollY * speed
          element.style.transform = `translate3d(0, ${translateY}px, 0)`
        }
      })

      rafId.current = requestAnimationFrame(updateParallax)
    }

    // Iniciar el loop de animación
    rafId.current = requestAnimationFrame(updateParallax)

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  const setParallaxRef = (key: string, element: HTMLElement | null, speed: number) => {
    if (element) {
      parallaxRefs.current[key] = element
      element.setAttribute("data-parallax-speed", speed.toString())
      element.style.willChange = "transform"
      element.style.backfaceVisibility = "hidden"
      element.style.transform = "translateZ(0)"
    } else {
      delete parallaxRefs.current[key]
    }
  }

  return {
    setParallaxRef,
  }
}
