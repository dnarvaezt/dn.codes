"use client"

import { createContext, useContext, useEffect, useState } from "react"

import type { UserContextInitOptions, UserContextState } from "./user-context.model"
import type { UserContextService } from "./user-context.service"

interface UserContextProviderValue {
  state: UserContextState
  service: UserContextService | null
  isLoading: boolean
  error: Error | null
}

const UserContextContext = createContext<UserContextProviderValue | null>(null)

interface UserContextProviderProps {
  children: React.ReactNode
  service: UserContextService | null
  autoInitialize?: boolean
  initOptions?: UserContextInitOptions
}

export const UserContextProvider = ({
  children,
  service,
  autoInitialize = true,
  initOptions,
}: UserContextProviderProps) => {
  const [state, setState] = useState<UserContextState>({
    location: null,
    city: null,
    timezone: null,
    weather: null,
    language: {
      language: "en",
      fullCode: "en-US",
      isManual: false,
      detectionMethod: "browser",
    },
    isInitialized: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!service || !autoInitialize) {
      return
    }

    const unsubscribe = service.subscribe(() => {
      setState(service.getCurrentState())
    })

    const initialize = async () => {
      try {
        setIsLoading(true)
        setError(null)
        await service.initializeFromBrowser(initOptions)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"))
      } finally {
        setIsLoading(false)
      }
    }

    initialize()

    return () => {
      unsubscribe()
    }
  }, [service, autoInitialize, initOptions])

  const providerValue: UserContextProviderValue = {
    state,
    service,
    isLoading,
    error,
  }

  return <UserContextContext.Provider value={providerValue}>{children}</UserContextContext.Provider>
}

export const useUserContext = (): UserContextProviderValue => {
  const context = useContext(UserContextContext)

  if (!context) {
    throw new Error("useUserContext debe usarse dentro de UserContextProvider")
  }

  return context
}
