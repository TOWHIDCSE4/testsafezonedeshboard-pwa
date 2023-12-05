<template>
  <div
    v-if="action === 'ALLOW'"
    class="tw-bg-secondary-light tw-rounded-sm tw-mr-4 tw-p-1"
  >
    <q-icon name="done" color="positive" size="xs" />
  </div>
  <div
    v-if="action === 'ALERT'"
    class="tw-bg-[#ffedd6] tw-rounded-sm tw-mr-4 tw-p-1"
  >
    <q-icon name="priority_high" class="tw-text-[#ffc054]" size="xs" />
  </div>
  <div
    v-if="action === 'BLOCK'"
    class="tw-bg-error-light tw-rounded-sm tw-mr-4 tw-p-1"
  >
    <q-icon name="not_interested" color="negative" size="xs" />
  </div>
  <div
    v-if="action === 'IGNORE'"
    class="tw-bg-[#f8fafd] tw-rounded-sm tw-mr-4 tw-p-1"
  >
    <q-icon name="close" class="tw-text-[#9b9c9d]" size="xs" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  action: {
    type: String,
    default: "",
  },
});
</script>
