/**
 * Generador de números pseudoaleatorios basado en semilla
 * Para generar valores estables y determinísticos
 */
export class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max)
  }

  nextFloat(min: number, max: number): number {
    return min + this.next() * (max - min)
  }
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
  }
}

/**
 * Genera una semilla estable basada en el clima actual
 * @param weather - Datos del clima
 * @param weatherType - Tipo de clima
 * @returns Semilla numérica estable
 */
export const generateWeatherSeed = (
  weather: {
    main: { temp: number; humidity: number; pressure: number }
    clouds: { all: number }
  } | null,
  weatherType: string
): number => {
  if (!weather) return 12345

  // Crear semilla basada en datos del clima que cambian poco
  const temp = Math.round(weather.main.temp)
  const humidity = weather.main.humidity
  const pressure = Math.round(weather.main.pressure / 100) // Redondear para estabilidad
  const cloudCoverage = weather.clouds.all

  // Combinar valores para crear una semilla única pero estable
  let seed = temp * 1000 + humidity * 100 + pressure * 10 + cloudCoverage

  // Agregar variación basada en el tipo de clima
  const typeHash = weatherType.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  seed += typeHash

  return Math.abs(seed) % 1000000 // Mantener en rango manejable
}
