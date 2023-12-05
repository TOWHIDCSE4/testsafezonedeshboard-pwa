<template>
  <q-btn flat round dense class="text-black">
    <q-icon name="more_horiz" color="primary" size="lg" />
    <q-menu self="top end" :offset="[-35, 10]" class="tw-text-text-grey">
      <q-list class="tw-w-48">
        <q-item
          v-if="page !== 'safeZone'"
          clickable
          v-close-popup
          @click="onActionRules('ALLOW', activityId)"
        >
          <q-item-section>
            <div class="tw-flex tw-items-center">
              <div class="tw-bg-secondary-light tw-rounded-sm tw-mr-4 tw-p-1">
                <q-icon name="done" color="positive" size="xs" />
              </div>
              Cho phép
            </div>
          </q-item-section>
        </q-item>
        <!-- <q-item
          v-if="page === 'webFilter' || page === 'domain'"
          clickable
          v-close-popup
          @click="onActionRules('ALERT', activityId)"
        >
          <q-item-section>
            <div class="tw-flex tw-items-center">
              <div class="tw-bg-[#ffedd6] tw-rounded-sm tw-mr-4 tw-p-1">
                <q-icon
                  name="priority_high"
                  class="tw-text-[#ffc054]"
                  size="xs"
                />
              </div>
              Thông báo
            </div>
          </q-item-section>
        </q-item> -->
        <q-item
          v-if="page !== 'safeZone'"
          clickable
          v-close-popup
          @click="onActionRules('BLOCK', activityId)"
        >
          <q-item-section>
            <div class="tw-flex tw-items-center">
              <div class="tw-bg-error-light tw-rounded-sm tw-mr-4 tw-p-1">
                <q-icon name="not_interested" color="negative" size="xs" />
              </div>
              Chặn
            </div>
          </q-item-section>
        </q-item>
        <!-- <q-item
          v-if="page === 'domain'"
          clickable
          v-close-popup
          @click="onActionRules('IGNORE', activityId)"
        >
          <q-item-section>
            <div class="tw-flex tw-items-center">
              <div class="tw-bg-[#f8fafd] tw-rounded-sm tw-mr-4 tw-p-1">
                <q-icon name="close" class="tw-text-[#9b9c9d]" size="xs" />
              </div>
              Bỏ qua
            </div>
          </q-item-section>
        </q-item> -->
        <q-item
          v-if="page === 'domain'"
          clickable
          v-close-popup
          @click="onActionRules('DELETE', activityId)"
        >
          <q-item-section>
            <div class="tw-flex tw-items-center">
              <q-icon
                name="delete_forever"
                class="tw-mr-4"
                color="secondary"
                size="sm"
              />
              Xoá trang web
            </div>
          </q-item-section>
        </q-item>
        <q-item
          v-if="page === 'safeZone'"
          clickable
          v-close-popup
          @click="onActionSafeZone('UPDATE', safezoneId)"
        >
          <q-item-section>
            <div class="tw-flex tw-items-center">
              <q-icon
                name="edit"
                class="tw-mr-4"
                color="secondary"
                size="sm"
              />
              Sửa
            </div>
          </q-item-section>
        </q-item>
        <q-item
          v-if="page === 'safeZone'"
          clickable
          v-close-popup
          @click="onActionSafeZone('DELETE', safezoneId)"
        >
          <q-item-section>
            <div class="tw-flex tw-items-center">
              <q-icon
                name="delete_forever"
                class="tw-mr-4"
                color="secondary"
                size="sm"
              />
              Xóa
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts" setup>
const props = defineProps({
  activityId: {
    type: [Number, String],
    default: '',
  },
  activityName: {
    type: String,
    default: '',
  },
  page: {
    type: String,
    default: '',
  },
  safezoneId: {
    type: [Number, String],
    default: '',
  },
});

const emit = defineEmits(['setRule', 'actionSafeZone']);

const onActionRules = (action: any, id: any) => {
  if (props.activityName) {
    emit('setRule', { action, name: props.activityName, id });
  } else {
    emit('setRule', { action, id });
  }
};

const onActionSafeZone = (action: any, id: any) => {
    emit('actionSafeZone', { action, id });
};
</script>
