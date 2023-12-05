<template>
  <div class="children-card lg:tw-mt-4">
    <q-card class="card-list tw-relative">
      <div v-if="devicesLoading && !userDevices.length" class="tw-p-4">
        <div class="tw-grid sm:tw-grid-cols-2 sm:tw-gap-4">
          <div
            v-for="item in 6"
            class="tw-flex tw-items-center tw-mb-3 sm:tw-mb-0"
          >
            <q-skeleton size="80px" />
            <div class="tw-ml-3">
              <q-skeleton type="text" width="150px" />
              <q-skeleton type="text" width="90px" />
              <q-skeleton type="text" width="50px" />
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!isAddDevices && isNoDevices"
        class="tw-flex tw-items-center tw-flex-col tw-py-10"
      >
        <EmptyState content="Thêm mới thiết bị và bắt đầu sử dụng Safezone!" />
        <q-btn
          class="tw-bg-primary tw-font-bold tw-mt-6 tw-w-52"
          size="md"
          icon="add"
          text-color="white"
          @click="onAddDevices"
        >
          Thêm thiết bị
        </q-btn>
      </div>

      <div
        v-if="!isAddDevices && userDevices.length"
        class="tw-pb-16 tw-pt-4 tw-px-4 card-list"
      >
        <div class="tw-grid sm:tw-grid-cols-2 sm:tw-gap-4">
          <div
            v-for="(item, index) in userDevices"
            :key="index"
            class="tw-flex tw-items-center tw-justify-between tw-cursor-pointer tw-py-2 sm:tw-py-0 sm:tw-pr-2"
            @click="handleClickMember(item.id)"
          >
            <div class="tw-flex tw-items-center">
              <div class="tw-bg-secondary-light tw-p-3">
                <q-icon name="devices" size="md" color="secondary"></q-icon>
              </div>
              <div class="tw-ml-4">
                <div class="tw-font-bold tw-text-base tw-text-text-grey">
                  {{ item.name }}
                </div>
                <div>Kết nối với: {{ childrenOfDevice(item.children) }}</div>
                <div>Nền tảng: {{ item.platform }}</div>
              </div>
            </div>
            <q-icon
              name="arrow_forward_ios"
              size="xs"
              color="secondary"
            ></q-icon>
          </div>
        </div>
        <div
          class="absolute-bottom tw-bg-white tw-z-10 tw-py-3 tw-flex tw-justify-center"
        >
          <q-btn
            class="tw-bg-primary tw-font-bold tw-w-52"
            size="md"
            icon="add"
            text-color="white"
            @click="onAddDevices"
          >
            Thêm thiết bị
          </q-btn>
        </div>
      </div>

      <div
        v-if="isAddDevices && !devicesLoading"
        class="sm:tw-w-1/2 tw-mx-auto tw-px-4 tw-py-6"
      >
        <div
          @click="goBackListDevices"
          class="tw-py-2 tw-cursor-pointer tw-text-grey-500 tw-inline-block"
        >
          <q-icon name="chevron_left" class="tw-text-lg"></q-icon>
          <span class="tw-ml-2 tw-text-base tw-align-middle">Quay lại</span>
        </div>
        <AddDevice v-if="!addDevice" />
        <form v-if="addDevice" @submit.prevent="onSubmit">
          <SZInput
            v-model="deviceName"
            type="text"
            placeHolder="Nhập tên thiết bị"
            label="Tên thiết bị"
            :error-message="deviceNameError"
            @keyup.enter="onSubmit"
          />

          <div>
            <div class="tw-text-sm tw-mb-1">Thành viên</div>
            <q-skeleton v-if="childrenLoading" type="QSlider" />
            <q-select
              v-if="!childrenLoading"
              outlined
              v-model="childrenSelect"
              :options="childrenOptions"
              :dense="false"
              :options-dense="false"
            >
            </q-select>
          </div>

          <div class="tw-mt-2">
            <div class="tw-text-sm tw-mb-1">Loại thiết bị</div>
            <q-select
              outlined
              v-model="typeSelect"
              :options="typeOptions"
              :dense="false"
              :options-dense="false"
            >
            </q-select>
          </div>

          <div class="tw-mt-2">
            <div class="tw-text-sm tw-mb-1">Nền tảng thiết bị</div>
            <q-select
              outlined
              v-model="platformSelect"
              :options="platformOptions"
              :dense="false"
              :options-dense="false"
            >
            </q-select>
          </div>

          <div class="tw-text-error tw-text-sm tw-text-center tw-mb-2">
            {{ addError }}
          </div>
          <q-btn
            class="tw-w-full tw-bg-primary tw-font-semibold tw-text-white tw-mt-3"
            :loading="loading"
            :disabled="loading"
            type="submit"
            size="md"
            no-caps
          >
            Thêm mới
            <template v-slot:loading>
              <q-spinner-gears class="on-left" />
              Loading...
            </template>
          </q-btn>
        </form>
      </div>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import EmptyState from '@components/ui/empty-state/EmptyState.vue';
import { storeToRefs } from 'pinia';
import useUserStore from '@stores/user';
import { v4 as uuidv4 } from 'uuid';
import SZInput from '@/components/common/input/SZInput.vue';
import AddDevice from '@components/common/children/AddDevice.vue';
import userApi from '@api/user';
import { authError } from '../../utils/message';

const { getUserDevices, getUserChildren }: any = useUserStore();

const {
  userProfile,
  userDevices,
  userChildren,
  devicesLoading,
  childrenLoading,
}: any = storeToRefs(useUserStore());

const { id } = userProfile.value;
const router = useRouter();
const { addDevices } = userApi();

const childrenSelect = ref<any>({});
const childrenOptions = ref<any>([]);
const isAddDevices = ref(false);
const addError = ref('');
const addDevice = ref(false);
const loading = ref(false);
const typeSelect = ref({ label: 'Smartphone', value: 'SmartPhone' });
const typeOptions = [
  { label: 'Smartphone', value: 'SmartPhone' },
  { label: 'PC', value: 'PC' },
];
const platformSelect = ref({ label: 'iOS', value: 'iOS' });
const platformOptions = [
  { label: 'iOS', value: 'iOS' },
  { label: 'Android', value: 'Android' },
  { label: 'MacOS', value: 'MacOS' },
  { label: 'Windows', value: 'Windows' },
];

const validationSchema = yup.object({
  deviceName: yup.string().required('Vui lòng nhập tên thiết bị'),
});

const { handleSubmit } = useForm({ validationSchema });

const { value: deviceName, errorMessage: deviceNameError } =
  useField<string>('deviceName');

if (!userDevices.value.length) {
  getUserDevices(id);
}

if (!userChildren.value.length) {
  getUserChildren(id);
}

watch(userChildren, (value) => {
  if (value.length) {
    const children = value.map((item: any) => {
      return { label: item.fullname, value: item.id };
    });
    childrenSelect.value = { label: value[0].fullname, value: value[0].id };
    childrenOptions.value = children;
  }
});

const isNoDevices = computed(() => {
  return !userDevices.value.length && !devicesLoading.value;
});

const childrenOfDevice = (children: string[]) => {
  const childrenId = children[0];
  const childrenDevice = userChildren.value.filter(
    (item: any) => item.id === childrenId
  );
  return childrenDevice[0]?.fullname;
};

const goBackListDevices = () => {
  isAddDevices.value = false;
};

const onAddDevices = () => {
  getUserChildren(id);
  isAddDevices.value = true;
};

const handleClickMember = (devicesId: string) => {
  router.push(`/devices/${devicesId}`);
};

const onSubmit = handleSubmit(async (values: any) => {
  loading.value = true;
  const { deviceName } = values;
  const hardwareId = uuidv4();
  const body = {
    childId: childrenSelect.value.value,
    name: deviceName,
    type: typeSelect.value.value,
    platform: platformSelect.value.value,
    hardwareId,
  };

  try {
    await addDevices(id, body);
    await getUserDevices(id);
    isAddDevices.value = false;
    loading.value = false;
  } catch (error: any) {
    loading.value = false;

    if (authError[error.name]) {
      addError.value = authError[error.name];
    } else {
      addError.value = error.message ? error.message : authError['Other'];
    }
  }
});
</script>

<style lang="scss" scoped>
::v-deep() {
  .q-field--outlined {
    .q-field__control {
      color: transparent;

      &:hover {
        &:before {
          border: 1px solid #6161ff;
        }
      }
    }
  }

  .q-field--auto-height .q-field__control,
  .q-field--auto-height .q-field__native {
    min-height: auto;
  }
  .q-field--auto-height {
    .q-field__control {
      height: 40px;
    }
  }

  .q-field__marginal {
    height: 40px;
  }
}
.children-card {
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 100px);
  }
}

.card-list {
  flex-grow: 1;
  overflow: auto;
}

.add-button {
  transform: translate(-50%);
}
</style>
