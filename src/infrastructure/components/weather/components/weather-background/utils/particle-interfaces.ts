/**
 * Interfaces centralizadas para el sistema de efectos meteorológicos
 */

/**
 * Interfaz base para todas las partículas meteorológicas
 */
export interface BaseParticle {
  id: number
  left: number
  top: number
  animationDelay: number
  animationDuration: number
}

/**
 * Interfaz específica para nubes
 */
export type CloudParticle = BaseParticle

/**
 * Interfaz específica para gotas de lluvia
 */
export type RainParticle = BaseParticle

/**
 * Interfaz específica para copos de nieve
 */
export type SnowParticle = BaseParticle

/**
 * Interfaz específica para partículas atmosféricas
 */
export interface AtmosphericParticle extends BaseParticle {
  size: string
  opacity: number
}

/**
 * Configuración para generación de partículas
 */
export interface ParticleConfig {
  count: number
  animationDuration: number
  animationDelay: number
}

/**
 * Configuración de rango para posicionamiento
 */
export interface PositionRange {
  left: [number, number]
  top: [number, number]
  delay: [number, number]
}

/**
 * Configuración de opacidad
 */
export interface OpacityConfig {
  base: number
  variation: number
}

/**
 * Datos validados del clima
 */
export interface ValidatedWeatherData {
  windSpeed: number // m/s
  windKmh: number // km/h
  visibility: number // metros
  humidity: number // porcentaje
  pressure: number // hPa
  temperature: number // °C
  cloudCoverage: number // porcentaje
}
