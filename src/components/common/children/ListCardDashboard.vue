<template>
  <div class="sm:tw-grid sm:tw-grid-cols-2 sm:tw-gap-4">
    <q-card
      class="my-card tw-mb-4 sm:tw-mb-0 tw-rounded-lg tw-bg-secondary"
      flat
    >
      <q-card-section class="text-white">
        <div class="tw-text-base tw-font-semibold">Thời gian sử dụng</div>
      </q-card-section>
      <q-inner-loading color="white" :showing="activitiesLoading" />
      <div
        v-if="!activitiesLoading"
        class="scroll-area tw-text-white tw-relative"
      >
        <div
          v-if="activeTab === 'today' || activeTab === 'select'"
          class="tw-mt-6"
        >
          <div class="tw-flex tw-justify-between tw-items-end tw-px-1">
            <div class="tw-text-[40px] tw-font-semibold tw-leading-[1.2]">
              {{ usedTime }}
            </div>
            <div class="tw-text-[15px]">Giới hạn: {{ limitTime }}</div>
          </div>
          <q-linear-progress
            v-if="limitTimeCurrentDay"
            rounded
            size="20px"
            :value="progress"
            color="white"
            class="tw-mt-2"
          />
          <q-btn
            v-if="limitTimeCurrentDay !== '24:00'"
            class="tw-bg-transparent tw-font-bold tw-mt-6 tw-absolute tw-bottom-10 tw-left-4"
            size="md"
            icon="add"
            text-color="white"
            no-caps
            flat
            @click="goToDailyTimes"
          >
            Thêm thời gian
          </q-btn>
        </div>
        <div v-else>
          <div class="tw-font-semibold tw-text-[40px]">
            {{ averageTimePerDay }}
          </div>
          <div class="tw-text-[15px]">Bình quân hàng ngày</div>
          <div class="tw-font-semibold tw-text-[15px] tw-mt-8">
            Tổng thời gian: {{ usedTime }}
          </div>
        </div>
      </div>
    </q-card>
    <q-card
      class="my-card tw-mb-4 sm:tw-mb-0 tw-bg-secondary tw-rounded-lg"
      flat
    >
      <q-card-section class="text-white">
        <div class="tw-text-base tw-font-semibold">
          Thời gian sử dụng theo giờ
        </div>
      </q-card-section>
      <q-inner-loading color="white" :showing="activitiesLoading" />
      <div v-if="!activitiesLoading" class="scroll-area">
        <BarChart
          chartId="dashboard"
          :datasets="chartData.datasets"
          :labels="chartData.labels"
        />
      </div>
    </q-card>
    <q-card class="my-card tw-mb-4 sm:tw-mb-0 tw-bg-white tw-rounded-lg" flat>
      <q-card-section class="tw-bg-error-light tw-text-error-dark">
        <div class="tw-text-base tw-font-semibold">Các trang web bị chặn</div>
      </q-card-section>
      <div
        v-if="!webBlockedData.length && !activitiesLoading"
        class="align-middle"
      >
        <EmptyState content="Không có hoạt động" />
      </div>

      <q-scroll-area class="scroll-area">
        <div v-if="activitiesLoading">
          <div class="tw-mb-2" v-for="item in 4">
            <div class="tw-flex">
              <q-skeleton width="50px" />
              <div class="tw-ml-3 tw-w-full">
                <q-skeleton type="text" width="100px" />
                <q-skeleton type="text" />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="webBlockedData.length"
          v-for="(item, index) in webBlockedData"
          :key="index"
        >
          <div class="tw-flex tw-justify-between tw-relative">
            <div class="tw-flex tw-relative">
              <img
                v-if="item.icon"
                :src="item.icon"
                width="32"
                class="tw-object-contain tw-absolute tw-top-1.5"
              />
              <q-icon
                v-if="!item.icon && item.type === 'APP'"
                name="apps"
                size="32px"
              />
              <q-icon
                v-if="
                  !item.icon &&
                  (item.type === 'WEB' || item.type === 'WEB_SURF')
                "
                name="language"
                size="32px"
              />
              <div
                :class="{
                  'tw-ml-10': item.icon,
                  'tw-ml-2': !item.icon,
                }"
              >
                <div class="tw-text-text-grey tw-text-base">
                  {{ item.activity }}
                </div>
                <div class="tw-text-fullname tw-text-sm">{{ item.type }}</div>
              </div>
            </div>
            <div class="tw-h-full">
              <!-- <div
                class="tw-text-text-grey tw-text-sm tw-font-semibold tw-absolute tw-bottom-0 tw-right-0"
              >
                {{ timeFormat(item.total) }}
              </div> -->
            </div>
          </div>
          <q-separator class="tw-bg-app-bg tw-my-2" />
        </div>
      </q-scroll-area>
    </q-card>
    <q-card class="my-card tw-mb-4 sm:tw-mb-0 tw-bg-white tw-rounded-lg" flat>
      <q-card-section class="tw-bg-primary-light tw-text-primary">
        <div class="tw-text-base tw-font-semibold">Ứng dụng và trang web</div>
      </q-card-section>
      <div v-if="!appWebData.length && !activitiesLoading" class="align-middle">
        <EmptyState content="Không có hoạt động" />
      </div>
      <q-scroll-area class="scroll-area">
        <div v-if="activitiesLoading">
          <div class="tw-mb-2" v-for="item in 4">
            <div class="tw-flex">
              <q-skeleton width="50px" />
              <div class="tw-ml-3 tw-w-full">
                <q-skeleton type="text" width="100px" />
                <q-skeleton type="text" />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="appWebData.length"
          v-for="(item, index) in appWebData"
          :key="index"
        >
          <div class="tw-flex tw-justify-between tw-relative">
            <div class="tw-flex tw-relative">
              <img
                v-if="item.icon"
                :src="item.icon"
                width="32"
                class="tw-object-contain tw-absolute tw-top-1.5"
              />
              <q-icon
                v-if="!item.icon && item.type === 'APP'"
                name="apps"
                size="32px"
              />
              <q-icon
                v-if="
                  !item.icon &&
                  (item.type === 'WEB' || item.type === 'WEB_SURF')
                "
                name="language"
                size="32px"
              />
              <div
                :class="{
                  'tw-ml-10': item.icon,
                  'tw-ml-2': !item.icon,
                }"
              >
                <div class="tw-text-text-grey tw-text-base">
                  {{ item.activity }}
                </div>
                <div class="tw-text-fullname tw-text-sm">{{ item.type }}</div>
              </div>
            </div>
            <div class="tw-h-full">
              <div
                v-if="item.type !== 'WEB' && item.type !== 'WEB_SURF'"
                class="tw-text-text-grey tw-text-sm tw-font-semibold tw-absolute tw-bottom-0 tw-right-0"
              >
                {{ timeFormat(item.total) }}
              </div>
            </div>
          </div>
          <q-separator class="tw-bg-app-bg tw-my-2" />
        </div>
      </q-scroll-area>
    </q-card>
    <!-- <q-card class="my-card tw-mb-4 sm:tw-mb-0 tw-bg-white tw-rounded-lg" flat>
      <q-card-section class="tw-bg-primary-light tw-text-primary">
        <div class="tw-text-base tw-font-semibold">Tìm kiếm trang web</div>
      </q-card-section>
      <div class="align-middle">
        <EmptyState content="Không có hoạt động" />
      </div>
    </q-card>
    <q-card class="my-card tw-mb-4 sm:tw-mb-0 tw-bg-white tw-rounded-lg" flat>
      <q-card-section class="tw-bg-primary-light tw-text-primary">
        <div class="tw-text-base tw-font-semibold">Youtube</div>
      </q-card-section>
      <div class="align-middle">
        <EmptyState content="Không có hoạt động" />
      </div>
    </q-card> -->
  </div>
</template>

<script setup lang="ts">
import EmptyState from '@components/ui/empty-state/EmptyState.vue';
import {
  activitiesDashboard,
  childActivities,
  filterBlockedWebsites,
} from '@/adapter/member';
import useChildrenStore from '@stores/children';
import { storeToRefs } from 'pinia';
import { date } from 'quasar';
import { timeFormat } from '@/utils/date';
import BarChart from '@components/common/chart/BarChart.vue';

const props = defineProps({
  activeTab: {
    type: String,
    default: 'today',
  },
});

const router = useRouter();
const route = useRoute();
const currentDay = date.formatDate(Date.now(), 'dddd').toLowerCase();
const activitiesData = ref<any>([]);
const activitiesDataHour = ref<any>([]);
const limitTimeCurrentDay = ref<any>('');
const isLimitDay = ref<any>(false);

const { childrenActivities, activitiesLoading, dailyTimeLimit }: any =
  storeToRefs(useChildrenStore());
const appWebData: any = ref([]);
const webBlockedData: any = ref([]);

const limitTime = computed(() => {
  if (limitTimeCurrentDay.value) {
    const data = limitTimeCurrentDay.value.split(':');
    if (data[0] === '00') {
      if (data[1] === '00') {
        isLimitDay.value = true;
        return '00m';
      }
      return `${data[1]}m`;
    } else if (data[0] === '24') {
      return '24h';
    }

    return `${data[0]}h ${data[1]}m`;
  } else {
    return '24h';
  }
});

const chartData = computed(() => {
  const labelsHour = activitiesDataHour.value.map(
    (item: any) => `${item.date}:00`
  );
  const totalDatasetsHour = activitiesDataHour.value.map((item: any) => {
    const total = item.activities.reduce((prev: any, curr: any) => {
      return prev + curr.duration;
    }, 0);
    return total;
  });
  const datasetsHour = [
    {
      backgroundColor: '#fff',
      data: totalDatasetsHour,
    },
  ];

  const labels = activitiesData.value.map((item: any) =>
    date.formatDate(item.date, 'DD/MM')
  );
  const totalDatasets = activitiesDataHour.value.map((item: any) => {
    const total = item.activities.reduce((prev: any, curr: any) => {
      return prev + curr.duration;
    }, 0);
    return total;
  });
  const datasets = [
    {
      backgroundColor: '#fff',
      data: totalDatasets,
    },
  ];

  switch (props.activeTab) {
    case 'today':
    case 'select':
      return {
        labels: labelsHour,
        datasets: datasetsHour,
      };

    default:
      return {
        labels,
        datasets,
      };
  }
});

const totalUsedTime = computed(() => {
  const time = appWebData.value.map((item: any) => item.total);
  const total = time.reduce((prev: any, curr: any) => prev + curr, 0);
  return total;
});

const averageTimePerDay = computed(() => {
  const averagePerDay = totalUsedTime.value / +props.activeTab;
  return timeFormat(averagePerDay);
});

const usedTime = computed(() => {
  return timeFormat(totalUsedTime.value);
});

const progress = computed(() => {
  const data = limitTimeCurrentDay.value.split(':');
  const hour = +data[0];
  const min = +data[1];
  return totalUsedTime.value / (hour * 60 * 60 + min * 60);
});

watch(childrenActivities, (value: any) => {
  if (value) {
    appWebData.value = activitiesDashboard(value);
    webBlockedData.value = filterBlockedWebsites(value);
    activitiesData.value = childActivities(value);
    activitiesDataHour.value = childActivities(value, 'HH');
  }
});

watch(dailyTimeLimit, (value) => {
  if (value.limit[currentDay]) {
    limitTimeCurrentDay.value = value.limit[currentDay];
  } else {
    limitTimeCurrentDay.value = '24:00';
  }
});

const goToDailyTimes = () => {
  router.push(`/family/${route.params.id}/daily-times`);
};
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  height: 320px;
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
