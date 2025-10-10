import type { CitySearchOptions, CitySearchResult } from "./city-search.model"
import type { CitySearchRepository } from "./city-search.repository.interface"

export class CitySearchService {
  constructor(private readonly repository: CitySearchRepository) {}

  public async searchCities(
    text: string,
    options?: CitySearchOptions
  ): Promise<CitySearchResult[]> {
    return this.repository.searchCities(text, options)
  }

  public async searchCitiesOrEmpty(
    text: string,
    options?: CitySearchOptions
  ): Promise<CitySearchResult[]> {
    return this.repository.searchCitiesOrEmpty(text, options)
  }

  public async getCityById(
    placeId: string,
    searchText: string,
    options?: CitySearchOptions
  ): Promise<CitySearchResult | null> {
    return this.repository.getCityById(placeId, searchText, options)
  }
}
