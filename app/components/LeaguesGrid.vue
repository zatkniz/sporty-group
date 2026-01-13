<script setup lang="ts">
import type { League } from '~/types'

interface Props {
  leagues: League[]
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <LeagueCard
      v-for="league in leagues"
      :key="league.idLeague"
      :league="league"
    />
  </div>
</template>
