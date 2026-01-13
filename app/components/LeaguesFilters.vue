<script setup lang="ts">
// Store - shared filter state
const store = useSportsLeaguesStore()
const { availableSports } = storeToRefs(store)

// Sport filter options for USelect
const sportOptions = computed(() => [
  { label: 'All Sports', value: null },
  ...availableSports.value.map((sport: string) => ({
    label: sport,
    value: sport,
  })),
])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <UInput
      v-model="store.searchTerm"
      icon="i-heroicons-magnifying-glass"
      placeholder="Search leagues..."
      size="lg"
    />
    <USelect
      v-model="store.selectedSport"
      :items="sportOptions"
      placeholder="All Sports"
      size="lg"
    />
  </div>
</template>
