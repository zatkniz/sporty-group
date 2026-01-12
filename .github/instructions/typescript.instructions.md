---
applyTo: "**/*.ts,**/*.vue"
---

# TypeScript Guidelines

## ⚠️ CRITICAL RULES - NO EXCEPTIONS

**This project enforces STRICT TypeScript standards:**

1. ✅ **ALWAYS use TypeScript** - NEVER plain JavaScript for new code
2. ✅ **ALWAYS use `lang="ts"`** in Vue components `<script>` tags
3. ✅ **ALWAYS define types explicitly** - no implicit `any`
4. ✅ **ALWAYS use arrow functions** - no `function` keyword
5. ✅ **ALWAYS specify return types** on all functions
6. ✅ **ALWAYS export types from `app/types/`** - NEVER inline types
7. ❌ **NEVER define types/interfaces inside component files**
8. ❌ **NEVER define types/interfaces inside composables**
9. ❌ **NEVER use `any`** - use `unknown` if type is truly unknown

## Type Organization

### Central Types Location

**ALL types, interfaces, and type definitions MUST be in `app/types/`**

```
app/
  types/
    user.ts       # User-related types
    product.ts    # Product-related types
    api.ts        # API response types
    common.ts     # Shared/common types
    index.ts      # Re-export all types (optional)
```

### Type File Structure

```typescript
// app/types/user.ts

/**
 * User entity from the database
 */
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

/**
 * User role enumeration
 */
export type UserRole = 'admin' | 'user' | 'guest'

/**
 * Login credentials payload
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Login response from API
 */
export interface LoginResponse {
  user: User
  token: string
  expiresAt: Date
}

/**
 * User profile update payload
 */
export interface UserUpdatePayload {
  firstName?: string
  lastName?: string
  email?: string
}
```

### Type Exports

```typescript
// app/types/index.ts (optional - for convenient imports)

export * from './user'
export * from './product'
export * from './api'
export * from './common'
```

## Vue Components with TypeScript

### ✅ CORRECT: External Types, lang="ts", Return Types

```vue
<script setup lang="ts">
import type { User, Product } from '~/types'

// Props with external type
interface Props {
  user: User
  products: Product[]
  maxItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxItems: 10
})

// Emits with explicit types
const emit = defineEmits<{
  select: [product: Product]
  close: []
}>()

// Computed with return type
const filteredProducts = computed((): Product[] => {
  return props.products.slice(0, props.maxItems)
})

// Arrow function with return type
const handleSelect = (product: Product): void => {
  emit('select', product)
}

// Async arrow function with return type
const loadProducts = async (): Promise<Product[]> => {
  const { data } = await useFetch<Product[]>('/api/products')
  return data.value ?? []
}
</script>

<template>
  <div>
    <div v-for="product in filteredProducts" :key="product.id">
      {{ product.name }}
    </div>
  </div>
</template>
```

### ❌ WRONG: Inline Types, No Return Types

```vue
<script setup lang="ts">
// ❌ WRONG: Inline interface definition
interface Props {
  user: {  // ❌ Should import User type
    id: string
    email: string
  }
}

// ❌ WRONG: No return type
const getData = () => {
  return data
}

// ❌ WRONG: function keyword
function handleClick() {
  // ...
}

// ❌ WRONG: No lang="ts"
</script>
```

## Composables with TypeScript

### ✅ CORRECT: External Types, Arrow Functions, Return Types

```typescript
// app/composables/useUser.ts
import type { User, LoginCredentials, LoginResponse } from '~/types'

export const useUser = () => {
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)

  const login = async (credentials: LoginCredentials): Promise<User> => {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await useFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      if (!data.value) {
        throw new Error('No response from server')
      }
      
      user.value = data.value.user
      return data.value.user
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = (): void => {
    user.value = null
  }

  const isAuthenticated = computed((): boolean => {
    return user.value !== null
  })

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    login,
    logout,
    isAuthenticated
  }
}
```

### ❌ WRONG: Inline Types, No Return Types

```typescript
// app/composables/useUser.ts

// ❌ WRONG: Inline type
const login = async (credentials: { email: string; password: string }) => {
  // ❌ No return type
  // ...
}

// ❌ WRONG: function keyword
function logout() {
  // ...
}
```

## Utility Functions with TypeScript

### ✅ CORRECT: External Types, Arrow Functions, Return Types

```typescript
// app/utils/formatters.ts
import type { User, Product } from '~/types'

export const formatUserName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`
}

export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(price)
}

export const filterProductsByCategory = (
  products: Product[],
  category: string
): Product[] => {
  return products.filter((product: Product): boolean => 
    product.category === category
  )
}

export const groupProductsByCategory = (
  products: Product[]
): Record<string, Product[]> => {
  return products.reduce((acc: Record<string, Product[]>, product: Product) => {
    const category = product.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(product)
    return acc
  }, {})
}
```

### ❌ WRONG: No Types, No Return Types

```typescript
// ❌ WRONG
export const formatUserName = (user) => {  // No type, no return type
  return `${user.firstName} ${user.lastName}`
}

// ❌ WRONG: function keyword
function formatPrice(price, currency) {  // No types, no return type
  return price
}
```

## Pinia Stores with TypeScript

### ✅ CORRECT: External Types, Arrow Functions, Return Types

```typescript
// app/stores/cart.ts
import type { Product, CartItem } from '~/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const loading = ref<boolean>(false)

  const itemCount = computed((): number => items.value.length)
  
  const total = computed((): number => {
    return items.value.reduce((sum: number, item: CartItem): number => {
      return sum + item.price * item.quantity
    }, 0)
  })

  const addItem = (product: Product): void => {
    const existingItem = items.value.find((item: CartItem): boolean => 
      item.id === product.id
    )
    
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

  const removeItem = (itemId: string): void => {
    const index = items.value.findIndex((item: CartItem): boolean => 
      item.id === itemId
    )
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  const checkout = async (): Promise<void> => {
    loading.value = true
    try {
      await useFetch('/api/checkout', {
        method: 'POST',
        body: { items: items.value }
      })
      items.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    items: readonly(items),
    loading: readonly(loading),
    itemCount,
    total,
    addItem,
    removeItem,
    checkout
  }
})
```

## Type Definition Best Practices

### Use Descriptive Names

```typescript
// app/types/api.ts

// ✅ GOOD: Descriptive, clear purpose
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
}

// ❌ BAD: Vague names
export interface Response {  // Too generic
  data: any
}
```

### Use Type vs Interface Appropriately

```typescript
// app/types/common.ts

// Use TYPE for unions, primitives, tuples
export type Status = 'pending' | 'active' | 'completed' | 'cancelled'
export type ID = string | number
export type Coordinates = [number, number]

// Use INTERFACE for object shapes
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface Timestamped {
  createdAt: Date
  updatedAt: Date
}
```

### Extend and Compose Types

```typescript
// app/types/entities.ts
import type { BaseEntity, Timestamped } from '~/types/common'

// Extend interfaces
export interface User extends BaseEntity {
  email: string
  firstName: string
  lastName: string
}

// Compose types
export interface Product extends BaseEntity, Timestamped {
  name: string
  price: number
  category: string
}

// Pick and Omit
export type UserWithoutId = Omit<User, 'id'>
export type UserPublicInfo = Pick<User, 'firstName' | 'lastName'>
```

### Generic Types

```typescript
// app/types/api.ts

export interface ApiResponse<T> {
  data: T
  error: string | null
  status: number
}

export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  hasMore: boolean
}

// Usage
const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
  // Implementation
}

const fetchProducts = async (): Promise<PaginatedData<Product>> => {
  // Implementation
}
```

## Type Guards and Narrowing

```typescript
// app/utils/typeGuards.ts
import type { User, Product } from '~/types'

export const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    typeof (obj as User).email === 'string'
  )
}

export const isProduct = (obj: unknown): obj is Product => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'price' in obj &&
    typeof (obj as Product).price === 'number'
  )
}
```

## Error Handling with Types

```typescript
// app/types/errors.ts

export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: Record<string, string[]>
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly fields: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Usage in composables
import type { ApiError } from '~/types/errors'

export const useApi = () => {
  const handleError = (error: unknown): ApiError => {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'UNKNOWN_ERROR',
        statusCode: 500
      }
    }
    
    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 500
    }
  }

  return { handleError }
}
```

## Common Type Patterns

### Form Data

```typescript
// app/types/forms.ts

export interface FormField<T = string> {
  value: T
  error: string | null
  touched: boolean
  dirty: boolean
}

export interface LoginFormData {
  email: FormField<string>
  password: FormField<string>
}

export interface ProductFormData {
  name: FormField<string>
  price: FormField<number>
  category: FormField<string>
  inStock: FormField<boolean>
}
```

### State Management

```typescript
// app/types/state.ts

export interface LoadingState {
  isLoading: boolean
  error: Error | null
}

export interface DataState<T> extends LoadingState {
  data: T | null
}

export interface PaginationState {
  page: number
  perPage: number
  total: number
  hasMore: boolean
}
```

## tsconfig.json Standards

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Important Notes

- **ALL types MUST be exported from `app/types/`**
- **NEVER define types inline** in components, composables, or utilities
- **ALWAYS use `lang="ts"`** in Vue `<script>` tags
- **ALWAYS use arrow functions** with explicit return types
- **NEVER use `any`** - use proper types or `unknown`
- **Type imports** use `import type` for clarity
- Use **JSDoc comments** for complex types
- Prefer **explicit over implicit** - always specify types

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vue TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [Nuxt TypeScript Support](https://nuxt.com/docs/guide/concepts/typescript)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
