<template>
  <div class="tw-flex tw-flex-row tw-justify-center">
    <v-otp-input
      ref="otpInput"
      input-classes="otp-input"
      separator="-"
      :num-inputs="6"
      :should-auto-focus="true"
      :is-input-num="true"
      @on-change="handleOnChange"
      @on-complete="handleOnComplete"
    />
  </div>
  <div
    v-if="errorMessage"
    class="tw-text-typo-quarternary tw-text-xs tw-mt-4 tw-text-center"
  >
    {{ errorMessage }}
  </div>
</template>
<script lang="ts" setup>
import VOtpInput from "vue3-otp-input";

const otpInput = ref<any>(null);

defineProps({
  errorMessage: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["onComplete", "onChange"]);

const handleOnComplete = (value: string) => {
  emit("onComplete", value);
};

const handleOnChange = (value: string) => {
  emit("onChange", value);
};
</script>

<style lang="scss" scoped>
::v-deep() {
  .otp-input {
    width: 30px;
    height: 30px;
    padding: 5px;
    margin: 0 8px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    text-align: center;

    @media (min-width: 425px) {
      width: 40px;
      height: 40px;
      margin: 0 10px;
      font-size: 20px;
    }
  }
  /* Background color of an input field with value */
  .otp-input.is-complete {
    background-color: transparent;
  }
  .otp-input::-webkit-inner-spin-button,
  .otp-input::-webkit-outer-spin-button {
    margin: 0;
  }
  input::placeholder {
    font-size: 15px;
    text-align: center;
    font-weight: 600;
  }
}
</style>
