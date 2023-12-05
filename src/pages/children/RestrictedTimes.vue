<template>
  <div class="daily-wrapper">
    <div class="daily-content">
      <div class="lg:tw-flex">
        <div class="lg:tw-w-2/3 lg:tw-pr-4">
          <q-card class="tw-bg-white tw-rounded-sm" flat>
            <div
              class="tw-flex tw-justify-between tw-items-center tw-pl-4 tw-py-1"
            >
              <div class="tw-text-text-grey">Đặt giới hạn thời gian</div>
              <div>
                <q-toggle
                  v-model="enableRestrictedTime"
                  color="primary"
                  @update:model-value="onUpdateTime"
                />
              </div>
            </div>
            <q-separator class="tw-bg-app-bg" />
            <div class="tw-min-h-[300px]" v-if="restrictedLoading">
              <q-inner-loading color="black" :showing="restrictedLoading" />
            </div>
            <div
              v-if="!restrictedLoading"
              class="tw-px-4 tw-pt-4 tw-pb-8 tw-relative"
            >
              <div
                v-if="!enableRestrictedTime"
                class="tw-absolute bg-restricted tw-inset-0 tw-z-10"
              ></div>
              <div>
                Chọn khoảng giới hạn thời gian bằng cách chọn các ô trong bảng.
              </div>
              <div class="restricted-header">
                <table>
                  <tbody>
                    <tr>
                      <td></td>
                      <td v-for="(item, index) in days" :key="index">
                        <span>{{ item.label }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div class="tw-text-center tw-my-2">Sáng</div>

                <TimeTable
                  ref="morningRef"
                  v-if="!restrictedLoading"
                  :is-add-time="enableRestrictedTime"
                  :start-time="0"
                  :end-time="7"
                  start-text="0am"
                  end-text="7am"
                  :limit-time="restrictedTimeLimit.limit"
                  @on-update-restricted="handleUpdateRestricted"
                />

                <div class="tw-text-center tw-my-2">Chiều</div>

                <TimeTable
                  ref="afternoonRef"
                  v-if="!restrictedLoading"
                  :start-time="8"
                  :end-time="15"
                  start-text="8am"
                  end-text="15pm"
                  :limit-time="restrictedTimeLimit.limit"
                  @on-update-restricted="handleUpdateRestricted"
                />

                <div class="tw-text-center tw-my-2">Tối</div>

                <TimeTable
                  ref="nightRef"
                  v-if="!restrictedLoading"
                  :start-time="16"
                  :end-time="23"
                  start-text="16pm"
                  end-text="23pm"
                  :limit-time="restrictedTimeLimit.limit"
                  @on-update-restricted="handleUpdateRestricted"
                />
              </div>
            </div>
          </q-card>
        </div>
        <div class="lg:tw-w-1/3">
          <q-card
            class="my-card tw-bg-white tw-rounded-sm tw-mt-4 sm:tw-mt-0"
            flat
          >
            <q-card-section class="tw-text-text-grey tw-text-base tw-font-bold">
              Cài đặt
            </q-card-section>
            <q-separator class="tw-bg-app-bg" />
            <div class="tw-p-4">
              <div>Khi hết thời gian:</div>
              <div class="tw-mt-3 tw-w-full" v-if="restrictedLoading">
                <q-skeleton width="100px" type="text" />
                <q-skeleton type="text" />
              </div>
              <div
                v-if="!restrictedLoading"
                class="tw-flex tw-mt-3 tw-justify-between tw-items-center"
              >
                <div class="tw-text-text-grey">
                  <div class="tw-font-bold">Khoá trình duyệt</div>
                  <div>Ngăn chặn truy cập trình duyệt và internet</div>
                </div>
                <q-toggle
                  v-model="lockNavigation"
                  color="primary"
                  @update:model-value="onUpdateTime"
                />
              </div>
              <q-separator class="tw-bg-app-bg tw-my-2" />
              <div class="tw-mt-3 tw-w-full" v-if="restrictedLoading">
                <q-skeleton width="100px" type="text" />
                <q-skeleton type="text" />
              </div>
              <div
                v-if="!restrictedLoading"
                class="tw-flex tw-mt-3 tw-justify-between tw-items-center"
              >
                <div class="tw-text-text-grey">
                  <div class="tw-font-bold">Khoá thiết bị</div>
                  <div>
                    Ngăn chặn và ẩn ứng dụng trên thiết bị. Đăng xuất phiên làm
                    việc trên máy tính.
                  </div>
                </div>
                <q-toggle
                  v-model="lockDevice"
                  color="primary"
                  @update:model-value="onUpdateTime"
                />
              </div>
            </div>
          </q-card>
          <!-- <q-card class="my-card tw-bg-white tw-rounded-sm tw-mt-6" flat>
            <q-card-section class="tw-text-text-grey tw-text-base tw-font-bold">
              Thông báo
            </q-card-section>
            <q-separator class="tw-bg-app-bg" />
            <div class="tw-p-4">
              <div class="tw-mt-3 tw-w-full" v-if="restrictedLoading">
                <q-skeleton width="100px" type="text" />
                <q-skeleton type="text" />
              </div>
              <div
                v-if="!restrictedLoading"
                class="tw-flex tw-justify-between tw-items-center"
              >
                <div class="tw-text-text-grey">
                  <div class="tw-font-bold">Thông báo cho tôi</div>
                  <div>
                    Nhận thông báo khi thành viên đạt giới hạn cho phép.
                  </div>
                </div>
                <q-toggle
                  v-model="alertMe"
                  color="primary"
                  @update:model-value="onUpdateTime"
                />
              </div>
            </div>
          </q-card> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useUserStore from '@stores/user';
import useChildrenStore from '@stores/children';
import { storeToRefs } from 'pinia';
import childrenApi from '@api/children';
import { days } from '@/utils/date';
import TimeTable from '@/components/common/table/TimeTable.vue';
import { bodyUpdateRestricted } from '@/utils/fakeData';
import { useQuasar } from 'quasar';

const route: any = useRoute();
const router = useRouter();
const { userProfile }: any = useUserStore();
const { getRulesRestrictedChildren } = useChildrenStore();
const { restrictedTimeLimit, restrictedLoading }: any = storeToRefs(
  useChildrenStore()
);
const { updateRulesRestrictedTimes } = childrenApi();
const $q = useQuasar();

if (!restrictedTimeLimit) {
  updateRulesRestrictedTimes(
    userProfile.id,
    route.params.id,
    bodyUpdateRestricted
  );
}

getRulesRestrictedChildren(userProfile.id, route.params.id);

const lockNavigation = ref(false);
const lockDevice = ref(false);
const alertMe = ref(false);
const enableRestrictedTime = ref(false);
const limitRulesData = ref<any>({});
const morningRef = ref<any>(null);
const afternoonRef = ref<any>(null);
const nightRef = ref<any>(null);

watch(restrictedTimeLimit, (value) => {
  enableRestrictedTime.value = value.enabled;
  lockNavigation.value = value.triggers.timesup.lockNavigation;
  lockDevice.value = value.triggers.timesup.lockDevice;
  alertMe.value = value.triggers.timesup.alertMe;
});

const ruleToLimitTime = (morning: any, night: any, afternoon: any) => {
  const limit: any = {};

  const date = days.map((item) => item.value);
  date.forEach((item: any) => {
    if (!limit[item]) {
      limit[item] = [];
      if (morning[item]) {
        limit[item].push(...morning[item]);
      }
      if (night[item]) {
        limit[item].push(...night[item]);
      }
      if (afternoon[item]) {
        limit[item].push(...afternoon[item]);
      }
    }
  });

  date.forEach((item: any) => {
    if (!limit[item].length) delete limit[item];
  });

  return limit;
};

const onUpdateTime = async () => {
  const body = {
    enabled: enableRestrictedTime.value,
    limit: restrictedTimeLimit.value.limit,
    triggers: {
      timesup: {
        lockNavigation: lockNavigation.value,
        lockDevice: lockDevice.value,
        alertMe: alertMe.value,
      },
    },
  };

  try {
    $loading.start();
    await updateRulesRestrictedTimes(userProfile.id, route.params.id, body);
    $loading.finish();
  } catch (error) {
    $loading.finish();
  }
};

const handleUpdateRestricted = async () => {
  const morning = toRaw(morningRef.value.limitRules);
  const night = toRaw(nightRef.value.limitRules);
  const afternoon = toRaw(afternoonRef.value.limitRules);

  const limitRules = ruleToLimitTime(morning, night, afternoon);
  limitRulesData.value = limitRules;

  const body = {
    enabled: enableRestrictedTime.value,
    limit: limitRules,
    triggers: {
      timesup: {
        lockNavigation: lockNavigation.value,
        lockDevice: lockDevice.value,
        alertMe: alertMe.value,
      },
    },
  };

  try {
    await updateRulesRestrictedTimes(userProfile.id, route.params.id, body);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Có lỗi xảy ra, vui lòng thử lại sau',
      position: 'top-right',
      icon: 'error',
      timeout: 3000,
    });
    console.error(error);
  }
};
</script>

<style lang="scss" scoped>
.daily-wrapper {
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 100px);
    margin-top: 16px;
  }
}

.daily-content {
  flex-grow: 1;
  overflow: auto;
}
.restricted-header {
  margin-top: 16px;
  table {
    position: relative;
    width: 100%;
  }
  td:first-child {
    border: none;
  }
  td {
    width: 50px;
    border: solid 1px #d9d9d9;
    padding: 4px;
    border-collapse: collapse;
    text-align: center;
    font-size: 16px;
    font-weight: normal;
  }
}

.bg-restricted {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
