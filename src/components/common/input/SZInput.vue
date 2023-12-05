<template>
  <div class="tw-py-2 tw-w-full">
    <div :class="`tw-text-sm tw-text-text-grey tw-mb-1 ${labelClass || ''}`">
      {{ label }}
      <span v-if="isRequire" class="tw-text-primary">*</span>
    </div>
    <div
      class="tw-relative"
      :class="{ 'tw-flex tw-justify-center tw-items-center': close }"
    >
      <input
        :name="name"
        :type="type"
        :maxlength="maxLength"
        class="tw-bg-white tw-rounded tw-px-2 tw-py-2 tw-border tw-border-solid tw-border-grey-300 tw-w-full tw-outline-none"
        :class="{
          'tw-border-primary': hover,
          'border-primary': errorMessage,
          'tw-pl-20': phoneNumber,
          'tw-bg-input-bg tw-text-typo-tertiary': readonly,
        }"
        :value="modelValue"
        :placeholder="placeHolder"
        :readonly="readonly"
        :min="min"
        :max="max"
        :step="step"
        autocomplete="off"
        @keyup="onKeyup"
        @keypress="onKeyPress"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @mouseover="onHover"
        @mouseleave="onLeave"
      />

      <q-icon
        v-if="isPassword"
        class="eyes-icon"
        :name="`${type === 'password' ? 'visibility_off' : 'visibility'}`"
        @click="onToggleEyes"
      >
      </q-icon>
    </div>
    <p
      v-if="errorMessage && errorMessage !== true"
      class="tw-text-typo-quarternary tw-text-xs tw-mt-1"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits([
  'update:modelValue',
  'onToggleEyes',
  'keyup',
  'keypress',
  'focus',
  'blur',
]);

defineProps({
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  name: {
    type: String,
    default: '',
    require: true,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  close: {
    type: Boolean,
    default: false,
  },
  isRequire: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: [String, Boolean],
    default: '',
  },
  isPassword: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: Boolean,
    default: false,
  },
  optional: {
    type: Boolean,
    default: false,
  },
  labelClass: {
    type: String,
    default: '',
  },
  placeHolder: {
    type: String,
    default: '',
  },
  maxLength: {
    type: Number,
    default: 300,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  min: {
    type: String,
    default: '',
  },
  max: {
    type: String,
    default: '',
  },
  step: {
    type: String,
    default: '',
  },
});

const hover = ref(false);

const onKeyup = (e: any) => {
  emit('keyup', e);
};
const onInput = (e: any) => {
  emit('update:modelValue', e.target.value);
};
const onToggleEyes = () => {
  emit('onToggleEyes');
};
const onKeyPress = (e: any) => {
  emit('keypress', e);
};

const onFocus = (e: any) => {
  emit('focus', e);
};

const onBlur = (e: any) => {
  emit('blur', e);
};
const onHover = () => {
  hover.value = true;
};
const onLeave = () => {
  hover.value = false;
};
</script>

<style lang="scss" scoped>
.eyes-icon {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 18px;
}
.border-primary {
  border-color: red;
}

.input-hidden-arrows {
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
}
</style>
