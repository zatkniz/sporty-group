---
applyTo: **/*.vue,**/*.ts
---

# TheSportsDB API Integration Instructions

## PROJECT OVERVIEW

**This project uses V1 API ONLY** with these primary endpoints:
1. **All Leagues**: `/all_leagues.php` - Get all available leagues
2. **Badge Lookup**: `/search_all_seasons.php?badge=1&id=<id>` - Get league badges and seasons

Focus implementation on V1 API patterns. V2 API features are not used in this project.

**ALWAYS use the `useApi` composable** for all TheSportsDB API calls. Never make direct API calls.

## CRITICAL RULES

### 1. API Key Management (REQUIRED)
- **NEVER hardcode API keys** in code
- Store API key in `runtimeConfig` in `nuxt.config.ts`
- Access with `useRuntimeConfig()` only in server code
- Project uses API key `3` for free tier access
- Free key `123` is also available for development

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    theSportsDbApiKey: process.env.THESPORTSDB_API_KEY || '3',
    public: {
      theSportsDbBaseUrl: 'https://www.thesportsdb.com/api/v1/json'
    }
  }
})

// server/api/teams.ts - Server-side only
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const data = await $fetch(`https://www.thesportsdb.com/api/v1/json/${config.theSportsDbApiKey}/searchteams.php?t=Arsenal`)
  return data
})
```

### 2. SSR Compatibility (REQUIRED)
- **ALWAYS use the `useApi` composable** for all API calls
- **NEVER call TheSportsDB API directly** - use the composable methods
- The composable handles the base URL and API key automatically
- All calls are client-side but can be wrapped in server routes if needed
- V1 API only - no V2 endpoints needed for this project

```typescript
// ❌ WRONG - Direct API call
const teams = await $fetch('https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Arsenal')

// ✅ CORRECT - Using useApi composable
const api = useApi()
const leagues = await api.getAllLeagues()
const badge = await api.getLeagueBadge('4328')
```

### 3. Type Definitions (REQUIRED)
- **ALL API responses MUST be typed**
- Define types in `app/types/thesportsdb.ts`
- Use explicit return types on all functions
- **NEVER use `any`**

```typescript
// app/types/thesportsdb.ts
export interface Team {
  idTeam: string
  strTeam: string
  strTeamBadge: string
  strLeague: string
  strStadium: string
  intFormedYear: string
  strDescriptionEN: string
}

export interface TeamsResponse {
  teams: Team[]
}

export interface Player {
  idPlayer: string
  strPlayer: string
  strTeam: string
  strPosition: string
  strThumb: string
  dateBorn: string
}

export interface PlayersResponse {
  player: Player[]
}

export interface Event {
  idEvent: string
  strEvent: string
  strHomeTeam: string
  strAwayTeam: string
  intHomeScore: string
  intAwayScore: string
  dateEvent: string
  strTime: string
  strThumb: string
}

export interface EventsResponse {
  events: Event[]
}

export interface League {
  idLeague: string
  strLeague: string
  strSport: string
  strLeagueAlternate: string
}

export interface LeaguesResponse {
  leagues: League[]
}

export interface Season {
  strSeason: string
  strBadge?: string
}

export interface SeasonsWithBadgeResponse {
  seasons: Season[]
}

export interface Standing {
  idStanding: string
  intRank: string
  idTeam: string
  strTeam: string
  strTeamBadge: string
  idLeague: string
  strLeague: string
  strSeason: string
  strForm: string
  strDescription: string
  intPlayed: string
  intWin: string
  intDraw: string
  intLoss: string
  intGoalsFor: string
  intGoalsAgainst: string
  intGoalDifference: string
  intPoints: string
  dateUpdated: string
}

export interface StandingsResponse {
  table: Standing[]
}
```

### 4. Error Handling (REQUIRED)
- **ALWAYS handle errors explicitly**
- Log errors for debugging
- Provide fallback UI for failed requests
- Implement retry logic for rate limits

```typescript
// server/api/teams/search.ts
export default defineEventHandler(async (event): Promise<TeamsResponse> => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const teamName = query.name as string

  try {
    const data = await $fetch<TeamsResponse>(
      `https://www.thesportsdb.com/api/v1/json/${config.theSportsDbApiKey}/searchteams.php`,
      {
        params: { t: teamName },
        retry: 2,
        retryDelay: 1000
      }
    )

    if (!data.teams || data.teams.length === 0) {
      throw createError({
        statusCode: 404,
        message: `No teams found for: ${teamName}`
      })
    }

    return data
  } catch (error) {
    console.error('TheSportsDB API Error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch teams from TheSportsDB'
    })
  }
})
```

### 5. Caching Strategy (REQUIRED)
- **Cache static data** (leagues, teams, players)
- Use short cache for dynamic data (events, scores)
- Implement cache headers in server routes
- Consider using Nuxt's `cachedFunction`

```typescript
// server/api/leagues/all.ts
import { cachedFunction } from 'nitro/runtime'

const getCachedLeagues = cachedFunction(
  async (): Promise<LeaguesResponse> => {
    const config = useRuntimeConfig()
    return await $fetch<LeaguesResponse>(
      `https://www.thesportsdb.com/api/v1/json/${config.theSportsDbApiKey}/all_leagues.php`
    )
  },
  {
    maxAge: 60 * 60 * 24, // Cache for 24 hours
    name: 'sports-leagues',
    getKey: () => 'all'
  }
)

export default defineEventHandler(async () => {
  return await getCachedLeagues()
})
```

### 6. Rate Limiting (REQUIRED)
- Track API usage to avoid 429 errors
- Implement request queuing if needed
- Use exponential backoff for retries
- Consider premium tier for high-volume apps

```typescript
// server/utils/rateLimiter.ts
const requestTimes: number[] = []
const MAX_REQUESTS_PER_MINUTE = 30 // Free tier limit

export const checkRateLimit = (): void => {
  const now = Date.now()
  const oneMinuteAgo = now - 60000

  // Remove requests older than 1 minute
  while (requestTimes.length > 0 && requestTimes[0] < oneMinuteAgo) {
    requestTimes.shift()
  }

  if (requestTimes.length >= MAX_REQUESTS_PER_MINUTE) {
    throw createError({
      statusCode: 429,
      message: 'Rate limit exceeded. Please try again later.'
    })
  }

  requestTimes.push(now)
}

// server/api/teams/search.ts
export default defineEventHandler(async (event) => {
  checkRateLimit()
  // ... rest of handler
})
```

## PRIMARY USE CASES (PROJECT-SPECIFIC)

### Central API Composable

**ALWAYS use the `useApi` composable** - it provides centralized access to all TheSportsDB endpoints.

```typescript
// app/composables/useApi.ts (already created)
export const useApi = () => {
  const config = useRuntimeConfig()
  
  const baseURL = computed(() => 
    `${config.public.theSportsDbBaseUrl}/${config.public.theSportsDbApiKey || '3'}`
  )

  const fetchFromAPI = async <T>(endpoint: string, params?: Record<string, string | number>): Promise<T> => {
    // ... implementation
  }

  const getAllLeagues = async (): Promise<LeaguesResponse> => {
    return fetchFromAPI<LeaguesResponse>('all_leagues.php')
  }

  const getLeagueBadge = async (leagueId: string | number): Promise<SeasonsWithBadgeResponse> => {
    return fetchFromAPI<SeasonsWithBadgeResponse>('search_all_seasons.php', {
      badge: 1,
      id: leagueId
    })
  }

  return { baseURL, fetchFromAPI, getAllLeagues, getLeagueBadge }
}
```

### Use Case 1: Get All Leagues

```typescript
// In any component or composable
<script setup lang="ts">
const api = useApi()
const leagues = ref<League[]>([])
const loading = ref(false)

const fetchLeagues = async (): Promise<void> => {
  loading.value = true
  try {
    const response = await api.getAllLeagues()
    leagues.value = response.leagues
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchLeagues())
</script>
```

### Use Case 2: Get League Badge

```typescript
// In any component or composable
<script setup lang="ts">
const api = useApi()

const getBadge = async (leagueId: string): Promise<string | null> => {
  try {
    const response = await api.getLeagueBadge(leagueId)
    return response.seasons[0]?.strBadge ?? null
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
</script>
```

### Higher-Level Composables

Build feature-specific composables on top of `useApi`:

```typescript
// composables/useLeagues.ts (already created)
export const useLeagues = () => {
  const api = useApi()
  const leagues = ref<League[]>([])
  
  const fetchLeagues = async (): Promise<void> => {
    const response = await api.getAllLeagues()
    leagues.value = response.leagues
  }
  
  const filterBySport = (sport: string): League[] => {
    return leagues.value.filter(l => l.strSport === sport)
  }
  
  return { leagues, fetchLeagues, filterBySport }
}

// composables/useLeagueBadge.ts (already created)
export const useLeagueBadge = () => {
  const api = useApi()
  
  const fetchBadge = async (leagueId: string | number) => {
    const response = await api.getLeagueBadge(leagueId)
    return {
      badge: response.seasons[0]?.strBadge ?? null,
      seasons: response.seasons
    }
  }
  
  return { fetchBadge }
}
```

## LEGACY PATTERNS (DO NOT USE)

### ❌ Old Pattern: Server Routes

**DO NOT create server routes** - use `useApi` composable directly in components.

```typescript
// ❌ WRONG - Don't create this
// server/api/leagues/all.ts
export default defineEventHandler(async (event): Promise<LeaguesResponse> => {
  // ... old pattern
})

// ❌ WRONG - Don't do this
const leagues = await $fetch('/api/leagues/all')
```

### ✅ New Pattern: useApi Composable

```typescript
// ✅ CORRECT - Use composable directly
const api = useApi()
const response = await api.getAllLeagues()
```

## ADDITIONAL PATTERNS

### Use Case 1: Get All Leagues

**This is the main entry point for the application.**

```typescript
// server/api/leagues/all.ts
import type { LeaguesResponse } from '~/types/thesportsdb'

export default defineEventHandler(async (): Promise<LeaguesResponse> => {
  const config = useRuntimeConfig()
  
  try {
    const data = await $fetch<LeaguesResponse>(
      `https://www.thesportsdb.com/api/v1/json/${config.theSportsDbApiKey}/all_leagues.php`
    )

    return data
  } catch (error) {
    console.error('Error fetching all leagues:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch leagues'
    })
  }
})

// composables/useLeagues.ts
export const useLeagues = () => {
  const { data, error, pending, refresh } = useFetch<LeaguesResponse>('/api/leagues/all', {
    lazy: true
  })

  const leagues = computed(() => data.value?.leagues ?? [])

  return {
    leagues,
    loading: pending,
    error,
    refresh
  }
}
```

### Use Case 2: Get League Badges and Seasons

**Used to display league badges and available seasons.**

```typescript
// server/api/leagues/badges/[id].ts
import type { SeasonsWithBadgeResponse } from '~/types/thesportsdb'

export default defineEventHandler(async (event): Promise<SeasonsWithBadgeResponse> => {
  const config = useRuntimeConfig()
  const leagueId = getRouterParam(event, 'id')

  if (!leagueId) {
    throw createError({
      statusCode: 400,
      message: 'League ID is required'
    })
  }

  try {
    const data = await $fetch<SeasonsWithBadgeResponse>(
      `https://www.thesportsdb.com/api/v1/json/${config.theSportsDbApiKey}/search_all_seasons.php`,
      {
        params: { badge: 1, id: leagueId }
      }
    )

    return data
  } catch (error) {
    console.error(`Error fetching badge for league ${leagueId}:`, error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch league badge'
    })
  }
})

// composables/useLeagueBadge.ts
export const useLeagueBadge = (leagueId: MaybeRef<string>) => {
  const id = computed(() => unref(leagueId))
  
  const { data, error, pending } = useFetch<SeasonsWithBadgeResponse>(
    () => `/api/leagues/badges/${id.value}`,
    {
      lazy: true,
      watch: [id]
    }
  )

  const seasons = computed(() => data.value?.seasons ?? [])
  const badge = computed(() => seasons.value[0]?.strBadge ?? '')

  return {
    seasons,
    badge,
    loading: pending,
    error
  }
}
```

## ADDITIONAL PATTERNS

### Pattern 1: Search and Fetch Details

```typescript
// composables/useTeams.ts
export const useTeams = () => {
  const searchTeams = async (name: string): Promise<Team[]> => {
    const { data, error } = await useFetch<TeamsResponse>('/api/teams/search', {
      params: { name }
    })

    if (error.value) {
      console.error('Error searching teams:', error.value)
      return []
    }

    return data.value?.teams ?? []
  }

  const getTeamDetails = async (id: string): Promise<Team | null> => {
    const { data, error } = await useFetch<TeamsResponse>('/api/teams/details', {
      params: { id }
    })

    if (error.value) {
      console.error('Error fetching team details:', error.value)
      return null
    }

    return data.value?.teams?.[0] ?? null
  }

  return {
    searchTeams,
    getTeamDetails
  }
}
```

### Pattern 2: Image Optimization

```typescript
// utils/imageUtils.ts
type ImageSize = 'tiny' | 'small' | 'medium' | 'original'

export const getSportsDbImage = (url: string, size: ImageSize = 'medium'): string => {
  if (!url) return ''
  if (size === 'original') return url
  return `${url}/${size}`
}

// components/TeamLogo.vue
<template>
  <img
    :src="getSportsDbImage(team.strTeamBadge, 'small')"
    :alt="team.strTeam"
    loading="lazy"
  />
</template>

<script setup lang="ts">
import type { Team } from '~/types/thesportsdb'

const props = defineProps<{
  team: Team
}>()
</script>
```

### Pattern 3: Schedule Management

```typescript
// composables/useSchedule.ts
export const useSchedule = () => {
  const getUpcomingMatches = async (teamId: string): Promise<Event[]> => {
    const { data } = await useFetch<EventsResponse>('/api/events/next', {
      params: { teamId }
    })
    return data.value?.events ?? []
  }

  const getMatchesByDate = async (date: string): Promise<Event[]> => {
    const { data } = await useFetch<EventsResponse>('/api/events/day', {
      params: { date }
    })
    return data.value?.events ?? []
  }

  const getSeasonSchedule = async (leagueId: string, season: string): Promise<Event[]> => {
    const { data } = await useFetch<EventsResponse>('/api/events/season', {
      params: { leagueId, season }
    })
    return data.value?.events ?? []
  }

  return {
    getUpcomingMatches,
    getMatchesByDate,
    getSeasonSchedule
  }
}
```

### Pattern 4: Standings Display

```typescript
// server/api/standings/[leagueId].ts
export default defineEventHandler(async (event): Promise<StandingsResponse> => {
  const config = useRuntimeConfig()
  const leagueId = getRouterParam(event, 'leagueId')
  const query = getQuery(event)
  const season = query.season as string

  try {
    const data = await $fetch<StandingsResponse>(
      `https://www.thesportsdb.com/api/v1/json/${config.theSportsDbApiKey}/lookuptable.php`,
      {
        params: { l: leagueId, s: season }
      }
    )

    return data
  } catch (error) {
    console.error('Error fetching standings:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch league standings'
    })
  }
})

// composables/useStandings.ts
export const useStandings = () => {
  const getLeagueStandings = async (leagueId: string, season: string): Promise<Standing[]> => {
    const { data } = await useFetch<StandingsResponse>(`/api/standings/${leagueId}`, {
      params: { season }
    })
    return data.value?.table ?? []
  }

  return { getLeagueStandings }
}
```

## TYPESCRIPT STANDARDS

### Arrow Functions Only
```typescript
// ✅ CORRECT
export const searchTeams = async (name: string): Promise<Team[]> => {
  // ...
}

// ❌ WRONG
export async function searchTeams(name: string): Promise<Team[]> {
  // ...
}
```

### Explicit Return Types
```typescript
// ✅ CORRECT
const getTeam = async (id: string): Promise<Team | null> => {
  // ...
}

// ❌ WRONG - No return type
const getTeam = async (id: string) => {
  // ...
}
```

### lang="ts" in Components
```vue
<!-- ✅ CORRECT -->
<script setup lang="ts">
import type { Team } from '~/types/thesportsdb'

const teams = ref<Team[]>([])
</script>

<!-- ❌ WRONG - No lang="ts" -->
<script setup>
const teams = ref([])
</script>
```

## PERFORMANCE OPTIMIZATION

### 1. Lazy Load Images
```vue
<template>
  <img
    :src="getSportsDbImage(team.strTeamBadge, 'small')"
    loading="lazy"
    :alt="team.strTeam"
  />
</template>
```

### 2. Batch Requests
```typescript
// ✅ CORRECT - Single request for season data
const events = await $fetch('/api/events/season', {
  params: { leagueId: '4328', season: '2023-2024' }
})

// ❌ WRONG - Multiple requests per event
for (const event of events) {
  const details = await $fetch(`/api/events/${event.idEvent}`)
}
```

### 3. Use Composables for Shared Logic
```typescript
// composables/useSportsData.ts
export const useSportsData = () => {
  const leagues = ref<League[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchLeagues = async (): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await useFetch<LeaguesResponse>('/api/leagues/all')
      leagues.value = data.value?.leagues ?? []
    } catch (e) {
      error.value = 'Failed to load leagues'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return {
    leagues,
    loading,
    error,
    fetchLeagues
  }
}
```

## SECURITY

### 1. Never Expose API Keys
```typescript
// ❌ WRONG - Exposed in client
const data = await $fetch(`https://www.thesportsdb.com/api/v1/json/my-secret-key/searchteams.php`)

// ✅ CORRECT - Hidden in server
// server/api/teams/search.ts
export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  return await $fetch(`https://www.thesportsdb.com/api/v1/json/${config.theSportsDbApiKey}/searchteams.php`)
})
```

### 2. Validate Input
```typescript
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const teamName = query.name as string

  // Validate input
  if (!teamName || typeof teamName !== 'string' || teamName.length > 100) {
    throw createError({
      statusCode: 400,
      message: 'Invalid team name'
    })
  }

  // ... fetch data
})
```

## TESTING

### Mock API Responses
```typescript
// tests/fixtures/teams.ts
export const mockTeamsResponse: TeamsResponse = {
  teams: [
    {
      idTeam: '133604',
      strTeam: 'Arsenal',
      strTeamBadge: 'https://...',
      strLeague: 'English Premier League',
      strStadium: 'Emirates Stadium',
      intFormedYear: '1886',
      strDescriptionEN: 'Arsenal FC...'
    }
  ]
}
```

## DOCUMENTATION

### Document Server Routes
```typescript
/**
 * Search for teams by name
 * @route GET /api/teams/search
 * @param name - Team name to search for
 * @returns TeamsResponse with matching teams
 * @throws 400 - Invalid team name
 * @throws 404 - No teams found
 * @throws 500 - API error
 */
export default defineEventHandler(async (event): Promise<TeamsResponse> => {
  // ...
})
```

## AVOID COMMON MISTAKES

1. **Don't use V2 API** - This project uses V1 API only
2. **Don't call API directly from client** - Always use server routes
3. **Don't forget error boundaries** - Wrap components in error handlers
4. **Don't skip caching** - API has rate limits (30 req/min free tier)
5. **Don't hardcode league IDs** - Make them configurable
6. **Don't fetch on every render** - Use proper data fetching patterns with `useFetch`
7. **Don't ignore SSR** - All external API calls must be server-side
8. **Don't forget badge parameter** - Use `badge=1` when fetching seasons for badge display
