# Nuxt 4 Project - Sporty Group

## Project Overview

This is a Nuxt 4 application using Vue 3, TypeScript, and modern web development practices. The project leverages Nuxt's conventions and auto-import features for a streamlined development experience.

## Tech Stack

- **Framework**: Nuxt 4.x
- **UI Library**: Nuxt UI (Tailwind CSS + Reka UI)
- **State Management**: Pinia (via @pinia/nuxt)
- **Language**: TypeScript (strict mode, arrow functions only, explicit types)
- **Runtime**: Node.js 20.x+
- **Package Manager**: npm/yarn/pnpm (check package.json for lock file)
- **Build Tool**: Vite (default in Nuxt 4)
- **Server Engine**: Nitro

## Directory Structure

### Core Directories

- **`app/`** - Main application directory (Nuxt 4 uses `app/` by default, not root-level)
  - `app.vue` - Main application entry point
  - `pages/` - File-based routing (each file = route)
  - `components/` - Auto-imported Vue components
  - `composables/` - Auto-imported composables (Vue Composition API functions)
  - `stores/` - Auto-imported Pinia stores (state management)
  - `types/` - TypeScript type definitions (MUST be centralized here)
  - `layouts/` - Layout wrappers for pages
  - `assets/` - Uncompiled assets (CSS, images processed by build tool)
  - `middleware/` - Route middleware
  - `plugins/` - Vue plugins
  - `utils/` - Auto-imported utility functions
  - `app.config.ts` - Public app configuration (build-time)

- **`server/`** - Server-side code (Nitro)
  - `api/` - API routes (auto-registered)
  - `middleware/` - Server middleware
  - `routes/` - Server routes
  - `plugins/` - Server plugins
  - `utils/` - Server utilities

- **`public/`** - Static files served at root (e.g., `robots.txt`)

- **Root Files**
  - `nuxt.config.ts` - Nuxt configuration (single source of truth)
  - `tsconfig.json` - TypeScript configuration (auto-generated, rarely modified)
  - `package.json` - Dependencies and scripts

## Key Conventions

### Auto-Imports

**Components** (`app/components/`)
- Automatically imported, no need for explicit imports
- File: `app/components/MyButton.vue` → Use: `<MyButton />`
- Nested: `app/components/form/Input.vue` → Use: `<FormInput />`
- PascalCase conversion: filename → component name

**Nuxt UI Components**
- All Nuxt UI components auto-imported with `U` prefix
- Examples: `<UButton>`, `<UCard>`, `<UModal>`, `<UInput>`
- No imports needed - use directly in templates
- See `nuxt-ui.instructions.md` for full component list and usage

**Composables** (`app/composables/`)
- Automatically imported functions
- File: `app/composables/useUser.ts` → Use: `const user = useUser()`
- Export functions directly, they'll be available globally

**Utils** (`app/utils/`)
- Auto-imported utility functions
- File: `app/utils/formatDate.ts` → Use: `formatDate(date)`

**Stores** (`app/stores/`)
- Auto-imported Pinia stores
- File: `app/stores/user.ts` → Use: `const userStore = useUserStore()`
- Export stores using `defineStore()`, they'll be available globally

**Types** (`app/types/`)
- ALL TypeScript types, interfaces, and type definitions
- File: `app/types/user.ts` → Import: `import type { User } from '~/types'`
- NEVER define types inline in components or composables
- Always export all types from this directory

### Routing

**File-based routing** (`app/pages/`)
- `app/pages/index.vue` → `/`
- `app/pages/about.vue` → `/about`
- `app/pages/users/[id].vue` → `/users/:id` (dynamic route)
- `app/pages/users/index.vue` → `/users`
- Use `<NuxtPage />` in `app.vue` to render pages

**Layouts** (`app/layouts/`)
- `app/layouts/default.vue` → Applied by default
- `app/layouts/custom.vue` → Use with `definePageMeta({ layout: 'custom' })`
- Layouts must contain `<slot />` to render page content

### Server API

**API Routes** (`server/api/`)
- `server/api/users.ts` → `/api/users`
- `server/api/users/[id].ts` → `/api/users/:id`
- Export `defineEventHandler()` to handle requests

## Build & Development Commands

### Development
```bash
npm run dev          # Start dev server at http://localhost:3000
npm run dev -- -o    # Start dev server and open in browser
```

### Build & Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run generate     # Generate static site (SSG)
```

### Linting & Type Checking
```bash
npm run lint         # Run ESLint (if configured)
npm run typecheck    # Run TypeScript type checking (if script exists)
```

**Note**: Always run `npm install` before building if dependencies changed.

## Configuration

### Runtime Config (`nuxt.config.ts`)
- Use `runtimeConfig` for environment variables
- Server-only: `runtimeConfig.apiSecret`
- Client-exposed: `runtimeConfig.public.apiBase`
- Access with: `useRuntimeConfig()`

### App Config (`app/app.config.ts`)
- Use for public, build-time configuration
- Theme settings, titles, non-sensitive config
- Access with: `useAppConfig()`

## Common Patterns

### Data Fetching
```typescript
// Use useFetch for API calls (SSR-compatible)
const { data, error, pending } = await useFetch('/api/users')

// Use useAsyncData for custom async operations
const { data } = await useAsyncData('users', () => fetchUsers())
```

### Page Meta
```typescript
definePageMeta({
  layout: 'custom',
  middleware: 'auth'
})
```

### SEO & Head Management
```typescript
useHead({
  title: 'Page Title',
  meta: [
    { name: 'description', content: 'Page description' }
  ]
})
```

## Important Notes

### TypeScript (CRITICAL)
- **ALWAYS use `lang="ts"`** in Vue components `<script>` tags
- **ALL types MUST be in `app/types/`** - NEVER inline types
- **ALWAYS use arrow functions** - no `function` keyword
- **ALWAYS specify return types** on all functions
- **ALWAYS explicit types** - no implicit `any`
- Don't import Nuxt UI components - they're auto-imported with `U` prefix
- Types are auto-generated in `.nuxt/` directory
- No need to import Vue types, they're globally available
- Import types with: `import type { User } from '~/types'`

### Imports
- Don't import Vue functions (`ref`, `computed`, etc.) - they're auto-imported
- Don't import composables/components from `app/` - they're auto-imported
- Only import third-party packages or relative imports outside auto-import dirs

### Rendering Modes
- Default: **SSR** (Server-Side Rendering)
- Can configure per-route with `routeRules` in `nuxt.config.ts`
- SSG: `nuxt generate`
- SPA: Set `ssr: false` in `nuxt.config.ts`

## Troubleshooting

### Common Issues
1. **"Cannot find module"** for auto-imports
   - Restart dev server
   - Check file is in correct auto-import directory
   - Ensure proper export format

2. **Hydration mismatches**
   - Don't use browser-only APIs in template/setup
   - Use `<ClientOnly>` wrapper for client-only components
   - Check for date/time rendering differences between server/client

3. **Build failures**
   - Clear `.nuxt` directory: `rm -rf .nuxt`
   - Clear `node_modules` and reinstall
   - Check TypeScript errors with `nuxt typecheck`

## Additional Resources

- [Nuxt 4 Documentation](https://nuxt.com/docs/4.x)
- [Nuxt Modules](https://nuxt.com/modules)
- [Nuxt UI Documentation](https://ui.nuxt.com)
- [Nuxt UI Components](https://ui.nuxt.com/docs/components)
- [Pinia Documentation](https://pinia.vuejs.org)
- [Nitro Documentation](https://nitro.build)
- [TheSportsDB API Documentation](https://www.thesportsdb.com/documentation)
