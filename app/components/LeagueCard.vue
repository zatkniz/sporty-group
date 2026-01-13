<script setup lang="ts">
import type { League } from '~/types'

interface Props {
  league: League
}

const props = defineProps<Props>()

// Store
const store = useSportsLeaguesStore()

// Modal state
const showModal = ref<boolean>(false)
const badgeUrl = ref<string | null>(null)
const badgeLoading = ref<boolean>(false)
const badgeError = ref<string | null>(null)

// Hover state for animations
const isHovered = ref<boolean>(false)

// Handle card click - fetch badge and show modal
const handleCardClick = async (): Promise<void> => {
  badgeLoading.value = true
  badgeError.value = null
  badgeUrl.value = null
  showModal.value = true

  try {
    const url = await store.fetchBadge(props.league.idLeague)
    badgeUrl.value = url
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load badge'
    badgeError.value = errorMessage
  } finally {
    badgeLoading.value = false
  }
}
</script>

<template>
  <div>
    <!-- League Card -->
    <UCard
      variant="outline"
      class="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 bg-linear-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-transparent hover:border-primary/20"
      @click="handleCardClick"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <template #header>
        <LeagueCardHeader :league="league" :is-hovered="isHovered" />
      </template>

      <LeagueCardBody :league-id="league.idLeague" :is-hovered="isHovered" />
    </UCard>

    <!-- Badge Modal -->
    <BadgeModal
      v-model:open="showModal"
      :badge-url="badgeUrl"
      :loading="badgeLoading"
      :error="badgeError"
      :league-name="league.strLeague"
    />
  </div>
</template>
