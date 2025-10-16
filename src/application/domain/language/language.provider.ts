import { LanguageRepository, LanguageRepositoryBrowser } from "./language.repository"

export const languageRepository: LanguageRepository = new LanguageRepositoryBrowser()
