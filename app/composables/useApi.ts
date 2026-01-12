import type { LeaguesResponse, SeasonsWithBadgeResponse } from '~/types/thesportsdb'

/**
 * Central API composable for TheSportsDB API
 * Provides typed methods for all API endpoints with proper error handling
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

  /**
   * Get all available leagues
   * @returns All leagues from all sports
   */
  const getAllLeagues = async (): Promise<LeaguesResponse> => {
    return fetchFromAPI<LeaguesResponse>('all_leagues.php')
  }

  /**
   * Get league badge and all seasons
   * @param leagueId - The league ID
   * @returns Seasons with badge URL
   */
  const getLeagueBadge = async (leagueId: string | number): Promise<SeasonsWithBadgeResponse> => {
    return fetchFromAPI<SeasonsWithBadgeResponse>('search_all_seasons.php', {
      badge: 1,
      id: leagueId
    })
  }

  return {
    baseURL,
    fetchFromAPI,
    getAllLeagues,
    getLeagueBadge
  }
}
