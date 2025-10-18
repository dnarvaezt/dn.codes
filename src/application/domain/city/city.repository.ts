import { axiosErrorHandler } from "@/application/utils"
import axios from "axios"
import { City } from "./city.model"

export abstract class CityRepository<City> {
  abstract getCity(args: { latitude: number; longitude: number }): Promise<City | null>
  abstract searchCities(name: string): Promise<City[]>
}

export class CitySearchRepositoryGeoapify implements CityRepository<City> {
  private get apiKey(): string {
    return process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || ""
  }

  private get url(): string {
    return "https://api.geoapify.com/v1/geocode"
  }

  async getCity(args: { latitude: number; longitude: number }): Promise<City | null> {
    const { data } = await axios.get(`${this.url}/reverse`, {
      params: {
        apiKey: this.apiKey,
        lat: args.latitude,
        lon: args.longitude,
      },
    })

    if (!data.features || !Array.isArray(data.features)) {
      return null
    }

    return this.mapFeatureToResult(data.features[0])
  }

  async searchCities(name: string): Promise<City[]> {
    try {
      const { data } = await axios.get(`${this.url}/autocomplete`, {
        params: {
          apiKey: this.apiKey,
          text: name,
        },
      })

      if (!data.features || !Array.isArray(data.features)) {
        return []
      }

      return data.features.map((feature: any) => this.mapFeatureToResult(feature))
    } catch (error) {
      throw axiosErrorHandler(error)
    }
  }

  private mapFeatureToResult(data: any): City {
    return {
      name: data.properties.city || data.properties.name || "Unknown",
      country: data.properties.country || "Unknown",
      countryCode: data.properties.country_code || "",
      state: data.properties.state,
      coordinates: {
        latitude: data.properties.lat,
        longitude: data.properties.lon,
      },
      formatted: data.properties.formatted,
      placeId: data.properties.place_id,
    }
  }
}
