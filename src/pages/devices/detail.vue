<template>
  <div class="card-wrapper">
    <div class="sm:tw-flex card-content sm:tw-mt-4">
      <div class="sm:tw-w-2/3 sm:tw-pr-4">
        <div
          class="tw-py-2 tw-cursor-pointer tw-text-text-grey md:tw-inline-block tw-hidden"
          @click="goBackListDevices"
        >
          <q-icon name="chevron_left" size="36px"></q-icon>
          <span class="tw-ml-2 tw-font-semibold tw-text-lg tw-align-middle">{{
            deviceName
          }}</span>
        </div>
        <div class="md:tw-hidden tw-mb-4">
          <span class="tw-ml-2 tw-font-semibold tw-text-base tw-align-middle">{{
            deviceName
          }}</span>
        </div>
        <q-card class="tw-bg-white tw-rounded-lg" flat>
          <div class="tw-p-4">
            <div class="tw-text-lg tw-font-semibold tw-text-fullname">
              Kết nối với:
            </div>
            <div class="tw-flex tw-items-center tw-my-3" v-if="!devicesLoading">
              <q-avatar size="32px" class="tw-bg-primary-light tw-text-primary">
                {{ letter }}
              </q-avatar>
              <div
                class="tw-ml-3 tw-text-base tw-font-semibold tw-text-fullname"
              >
                {{ children.fullname }}
              </div>
            </div>
            <div class="tw-text-lg tw-font-semibold tw-text-fullname">
              Vị trí
            </div>
            <EmptyState
              v-if="!activitiesData.length && !activitiesLoading"
              content="Không có hoạt động"
            />
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
            <div v-if="!activitiesLoading" class="card-content tw-mt-4">
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
                    >
                      <q-icon
                        name="explore"
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
                      <div class="tw-text-base">{{ childItem.timeStart }}</div>
                      <div class="tw-font-semibold tw-text-base">
                        {{ childItem.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>
      <div class="sm:tw-w-1/3">
        <!-- <q-card
          class="my-card tw-bg-white tw-rounded-sm tw-mt-4 sm:tw-mt-0"
          flat
        >
          <q-card-section class="tw-text-text-grey tw-text-base tw-font-bold">
            Cài đặt
          </q-card-section>
          <q-separator class="tw-bg-app-bg" />
          <div class="tw-p-4">
            <ToggleRules
              title="Bật Safezone VPN"
              subtitle="Cho phép thu thập dữ liệu truy cập internet và ứng dụng"
            >
              <q-toggle
                v-model="enableVpn"
                color="primary"
                @update:model-value="onToggleRules"
              />
            </ToggleRules>
          </div>
        </q-card> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ToggleRules from '@/components/common/toggle/ToggleRules.vue';
import useChildrenStore from '@stores/children';
import EmptyState from '@components/ui/empty-state/EmptyState.vue';
import { firstLetter } from '@/utils/getFirstLetter';
import { storeToRefs } from 'pinia';
import { date } from 'quasar';
import useUserStore from '@stores/user';
import { childActivities } from '@/adapter/member';

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

const { userDevices, userChildren, devicesLoading }: any = storeToRefs(
  useUserStore()
);
const { getChildrenActivities }: any = useChildrenStore();
const { childrenActivities, activitiesLoading }: any = storeToRefs(
  useChildrenStore()
);
const { getUserDevices, userProfile }: any = useUserStore();
const { id } = userProfile;

const route = useRoute();
const router = useRouter();
const deviceId = route.params.id;

if (!userDevices.value.length) {
  getUserDevices(id);
}

getChildrenActivities(userProfile.id, route.params.id, { type: 'LOCATION' });

const enableVpn = ref(false);
const activitiesData = ref<any>([]);

watch(childrenActivities, (value) => {
  if (value) {
    let result = childActivities(value);
    activitiesData.value = result;
  }
});

const children = computed(() => {
  const data = userDevices.value.filter((item: any) => item.id === deviceId)[0];
  const childrenId = data.children[0];
  const childrenInfo = userChildren.value.filter(
    (item: any) => item.id === childrenId
  )[0];
  return childrenInfo;
});

const letter = computed(() => {
  const name = children.value.fullname;
  return firstLetter(name).toUpperCase();
});

const deviceName = computed(() => {
  return userDevices.value.filter((item: any) => item.id === deviceId)[0]?.name;
});

const goBackListDevices = () => {
  router.push('/devices');
};

const dayFormat = (value: any) => {
  return date.formatDate(value, 'dddd DD/MM', textDateFormat);
};

const onToggleRules = (value: any) => {};
</script>

<style lang="scss" scoped>
::v-deep() {
  .q-tab {
    border-radius: 8px;
  }
  .q-tab--inactive {
    color: #58595a;

    &:hover {
      border-radius: 8px;
    }
  }
  .q-tab--active {
    background-color: #6161ff;
    color: #fff;
    border-radius: 8px;
  }
}
.filter-tabs {
  width: 100%;
}
.card-wrapper {
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 80px);
  }
}
.card-content {
  flex-grow: 1;
  overflow: auto;
}
</style>
