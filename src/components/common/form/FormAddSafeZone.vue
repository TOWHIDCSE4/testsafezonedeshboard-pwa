<template>
  <form @submit.prevent="onSubmitArea">
    <q-card-section>
      <SZInput
        v-model="locationName"
        type="text"
        placeHolder="Nhập tên vùng"
        label="Tên vùng"
        :error-message="locationNameError"
      />
      <div>
        Hướng dẫn lấy tọa độ
        <a
          style="color: #1a61ae; text-decoration: underline"
          href="https://support.google.com/maps/answer/18539?hl=vi&co=GENIE.Platform%3DDesktop"
          target="_blank"
          >tại đây</a
        >
      </div>
      <did class="tw-flex tw-justify-start tw-items-center">
        <SZInput
          v-model="latInput"
          type="number"
          label="Vĩ độ"
          min="-90"
          max="90"
          step="any"
          class="tw-w-1/2 input-hidden-arrows"
          :error-message="latInputError"
        />
        <SZInput
          v-model="longInput"
          type="number"
          label="Kinh độ"
          min="-180"
          max="180"
          step="any"
          class="tw-w-1/2 tw-ml-2 input-hidden-arrows"
          :error-message="longInputError"
        />
      </did>
      <did class="tw-flex tw-justify-start tw-w-1/2 tw-items-center">
        <SZInput
          v-model="radiusInput"
          type="number"
          label="Bán kính"
          min="0"
          max="100000"
          step="0.01"
          class="tw-mr-2 input-hidden-arrows"
          :error-message="radiusInputError"
        />
        <div class="tw-mt-6">m</div>
      </did>
      <did class="tw-flex tw-justify-start tw-items-center">
        <div class="tw-w-1/2">
          <q-toggle label="Thông báo khi vào vùng" v-model="alertIn"></q-toggle>
        </div>
        <div class="tw-w-1/2">
          <q-toggle
            label="Thông báo khi ra khỏi vùng"
            v-model="alertOut"
          ></q-toggle>
        </div>
      </did>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn
        class="tw-bg-[#D3D3D3] tw-text-white tw-w-20"
        flat
        label="Hủy"
        v-close-popup
      />
      <q-btn
        class="tw-bg-primary tw-text-white tw-w-20"
        flat
        :label="dialogType === 'create' ? 'Tạo mới' : 'Lưu'"
        type="submit"
      />
    </q-card-actions>
  </form>
</template>
<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import SZInput from '@/components/common/input/SZInput.vue';
import ActionIcon from '@/components/ui/action-icon/ActionIcon.vue';
const route: any = useRoute();
const options: any = ['Nhà', 'Trường học'];
const props = defineProps({
  dialogType: {
    type: String,
    default: 'create',
  },
  safezoneData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['onSubmitSafeZone']);

const actionList = [
  { name: 'Cho phép', value: 'ALLOW' },
  // { name: "Thông báo", value: "ALERT" },
  { name: 'Chặn', value: 'BLOCK' },
  // { name: "Bỏ qua", value: "IGNORE" },
];

const validationSchema = yup.object({
  locationName: yup.string().required('Vui lòng nhập tên vùng'),
  latInput: yup.number().required('Vui lòng nhập vĩ độ'),
  longInput: yup.number().required('Vui lòng nhập vĩ độ'),
  radiusInput: yup
    .number()
    .required('Vui lòng nhập bán kính')
    .min(0, 'Vui lòng nhập bán kính lớn hơn 0'),
});

const { handleSubmit } = useForm({ validationSchema });

const { value: locationName, errorMessage: locationNameError } =
  useField<string>('locationName');
const { value: latInput, errorMessage: latInputError } =
  useField<number>('latInput');
const { value: longInput, errorMessage: longInputError } =
  useField<number>('longInput');
const { value: radiusInput, errorMessage: radiusInputError } =
  useField<number>('radiusInput');
const { value: alertIn } = useField<boolean>('alertIn');
const { value: alertOut } = useField<boolean>('alertOut');
if (props.safezoneData) {
  locationName.value = props.safezoneData.locationName;
  latInput.value = props.safezoneData.lat;
  longInput.value = props.safezoneData.long;
  radiusInput.value = props.safezoneData.radius;
  alertIn.value = props.safezoneData.enableAlertIn;
  alertOut.value = props.safezoneData.enableAlertOut;
} else {
  radiusInput.value = 100;
  alertIn.value = true;
  alertOut.value = true;
}

const onSubmitArea = handleSubmit(async (values: any) => {
  const dataPost = {
    dialogType: props.dialogType,
    safezoneId: props.safezoneData ? props.safezoneData.id : null,
    childrenId: route.params.id,
    locationName: values.locationName,
    lat: values.latInput,
    long: values.longInput,
    radius: values.radiusInput,
    enableAlertIn: values.alertIn,
    enableAlertOut: values.alertOut,
  };
  emit('onSubmitSafeZone', dataPost);
});
</script>

<style lang="scss" scoped>
::v-deep() {
  .q-item {
    padding: 8px 0px;
  }
}
</style>
