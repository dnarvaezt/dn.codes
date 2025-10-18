import { Condition, Season, TimeOfDay } from "./weather.enum"
import { WeatherMetrics, WeatherScenario } from "./weather.model"

export function buildWeatherScenario(metrics: WeatherMetrics): WeatherScenario {
  const season = determineSeason(metrics.dt, metrics.coordinates.latitude)
  const timeOfDay = determineTimeOfDay(metrics.dt, metrics.sys.sunrise, metrics.sys.sunset)
  const condition = determineCondition(metrics)

  return {
    season,
    timeOfDay,
    condition,
  }
}

function determineSeason(timestamp: number, latitude: number): Season {
  const date = new Date(timestamp * 1000)
  const month = date.getMonth() + 1 // 1-12

  return latitude >= 0 ? getNorthernHemisphereSeason(month) : getSouthernHemisphereSeason(month)
}

function getNorthernHemisphereSeason(month: number): Season {
  if (month >= 3 && month <= 5) return Season.Spring
  if (month >= 6 && month <= 8) return Season.Summer
  if (month >= 9 && month <= 11) return Season.Autumn
  return Season.Winter
}

function getSouthernHemisphereSeason(month: number): Season {
  if (month >= 3 && month <= 5) return Season.Autumn
  if (month >= 6 && month <= 8) return Season.Winter
  if (month >= 9 && month <= 11) return Season.Spring
  return Season.Summer
}

function determineTimeOfDay(timestamp: number, sunrise: number, sunset: number): TimeOfDay {
  const timePeriods = calculateTimePeriods(sunrise, sunset)

  for (const period of timePeriods) {
    if (timestamp >= period.start && timestamp < period.end) {
      return period.timeOfDay
    }
  }

  return TimeOfDay.Night
}

function calculateTimePeriods(sunrise: number, sunset: number) {
  const hour = 3600
  const threeHours = 10800
  const fiveHours = 18000
  const twoHours = 7200
  const fourHours = 14400

  return [
    { start: sunrise - hour, end: sunrise + hour, timeOfDay: TimeOfDay.Dawn },
    { start: sunrise + hour, end: sunrise + threeHours, timeOfDay: TimeOfDay.Morning },
    { start: sunrise + threeHours, end: sunrise + fiveHours, timeOfDay: TimeOfDay.Morning },
    { start: sunrise + fiveHours, end: sunset - fiveHours, timeOfDay: TimeOfDay.Noon },
    { start: sunset - fiveHours, end: sunset - threeHours, timeOfDay: TimeOfDay.Afternoon },
    { start: sunset - threeHours, end: sunset - hour, timeOfDay: TimeOfDay.Afternoon },
    { start: sunset - hour, end: sunset + hour, timeOfDay: TimeOfDay.Sunset },
    { start: sunset + hour, end: sunset + twoHours, timeOfDay: TimeOfDay.Dusk },
    { start: sunset + twoHours, end: sunset + fourHours, timeOfDay: TimeOfDay.Dusk },
    { start: sunset + fourHours, end: sunrise - hour, timeOfDay: TimeOfDay.Midnight },
    { start: sunset + fourHours, end: sunrise - hour, timeOfDay: TimeOfDay.Night },
  ]
}

function determineCondition(metrics: WeatherMetrics): Condition {
  const { weather, main, clouds, wind, rain, snow, visibility } = metrics

  // Check precipitation conditions first
  const precipitationCondition = checkPrecipitationConditions(rain, snow, wind, weather)
  if (precipitationCondition) return precipitationCondition

  // Check atmospheric conditions
  const atmosphericCondition = checkAtmosphericConditions(visibility, wind)
  if (atmosphericCondition) return atmosphericCondition

  // Check cloud and temperature conditions
  return checkCloudAndTemperatureConditions(clouds.all, main.temp, main.humidity)
}

function checkPrecipitationConditions(
  rain: any,
  snow: any,
  wind: any,
  weather: any[]
): Condition | null {
  if (snow && (snow.oneHour || snow.threeHours)) {
    return Condition.Snowy
  }

  if (rain && (rain.oneHour || rain.threeHours)) {
    return isStormCondition(wind) ? Condition.Stormy : Condition.Rainy
  }

  const weatherDescription = weather[0]?.description.toLowerCase() || ""
  if (weatherDescription.includes("hail")) {
    return Condition.Hailing
  }

  return null
}

function isStormCondition(wind: any): boolean {
  return wind.speed > 15 || (wind.gust && wind.gust > 20)
}

function checkAtmosphericConditions(visibility: number, wind: any): Condition | null {
  if (visibility < 1000) return Condition.Foggy
  if (wind.speed > 10) return Condition.Windy
  return null
}

function checkCloudAndTemperatureConditions(
  cloudCoverage: number,
  temperature: number,
  humidity: number
): Condition {
  if (cloudCoverage < 25) {
    if (temperature > 30) return Condition.Hot
    if (temperature < 5) return Condition.Cold
    return Condition.Clear
  }

  if (cloudCoverage < 50) return Condition.PartlyCloudy
  if (cloudCoverage < 75) return Condition.Cloudy

  if (humidity > 80) return Condition.Humid
  if (humidity < 30) return Condition.Dry

  return Condition.Cloudy
}
