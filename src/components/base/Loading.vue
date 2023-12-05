<template>
  <div v-if="isLoading" class="loading-container">
    <div class="lds-grit-iot">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useStore from '@stores/root';
import { storeToRefs } from 'pinia';

const { isLoading } = storeToRefs(useStore());
</script>

<style lang="scss" scoped>
.loading-container {
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 9999;
}
.lds-grit-iot {
  position: fixed;
  top: 45%;
  left: calc(50% - 40px);
  width: 80px;
  height: 80px;
}
.lds-grit-iot div {
  display: inline-block;
  position: absolute;
  left: 6px;
  width: 6px;
  background: #fff;
  animation: lds-grit-iot 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds-grit-iot div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}
.lds-grit-iot div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}
.lds-grit-iot div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}
@keyframes lds-grit-iot {
  0% {
    top: 8px;
    height: 64px;
  }
  50%,
  100% {
    top: 24px;
    height: 32px;
  }
}
</style>
