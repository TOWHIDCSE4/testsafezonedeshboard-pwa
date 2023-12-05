<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-card class="children-card lg:tw-mt-4">
    <div v-if="childrenLoading && !userChildren.length" class="card-list">
      <div
        class="tw-grid tw-grid-cols-2 tw-gap-1 sm:tw-grid-cols-4 sm:tw-gap-1 xl:tw-grid-cols-6 xl:tw-gap-1"
      >
        <div
          v-for="(item, index) in 12"
          :key="index"
          class="tw-flex tw-flex-col tw-items-center tw-p-4"
        >
          <q-skeleton type="circle" size="99px" />
          <q-skeleton type="text" class="tw-mt-1" width="60px" />
          <q-skeleton type="text" width="40px" />
        </div>
      </div>
    </div>

    <div
      v-if="!isAddChildren && isNoChildren"
      class="tw-flex tw-items-center tw-flex-col tw-pt-10"
    >
      <EmptyState content="Thêm mới thành viên và bắt đầu sử dụng Safezone!" />
      <q-btn
        class="tw-bg-primary tw-font-bold tw-mt-6 tw-w-52"
        size="md"
        icon="add"
        text-color="white"
        @click="onAddChildren"
      >
        Thêm thành viên
      </q-btn>
    </div>

    <div v-if="!isAddChildren && userChildren.length" class="card-list">
      <div
        class="tw-grid tw-grid-cols-2 tw-gap-1 sm:tw-grid-cols-4 sm:tw-gap-1 xl:tw-grid-cols-6 xl:tw-gap-1"
      >
        <UserAvatar
          v-for="item in userChildren"
          :key="item.id"
          :fullname="item.fullname"
          :status="item.status"
          @on-click="handleClickMember(item.id)"
        />
        <div
          class="tw-cursor-pointer tw-p-4 tw-text-center"
          @click="onAddChildren"
        >
          <q-avatar
            size="99px"
            class="tw-bg-primary-light tw-text-primary"
            icon="add"
          />
          <div class="tw-mt-2 tw-text-primary tw-text-base">
            Thêm thành viên
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isAddChildren && !childrenLoading"
      class="sm:tw-w-1/2 tw-mx-auto tw-p-4"
    >
      <div
        @click="goBackListChildren"
        class="tw-py-2 tw-cursor-pointer tw-text-grey-500 tw-inline-block"
      >
        <q-icon name="chevron_left" class="tw-text-lg"></q-icon>
        <span class="tw-ml-2 tw-text-base tw-align-middle">Quay lại</span>
      </div>
      <form @submit.prevent="onSubmit">
        <SZInput
          v-model="username"
          type="text"
          placeHolder="Nhập tên thành viên"
          label="Tên thành viên"
          :error-message="usernameError"
          @keyup.enter="onSubmit"
        />

        <div>
          <div class="tw-text-sm tw-mb-1">Giới tính</div>
          <q-select
            outlined
            v-model="modelSelect"
            :options="options"
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
</template>
<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import EmptyState from '@components/ui/empty-state/EmptyState.vue';
import { storeToRefs } from 'pinia';
import SZInput from '@/components/common/input/SZInput.vue';
import useUserStore from '@stores/user';
import UserAvatar from '@components/common/member/UserAvatar.vue';
import { authError } from '../utils/message';

const { addUserChildren, getUserChildren }: any = useUserStore();

const { userProfile, userChildren, childrenLoading }: any = storeToRefs(
  useUserStore()
);

const { id } = userProfile.value;
const router = useRouter();

//if (!userChildren.value.length) {
// getUserChildren(id);
//}

const isAddChildren = ref(false);
const addError = ref('');
const loading = ref(false);
const modelSelect = ref({ label: 'Nam', value: 'MALE' });
const options = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
];

const validationSchema = yup.object({
  username: yup.string().required('Vui lòng nhập tên thành viên'),
});

const { handleSubmit } = useForm({ validationSchema });

const { value: username, errorMessage: usernameError } =
  useField<string>('username');

const isNoChildren = computed(() => {
  return !userChildren.value.length && !childrenLoading.value;
});

const goBackListChildren = () => {
  isAddChildren.value = false;
};

const onAddChildren = () => {
  isAddChildren.value = true;
};

const handleClickMember = (childrenId: string) => {
  router.push(`/family/${childrenId}`);
};

const onSubmit = handleSubmit(async (values: any) => {
  loading.value = true;
  const { username } = values;
  const { value } = modelSelect.value;

  try {
    await addUserChildren(id, {
      fullname: username,
      gender: value,
    });
    await getUserChildren(id);
    isAddChildren.value = false;
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
  padding: 16px;
}

.card-list {
  flex-grow: 1;
  overflow: auto;
}
</style>
