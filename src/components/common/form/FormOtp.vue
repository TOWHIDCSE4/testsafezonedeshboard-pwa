<template>
  <form @submit.prevent="onVerifyOtp" class="tw-mt-6">
    <VueOtpInput
      :error-message="otpError"
      @onComplete="handleComplete"
      @onChange="handleChange"
    />
    <div class="tw-text-error tw-text-sm tw-text-center tw-mt-2">
      {{ errorSubmit }}
    </div>
    <q-btn
      class="tw-w-full tw-bg-primary tw-text-white tw-mt-4"
      type="submit"
      size="md"
    >
      Xác nhận
    </q-btn>
  </form>
</template>
<script lang="ts" setup>
import VueOtpInput from '@components/common/vue-otp-input/VueOtpInput.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const errorSubmit = ref<any>(null);
const emit = defineEmits(['onSubmit']);

const validationSchema = yup.object({
  otp: yup
    .string()
    .required('Vui lòng nhập OTP')
    .test({
      message: 'Vui lòng nhập OTP',
      test: (val) => val?.length === 6,
    }),
});

const { handleSubmit } = useForm({ validationSchema });

const { value: otp, errorMessage: otpError } = useField<string>('otp');

const handleComplete = (value: string) => {
  otp.value = value;
};

const handleChange = (value: string) => {
  otp.value = value;
};

const onVerifyOtp = handleSubmit(async (values: any) => {
  const { otp } = values;
  emit('onSubmit', otp);
});
</script>

<style lang="scss" scoped></style>
