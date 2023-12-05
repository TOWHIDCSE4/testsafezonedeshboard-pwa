<template>
  <q-card
    class="my-card tw-bg-white tw-rounded-lg lg:tw-w-3/4 sm:tw-mt-4 timeline-card"
    flat
  >
    <q-card-section
      class="tw-text-text-grey lg:tw-w-1/2 tw-flex tw-items-center"
    >
      <q-icon name="o_filter_alt" color="primary" size="md" class="tw-mr-3" />
      <q-select
        outlined
        v-model="modelSelect"
        :options="options"
        :dense="false"
        :options-dense="false"
        class="tw-w-full"
        @update:model-value="onFilter"
      >
      </q-select>
    </q-card-section>
    <q-separator class="tw-bg-app-bg" />
    <div v-if="activitiesLoading" class="tw-p-4">
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
    <div v-if="!activitiesLoading" class="card-content tw-p-4">
      <div
        class="activity-wrapper"
        v-for="(item, index) in activitiesData"
        :key="index"
      >
        <div class="tw-text-text-grey tw-font-semibold tw-text-lg">
          {{ dayFormat(item.date) }}
        </div>
        <div
          class="tw-mt-4 tw-flex tw-justify-between tw-text-text-grey"
          v-for="(childItem, idx) in item.activities"
          :key="idx"
        >
          <div class="tw-flex tw-relative">
            <img
              v-if="childItem.activityIcon"
              :src="childItem.activityIcon"
              width="48"
              class="tw-object-contain tw-absolute tw-top-1.5"
              alt="icon"
            />
            <div
              v-if="!childItem.activityIcon"
              class="tw-w-11 tw-h-11 tw-bg-app-bg tw-rounded-[4px] tw-flex tw-justify-center tw-items-center"
              :class="{
                'tw-bg-error-light': childItem.questionable,
              }"
            >
              <q-icon
                v-if="childItem.activityType === 'APP'"
                name="apps"
                size="32px"
                class="tw-text-status-grey"
              />
              <q-icon
                v-if="childItem.activityType === 'LOCATION'"
                name="explore"
                size="32px"
                class="tw-text-status-grey"
              />
              <q-icon
                v-if="
                  childItem.activityType === 'WEB' ||
                  childItem.activityType === 'WEB_SURF'
                "
                name="language"
                size="32px"
                class="tw-text-status-grey"
              />
            </div>
            <div
              :class="{
                'tw-ml-[3.75rem]': childItem.activityIcon,
                'tw-ml-5': !childItem.activityIcon,
              }"
            >
              <div
                :class="{
                  'tw-text-base': true,
                  'tw-text-error': childItem.questionable,
                }"
              >
                {{ childItem.timeStart }}
                {{ childItem.questionable ? ' - Blocked' : '' }}
              </div>
              <div class="tw-font-semibold tw-text-base">
                {{ childItem.name }}
              </div>
            </div>
          </div>
          <div
            class="tw-text-right"
            v-if="childItem.activityType !== 'LOCATION'"
          >
            <div
              v-if="
                childItem.activityType !== 'WEB' &&
                childItem.activityType !== 'WEB_SURF'
              "
              class="tw-text-base"
            >
              {{ timeFormat(childItem.duration) }}
            </div>
            <ActionMenu
              :activityId="childItem.activityId"
              @set-rule="addRulesActivities"
            />
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import useChildrenStore from '@stores/children';
import useUserStore from '@stores/user';
import { storeToRefs } from 'pinia';
import { childActivities } from '@/adapter/member';
import { date } from 'quasar';
import childrenApi from '@/api/children';
import { useQuasar } from 'quasar';
import { timeFormat } from '@/utils/date';
import ActionMenu from '@/components/common/menu/ActionMenu.vue';

const $q = useQuasar();
const modelSelect = ref({ label: 'Tất cả hoạt động', value: 'ALL' });
const options = [
  { label: 'Tất cả hoạt động', value: 'ALL' },
  { label: 'Trang web', value: 'WEB_SURF' },
  { label: 'Ứng dụng', value: 'APP' },
  { label: 'Vị trí', value: 'LOCATION' },
];
const textDateFormat = {
  days: [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
  ],
};

const route: any = useRoute();
const { getChildrenActivities }: any = useChildrenStore();
const { userProfile }: any = useUserStore();
const { childrenActivities, activitiesLoading }: any = storeToRefs(
  useChildrenStore()
);
const activitiesData = ref<any>([]);
getChildrenActivities(userProfile.id, route.params.id);

watch(childrenActivities, (value) => {
  if (value) {
    let result = childActivities(value);
    activitiesData.value = result;
  }
});

const dayFormat = (value: any) => {
  return date.formatDate(value, 'dddd DD/MM/YYYY', textDateFormat);
};

const onFilter = async (value: any) => {
  try {
    const type = value.value;
    if (type === 'ALL') {
      await getChildrenActivities(userProfile.id, route.params.id);
    } else {
      await getChildrenActivities(userProfile.id, route.params.id, { type });
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error,
      position: 'top-right',
      icon: 'error',
      timeout: 3000,
    });
  }
};

const addRulesActivities = async ({ action, id }: { action: any; id: any }) => {
  try {
    const { addRulesActivityControl } = childrenApi();
    const body = {
      activityId: id,
      action,
      description: '',
    };
    const data: any = await addRulesActivityControl(
      userProfile.id,
      route.params.id,
      body
    );

    if (data.success) {
      $q.notify({
        color: 'teal',
        message: `${action === 'BLOCK' ? 'Chặn' : 'Cho phép'} thành công`,
        position: 'top-right',
        icon: 'done',
        timeout: 3000,
      });
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error,
      position: 'top-right',
      icon: 'error',
      timeout: 3000,
    });
  }
};
</script>

<style lang="scss" scoped>
::v-deep() {
  .q-field--outlined {
    .q-field__control {
      color: transparent;

      &:hover {
        &:before {
          border: 1px solid #6161ff;
        }
      }
    }
  }
  .q-field--auto-height .q-field__control,
  .q-field--auto-height .q-field__native {
    min-height: auto;
  }
  .q-field--auto-height {
    .q-field__control {
      height: 48px;
    }
  }

  .q-field__marginal {
    height: 48px;
  }

  .q-item {
    &:hover {
      background-color: #f1f1ff;
      color: #6161ff;
    }
  }
}
.card-content {
  flex-grow: 1;
  overflow: auto;
}

.timeline-card {
  @media (min-width: 1024px) {
    max-height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
  }
}

.activity-wrapper {
  margin-top: 16px;

  &:first-child {
    margin-top: 0px;
  }
}
</style>
