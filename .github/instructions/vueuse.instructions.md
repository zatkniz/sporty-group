---
applyTo: "**/*.vue,**/*.ts"
---

# VueUse Integration Guidelines

VueUse provides 200+ reactive utility composables. All are auto-imported via `@vueuse/nuxt`.

## ⚠️ Critical Rules

1. **NO IMPORTS**: All composables are auto-imported
   - ❌ `import { useMouse } from '@vueuse/core'`
   - ✅ `const { x, y } = useMouse()`

2. **SSR COMPATIBILITY**: Consider server-side rendering
   - Use `onMounted` for browser-only features
   - Check `isSupported` for browser APIs

3. **NAMING CONFLICTS**: 
   - Nuxt's `useFetch` ≠ VueUse's `useFetch`
   - Use Nuxt's `useFetch` for API calls

## Common Patterns

### Dark Mode
```typescript
const isDark = useDark()
```

### Debounced Search
```typescript
const search = ref('')
const debouncedSearch = refDebounced(search, 500)

watchEffect(async () => {
  if (debouncedSearch.value) {
    await searchAPI(debouncedSearch.value)
  }
})
```

### Click Outside
`````````````````````````````````````````````````````````````````````````````````````````````````````````````en.value = false)
```

### Responsive L### Responsiescript
const { widthconst { widthconst { widthconst { widthconst { widthconst { widthconst { widthconst { widthipbconst { widthconst { wit { copy, copied } = useClipboard()
await copy('text')
```

### Element Visibility
```typescript
const target = ref<HTMLElement>()
const isVisible = useElementVisibility(target)
```

### Keyboard Shortcuts
```typescript
const { ctrl_k, escape } = useMagicKeys()
watch(ctrl_k, () => openSearch())
```

## When to Use

### ✅ USE for:
- State persistence (localStorage/sessionStorage)
- Browser APIs (clipboard, geolocation, online status)
- Element interactions (size, visibility, dragging)
- Responsive design (media queries, window size)
- Mouse/keyboard events
- Advanced reactivity (debounce, throttle, until)
- Animation/timing utilities

### ❌ DON'T USE for:
- Nuxt-specific features (use Nuxt composables)
- UI components (use Nuxt UI)
- Basic reactivity (use Vue's ref, computed, watch)

## SSR Considerations

```typescript
// Check support
const const const const const const conard()

// Use client-only wrapper
<ClientOnly>
  <ComponentWithVueUse />
</ClientOnly>

// Use onMounted
onMounted(() => {
  const { width } = useElementSize(el)
})
```

## Resources

- [VueUse Docs](https://vueuse.org/)
- [Functions List](https://vueuse.org/functions.html)
- Related: `vueuse-composables` skill, `composables.instructions.md`
