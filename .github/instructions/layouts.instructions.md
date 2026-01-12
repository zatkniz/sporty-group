---
applyTo: "app/layouts/**/*.vue"
---

# Layouts Guidelines

## ⚠️ CRITICAL: TypeScript Requirements

- **ALWAYS use `lang="ts"`** in `<script setup>` tags
- **NEVER define types inline** - import from `app/types/`
- **ALWAYS use arrow functions** with explicit return types
- See `typescript.instructions.md` for full TypeScript standards

## Layout System

Layouts wrap pages and provide common structure/UI elements across multiple pages.

### Default Layout

- `app/layouts/default.vue` is automatically applied to all pages
- Must contain `<slot />` to render page content

```vue
<!-- app/layouts/default.vue -->
<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
      </nav>
    </header>
    
    <main>
      <!-- Page content renders here -->
      <slot />
    </main>
    
    <footer>
      <p>&copy; 2026 My App</p>
    </footer>
  </div>
</template>
```

### Custom Layouts

Create additional layouts for different page types:

```vue
<!-- app/layouts/dashboard.vue -->
<template>
  <div class="dashboard-layout">
    <aside>
      <DashboardNav />
    </aside>
    <main>
      <slot />
    </main>
  </div>
</template>
```

Apply custom layout in pages:

```vue
<!-- app/pages/dashboard.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
</script>
```

### Dynamic Layout

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
const layout = computed(() => {
  return useAuth().isAuthenticated ? 'dashboard' : 'default'
})

definePageMeta({
  layout: false // Disable automatic layout
})
</script>

<template>
  <NuxtLayout :name="layout">
    <div>Page content</div>
  </NuxtLayout>
</template>
```

### Layout with Props

```vue
<!-- app/layouts/custom.vue -->
<script setup lang="ts">
interface Props {
  title?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <slot />
  </div>
</template>
```

Usage:
```vue
<template>
  <NuxtLayout name="custom" title="My Page">
    <div>Content</div>
  </NuxtLayout>
</template>
```

### Best Practices

- **ALWAYS** include `<slot />` in layouts
- **DO NOT** import components - they're auto-imported
- Keep layouts simple and focused on structure
- Use `<NuxtPage />` in `app.vue` to render pages with layouts
- Common UI elements (headers, footers, sidebars) belong in layouts
- Page-specific content belongs in pages, not layouts
- Use `definePageMeta({ layout: false })` to disable layout for a page

### Common Layout Patterns

**Authentication-based Layout:**
```vue
<script setup lang="ts">
const { isAuthenticated } = useAuth()
</script>

<template>
  <div>
    <header v-if="isAuthenticated">
      <UserMenu />
    </header>
    <header v-else>
      <LoginButton />
    </header>
    
    <slot />
  </div>
</template>
```

**Nested Layouts:**
```vue
<!-- app/layouts/admin.vue -->
<template>
  <div class="admin">
    <AdminHeader />
    <div class="admin-content">
      <slot />
    </div>
  </div>
</template>
```
