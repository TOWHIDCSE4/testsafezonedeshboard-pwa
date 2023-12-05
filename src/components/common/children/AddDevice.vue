<template>
  <div class="tw-text-center">
    <q-icon name="devices" color="primary" size="72px" />
  </div>
  <div class="tw-mt-4">Loại thiết bị thành viên đang sử dụng?</div>
  <div class="tw-mt-2">
    <q-select
      outlined
      v-model="platformSelect"
      :options="platformOptions"
      :dense="false"
      :options-dense="false"
    >
    </q-select>
  </div>

  <div v-if="platformSelect.value === 'Windows'" class="tw-mt-4">
    <div class="tw-mt-1">
      <span class="tw-text-primary"
        >1 -
        <a :href="windowsClientLink" target="_blank" class="tw-text-text-grey"
          >Tải file cài đặt <br />
          <q-icon name="cloud_download" color="primary" class="tw-mr-1" />
          <span role="button" class="tw-text-primary tw-underline">
            SafezoneForKids.exe</span
          >
        </a>
      </span>
    </div>

    <div class="tw-mt-1">
      <span class="tw-text-primary"
        >2 -
        <span class="tw-text-text-grey"
          >Chọn file <strong>SafezoneForKids.exe</strong> để tiến hành cài
          đặt</span
        >
      </span>
    </div>

    <div class="tw-mt-1">
      <span class="tw-text-primary"
        >3 -
        <span class="tw-text-text-grey"
          >Đăng nhập và làm theo hướng dẫn</span
        ></span
      >
    </div>
  </div>

  <div v-if="platformSelect.value === 'Android'" class="tw-mt-4">
    <div class="tw-mt-1">
      <span
        >1 -
        <span class="tw-text-text-grey"
          >Mở cửa hàng ứng dụng
          <a :href="androidClientLink" target="_blank" class="tw-text-primary"
            >Google Play</a
          >
          trên thiết bị của thành viên</span
        >
      </span>
    </div>

    <div class="tw-mt-1">
      <span class="tw-text-primary"
        >2 -
        <span class="tw-text-text-grey"
          >Tải ứng dụng và đăng nhập <br />
          <strong>Safezone For Kids</strong></span
        >
      </span>
    </div>

    <div class="tw-mt-1">
      <span class="tw-text-primary"
        >3 -
        <span class="tw-text-text-grey"
          >Xác nhận thiết bị bạn muốn bảo vệ và làm theo hướng dẫn</span
        ></span
      >
    </div>
  </div>

  <div v-if="platformSelect.value === 'MacOS'" class="tw-mt-4">
    <div class="tw-mt-1">Tính năng đang phát triển</div>
  </div>

  <div v-if="platformSelect.value === 'iOS'" class="tw-mt-4">
    <div class="tw-mt-1">Tính năng đang phát triển</div>
  </div>
</template>

<script setup lang="ts">
const platformSelect = ref({
  label: 'Chọn hệ điều hành',
  value: 'select',
});
const platformOptions = [
  { label: 'Chọn hệ điều hành', value: 'select', disable: true },
  { label: 'Android', value: 'Android' },
  { label: 'Windows', value: 'Windows' },
  { label: 'MacOS', value: 'MacOS' },
  { label: 'iOS', value: 'iOS' },
];

const windowsClientLink = ref(process.env.VITE_APP_SAFEZONE_WINDOWS_URL);
const androidClientLink = ref(process.env.VITE_APP_SAFEZONE_ANDROID_URL);
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
</style>
