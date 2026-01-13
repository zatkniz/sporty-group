<script setup lang="ts">
interface Props {
  icon?: string
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  icon: '🔍',
  title: 'No leagues found',
  description: 'Try adjusting your search or filter criteria'
})
</script>

<template>
  <UCard>
    <div class="text-center py-8">
      <div class="text-6xl mb-4">{{ icon }}</div>
      <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
      <p class="text-gray-600 dark:text-gray-400">
        {{ description }}
      </p>
    </div>
  </UCard>
</template>
