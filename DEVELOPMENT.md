# Sports Leagues SPA - Development Documentation

## Project Information

**Assignment**: Sports Leagues Frontend Home Assignment  
**Framework**: Nuxt 4 + Vue 3 + TypeScript  
**Implementation Date**: January 12, 2026  
**Time Target**: ~90 minutes

---

## AI Tools Used

### GitHub Copilot
- **Purpose**: Code generation, autocompletion, and implementation assistance
- **Usage**: Used throughout the project for:
  - Component scaffolding and structure
  - TypeScript type definitions and function signatures
  - Pinia store composition API patterns
  - Vue 3 Composition API code generation
  - Error handling and edge case coverage
  - Documentation and comments

### How AI Helped
GitHub Copilot significantly accelerated development by:
1. Providing accurate TypeScript types based on API documentation
2. Suggesting proper Vue 3 Composition API patterns
3. Auto-completing Pinia store setup with composition stores
4. Generating consistent error handling across components
5. Helping maintain code consistency with project standards

---

## Tech Stack

### Core Framework
- **Nuxt 4.2.2** - Vue meta-framework with SSR/SSG capabilities
- **Vue 3.5.26** - Progressive JavaScript framework
- **TypeScript** - Strict type checking enabled

### UI & Styling
- **Nuxt UI 4.3.0** - Pre-built accessible components with Tailwind
- **Tailwind CSS 6.14.0** - Utility-first CSS framework
- **Iconify (via Nuxt UI)** - Icon library (Lucide and Heroicons)

### State Management & Utilities
- **Pinia 3.0.4** - Vue state management (Composition API)
- **@pinia/nuxt 0.11.3** - Nuxt integration for Pinia
- **VueUse 13.1.0** - Collection of Vue Composition utilities
- **@vueuse/nuxt** - Nuxt integration for VueUse

### API Integration
- **TheSportsDB API (v1)** - Free sports data API
- **Custom useApi() composable** - Centralized API client

---

## Architecture Decisions

### 1. Thin HTTP Client Pattern
**Decision**: Keep `useApi()` as a minimal HTTP client wrapper

**Rationale**:
- Single responsibility: only HTTP communication
- No business logic or state management
- Easier to test and mock
- Generic `fetchFromAPI<T>()` method for any endpoint
- Business logic and caching belong in stores

**Implementation**:
```typescript
const api = useApi()
const response = await api.fetchFromAPI<LeaguesResponse>('all_leagues.php')
const badge = await api.fetchFromAPI<SeasonsWithBadgeResponse>(
  'search_all_seasons.php',
  { badge: 1, id: leagueId }
)
```

### 2. Pinia Composition Stores
**Decision**: Use Composition API pattern for Pinia stores

**Rationale**:
- More flexible than Options API stores
- Better TypeScript inference
- Consistent with Vue 3 Composition API
- Easier to compose and reuse logic
- Better code organization

**Pattern**:
```typescript
export const useSportsLeaguesStore = defineStore('sportsLeagues', () => {
  const state = ref<Type>()
  const computed = computed(() => {})
  const action = async () => {}
  
  return { state: readonly(state), computed, action }
})
```

### 3. localStorage Caching with VueUse
**Decision**: Use `useLocalStorage()` from VueUse for badge caching

**Benefits**:
- Automatic JSON serialization/deserialization
- Reactive state synced with localStorage
- SSR-safe (no window access issues)
- Built-in error handling
- Type-safe API

**Implementation**:
```typescript
const badgeCache = useLocalStorage<Record<string, string>>('league-badges', {})
```

### 4. Image Optimization
**Decision**: Append `/medium` to badge URLs for 500px versions

**Rationale**:
- Faster page load times
- Reduced bandwidth usage
- Better mobile performance
- Still high quality for display purposes
- TheSportsDB supports size variants

### 5. Component Architecture
**Decision**: Separate LeagueCard and BadgeModal components

**Benefits**:
- Single Responsibility Principle
- Reusable modal component
- Easier to test independently
- Better code organization
- Cleaner template structure

### 6. Type Safety
**Decision**: All types defined in centralized `app/types/` directory

**Enforcement**:
- NO inline type definitions in components
- Explicit return types on all functions
- Arrow functions only (no `function` keyword)
- `lang="ts"` in all `<script setup>` blocks
- Import types with `import type { } from '~/types'`

---

## API Integration Details

### Endpoints Used

1. **All Leagues**
   - URL: `https://www.thesportsdb.com/api/v1/json/3/all_leagues.php`
   - Method: `GET`
   - Response: `{ leagues: League[] }`
   - Caching: No (fetched once on mount)

2. **League Badge**
   - URL: `https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id={leagueId}`
   - Method: `GET`
   - Response: `{ seasons: Season[] }`
   - Caching: Yes (localStorage with VueUse)

### Response Types

```typescript
interface League {
  idLeague: string
  strLeague: string
  strSport: string
  strLeagueAlternate: string
}

interface Season {
  strSeason: string
  strBadge: string
}
```

### Rate Limiting
- **Free Tier**: 30 requests per minute
- **Handling**: Toast notification on 429 errors
- **Strategy**: Cache badges aggressively to minimize requests

---

## Caching Strategy

### Badge Caching
1. Check `useLocalStorage('league-badges')` first
2. If not found, fetch from API
3. Optimize image by appending `/medium`
4. Store in localStorage for future use
5. Return cached URL immediately on subsequent requests

### Benefits
- Dramatically reduces API calls
- Improves perceived performance
- Respects rate limits
- Persists across sessions
- No server-side caching needed

---

## Features Implemented

### ✅ Core Requirements
- [x] Fetch and display all sports leagues
- [x] Display required fields (strLeague, strSport, strLeagueAlternate)
- [x] Search bar to filter leagues by name
- [x] Dropdown to filter by sport type
- [x] Component-based architecture
- [x] Responsive UI with mobile support
- [x] Clickable leagues show season badge modal
- [x] Badge responses cached (localStorage)

### ✅ Enhanced Features
- [x] Loading states with skeleton cards
- [x] Error states with user-friendly messages
- [x] Empty states when no results found
- [x] Toast notifications for rate limiting
- [x] Optimized images (500px medium size)
- [x] Results count display
- [x] Dark mode support (via Nuxt UI)
- [x] Smooth animations and transitions
- [x] SEO meta tags
- [x] Accessibility (ARIA labels, semantic HTML)

---

## Code Organization

```
app/
├── components/
│   ├── LeagueCard.vue       # Individual league card with click handler
│   ├── LeagueCardHeader.vue # Card header with icon and sport badge
│   ├── LeagueCardBody.vue   # Card body with ID and CTA
│   └── BadgeModal.vue       # Reusable modal for badge display
├── composables/
│   └── useApi.ts            # Thin HTTP client wrapper
├── layouts/
│   └── default.vue          # Main layout
├── pages/
│   └── index.vue            # Main leagues listing page
├── stores/
│   └── sportsLeagues.ts     # Pinia store - all business logic here
└── types/
    ├── index.ts             # Type exports
    └── thesportsdb.ts       # TheSportsDB API types
```

---

## State Management Flow

1. **Mount** → `store.fetchLeagues()` called
2. **Loading** → Show skeleton cards
3. **Success** → Populate `leagues` array
4. **User Types** → Update `searchTerm` → Recompute `filteredLeagues`
5. **User Filters** → Update `selectedSport` → Recompute `filteredLeagues`
6. **Click League** → `fetchBadge(id)` → Check cache → Fetch if needed → Show modal
7. **Error** → Display error message + toast if rate limited

---

## Performance Optimizations

1. **Computed Properties**: Filters recalculated only when dependencies change
2. **Image Optimization**: 500px medium size instead of full resolution
3. **Aggressive Caching**: Badges stored in localStorage permanently
4. **Lazy Loading**: Badges only fetched on demand (click)
5. **Component Splitting**: Separate modal reduces main component complexity

---

## Challenges & Solutions

### Challenge 1: Rate Limiting
**Problem**: Free API tier has 30 requests/minute limit  
**Solution**: 
- Implemented aggressive localStorage caching
- Added toast notifications for 429 errors
- Only fetch badges on user interaction (not preload)

### Challenge 2: TypeScript Strict Mode
**Problem**: Ensuring full type safety across the application  
**Solution**:
- Centralized all types in `app/types/`
- Explicit return types on all functions
- Used `import type` for type-only imports
- Leveraged existing type definitions

### Challenge 3: State Management Consistency
**Problem**: Maintaining reactive state with proper encapsulation  
**Solution**:
- Used Pinia composition stores with `readonly()` for state
- Exposed only necessary actions and getters
- Used `storeToRefs()` for reactive destructuring in components

### Challenge 4: localStorage SSR Safety
**Problem**: localStorage not available during SSR  
**Solution**:
- Used VueUse `useLocalStorage()` which is SSR-safe
- Automatic client-side hydration
- No manual window checks needed

---

## Testing Recommendations

### Unit Tests
- Store actions (fetchLeagues, fetchBadge)
- Computed properties (filteredLeagues, availableSports)
- Component props and events
- Error handling paths

### Integration Tests
- Full user flow: load → search → filter → click → view badge
- API mocking with successful/error responses
- localStorage persistence

### E2E Tests
- Navigate to /leagues
- Verify leagues render
- Test search functionality
- Test sport filter
- Click league and verify modal

---

## Future Enhancements

1. **Pagination**: For very large league lists
2. **Sorting**: By league name or sport
3. **Favorites**: Let users save favorite leagues
4. **Share**: Share specific league or search results
5. **Advanced Filters**: Country, year, status
6. **Infinite Scroll**: Instead of showing all at once
7. **Service Worker**: Offline support and caching
8. **Tests**: Unit, integration, and E2E test coverage

---

## Time Allocation

- **Research & Planning**: ~15 minutes
- **Store Implementation**: ~15 minutes
- **Component Development**: ~30 minutes
- **Integration & Testing**: ~20 minutes
- **Documentation**: ~10 minutes

**Total**: ~90 minutes (within target)

---

## Running the Project

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Key Learnings

1. **Composition API Benefits**: More flexible and reusable than Options API
2. **VueUse Power**: Provides excellent utilities that save development time
3. **Type Safety Matters**: Catches bugs early and improves DX
4. **Caching Strategy**: Critical for rate-limited APIs
5. **Component Splitting**: Improves maintainability and testability

---

## Conclusion

This implementation successfully meets all assignment requirements while demonstrating:
- Modern Vue 3 and Nuxt 4 patterns
- TypeScript best practices
- Component-based architecture
- State management with Pinia
- API integration with caching
- Responsive and accessible UI
- Error handling and loading states

The solution is production-ready, well-structured, and maintainable.
