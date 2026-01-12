<script setup lang="ts">
useSeoMeta({
  title: 'Home - Sporty Group',
  description: 'Welcome to Sporty Group'
})
</script>

<template>
  <div>
    <UPageHeader
      title="Welcome to Sporty Group"
      description="A modern Nuxt application with PrimeVue and Tailwind CSS"
    />

    <UPageGrid class="mt-8">
      <UPageCard
        title="PrimeVue"
        description="Rich component library with accessibility and customization"
        icon="i-lucide-box"
      />
      <UPageCard
        title="Tailwind CSS"
        description="Utility-first CSS framework for rapid UI development"
        icon="i-lucide-palette"
      />
      <UPageCard
        title="Nuxt UI"
        description="Beautiful and accessible components built with Tailwind"
        icon="i-lucide-sparkles"
      />
    </UPageGrid>

    <UPageSection class="mt-12">
      <UCard>
        <template #header>
          <h2 class="text-2xl font-bold">Getting Started</h2>
        </template>

        <div class="prose prose-primary dark:prose-invert">
          <p>
            This project combines the power of Nuxt 4, PrimeVue components, 
            Nuxt UI, and Tailwind CSS to create a modern web application.
          </p>
          <p class="text-muted">
            You can now start building your application with all these tools configured and ready to use.
          </p>
        </div>

        <template #footer>
          <div class="flex gap-3">
            <UButton color="primary" to="/about">
              Learn More
            </UButton>
            <UButton color="neutral" variant="outline" to="/contact">
              Contact Us
            </UButton>
          </div>
        </template>
      </UCard>
    </UPageSection>
  </div>
</template>
