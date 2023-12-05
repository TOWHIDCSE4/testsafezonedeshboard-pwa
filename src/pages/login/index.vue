<template>
  <div class="tw-font-bold tw-text-md">Welcome back!</div>
  <form @submit.prevent="onLogin">
    <div class="tw-mt-2">
      <SZInput
        v-model="username"
        type="text"
        placeHolder="Nhập email"
        label="Email"
        :error-message="usernameError"
        @keyup.enter="onLogin"
      />
    </div>

    <SZInput
      v-model="password"
      :type="inputType"
      placeHolder="Nhập mật khẩu"
      label="Mật khẩu"
      :error-message="passwordError"
      isPassword
      @on-toggle-eyes="onToggleEyes"
      @keyup.enter="onLogin"
    />

    <div class="tw-text-error tw-text-sm tw-text-center tw-mb-2">
      {{ loginError }}
    </div>
    <RouterLink
      to="/forgot-password"
      class="tw-font-bold tw-text-sm tw-text-primary"
    >
      Quên mật khẩu?
    </RouterLink>
    <q-btn
      class="tw-w-full tw-bg-primary tw-text-white tw-mt-3"
      :loading="loading"
      :disabled="loading"
      type="submit"
      size="md"
    >
      Đăng nhập
      <template v-slot:loading>
        <q-spinner-gears class="on-left" />
        Loading...
      </template>
    </q-btn>
    <div class="tw-text-center tw-mt-3">
      <span class="tw-text-sm">
        Lần đầu truy cập?
        <RouterLink to="/signup" class="tw-font-bold tw-text-primary">
          Đăng ký
        </RouterLink>
      </span>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { setToken } from '@/plugins/axios';
import authApi from '@api/auth';
import SZInput from '@/components/common/input/SZInput.vue';
import { authError } from '@/utils/message';
import { useQuasar } from 'quasar';

const { login } = authApi();
const router = useRouter();
const loading = ref(false);
const inputType = ref('password');
const loginError = ref<any>(null);
const queryString = window.location.search;

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Vui lòng nhập tên đăng nhập')
    .min(6, 'Tên đăng nhập phải có ít nhất 6 ký tự'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

const { handleSubmit } = useForm({ validationSchema });

const { value: password, errorMessage: passwordError } =
  useField<string>('password');
const { value: username, errorMessage: usernameError } =
  useField<string>('username');

const onToggleEyes = () => {
  if (inputType.value === 'password') {
    inputType.value = 'text';
  } else {
    inputType.value = 'password';
  }
};

const onLogin = handleSubmit(async (values: any) => {
  loading.value = true;
  const { username, password } = values;

  try {
    const loginData: any = await login({
      username,
      password,
    });
    if (loginData.success) {
      const {
        authResult: {
          AuthenticationResult: { IdToken, AccessToken },
        },
      } = loginData;
      localStorage.setItem('access-token', IdToken);
      localStorage.setItem('accessToken', AccessToken);
      setToken(IdToken, loginData.TokenType);
      router.push('/');
    }
  } catch (error: any) {
    loading.value = false;

    if (authError[error.name]) {
      loginError.value = authError[error.name];
    } else {
      loginError.value = error.message ? error.message : authError['Other'];
    }
  }
});

const $q = useQuasar();
const route = useRoute();

// Check API register redirect response
if (route.query?.pl) {
  try {
    const { success, ...rest } = JSON.parse(atob(route.query.pl as string));

    console.log(rest);

    if (!success) {
      $q.notify({
        color: 'negative',
        message:
          'Có lỗi xảy ra. Vui lòng liên hệ support@safezone.com.vn để được hỗ trợ',
        position: 'top-right',
        icon: 'done',
        timeout: 3000,
      });
    } else {
      $q.notify({
        color: 'teal',
        message: 'Bạn đã tạo tài khoản thành công. Xin vui lòng đăng nhập',
      });
    }
  } catch (e) {
    console.error(e);
  } finally {
    // Show notify one time only
    router.push('/login');
  }
}
</script>
