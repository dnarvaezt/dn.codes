import { create } from "zustand"
import {
  DefaultWeatherVisibilityStrategy,
  WeatherContext,
  WeatherTypeService,
  WeatherVisibilityService,
} from "./utils"

import type { WeatherInfo } from "@/application/domain/weather"

type WeatherBackgroundState = {
  weatherType: string
  weatherContext: WeatherContext | null
  shouldShowRain: boolean
  shouldShowSnow: boolean
  shouldShowClouds: boolean
  shouldShowThunder: boolean

  computeFromWeather: (weather: WeatherInfo | null) => void
}

class WeatherBackgroundStoreManager {
  private readonly weatherTypeService: WeatherTypeService
  private readonly weatherVisibilityService: WeatherVisibilityService

  constructor() {
    this.weatherTypeService = new WeatherTypeService()
    this.weatherVisibilityService = new WeatherVisibilityService(
      new DefaultWeatherVisibilityStrategy()
    )
  }

  computeState(weather: WeatherInfo | null): Omit<WeatherBackgroundState, "computeFromWeather"> {
    const weatherType = this.weatherTypeService.getWeatherType(weather)
    const weatherContext = this.weatherTypeService.getWeatherContext(weather)
    const visibilityFlags = this.weatherVisibilityService.getVisibilityFlags(weather)

    return {
      weatherType,
      weatherContext,
      ...visibilityFlags,
    }
  }

  getServices() {
    return {
      weatherTypeService: this.weatherTypeService,
      weatherVisibilityService: this.weatherVisibilityService,
    }
  }
}

const storeManager = new WeatherBackgroundStoreManager()

export const useWeatherBackgroundStore = create<WeatherBackgroundState>((set) => ({
  weatherType: "default",
  weatherContext: null,
  shouldShowRain: false,
  shouldShowSnow: false,
  shouldShowClouds: false,
  shouldShowThunder: false,

  computeFromWeather: (weather) => set(() => storeManager.computeState(weather)),
}))

export const getWeatherBackgroundServices = () => storeManager.getServices()
