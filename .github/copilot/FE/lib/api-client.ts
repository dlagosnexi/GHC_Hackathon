// API client for .NET backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class ApiClient {
  async get<T>(endpoint: string): Promise<{ data?: T; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      console.error("API request failed:", error)
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      }
    }
  }

  async post<T>(endpoint: string, data: any): Promise<{ data?: T; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      return { data: responseData }
    } catch (error) {
      console.error("API request failed:", error)
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      }
    }
  }

  async put<T>(endpoint: string, data: any): Promise<{ data?: T; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      return { data: responseData }
    } catch (error) {
      console.error("API request failed:", error)
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      }
    }
  }

  async delete(endpoint: string): Promise<{ error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return {}
    } catch (error) {
      console.error("API request failed:", error)
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      }
    }
  }
}

export const apiClient = new ApiClient()
