<template>
  <div class="tw-text-center">
    <div class="tw-font-bold tw-mt-3">Kích hoạt tài khoản</div>
    <div class="tw-mt-3">
      Mã xác nhận được gửi về thuê bao
      <span class="tw-text-primary">0987022435</span>
    </div>
    <form>
      <div class="tw-mt-2">
        <SZInput type="text" placeHolder="Nhập mã OTP" label="" />
      </div>
      <div class="tw-mt-3">
        Mã OTP hết hạn sau <span class="tw-text-primary">100s</span>
      </div>
      <q-btn
        class="tw-w-full tw-bg-success tw-text-white tw-mt-3"
        type="submit"
        size="md"
      >
        Xác nhận
      </q-btn>
      <div class="tw-text-center tw-mt-3">
        <span>
          Chưa nhận được mã OTP.
          <RouterLink to="/verify/phone" class="tw-text-primary">
            Gửi lại ngay
          </RouterLink>
        </span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import SZInput from '@/components/common/input/SZInput.vue';
</script>
