<template>
  <div class="daily-wrapper">
    <div class="daily-content">
      <div class="lg:tw-flex">
        <div class="lg:tw-w-2/3 lg:tw-pr-4">
          <q-card class="tw-bg-white tw-rounded-sm tw-p-4" flat>
            <div>Đặt giới hạn sử dụng cho phép cho mỗi ngày trong tuần.</div>
            <div class="tw-flex tw-justify-center tw-mt-6">
              <div class="tw-flex tw-items-center">
                <q-btn
                  v-for="(item, index) in days"
                  :key="index"
                  :outline="!(isActive === item.value)"
                  round
                  :class="`${
                    isActive === item.value
                      ? isBlock
                        ? 'tw-bg-error-dark tw-text-white'
                        : 'tw-bg-primary tw-text-white'
                      : 'tw-text-grey-300'
                  }`"
                  size="md"
                  no-caps
                  @click="onClickDays(item)"
                >
                  {{ item.label }}
                </q-btn>
              </div>
            </div>
            <div
              v-if="dailyLoading"
              class="tw-p-6 tw-flex tw-justify-center tw-relative tw-mt-6"
            >
              <q-skeleton type="circle" size="250px" />
            </div>
            <div
              class="tw-p-6 tw-flex tw-justify-center tw-relative tw-mt-6"
              v-if="!dailyLoading"
            >
              <vue3-slider
                v-model="slider"
                width="250px"
                :height="30"
                color="#6161ff"
                :handleScale="1.5"
                :alwaysShowHandle="true"
                :min="0"
                :max="96"
                :repeat="true"
                :track-color="sliderColor"
                orientation="circular"
                @change="onChangeSlider"
                @drag-end="onDragEndSlider"
              />
              <div
                class="tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-y-1/2 -tw-translate-x-1/2 tw-flex tw-flex-col tw-items-center tw-text-text-grey"
              >
                <div class="tw-text-base">Giới hạn hàng ngày</div>
                <div v-if="!dailyLoading" class="tw-font-bold time-font">
                  {{ clockNumber }}
                </div>
                <div class="tw-flex tw-text-base">
                  <div class="tw-mr-8">Giờ</div>
                  <div>Phút</div>
                </div>
                <div class="tw-text-base">{{ dayOfWeek }}</div>
              </div>
            </div>
            <div class="tw-flex tw-justify-center">
              <div class="tw-flex tw-justify-between tw-w-1/2">
                <div
                  class="tw-cursor-pointer"
                  @click="onClickClockBtn('24:00', 96)"
                >
                  <q-btn
                    outline
                    round
                    class="tw-text-grey-300"
                    icon="o_schedule"
                    size="lg"
                  />
                  <div class="tw-text-text-grey tw-mt-1">Cho phép</div>
                </div>
                <div
                  class="tw-flex tw-flex-col tw-items-center tw-cursor-pointer"
                  @click="onClickClockBtn('00:00', 0)"
                >
                  <q-btn
                    outline
                    round
                    class="tw-text-grey-300"
                    icon="o_lock"
                    size="lg"
                  />
                  <div class="tw-text-text-grey tw-mt-1">Chặn</div>
                </div>
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
              <div class="tw-mt-3 tw-w-full" v-if="dailyLoading">
                <q-skeleton width="100px" type="text" />
                <q-skeleton type="text" />
              </div>
              <div
                v-if="!dailyLoading"
                class="tw-flex tw-mt-3 tw-justify-between tw-items-center"
              >
                <div class="tw-text-text-grey">
                  <div class="tw-font-bold">Khoá trình duyệt</div>
                  <div>Ngăn chặn truy cập trình duyệt và internet</div>
                </div>
                <q-toggle
                  v-model="lockNavigation"
                  color="primary"
                  @update:model-value="onDragEndSlider"
                />
              </div>
              <q-separator class="tw-bg-app-bg tw-my-2" />
              <div class="tw-mt-3 tw-w-full" v-if="dailyLoading">
                <q-skeleton width="100px" type="text" />
                <q-skeleton type="text" />
              </div>
              <div
                v-if="!dailyLoading"
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
                  @update:model-value="onDragEndSlider"
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
              <div class="tw-mt-3 tw-w-full" v-if="dailyLoading">
                <q-skeleton width="100px" type="text" />
                <q-skeleton type="text" />
              </div>
              <div
                v-if="!dailyLoading"
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
                  @update:model-value="onDragEndSlider"
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
import Vue3Slider from 'vue3-slider';
import { date } from 'quasar';
import useUserStore from '@stores/user';
import useChildrenStore from '@stores/children';
import { storeToRefs } from 'pinia';
import childrenApi from '@api/children';
import { days } from '@/utils/date';

const timeStamp = Date.now();
const currentDay = date.formatDate(timeStamp, 'dddd').toLowerCase();
const { updateRulesDailyTimes } = childrenApi();

const route = useRoute();
const { userProfile }: any = useUserStore();
const { getRuleDailyChildren }: any = useChildrenStore();

const { dailyTimeLimit, dailyLoading }: any = storeToRefs(useChildrenStore());

getRuleDailyChildren(userProfile.id, route.params.id);

const limit = ref<any>({});
const slider = ref<any>(96);
const clockNumber = ref('');
const isActive = ref(currentDay);
const isBlock = ref(false);
const lockNavigation = ref(false);
const lockDevice = ref(false);
const alertMe = ref(false);

const dayOfWeek = computed(() => {
  switch (isActive.value) {
    case 'monday':
      return 'Thứ hai';
    case 'tuesday':
      return 'Thứ ba';
    case 'wednesday':
      return 'Thứ tư';
    case 'thursday':
      return 'Thứ năm';
    case 'friday':
      return 'Thứ sáu';
    case 'saturday':
      return 'Thứ bảy';
    case 'sunday':
      return 'Chủ nhật';

    default:
      break;
  }
});

const sliderColor = computed(() => {
  return isBlock.value ? '#f96472' : '#f1f1ff';
});

watch(dailyTimeLimit, (value) => {
  limit.value = value.limit;

  if (limit.value[isActive.value]) {
    clockNumber.value = limit.value[isActive.value];
    slider.value = sliderTime(limit.value[isActive.value]);
    if (limit[isActive.value] === '00:00') {
      isBlock.value = true;
    }
  } else {
    clockNumber.value = '24:00';
    slider.value = sliderTime('24:00');
  }

  lockNavigation.value = value.triggers.timesup.lockNavigation;
  lockDevice.value = value.triggers.timesup.lockDevice;
  alertMe.value = value.triggers.timesup.alertMe;
});

const sliderTime = (value: string) => {
  const time = value.split(':');
  let total = 0;
  let hour = +time[0];
  let min = +time[1];

  if (value === '00:00') return 0;

  if (min === 0) {
    total = hour * 4;
  } else {
    total = hour * 4 + min / 15;
  }

  return total;
};

const onClickDays = (item: any) => {
  isActive.value = item.value;

  if (limit.value[item.value]) {
    clockNumber.value = limit.value[item.value];
    slider.value = sliderTime(limit.value[item.value]);
  } else {
    clockNumber.value = '24:00';
    slider.value = sliderTime('24:00');
  }

  if (slider.value === 0) {
    isBlock.value = true;
  }
};

const onClickClockBtn = (clock: string, slide: number) => {
  let time = convertTime(slide);
  if (slide === 0) {
    isBlock.value = true;
  }
  clockNumber.value = clock;
  slider.value = slide;
  limit.value[isActive.value] = time;
  updateRules();
};

const numberToMinutes = (number: number) => {
  switch (number) {
    case 1:
      return '15';
    case 2:
      return '30';
    case 3:
      return '45';
    case 0:
      return '00';
    default:
      break;
  }
};

const convertTime = (value: number) => {
  let hour = 0;
  let min = 0;

  if (value % 4 === 0) {
    hour = value / 4;
    min = 0;
  } else {
    hour = Math.floor(value / 4);
    min = value - hour * 4;
  }

  if (hour >= 10) {
    return `${String(hour)}:${numberToMinutes(min)}`;
  } else {
    return `0${String(hour)}:${numberToMinutes(min)}`;
  }
};

const updateRules = async () => {
  try {
    const body = {
      enabled: true,
      limit: limit.value,
      triggers: {
        timesup: {
          lockNavigation: lockNavigation.value,
          lockDevice: lockDevice.value,
          alertMe: alertMe.value,
        },
      },
    };

    await updateRulesDailyTimes(userProfile.id, route.params.id, body);
  } catch (error) {
    console.log(error);
  }
};

const onChangeSlider = (value: any) => {
  let time = convertTime(value);
  limit.value[isActive.value] = time;
  if (!value) {
    isBlock.value = true;
  } else {
    isBlock.value = false;
  }
  clockNumber.value = time;
};

const onDragEndSlider = async (value: any) => {
  updateRules();
};
</script>

<style lang="scss" scoped>
::v-deep() {
  .vue3-slider.circular .handle-container .handle {
    box-shadow: -1px 0px rgb(0 0 0 / 20%);
    z-index: 1;
  }
}

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

.time-font {
  font-size: 48px;
  line-height: 1;
}
</style>
