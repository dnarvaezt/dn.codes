/**
 * Normaliza cualquier formato de string a un array de palabras
 * Soporta: camelCase, PascalCase, kebab-case, snake_case, SCREAMING_SNAKE_CASE, etc.
 */
const normalizeToWords = (str: string): string[] => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase/PascalCase
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // ACRONYMCase
    .replace(/[-_\s]+/g, " ") // kebab-case, snake_case, espacios
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase())
}

/**
 * Convierte cualquier formato a kebab-case
 * @example toKebabCase("userName") // "user-name"
 * @example toKebabCase("UserName") // "user-name"
 * @example toKebabCase("user_name") // "user-name"
 * @example toKebabCase("USER_NAME") // "user-name"
 */
export const toKebabCase = (str: string): string => {
  return normalizeToWords(str).join("-")
}

/**
 * Convierte cualquier formato a camelCase
 * @example toCamelCase("user-name") // "userName"
 * @example toCamelCase("UserName") // "userName"
 * @example toCamelCase("user_name") // "userName"
 * @example toCamelCase("USER_NAME") // "userName"
 */
export const toCamelCase = (str: string): string => {
  const words = normalizeToWords(str)
  return words
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join("")
}

/**
 * Convierte cualquier formato a PascalCase
 * @example toPascalCase("user-name") // "UserName"
 * @example toPascalCase("userName") // "UserName"
 * @example toPascalCase("user_name") // "UserName"
 * @example toPascalCase("USER_NAME") // "UserName"
 */
export const toPascalCase = (str: string): string => {
  return normalizeToWords(str)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
}

/**
 * Convierte cualquier formato a snake_case
 * @example toSnakeCase("userName") // "user_name"
 * @example toSnakeCase("UserName") // "user_name"
 * @example toSnakeCase("user-name") // "user_name"
 * @example toSnakeCase("USER_NAME") // "user_name"
 */
export const toSnakeCase = (str: string): string => {
  return normalizeToWords(str).join("_")
}

/**
 * Convierte cualquier formato a SCREAMING_SNAKE_CASE
 * @example toScreamingSnakeCase("userName") // "USER_NAME"
 * @example toScreamingSnakeCase("UserName") // "USER_NAME"
 * @example toScreamingSnakeCase("user-name") // "USER_NAME"
 * @example toScreamingSnakeCase("user_name") // "USER_NAME"
 */
export const toScreamingSnakeCase = (str: string): string => {
  return normalizeToWords(str).join("_").toUpperCase()
}

/**
 * Convierte cualquier formato a Train-Case
 * @example toTrainCase("userName") // "User-Name"
 * @example toTrainCase("user_name") // "User-Name"
 * @example toTrainCase("USER_NAME") // "User-Name"
 */
export const toTrainCase = (str: string): string => {
  return normalizeToWords(str)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-")
}

/**
 * Convierte cualquier formato a dot.case
 * @example toDotCase("userName") // "user.name"
 * @example toDotCase("UserName") // "user.name"
 * @example toDotCase("user-name") // "user.name"
 */
export const toDotCase = (str: string): string => {
  return normalizeToWords(str).join(".")
}

/**
 * Convierte cualquier formato a path/case
 * @example toPathCase("userName") // "user/name"
 * @example toPathCase("UserName") // "user/name"
 * @example toPathCase("user-name") // "user/name"
 */
export const toPathCase = (str: string): string => {
  return normalizeToWords(str).join("/")
}
