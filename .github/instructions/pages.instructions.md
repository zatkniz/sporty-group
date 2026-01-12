---
applyTo: "app/pages/**/*.vue"
---

# Pages & Routing Guidelines

## ⚠️ CRITICAL: TypeScript Requirements

- **ALWAYS use `lang="ts"`** in `<script setup>` tags
- **NEVER define types inline** - import from `app/types/`
- **ALWAYS use arrow functions** with explicit return types
- See `typescript.instructions.md` for full TypeScript standards

## File-Based Routing

Pages in this directory automatically create routes based on their file structure.

### Route Mapping

- `app/pages/index.vue` → `/`
- `app/pages/about.vue` → `/about`
- `app/pages/users/index.vue` → `/users`
- `app/pages/users/[id].vue` → `/users/:id` (dynamic route)
- `app/pages/users/[id]/edit.vue` → `/users/:id/edit`
- `app/pages/blog/[...slug].vue` → `/blog/*` (catch-all route)

### Page Structure

```vue
<script setup lang="ts">
// Define page metadata
definePageMeta({
  layout: 'default', // or 'custom'
  middleware: ['auth'], // route middleware
  // Other page-specific config
})

// SEO & Head tags
useHead({
  title: 'Page Title',
  meta: [
    { name: 'description', content: 'Page description' }
  ]
})

// Access route params (auto-imported)
const route = useRoute()
const id = route.params.id

// Data fetching (SSR-compatible)
const { data, error, pending } = await useFetch(`/api/users/${id}`)
</script>

<template>
  <div>
    <h1>Page Content</h1>
  </div>
</template>
```

### Data Fetching in Pages

**Use `useFetch` for API calls:**
```typescript
const { data, error, pending, refresh } = await useFetch('/api/endpoint')
```

**Use `useAsyncData` for custom logic:**
```typescript
const { data } = await useAsyncData('key', () => {
  // Custom async operation
  return fetchData()
})
```

### Navigation

```vue
<template>
  <!-- Declarative navigation -->
  <NuxtLink to="/about">About</NuxtLink>
  <NuxtLink :to="`/users/${userId}`">User Profile</NuxtLink>
</template>

<script setup lang="ts">
// Programmatic navigation
const router = useRouter()

function goToAbout() {
  router.push('/about')
}
</script>
```

### Best Practices

- **DO NOT** import Vue functions or composables - they're auto-imported
- **DO** use `definePageMeta` for page configuration
- **DO** use `useHead` for SEO and meta tags
- **DO** fetch data with `useFetch` or `useAsyncData` for SSR compatibility
- **DO** use `<NuxtLink>` for internal navigation
- Handle loading and error states properly
- Use middleware for authentication/authorization checks
- Keep page components lean - extract logic to composables
