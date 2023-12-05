<template>
  <div class="sm:tw-grid sm:tw-grid-cols-1 sm:tw-gap-4">
    <q-card
      v-if="quizAiList.length"
      v-for="(item, index) in quizAiList"
      :key="index"
      class="my-card tw-mb-4 sm:tw-mb-0 tw-bg-white tw-rounded-lg"
      flat
    >
      <q-card-section
        class="card-title tw-bg-[#4da895] tw-text-white tw-flex tw-justify-between tw-p-2"
      >
        <div class="tw-text-base tw-font-semibold">Câu {{ index + 1 }}</div>
        <div class="tw-justify-end">
          <span v-for="rank in item.rank" style="font-size: 18px">⭐</span>
        </div>
      </q-card-section>
      <div class="tw-p-3" v-html="item.result.content"></div>
    </q-card>
    <EmptyState
      v-if="!quizAiList.length && !isLoading"
      content="Không có dữ liệu"
    />
  </div>
</template>

<script setup lang="ts">
import useChildrenStore from '../../../stores/children';
import { storeToRefs } from 'pinia';
import useUserStore from '../../../stores/user';
import EmptyState from '@components/ui/empty-state/EmptyState.vue';

const props = defineProps({
  activeTab: {
    type: String,
    default: '1',
  },
});
const route: any = useRoute();
const { userProfile }: any = useUserStore();
const quizAiList = ref<any>([]);
const isLoading = ref<any>(Boolean);
const { quizAi }: any = storeToRefs(useChildrenStore());
const { getQuizAIChildren }: any = useChildrenStore();
getQuizAIChildren(userProfile.id, route.params.id, props.activeTab);
watch(props, async (value) => {
  if (value.activeTab) {
    getQuizAIChildren(userProfile.id, route.params.id, value.activeTab);
  }
});
watch(quizAi.value, (value) => {
  if (value) {
    quizAiList.value = value.data;
    isLoading.value = value.isLoading;
  }
});
</script>

<style lang="scss" scoped>
.my-card {
  width: 90%;
  position: relative;
}
.align-middle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.scroll-area {
  height: calc(100% - 56px);
  padding: 16px;
}
</style>
