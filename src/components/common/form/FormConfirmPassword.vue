<template>
  <form @submit.prevent="onSubmitPassword">
    <SZInput
      v-model="password"
      :type="inputType"
      placeHolder="Nhập mật khẩu"
      :error-message="passwordError"
      isPassword
      @on-toggle-eyes="onToggleEyes"
      @keyup.enter="onSubmitPassword"
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

defineProps({
  errorSubmit: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['onSubmit']);
const inputType = ref('password');

const validationSchema = yup.object({
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

const { handleSubmit } = useForm({ validationSchema });

const { value: password, errorMessage: passwordError } =
  useField<string>('password');

const onToggleEyes = () => {
  if (inputType.value === 'password') {
    inputType.value = 'text';
  } else {
    inputType.value = 'password';
  }
};

const onSubmitPassword = handleSubmit(async (values: any) => {
  const { password } = values;
  emit('onSubmit', password);
});
</script>
