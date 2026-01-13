<script setup lang="ts">
interface Props {
  leagueId: string
  isHovered: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-4">
    <!-- League Info -->
    <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <UIcon 
        name="i-lucide-info" 
        class="w-4 h-4 text-primary/70"
      />
      <span class="font-medium">League ID:</span>
      <span class="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
        {{ leagueId }}
      </span>
    </div>

    <!-- View Badge CTA -->
    <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-2 text-sm text-primary">
        <UIcon 
          name="i-lucide-shield" 
          class="w-4 h-4"
        />
        <span class="font-medium">View League Badge</span>
      </div>
      
      <UIcon 
        name="i-lucide-arrow-right" 
        class="w-5 h-5 text-primary transition-transform duration-300"
        :class="isHovered ? 'translate-x-1' : ''"
      />
    </div>
  </div>
</template>
