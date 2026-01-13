<script setup lang="ts">
import type { League } from '~/types'

interface Props {
  league: League
  isHovered: boolean
}

defineProps<Props>()

// Sport icon mapping
const getSportIcon = (sport: string): string => {
  const sportIcons: Record<string, string> = {
    'Soccer': 'i-lucide-circle-dot',
    'Cricket': 'i-lucide-zap',
    'Motorsport': 'i-lucide-car',
    'Fighting': 'i-lucide-swords',
    'Cycling': 'i-lucide-bike'
  }
  return sportIcons[sport] || 'i-lucide-trophy'
}
</script>

<template>
  <div class="flex items-start justify-between gap-4">
    <!-- League Name with Icon -->
    <div class="flex items-start gap-3 flex-1 min-w-0">
      <div class="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
        <UIcon 
          :name="getSportIcon(league.strSport)" 
          class="w-6 h-6 text-primary transition-transform duration-300 group-hover:rotate-12"
        />
      </div>
      
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 transition-colors duration-300 group-hover:text-primary">
          {{ league.strLeague }}
        </h3>
        
        <!-- Alternate Name -->
        <p 
          v-if="league.strLeagueAlternate" 
          class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1"
        >
          {{ league.strLeagueAlternate }}
        </p>
      </div>
    </div>

    <!-- Sport Badge -->
    <UBadge 
      color="primary" 
      variant="soft" 
      size="lg"
      class="shrink-0 transition-all duration-300 group-hover:scale-110"
    >
      {{ league.strSport }}
    </UBadge>
  </div>
</template>
