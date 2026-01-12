import type { League } from '~/types'

/**
 * Composable for managing leagues data
 * Uses the central useApi composable for all API calls
 */
export const useLeagues = () => {
  const api = useApi()
  
  const leagues = ref<League[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch all leagues from TheSportsDB API
   */
  const fetchLeagues = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.getAllLeagues()
      leagues.value = response.leagues ?? []
    } catch (e) {
      error.value = 'Failed to fetch leagues'
      console.error('Error fetching leagues:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * Filter leagues by sport
   * @param sport - Sport name (e.g., 'Soccer', 'Basketball')
   */
  const filterBySport = (sport: string): League[] => {
    return leagues.value.filter(league => 
      league.strSport.toLowerCase() === sport.toLowerCase()
    )
  }

  /**
   * Search leagues by name
   * @param query - Search query
   */
  const searchLeagues = (query: string): League[] => {
    const lowerQuery = query.toLowerCase()
    return leagues.value.filter(league =>
      league.strLeague.toLowerCase().includes(lowerQuery) ||
      league.strLeagueAlternate?.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Get unique sports from loaded leagues
   */
  const uniqueSports = computed((): string[] => {
    const sports = new Set(leagues.value.map(l => l.strSport))
    return Array.from(sports).sort()
  })

  return {
    leagues: readonly(leagues),
    loading: readonly(loading),
    error: readonly(error),
    uniqueSports,
    fetchLeagues,
    filterBySport,
    searchLeagues
  }
}
