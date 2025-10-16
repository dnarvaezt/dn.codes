import { axiosErrorHandler } from "@/application/utils"
import axios from "axios"

import type { CityInfo, GeocodingOptions } from "./geocoding.model"

export interface GetCityByCoordinatesProps {
  latitude: number
  longitude: number
  options?: GeocodingOptions
}

export abstract class GeocodingRepository<TModel = CityInfo> {
  abstract getCityByCoordinates(args: GetCityByCoordinatesProps): Promise<TModel>
}

export class GeocodingRepositoryBigDataCloud implements GeocodingRepository<CityInfo> {
  private get url(): string {
    return "https://api.bigdatacloud.net/data/reverse-geocode-client"
  }

  async getCityByCoordinates(args: GetCityByCoordinatesProps): Promise<CityInfo> {
    const { latitude, longitude, options } = args
    const language = options?.language ?? "en"
    const timeout = options?.timeout ?? 10000

    try {
      const { data } = await axios.get<CityInfo>(this.url, {
        params: {
          latitude,
          longitude,
          localityLanguage: language,
        },
        timeout,
      })

      return this.mapResponseToCityInfo(data, language)
    } catch (error) {
      throw axiosErrorHandler(error)
    }
  }

  private mapResponseToCityInfo(response: CityInfo, fallbackLanguage: string): CityInfo {
    return {
      city: response.city || "Unknown",
      locality: response.locality || "Unknown",
      principalSubdivision: response.principalSubdivision || "Unknown",
      principalSubdivisionCode: response.principalSubdivisionCode || "",
      countryName: response.countryName || "Unknown",
      countryCode: response.countryCode || "",
      continent: response.continent || "Unknown",
      continentCode: response.continentCode || "",
      latitude: response.latitude,
      longitude: response.longitude,
      localityLanguageRequested: response.localityLanguageRequested || fallbackLanguage,
    }
  }
}
