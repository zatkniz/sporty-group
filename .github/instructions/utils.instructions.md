---
applyTo: "app/utils/**/*.ts,app/utils/**/*.js"
---

# Utils Guidelines

## ⚠️ CRITICAL: TypeScript Requirements

- **ALWAYS use TypeScript** (`.ts` files only)
- **NEVER define types inline** - import from `app/types/`
- **ALWAYS use arrow functions** with explicit return types
- **ALWAYS specify types** for parameters and return values
- See `typescript.instructions.md` for full TypeScript standards

## Auto-Import Convention

Utility functions in this directory are **automatically imported** and available globally.

### Naming & Structure

- **File**: `app/utils/formatDate.ts` → **Use**: `formatDate(date)`
- Export functions directly - they become globally available
- Keep utilities pure and focused on single responsibility

### Example Utilities

```typescript
// app/utils/formatDate.ts

export const formatDate = (date: Date | string, format: string = 'long'): string => {
  const d = new Date(date)
  
  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return d.toLocaleDateString('en-US')
}

export const formatTime = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
```

```typescript
// app/utils/validation.ts

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}
```

```typescript
// app/utils/string.ts

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

### Best Practices

- **DO** export functions directly
- **DO** use TypeScript for type safety
- **DO** keep utilities pure (no side effects)
- **DO** write unit tests for utilities
- **DO** document complex utilities with JSDoc
- **DO NOT** use browser-only APIs (use composables for that)
- **DO NOT** import Vue functions - use composables instead
- Keep functions small and focused
- Group related utilities in the same file
- Use descriptive function names

### Utility Categories

**String Manipulation:**
```typescript
export const camelCase = (str: string): string => { /* ... */ }
export const kebabCase = (str: string): string => { /* ... */ }
export const snakeCase = (str: string): string => { /* ... */ }
```

**Number Formatting:**
```typescript
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}
```

**Array Utilities:**
```typescript
export const unique = <T>(arr: T[]): T[] => {
  return [...new Set(arr)]
}

export const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
  return arr.reduce((result, item) => {
    const group = String(item[key])
    if (!result[group]) result[group] = []
    result[group].push(item)
    return result
  }, {} as Record<string, T[]>)
}
```

**Object Utilities:**
```typescript
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key]
    return result
  }, {} as Pick<T, K>)
}

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}
```

### Usage in Components

```vue
<script setup lang="ts">
// Utils are auto-imported - no need to import
const formattedDate = formatDate(new Date())
const email = 'user@example.com'
const isValid = isValidEmail(email)
</script>

<template>
  <div>
    <p>{{ formatDate(new Date()) }}</p>
    <p>{{ capitalize('hello world') }}</p>
    <p>{{ formatCurrency(1234.56) }}</p>
  </div>
</template>
```
