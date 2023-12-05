<template>
  <form @submit.prevent="onSubmitPhoneNumber">
    <SZInput
      v-model="newPhoneNumber"
      type="text"
      placeHolder="Nhập SĐT mới"
      label="SĐT mới"
      :error-message="newPhoneNumberError"
      @keyup.enter="onSubmitPhoneNumber"
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

const { changePhoneNumber } = authApi();
const loading = ref(false);
const errorSubmit = ref('');
const emit = defineEmits(['onSubmit']);
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = yup.object({
  newPhoneNumber: yup.string().matches(phoneRegExp, 'SĐT không hợp lệ'),
});

const { handleSubmit } = useForm({ validationSchema });

const { value: newPhoneNumber, errorMessage: newPhoneNumberError } =
  useField<string>('newPhoneNumber');

const onSubmitPhoneNumber = handleSubmit(async (values: any) => {
  loading.value = true;
  const { newPhoneNumber } = values;
  const accessToken = localStorage.getItem('accessToken');

  try {
    const data: any = await changePhoneNumber({
      accessToken,
      newPhoneNumber,
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
