/**
 * Generador de números pseudoaleatorios basado en semilla mejorado
 * Para generar valores estables, determinísticos y más variados
 */
export class SeededRandom {
  private readonly seed: number
  private state: number

  constructor(seed: number) {
    this.seed = seed
    // Mezclar la semilla inicial para mayor variación
    this.state = this.mixSeed(seed)
  }

  private mixSeed(seed: number): number {
    // Algoritmo de mezcla más robusto (MurmurHash3 inspired)
    let h = seed
    h ^= h >>> 16
    h = Math.imul(h, 0x85ebca6b)
    h ^= h >>> 13
    h = Math.imul(h, 0xc2b2ae35)
    h ^= h >>> 16
    return h >>> 0 // Convertir a unsigned 32-bit
  }

  next(): number {
    // Linear Congruential Generator mejorado con más variación
    this.state = (this.state * 1664525 + 1013904223) >>> 0
    // Aplicar transformación para mejor distribución
    const normalized = this.state / 0x100000000
    // Aplicar función de mezcla adicional para mayor aleatoriedad
    return this.mixFloat(normalized)
  }

  private mixFloat(value: number): number {
    // Función de mezcla para mejorar la distribución
    value = (value * 9301 + 49297) % 233280
    value = (value * 1103515245 + 12345) >>> 0
    return (value / 0x100000000) % 1
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max)
  }

  nextFloat(min: number, max: number): number {
    return min + this.next() * (max - min)
  }

  // Método adicional para generar valores más dispersos
  nextGaussian(mean: number = 0, stdDev: number = 1): number {
    // Box-Muller transform para distribución normal
    if (this.spare !== undefined) {
      const result = this.spare * stdDev + mean
      this.spare = undefined
      return result
    }

    const u = this.next()
    const v = this.next()
    const mag = stdDev * Math.sqrt(-2 * Math.log(u))
    this.spare = mag * Math.cos(2 * Math.PI * v)
    return mag * Math.sin(2 * Math.PI * v) + mean
  }

  private spare?: number
}

/**
 * Genera valores aleatorios estables basados en una semilla
 * @param seed - Semilla para la generación
 * @param index - Índice para variar la semilla
 * @returns Objeto con funciones de generación aleatoria
 */
export const createStableRandom = (seed: number, index: number = 0) => {
  const seededRandom = new SeededRandom(seed + index)
  return {
    random: () => seededRandom.next(),
    int: (max: number) => seededRandom.nextInt(max),
    float: (min: number, max: number) => seededRandom.nextFloat(min, max),
    gaussian: (mean: number = 0, stdDev: number = 1) => seededRandom.nextGaussian(mean, stdDev),
    // Función para generar variación más dispersa
    scattered: (min: number, max: number, spread: number = 0.3) => {
      const center = (min + max) / 2
      const range = max - min
      const gaussian = seededRandom.nextGaussian(0, spread)
      const value = center + (gaussian * range) / 2
      return Math.max(min, Math.min(max, value))
    },
  }
}

export type StableRandomGen = ReturnType<typeof createStableRandom>

export const generateStableArray = <T>(
  seed: number,
  count: number,
  factory: (random: StableRandomGen, index: number) => T
): T[] => {
  const result: T[] = []
  for (let i = 0; i < count; i++) {
    result.push(factory(createStableRandom(seed, i), i))
  }
  return result
}

/**
 * Genera una semilla estable y más variada basada en el clima actual
 * @param weather - Datos del clima
 * @param weatherType - Tipo de clima
 * @returns Semilla numérica estable con mayor variación
 */
export const generateWeatherSeed = (
  weather: {
    main: { temp: number; humidity: number; pressure: number }
    clouds: { all: number }
    wind?: { speed: number; deg: number }
  } | null,
  weatherType: string
): number => {
  if (!weather) {
    // Semilla base más variada para casos sin clima
    return Math.floor(Date.now() / 1000) % 1000000
  }

  // Crear semilla basada en múltiples factores del clima
  const temp = Math.round(weather.main.temp * 10) / 10 // Mantener un decimal
  const humidity = weather.main.humidity
  const pressure = Math.round(weather.main.pressure / 10) // Menos redondeo para más variación
  const cloudCoverage = weather.clouds.all
  const windSpeed = weather.wind?.speed || 0
  const windDirection = weather.wind?.deg || 0

  // Algoritmo de hash más robusto para mayor variación
  let seed = 0

  // Usar operaciones de bit shifting para mejor distribución
  seed ^= Math.floor(temp * 100) << 16
  seed ^= humidity << 12
  seed ^= pressure << 8
  seed ^= cloudCoverage << 4
  seed ^= Math.floor(windSpeed * 10) << 2
  seed ^= Math.floor(windDirection / 10)

  // Agregar variación temporal para evitar patrones repetitivos
  const timeFactor = Math.floor(Date.now() / (1000 * 60 * 5)) // Cambia cada 5 minutos
  seed ^= timeFactor

  // Agregar variación basada en el tipo de clima con hash mejorado
  const typeHash = weatherType.split("").reduce((acc, char, index) => {
    return acc + (char.charCodeAt(0) << index % 8)
  }, 0)
  seed ^= typeHash

  // Aplicar función de mezcla final
  seed = (seed * 1103515245 + 12345) >>> 0
  seed = (seed * 1664525 + 1013904223) >>> 0

  return Math.abs(seed) % 2147483647 // Usar rango más grande para mejor distribución
}
