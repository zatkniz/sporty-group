---
applyTo: "app/stores/**/*.ts,app/stores/**/*.js"
---

# Pinia Stores Guidelines

## ⚠️ IMPORTANT: Composition API Only

**This project uses EXCLUSIVELY Composition API (setup stores) pattern for all Pinia stores.**
- ✅ DO use: `defineStore('name', () => { ... })`
- ❌ DO NOT use: `defineStore('name', { state: ..., actions: ... })`

## Auto-Import Convention

Stores in this directory are **automatically imported** and available globally throughout the application via `@pinia/nuxt` module.

### Naming & Structure

- **File**: `app/stores/counter.ts` → **Use**: `const counter = useCounterStore()`
- Store names should end with `Store` and start with `use` (e.g., `useUserStore`, `useCartStore`)
- Use `defineStore()` to create stores
- Export stores directly - they become globally available

### Store Pattern: Composition API (Setup Stores)

**IMPORTANT**: This project uses **exclusively** Composition API setup stores. Do not use Option Stores pattern.

#### User Store Example

```typescript
// app/stores/user.ts

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const fullName = computed(() => 
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  )

  // Actions
  const login = async (credentials: Credentials) => {
    loading.value = true
    try {
      const { data } = await useFetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      user.value = data.value.user
      token.value = data.value.token
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
  }

  return {
    // State (readonly to prevent external mutations)
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    // Getters
    isAuthenticated,
    fullName,
    // Actions
    login,
    logout
  }
})
```

#### Cart Store Example

```typescript
// app/stores/cart.ts

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const loading = ref(false)

  // Getters
  const itemCount = computed(() => items.value.length)
  const total = computed(() => 
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )
  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  const addItem = (product: Product) => {
    const existingItem = items.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      })
    }
  }

  const removeItem = (itemId: string) => {
    const index = items.value.findIndex(item => item.id === itemId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      item.quantity = Math.max(0, quantity)
      if (item.quantity === 0) {
        removeItem(itemId)
      }
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const checkout = async () => {
    loading.value = true
    try {
      const { data } = await useFetch('/api/checkout', {
        method: 'POST',
        body: { items: items.value }
      })
      clearCart()
      return data.value
    } catch (error) {
      console.error('Checkout failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // State (readonly to prevent external mutations)
    items: readonly(items),
    loading: readonly(loading),
    // Getters
    itemCount,
    total,
    isEmpty,
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    checkout
  }
})
```

### Using Stores in Components

```vue
<script setup>
// Stores are auto-imported - no import needed
const userStore = useUserStore()
const cartStore = useCartStore()

// Access state
const user = computed(() => userStore.user)
const cartTotal = computed(() => cartStore.total)

// Call actions
const handleLogin = async (credentials) => {
  await userStore.login(credentials)
}

const handleAddToCart = (product) => {
  cartStore.addItem(product)
}

// Destructure with storeToRefs
const { itemCount, isEmpty } = storeToRefs(cartStore)
</script>

<template>
  <div>
    <div v-if="userStore.isAuthenticated">
      Welcome, {{ userStore.fullName }}!
    </div>
    
    <div>Cart: {{ itemCount }} items - ${{ cartStore.total }}</div>
    
    <UButton 
      @click="handleAddToCart(product)"
      :disabled="isEmpty"
    >
      Add to Cart
    </UButton>
  </div>
</template>
```

### SSR Considerations

#### State Hydration

Pinia automatically handles SSR hydration, but for sensitive data or server-only state:

```typescript
// app/stores/config.ts

export const useConfigStore = defineStore('config', () => {
  const config = ref<AppConfig | null>(null)

  // Only fetch on server during SSR
  const fetchConfig = async () => {
    if (import.meta.server && !config.value) {
      const { data } = await useFetch('/api/config')
      config.value = data.value
    }
  }

  return {
    config: readonly(config),
    fetchConfig
  }
})
```

#### Using Stores in Server Routes

```typescript
// server/api/user.ts

export default defineEventHandler(async (event) => {
  // Access stores in server context
  const userStore = useUserStore()
  
  return {
    user: userStore.user
  }
})
```

### Persisting State

For persisting state to localStorage/sessionStorage, use `pinia-plugin-persistedstate`:

```bash
npm i -D @pinia-plugin-persistedstate/nuxt
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt']
})
```

```typescript
// app/stores/preferences.ts

export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref<'light' | 'dark'>('light')
  const language = ref('en')

  return {
    theme,
    language
  }
}, {
  persist: true // Enable persistence
})
```

Or with custom options:

```typescript
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)

  return { token, user }
}, {
  persist: {
    storage: persistedState.localStorage,
    paths: ['token'], // Only persist token, not user
  }
})
```

### Module Organization

For larger stores, split logic into separate files:

```typescript
// app/stores/products/index.ts
export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)

  const fetchProducts = async () => {
    loading.value = true
    try {
      const { data } = await useFetch('/api/products')
      products.value = data.value
    } finally {
      loading.value = false
    }
  }

  return { 
    products: readonly(products), 
    loading: readonly(loading), 
    fetchProducts 
  }
})

// app/stores/products/filters.ts
export const useProductFiltersStore = defineStore('productFilters', () => {
  const category = ref<string | null>(null)
  const priceRange = ref<[number, number]>([0, 1000])

  const reset = () => {
    category.value = null
    priceRange.value = [0, 1000]
  }

  return { 
    category, 
    priceRange,
    reset 
  }
})
```

### Best Practices

1. **Always use Composition API (setup stores)** - this is the project standard
2. **Return readonly() for state** to prevent external mutations
3. **Use ref() for state** - reactive primitive values
4. **Use computed() for getters** - derived/computed values
5. **Keep actions as regular functions** - can be sync or async
6. **One store per domain** (user, cart, products, etc.)
7. **Avoid nested stores** - compose them at component level
8. **Use TypeScript** for type safety and autocompletion
9. **Test stores independently** - they're just composable functions
10. **Export readonly state** - actions can mutate, but consumers can't

### Common Patterns

#### Loading States

```typescript
export const useDataStore = defineStore('data', () => {
  const data = ref<Data[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const { data: response } = await useFetch('/api/data')
      data.value = response.value
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  return { 
    data: readonly(data), 
    loading: readonly(loading), 
    error: readonly(error), 
    fetchData 
  }
})
```

#### Store Composition

```typescript
export const useCheckoutStore = defineStore('checkout', () => {
  // Compose other stores
  const cartStore = useCartStore()
  const userStore = useUserStore()

  const canCheckout = computed(() => 
    !cartStore.isEmpty && userStore.isAuthenticated
  )

  const checkout = async () => {
    if (!canCheckout.value) {
      throw new Error('Cannot checkout')
    }

    const order = await cartStore.checkout()
    return order
  }

  return { canCheckout, checkout }
})
```

#### Resetting Store State

```typescript
export const useFormStore = defineStore('form', () => {
  const initialState = {
    name: '',
    email: '',
    message: ''
  }

  const form = ref({ ...initialState })

  const reset = () => {
    form.value = { ...initialState }
  }

  const submit = async () => {
    const { data } = await useFetch('/api/submit', {
      method: 'POST',
      body: form.value
    })
    reset()
    return data.value
  }

  return { form, reset, submit }
})
```

### Testing Stores

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '~/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
  })

  it('increments counter', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
    store.increment()
    expect(store.count).toBe(1)
  })

  it('resets counter', () => {
    const store = useCounterStore()
    store.increment()
    store.increment()
    expect(store.count).toBe(2)
    store.reset()
    expect(store.count).toBe(0)
  })
})
```

## Important Notes

- All Vue Composition API functions (`ref`, `computed`, `watch`) are auto-imported
- Pinia stores are automatically registered via `@pinia/nuxt` module
- Stores persist across navigation by default
- Use `storeToRefs()` to destructure reactive properties: `const { count } = storeToRefs(counterStore)`
- Don't destructure actions directly - they lose context: ❌ `const { increment } = counterStore`
- Do use actions from store object: ✅ `counterStore.increment()`
- Or destructure with spread: `const { increment } = counterStore` (actions work with spread)

## Additional Resources

- [Pinia Documentation](https://pinia.vuejs.org/)
- [Pinia Nuxt Module](https://pinia.vuejs.org/ssr/nuxt.html)
- [Pinia Setup Stores](https://pinia.vuejs.org/core-concepts/#setup-stores)
- [State Management Guide](https://nuxt.com/docs/getting-started/state-management)
- [Testing Pinia](https://pinia.vuejs.org/cookbook/testing.html)
