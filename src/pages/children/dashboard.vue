<template>
  <q-card
    v-if="!isConnectedDevice && !devicesLoading"
    class="sm:tw-w-1/2 sm:tw-mt-2 tw-mt-4 tw-p-4"
    flat
  >
    <div class="tw-text-base sm:tw-text-xl tw-font-bold">Kết nối thiết bị</div>
    <AddDevice />
  </q-card>
  <q-card
    :class="`my-card tw-rounded-lg tw-p-4 filter-wrapper sm:tw-flex sm:tw-items-center tw-mb-2 sm:tw-mb-0
          ${
            currentAction != 'pause_internet'
              ? ' tw-bg-primary'
              : ' tw-bg-orange-dark'
          }
      `"
    flat
  >
    <q-inner-loading color="white" :showing="restrictedLoading" />
    <div
      v-if="!restrictedLoading"
      class="sm:tw-w-1/2 tw-flex tw-items-center tw-mb-2 sm:tw-mb-0"
    >
      <div
        :class="`tw-mr-4 tw-text-white tw-p-2 ct-border-radius-50 ${
          currentAction != 'pause_internet'
            ? 'tw-bg-[#8282e5]'
            : 'tw-bg-[#dc8e65]'
        }`"
      >
        <q-icon
          :name="currentAction !== 'pause_internet' ? 'security' : 'wifi_off'"
          size="md"
        />
      </div>
      <div>
        <div class="tw-text-white tw-font-semibold">
          {{
            currentAction != 'pause_internet'
              ? 'SafeZone đang hoạt động'
              : 'Đã dừng truy cập internet'
          }}
        </div>
        <div class="tw-text-white tw-font-semibold">
          {{
            currentAction != 'pause_internet'
              ? 'Bảo vệ và giám sát được kích hoạt'
              : `Dừng truy cập đến ${time} ${isTomorrow ? 'ngày mai' : ''}`
          }}
        </div>
      </div>
    </div>
    <div
      v-if="!restrictedLoading"
      class="sm:tw-w-1/2 tw-flex tw-justify-end tw-items-conter"
    >
      <q-btn-dropdown
        icon="settings"
        :color="currentAction != 'pause_internet' ? 'primary' : 'orange-dark'"
        label="Hành động nhanh"
      >
        <q-list>
          <q-item
            v-if="currentOptions.length"
            v-for="(item, index) in currentOptions"
            :key="index"
            clickable
            v-close-popup
            @click="onActionChange(item.value)"
          >
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </q-card>
  <q-card
    v-if="
        !dataUser.real_name &&
        !dataUser.date_of_birth &&
        !dataUser.grade &&
        !dataUser.address &&
        !dataUser.subjectOptions
      "
    class="tw-mt-4 tw-bg-[#f7ce19] tw-rounded-lg tw-font-bold sm:tw-flex sm:tw-items-center sm:tw-justify-between sm:tw-mb-2 tw-p-4 box-xs"
    color="#dbb714"
  >
    <div class="tw-text-[19px] tw-text-[#3cbd15] sm:tw-mr-4 sm-text-center">
      Bạn mong muốn SafeZone bảo vệ và giáo dục {{ dataUser.fullname }} tốt hơn?
    </div>
    <div>
      <a :href="'/family/' + dataUser.id + '/education'">
        <div
          class="tw-text-lg tw-text-white tw-bg-[#339e13] tw-py-2 tw-rounded-full tw-min-w-[120px] sm:tw-w-[200px] tw-text-center button-xs"
        >
          Bổ sung thông tin
        </div>
      </a>
    </div>
  </q-card>
  <div
    v-if="!devicesLoading && isConnectedDevice"
    class="filter-wrapper sm:tw-flex sm:tw-items-center"
  >
    <q-tabs
      v-model="tab"
      dense
      align="left"
      class="bg-white"
      indicator-color="primary"
    >
      <q-tab
        v-for="(item, index) in filterList"
        :key="index"
        class="filter-tabs"
        :ripple="false"
        :name="item.name"
        :label="item.label"
        :icon="item.icon"
        no-caps
      />
    </q-tabs>
    <div v-if="tab === 'select'" class="sm:tw-ml-3 sm:tw-mt-0 tw-mt-4">
      <q-input
        outlined
        :dense="false"
        v-model="dateModel"
        mask="date"
        :rules="['date']"
        :hide-bottom-space="true"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="datePopupProxyRef">
              <q-date
                v-model="dateModel"
                minimal
                :options="optionsDate"
                mask="YYYY-MM-DD"
                :default-date="currentDayDateModel"
                @update:model-value="onInputDate"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
  <div v-if="devicesLoading" class="card-wrapper">
    <div class="card-list">
      <div class="sm:tw-grid sm:tw-grid-cols-2 sm:tw-gap-4">
        <q-skeleton height="350px" v-for="item in 4" :key="item" />
      </div>
    </div>
  </div>
  <div v-if="!devicesLoading && isConnectedDevice" class="card-wrapper">
    <div class="card-list">
      <ListCardDashboard :active-tab="tab" />
    </div>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="ruleTimeRestrictionDialog"
      ruleTimeRestrictionDialog
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-white tw-p-4">
        <form @submit.prevent="onSubmitTimeLimit">
          <div class="row items-center q-pb-none">
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
          <q-card-section class="tw-pb-0">
            <div class="text-h6">Thời gian dừng truy cập internet</div>
          </q-card-section>
          <q-card-section class="tw-flex tw-items-center tw-justify-center">
            <SZInput
              v-model="hours"
              type="number"
              min="0"
              max="24"
              class="tw-w-20 tw-mr-1 input-hidden-arrows"
              v-on:keyup="handleChangeHours"
            />
            <div>h</div>
            <SZInput
              v-model="minutes"
              type="number"
              min="0"
              max="59"
              class="tw-w-20 tw-mr-1 tw-ml-1 input-hidden-arrows"
              v-on:keyup="handleChangeMinutes"
            />
            <div>m</div>
          </q-card-section>
          <q-card-section v-if="time" class="tw-pt-0">
            <div class="tw-text-center">
              Dừng truy cập đến {{ time }} {{ isTomorrow ? 'ngày mai' : '' }}
            </div>
          </q-card-section>
          <q-card-section v-if="warningUnpauseInternet" class="tw-pt-0">
            <div class="tw-text-center tw-text-warning-dark">
              <q-icon name="warning" size="sm" /> Cho phép truy cập internet
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              class="tw-bg-primary tw-text-white tw-w-full"
              flat
              label="Xác nhận"
              type="submit"
              v-close-popup
            />
          </q-card-actions>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import ListCardDashboard from '@components/common/children/ListCardDashboard.vue';
import useChildrenStore from '../../stores/children';
import useUserStore from '../../stores/user';
import { storeToRefs } from 'pinia';
import AddDevice from '@components/common/children/AddDevice.vue';
import { date, useQuasar } from 'quasar';
import { useForm, useField } from 'vee-validate';
import SZInput from '@/components/common/input/SZInput.vue';
import childrenApi from '../../api/children';

const { updateRulesRestrictedTimes } = childrenApi();

const timeStamp = Date.now();
const currentDay = date.formatDate(timeStamp, 'YYYY-MM-DD');
const currentDayDateModel = date.formatDate(timeStamp, 'YYYY/MM/DD');
const currentOptions = ref([]);
const unpauseInternetOptions = ref([
  { label: 'Dừng truy cập internet', value: 'pause_internet' },
]);
const pauseInternetOptions = ref([
  { label: 'Cho phép truy cập internet', value: 'unpause_internet' },
  { label: 'Sửa khoảng thời gian', value: 'edit_duration' },
]);
const ruleTimeRestrictionDialog = ref(false);
const { handleSubmit } = useForm({});
const $q = useQuasar();
const { value: hours } = useField<string>('hours');
const { value: minutes } = useField<string>('minutes');
hours.value = '00';
minutes.value = '00';
const time = ref('');
const isTomorrow = ref(false);
const selectedAction = ref('unpause_internet');
const currentAction = ref('unpause_internet');
const warningUnpauseInternet = ref(false);
const { restrictedTimeLimit }: any = storeToRefs(useChildrenStore());

const tab = ref('today');
const dateModel = ref(currentDayDateModel);
const datePopupProxyRef = ref<any>(null);

const filterList = [
  {
    name: 'today',
    label: 'Hôm nay',
  },
  {
    name: '7',
    label: '7d',
  },
  {
    name: '15',
    label: '15d',
  },
  {
    name: '30',
    label: '30d',
  },
  {
    name: 'select',
    icon: 'calendar_month',
  },
];

const route: any = useRoute();
const {
  getChildrenActivities,
  getRuleDailyChildren,
  getDevicesChildren,
  getRulesRestrictedChildren,
  setRestrictedLoading,
}: any = useChildrenStore();
const { userProfile }: any = useUserStore();
const { getUserChildren, childrenLoading }: any = useUserStore();
const { userChildren }: any = storeToRefs(useUserStore());
const { devicesLoading, childrenDevices, restrictedLoading } = storeToRefs(
  useChildrenStore()
);

console.log();
if (!userChildren?.value?.length && !childrenLoading) {
  getUserChildren(userProfile.id);
}

const dataUser: any = computed(() => {
  if (userChildren.value.length) {
    const data = userChildren.value.filter(
      (item: any) => item.id === route.params.id
    );
    return data[0];
  }
});

getChildrenActivities(userProfile.id, route.params.id, {
  from: currentDay,
});
getRuleDailyChildren(userProfile.id, route.params.id);
getRulesRestrictedChildren(userProfile.id, route.params.id);
getDevicesChildren(userProfile.id, route.params.id);

watch(tab, async (value) => {
  switch (value) {
    case 'today':
      await getChildrenActivities(userProfile.id, route.params.id, {
        from: currentDay,
      });
      break;

    case '7':
    case '15':
    case '30':
      const fromDate = date.formatDate(
        date.subtractFromDate(currentDay, { days: +value }),
        'YYYY-MM-DD'
      );
      await getChildrenActivities(userProfile.id, route.params.id, {
        from: fromDate,
        to: currentDay,
      });
      break;
    case 'select':
      await getChildrenActivities(userProfile.id, route.params.id, {
        from: currentDay,
      });
      break;

    default:
      break;
  }
});

watch(restrictedTimeLimit, (value) => {
  const internetPauseTimeLimit = value?.internet_pause_time_limit;
  if (internetPauseTimeLimit) {
    currentAction.value = 'pause_internet';
    currentOptions.value = pauseInternetOptions.value;
    const numberHours = Math.floor(internetPauseTimeLimit / 60);
    const numberMinutes = internetPauseTimeLimit % 60;

    const addTime = date.addToDate(value.internet_pause_start_time, {
      hours: numberHours,
      minutes: numberMinutes,
    });
    const formatCurrentDateTime = date.formatDate(
      timeStamp,
      'YYYY-MM-DD HH:mm'
    );
    const formatDateTime = date.formatDate(addTime, 'YYYY-MM-DD HH:mm');

    if (formatCurrentDateTime < formatDateTime) {
      handleChangeTime(
        numberHours,
        numberMinutes,
        value.internet_pause_start_time
      );
    } else {
      currentAction.value = 'unpause_internet';
      currentOptions.value = unpauseInternetOptions.value;
    }
  } else {
    currentAction.value = 'unpause_internet';
    currentOptions.value = unpauseInternetOptions.value;
  }
});

const isConnectedDevice = computed(() => childrenDevices.value[0] !== null);

const onInputDate = async (value: any) => {
  const ref = toRaw(datePopupProxyRef.value);
  try {
    ref.hide();
    await getChildrenActivities(userProfile.id, route.params.id, {
      from: value,
    });
  } catch (error) {
    console.log(error);
  }
};

const optionsDate = (datePicker: any) => {
  const month = date.formatDate(
    date.subtractFromDate(currentDayDateModel, { days: 30 }),
    'YYYY/MM/DD'
  );

  return datePicker <= currentDayDateModel && datePicker >= month;
};

const onActionChange = async (value: any) => {
  const type = value;

  try {
    selectedAction.value = type;
    if (type === 'pause_internet') {
      ruleTimeRestrictionDialog.value = true;
    } else if (type === 'unpause_internet') {
      setRestrictedLoading(true);
      currentOptions.value = unpauseInternetOptions.value;
      hours.value = '00';
      minutes.value = '00';
      const body = {
        internet_pause_start_time: null,
        internet_pause_time_limit: null,
      };

      await updateRulesRestrictedTimes(userProfile.id, route.params.id, body);
      await getRulesRestrictedChildren(userProfile.id, route.params.id);
      setRestrictedLoading(false);
    } else if (type === 'edit_duration') {
      ruleTimeRestrictionDialog.value = true;
    }
  } catch (error) {
    if (type === 'unpause_internet') {
      setRestrictedLoading(false);
    }

    $q.notify({
      color: 'negative',
      message: error,
      position: 'top-right',
      icon: 'error',
      timeout: 3000,
    });
  }
};

const onSubmitTimeLimit = handleSubmit(async (values: any) => {
  try {
    if (
      (selectedAction.value == 'edit_duration' ||
        selectedAction.value == 'pause_internet') &&
      (Number(hours.value) > 0 || Number(minutes.value) > 0)
    ) {
      setRestrictedLoading(true);
      currentOptions.value = pauseInternetOptions.value;
      const body = {
        internet_pause_start_time: Date.now(),
        internet_pause_time_limit:
          Number(hours.value) * 60 + Number(minutes.value),
      };

      await updateRulesRestrictedTimes(userProfile.id, route.params.id, body);
      await getRulesRestrictedChildren(userProfile.id, route.params.id);
      setRestrictedLoading(false);
    }

    if (
      (selectedAction.value == 'edit_duration' ||
        selectedAction.value == 'pause_internet') &&
      Number(hours.value) <= 0 &&
      Number(minutes.value) <= 0
    ) {
      setRestrictedLoading(true);
      currentOptions.value = unpauseInternetOptions.value;
      const body = {
        internet_pause_start_time: null,
        internet_pause_time_limit: null,
      };

      await updateRulesRestrictedTimes(userProfile.id, route.params.id, body);
      await getRulesRestrictedChildren(userProfile.id, route.params.id);
      setRestrictedLoading(false);
    }
  } catch (error: any) {
    $q.notify({
      color: 'negative',
      message: error,
      position: 'top-right',
      icon: 'error',
      timeout: 3000,
    });
  }
});

const handleChangeTime = (numberHours, numberMinutes, startTimestamp) => {
  if (numberHours > 0 || numberMinutes > 0) {
    const addTime = date.addToDate(startTimestamp, {
      hours: numberHours,
      minutes: numberMinutes,
    });
    const formatTime = date.formatDate(addTime, 'HH:mm');
    const formatDate = date.formatDate(addTime, 'YYYY-MM-DD');

    time.value = formatTime;
    isTomorrow.value = currentDay < formatDate ? true : false;
  } else {
    time.value = '';
    isTomorrow.value = false;
  }

  if (
    selectedAction.value == 'edit_duration' &&
    numberHours <= 0 &&
    numberMinutes <= 0
  ) {
    warningUnpauseInternet.value = true;
  } else {
    warningUnpauseInternet.value = false;
  }
};

const handleChangeHours = (e: any) => {
  const value = e.target.value;
  if (!value) {
    hours.value = '00';
  }

  const numberVal = Number(value);
  console.log('numberVal: ', numberVal);

  if (numberVal < 10) {
    hours.value = `0${numberVal}`;
  } else {
    hours.value = `${numberVal}`;
  }

  const numberHours = Number(hours.value);
  if (numberHours >= 24) {
    hours.value = '24';
    minutes.value = '00';
  }

  handleChangeTime(numberHours, Number(minutes.value), timeStamp);
};

const handleChangeMinutes = (e: any) => {
  const value = e.target.value;
  if (!value) {
    minutes.value = '00';
  }

  const numberVal = Number(value);
  if (numberVal < 10) {
    minutes.value = `0${numberVal}`;
  } else {
    minutes.value = `${numberVal}`;
  }

  const numberHours = Number(hours.value);
  const numberMinutes = Number(minutes.value);
  if (numberHours >= 24) {
    minutes.value = '00';
  } else if (numberMinutes > 59) {
    minutes.value = '59';
  }

  handleChangeTime(numberHours, numberMinutes, timeStamp);
};
</script>

<style lang="scss" scoped>
::v-deep() {
  .q-field__marginal {
    height: 40px;
  }
  .q-field__control {
    height: 40px;
  }
  .q-tab--inactive {
    color: #58595a;
  }
  .q-tab--active {
    background-color: #6161ff;
    color: #fff;

    .q-tab__label {
      font-weight: bold;
    }
  }
  .q-card > div:last-child {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
}
.filter-tabs {
  &::before {
    content: '';
    height: 24px;
    width: 1px;
    position: absolute;
    left: 0;
    background-color: #dedede;
  }

  &:first-child {
    &::before {
      width: 0px;
    }
  }
}
.filter-wrapper {
  @media (min-width: 1024px) {
    padding-top: 16px;
  }
  padding-bottom: 16px;
  // max-width: 580px;
}

.card-wrapper {
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 150px);
  }
}

.card-list {
  flex-grow: 1;
  overflow: auto;
}

.ct-border-radius-50 {
  border-radius: 50% !important;
}

@media (min-width: 320px) and (max-width: 600px) {
  .box-xs {
    margin-bottom: 15px;
    padding: 15px;
  }
  .button-xs {
    margin: 10px;
  }

  .sm-text-center {
    text-align: center;
  }
}
</style>
