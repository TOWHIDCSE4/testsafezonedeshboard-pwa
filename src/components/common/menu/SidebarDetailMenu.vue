<template>
  <div v-if="!user" class="tw-flex tw-flex-col tw-items-center tw-p-4">
    <q-skeleton type="circle" size="99px" />
    <q-skeleton type="text" class="tw-mt-1" width="60px" />
    <q-skeleton type="text" width="40px" />
  </div>
  <UserAvatar
    v-else
    :fullname="user?.fullname"
    :status="user?.status"
    :is-edit="true"
    @on-click-edit="onEditUser"
  />
  <q-separator class="tw-bg-app-bg" />
  <div class="menu-wrapper">
    <q-scroll-area :thumb-style="{ opacity: '0' }" class="fit">
      <div class="tw-mt-4 tw-px-2">
        <div class="tw-p-2 tw-ml-4 tw-font-bold tw-text-fullname tw-text-base">
          HOẠT ĐỘNG
        </div>
        <router-link
          v-for="(item, index) in activityList"
          :key="index"
          :to="item.path || `/family/${route.params.id}`"
          class="nav-item tw-text-fullname tw-my-2 tw-p-2"
          :class="route.path === item.path ? 'active' : ''"
        >
          <div class="tw-ml-4">{{ item.label }}</div>
        </router-link>
        <div class="tw-p-2 tw-ml-4 tw-font-bold tw-text-fullname tw-text-base">
          QUY TẮC
        </div>
        <router-link
          v-for="(item, index) in rulesList"
          :key="index"
          :to="item.path || `/family/${route.params.id}`"
          class="nav-item tw-text-fullname tw-my-2 tw-p-2"
          :class="route.path === item.path ? 'active' : ''"
        >
          <div class="tw-ml-4">{{ item.label }}</div>
        </router-link>
        <div class="tw-p-2 tw-ml-4 tw-font-bold tw-text-fullname tw-text-base">
          GIÁO DỤC
        </div>
        <router-link
          v-for="(item, index) in informationList"
          :key="index"
          :to="item.path || `/family/${route.params.id}`"
          class="nav-item tw-text-fullname tw-my-2 tw-p-2"
          :class="route.path === item.path ? 'active' : ''"
        >
          <div class="tw-ml-4">{{ item.label }}</div>
        </router-link>
      </div>
    </q-scroll-area>
  </div>
</template>
<script lang="ts" setup>
import UserAvatar from '@components/common/member/UserAvatar.vue';
import useUserStore from '../../../stores/user';
import { storeToRefs } from 'pinia';

const { getUserChildren, childrenLoading }: any = useUserStore();

const { userProfile, userChildren }: any = storeToRefs(useUserStore());

if (!userChildren.value.length && !childrenLoading) {
  getUserChildren(userProfile.value.id);
}

const user: any = computed(() => {
  if (userChildren.value.length) {
    const data = userChildren.value.filter(
      (item: any) => item.id === route.params.id
    );
    return data[0];
  }
});
console.log(user);
const route = useRoute();

const activityList = [
  {
    label: 'Tổng quan',
    path: `/family/${route.params.id}`,
  },
  {
    label: 'Dòng thời gian',
    path: `/family/${route.params.id}/timeline`,
  },
];

const rulesList = [
  {
    label: 'Giới hạn hàng ngày',
    path: `/family/${route.params.id}/daily-times`,
  },
  {
    label: 'Giới hạn thời gian',
    path: `/family/${route.params.id}/restricted-times`,
  },
  {
    label: 'Kiểm soát duyệt web',
    path: `/family/${route.params.id}/web-filters`,
  },
  {
    label: 'Quản lý vùng',
    path: `/family/${route.params.id}/safe-zone-management`,
  },
  // {
  //   label: 'Trò chơi và ứng dụng',
  //   path: `/family/${route.params.id}/game-apps`,
  // },
  // {
  //   label: 'Youtube',
  //   path: `/family/${route.params.id}/youtube`,
  // },
  // {
  //   label: 'Khẩn cấp',
  //   path: `/family/${route.params.id}/emergency`,
  // },
];

let informationList = [
  {
    label: 'Thông tin',
    path: `/family/${route.params.id}/education`,
  },
];
if (
  user?.value?.support_subject?.length > 0 &&
  user?.value?.date_of_birth > 1000
) {
  informationList.push({
    label: 'Câu hỏi mỗi ngày',
    path: `/family/${route.params.id}/quiz-ai`,
  });
}

const onEditUser = () => {
  console.log('edit');
};
</script>

<style lang="scss" scoped>
.nav-item {
  font-size: 14px;
  border-radius: 4px;
  display: block;

  &:hover {
    text-decoration: none;
    color: #6161ff;
  }
}

.menu-wrapper {
  height: calc(100% - 190px);
}

.active {
  background-color: #6161ff;
  color: #fff;
  font-weight: bold;

  &:hover {
    color: #fff;
  }
}
</style>
