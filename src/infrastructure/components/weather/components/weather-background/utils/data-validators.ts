/**
 * Utilidades centralizadas para validación y procesamiento de datos meteorológicos
 */

/**
 * Helper para redondear a 3 decimales máximo con validación robusta
 */
export const roundDecimals = (value: number | null | undefined): number => {
  // Manejar casos edge
  if (value === null || value === undefined) return 0
  if (Number.isNaN(value)) return 0
  if (!Number.isFinite(value)) return 0

  return Math.round(value * 1000) / 1000
}

/**
 * Valida y procesa datos del clima de forma consistente
 */
export const validateWeatherData = (weather: {
  wind?: { speed?: number }
  visibility?: number
  main?: { humidity?: number; pressure?: number; temp?: number }
  clouds?: { all?: number }
}) => {
  return {
    windSpeed: roundDecimals(weather?.wind?.speed) || 0, // m/s
    windKmh: roundDecimals((roundDecimals(weather?.wind?.speed) || 0) * 3.6) || 0, // km/h
    visibility: roundDecimals(weather?.visibility) || 10000, // metros
    humidity: roundDecimals(weather?.main?.humidity) || 50, // porcentaje
    pressure: roundDecimals(weather?.main?.pressure) || 1013, // hPa
    temperature: roundDecimals(weather?.main?.temp) || 20, // °C
    cloudCoverage: roundDecimals(weather?.clouds?.all) || 0, // porcentaje
  }
}

/**
 * Valida y normaliza valores de intensidad
 */
export const validateIntensity = (
  intensity: number,
  min: number = 0,
  max: number = 100,
  fallback: number = 20
): number => {
  return Math.max(min, Math.min(max, roundDecimals(intensity) || fallback))
}

/**
 * Valida y normaliza cantidad de partículas
 */
export const validateParticleCount = (
  count: number,
  min: number = 0,
  max: number = 100,
  fallback: number = 10
): number => {
  return Math.max(min, Math.min(max, roundDecimals(count) || fallback))
}

/**
 * Calcula duración base de animación basada en velocidad del viento
 */
export const calculateWindBasedDuration = (
  windKmh: number,
  baseDuration: number,
  maxDuration: number,
  windFactor: number = 1.8
): number => {
  return roundDecimals(
    Math.max(maxDuration, Math.min(baseDuration, baseDuration - windKmh * windFactor))
  )
}

/**
 * Calcula opacidad basada en condiciones atmosféricas
 */
export const calculateAtmosphericOpacity = (
  baseOpacity: number,
  humidity: number,
  visibility: number
): number => {
  const humidityFactor = roundDecimals(humidity / 100) || 0.5
  const visibilityKm = roundDecimals(visibility / 1000) || 10
  const visibilityFactor = roundDecimals(Math.max(0.3, visibilityKm / 10)) || 1

  return roundDecimals(baseOpacity * humidityFactor * visibilityFactor) || baseOpacity
}

/**
 * Calcula intensidad basada en visibilidad y tipo de clima
 */
export const calculateVisibilityBasedIntensity = (
  visibility: number,
  weatherType: string,
  config: {
    baseIntensity: number
    maxIntensity: number
    visibilityThresholds: { threshold: number; intensity: number }[]
    weatherTypeMultipliers: { pattern: string; multiplier: number }[]
  }
): number => {
  const visibilityKm = visibility / 1000
  let intensity = config.baseIntensity

  // Ajustar según visibilidad
  for (const { threshold, intensity: thresholdIntensity } of config.visibilityThresholds) {
    if (visibilityKm < threshold) {
      intensity = thresholdIntensity
      break
    }
  }

  // Ajustar según tipo de clima
  for (const { pattern, multiplier } of config.weatherTypeMultipliers) {
    if (weatherType.includes(pattern)) {
      intensity = Math.max(intensity, multiplier)
      break
    }
  }

  return Math.min(intensity, config.maxIntensity)
}

/**
 * Calcula intensidad atmosférica (partículas) basada en visibilidad y clima
 */
export const calculateAtmosphericIntensity = (visibility: number, weatherType: string): number => {
  return calculateVisibilityBasedIntensity(visibility, weatherType, {
    baseIntensity: 8,
    maxIntensity: 25,
    visibilityThresholds: [
      { threshold: 1, intensity: 25 }, // Niebla densa
      { threshold: 3, intensity: 20 }, // Niebla moderada
      { threshold: 10, intensity: 15 }, // Visibilidad reducida
    ],
    weatherTypeMultipliers: [
      { pattern: "sunny", multiplier: 20 },
      { pattern: "clear", multiplier: 20 },
      { pattern: "stormy", multiplier: 6 },
      { pattern: "rain", multiplier: 8 },
      { pattern: "snow", multiplier: 10 },
      { pattern: "fog", multiplier: 15 },
      { pattern: "windy", multiplier: 15 },
    ],
  })
}

/**
 * Genera datos de partícula con validación consistente
 */
export const createValidatedParticle = (
  random: { float: (min: number, max: number) => number },
  index: number,
  baseConfig: {
    leftRange: [number, number]
    topRange: [number, number]
    delayRange: [number, number]
    opacityBase?: number
    opacityVariation?: number
  }
) => {
  const { leftRange, topRange, delayRange, opacityBase = 0.6, opacityVariation = 0.1 } = baseConfig

  return {
    id: index,
    left: roundDecimals(random.float(leftRange[0], leftRange[1])),
    top: roundDecimals(random.float(topRange[0], topRange[1])),
    animationDelay: roundDecimals(random.float(delayRange[0], delayRange[1])),
    opacity: roundDecimals(opacityBase + random.float(-opacityVariation, opacityVariation)),
  }
}
