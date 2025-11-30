"use client"

import { createContext, ReactNode, useContext } from "react"
import { useCurriculumPage } from "./curriculum-page.hook"
import type { CurriculumPageContextValue } from "./curriculum-page.interface"

interface CurriculumPageProviderProps {
  children: ReactNode
}

const CurriculumPageContext = createContext<CurriculumPageContextValue | undefined>(undefined)

export const CurriculumPageProvider = ({ children }: CurriculumPageProviderProps) => {
  const contextValue = useCurriculumPage()

  return (
    <CurriculumPageContext.Provider value={contextValue}>{children}</CurriculumPageContext.Provider>
  )
}

export const useCurriculumPageContext = () => {
  const context = useContext(CurriculumPageContext)
  if (context === undefined) {
    throw new Error("useCurriculumPageContext must be used within a CurriculumPageProvider")
  }
  return context
}
