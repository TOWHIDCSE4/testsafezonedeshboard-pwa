<template>
  <div class="card-wrapper">
    <div class="sm:tw-flex card-content sm:tw-mt-4">
      <div class="sm:tw-w-2/3 sm:tw-pr-4">
        <q-card class="tw-bg-white tw-rounded-lg timeline-card" flat>
          <div v-if="!isAddWebsite">
            <q-card-section class="tw-text-text-grey tw-px-4 tw-pb-0">
              <q-tabs
                v-model="tab"
                dense
                align="left"
                class="bg-white"
                indicator-color="transparent"
              >
                <q-tab
                  v-for="(item, index) in filterTabs"
                  :key="index"
                  class="filter-tabs"
                  :ripple="false"
                  :name="item.name"
                  :label="item.label"
                  no-caps
                />
              </q-tabs>
            </q-card-section>
            <div v-show="tab === 'category'" class="category-content">
              <div
                class="tw-flex tw-mt-1 tw-justify-between tw-items-center tw-pl-4"
              >
                <div class="tw-text-text-grey">Lọc trang web</div>
                <div>
                  <q-toggle
                    v-model="webFilter"
                    color="primary"
                    @update:model-value="updateRules"
                  />
                </div>
              </div>
              <q-separator class="tw-bg-app-bg tw-mt-1" />
              <div class="tw-min-h-[300px]" v-if="webFilteringRules.isLoading">
                <q-inner-loading
                  color="black"
                  :showing="webFilteringRules.isLoading"
                />
              </div>
              <div
                class="card-content tw-p-4 tw-relative"
                v-if="!webFilteringRules.isLoading"
              >
                <div>Chọn các danh mục trang web để cài đặt bộ lọc.</div>
                <div class="tw-mt-1">
                  <div class="tw-flex tw-flex-col">
                    <div
                      class="tw-mt-3 tw-flex tw-justify-between tw-text-text-grey"
                      v-for="(item, index) in categoryRules"
                      :key="index"
                      :class="{
                        'tw-order-1': item.action === 'ALLOW',
                        'tw-order-2': item.action === 'ALERT',
                        'tw-order-3': item.action === 'BLOCK',
                      }"
                    >
                      <div class="tw-flex tw-items-center">
                        <ActionIcon :action="item.action" />
                        <div class="tw-text-text-grey tw-text-base">
                          {{ item.name }}
                        </div>
                      </div>
                      <div class="tw-text-right">
                        <ActionMenu
                          page="webFilter"
                          :activity-id="item.categoryId"
                          @set-rule="addRulesWebCategory"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="tab === 'website'" class="category-content">
              <div class="tw-p-4 card-content">
                <div>
                  Chọn lọc các trang web cụ thể. Các quy tắc áp dụng chung với
                  danh mục trang web.
                </div>
                <div
                  class="tw-min-h-[300px]"
                  v-if="webFilteringRules.isLoading"
                >
                  <q-inner-loading
                    color="black"
                    :showing="webFilteringRules.isLoading"
                  />
                </div>
                <div class="tw-flex tw-flex-col">
                  <div
                    v-if="!webFilteringRules.isLoading"
                    class="tw-mt-3 tw-flex tw-justify-between tw-text-text-grey"
                    v-for="(item, index) in domains"
                    :key="index"
                    :class="{
                      'tw-order-1': item.action === 'ALLOW',
                      'tw-order-2': item.action === 'ALERT',
                      'tw-order-3': item.action === 'BLOCK',
                    }"
                  >
                    <div class="tw-flex tw-items-center">
                      <ActionIcon :action="item.action" />
                      <div class="tw-text-text-grey tw-text-base">
                        {{ item.name }}
                      </div>
                    </div>
                    <div class="tw-text-right">
                      <ActionMenu
                        page="domain"
                        :activity-id="item.id"
                        :activity-name="item.name"
                        @set-rule="addRulesWebsite"
                      />
                    </div>
                  </div>
                </div>
                <div class="tw-flex tw-justify-center tw-mt-3">
                  <q-btn
                    class="tw-bg-primary tw-font-bold tw-w-52"
                    size="md"
                    text-color="white"
                    @click="onAddWebsite"
                  >
                    Thêm trang web
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="tw-p-4 card-content">
            <div
              @click="goBackWebsiteList"
              class="tw-py-2 tw-cursor-pointer tw-text-grey-500 tw-inline-block"
            >
              <q-icon name="chevron_left" class="tw-text-lg"></q-icon>
              <span class="tw-ml-2 tw-text-base tw-align-middle">Quay lại</span>
            </div>
            <FormAddWebsite @on-add-website="handleAddWebsite" />
          </div>
        </q-card>
      </div>
      <div class="sm:tw-w-1/3">
        <!-- <q-card
          v-if="!isAddWebsite"
          class="my-card tw-bg-white tw-rounded-sm tw-mt-4 sm:tw-mt-0"
          flat
        >
          <q-card-section class="tw-text-text-grey tw-text-base tw-font-bold">
            Cài đặt
          </q-card-section>
          <q-separator class="tw-bg-app-bg" />
          <div class="tw-p-4">
            <div class="tw-mt-3 tw-w-full" v-if="webFilteringRules.isLoading">
              <q-skeleton width="100px" type="text" />
              <q-skeleton type="text" />
            </div>
            <ToggleRules
              v-if="!webFilteringRules.isLoading"
              title="Chặn trang web không hỗ trợ"
              subtitle="Loại bỏ và ngăn chặn thành viên truy cập nội dung độc hại từ các trang web bị chặn"
            >
              <q-toggle
                v-model="blockUnsupportWeb"
                color="primary"
                @update:model-value="onToggleRules"
              />
            </ToggleRules>
            <q-separator class="tw-bg-app-bg tw-my-2" />
            <div class="tw-mt-3 tw-w-full" v-if="webFilteringRules.isLoading">
              <q-skeleton width="100px" type="text" />
              <q-skeleton type="text" />
            </div>
            <ToggleRules
              v-if="!webFilteringRules.isLoading"
              title="Chặn trang web không xác định"
              subtitle="Ngăn chặn thành viên truy cập nội dung từ các trang web không trong danh mục"
            >
              <q-toggle
                v-model="blockUnknownWeb"
                color="primary"
                @update:model-value="onToggleRules"
              />
            </ToggleRules>
            <q-separator class="tw-bg-app-bg tw-my-2" />
            <div class="tw-mt-3 tw-w-full" v-if="webFilteringRules.isLoading">
              <q-skeleton width="100px" type="text" />
              <q-skeleton type="text" />
            </div>
            <ToggleRules
              v-if="!webFilteringRules.isLoading"
              title="Lọc kết quả tìm kiếm"
              subtitle="Loại bỏ nội dung xấu từ các kết quả tìm kiếm"
            >
              <q-toggle
                v-model="safeSearch"
                color="primary"
                @update:model-value="onToggleRules"
              />
            </ToggleRules>
          </div>
        </q-card>
        <q-card
          v-if="!isAddWebsite"
          class="my-card tw-bg-white tw-rounded-sm tw-mt-6"
          flat
        >
          <q-card-section class="tw-text-text-grey tw-text-base tw-font-bold">
            Thông báo
          </q-card-section>
          <q-separator class="tw-bg-app-bg" />
          <div class="tw-p-4">
            <div class="tw-mt-3 tw-w-full" v-if="webFilteringRules.isLoading">
              <q-skeleton width="100px" type="text" />
              <q-skeleton type="text" />
            </div>
            <ToggleRules
              v-if="!webFilteringRules.isLoading"
              title="Các trang web bị chặn"
              subtitle="Gửi email khi thành viên truy cập vào các trang web bị chặn"
            >
              <q-toggle
                v-model="notifyBlockWeb"
                color="primary"
                @update:model-value="onToggleRules"
              />
            </ToggleRules>
          </div>
        </q-card> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ToggleRules from '@/components/common/toggle/ToggleRules.vue';
import ActionMenu from '@/components/common/menu/ActionMenu.vue';
import ActionIcon from '@/components/ui/action-icon/ActionIcon.vue';
import FormAddWebsite from '@/components/common/form/FormAddWebsite.vue';
import { storeToRefs } from 'pinia';
import childrenApi from '@api/children';
import useChildrenStore from '@stores/children';
import useUserStore from '@stores/user';

const route: any = useRoute();
const { userProfile }: any = useUserStore();

const tab = ref('category');
const webFilter = ref(false);
const blockUnsupportWeb = ref(false);
const blockUnknownWeb = ref(false);
const safeSearch = ref(false);
const notifyBlockWeb = ref(false);
const isAddWebsite = ref(false);
const categories = ref<any>([]);
const domains = ref<any>([]);

const filterTabs = [
  {
    name: 'category',
    label: 'Danh mục',
  },
  {
    name: 'website',
    label: 'Trang web',
  },
];

const { getCategoriesZvelo, getRulesWebFiltering } = useChildrenStore();
const { webCategoriesZvelo, webFilteringRules }: any = storeToRefs(
  useChildrenStore()
);
const { updateRulesWebFiltering } = childrenApi();

getCategoriesZvelo();
getRulesWebFiltering(userProfile.id, route.params.id);

watch(webFilteringRules.value, (value) => {
  categories.value = value.data.categoryRules;
  domains.value = value.data.domainRules;
  webFilter.value = value.data.enabled;
});

const categoryRules = computed(() => {
  const rules = categories.value.map((item: any) => {
    let data = {};
    webCategoriesZvelo.value.categoryRules.forEach((element: any) => {
      if (item.categoryId === element.id) {
        data = {
          categoryId: item.categoryId,
          name: element.name,
          action: item.action,
        };
      }
    });
    return data;
  });
  return rules;
});

const updateRules = async () => {
  const body = {
    enabled: webFilter.value,
    categoryRules: categoryRules.value,
    domainRules: domains.value,
  };

  try {
    await updateRulesWebFiltering(userProfile.id, route.params.id, body);
  } catch (error) {
    console.log(error);
  }
};

const addRulesWebCategory = async ({
  action,
  id,
}: {
  action: any;
  id: any;
}) => {
  const data: any = categories.value.map((item: any) => {
    if (item.categoryId === id) {
      item.action = action;
    }
    return item;
  });

  categories.value = data;
  updateRules();
};

const addRulesWebsite = async ({
  action,
  name,
  id,
}: {
  action: any;
  name: any;
  id: any;
}) => {
  if (action !== 'DELETE') {
    const data: any = domains.value.map((item: any) => {
      if (item.id === id) {
        item.action = action;
      }
      return item;
    });

    domains.value = data;
    updateRules();
  } else {
    const data = domains.value.filter((item: any) => item.name !== name);
    domains.value = data;
    updateRules();
    setTimeout(async () => {
      await getRulesWebFiltering(userProfile.id, route.params.id);
    });
  }
};

const onAddWebsite = () => {
  isAddWebsite.value = true;
};

const goBackWebsiteList = () => {
  isAddWebsite.value = false;
};

const handleAddWebsite = (value: any) => {
  domains.value = [...domains.value, value];
  updateRules();
  setTimeout(async () => {
    await getRulesWebFiltering(userProfile.id, route.params.id);
  });
  isAddWebsite.value = false;
};

const onToggleRules = (value: any) => {};
</script>

<style lang="scss" scoped>
::v-deep() {
  .q-tab {
    border-radius: 8px;
  }
  .q-tab--inactive {
    color: #58595a;

    &:hover {
      border-radius: 8px;
    }
  }
  .q-tab--active {
    background-color: #6161ff;
    color: #fff;
    border-radius: 8px;
  }
}
.filter-tabs {
  width: 100%;
}
.timeline-card {
  @media (min-width: 1024px) {
    max-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
  }
}
.category-content {
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 150px);
  }
}
.card-wrapper {
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 80px);
  }
}
.card-content {
  flex-grow: 1;
  overflow: auto;
}
</style>
