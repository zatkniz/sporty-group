<script setup lang="ts">
// SEO
useHead({
  title: 'Sports Leagues',
  meta: [
    { name: 'description', content: 'Browse and search sports leagues from around the world' },
  ],
})

// Store
const store = useSportsLeaguesStore()
const { leagues, loading, error, filteredLeagues } = storeToRefs(store)

// Fetch leagues on mount
onMounted(async (): Promise<void> => {
  await store.fetchLeagues()
})
</script>

<template>
  <UContainer>
    <div class="space-y-6 py-8">
      <!-- Page Header -->
      <UPageHeader
        title="Sports Leagues"
        description="Explore leagues from various sports around the world"
      />

      <!-- Filters -->
      <LeaguesFilters />

      <!-- Loading State -->
      <LeaguesLoadingState v-if="loading" />

      <!-- Error State -->
      <UAlert
        v-else-if="error"
        type="error"
        title="Error Loading Leagues"
        :description="error"
      />

      <!-- Empty State -->
      <LeaguesEmptyState v-else-if="filteredLeagues.length === 0" />

      <!-- Leagues Grid -->
      <LeaguesGrid v-else :leagues="filteredLeagues" />

      <!-- Results Count -->
      <LeaguesResultsCount
        v-if="!loading && !error"
        :filtered-count="filteredLeagues.length"
        :total-count="leagues.length"
      />
    </div>
  </UContainer>
</template>
