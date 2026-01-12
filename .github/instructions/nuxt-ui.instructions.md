---
applyTo: "**/*.vue"
---

# Nuxt UI Components Guidelines

## Using Nuxt UI

This project uses **@nuxt/ui** - a UI component library built with Tailwind CSS and Reka UI.

### Installation Check

Verify Nuxt UI is installed:
- Check `package.json` for `@nuxt/ui`
- Check `nuxt.config.ts` for `modules: ['@nuxt/ui']`
- Ensure `@import "@nuxt/ui"` is in CSS file

### Component Usage

All Nuxt UI components are **auto-imported** with the `U` prefix (configurable):

```vue
<template>
  <div>
    <!-- Form components -->
    <UButton>Click me</UButton>
    <UInput v-model="text" placeholder="Enter text" />
    <USelect v-model="selected" :options="options" />
    
    <!-- Layout components -->
    <UCard>
      <template #header>
        <h3>Card Title</h3>
      </template>
      Card content here
    </UCard>
    
    <!-- Navigation -->
    <UTabs :items="tabs" />
    <UAccordion :items="items" />
    
    <!-- Feedback -->
    <UAlert title="Success!" color="success" />
    <UBadge>New</UBadge>
    
    <!-- Overlays -->
    <UModal v-model="isOpen">
      Modal content
    </UModal>
  </div>
</template>

<script setup lang="ts">
const text = ref('')
const selected = ref('')
const isOpen = ref(false)

const options = ['Option 1', 'Option 2']
const tabs = [
  { label: 'Tab 1', content: 'Content 1' },
  { label: 'Tab 2', content: 'Content 2' }
]
</script>
```

### Theming with `ui` Prop

Customize component styling using the `ui` prop:

```vue
<template>
  <UButton
    :ui="{
      base: 'font-bold',
      variant: {
        solid: 'bg-blue-500 hover:bg-blue-600'
      }
    }"
  >
    Custom Button
  </UButton>
  
  <UCard
    :ui="{
      header: { padding: 'p-6' },
      body: { padding: 'p-6' },
      footer: { padding: 'p-6' }
    }"
  >
    <template #header>Custom padding</template>
    Content
  </UCard>
</template>
```

### Color Variants

Use semantic color props:

```vue
<template>
  <!-- Color variants -->
  <UButton color="primary">Primary</UButton>
  <UButton color="secondary">Secondary</UButton>
  <UButton color="success">Success</UButton>
  <UButton color="error">Error</UButton>
  <UButton color="warning">Warning</UButton>
  <UButton color="info">Info</UButton>
  <UButton color="neutral">Neutral</UButton>
  
  <!-- Size variants -->
  <UButton size="xs">Extra Small</UButton>
  <UButton size="sm">Small</UButton>
  <UButton size="md">Medium</UButton>
  <UButton size="lg">Large</UButton>
  <UButton size="xl">Extra Large</UButton>
</template>
```

### Icons

Use icons with the `i-` prefix (powered by Iconify):

```vue
<template>
  <UButton icon="i-lucide-plus">Add</UButton>
  <UButton icon="i-lucide-trash" color="error">Delete</UButton>
  <UIcon name="i-lucide-check" class="w-5 h-5" />
  
  <!-- Leading/trailing icons -->
  <UInput 
    leading-icon="i-lucide-search"
    placeholder="Search..."
  />
  <UButton trailing-icon="i-lucide-arrow-right">
    Next
  </UButton>
</template>
```

### Forms & Validation

```vue
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const state = reactive({
  email: '',
  password: ''
})

async function onSubmit() {
  // Form is validated automatically
  console.log('Valid!', state)
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" type="email" />
    </UFormField>
    
    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>
    
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

### Programmatic Overlays

```vue
<script setup lang="ts">
const toast = useToast()
const modal = useModal()

function showToast() {
  toast.add({
    title: 'Success!',
    description: 'Your action was completed.',
    color: 'success'
  })
}

function openModal() {
  modal.open(MyModalComponent, {
    title: 'Modal Title',
    onClose: () => console.log('Closed')
  })
}
</script>

<template>
  <UButton @click="showToast">Show Toast</UButton>
  <UButton @click="openModal">Open Modal</UButton>
</template>
```

### Color Mode

```vue
<script setup lang="ts">
const colorMode = useColorMode()

// Toggle between light and dark
function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <UColorModeButton />
  <UColorModeSwitch />
  <UColorModeSelect />
  
  <!-- Custom toggle -->
  <UButton @click="toggle" :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'">
    {{ colorMode.value === 'dark' ? 'Light' : 'Dark' }}
  </UButton>
</template>
```

### Common Components

**Layout:**
- `UApp` - Root wrapper (required for toasts/tooltips)
- `UCard` - Card container with header/body/footer
- `UContainer` - Responsive container
- `UDivider` - Horizontal/vertical divider

**Forms:**
- `UButton` - Button with variants
- `UInput` - Text input
- `UTextarea` - Multi-line text input
- `USelect` - Dropdown select
- `UCheckbox` - Checkbox
- `URadio` - Radio button
- `UToggle` - Toggle switch
- `UForm` - Form with validation
- `UFormField` - Form field wrapper

**Navigation:**
- `UTabs` - Tab navigation
- `UAccordion` - Collapsible accordion
- `UBreadcrumb` - Breadcrumb navigation
- `UPagination` - Pagination controls

**Feedback:**
- `UAlert` - Alert/notification box
- `UBadge` - Badge/label
- `UProgress` - Progress bar
- `USkeleton` - Loading skeleton
- `USpinner` - Loading spinner

**Overlays:**
- `UModal` - Modal dialog
- `UPopover` - Popover overlay
- `UDropdown` - Dropdown menu
- `UTooltip` - Tooltip
- `UContextMenu` - Context menu

**Data Display:**
- `UTable` - Data table
- `UAvatar` - User avatar
- `UKbd` - Keyboard key display
- `UChip` - Chip/tag
- `UMeter` - Meter/gauge

### Best Practices

- **DO** use `UApp` wrapper in root component
- **DO** use semantic colors (`primary`, `error`, etc.)
- **DO** use `ui` prop for component-level customization
- **DO** use `useToast()` and `useModal()` for programmatic overlays
- **DO** leverage auto-imported components (no imports needed)
- **DO** use icon names with `i-` prefix
- **DO NOT** import Nuxt UI components manually
- **DO NOT** add custom Tailwind classes for styling (use `ui` prop)
- Keep component structure clean and semantic
- Use slots for flexible content composition
- Leverage form validation with schemas

### TypeScript

All components have full TypeScript support:

```typescript
import type { ButtonProps, InputProps } from '@nuxt/ui'

const buttonProps: ButtonProps = {
  color: 'primary',
  size: 'md',
  icon: 'i-lucide-plus'
}
```

### Resources

- [Nuxt UI Documentation](https://ui.nuxt.com/docs/components)
- [Component Examples](https://ui.nuxt.com/docs/components)
- [Theming Guide](https://ui.nuxt.com/docs/getting-started/theme)
- [Iconify Icons](https://icon-sets.iconify.design/)
