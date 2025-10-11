import type { CitySearchOptions, CitySearchResult } from "./city-search.model"

interface CitySearchRepository {
  searchCities(text: string, options?: CitySearchOptions): Promise<CitySearchResult[]>
}

export class CitySearchService {
  constructor(private readonly repository: CitySearchRepository) {}

  public async searchCities(
    text: string,
    options?: CitySearchOptions
  ): Promise<CitySearchResult[]> {
    return this.repository.searchCities(text, options)
  }
}
