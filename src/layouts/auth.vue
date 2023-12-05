<template>
  <div class="tw-container tw-mx-auto">
    <div class="auth-wrapper tw-p-4 xs:tw-px-8 xs:tw-py-6">
      <div class="auth-logo">
        <img src="@/assets/images/safe-zone-logo.png" class="logo" />
      </div>
      <q-card class="tw-mt-8 tw-p-8 tw-hidden sm:tw-block">
        <router-view></router-view>
      </q-card>
      <div class="tw-block tw-mt-6 sm:tw-hidden">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AuthLayout',
});
</script>

<style lang="scss" scoped>
.auth-logo {
  @media (min-width: 480px) {
    display: flex;
    justify-content: center;
  }
}
.logo {
  width: 150px;

  @media (min-width: 480px) {
    width: 350px;
  }
}
.auth-wrapper {
  max-width: 560px;
  margin: 0 auto;
  height: 100vh;
}
</style>
