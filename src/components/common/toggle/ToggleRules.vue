<template>
  <div class="tw-flex tw-justify-between tw-items-center">
    <div class="tw-text-text-grey">
      <div class="tw-font-bold">{{ title }}</div>
      <div>{{ subtitle }}</div>
    </div>
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
});
</script>
