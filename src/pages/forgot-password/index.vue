<template>
  <div v-if="!isVerifyOtp && !isConfirmPassword">
    <div
      @click="goBackSignin"
      class="tw-py-2 tw-cursor-pointer tw-mb-1 tw-text-grey-500 tw-inline-block"
    >
      <q-icon name="chevron_left" class="tw-text-lg"></q-icon>
      <span class="tw-ml-2 tw-text-base tw-align-middle">
        Quay lại đăng nhập
      </span>
    </div>
    <div class="tw-font-bold tw-text-base">Nhập tên đăng nhập</div>
    <FormForgotPassword @onSubmit="onSubmitForgot" />
  </div>
  <div v-if="isVerifyOtp">
    <div
      @click="goBackUsername"
      class="tw-py-2 tw-cursor-pointer tw-mb-1 tw-text-grey-500 tw-inline-block"
    >
      <q-icon name="chevron_left" class="tw-text-lg"></q-icon>
      <span class="tw-ml-2 tw-text-base tw-align-middle"> Quay lại </span>
    </div>
    <div class="tw-font-bold tw-text-base">Nhập mã xác nhận</div>
    <div class="tw-mt-1">
      Mã kích hoạt tài khoản đã được gửi về địa chỉ
      <span class="tw-font-semibold">{{ email }}</span
      >. Vui lòng kiểm tra và nhập để xác nhận tài khoản
    </div>
    <FormOtp @onSubmit="onSubmitOtp" />
  </div>
  <div v-if="isConfirmPassword">
    <div class="tw-font-bold tw-text-base tw-text-center">
      Nhập mật khẩu mới
    </div>
    <div class="tw-mt-1 tw-text-center">
      Vui lòng nhập mật khẩu mới để tiến hành đăng nhập và sử dụng.
    </div>
    <FormConfirmPassword
      :error-submit="errorMessage"
      :loading="loading"
      @onSubmit="onSubmitConfirm"
    />
  </div>
</template>
<script lang="ts" setup>
import FormForgotPassword from '@components/common/form/FormForgotPassword.vue';
import FormOtp from '@components/common/form/FormOtp.vue';
import FormConfirmPassword from '../../components/common/form/FormConfirmPassword.vue';
import authApi from '@api/auth';
import { useQuasar } from 'quasar';
import { authError } from '@/utils/message';

const router = useRouter();
const { confirmForgotPassword } = authApi();
const $q = useQuasar();

const loading = ref<any>(false);
const isVerifyOtp = ref<any>(false);
const isConfirmPassword = ref<any>(false);
const verifyOtp = ref<any>('');
const email = ref<any>('');
const username = ref<any>('');
const errorMessage = ref<any>('');

const onSubmitForgot = (value) => {
  isVerifyOtp.value = true;
  email.value = value.email;
  username.value = value.username;
};

const onSubmitOtp = (value) => {
  verifyOtp.value = value;
  isVerifyOtp.value = false;
  isConfirmPassword.value = true;
};

const onSubmitConfirm = async (value) => {
  loading.value = true;

  try {
    const data: any = await confirmForgotPassword({
      confirmationCode: verifyOtp.value,
      username: username.value,
      newPassword: value,
    });

    if (data) {
      $q.notify({
        color: 'teal',
        message: 'Đổi mật khẩu thành công',
        position: 'top-right',
        icon: 'done',
        timeout: 3000,
      });
      router.push('/login');
    }
  } catch (error: any) {
    loading.value = false;
    errorMessage.value = error?.message ? error.message : authError['Other'];
  }
};

const goBackSignin = () => {
  router.push('/login');
};

const goBackUsername = () => {
  isVerifyOtp.value = false;
};
</script>

<style lang="scss" scoped></style>
