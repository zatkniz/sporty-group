<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const menuItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    icon: 'i-lucide-home',
    active: route.path === '/'
  },
  {
    label: 'About',
    to: '/about',
    icon: 'i-lucide-info',
    active: route.path === '/about'
  },
  {
    label: 'Contact',
    to: '/contact',
    icon: 'i-lucide-mail',
    active: route.path === '/contact'
  }
])

const footerLinks: NavigationMenuItem[] = [
  {
    label: 'Privacy',
    to: '/privacy'
  },
  {
    label: 'Terms',
    to: '/terms'
  }
]
</script>

<template>
  <div>
    <UHeader>
      <template #title>
        <span class="font-bold text-xl">Sporty Group</span>
      </template>

      <UNavigationMenu :items="menuItems" />

      <template #right>
        <UColorModeButton />
      </template>

      <template #body>
        <UNavigationMenu :items="menuItems" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <UContainer class="py-8">
        <slot />
      </UContainer>
    </UMain>

    <USeparator type="dashed" class="h-px" />

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }} Sporty Group
        </p>
      </template>

      <UNavigationMenu :items="footerLinks" variant="link" />

      <template #right>
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          to="https://github.com"
          target="_blank"
          aria-label="GitHub"
        />
      </template>
    </UFooter>
  </div>
</template>
