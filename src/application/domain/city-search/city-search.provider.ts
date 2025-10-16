import type { CitySearchResult } from "./city-search.model"
import { CitySearchRepository, CitySearchRepositoryGeoapify } from "./city-search.repository"

export const citySearchRepository: CitySearchRepository<CitySearchResult[]> =
  new CitySearchRepositoryGeoapify()
