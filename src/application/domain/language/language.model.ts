export type SupportedLanguage = "es" | "en"

export interface LanguageInfo {
  language: SupportedLanguage
  fullCode: string
  isManual: boolean
  detectionMethod: "browser" | "manual"
}
