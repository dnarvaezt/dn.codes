import {
  CitySearchError,
  CitySearchOptions,
  CitySearchResult,
  DEFAULT_CITY_SEARCH_OPTIONS,
  GEOAPIFY_AUTOCOMPLETE_URL,
  GeoapifyAutocompleteResponse,
  GeoapifyFeature,
} from "@/core/domain/types/city-search"

import type { LanguageService } from "@/infrastructure/browser/language"

export class CitySearchService {
  private readonly apiKey: string
  private readonly languageService?: LanguageService

  constructor(apiKey: string, languageService?: LanguageService) {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error("API key de Geoapify es requerida")
    }
    this.apiKey = apiKey
    this.languageService = languageService
  }

  private createError(message: string, statusCode?: number): CitySearchError {
    return new CitySearchError(message, statusCode)
  }

  private buildSearchUrl(text: string, options?: CitySearchOptions): string {
    const limit = options?.limit ?? DEFAULT_CITY_SEARCH_OPTIONS.limit
    const language =
      options?.language ??
      this.languageService?.getCurrentLanguage().language ??
      DEFAULT_CITY_SEARCH_OPTIONS.language

    const params = new URLSearchParams({
      text,
      apiKey: this.apiKey,
      type: "city",
      limit: String(limit),
      lang: language,
    })

    if (options?.countryFilter && options.countryFilter.length > 0) {
      params.append("filter", `countrycode:${options.countryFilter.join(",")}`)
    }

    return `${GEOAPIFY_AUTOCOMPLETE_URL}?${params.toString()}`
  }

  private mapFeatureToResult(feature: GeoapifyFeature): CitySearchResult {
    return {
      city: feature.properties.city || feature.properties.name || "Unknown",
      country: feature.properties.country || "Unknown",
      countryCode: feature.properties.country_code || "",
      state: feature.properties.state,
      coordinates: {
        latitude: feature.properties.lat,
        longitude: feature.properties.lon,
      },
      formatted: feature.properties.formatted,
      placeId: feature.properties.place_id,
    }
  }

  public async searchCities(
    text: string,
    options?: CitySearchOptions
  ): Promise<CitySearchResult[]> {
    const timeout = options?.timeout ?? DEFAULT_CITY_SEARCH_OPTIONS.timeout

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const url = this.buildSearchUrl(text, options)

      const response = await fetch(url, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw this.createError(`Error al buscar ciudades: ${response.statusText}`, response.status)
      }

      const data: GeoapifyAutocompleteResponse = await response.json()

      if (!data.features || !Array.isArray(data.features)) {
        return []
      }

      const results = data.features.map((feature) => this.mapFeatureToResult(feature))

      return results
    } catch (error) {
      if (error instanceof CitySearchError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw this.createError("Timeout al buscar ciudades")
        }
        throw this.createError(`Error al buscar ciudades: ${error.message}`)
      }

      throw this.createError("Error desconocido al buscar ciudades")
    } finally {
      clearTimeout(timeoutId)
    }
  }

  public async searchCitiesOrEmpty(
    text: string,
    options?: CitySearchOptions
  ): Promise<CitySearchResult[]> {
    try {
      return await this.searchCities(text, options)
    } catch {
      return []
    }
  }

  public async getCityById(
    placeId: string,
    searchText: string,
    options?: CitySearchOptions
  ): Promise<CitySearchResult | null> {
    const results = await this.searchCities(searchText, options)
    return results.find((result) => result.placeId === placeId) ?? null
  }

  public async validateApiKey(): Promise<boolean> {
    try {
      const url = `${GEOAPIFY_AUTOCOMPLETE_URL}?text=test&apiKey=${this.apiKey}&type=city&limit=1`
      const response = await fetch(url)
      return response.ok
    } catch {
      return false
    }
  }
}

export const createCitySearchService = (apiKey: string, languageService?: LanguageService) => {
  return new CitySearchService(apiKey, languageService)
}
