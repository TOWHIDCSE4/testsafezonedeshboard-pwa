<template>
  <q-card
    class="my-card tw-bg-white tw-rounded-lg lg:tw-w-3/4 sm:tw-mt-4 timeline-card"
    flat
  >
    <q-card-section class="tw-text-text-grey tw-w-full tw-flex tw-items-center">
      <form class="tw-w-full" @submit.prevent="onUpdate">
        <SZInput
          v-model="realName"
          type="text"
          name="real_name"
          placeHolder="Nhập tên"
          label="Tên"
          :error-message="realNameError"
        />
        <div class="tw-mb-1">Ngày sinh</div>
        <q-input
          class="tw-w-2/4"
          outlined
          :dense="false"
          label="YYYY/MM/DD"
          v-model="dateOfBirth"
          mask="date"
          :hide-bottom-space="true"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="datePopupProxyRef">
                <q-date v-model="dateOfBirth" minimal mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <SZInput
          v-model="grade"
          type="text"
          name="grade"
          placeHolder="Nhập lớp"
          label="Lớp"
          :error-message="gradeError"
        />
        <SZInput
          v-model="school"
          type="text"
          name="school"
          placeHolder="Nhập trường"
          label="Trường"
          :error-message="schoolError"
        />
        <SZInput
          v-model="address"
          type="text"
          name="address"
          placeHolder="Nhập địa chỉ"
          label="Địa chỉ nhà"
          :error-message="addressError"
        />
        <div class="tw-mb-1">Môn học cần hỗ trợ</div>
        <q-select
          outlined
          multiple
          use-chips
          clearable
          name="support_subject"
          label="Chọn môn học cần hỗ trợ"
          v-model="supportSubject"
          :options="subjectOptions"
          :dense="false"
          :options-dense="false"
        >
        </q-select>

        <q-btn
          class="tw-w-full tw-bg-primary tw-text-white tw-mt-3"
          type="submit"
          size="md"
        >
          <span v-if="!loading">Cập nhật</span>
          <template v-if="loading">
            <q-spinner-gears class="on-left" />
            Loading...
          </template>
        </q-btn>
      </form>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import useChildrenStore from '../../stores/children';
import SZInput from '@/components/common/input/SZInput.vue';
import ActionIcon from '@/components/ui/action-icon/ActionIcon.vue';
import useUserStore from '../../stores/user';
import childrenApi from '../../api/children';
import { storeToRefs } from 'pinia';
import { date } from 'quasar';
import { useQuasar } from 'quasar';
const loading = ref(false);
const route = useRoute();
const $q = useQuasar();

const { getUserChildren, childrenLoading }: any = useUserStore();
const { userProfile, userChildren }: any = storeToRefs(useUserStore());
let dataUser: any = null;
if (!userChildren.value.length && !childrenLoading) {
  getUserChildren(userProfile.value.id);
}
const data = userChildren.value.filter(
  (item: any) => item.id === route.params.id
);
dataUser = data[0];

const validationSchema = yup.object({
  realName: yup.string(),
  dateOfBirth: yup.string(),
  grade: yup.string(),
  school: yup.string(),
  address: yup.string(),
  supportSubject: yup.string(),
});

const { value: realName, errorMessage: realNameError } =
  useField<string>('realNameInput');
const { value: dateOfBirth, errorMessage: dateOfBirthError } =
  useField<string>('dateOfBirthInput');
const { value: grade, errorMessage: gradeError } =
  useField<string>('classInput');
const { value: school, errorMessage: schoolError } =
  useField<string>('schoolInput');
const { value: address, errorMessage: addressError } =
  useField<string>('addressInput');
const { value: supportSubject, errorMessage: supportSubjectError } =
  useField<any>('supportSubject');

const { getAllSubjectChild }: any = useChildrenStore();
const isLoading = ref<any>(Boolean);
const { subjectEducation }: any = storeToRefs(useChildrenStore());
getAllSubjectChild(userProfile.value.id, route.params.id, 1, 100, '');
const subjectOptions = ref<any>([]);
watch(subjectEducation.value, async (value) => {
  if (value) {
    isLoading.value = value.isLoading;
    const subject = value.data.map((item: any) => {
      return { label: item.title, value: item.id };
    });
    subjectOptions.value = subject;
    if (dataUser && value.data.length > 0) {
      realName.value = dataUser.real_name;
      dateOfBirth.value = dataUser.date_of_birth
        ? date.formatDate(dataUser.date_of_birth, 'YYYY-MM-DD')
        : undefined;
      grade.value = dataUser.grade;
      school.value = dataUser.school;
      address.value = dataUser.address;
      if (dataUser.support_subject && dataUser.support_subject.length > 0) {
        const arraySubject = [];
        dataUser.support_subject.forEach((item: any) => {
          let nameLabelSubject = null;
          subjectOptions.value.forEach((element: any) => {
            if (element.value == item) {
              nameLabelSubject = element.label;
            }
          });
          if (nameLabelSubject) {
            arraySubject.push({ label: nameLabelSubject, value: item });
          }
        });
        if (arraySubject.length > 0) {
          supportSubject.value = arraySubject;
        }
      }
    }
  }
});

const { handleSubmit } = useForm({ validationSchema });

const onUpdate = handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    const { updateEducationInfoChildren } = childrenApi();
    const arraySubject = [];
    if (supportSubject.value && supportSubject.value.length > 0) {
      supportSubject.value.forEach((element: any) => {
        const { value }: any = element;
        arraySubject.push(value);
      });
    }
    const dataPost: any = {
      real_name: realName.value ?? null,
      grade: grade.value ?? null,
      school: school.value ?? null,
      address: address.value ?? null,
      support_subject: arraySubject ?? null,
      date_of_birth: dateOfBirth.value
        ? new Date(dateOfBirth.value).getTime()
        : null,
    };
    const data: any = await updateEducationInfoChildren(
      userProfile.value.id,
      route.params.id,
      dataPost
    );

    if (data.success) {
      loading.value = false;
      getUserChildren(userProfile.value.id);
      $q.notify({
        color: 'teal',
        message: `Cập nhật thành công`,
        position: 'top-right',
        icon: 'done',
        timeout: 3000,
      });
    }
  } catch (error) {
    loading.value = false;
    $q.notify({
      color: 'negative',
      message: error,
      position: 'top-right',
      icon: 'error',
      timeout: 3000,
    });
  }
});
</script>

<style lang="scss" scoped>
::v-deep() {
  .q-item {
    padding: 8px 0px;
  }
}
</style>
