<template>
  <div class="card-wrapper">
    <div class="sm:tw-flex card-content sm:tw-mt-4">
      <div class="sm:tw-w-2/3 sm:tw-pr-4">
        <q-card class="tw-bg-white tw-rounded-lg timeline-card" flat>
          <div v-if="!isChangePassword && !isChangePhoneNumber" class="tw-p-4">
            <div
              v-if="userSubscriptions?.plan?.name"
              class="tw-text-lg tw-font-semibold tw-text-fullname"
            >
              Safezone - {{ userSubscriptions.plan.name }}
            </div>
            <div
              v-if="userSubscriptions?.plan?.totalDevices"
              class="tw-text-base tw-text-text-grey"
            >
              Bảo vệ {{ userSubscriptions.plan.totalDevices }} thiết bị
            </div>
            <div v-if="endDate" class="tw-text-status-grey tw-mt-1">
              Hạn dùng: {{ endDate ? endDate : 'Vĩnh viễn' }}
            </div>
            <q-btn
              class="tw-bg-success-light tw-text-success tw-mt-3"
              size="sm"
              flat
              no-caps
              @click="onUpgrade"
            >
              Nâng cấp
            </q-btn>
            <div class="tw-mt-4" v-if="!profileLoading">
              <div
                class="tw-border tw-border-grey-100 tw-rounded tw-py-2 tw-px-3 tw-flex tw-items-center"
              >
                <q-icon name="perm_identity" size="24px" color="primary" />
                <div class="tw-ml-3 tw-text-text-grey">
                  {{ userProfile.username }}
                </div>
              </div>
              <div
                class="tw-mt-4 tw-border tw-border-grey-100 tw-rounded tw-py-2 tw-px-3 tw-flex tw-items-center"
              >
                <q-icon name="mail_outline" size="24px" color="primary" />
                <div class="tw-ml-3 tw-text-text-grey">
                  {{ userProfile.email }}
                </div>
              </div>
              <!-- <div
                class="tw-mt-4 tw-border tw-border-grey-100 tw-rounded tw-py-2 tw-px-3 tw-flex tw-items-center"
              >
                <q-icon name="phone" size="24px" color="primary" />
                <div class="tw-ml-3 tw-text-text-grey">
                  {{ userProfile.phoneNumber }}
                </div>
              </div> -->
            </div>

            <!-- <q-btn
              dense
              flat
              color="primary"
              class="tw-font-semibold tw-mt-2 tw-block"
              no-caps
            >
              Chỉnh sửa thông tin
            </q-btn> -->

            <q-btn
              dense
              flat
              color="primary"
              class="tw-font-semibold tw-mt-2"
              no-caps
              @click="onChangePassword"
            >
              Đổi mật khẩu
            </q-btn>

            <!-- <q-btn
              dense
              flat
              color="primary"
              class="tw-font-semibold tw-mt-2"
              no-caps
              @click="onChangePhoneNumber"
            >
              Đổi SĐT
            </q-btn> -->

            <!-- <div class="tw-text-lg tw-font-semibold tw-text-fullname tw-mt-2">
              Thêm người dùng
            </div>
            <div class="tw-text-fullname tw-mt-1">
              Mời thêm thành viên quản lý tài khoản Safezone của bạn.
            </div>
            <SZInput
              v-model="inviteParent"
              type="text"
              placeHolder="Nhập email thành viên"
              label="Địa chỉ email"
            />
            <q-btn
              class="tw-bg-primary tw-font-bold tw-mt-2"
              size="md"
              text-color="white"
              flat
              no-caps
            >
              Xác nhận
            </q-btn> -->
          </div>
          <div v-if="isChangePassword" class="tw-p-4">
            <div
              @click="goBackAccount"
              class="tw-py-2 tw-cursor-pointer tw-mb-1 tw-text-grey-500 tw-inline-block"
            >
              <q-icon name="chevron_left" class="tw-text-lg"></q-icon>
              <span class="tw-ml-2 tw-text-base tw-align-middle">
                Quay lại
              </span>
            </div>
            <div class="tw-font-bold tw-text-base">Đổi mật khẩu</div>
            <div class="tw-mt-1">
              Nhập mật khẩu hiện tại và mật khẩu mới để tiến hành thay đổi mật
              khẩu.
            </div>
            <FormChangePassword @onSubmit="onSubmitChangePassword" />
          </div>
          <div v-if="isChangePhoneNumber" class="tw-p-4">
            <div
              @click="goBackAccount"
              class="tw-py-2 tw-cursor-pointer tw-mb-1 tw-text-grey-500 tw-inline-block"
            >
              <q-icon name="chevron_left" class="tw-text-lg"></q-icon>
              <span class="tw-ml-2 tw-text-base tw-align-middle">
                Quay lại
              </span>
            </div>
            <div class="tw-font-bold tw-text-base">Đổi SĐT</div>
            <div class="tw-mt-1">Nhập SĐT mới để tiến hành thay đổi.</div>
            <FormChangePhoneNumber @onSubmit="onSubmitChangePhoneNumber" />
          </div>
        </q-card>
      </div>
      <div class="sm:tw-w-1/3">
        <!-- <q-card
          v-if="!isChangePassword"
          class="my-card tw-bg-white tw-rounded-sm tw-mt-4 sm:tw-mt-0"
          flat
        >
          <q-card-section class="tw-text-text-grey tw-text-base tw-font-bold">
            Thông báo
          </q-card-section>
          <q-separator class="tw-bg-app-bg" />
          <div class="tw-p-4">
            <ToggleRules
              title="Gửi email báo cáo hàng ngày"
              subtitle="Nhận báo cáo hoạt động hàng ngày qua email"
            >
              <q-toggle
                v-model="dailyEmail"
                color="primary"
                @update:model-value="onToggleRules"
              />
            </ToggleRules>
            <q-separator class="tw-bg-app-bg tw-my-2" />
            <ToggleRules
              title="Gửi email báo cáo tuần"
              subtitle="Nhận báo cáo hoạt động hàng tuần qua email"
            >
              <q-toggle
                v-model="weeklyEmail"
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
import { storeToRefs } from 'pinia';
import { date } from 'quasar';
import useUserStore from '@stores/user';
import SZInput from '@/components/common/input/SZInput.vue';
import FormChangePassword from '@components/common/form/FormChangePassword.vue';
import FormChangePhoneNumber from '@components/common/form/FormChangePhoneNumber.vue';
import { useQuasar } from 'quasar';

const { userProfile, profileLoading, userSubscriptions }: any = storeToRefs(
  useUserStore()
);

const dailyEmail = ref(false);
const weeklyEmail = ref(false);
const isChangePassword = ref(false);
const isChangePhoneNumber = ref(false);
const inviteParent = ref('');
const router = useRouter();
const $q = useQuasar();

const username = computed(() => {
  const name = userProfile.value.displayName.split('@');
  return name[0];
});

const endDate = computed(() => {
  if (!userSubscriptions?.value?.endDate) {
    return null;
  }

  const data = date.formatDate(userSubscriptions.value.endDate, 'DD/MM/YYYY');
  return data;
});

const onChangePassword = () => {
  isChangePassword.value = true;
};

const onChangePhoneNumber = () => {
  isChangePhoneNumber.value = true;
};

const goBackAccount = () => {
  isChangePassword.value = false;
  isChangePhoneNumber.value = false;
};

const onSubmitChangePassword = () => {
  $q.notify({
    color: 'teal',
    message: 'Đổi mật khẩu thành công',
    position: 'top-right',
    icon: 'done',
    timeout: 3000,
  });
  isChangePassword.value = false;
};

const onSubmitChangePhoneNumber = () => {
  $q.notify({
    color: 'teal',
    message: 'Đổi SĐT thành công',
    position: 'top-right',
    icon: 'done',
    timeout: 3000,
  });
  isChangePhoneNumber.value = false;
};

const onToggleRules = (value: any) => {};

const onUpgrade = () => {
  router.push('/plans');
};
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
