# useApi Composable - TheSportsDB Integration

Thin HTTP client wrapper for TheSportsDB API interactions in the Sporty Group project.

## Architecture

**useApi is a lightweight HTTP client** - it provides:
- Base URL configuration
- Generic `fetchFromAPI<T>()` method
- Error logging

**Business logic lives in stores** - data fetching, caching, and state management should be in Pinia stores, not in useApi.

## Quick Start

```typescript
// In a Pinia store or composable
const api = useApi()

// Generic API call
const response = await api.fetchFromAPI<LeaguesResponse>('all_leagues.php')
const leagues = response.leagues

// With parameters
const badgeData = await api.fetchFromAPI<SeasonsWithBadgeResponse>(
  'search_all_seasons.php',
  { badge: 1, id: '4328' }
)
```

## Available Methods

### `baseURL`
Computed property for the API base URL.

```typescript
const api = useApi()
console.log(api.baseURL.value)
// "https://www.thesportsdb.com/api/v1/json/3"
```

### `fetchFromAPI<T>(endpoint, params?)`
Generic method for making API calls.

```typescript
const api = useApi()

// Simple call
const data = await api.fetchFromAPI<LeaguesResponse>('all_leagues.php')

// With parameters
const data = await api.fetchFromAPI<CustomResponse>(
  'custom_endpoint.php',
  { param1: 'value1', param2: 123 }
)
```

## Higher-Level Usage

### Using Stores (Recommended)
For data fetching with state management, use Pinia stores.

```typescript
// app/stores/sportsLeagues.ts
export const useSportsLeaguesStore = defineStore('sportsLeagues', () => {
  const leagues = ref<League[]>([])
  const loading = ref(false)
  
  const fetchLeagues = async (): Promise<void> => {
    loading.value = true
    try {
      const api = useApi()
      const response = await api.fetchFromAPI<LeaguesResponse>('all_leagues.php')
      leagues.value = response.leagues
    } finally {
      loading.value = false
    }
  }
  
  return { leagues: readonly(leagues), loading: readonly(loading), fetchLeagues }
})

// In component
const store = useSportsLeaguesStore()
await store.fetchLeagues()
```

### Using the Store for Badges
Badge fetching with caching is handled by the store.

```typescript
// In a component
const store = useSportsLeaguesStore()

// Fetch badge (uses localStorage cache automatically)
const badgeUrl = await store.fetchBadge(leagueId)
```

## Examples

### Store Example (Recommended)

```typescript
// app/stores/myLeagues.ts
import type { League, LeaguesResponse } from '~/types'

export const useMyLeaguesStore = defineStore('myLeagues', () => {
  const api = useApi()
  const leagues = ref<League[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchLeagues = async (): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.fetchFromAPI<LeaguesResponse>('all_leagues.php')
      leagues.value = response.leagues
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch'
    } finally {
      loading.value = false
    }
  }

  return {
    leagues: readonly(leagues),
    loading: readonly(loading),
    error: readonly(error),
    fetchLeagues
  }
})
```

### Component Using Store

```vue
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-for="league in leagues" :key="league.idLeague">
        {{ league.strLeague }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useMyLeaguesStore()
const { leagues, loading, error } = storeToRefs(store)

onMounted(() => store.fetchLeagues())
</script>
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

1. **Keep useApi thin** - Only HTTP client logic, no business logic
2. **Use stores for state** - Data fetching with state management belongs in Pinia stores
3. **Use composables for logic** - Reusable logic without state in composables
4. **Always use `fetchFromAPI`** - Never make direct $fetch calls to TheSportsDB
5. **Handle errors** - Always wrap calls in try-catch
6. **Type everything** - Use TypeScript types from `~/types`
7. **Cache in stores** - Implement caching logic in stores, not in useApi

## Files Created

- `app/composables/useApi.ts` - Central API composable
- `app/stores/sportsLeagues.ts` - Main leagues store with business logic (includes badge fetching)
- `app/types/thesportsdb.ts` - API types
- `app/pages/demo.vue` - Working demo
- `nuxt.config.ts` - Updated with runtime config
