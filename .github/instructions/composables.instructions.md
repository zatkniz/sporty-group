---
applyTo: "app/composables/**/*.ts,app/composables/**/*.js"
---

# Composables Guidelines

## Auto-Import Convention

Composables in this directory are **automatically imported** and available globally throughout the application.

### Naming & Structure

- **File**: `app/composables/useUser.ts` → **Use**: `const user = useUser()`
- Composable names should start with `use` (Vue convention)
- Export functions directly - they become globally available

### Example Composable

```typescript
// app/composables/useUser.ts

export const useUser = () => {
  // All Vue functions are auto-imported
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchUser = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await useFetch(`/api/users/${id}`)
      user.value = data.value
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    fetchUser
  }
}
```

### State Management with Composables

```typescript
// app/composables/useCounter.ts

// Global state shared across components
const count = ref(0)

export const useCounter = () => {
  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  return {
    count: readonly(count),
    increment,
    decrement
  }
}
```

### SSR-Compatible Composables

```typescript
// app/composables/useAuth.ts

export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => null)
  
  const login = async (credentials: Credentials) => {
    const { data } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
    user.value = data.value
  }

  const logout = async () => {
    await useFetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return {
    user,
    login,
    logout,
    isAuthenticated: computed(() => !!user.value)
  }
}
```

### Best Practices

- **DO NOT** import Vue functions (`ref`, `computed`, `watch`, etc.) - they're auto-imported
- **DO** prefix composable names with `use`
- **DO** export composables directly from the file
- **DO** use `useState` for SSR-safe shared state
- **DO** return readonly refs for state when appropriate
- **DO** handle loading and error states
- Keep composables focused on a single responsibility
- Document complex composables with JSDoc comments
- Use TypeScript for type safety

### Common Patterns

**Data Fetching Composable:**
```typescript
export const usePosts = () => {
  const { data, error, refresh } = useFetch('/api/posts')
  return { posts: data, error, refresh }
}
```

**Client-Only Composable:**
```typescript
export const useLocalStorage = (key: string, initialValue: string) => {
  const value = ref(initialValue)

  onMounted(() => {
    const stored = localStorage.getItem(key)
    if (stored) value.value = stored
  })

  watch(value, (newValue) => {
    localStorage.setItem(key, newValue)
  })

  return value
}
```

**Async Composable:**
```typescript
export const useAsyncUser = async (id: string) => {
  const { data } = await useAsyncData(`user-${id}`, () => 
    $fetch(`/api/users/${id}`)
  )
  return { user: data }
}
```
