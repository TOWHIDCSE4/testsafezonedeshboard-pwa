<template>
  <div class="tw-cursor-pointer tw-text-center tw-p-4" @click="onClickUser">
    <div class="tw-relative">
      <q-avatar size="99px" class="tw-bg-primary-light tw-text-primary">{{
        letter
      }}</q-avatar>
      <q-card
        v-if="isEdit"
        class="tw-w-6 tw-h-6 tw-rounded-full tw-absolute tw-bg-white tw-bottom-0 tw-right-16 lg:tw-right-10"
        @click="onClickEdit"
      >
        <q-icon name="edit" color="teal" />
      </q-card>
    </div>
    <div class="tw-font-bold tw-text-base tw-mt-2 tw-text-fullname">
      {{ fullname }}
    </div>
    <div class="tw-font-bold tw-text-xs" :class="`${statusColor || ''}`">
      {{ status }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { firstLetter } from "@/utils/getFirstLetter";

const emit = defineEmits(["onClick", "onClickEdit"]);

const props = defineProps({
  fullname: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "",
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const letter = computed(() => {
  return firstLetter(props.fullname).toUpperCase();
});

const statusColor = computed(() => {
  switch (props.status) {
    case "OFFLINE":
      return "tw-text-status-grey";

    case "ONLINE":
      return "tw-text-success";
    default:
      break;
  }
});

const onClickUser = () => {
  emit("onClick");
};

const onClickEdit = () => {
  emit("onClickEdit");
};
</script>

<style lang="scss" scoped></style>
