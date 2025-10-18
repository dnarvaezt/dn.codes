import { CityRepository, CitySearchRepositoryGeoapify } from "./city.repository"

import type { City } from "./city.model"

export const cityRepository: CityRepository<City> = new CitySearchRepositoryGeoapify()
