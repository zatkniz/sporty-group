/**
 * Thin HTTP client wrapper for TheSportsDB API
 * Provides base URL and generic fetch method
 * All business logic and state management should be in stores
 */
export const useApi = () => {
  const config = useRuntimeConfig()
  
  // Base URL for TheSportsDB API v1
  const baseURL = computed(() => 
    `${config.public.theSportsDbBaseUrl}/${config.public.theSportsDbApiKey || '3'}`
  )

  /**
   * Generic fetch wrapper for TheSportsDB API
   * @param endpoint - API endpoint (e.g., 'all_leagues.php')
   * @param params - Query parameters
   */
  const fetchFromAPI = async <T>(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<T> => {
    const url = `${baseURL.value}/${endpoint}`
    
    try {
      return await $fetch<T>(url, { params })
    } catch (error) {
      console.error(`TheSportsDB API Error [${endpoint}]:`, error)
      throw error
    }
  }

  return {
    baseURL,
    fetchFromAPI
  }
}
