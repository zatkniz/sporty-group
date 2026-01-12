# useApi Composable - TheSportsDB Integration

Central API composable for all TheSportsDB API interactions in the Sporty Group project.

## Quick Start

```typescript
// In any Vue component or composable
const api = useApi()

// Get all leagues
const response = await api.getAllLeagues()
const leagues = response.leagues

// Get league badge
const badgeData = await api.getLeagueBadge('4328')
const badge = badgeData.seasons[0]?.strBadge
```

## Available Methods

### `getAllLeagues()`
Fetches all available leagues from all sports.

```typescript
const api = useApi()
const response = await api.getAllLeagues()
// Returns: LeaguesResponse { leagues: League[] }
```

### `getLeagueBadge(leagueId)`
Fetches badge and seasons for a specific league.

```typescript
const api = useApi()
const response = await api.getLeagueBadge('4328')
// Returns: SeasonsWithBadgeResponse { seasons: Season[] }
```

### `fetchFromAPI<T>(endpoint, params?)`
Generic method for custom API calls.

```typescript
const api = useApi()
const data = await api.fetchFromAPI<CustomResponse>('custom_endpoint.php', {
  param1: 'value1',
  param2: 'value2'
})
```

## Higher-Level Composables

### useLeagues
Feature-rich composable for league management.

```typescript
const { leagues, loading, error, fetchLeagues, filterBySport, searchLeagues } = useLeagues()

// Fetch all leagues
await fetchLeagues()

// Filter by sport
const soccerLeagues = filterBySport('Soccer')

// Search
const results = searchLeagues('premier')
```

### useLeagueBadge
Simplified badge fetching.

```typescript
const { fetchBadge, getLatestSeason } = useLeagueBadge()

// Get badge and seasons
const { badge, seasons } = await fetchBadge('4328')

// Get only latest season
const latestSeason = await getLatestSeason('4328')
```

## Examples

### Component Example

```vue
<template>
  <div>
    <h1>Leagues</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="league in leagues" :key="league.idLeague">
        <h3>{{ league.strLeague }}</h3>
        <p>{{ league.strSport }}</p>
        <img v-if="badges[league.idLeague]" :src="badges[league.idLeague]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { League } from '~/types'

const api = useApi()
const { fetchBadge } = useLeagueBadge()

const leagues = ref<League[]>([])
const badges = ref<Record<string, string>>({})
const loading = ref(false)

const loadLeagues = async (): Promise<void> => {
  loading.value = true
  try {
    const response = await api.getAllLeagues()
    leagues.value = response.leagues.slice(0, 10) // First 10
    
    // Load badges
    for (const league of leagues.value) {
      const { badge } = await fetchBadge(league.idLeague)
      if (badge) badges.value[league.idLeague] = badge
    }
  } catch (error) {
    console.error('Error loading leagues:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => loadLeagues())
</script>
```

### Composable Example

```typescript
// composables/useSoccerLeagues.ts
import type { League } from '~/types'

export const useSoccerLeagues = () => {
  const api = useApi()
  
  const soccerLeagues = ref<League[]>([])
  const loading = ref(false)

  const fetchSoccerLeagues = async (): Promise<void> => {
    loading.value = true
    try {
      const response = await api.getAllLeagues()
      soccerLeagues.value = response.leagues.filter(
        l => l.strSport === 'Soccer'
      )
    } catch (error) {
      console.error('Error:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    soccerLeagues: readonly(soccerLeagues),
    loading: readonly(loading),
    fetchSoccerLeagues
  }
}
```

## Configuration

API configuration is in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    theSportsDbApiKey: process.env.THESPORTSDB_API_KEY || '3',
    public: {
      theSportsDbBaseUrl: 'https://www.thesportsdb.com/api/v1/json',
      theSportsDbApiKey: process.env.THESPORTSDB_API_KEY || '3'
    }
  }
})
```

To use a different API key:
1. Set `THESPORTSDB_API_KEY` environment variable
2. Or update the default in `nuxt.config.ts`

## Types

All types are defined in `app/types/thesportsdb.ts` and exported from `app/types/index.ts`:

```typescript
import type { 
  League, 
  LeaguesResponse, 
  Season, 
  SeasonsWithBadgeResponse 
} from '~/types'
```

## Error Handling

All methods throw errors that should be caught:

```typescript
try {
  const response = await api.getAllLeagues()
  // Handle success
} catch (error) {
  console.error('API Error:', error)
  // Handle error - show message to user
}
```

## Rate Limits

- Free tier: 30 requests/minute
- API key `3` is used by default
- Implement caching for frequently accessed data

## Demo

See working demo at `/demo` page:

```bash
npm run dev
# Visit http://localhost:3000/demo
```

## Best Practices

1. **Always use `useApi`** - Never make direct API calls
2. **Use higher-level composables** - Build on `useApi` for features
3. **Handle errors** - Always wrap calls in try-catch
4. **Cache results** - Store frequently accessed data
5. **Type everything** - Use TypeScript types from `~/types`
6. **Limit results** - Don't load all data at once

## Files Created

- `app/composables/useApi.ts` - Central API composable
- `app/composables/useLeagues.ts` - Leagues management
- `app/composables/useLeagueBadge.ts` - Badge fetching
- `app/types/thesportsdb.ts` - API types
- `app/pages/demo.vue` - Working demo
- `nuxt.config.ts` - Updated with runtime config
