<template>
  <form @submit.prevent="onSubmitUsername">
    <SZInput
      v-model="username"
      type="text"
      placeHolder="Nhập tên đăng nhập"
      label="Tên đăng nhập"
      :error-message="usernameError"
      @keyup.enter="onSubmitUsername"
    />
    <div v-if="errorSubmit" class="tw-text-error tw-text-sm tw-text-center">
      {{ errorSubmit }}
    </div>
    <q-btn
      class="tw-w-full tw-bg-primary tw-text-white tw-mt-2"
      :loading="loading"
      :disabled="loading"
      type="submit"
      size="md"
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
import authApi from '@api/auth';
import { authError } from '@/utils/message';

const { forgotPassword } = authApi();
const errorSubmit = ref<any>(null);
const loading = ref<any>(false);
const emit = defineEmits(['onSubmit']);

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Vui lòng nhập tên đăng nhập')
    .min(6, 'Tên đăng nhập phải có ít nhất 6 ký tự'),
});

const { handleSubmit } = useForm({ validationSchema });

const { value: username, errorMessage: usernameError } =
  useField<string>('username');

const onSubmitUsername = handleSubmit(async (values: any) => {
  loading.value = true;
  const { username } = values;

  try {
    const data: any = await forgotPassword({
      username,
    });

    if (data) {
      const {
        result: { CodeDeliveryDetails },
      } = data;
      emit('onSubmit', {
        username,
        email: CodeDeliveryDetails.Destination,
      });
    }
  } catch (error: any) {
    loading.value = false;

    if (authError[error.name]) {
      errorSubmit.value = authError[error.name];
    } else {
      errorSubmit.value = error.message ? error.message : authError['Other'];
    }
  }
});
</script>
