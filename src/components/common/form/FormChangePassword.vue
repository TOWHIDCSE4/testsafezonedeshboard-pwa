<template>
  <form @submit.prevent="onSubmitPassword">
    <SZInput
      v-model="previousPassword"
      :type="inputTypePrevious"
      placeHolder="Nhập mật khẩu"
      label="Mật khẩu"
      :error-message="previousPasswordError"
      isPassword
      @on-toggle-eyes="onToggleEyesPrevious"
      @keyup.enter="onSubmitPassword"
    />
    <SZInput
      v-model="newPassword"
      :type="inputTypeNew"
      placeHolder="Nhập mật khẩu mới"
      label="Mật khẩu mới"
      :error-message="newPasswordError"
      isPassword
      @on-toggle-eyes="onToggleEyesNew"
      @keyup.enter="onSubmitPassword"
    />
    <div v-if="errorSubmit" class="tw-text-error tw-text-sm tw-text-center">
      {{ errorSubmit }}
    </div>
    <q-btn
      class="tw-w-full tw-bg-primary tw-font-semibold tw-text-white tw-mt-2"
      :loading="loading"
      :disabled="loading"
      type="submit"
      size="md"
      no-caps
    >
      Xác nhận
      <template v-slot:loading>
        <q-spinner-gears class="on-left" />
        Loading...
      </template>
    </q-btn>
  </form>
</template>
<script lang="ts" setup>
import SZInput from '@/components/common/input/SZInput.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { authError } from '@/utils/message';
import authApi from '@api/auth';

const { changePassword } = authApi();
const inputTypePrevious = ref('password');
const inputTypeNew = ref('password');
const loading = ref(false);
const errorSubmit = ref('');
const emit = defineEmits(['onSubmit']);

const validationSchema = yup.object({
  previousPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

const { handleSubmit } = useForm({ validationSchema });

const { value: previousPassword, errorMessage: previousPasswordError } =
  useField<string>('previousPassword');
const { value: newPassword, errorMessage: newPasswordError } =
  useField<string>('newPassword');

const onToggleEyesPrevious = () => {
  if (inputTypePrevious.value === 'password') {
    inputTypePrevious.value = 'text';
  } else {
    inputTypePrevious.value = 'password';
  }
};

const onToggleEyesNew = () => {
  if (inputTypeNew.value === 'password') {
    inputTypeNew.value = 'text';
  } else {
    inputTypeNew.value = 'password';
  }
};

const onSubmitPassword = handleSubmit(async (values: any) => {
  loading.value = true;
  const { previousPassword, newPassword } = values;
  const accessToken = localStorage.getItem('accessToken');

  try {
    const data: any = await changePassword({
      accessToken,
      previousPassword,
      newPassword,
    });

    if (data) {
      emit('onSubmit');
    }
  } catch (error: any) {
    loading.value = false;
    errorSubmit.value = error?.message ? error.message : authError['Other'];
  }
});
</script>
