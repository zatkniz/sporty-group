import type { League, LeaguesResponse, SeasonsWithBadgeResponse } from '~/types'

export const useSportsLeaguesStore = defineStore('sportsLeagues', () => {
  // State
  const leagues = ref<League[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const searchTerm = ref<string>('')
  const selectedSport = ref<string | null>(null)

  // Badge cache using VueUse localStorage
  const badgeCache = useLocalStorage<Record<string, string>>('league-badges', {})

  // Computed - Available sports (unique, sorted)
  const availableSports = computed((): string[] => {
    const sports = new Set<string>()
    leagues.value.forEach((league) => {
      if (league.strSport) {
        sports.add(league.strSport)
      }
    })
    return Array.from(sports).sort()
  })

  // Computed - Filtered leagues
  const filteredLeagues = computed((): League[] => {
    let filtered = leagues.value

    // Filter by search term
    if (searchTerm.value.trim()) {
      const term = searchTerm.value.toLowerCase()
      filtered = filtered.filter((league) => {
        return (
          league.strLeague?.toLowerCase().includes(term) ||
          league.strLeagueAlternate?.toLowerCase().includes(term)
        )
      })
    }

    // Filter by sport
    if (selectedSport.value) {
      filtered = filtered.filter((league) => league.strSport === selectedSport.value)
    }

    return filtered
  })

  // Actions
  const fetchLeagues = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const api = useApi()
      const response = await api.fetchFromAPI<LeaguesResponse>('all_leagues.php')

      if (response?.leagues) {
        leagues.value = response.leagues
      } else {
        leagues.value = []
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch leagues'
      error.value = errorMessage
      console.error('Error fetching leagues:', err)

      // Check for rate limit error (429)
      if (errorMessage.includes('429')) {
        const toast = useToast()
        toast.add({
          title: 'Rate limit exceeded',
          description: 'Please wait a moment before trying again',
          color: 'warning',
        })
      }
    } finally {
      loading.value = false
    }
  }

  const fetchBadge = async (leagueId: string): Promise<string | null> => {
    // Check cache first
    if (badgeCache.value[leagueId]) {
      return badgeCache.value[leagueId]
    }

    try {
      const api = useApi()
      const response = await api.fetchFromAPI<SeasonsWithBadgeResponse>(
        'search_all_seasons.php',
        { badge: 1, id: leagueId }
      )

      if (response?.seasons && response.seasons.length > 0) {
        // Get the most recent season (last item in array)
        const latestSeason = response.seasons[response.seasons.length - 1]
        if (latestSeason.strBadge) {
          const badgeUrl = latestSeason.strBadge

          // Cache the badge URL
          badgeCache.value[leagueId] = badgeUrl

          return badgeUrl
        }
      }

      return null
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch badge'
      console.error('Error fetching badge:', err)

      // Check for rate limit error
      if (errorMessage.includes('429')) {
        const toast = useToast()
        toast.add({
          title: 'Rate limit exceeded',
          description: 'Please wait before loading more badges',
          color: 'warning',
        })
      }

      throw new Error(errorMessage)
    }
  }

  return {
    // State (readonly)
    leagues: readonly(leagues),
    loading: readonly(loading),
    error: readonly(error),
    searchTerm,
    selectedSport,
    // Computed
    availableSports,
    filteredLeagues,
    // Actions
    fetchLeagues,
    fetchBadge,
  }
})
