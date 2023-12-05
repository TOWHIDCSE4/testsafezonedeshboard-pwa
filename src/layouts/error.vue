<template>
  <div class="tw-flex tw-justify-center tw-items-center tw-h-screen">
    <div class="tw-flex tw-flex-col tw-items-center">
      <img
        src="@/assets/images/error-404.png"
        alt="error"
        width="150"
        height="150"
      />
      <div class="tw-mt-4">
        Không tìm thấy trang <span class="tw-font-bold">{{ route.path }}</span>
      </div>

      <q-btn
        class="tw-bg-primary tw-font-bold tw-mt-6"
        size="md"
        text-color="white"
        @click="router.push('/')"
        >Về trang chủ</q-btn
      >
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorLayout",
});
</script>
<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
</script>
