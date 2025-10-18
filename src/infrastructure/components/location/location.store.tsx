"use client"

import { City, cityRepository, geolocationRepository } from "@/application"
import { create } from "zustand"

interface Coordinates {
  latitude: number
  longitude: number
}

interface LocationStore {
  city: City | null
  loadUserCity: () => Promise<void>
  searchCity: (text: string) => Promise<City[]>
  setCity: (coordinates: Coordinates) => Promise<void>
}

export const useLocationStore = create<LocationStore>((set) => {
  const loadUserCity = async () => {
    try {
      const coordinates = await geolocationRepository.getPosition()
      if (coordinates) {
        setCity({
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
        })
      } else {
        set({ city: null })
      }
    } catch (error) {
      console.error("Error getting user coordinates:", error)
      set({ city: null })
    }
  }

  const searchCity = async (text: string): Promise<City[]> => {
    const cities = await cityRepository.searchCities(text)
    return cities
  }

  const setCity = async (coordinates: Coordinates) => {
    const city = await cityRepository.getCity({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    })

    set({ city })
  }

  return {
    city: null,
    loadUserCity,
    searchCity,
    setCity,
  }
})
