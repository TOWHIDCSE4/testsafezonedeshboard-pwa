<template>
  <div class="filter-wrapper sm:tw-flex sm:tw-items-center">
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
        no-caps
      />
    </q-tabs>
  </div>
  <div class="card-wrapper">
    <div class="card-list">
      <div class="sm:tw-grid sm:tw-grid-cols-2 sm:tw-gap-4" v-if="!dataUser">
        <q-skeleton height="350px" v-for="item in 1" :key="item" />
      </div>
    </div>
  </div>
  <div class="card-wrapper">
    <div class="card-list" v-if="dataUser">
      <ListQuizAI :active-tab="tab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ListQuizAI from '@components/common/children/ListQuizAI.vue';
import useUserStore from '../../stores/user';
import { storeToRefs } from 'pinia';
import { date } from 'quasar';
enum EnumTGenAISubject {
  Maths = 'maths',
  Vietnamese = 'vietnamese',
  English = 'english',
  Skill = 'skill',
}
const TGenAISubject = ['maths', 'vietnamese', 'english', 'skill'];
const TextTGenAISubject = ['Toán', 'Tiếng Việt', 'Tiếng Anh', 'Kỹ năng'];
const timeStamp = Date.now();
const currentDayDateModel = date.formatDate(timeStamp, 'YYYY/MM/DD');
const route = useRoute();
const { getUserChildren, childrenLoading }: any = useUserStore();
const { userProfile, userChildren }: any = storeToRefs(useUserStore());
let dataUser: any = null;
let filterList: any = [];
if (!userChildren.value.length && !childrenLoading) {
  getUserChildren(userProfile.value.id);
}
const data = userChildren.value.filter(
  (item: any) => item.id === route.params.id
);
dataUser = data[0];
let tab = ref('0');
if (dataUser.support_subject && dataUser.support_subject.length > 0) {
  for (const [index, item] of dataUser.support_subject.entries()) {
    const indexSubject = Number(TGenAISubject.indexOf(item));
    if (index === 0) {
      tab = ref(`${indexSubject + 1}`);
    }
    filterList.push({
      name: `${indexSubject + 1}`,
      label: TextTGenAISubject[indexSubject],
    });
  }
}
</script>

<style lang="scss" scoped>
::v-deep() {
  .q-tabs--not-scrollable .q-tabs__content {
    background-color: #fafafa !important;
  }
  .q-field__marginal {
    height: 40px;
  }
  .q-field__control {
    height: 40px;
  }
  .q-tab--inactive {
    color: #009688;
    border: 1px solid #009688;
  }

  .q-tab--inactive:hover {
    background-color: #75b3a4;
    color: white;
  }
  .q-tab--active {
    background-color: #6161ff;
    color: #fff;
    background-color: #009688;

    .q-tab__label {
      font-weight: bold;
    }
    .q-tab__indicator {
      opacity: 0;
    }
  }
  .q-card > div:last-child {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
}

.q-tab {
  border-radius: 10px;
  margin-right: 10px;
  min-width: 120px;
}

.filter-tabs {
  &::before {
    content: '';
    height: 24px;
    width: 1px;
    position: absolute;
    left: 0;
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
