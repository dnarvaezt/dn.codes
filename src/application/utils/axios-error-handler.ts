import axios from "axios"

export function axiosErrorHandler(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as unknown
    let messageFromData: string | undefined
    if (data && typeof data === "object" && "message" in (data as Record<string, unknown>)) {
      const maybeMessage = (data as Record<string, unknown>).message
      messageFromData = typeof maybeMessage === "string" ? maybeMessage : undefined
    }
    const message = messageFromData || error.message || "Unknown Axios error"
    return new Error(message)
  }

  if (error instanceof Error) return error
  if (typeof error === "string") return new Error(error)

  try {
    return new Error(JSON.stringify(error))
  } catch {
    return new Error("Unknown Axios error")
  }
}
