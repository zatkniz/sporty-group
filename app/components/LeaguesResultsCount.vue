<script setup lang="ts">
interface Props {
  filteredCount: number
  totalCount: number
}

defineProps<Props>()
</script>

<template>
  <div class="text-center text-sm text-gray-600 dark:text-gray-400">
    Showing {{ filteredCount }} of {{ totalCount }} leagues
  </div>
</template>
