import { WeatherRepository, WeatherRepositoryOpenWeatherMap } from "./weather.repository"

import type { Weather } from "./weather.model"

export const weatherRepository: WeatherRepository<Weather> = new WeatherRepositoryOpenWeatherMap()
