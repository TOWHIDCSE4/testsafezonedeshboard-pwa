<template>
  <form @submit.prevent="onSubmit">
    <SZInput
      v-model="websiteUrl"
      type="text"
      placeHolder="Nhập đường dẫn"
      label="Website URL"
      :error-message="websiteUrlError"
      @keyup.enter="onSubmit"
    />

    <q-list separator>
      <q-item
        tag="label"
        v-ripple
        v-for="(item, index) in actionList"
        :key="index"
      >
        <q-item-section>
          <q-item-label class="tw-flex tw-items-center">
            <ActionIcon :action="item.value" />
            <div class="tw-font-semibold tw-text-text-grey tw-text-base">
              {{ item.name }}
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-radio v-model="action" :val="item.value" color="primary" />
        </q-item-section>
      </q-item>
    </q-list>

    <div class="tw-text-error tw-text-sm tw-text-center tw-mb-2">
      {{ addError }}
    </div>
    <q-btn
      class="tw-w-full tw-bg-primary tw-text-white tw-mt-3"
      type="submit"
      size="md"
    >
      Thêm mới
      <template v-slot:loading>
        <q-spinner-gears class="on-left" />
        Loading...
      </template>
    </q-btn>
  </form>
</template>
<script lang="ts" setup>
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import SZInput from "@/components/common/input/SZInput.vue";
import ActionIcon from "@/components/ui/action-icon/ActionIcon.vue";

const emit = defineEmits(["onAddWebsite"]);

const actionList = [
  { name: "Cho phép", value: "ALLOW" },
  // { name: "Thông báo", value: "ALERT" },
  { name: "Chặn", value: "BLOCK" },
  // { name: "Bỏ qua", value: "IGNORE" },
];

const addError = ref("");
const action = ref("ALLOW");

const validationSchema = yup.object({
  websiteUrl: yup
    .string()
    .required("Vui lòng nhập đường dẫn")
    .url("Vui lòng nhập đường dẫn hợp lệ"),
});

const { handleSubmit } = useForm({ validationSchema });

const { value: websiteUrl, errorMessage: websiteUrlError } =
  useField<string>("websiteUrl");

const onSubmit = handleSubmit(async (values: any) => {
  const { websiteUrl } = values;
  emit("onAddWebsite", {
    name: websiteUrl,
    action: action.value,
  });
});
</script>

<style lang="scss" scoped>
::v-deep() {
  .q-item {
    padding: 8px 0px;
  }
}
</style>
