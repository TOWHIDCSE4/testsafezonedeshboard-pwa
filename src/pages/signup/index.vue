<template>
  <div v-if="!isOtpInput">
    <div class="tw-font-bold tw-text-md">Đăng ký tài khoản</div>
    <form @submit.prevent="onSignup">
      <div class="tw-mt-2">
        <SZInput
          v-model="username"
          type="text"
          placeHolder="Tên đăng nhập là số và chữ không dấu, viết liền"
          label="Tên đăng nhập"
          :error-message="usernameError"
          @keyup.enter="onSignup"
        />
      </div>
      <SZInput
        v-model="email"
        type="text"
        placeHolder="Nhập email"
        label="Email"
        :error-message="emailError"
        @keyup.enter="onSignup"
      />

      <SZInput
        v-model="password"
        :type="inputType"
        placeHolder="Nhập mật khẩu"
        label="Mật khẩu"
        :error-message="passwordError"
        isPassword
        @on-toggle-eyes="onToggleEyes"
        @keyup.enter="onSignup"
      />

      <div class="tw-text-error tw-text-sm tw-text-center tw-mb-2">
        {{ signupError }}
      </div>
      <q-btn
        class="tw-w-full tw-bg-primary tw-text-white tw-mt-3"
        :loading="loadingSignup"
        :disabled="loadingSignup"
        type="submit"
        size="md"
      >
        Đăng ký
        <template v-slot:loading>
          <q-spinner-gears class="on-left" />
          Loading...
        </template>
      </q-btn>
      <div class="tw-text-center tw-mt-3">
        <span class="tw-text-sm">
          Đã có tài khoản?
          <RouterLink to="/login" class="tw-font-bold tw-text-primary">
            Đăng nhập
          </RouterLink>
        </span>
      </div>
    </form>
  </div>
  <div v-else>
    <div
      @click="goBackSignup"
      class="tw-py-2 tw-cursor-pointer tw-mb-1 tw-text-grey-500 tw-inline-block"
    >
      <q-icon name="chevron_left" class="tw-text-lg"></q-icon>
      <span class="tw-ml-2 tw-text-base tw-align-middle">Quay lại đăng ký</span>
    </div>
    <div class="tw-mt-1">
      Link xác thực tài khoản đã được gửi về địa chỉ email đã đăng ký. Vui lòng
      kiểm tra và hoàn tất quá trình đăng ký
    </div>
    <div class="tw-flex tw-justify-end">
      <button
        class="tw-py-2 tw-text-sm tw-underline tw-mt-2 tw-text-primary"
        :disabled="isDisableResend"
        @click="onResendOtp"
      >
        Gửi lại Link xác thực
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import authApi from '@api/auth';
import SZInput from '@/components/common/input/SZInput.vue';
import VueOtpInput from '@components/common/vue-otp-input/VueOtpInput.vue';
import { useQuasar } from 'quasar';
import { authError } from '@/utils/message';

const { register, verifyAccount, resendVerifyCode } = authApi();
const router = useRouter();
const loadingSignup = ref(false);
const loadingVerify = ref(false);
const inputType = ref('password');
const signupError = ref<any>(null);
const isOtpInput = ref(false);
const isDisableResend = ref(true);
const otpErrorText = ref('');
const $q = useQuasar();

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Vui lòng nhập tên đăng nhập')
    .min(6, 'Tên đăng nhập phải có ít nhất 6 ký tự')
    .matches(/^[A-Za-z0-9_]+$/, 'Vui lòng nhập đúng định dạng tên đăng nhập'),
  step: yup.boolean(),
  otp: yup.string().when('step', {
    is: true,
    then: yup
      .string()
      .test('otp', 'Vui lòng nhập OTP', (val) => val?.length === 6),
  }),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Vui lòng nhập đúng định dạng email'),
  // .matches(
  //   /^[A-Z0-9_]+@[A-Z0-9]+\.[A-Z]{2,}$/i,
  //   'Vui lòng nhập đúng định dạng email'
  // ),
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
const { value: email, errorMessage: emailError } = useField<string>('email');
const { value: otp, errorMessage: otpError } = useField<string>('otp');
const { value: step } = useField<boolean>('step');

const handleComplete = (value: string) => {
  otp.value = value;
};

const handleChange = (value: string) => {
  otp.value = value;
};

const goBackSignup = () => {
  password.value = '';
  email.value = '';
  username.value = '';
  otp.value = '';
  step.value = false;
  isOtpInput.value = false;
  isDisableResend.value = true;
};

const onResendOtp = async () => {
  isDisableResend.value = true;
  try {
    await resendVerifyCode({ username: username.value });

    setTimeout(() => {
      isDisableResend.value = false;
    }, 5000);
  } catch (error) {
    otpErrorText.value = error;
  }
};

const onToggleEyes = () => {
  if (inputType.value === 'password') {
    inputType.value = 'text';
  } else {
    inputType.value = 'password';
  }
};

const onSignup = handleSubmit(async (values: any, errors: any) => {
  const { email, username, password } = values;
  step.value = true;
  loadingSignup.value = true;

  setTimeout(() => {
    isDisableResend.value = false;
  }, 5000);

  try {
    const signupData: any = await register({
      username,
      password,
      email,
    });
    if (signupData) {
      const { success, userConfirmed } = signupData;
      if (success) {
        if (userConfirmed) {
          router.push('/login');
        } else {
          isOtpInput.value = true;
        }

        loadingSignup.value = false;
      }
    }
  } catch (error: any) {
    isOtpInput.value = false;
    loadingSignup.value = false;

    if (authError[error.name]) {
      signupError.value = authError[error.name];
    } else {
      signupError.value = error.message ? error.message : authError['Other'];
    }
    errors.resetForm({
      values: {
        username: username,
        email: email,
        password: password,
      },
    });
  }
});

const onVerifyOtp = handleSubmit(async (values: any) => {
  loadingVerify.value = true;
  const { otp, username } = values;

  try {
    const verifyData: any = await verifyAccount(otp, username);

    if (verifyData.success) {
      $q.notify({
        color: 'teal',
        message: 'Kích hoạt tài khoản thành công',
        position: 'top-right',
        icon: 'done',
        timeout: 3000,
      });
      router.push('/login');
    }
  } catch (error: any) {
    loadingVerify.value = false;

    if (authError[error.name]) {
      otpErrorText.value = authError[error.name];
    } else {
      otpErrorText.value = error.message ? error.message : authError['Other'];
    }
  }
});
</script>
