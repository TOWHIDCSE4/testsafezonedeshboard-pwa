<template>
  <div class="tw-text-center">
    <q-icon name="face" size="5rem" class="tw-text-grey-300"></q-icon>
    <div class="tw-text-grey-300 tw-mt-2">{{ content }}</div>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  content: {
    type: String,
    default: "No data",
  },
});
</script>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "EmptyChildren",
});
</script>
<style lang="scss" scoped></style>
