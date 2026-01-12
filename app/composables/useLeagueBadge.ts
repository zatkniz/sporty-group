import type { Season } from '~/types'

/**
 * Composable for managing league badge data
 * Uses the central useApi composable for all API calls
 */
export const useLeagueBadge = () => {
  const api = useApi()

  /**
   * Fetch badge and seasons for a specific league
   * @param leagueId - The league ID
   */
  const fetchBadge = async (leagueId: string | number): Promise<{
    badge: string | null
    seasons: Season[]
  }> => {
    try {
      const response = await api.getLeagueBadge(leagueId)
      const seasons = response.seasons ?? []
      const badge = seasons[0]?.strBadge ?? null

      return { badge, seasons }
    } catch (error) {
      console.error(`Error fetching badge for league ${leagueId}:`, error)
      return { badge: null, seasons: [] }
    }
  }

  /**
   * Get latest season for a league
   * @param leagueId - The league ID
   */
  const getLatestSeason = async (leagueId: string | number): Promise<Season | null> => {
    try {
      const response = await api.getLeagueBadge(leagueId)
      return response.seasons?.[0] ?? null
    } catch (error) {
      console.error(`Error fetching latest season for league ${leagueId}:`, error)
      return null
    }
  }

  return {
    fetchBadge,
    getLatestSeason
  }
}
