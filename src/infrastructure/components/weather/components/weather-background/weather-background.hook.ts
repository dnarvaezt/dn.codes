import { useMemo } from "react"

import type { WeatherInfo } from "@/application/domain/weather"

export const useWeatherBackground = (weather: WeatherInfo | null) => {
  const getSeason = useMemo(() => {
    if (!weather) return "spring"

    const temp = weather.main.temp
    const month = new Date().getMonth()

    if (temp > 25) return "summer"
    if (temp < 5) return "winter"
    if (month >= 2 && month <= 4) return "spring"
    if (month >= 8 && month <= 10) return "autumn"
    return temp > 15 ? "spring" : "autumn"
  }, [weather])

  const getTimeOfDay = useMemo(() => {
    if (!weather) return { isNight: false, isDawn: false, isDusk: false }

    const currentHour = new Date().getHours()
    // Usar datos de la API del clima para determinar si es de noche
    // Esto es más estable que usar Date.now() durante el render
    const isActuallyNight = currentHour < 6 || currentHour > 18
    const isNight = isActuallyNight
    const isDawn = currentHour >= 5 && currentHour <= 7
    const isDusk = currentHour >= 18 && currentHour <= 20

    return { isNight, isDawn, isDusk }
  }, [weather])

  const getRainType = useMemo(() => {
    if (!weather) return null

    const mainWeather = weather.weather[0]?.main.toLowerCase()
    const description = weather.weather[0]?.description.toLowerCase()
    const { isNight } = getTimeOfDay

    if (mainWeather === "rain" || mainWeather === "drizzle") {
      if (description.includes("heavy")) {
        return isNight ? "heavy-rain-night" : "heavy-rain"
      }
      return isNight ? "rainy-night" : "rainy"
    }

    return null
  }, [weather, getTimeOfDay])

  const getSnowType = useMemo(() => {
    if (!weather) return null

    const mainWeather = weather.weather[0]?.main.toLowerCase()
    const description = weather.weather[0]?.description.toLowerCase()
    const { isNight } = getTimeOfDay

    if (mainWeather === "snow") {
      if (description.includes("heavy")) {
        return isNight ? "heavy-snow-night" : "heavy-snow"
      }
      return isNight ? "snowy-night" : "snowy"
    }

    return null
  }, [weather, getTimeOfDay])

  const getPrecipitationType = useMemo(() => {
    if (!weather) return "default"

    const mainWeather = weather.weather[0]?.main.toLowerCase()
    const { isNight } = getTimeOfDay

    if (mainWeather === "thunderstorm") {
      return isNight ? "stormy-night" : "stormy"
    }

    const rainType = getRainType
    if (rainType) return rainType

    const snowType = getSnowType
    if (snowType) return snowType

    if (mainWeather === "mist" || mainWeather === "fog" || mainWeather === "haze") {
      return isNight ? "foggy-night" : "foggy"
    }

    return null
  }, [weather, getTimeOfDay, getRainType, getSnowType])

  const getClearWeatherType = useMemo(() => {
    if (!weather) return "default"

    const { isNight, isDawn, isDusk } = getTimeOfDay
    const season = getSeason

    if (isDawn) return "dawn"
    if (isDusk) return "dusk"
    if (isNight) return "clear-night"

    if (season === "summer") return "summer-sunny"
    if (season === "winter") return "winter-clear"
    if (season === "spring") return "spring-sunny"
    if (season === "autumn") return "autumn-sunny"

    return "sunny"
  }, [weather, getSeason, getTimeOfDay])

  const getCloudyWeatherType = useMemo(() => {
    if (!weather) return "cloudy"

    const description = weather.weather[0]?.description.toLowerCase()
    const { isNight } = getTimeOfDay
    const season = getSeason

    if (description.includes("few") || description.includes("scattered")) {
      if (isNight) return "partly-cloudy-night"
      if (season === "summer") return "summer-cloudy"
      if (season === "winter") return "winter-cloudy"
      return "partly-cloudy"
    }

    if (isNight) return "cloudy-night"
    if (season === "summer") return "summer-overcast"
    if (season === "winter") return "winter-overcast"
    return "cloudy"
  }, [weather, getSeason, getTimeOfDay])

  const getExtremeWeatherType = useMemo(() => {
    if (!weather) return null

    const temp = weather.main.temp

    if (temp > 35) return "hot"
    if (temp < -10) return "freezing"
    if (weather.wind.speed > 15) return "windy"

    return null
  }, [weather])

  const getWeatherType = useMemo(() => {
    if (!weather) return "default"

    const mainWeather = weather.weather[0]?.main.toLowerCase()

    // Verificar condiciones de precipitación primero
    const precipitationType = getPrecipitationType
    if (precipitationType) return precipitationType

    // Verificar condiciones extremas
    const extremeType = getExtremeWeatherType
    if (extremeType) return extremeType

    // Condiciones específicas por estación
    if (mainWeather === "clear") {
      return getClearWeatherType
    }

    if (mainWeather === "clouds") {
      return getCloudyWeatherType
    }

    return "cloudy"
  }, [
    weather,
    getPrecipitationType,
    getClearWeatherType,
    getCloudyWeatherType,
    getExtremeWeatherType,
  ])

  const shouldShowRain = useMemo(() => {
    if (!weather) return false
    const mainWeather = weather.weather[0]?.main.toLowerCase()
    return mainWeather === "rain" || mainWeather === "drizzle" || mainWeather === "thunderstorm"
  }, [weather])

  const shouldShowSnow = useMemo(() => {
    if (!weather) return false
    const mainWeather = weather.weather[0]?.main.toLowerCase()
    return mainWeather === "snow"
  }, [weather])

  const shouldShowClouds = useMemo(() => {
    if (!weather) return false
    const mainWeather = weather.weather[0]?.main.toLowerCase()
    return (
      mainWeather === "clouds" ||
      mainWeather === "rain" ||
      mainWeather === "drizzle" ||
      mainWeather === "thunderstorm"
    )
  }, [weather])

  return {
    weatherType: getWeatherType,
    shouldShowRain,
    shouldShowSnow,
    shouldShowClouds,
    season: getSeason,
    timeOfDay: getTimeOfDay,
  }
}
