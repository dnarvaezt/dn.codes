import type { CitySearchOptions, CitySearchResult } from "./city-search.model"

export interface CitySearchRepository {
  searchCities(text: string, options?: CitySearchOptions): Promise<CitySearchResult[]>
  searchCitiesOrEmpty(text: string, options?: CitySearchOptions): Promise<CitySearchResult[]>
  getCityById(
    placeId: string,
    searchText: string,
    options?: CitySearchOptions
  ): Promise<CitySearchResult | null>
}
