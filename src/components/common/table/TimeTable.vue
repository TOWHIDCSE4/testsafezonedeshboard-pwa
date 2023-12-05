<template>
  <div
    class="tw-flex"
    @click="onClickTable"
    :class="{
      'tw-h-[300px]': isCollapse,
      'tw-h-[80px]': !isCollapse,
    }"
  >
    <div v-if="isCollapse" class="tw-w-[85px] flexible-spacing-between-columns">
      <div
        v-for="(item, index) in endTime - startTime + 1"
        class="tw-text-right tw-pr-4"
      >
        {{ index + startTime }}{{ index + startTime < 12 ? 'am' : 'pm' }}
      </div>
    </div>
    <div v-if="!isCollapse" class="tw-w-[85px] tw-relative">
      <div class="tw-absolute tw-top-0 tw-right-4">{{ startText }}</div>
      <div class="tw-absolute tw-bottom-0 tw-right-4">{{ endText }}</div>
    </div>
    <div class="tw-grid tw-grid-cols-7 tw-w-full" v-if="limitRulesArray.length">
      <div
        v-for="(item, index) in limitRulesArray"
        :key="index"
        :class="{
          'tw-bg-success tw-text-success': item === 1,
          'tw-bg-primary-medium tw-text-primary-medium': item !== 1,
          'tw-pointer-events-none': !isCollapse,
          'tw-cursor-pointer': isCollapse,
        }"
        class="cell-table"
        @click="onClickCell(item, index)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { useDebounceFn } from '@vueuse/core';

interface LimitRules {
  limitFrom: string;
  limitTo: string;
}

const props = defineProps({
  startTime: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Number,
    required: true,
  },
  startText: {
    type: String,
    default: '',
  },
  endText: {
    type: String,
    default: '',
  },
  isAddTime: {
    type: Boolean,
    default: false,
  },
  limitTime: {
    type: Object,
    default: () => {},
  },
});

const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const isCollapse = ref(false);
const emit = defineEmits(['onUpdateRestricted']);

const cellCount = computed(() => {
  return (Math.abs(props.endTime - props.startTime) + 1) * 7;
});

const initLimitRulesArray = () => {
  const cellArray = Array(cellCount.value).fill(1);

  if (!props.limitTime) return cellArray;

  cellArray.forEach((_state, hourIndex) => {
    const weekdayIndex = hourIndex % 7; // 0 = Monday, 1 = Tuesday, 2 = Wednesday
    const weekdayKey = WEEKDAYS[weekdayIndex]; // monday, tuesday,... dùng để đọc trong API

    const limitRules = props.limitTime[weekdayKey]; // Ví dụ monday: {limitFrom: 00:00, limitTo: 06:00}

    if (!limitRules?.length) return;

    limitRules.forEach((rule: any) => {
      const tableStartTime = props.startTime;
      const hourFrom = +rule.limitFrom.split(':')[0];
      let hourTo = +rule.limitTo.split(':')[0];
      const blockedDayIndexes = [];

      // Handle 23:00 -> 00:00 case
      if (hourFrom > hourTo && hourTo === 0) hourTo = 24;

      for (let i = hourFrom; i < hourTo; i++) {
        if (i > props.endTime || i < tableStartTime) continue;

        blockedDayIndexes.push((i - tableStartTime) * 7 + weekdayIndex);
      }

      if (blockedDayIndexes.includes(hourIndex)) {
        cellArray[hourIndex] = 0;
      }
    });
  });

  return cellArray;
};

const ruleArrayToObject = (limitRulesArray: any) => {
  const limitObj: any = {};
  const dummyDate = new Date('2022-01-01 00:00:00');

  // Ví dụ [0,0,0,1,0,1,1,0]. Có thể viết trong vòng lặp cho ngắn, nhưng để ntn cho dễ hiểu.
  const mondayRules = limitRulesArray.value.filter(
    (_, index) => index % 7 === 0
  );
  const tuesdayRules = limitRulesArray.value.filter(
    (_, index) => index % 7 === 1
  );
  const wednesdayRules = limitRulesArray.value.filter(
    (_, index) => index % 7 === 2
  );
  const thursdayRules = limitRulesArray.value.filter(
    (_, index) => index % 7 === 3
  );
  const fridayRules = limitRulesArray.value.filter(
    (_, index) => index % 7 === 4
  );
  const saturdayRules = limitRulesArray.value.filter(
    (_, index) => index % 7 === 5
  );
  const sundayRules = limitRulesArray.value.filter(
    (_, index) => index % 7 === 6
  );

  const ruleMapFn = (state: number, hourIndex: number) => {
    if (state !== 0) return;

    const limitFrom = date.formatDate(
      date.addToDate(dummyDate, {
        hour: hourIndex + props.startTime,
      }),
      'HH:mm'
    );

    const limitTo = date.formatDate(
      date.addToDate(dummyDate, {
        hour: hourIndex + props.startTime + 1,
      }),
      'HH:mm'
    );

    return {
      limitFrom,
      limitTo,
    };
  };

  limitObj['monday'] = mondayRules.map(ruleMapFn).filter((val) => val);
  limitObj['tuesday'] = tuesdayRules.map(ruleMapFn).filter((val) => val);
  limitObj['wednesday'] = wednesdayRules.map(ruleMapFn).filter((val) => val);
  limitObj['thursday'] = thursdayRules.map(ruleMapFn).filter((val) => val);
  limitObj['friday'] = fridayRules.map(ruleMapFn).filter((val) => val);
  limitObj['saturday'] = saturdayRules.map(ruleMapFn).filter((val) => val);
  limitObj['sunday'] = sundayRules.map(ruleMapFn).filter((val) => val);

  return limitObj;
};

const limitRulesArray = ref(initLimitRulesArray());
const limitRules = ref<any>(ruleArrayToObject(limitRulesArray));

console.log(toRaw(limitRulesArray.value));

defineExpose({
  limitRules,
});

const onClickTable = () => {
  isCollapse.value = true;
};

const toggleRule = (state: number, index: number) => {
  if (state === 0) {
    limitRulesArray.value[index] = 1;
  } else {
    limitRulesArray.value[index] = 0;
  }
};

const debouncedUpdateRules = useDebounceFn(
  () => emit('onUpdateRestricted'),
  1000
);

const onClickCell = (state: number, index: number) => {
  toggleRule(state, index);

  limitRules.value = ruleArrayToObject(limitRulesArray);

  debouncedUpdateRules();
};
</script>

<style lang="scss" scoped>
.cell-table {
  border: solid 0.5px #d9d9d9;
  padding: 4px;
  border-collapse: collapse;
  text-align: center;
  font-size: 16px;
  font-weight: normal;
}

.flexible-spacing-between-columns {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
