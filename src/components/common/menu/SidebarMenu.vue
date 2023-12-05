<template>
  <div class="tw-h-full tw-bg-secondary tw-relative">
    <div
      class="absolute-top tw-z-10 tw-h-24 tw-flex tw-justify-center tw-items-center tw-bg-secondary"
    >
      <img src="@/assets/images/safezone-logo-icon.png" width="64" />
    </div>
    <q-scroll-area :thumb-style="{ opacity: '0' }" class="fit">
      <div class="tw-mt-20 tw-mb-28 tw-py-1">
        <router-link
          v-for="(item, index) in menuList"
          :key="index"
          :to="item.path || '/family'"
          class="nav-item tw-text-center tw-rounded"
          :class="route.path.includes(item.path) ? 'active' : ''"
        >
          <q-icon
            :name="item.icon"
            :class="
              route.path.includes(item.path)
                ? 'tw-text-secondary'
                : 'tw-text-white'
            "
            size="sm"
          ></q-icon>
          <div class="tw-text-center tw-mt-2">{{ item.label }}</div>
        </router-link>
      </div>
    </q-scroll-area>
    <div
      class="absolute-bottom bg-plans tw-z-10 tw-text-center tw-px-2 tw-py-4"
    >
      <div class="tw-uppercase tw-font-bold tw-text-white tw-text-sm">
        Safezone premium
      </div>
      <q-btn
        class="tw-bg-primary tw-font-bold tw-mt-3"
        size="sm"
        text-color="white"
        @click="goToPlans"
      >
        Nâng cấp
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const menuList = [
  {
    icon: 'home',
    label: 'Gia đình của tôi',
    path: '/family',
  },
  {
    icon: 'devices',
    label: 'Thiết bị',
    path: '/devices',
  },
  {
    icon: 'settings',
    label: 'Tài khoản',
    path: '/account',
  },
];

const goToPlans = () => {
  router.push('/plans');
};
</script>

<style lang="scss" scoped>
.bg-plans {
  background-color: #4da895;
}

.nav-item {
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #fff;
  margin: 12px;
  border-radius: 8px;
  padding: 12px;
  display: block;

  &:hover {
    i {
      color: #3b9e8a;
    }

    text-decoration: none;
    background-color: #fff;
    color: #3b9e8a;
  }
}

.active {
  background-color: #fff;
  color: #3b9e8a;
}
</style>
