---
applyTo: "nuxt.config.ts"
---

# Nuxt Configuration Guidelines

## Single Source of Truth

`nuxt.config.ts` is the single source of configuration for the entire Nuxt application.

### Basic Structure

```typescript
export default defineNuxtConfig({
  // App configuration
  app: {
    head: {
      title: 'My App',
      meta: [
        { name: 'description', content: 'My app description' }
      ]
    }
  },

  // Runtime configuration
  runtimeConfig: {
    // Private keys (server-only)
    apiSecret: process.env.API_SECRET,
    
    // Public keys (client-exposed)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  // Modules
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: true
  },

  // Rendering mode
  ssr: true, // or false for SPA

  // Vite configuration
  vite: {
    vue: {
      // Vue plugin options
    }
  }
})
```

### Runtime Config

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    // Server-only variables
    databaseUrl: '', // Set via NUXT_DATABASE_URL env var
    apiSecret: '',   // Set via NUXT_API_SECRET env var
    
    // Public variables (exposed to client)
    public: {
      apiBase: '/api',        // Set via NUXT_PUBLIC_API_BASE
      siteUrl: 'https://example.com'
    }
  }
})
```

Access in code:
```typescript
const config = useRuntimeConfig()
console.log(config.public.apiBase) // Client & Server
console.log(config.apiSecret)      // Server only
```

### Environment Variables

Create `.env` file in project root:
```ini
NUXT_DATABASE_URL=postgresql://localhost/db
NUXT_API_SECRET=secret123
NUXT_PUBLIC_API_BASE=https://api.example.com
```

### Route Rules

```typescript
export default defineNuxtConfig({
  routeRules: {
    // Static generation
    '/': { prerender: true },
    
    // SPA mode for specific routes
    '/admin/**': { ssr: false },
    
    // API routes with caching
    '/api/posts': { 
      cache: { maxAge: 60 * 10 } // 10 minutes
    },
    
    // ISR (Incremental Static Regeneration)
    '/blog/**': { 
      isr: 60 * 60 // Revalidate every hour
    },
    
    // Redirect
    '/old-path': { redirect: '/new-path' }
  }
})
```

### Modules Configuration

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  // Module-specific configuration
  ui: {
    // @nuxt/ui options
  },

  tailwindcss: {
    // Tailwind options
  }
})
```

### Build Configuration

```typescript
export default defineNuxtConfig({
  // Nitro configuration
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true
  },

  // Build optimization
  build: {
    transpile: ['some-package']
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['dependency']
    }
  }
})
```

### Auto-Import Configuration

```typescript
export default defineNuxtConfig({
  // Disable auto-imports if needed
  imports: {
    autoImport: true // or false to disable
  },

  // Configure component auto-import
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false
      }
    ]
  }
})
```

### Environment-Specific Configuration

```typescript
export default defineNuxtConfig({
  // Production-only config
  $production: {
    routeRules: {
      '/**': { isr: true }
    }
  },

  // Development-only config
  $development: {
    devtools: { enabled: true }
  },

  // Custom environment
  $env: {
    staging: {
      // Staging-specific config
    }
  }
})
```

Run with: `nuxt build --envName staging`

### Best Practices

- **DO** use environment variables for secrets
- **DO** use `runtimeConfig.public` for client-exposed values
- **DO** use `app.config.ts` for public build-time configuration
- **DO** configure modules in this file, not separate config files
- **DO NOT** commit `.env` file to version control
- **DO NOT** put sensitive data in `public` config
- Document all configuration options
- Use TypeScript for type-safe configuration
- Keep configuration organized and commented

### Common Configurations

**SSR/SSG/SPA:**
```typescript
export default defineNuxtConfig({
  ssr: true,        // SSR (default)
  // ssr: false,    // SPA
  // Generate static: `nuxt generate`
})
```

**Custom Aliases:**
```typescript
export default defineNuxtConfig({
  alias: {
    '@components': '~/components',
    '@utils': '~/utils'
  }
})
```

**SEO:**
```typescript
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Default Title',
      meta: [
        { name: 'description', content: 'Default description' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
```
