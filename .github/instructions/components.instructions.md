---
applyTo: "app/components/**/*.vue"
---

# Vue Components Guidelines

## Auto-Import Convention

Components in this directory are **automatically imported** throughout the application.

### Naming & Usage

- **File**: `app/components/MyButton.vue` → **Use**: `<MyButton />`
- **Nested**: `app/components/form/Input.vue` → **Use**: `<FormInput />`
- Component names are automatically converted to PascalCase

### Component Structure

```vue
<script setup lang="ts">
// TypeScript props definition
interface Props {
  title: string
  count?: number
}

const props = defineProps<Props>()

// Use auto-imported composables without imports
const route = useRoute()
const config = useAppConfig()

// Emits
const emit = defineEmits<{
  click: [value: string]
}>()
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <!-- Use other auto-imported components -->
    <OtherComponent />
  </div>
</template>

<style scoped>
/* Component-scoped styles */
</style>
```

### Best Practices

- **DO NOT** import Vue functions (`ref`, `computed`, `watch`, etc.) - they're auto-imported
- **DO NOT** import components - they're auto-imported
- **DO** use TypeScript for props and emits
- **DO** use `<script setup>` syntax
- **DO** use composables directly without imports
- Keep components focused and reusable
- Use slots for flexible content composition
- Prefer composition API over options API

### Component Organization

- Place shared/common components directly in `app/components/`
- Use subdirectories for grouped components (e.g., `form/`, `layout/`, `ui/`)
- Subdirectory names become part of the component name: `form/Input.vue` → `<FormInput />`
