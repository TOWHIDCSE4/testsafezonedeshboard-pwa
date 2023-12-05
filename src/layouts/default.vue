<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-layout view="hHh Lpr lff">
    <div
      class="fullscreen q-drawer__backdrop bg-backdrop"
      aria-hidden="true"
      v-if="drawer || drawerDetail"
      @click="showBackground"
    ></div>
    <q-drawer
      v-model="drawer"
      :width="200"
      :breakpoint="500"
      overlay
      behavior="mobile"
      class="absolute-top"
    >
      <SidebarMenu />
    </q-drawer>
    <q-drawer
      v-model="drawerDetail"
      :width="250"
      :breakpoint="500"
      overlay
      behavior="mobile"
      class="tw-bg-white absolute-top"
      v-if="isDetailPage"
    >
      <SidebarDetailMenu />
    </q-drawer>
    <q-header class="tw-bg-white shadow-2 lg:tw-hidden">
      <q-toolbar>
        <q-btn
          flat
          @click="showBackground"
          round
          dense
          :icon="isDetailPage ? 'arrow_back' : 'menu'"
          text-color="black"
        />
        <q-toolbar-title class="tw-text-text-grey tw-text-base">
          {{ route.name }}
        </q-toolbar-title>
        <q-btn flat round dense class="text-black">
          <q-avatar size="24px" color="teal" text-color="white">{{
            letter
          }}</q-avatar>
          <q-menu :offset="[0, 20]">
            <q-list class="tw-w-48">
              <q-item>
                <q-item-section class="tw-lowercase tw-font-semibold">{{
                  userProfile.username
                }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="onLogOut">
                <q-item-section>
                  <div class="tw-flex tw-items-center">
                    <q-icon name="logout" size="xs" class="tw-mr-2"></q-icon>
                    <div>Đăng xuất</div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <div class="tw-flex tw-min-h-screen">
          <div class="sidebar-menu tw-hidden lg:tw-block">
            <SidebarMenu />
          </div>
          <div
            class="menu-detail tw-hidden lg:tw-block"
            v-if="isMemberDetailPage"
          >
            <SidebarDetailMenu />
          </div>
          <div class="tw-container tw-mx-auto content-wrapper">
            <div
              class="tw-hidden tw-justify-between tw-items-center lg:tw-flex"
            >
              <div class="tw-text-3xl tw-font-bold tw-text-text-grey">
                {{ route.name }}
              </div>
              <q-btn flat class="text-black">
                <div class="tw-flex tw-items-center">
                  <q-item-section
                    class="tw-lowercase tw-font-semibold tw-mr-3 tw-text-base"
                    >{{ userProfile.username }}</q-item-section
                  >
                  <q-avatar size="36px" color="teal" text-color="white">{{
                    letter
                  }}</q-avatar>
                </div>
                <q-menu :offset="[-25, 10]">
                  <q-list class="tw-w-48">
                    <q-item clickable v-close-popup @click="onLogOut">
                      <q-item-section>
                        <div class="tw-flex tw-items-center">
                          <q-icon
                            name="logout"
                            size="xs"
                            class="tw-mr-2"
                          ></q-icon>
                          <div>Đăng xuất</div>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
            <router-view></router-view>
          </div>
        </div>
        <q-page-sticky
          position="bottom-right"
          :offset="[18, 18]"
          class="lg:tw-hidden"
          v-if="isMemberDetailPage"
        >
          <q-fab icon="tune" direction="up" color="secondary">
            <q-fab-action
              @click="onClickSetting"
              external-label
              label-class="tw-text-sm tw-py-1 tw-px-3 tw-bg-primary-light tw-text-primary"
              label-position="left"
              label="Đặt giới hạn"
              color="primary"
              icon="settings"
            />
          </q-fab>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import SidebarMenu from '@components/common/menu/SidebarMenu.vue';
import useUserStore from '@stores/user';
import { firstLetter } from '@/utils/getFirstLetter';
// import useAuthApi from '@api/auth';
import SidebarDetailMenu from '@components/common/menu/SidebarDetailMenu.vue';

interface IUserProfile {
  displayName?: string;
}

// const { logout } = useAuthApi();
const { userProfile, reset }: { userProfile: IUserProfile; reset: any } =
  useUserStore();

const drawer = ref(false);
const drawerDetail = ref(false);

const letter = computed(() => {
  return firstLetter(userProfile?.displayName).toUpperCase();
});

const router = useRouter();
const route = useRoute();

const onLogOut = () => {
  localStorage.clear();
  reset();
  router.push('/login');
};

const isDetailPage = computed(() => {
  return route.params.id ? route.path.includes(`${route.params.id[0]}`) : false;
});

const isMemberDetailPage = computed(() => {
  return route.params.id
    ? route.path.includes(`/family/${route.params.id[0]}`)
    : false;
});

const showBackground = () => {
  if (!isDetailPage.value) {
    drawer.value = !drawer.value;
  } else {
    const path = route.path.split('/');
    router.push(`/${path[1]}`);
  }
};

const onClickSetting = () => {
  drawerDetail.value = !drawerDetail.value;
};
</script>

<style lang="scss" scoped>
.bg-backdrop {
  background-color: rgba(0, 0, 0, 0.4);
}
.content-wrapper {
  padding: 16px;
  max-width: 1024px;

  @media (min-width: 1024px) {
    width: calc(100% - 336px);
  }
}
.sidebar-menu {
  width: 120px;
  height: 100vh;
}
.menu-detail {
  width: 216px;
  background-color: white;
  height: 100vh;
}
</style>
