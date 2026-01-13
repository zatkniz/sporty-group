<script setup lang="ts">
interface Props {
  open: boolean
  badgeUrl: string | null
  loading: boolean
  error: string | null
  leagueName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

// Local computed for two-way binding with parent
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const handleClose = (): void => {
  emit('update:open', false)
}
</script>

<template>
  <UModal 
    v-model:open="isOpen" 
    :title="leagueName"
    description="View the league badge"
  >
    <template #body>

      <div class="min-h-75 flex items-center justify-center">
        <!-- Loading State -->
        <div v-if="loading" class="w-full space-y-4">
          <USkeleton class="h-64 w-full rounded-lg" />
          <div class="text-center text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
            <UIcon name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            Loading badge...
          </div>
        </div>

        <!-- Error State -->
        <UAlert
          v-else-if="error"
          color="error"
          variant="soft"
          title="Failed to Load Badge"
          :description="error"
          icon="i-lucide-alert-circle"
          class="w-full"
        />

        <!-- No Badge Available -->
        <UAlert
          v-else-if="!badgeUrl"
          color="warning"
          variant="soft"
          title="No Badge Available"
          description="This league does not have a badge image available."
          icon="i-lucide-alert-triangle"
          class="w-full"
        />

        <!-- Badge Image -->
        <div v-else class="w-full space-y-4">
          <div class="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <img
              :src="badgeUrl"
              :alt="`${leagueName} badge`"
              class="w-auto h-auto max-h-100 max-w-full object-contain drop-shadow-xl"
            />
          </div>
          <div class="text-center text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1.5">
            <UIcon name="i-lucide-check-circle" class="w-3.5 h-3.5 text-success" />
            Badge loaded successfully
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
