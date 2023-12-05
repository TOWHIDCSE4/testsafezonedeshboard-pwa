<template>
  <q-card
    class="my-card tw-bg-white tw-rounded-lg lg:tw-w-3/4 sm:tw-mt-4 timeline-card"
    flat
  >
    <q-card-section class="tw-text-text-grey lg:tw-w-2/2 tw-mt-3 tw-flex">
      <div
        class="absolute-bottom tw-bg-white tw-z-10 tw-py-3 tw-flex tw-justify-end tw-pr-2"
      >
        <q-btn
          class="tw-bg-primary tw-font-bold tw-w-52"
          size="md"
          icon="add"
          text-color="white"
          @click="toggleDialogArea('create')"
        >
          Thêm Vùng
        </q-btn>
      </div>
    </q-card-section>
    <q-separator class="tw-bg-app-bg" />
    <div v-if="safeZoneData.isLoading" class="tw-p-4">
      <div class="tw-mb-2" v-for="item in 4">
        <div class="tw-flex">
          <q-skeleton width="50px" />
          <div class="tw-ml-3 tw-w-full">
            <q-skeleton type="text" width="100px" />
            <q-skeleton type="text" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="!safeZoneData.isLoading" class="card-content tw-p-4">
      <div class="activity-wrapper">
        <div
          class="tw-mt-4 tw-grid tw-grid-cols-5 tw-items-center tw-text-text-grey"
          v-for="(safeZone, idx) in safeZoneList"
          :key="idx"
        >
          <div class="tw-flex tw-relative tw-items-center">
            <q-icon name="explore" size="32px" class="tw-text-status-grey" />
            <span class="tw-ml-2">
              {{ safeZone.locationName }}
            </span>
          </div>
          <div>Bán kính: {{ safeZone.radius }}m</div>
          <div>
            <span
              ><q-icon name="notifications_active" color="positive" size="xs"
            /></span>
            khi vào vùng:
            <span
              v-if="safeZone.enableAlertIn"
              class="tw-bg-secondary-light tw-rounded-sm tw-p-1"
            >
              <q-icon name="done" color="positive" size="xs" />
            </span>
            <span v-else class="tw-bg-error-light tw-rounded-sm tw-p-1">
              <q-icon name="close" color="negative" size="xs"
            /></span>
          </div>
          <div class="tw-ml-2">
            <span
              ><q-icon name="notifications_active" color="positive" size="xs"
            /></span>
            ra khỏi vùng:
            <span
              v-if="safeZone.enableAlertOut"
              class="tw-bg-secondary-light tw-rounded-sm tw-p-1"
            >
              <q-icon name="done" color="positive" size="xs" />
            </span>
            <span v-else class="tw-bg-error-light tw-rounded-sm tw-p-1">
              <q-icon name="close" color="negative" size="xs"
            /></span>
          </div>
          <div class="tw-text-right">
            <ActionMenu
              page="safeZone"
              :safezone-id="safeZone.id"
              @actionSafeZone="actionSafeZone"
            />
          </div>
        </div>
      </div>
    </div>
  </q-card>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="ruleAreaDialog"
      ruleAreaDialog
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-white tw-p-2 tw-w-2/4">
        <div
          class="row items-center q-pb-none tw-bg-[#3b9e8a]"
          style="margin: -8px"
        >
          <q-space />
          <q-btn
            class="tw-text-white"
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </div>
        <q-card-section class="tw-pb-0">
          <div class="text-h6" v-if="typeDialog === 'create'">Tạo Mới Vùng</div>
          <div class="text-h6" v-else-if="typeDialog === 'update'">
            Sửa Vùng
          </div>
        </q-card-section>
        <FormAddSafeZone
          :dialog-type="typeDialog"
          :safezone-data="safeZoneChoose"
          @on-submit-safeZone="handleActionSafeZone"
        />
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import useChildrenStore from '@stores/children';
import safeZoneApi from '@/api/safezone';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import ActionMenu from '@/components/common/menu/ActionMenu.vue';
import FormAddSafeZone from '@/components/common/form/FormAddSafeZone.vue';

const $q = useQuasar();
const ruleAreaDialog = ref(false);
const typeDialog = ref('create');

const route: any = useRoute();
const { getSafeZoneData }: any = useChildrenStore();
const { getSafeZoneByChild, createSafeZone, updateSafeZone, deleteSafeZone } =
  safeZoneApi();
const { safeZoneData }: any = storeToRefs(useChildrenStore());
const safeZoneList = ref<any>([]);
const safeZoneChoose = ref<any>(null);

getSafeZoneData(route.params.id);

watch(safeZoneData.value, (value) => {
  if (value) {
    safeZoneList.value = value.data;
  }
});

const toggleDialogArea = async (type_dialog: string, value?: any) => {
  safeZoneChoose.value = null;
  typeDialog.value = type_dialog;
  ruleAreaDialog.value = true;
};
const handleActionSafeZone = async (values: any) => {
  try {
    const dataPost = {
      childrenId: route.params.id,
      locationName: values.locationName,
      lat: values.lat,
      long: values.long,
      radius: values.radius,
      enableAlertIn: values.enableAlertIn,
      enableAlertOut: values.enableAlertOut,
    };
    if (values.dialogType === 'create') {
      safeZoneData.isLoading = true;
      const response: any = await createSafeZone(dataPost);
      if (response) {
        safeZoneData.isLoading = false;
        ruleAreaDialog.value = false;
        setTimeout(async () => {
          $q.notify({
            color: 'teal',
            message: `Tạo vùng thành công`,
            position: 'top-right',
            icon: 'done',
            timeout: 3000,
          });
          await getSafeZoneData(route.params.id);
        });
      } else {
        safeZoneData.isLoading = false;
        $q.notify({
          color: 'negative',
          message: 'Có lỗi xảy ra',
          position: 'top-right',
          icon: 'error',
          timeout: 3000,
        });
      }
    } else if (values.dialogType === 'update' && values.safezoneId) {
      safeZoneData.isLoading = true;
      const response: any = await updateSafeZone(values.safezoneId, dataPost);
      if (response) {
        safeZoneData.isLoading = false;
        ruleAreaDialog.value = false;
        setTimeout(async () => {
          $q.notify({
            color: 'teal',
            message: `Lưu vùng thành công`,
            position: 'top-right',
            icon: 'done',
            timeout: 3000,
          });
          await getSafeZoneData(route.params.id);
        });
      } else {
        safeZoneData.isLoading = false;
        $q.notify({
          color: 'negative',
          message: 'Có lỗi xảy ra',
          position: 'top-right',
          icon: 'error',
          timeout: 3000,
        });
      }
    }
  } catch (error: any) {
    $q.notify({
      color: 'negative',
      message: 'Có lỗi xảy ra',
      position: 'top-right',
      icon: 'error',
      timeout: 3000,
    });
  }
};

const actionSafeZone = async ({ action, id }: { action: any; id: any }) => {
  try {
    if (action === 'UPDATE') {
      safeZoneChoose.value = safeZoneList.value.find(
        (element) => element.id == id
      );
      ruleAreaDialog.value = true;
      typeDialog.value = 'update';
    } else if (action === 'DELETE') {
      const data: any = await deleteSafeZone(id);
      if (data.success) {
        $q.notify({
          color: 'teal',
          message: `Xóa vùng thành công`,
          position: 'top-right',
          icon: 'done',
          timeout: 3000,
        });
        ruleAreaDialog.value = false;
        setTimeout(async () => {
          await getSafeZoneData(route.params.id);
        });
      }
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error,
      position: 'top-right',
      icon: 'error',
      timeout: 3000,
    });
  }
};
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
      height: 48px;
    }
  }

  .q-field__marginal {
    height: 48px;
  }

  .q-item {
    &:hover {
      background-color: #f1f1ff;
      color: #6161ff;
    }
  }
}
.card-content {
  flex-grow: 1;
  overflow: auto;
}

.timeline-card {
  @media (min-width: 1024px) {
    max-height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
  }
}

.activity-wrapper {
  margin-top: 16px;

  &:first-child {
    margin-top: 0px;
  }
}
</style>
